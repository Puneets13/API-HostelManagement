const Status = require('../models/Status.js');
const mongoose = require('mongoose');
const Hostel = require('../models/Hostel.js');

module.exports.proceed= async function (req,res){
    const roomNumber=req.body.roomNumber;
    const email= req.body.email;
    const rollNumber= req.body.rollNumber;
    const hostelName=req.body.hostelName;

    let room_exist = await Hostel.findOne({roomNumber:roomNumber});  // hostel -room =0,1,2
    let email_exist1=await Hostel.findOne({email1:email})
    let roll_exist1=await Hostel.findOne({rollNumber1:rollNumber})
    let email_exist2=await Hostel.findOne({email2:email})
    let roll_exist2=await Hostel.findOne({rollNumber2:rollNumber})
    let room_exist_in_status= await Status.findOne({roomNumber:roomNumber});   // status-room = lock variable

    if(email_exist1||roll_exist1||email_exist2||roll_exist2){
        return res.status(200).json({
            error:"failed",
            message:"user already registered"
        })
    }

    if(!room_exist_in_status ){   //null in status
        const status1 = new Status({
            _id: new mongoose.Types.ObjectId,
            roomNumber:roomNumber,
            hostelName:hostelName,
           status:1  }); // status set to 1
                      
                       status1.save()
                              .then(result => {

                           console.log("null,null");

                                   res.status(200).json({
                                       message: "go",
                                       error: "success"
                                   });
                                   })
                           .catch(err => {
                               console.log(err);
                                   res.status(200).json({
                                       error: "error in saving",
                                       message: "false"
                                   });
                           });


    }
    else if(room_exist_in_status.status=="0" && !room_exist.email2){  
        Status.findOneAndUpdate({ _id: room_exist_in_status.id }, {
            //only update by 2nd user when 1st not in working condition
                    $set: {
                        status:"1",
                    }
                })
                    .then(result1 => {
                        console.log("2nd user gone");
                      
                        res.status(200).json({
                            message: 'go',
                            error:'success'
                        
                             //the result will not be the updated value but the previous value so we created the new user json 
            
                        });
                        })
                        
                    .catch(err => {
                        console.log(err);
                        res.json({
                            error: err,
                            message:"error in saving"
                        });
                    });
    }
    else if(room_exist_in_status.status=="0" && room_exist.email2!=null && room_exist.email1!=null){
        res.status(200).json({
            message: "fully filled",
            error: "failed"
        });
    }
    else {
        //status 1
        res.status(200).json({
            message: "booking in process",
            error: "failed"
        });
    }

}

module.exports.expire= function(req,res){
    let roomNumber=req.body.roomNumber;
    let hostelName= req.body.hostelName;
    let ans = Status.findOne({roomNumber:roomNumber,hostelName:hostelName});

    ans.$set({status:"0"})
    .save().then(result=>{
        res.status(200).json({
            message:"session expire",
            error:"failed"
        })
    })
}


module.exports.getAllRoomStatus = function (req, res) {
    // fetching all the users from the mongoDB database

    Status.find()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message:"successfull",
                hostels: result,// list of status as result
                error: "successfull"
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err,
                message: "false"
            });
        });
};

