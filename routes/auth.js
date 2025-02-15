const express = require("express");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const User = require("../models/user");
const JWTAuthenticator = require("../controllers/auth");
require("dotenv").config();

const authRouter = express.Router();
const apiKey = process.env.API_KEY;
const jwtSecret = process.env.JWT_SECRET; 
const is_prod = process.env.NODE_ENV === 'PRODUCTION';

// Helper function to send OTP
const sendOtp = async (number) => {
  console.log(number);
  if(is_prod){const otpUrl = `https://2factor.in/API/V1/${apiKey}/SMS/+91${number}/AUTOGEN`;
  const response = await fetch(otpUrl);
  const data = await response.json();
  return data;}
  else{
    return {Message:"Application in development mode use development OTP"};
  }
};

// Helper function to verify OTP
const verifyOtp = async (number, otp) => {
  if(is_prod){
    const verifyUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/+91${number}/${otp}`;
    const response = await fetch(verifyUrl);
    const data = await response.json();
    console.log(data)
    return data;
  }
  else{
    if(otp !== "123456") 
      return {Status:"Error",Details:"OTP Mismatch"};
    return {Status:"Success",Details:"OTP Matched"};
  }
};

authRouter.get("/", (req, res) => {
  res.send("Hello from auth");
});

// Signup route
authRouter.post("/login", async (req, res) => {
  console.log(req);
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ msg: "Phone number is required" });
    }

    const data = await sendOtp(number);
    if (data.Status === "Success") {
      return res.status(200).json({ msg: "OTP sent successfully", sessionId: data.Details });
    } else {
      throw new Error("Failed to send OTP");
    }
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Signup OTP verification route
authRouter.post("/login/verify", async (req, res) => {
  try {
    const { otp, number , name } = req.body;
    if (!otp || !number) {
      return res.status(400).json({ msg: "OTP and number are required" });
    }

    const data = await verifyOtp(number, otp);

    if (data.Status === "Success" && data.Details === "OTP Matched") {
    // if(otp == 123456){
      let user = await User.findOne({ number });
      if (!user) {
        user = new User({ number ,name });
        user = await user.save();
      }

      const token = jwt.sign({ id: user._id }, jwtSecret);
      return res.status(200).json({ token, user });
    } else {
      return res.status(400).json({ msg: "Incorrect OTP" });
    }
  } catch (err) {
    console.error("OTP Verification Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all users
authRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (err) {
    console.error("Get Users Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

authRouter.get("/profile", JWTAuthenticator, async (req, res) => {
  try {
    const userId = req.userId; // Extract user ID from token
    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the specific user data
    res.status(200).json(user);
  } catch (err) {
    console.error("Get User Error:", err.message);
    res.status(500).json({ error: err.message });
  }
})

authRouter.post("/directLogin", async (req, res) => {
  try {
    const {number} = req.body;
    const user = await User.find({number: number}); // Find the user by ID

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return the specific user data
    res.status(200).json(user);
  } catch (err) {
    console.error("Get User Error:", err.message);
    res.status(500).json({ error: err.message });
  }
})

authRouter.post("/login/details", JWTAuthenticator, async (req, res) => {
  console.log(req.body);
  try {
    const { category, residenceType,gender,
   
    employmentType,
    employmentCategory,
    childrenDetails,
    age } = req.body;
    const userId =  req.userId; // Extract user ID from the JWT token

    // Validate the inputs
    // if (!category || !residenceType) {
    //   return res.status(400).json({ msg: "Category and residenceType are required" });
    // }

    // Find the user by ID and update their profile
    let user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update the user's profile fields
    user.category = category;
    user.residentType = residenceType;
    user.gender = gender;
    useremploymentType = employmentType;
    user.employmentCategory= employmentCategory;
    user.childrenDetails = childrenDetails;
    user.age = age;

    // Save the updated user data
    user = await user.save();
    console.log(user);
    // Return the updated user profile
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = authRouter;