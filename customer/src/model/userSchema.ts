import { Schema , model, Document } from 'mongoose';

interface SocialMediaLinks {
  instagram?: string;
  discord?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

interface User {
  profileImage?: object;
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  bio?: string;
  socialMediaLinks?: SocialMediaLinks;
  isVerified?: boolean;
  subscriptionPlan?: 'free' | 'premium' | 'pro';
}

interface UserDocument extends User, Document {}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>({
  profileImage: Object,
  name: String,
  email: String,
  password: {
      type: String,
      trim: true
  },
  phoneNumber: String,
  bio: String,
  socialMediaLinks: {
      instagram: String,
      discord: String,
      linkedin: String,
      twitter: String,
      facebook: String,
  },
  isVerified: {
      type: Boolean,
      default: false
  },
  subscriptionPlan: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
  }
}, { timestamps: true });

export default model('users',userSchema);