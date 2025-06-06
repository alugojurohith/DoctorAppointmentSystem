import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    default: "Not selected",
  },
  dob: {
    type: String,
    default: "Not selected",
  },
  phone: {
    type: String,  // change to String to handle leading zeros easily
    default: "0000000000",
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
