import {Schema,model,Document} from "mongoose";

const tokenSchema: Schema =  new Schema ({
    userId:{
        type:String,
        required:true
    },

    token: {
        type:String,
        required:true
    },

    createdAt:{ type: Date, default: Date.now, index: { expires: '1m' } }
})

export default model('Token',tokenSchema);