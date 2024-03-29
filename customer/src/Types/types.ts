export interface UserProfile {
    _id?: string;
    profileImage?: string;
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    bio?: string;
    socialMediaLinks?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      twitter?: string;
    };
}
  
import { Document } from 'mongoose';

// Define the interface for codecamps data
interface CodecampsData {
    codecampId: string;
    thumbnail: object;
    title: string;
    description: string;
    completedContent: unknown[];
    progress: number;
}

// Define the interface for the user document
export interface UserDocument extends Document {
    profileImage: Object;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    bio: string;
    codecamps: CodecampsData[];
    socialMediaLinks: {
        instagram: string;
        discord: string;
        linkedin: string;
        twitter: string;
        facebook: string;
    };
    isBanned: boolean;
    isVerified: boolean;
}
