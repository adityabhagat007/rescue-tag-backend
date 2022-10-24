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
  link: {
    type: String,
  },
  name: {
    type: String,
  },
  vehicleId: {
    type: String,
  },
  registrationNo: {
    type: String,
  },
  bodyColor: {
    type: String,
  },
  gender: {
    type: String,
  },
  petType: {
    type: String,
  }
});

export default mongoose.model('Tags', tag);