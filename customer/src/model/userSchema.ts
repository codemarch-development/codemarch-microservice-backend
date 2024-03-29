import { Schema , model, Document } from 'mongoose';

interface CodecampsData {
  codecampId: string;
  thumbnail: object;
  title: string;
  description: string;
  completedContent: string[];
  progress: number;
}

interface UserDocument extends Document {
  profileImage: Object;
  name: string ;
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

const userSchema : Schema<UserDocument> = new Schema ({
    
    profileImage :{
        type: Object
    },
    name :{
        type: String
    },
    email :{
        type: String,   
    },
    password :{
        type: String,
        trim:true
    },
    phoneNumber :{
        type: String, 
    },
    bio :{
        type: String,
    },
    codecamps : [{
      codecampId:String,
      thumbnail: Object,
      title: String,
      description: String,
      completedContent:[],
      progress: {
        type: Number,
        default:0
      },
    }],
    socialMediaLinks: {
        instagram: {
          type: String,
        },
        discord: {
          type: String,
        },
        linkedin: {
          type: String,
        },
        twitter: {
          type: String,
        },
        facebook: {
          type: String,
        },
    },
    isBanned :{
      type: Boolean,
    },
    isVerified :{
      type: Boolean
    }
    
},{timestamps:true});

export default model('users',userSchema);