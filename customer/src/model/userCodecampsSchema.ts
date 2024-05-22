import { Schema, model } from 'mongoose';

interface UserCodeCamp {
    userId: Schema.Types.ObjectId;
    codecampId: string;
    title: string;
    description: string;
    thumbnail: object;
    completedContents: string[];
    codeCampProgress: number;
}

const userCodeCampSchema: Schema<UserCodeCamp> = new Schema<UserCodeCamp>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    codecampId: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    thumbnail: {
        type: Object,
        required: true,
    },

    completedContents: [{
        type: String,
    }],

    codeCampProgress: {
        type: Number,
        default: 0, // Initially, no progress
    },
});

export default model('userCodeCamps', userCodeCampSchema);
