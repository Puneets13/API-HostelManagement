const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    roomNumber: {
        type: String,
        unique:true,
    },
    status:{
        type:String,
    },
    verified:{
       type:Boolean 
    }
});

module.exports = mongoose.model('Status', statusSchema);