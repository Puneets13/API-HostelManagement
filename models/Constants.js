const mongoose = require('mongoose');

const constantSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    dailyDietCharge: {
        type: Number
    },
    initialAmount: {
        type: Number
    },
    hostelName:{
        type:String,
        unique:true
    },
    messStartDate:{
        type:String
    },
    TotalExpenditurePerMonth:{
        type: Map,
        of: Number
    },
    items:{
        type: Map,
        of: Number
    }
});

module.exports = mongoose.model('Constants', constantSchema);