// DATABASE NAME = userLoginSystem
// Cluster0

const express = require('express');
const bodyparser=require('body-parser');
const userRouter = require( './routes/user.js');
const userRouter2 = require( './routes/hostel.js');
const userRouter3= require('./routes/status.js');
const userRouter4= require('./routes/mess.js');
const userRouter5 = require("./routes/constants.js");
const userRouter6 = require("./routes/diet.js");

const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');  //for verifying the login button we include jsonwebtoken
const fileupload = require('express-fileupload') //for uploading file on cloudinary (IMAGES UPLOADING)
// const GridFsStorage=require('multer-gridfs-storage');
// const methodOverride= require('method-override');
// const crypto=require('crypto');
// const Grid=require('gridfs-stream');
//depencies
// const multer=require('multer')

const app=express();

// app.set('view engine','ejs');//

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
const PORT = process.env.PORT||1313;

mongoose.set('strictQuery', false);


const mongouri='mongodb+srv://admin:admin123@cluster0.ywihdcq.mongodb.net/NITJ_HOSTEL_MANAGEMENT?retryWrites=true&w=majority';
mongoose.connect(mongouri);

// CLOUDINARY
// now create the variable for file  uploading
app.use(fileupload({
    useTempFiles:true
}))  

// IT IS USED TO DISPLAY THE ERROR IF OCCURED DURING CONNECTION
mongoose.connection.on('error',err=>{
    console.log('connection failed');
});

// IT IS USED TO DISPLAY THE CONNECTED IF CONNECTION IS ESTABLISHED
mongoose.connection.on('connected',connected=>{
    console.log('connected to database..');
});


// THE APP WILL CALL ALL THE PATHS THAT ARE WRITTEN IN userRoutes object variable
app.use('/nitj_hostels',userRouter);
app.use('/nitj_hostels/hostelbook',userRouter2);
app.use('/nitj_hostels/hostelbook',userRouter3);
app.use('/nitj_hostels/hostelbook',userRouter4);
app.use('/nitj_hostels/hostelbook',userRouter5);
app.use('/nitj_hostels/hostelbook',userRouter6);

app.get("/nitj_hostels",(req,res)=>{
    res.send("hii mesg sent")
});
//IN CASE USER WRITE ANY BAD URL THEN ERROR GOT PRINTED
app.use((req,res,next)=>{
    res.status(404).json({
error:"Bad request"
    });
});

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})
