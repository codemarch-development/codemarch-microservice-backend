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
  description :object;
  videoUrl?: string;
  videoThumbnail?: object;
  section: string;
  type: string;
  videoPlayer: string;
  links:ILink[];
  suggestion: string;
  questions: IComment[];
}

interface ISyllabusItem extends Document {
  title:string;
  description:string;
}

interface ICodecamp extends Document {
  title:string;
  description:string;
  price: number;
  about: string;
  benefits:{}[] ;
  estimatedPrice: number;
  thumbnail: Object;
  tags: string;
  reviews: IReview[];
  syllabusOverview:{title:string, description:string , syllabus:ISyllabusItem[]}[],
  codecampData: ICodecampData[];
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

const syllabusItemSchema = new Schema<ISyllabusItem>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const codecampDataSchema = new Schema<ICodecampData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  section: String,
  description:Object,
  type: String,
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
  estimatedPrice: {
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
  tags:{
    type: String,
  },
  reviews:[reviewSchema],
  syllabusOverview:[{
    title:{
      type:String
    },
    description:{
      type:String
    },
    syllabus:[syllabusItemSchema]
  }],
  codecampData:[codecampDataSchema],
  ratings:{
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  },
  status: {
    type:String,
  }
},
{
  timestamps:true,
})

export default model('codecamps', codecampSchema);