import { Schema , model } from 'mongoose';

const userCodeCampSchema : Schema = new Schema ({
    userId :{
        type: String,
        required: true,
    },

    codecampId :{
        type: Schema.Types.ObjectId,
        ref : 'codecamps',
        required: true,
    },

    completedContents: [
        {
          type: String,
        },
    ],
    codeCampProgress: {
        type: Number,
        default: 0, // Initially, no progress
    },
})

export default model('userCodeCamps', userCodeCampSchema);