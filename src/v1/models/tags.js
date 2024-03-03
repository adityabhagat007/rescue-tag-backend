import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tag = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tagType: {
        type: String,
        required: true
    },
    blocked:{
        type: Boolean,
        default:false
    },
    link: {
        type: String,
    },
    name: {
        type: String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
});

export default mongoose.model('Tags', tag);