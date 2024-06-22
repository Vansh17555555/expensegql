import mongoose from "mongoose";

// Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["Male", "Female"]
  }
}, { timestamps: true });

// Create User model from schema
const User = mongoose.model("User", userSchema);

export default User;  // Export the User model

// Mock data