import mongoose from "mongoose";

const { Schema } = mongoose;

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  address: {
    type: String,
  },
  otp: {
    type: String,
  },
  expTime: {
    type: Date,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  state: {
    type: String,
  },
  number: {
    type: String,
  },
  country: {
    type: String,
  },
  gender: {
    type: String,
  },
  bod: {
    type: String,
  },
  bloodType: {
    type: String,
  },
  hideProfile: {
    type: Boolean,
    default: false,
  },
  eyeColor: {
    type: String,
  },
  hairColor: {
    type: String,
  },
  emergencyContacts: [
    {
      name: String,
      relationship: String,
      number: String,
      altNumber: String,
      email: String,
    },
  ],
  myTags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tags",
    },
  ],
});

export default mongoose.model("User", User);