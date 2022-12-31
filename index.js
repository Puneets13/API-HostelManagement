// DATABASE NAME = userLoginSystem
// Cluster0
const express = require('express');
const bodyparser=require('body-parser');
const userRouter = require( './routes/user.js');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');  //for verifying the login button we include jsonwebtoken
const fileupload = require('express-fileupload') //for uploading file on cloudinary (IMAGES UPLOADING)
const app=express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
const PORT = process.env.PORT||5500;

// GET THIS STRING FROM THE CONNECT BUTTON FROM CLUSTER
// REPLACE THE PASSWORD  WITH THE PASSWORD U SET FOR THE DATABASE IN MONGODB
// mongodb+srv://admin:<password>@cluster0.d07qcas.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://puneet123:puneet123@cluster0.yvfdylg.mongodb.net/userLoginSystem?retryWrites=true&w=majority');


// // CLOUDINARY
// now create the variable for file  uploading
app.use(fileupload({
    useTempFiles:true
}))  //NEXT GO TO user.js in controller file 


// IT IS USED TO DISPLAY THE ERROR IF OCCURED DURING CONNECTION
mongoose.connection.on('error',err=>{
    console.log('connection failed');
});

// IT IS USED TO DISPLAY THE CONNECTED IF CONNECTION IS ESTABLISHED
mongoose.connection.on('connected',connected=>{
    console.log('connected to database..');
});



// THE APP WILL CALL ALL THE PATHS THAT ARE WRITTEN IN userRoutes object variable
app.use('/todo',userRouter);

app.get("/todo",(req,res)=>{
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
