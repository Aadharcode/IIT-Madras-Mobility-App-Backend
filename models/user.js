const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    required: false,
    type: String,
    minlength: 2,
    trim: true, 
  },
  category: {
    required: false,
    type: String,
    minlength: 2,
    trim: true, 
  },
  residenceType: {
    required: false,
    type: String,
    minlength: 2,
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