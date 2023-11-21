const Hostel = require('../models/Hostel.js');
const Status= require('../models/Status.js');
const User= require('../models/User.js')
const Mess=require('../models/Mess.js');
const Constants= require('../models/Constants.js')
const mongoose = require('mongoose');


module.exports.setdailymeal=async function (req,res){
   const hostelName= req.body.hostelName;
   const dailyDietCharge= req.body.dailyDietCharge;
    let constantobject = await Constants.findOne({hostelName:hostelName});
    constantobject.$set({dailyDietCharge:dailyDietCharge}).save()
    .then(result=>{
        res.status(200).json({
            error:"0",
            message:"success"
        })
    })
        .catch(err=>{
            res.json({
            error:err,
            message:"not success"
            })
            
        })

}

module.exports.createConstants=async function (req,res){
    const hostelName= req.body.hostelName;
    const initialAmount= req.body.initialAmount;
    const dailyDietCharge= req.body.dailyDietCharge;
    const messStartDate = req.body.messStartDate;
    
    let constantObject2= new Constants({
        _id:new mongoose.Types.ObjectId,
        hostelName:hostelName,
        dailyDietCharge:dailyDietCharge,
        initialAmount:initialAmount,
        messStartDate:messStartDate,
    })

    constantObject2.save().then(result=>{
        console.log(result);
        res.status(200).json({
            message:"success",
           error:"0"
        });
    })
        .catch(error=>{
            res.json({
                error:error,
                message:"not saved"
            })
        });
    
}

    module.exports.deleteCollection=async function (req,res){
        const hostelName= req.body.hostelName;
        try{
            await Constants.deleteMany({hostelName});
            res.status(200).json({
                messsage: 'success',
                error:'success'
            });
            }
            catch(err){
                console.log("not deleted");
                console.log(err);
            }     
           
 }


