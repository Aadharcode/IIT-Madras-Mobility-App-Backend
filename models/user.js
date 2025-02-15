const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    //required: true,
    type: String,
    minlength: 2,
    trim: true, 
  },
  category: {
    //required: true,
    type: String,
    minlength: 2,
    trim: true, 
  },
  residentType: {
    //required: true,
    type: String,
    minlength: 2,
    trim: true, 
  },
  gender: {
    type: String,
    minlength: 2,
    trim: true,
  },
  employmentType: {
    type: String,
    minlength: 2,
    trim: true,
  },
  employmentCategory: {
    type: String,
    minlength: 2,
    trim: true,
  },
  childrenDetails: {
    type: String,
    
    trim: true,
  },
  age: {
    type: Number,
    
    trim: true,
  },
  number : {
      required: true,
      type: Number,
      unique: true,
      trim: true, 
      // validate: {
      //   validator: (value) => {
      //     const numberString = value.toString();
      //     if (numberString.length === 12 && numberString.startsWith("91")) {
      //       // Ignore the first two digits (country code) if it's '91'
      //       return /^[0-9]{10}$/.test(numberString.slice(2));
      //     }
      //     // Otherwise, ensure it is exactly 10 digits
      //     return /^[0-9]{10}$/.test(numberString);
      //   },
      //   message: "Please enter a valid 10-digit mobile number",
      // },
  },
}, { versionKey: false });

  const User = mongoose.model("User", userSchema);

  module.exports = User;