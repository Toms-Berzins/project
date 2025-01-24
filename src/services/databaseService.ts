import mongoose from 'mongoose';
import { FormData, PriceBreakdown } from '../components/quote/types';

const API_URL = "http://localhost:3000";

interface UserDocument extends mongoose.Document {
  email: string;
  password?: string;
  name: string;
  googleId?: string;
  facebookId?: string;
  picture?: string;
  createdAt: Date;
}

interface QuoteDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  formData: FormData;
  priceBreakdown: PriceBreakdown;
  quoteReference: string;
  createdAt: Date;
}

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  googleId: { type: String },
  facebookId: { type: String },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Quote Schema
const quoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  formData: { type: Object, required: true },
  priceBreakdown: { type: Object, required: true },
  quoteReference: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Initialize models
let User: mongoose.Model<UserDocument>;
let Quote: mongoose.Model<QuoteDocument>;

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/bolt');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Initialize models after connection
    try {
      User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
      Quote = mongoose.models.Quote || mongoose.model<QuoteDocument>('Quote', quoteSchema);
    } catch (error) {
      console.error('Model initialization error:', error);
      User = mongoose.model<UserDocument>('User', userSchema);
      Quote = mongoose.model<QuoteDocument>('Quote', quoteSchema);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

// Connect to database immediately
connectDB();

export { User, Quote };

// Database service functions
export const createQuote = async (quoteData: Partial<QuoteDocument>) => {
  await connectDB();
  const quote = new Quote(quoteData);
  return await quote.save();
};

export const getQuoteByReference = async (reference: string) => {
  await connectDB();
  return await Quote.findOne({ quoteReference: reference });
};

export const getUserQuotes = async (userId: string) => {
  await connectDB();
  return await Quote.find({ userId }).sort({ createdAt: -1 });
};

export const createUser = async (userData: Partial<UserDocument>) => {
  await connectDB();
  const user = new User(userData);
  return await user.save();
};

export const findUserByEmail = async (email: string) => {
  await connectDB();
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  await connectDB();
  return await User.findById(id);
};

export { API_URL };

export const saveQuote = async (
  userId: string,
  formData: FormData,
  priceBreakdown: PriceBreakdown
) => {
  const reference = generateQuoteReference();
  
  return await createQuote({
    userId: new mongoose.Types.ObjectId(userId),
    formData: {
      material: formData.material,
      dimensions: formData.dimensions,
      coating: formData.coating,
      color: formData.color,
      quantity: formData.quantity.toString(),
      addons: formData.addons,
      specialRequirements: formData.specialRequirements,
      contact: formData.contact,
    },
    priceBreakdown: {
      base: priceBreakdown.base,
      coating: priceBreakdown.coating,
      finish: priceBreakdown.finish,
      volume: priceBreakdown.volume,
      addons: priceBreakdown.addons,
      total: priceBreakdown.total,
    },
    quoteReference: reference,
  });
};

export const updateQuoteStatus = async (reference: string, status: 'APPROVED' | 'REJECTED' | 'PAID') => {
  await connectDB();
  return await Quote.findOneAndUpdate(
    { quoteReference: reference },
    { status },
    { new: true }
  );
};

// Helper function to generate a unique quote reference
const generateQuoteReference = () => {
  const prefix = 'QT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}; 