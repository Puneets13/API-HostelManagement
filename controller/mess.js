const Hostel = require('../models/Hostel.js');
const Status= require('../models/Status.js');
const User= require('../models/User.js')
const Mess=require('../models/Mess.js');
const Constants= require('../models/Constants.js')
const mongoose = require('mongoose');

    module.exports.createMessAccount=async function (req,res){
        const roomNumber=req.body.roomNumber;
        const rollNumber= req.body.rollNumber;
        const hostelName=req.body.hostelName;
        var hostelUser;
        let alreadyexist=await  Mess.findOne({rollNumber:rollNumber});    
        let entry= await Hostel.findOne({ $or:[{rollNumber1:rollNumber},{rollNumber2:rollNumber}]});
// PUNEET SINGH
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

        if(alreadyexist!=null){
            res.json({
                message:"already exist",
                err:"0",
                hostelResponse: hostelUser
            })
        }
        else{
            let currentobj= await Constants.findOne({hostelName:hostelName});
            console.log(currentobj);
            const money= currentobj.initialAmount; // fetched from
            console.log(money);
            let newacc= new Mess({
                _id: new mongoose.Types.ObjectId,
                rollNumber:rollNumber,
                roomNumber:roomNumber,
                hostelName:hostelName,
                currentBalance:money
            });

          
            console.log("hostel user"+hostelUser);
            await newacc.save().then(result=>{
                res.status(200).json({
                    message:"success",
                    error:"0",
                    hostelResponse: hostelUser

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
    }

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

    module.exports.getextrameal=async function (req,res){
        const roomNumber=req.body.roomNumber;
        const rollNumber= req.body.rollNumber;
        const hostelName=req.body.hostelName;
        const enterpaisa= req.body.enterpaisa;
        
        let person = await Mess.findOne({hostelName:hostelName,rollNumber:rollNumber,roomNumber:roomNumber});
        console.log(person);
        let currentbal=person.currentBalance;
        currentbal=currentbal-enterpaisa;
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
