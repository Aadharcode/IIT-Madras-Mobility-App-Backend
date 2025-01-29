const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  isAuthenticated: {
    type: Boolean,
    // required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'nonBinary', 'noReveal'],
    // required: true,
  },
  age: {
    type: Number,
    // required: true,
  },
  userCategory: {
    type: String,
    enum: ['student', 'employee', 'parent', 'relative'],
    // required: true,
  },
  residenceType: {
    type: String,
    enum: ['onCampus', 'offCampus'],
    // required: true,
  },
  employmentType: {
    type: String,
    enum: ['permanent', 'contract', 'intern'],
    // required: true,
  },
  employmentCategory: {
    type: String,
    enum: ['technical', 'research', 'admin', 'school', 'other'],
    // required: true,
  },
  childrenDetails: {
    type: [Number],
    default: [],
  },
  error: {
    type: String,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
}, { versionKey: false });

const User = mongoose.model("User", userSchema);

module.exports = User;