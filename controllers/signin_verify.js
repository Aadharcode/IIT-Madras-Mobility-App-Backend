const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch');

require('dotenv').config();

const apiKey = process.env.API_KEY;

let OTP , signinUser;
const signinVerify = async (req, res) => {
    try {
      console.log(req.body);
      const { otp, number } = req.body;
      const verifyUrl = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/+91${number}/${otp}`;
      const response = await fetch(verifyUrl);
      const data = await response.json();
      console.log(data)  ;  
      if (data.Status === "Success" && data.Details === "OTP Matched") {
      // if(otp == 123456){
        console.log("OTP verified successfully");
        const token = jwt.sign({ id: user._id }, "passwordKEY");
        res.status(200).json({ token, ...user._doc });
      } else {
        return res.status(400).json({ msg: "Incorrect OTP" });
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  };

module.exports = signinVerify;