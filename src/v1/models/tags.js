import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tag = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tagType: {
        type: String,
        enum:['alert','emergency','other'],
        required: true
    },
    blocked:{
        type: Boolean,
        default:false
    },
    qrLink: {
        type: String,
    },
    link:{
        type:String,
    },
    name: {
        type: String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    notification:{
        type:Boolean,
        default:true
    },
    imageURL:{
        type:String, 
    },
    scans:{
        type:Number,
        default:0
    }
},{timestamps:true});

export default mongoose.model('Tag', tag);