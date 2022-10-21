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
  userName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  expTime: {
    type: Date,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  bod: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
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
