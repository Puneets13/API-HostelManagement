const Hostel = require('../models/Hostel.js');
const Status= require('../models/Status.js');
const User= require('../models/User.js')
const Mess=require('../models/Mess.js');
const Constants= require('../models/Constants.js')
const mongoose = require('mongoose');


module.exports.getdailymeal=async function (req,res){
    const roomNumber=req.body.roomNumber;
    const rollNumber= req.body.rollNumber;
    const hostelName=req.body.hostelName;

    let constObject = await Constants.findOne({hostelName:hostelName});
    let deductmoney= constObject.dailyDietCharge;
    
    let person = await Mess.findOne({hostelName:hostelName,rollNumber:rollNumber,roomNumber:roomNumber});
    console.log(person);
    let currentbal=person.currentBalance;
    currentbal=currentbal-deductmoney;
    await person.$set({currentBalance:currentbal})
    .save().then(result=>{
        res.json({
            error:"0",
            message:"success"
        })
    })
        .catch(error => {
            console.log(error);
            res.json({
                error: error,
                message: "not success"
            });
        
    });

}


    module.exports.createMessAccount=async function (req,res){
        const roomNumber=req.body.roomNumber;
        const rollNumber= req.body.rollNumber;
        const hostelName=req.body.hostelName;
    
        let entry= await Hostel.findOne({ $or:[{rollNumber1:rollNumber},{rollNumber2:rollNumber}]});
        if(entry==null){
            res.json({
                message:"cannot access",
                err:"1"
            })
        }
        else{
            let currentobj= await Constants.findOne({hostelName:hostelName});
            console.log(currentobj);
            const money= currentobj.initialAmount;
            console.log(money);
            let newacc= new Mess({
                _id: new mongoose.Types.ObjectId,
                rollNumber:rollNumber,
                roomNumber:roomNumber,
                hostelName:hostelName,
                currentBalance:money
            })

            await newacc.save().then(result=>{
                res.status(200).json({
                    message:"success",
                    error:"0"
                })
            })
            .catch(err=>{
                res.json({
                    message:"failed",
                    error:"1"
                })
            })
        }
    }


