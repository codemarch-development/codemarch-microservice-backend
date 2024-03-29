import { Schema , model } from 'mongoose';

const userCourseSchema : Schema = new Schema ({
    userId :{
        type: String,
        required: true,
    },

    courseId :{
        type: Schema.Types.ObjectId,
        ref : 'courses',
        required: true,
    },

    completedContents: [
        {
          type: String,
        },
    ],
    courseProgress: {
        type: Number,
        default: 0, // Initially, no progress
    },
})

export default model('userCourses', userCourseSchema);