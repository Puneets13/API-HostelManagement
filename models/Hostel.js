const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    roomNumber: {
        type: String,
    },
    hostelName: {
        type: String,

    },
    userName1:{
        type:String
    },
    email1: {
        type: String
    },
    rollNumber1: {
        type: String,

    },
    phone1: {
        type: String

    },  
    fatherName1: {
        type: String,

    },
    fatherPhone1: {
        type: String,

    },
    address1: {
        type: String,

    },
    year1: {
        type: String,

    },
    branch1: {
        type: String,

    },
    pdf1:{
        type:String
    },
    pdf2:{
        type:String
    },
    userName2:{
        type:String
    },
    email2: {
        type: String
    },
    phone2: {
        type: String

    },  
    fatherName2: {
        type: String,

    },
    fatherPhone2: {
        type: String,

    },
    address2: {
        type: String,

    },
    rollNumber2: {
        type: String,

    },
    year2: {
        type: String,

    },
    branch2: {
        type: String,

    }
},{
    timestamps:true
});

module.exports = mongoose.model('Hostel', hostelSchema);