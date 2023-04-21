// THIS FILE CONTAINS ONLY THE ROUTES OF VARIOUS REQUESTS

const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/hostel.js');
const Hostel = require('../models/Hostel.js');

router.post('/registerRoom',callbackFunctions.registerRoom);
router.get('/getHostels',callbackFunctions.getAllRooms);
router.get('/searchbyRoom',callbackFunctions.searchbyRoom);
// router.get('/searchbyName',callbackFunctions.searchbyName);


module.exports = router;


// ----------PDF UPLOAD MULTER CODE

// router.post('/update',callbackFunctions.setUserFile);
// const upload = multer({
//     limits:{
//         fileSize:4000000
//     },
//     fileFilter(req,file,cb){
//         // console.log(file.originalname)
//         if(!file.originalname.endsWith('.pdf'))
//         //this will throw an error
//         return cb(new Error('incorrect file foemat'))
//         //file correct no error
//         //true-accept false-not accept
//         cb(undefined,true)
//     }
// })


//  /uploadPdf- route name 
// upload-name used in body

// router.post('/uploadPdf',upload.single('upload'),async(req,res)=>{
//     const userRoll = req.body.userRoll;
//     const rollobj = await Hostel.findOne({rollNumber1:userRoll});
//     const rollobj2 = await Hostel.findOne({rollNumber2:userRoll});


//     if(rollobj!=null){
//         Hostel.findOneAndUpdate({rollNumber1:userRoll},{
//             $set:{pdf2:req.file.buffer}
//         })
//         .then(result=>{
//             res.status(200).json({
//                 messsage: 'user Pdf Updated',
//                 hostel:result,
//                 buffer:req.file.buffer
//                  //the result will not be the updated value but the previous value so we created the new user json 

//             })
//             })
            
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 Error: err
//             });
//         });
//     }
// }),(err,req,res,next)=>{
//     res.status(404).send({error:err})
// }

// ----------PDF UPLOAD MULTER CODE