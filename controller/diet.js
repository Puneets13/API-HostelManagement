const Hostel = require('../models/Hostel.js');
const Status= require('../models/Status.js');
const User= require('../models/User.js')
const dietRecords = require('../models/diet.js')

const Mess=require('../models/Mess.js');
const Constants= require('../models/Constants.js');

const mongoose = require('mongoose');

module.exports.getleave =async function (req,res){
    try {
        const { rollNumber, hostelName, roomNumber, startDate, endDate } = req.body;
        const currentTime = new Date();
    
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        var hostelUser;
        let entry= await Hostel.findOne({ $or:[{rollNumber1:rollNumber},{rollNumber2:rollNumber}]});


           if(entry==null){
                res.status(200).json({
                    message:"Hostel not registered",
                    err:"1"
                });
            }
        else if(entry.rollNumber1!=null || entry.rollNumber2 != null){
        console.log(entry.rollNumber1+entry.rollNumber2+entry.email1);
            if(rollNumber==entry.rollNumber1){
             hostelUser = {
                userName:entry.userName1,
                email: entry.email1,
                rollNumber:rollNumber,
                roomNumber:roomNumber,
                hostelName:hostelName
            }
            console.log(hostelUser);
        }

        else if(rollNumber==entry.rollNumber2){
             hostelUser = {
                userName:entry.userName2,
                email: entry.email2,
                rollNumber:rollNumber,
                roomNumber:roomNumber,
                hostelName:hostelName
            }
            console.log(hostelUser);
        }
    
      }
      } catch (error) {
        res.status(500).json({ 
            error: 'An error occurred while processing your request' 
        });
      }
}

module.exports.createmonthlydietRecord= function(req,res){
    const { rollNumber, hostelName, roomNumber, startDate, endDate } = req.body;
    
let dietRecords1 =  new dietRecords ({
    _id: new mongoose.Types.ObjectId,
    rollNumber: req.body.rollNumber,
    hostelName: req.body.hostelName,
    roomNumber:req.body.roomNumber,
    month:req.body.month,
    year:req.body.year,


});

dietRecords1.save()
.then(result=>{
    console.log(result);
    res.status(200).json({
        message: dietRecords1,
        success:"true"
    }); 
})
.catch(err=>{
    console.log(err);
    res.status(500).json({
        error: err
    });
});   
}