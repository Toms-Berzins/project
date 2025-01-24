import mongoose, { Document } from 'mongoose';

export interface BlogPostDocument extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  date: Date;
  category: string;
  imageUrl: string;
  featured: boolean;
  tags: string[];
  socialMedia: {
    tiktokEmbed?: string;
    instagramEmbed?: string;
    tiktokUsername?: string;
    instagramUsername?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Powder Coating Tips',
      'Project Spotlights',
      'Industry News',
      'Behind the Scenes'
    ]
  },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, default: false },
  tags: [String],
  socialMedia: {
    tiktokEmbed: String,
    instagramEmbed: String,
    tiktokUsername: String,
    instagramUsername: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Add indexes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ date: -1 });
blogPostSchema.index({ featured: 1 });

export const BlogPost = mongoose.model<BlogPostDocument>('BlogPost', blogPostSchema); 