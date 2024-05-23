import { Schema , model, Document } from 'mongoose';

// Interfaces //

interface IComment extends Document {
  user: string;
  comment: string;
  commentReplies?: IComment[]
}

interface IReview extends Document {
  user: string;
  product:string;
  rating:number;
  comments:string
  commentReplies: IComment[]
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICodeBlock extends Document {
  code: string;
}

interface ICodecampData extends Document {
  title: string;
  document:object;
  videoUrl?: string;
  videoThumbnail?: object;
  section: string;
  type: string;
  isPreview?: string;
  videoPlayer: string;
  links:ILink[];
  suggestion: string;
  questions: IComment[];
}


interface ICodecamp extends Document {
  title:string;
  description:string;
  price: number;
  about: string;
  benefits:{}[] ;
  estimated_price: number;
  thumbnail: Object;
  tags: string;
  reviews: IReview[];
  codecamp_data: ICodecampData[];
  category: string;
  ratings?: number;
  purchased?: number;
  status?: string;
}

const reviewSchema = new Schema<IReview>({
  user: String,
  rating: {
    type:Number,
    default:0
  },
  comments:String,
});

const LinkSchema = new Schema<ILink>({
  title: String,
  url: String
})

const commentSchema = new Schema<IComment>({
  user: String,
  comment: String,
  commentReplies: [Object]
})


const codecampDataSchema = new Schema<ICodecampData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  section: String,
  document:Object,
  type: String,
  isPreview: String,
  videoPlayer: String,
  links:[LinkSchema],
  suggestion: String,
  questions: [commentSchema]
})
  



const codecampSchema = new Schema<ICodecamp>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  about:{
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default:0
  },
  estimated_price: {
    type: Number,
  },
  thumbnail: {
    type: Object,
    required: true,
  },
  benefits:[{
    type:String,
    required:true
  }],

  reviews:[reviewSchema],
  codecamp_data:[codecampDataSchema],
  ratings:{
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['free', 'subscription', 'paid'],
    default: 'free' // You can set a default value if needed
  },
  status: {
    type:String,
  }
},
{
  timestamps:true,
})

export default model('codecamps', codecampSchema);