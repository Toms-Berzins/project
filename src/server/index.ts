import express, { Request, Response, RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import session from 'express-session';

// Extend Express types using module augmentation
declare module 'express-serve-static-core' {
  type User = UserDocument;
}

dotenv.config();

const app = express();
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/powder_coating_quotes')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

interface UserDocument extends Document {
  _id: string;
  googleId?: string;
  facebookId?: string;
  email: string;
  name: string;
  picture?: string;
  password?: string;
  role: string;
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  googleId: { type: String },
  facebookId: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model<UserDocument>('User', userSchema);

// Passport serialization
passport.serializeUser((user: Express.User, done) => {
  const userDoc = user as UserDocument;
  done(null, userDoc.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "/api/auth/google/callback"
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'picture']
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      
      if (!user) {
        user = await User.create({
          facebookId: profile.id,
          email: profile.emails?.[0]?.value,
          name: `${profile.name?.givenName} ${profile.name?.familyName}`,
          picture: profile.photos?.[0]?.value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// Auth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const token = jwt.sign(
      { userId: (req.user as UserDocument)._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?token=${token}`);
  }
);

app.get('/api/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const token = jwt.sign(
      { userId: (req.user as UserDocument)._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?token=${token}`);
  }
);

// Quote Schema
const quoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  formData: { type: Object, required: true },
  priceBreakdown: { type: Object, required: true },
  quoteReference: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Quote = mongoose.model('Quote', quoteSchema);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { formData, priceBreakdown, quoteReference } = req.body;
    
    const emailContent = `
      <h2>Quote Request Confirmation - Reference #${quoteReference}</h2>
      <h3>Selected Options:</h3>
      <ul>
        <li>Material: ${formData.material}</li>
        <li>Dimensions: ${formData.dimensions.length}x${formData.dimensions.width}x${formData.dimensions.height} ${formData.dimensions.unit}</li>
        <li>Coating: ${formData.coating.type} - ${formData.coating.finish}</li>
        <li>Color: ${formData.color.type}${formData.color.custom ? ` (${formData.color.custom})` : ''}</li>
        <li>Quantity: ${formData.quantity}</li>
      </ul>

      <h3>Price Breakdown:</h3>
      <ul>
        <li>Base Price: $${priceBreakdown.base.toFixed(2)}</li>
        <li>Coating: $${priceBreakdown.coating.toFixed(2)}</li>
        <li>Finish: $${priceBreakdown.finish.toFixed(2)}</li>
        <li>Volume Adjustment: $${priceBreakdown.volume.toFixed(2)}</li>
        <li>Add-ons: $${priceBreakdown.addons.toFixed(2)}</li>
        <li><strong>Total: $${priceBreakdown.total.toFixed(2)}</strong></li>
      </ul>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: formData.contact.email,
      subject: `Quote Request Confirmation #${quoteReference}`,
      html: emailContent,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/auth/signup', (async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user' // Add default role
    });

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}) as RequestHandler);

app.post('/api/auth/login', (async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !user.password) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}) as RequestHandler);

// Add authentication middleware
const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  interface JWTPayload {
    userId: string;
    role: string;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as JWTPayload;
    req.user = { _id: decoded.userId, role: decoded.role } as UserDocument;
    next();
  } catch (err: unknown) {
    res.status(403).json({ error: err instanceof Error ? err.message : 'Invalid or expired token' });
    return;
  }
};

// Add route to save quote - now with authentication
app.post('/api/quotes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { formData, priceBreakdown, quoteReference } = req.body;
    const userId = (req.user as UserDocument)._id;

    const quote = await Quote.create({
      userId,
      formData,
      priceBreakdown,
      quoteReference
    });

    res.json({ success: true, quote });
  } catch (error) {
    console.error('Quote creation error:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 