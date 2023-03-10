const mongoose = require('mongoose');
const UserOTPVerificationSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
    },
    otp:{
        type:String
    },
    createdAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
});
const UserOTPVerification=mongoose.model(
    "UserOTPVerification",
    UserOTPVerificationSchema
);
module.exports=UserOTPVerification