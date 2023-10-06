const mongoose = require('mongoose');
const messSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    rollNumber: {
        type: String,
        unique:true,
    },
    roomNumber:{
        type:String,
    },
    hostelName:{
       type:String, 
    },
    currentBalance:{
        type:Number,
    }
    
});

module.exports = mongoose.model('Mess', messSchema);