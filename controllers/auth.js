const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWTAuthenticator = (req,res,next) => {
    const token = req.header("Authorization")?.replace("Bearer ","");
    console.log(token);
    if(!token){
        console.log("check");
        return res.status(401).json({message:"Authorization token is required"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch(err){
        return res.status(401).json({message:err.message});
    }
};

module.exports = JWTAuthenticator;