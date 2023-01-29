const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
    },
    avatar:{
        type:String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true

    },  
    phone: {
        type: String,

    },
    address: {
        type: String,

    },
    rollNumber: {
        type: String,

    },
    year: {
        type: String,

    },
    roomNumber: {
        type: String,

    },
    branch: {
        type: String,

    },
    hostelName: {
        type: String,

    },
    verified:{
       type:Boolean 
    }
});

module.exports = mongoose.model('User', userSchema);