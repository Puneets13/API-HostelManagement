const Hostel = require('../models/Hostel.js');
const Status= require('../models/Status.js');
const User= require('../models/User.js')
const Mess=require('../models/Mess.js');
const Constants= require('../models/Constants.js')
const mongoose = require('mongoose');
const moment = require('moment');


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


 module.exports.updateExtraList= async function(req,res){
    const itemNamer= req.body.itemName;
    const itemName= itemNamer.toUpperCase();
    const itemPrice= req.body.itemPrice;
    const hostelName= req.body.hostelName;

    const newEntry={
        itemName:itemPrice
    };
    try{
        const constRecord = await Constants.findOne({ hostelName: hostelName});
               
        if(constRecord.items){
            constRecord.items.set(itemName,itemPrice);
              // Save the updated hostel document
              await constRecord.save();
                console.log('Hostel document updated:', constRecord);
                res.json({
                    message: "success",
                    error: "0"
                })
              
             
        }
        else {
            const extraMap = new Map();
            extraMap.set(itemName, itemPrice);
            console.log(extraMap);

// Update the document with the new map
Constants.findOneAndUpdate({hostelName:hostelName}, {$set:{ items: extraMap }}, { new: true }, (err, updatedHostel) => {
  if (err) {
    console.error('Error updating hostel document:', err);
    return;
  }
  console.log('Hostel document updated:', updatedHostel);
  res.json({
    message: "success",
    error: "0"
  })
});
        }
    }
    catch(error){
        res.json({
            msg:"not done"
          })
    }
    
 }

 module.exports.deleteExtraListEntry= async function(req,res){
    const itemNamer= req.body.itemName;
    const itemName= itemNamer.toUpperCase();
    const hostelName= req.body.hostelName;

    const constRecord = await Constants.findOne({ hostelName: hostelName});


  // Check if the key exists in the map
  if (constRecord.items.has(itemName)) {
    // Delete the entry from the map
    constRecord.items.delete(itemName);
    constRecord.save();
    console.log('Hostel document updated:', constRecord);
                res.json({
                    message: "success",
                    error: "0"
                })
  } else {
    res.json({
        message: "failed",
        error: "1"
    })
  }
    
 }

 module.exports.deleteExtraList= async function(req,res){
    const hostelName= req.body.hostelName;

    const constRecord = await Constants.findOne({ hostelName: hostelName});
    if(constRecord.items){
        constRecord.items=undefined;
        constRecord.save()
    console.log('Hostel document updated:', constRecord);
        res.json({
            message: "success",
            error: "0"
        })
    }else{
        res.json({
            message: "no list found",
            error: "0"
        })
    }

  
  }

  module.exports.updateExtraListEntry= async function(req,res){
    const prevItemName= req.body.prevItemName.toUpperCase();
    const prevItemPrice= req.body.prevItemPrice;
    const hostelName= req.body.hostelName;
    const itemName= req.body.itemName;
    const itemPrice= req.body.itemPrice;

    //samoa : 110  -> samosa
                    //   80
                    //   dono
    // const constRecord = await Constants.findOne({ hostelName: hostelName});
    // if(itemName){
    //     constRecord.items.prevItemName=itemName;
    //     if(itemPrice)
    //     constRecord.items.prevItemPrice=itemPrice;

    //     constRecord.save()
    // console.log('Hostel document updated:', constRecord);
    //     res.json({
    //         message: "success",
    //         error: "0"
    //     })
    // }else{
    //     res.json({
    //         message: "no list found",
    //         error: "0"
    //     })
    // }

  
  }
    




