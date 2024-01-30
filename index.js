// DATABASE NAME = userLoginSystem
// Cluster0

const express = require('express');
const bodyparser = require('body-parser');
const userRouter = require('./routes/user.js');
const userRouter2 = require('./routes/hostel.js');
const userRouter3 = require('./routes/status.js');
const userRouter4 = require('./routes/mess.js');
const userRouter5 = require("./routes/constants.js");
const userRouter6 = require("./routes/diet.js");
const moment = require('moment');


const http = require('http');
const socketIo = require('socket.io');


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


// // for excel conversion 
const DietModel = require('./models/diet.js');
// const { exportDataToExcel } = require('./controller/excelUtils.js');


const app = express();

const server = http.createServer(app);
const io = socketIo(server);


// app.set('view engine','ejs');//


// // const express = require('express');
// const http = require('http');
// const { setupSocketIO } = require('./controller/messListUpdate.js'); // Adjust the path based on your project structure
// const server = http.createServer(app);

// const io = setupSocketIO(server);



app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
const PORT = process.env.PORT || 1313;

mongoose.set('strictQuery', false);


const mongouri = 'mongodb+srv://admin:admin123@cluster0.ywihdcq.mongodb.net/NITJ_HOSTEL_MANAGEMENT?retryWrites=true&w=majority';
mongoose.connect(mongouri);

// CLOUDINARY
// now create the variable for file  uploading
app.use(fileupload({
    useTempFiles: true
}))

// IT IS USED TO DISPLAY THE ERROR IF OCCURED DURING CONNECTION
mongoose.connection.on('error', err => {
    console.log('connection failed');
});

// IT IS USED TO DISPLAY THE CONNECTED IF CONNECTION IS ESTABLISHED
mongoose.connection.on('connected', connected => {
    console.log('connected to database..');
});


// const Meal = mongoose.model('Meal', DietModel);

// // Socket.io setup
// io.on('connection', (socket) => {
//     console.log('A user connected');
  
//     // Listen for disconnect events
//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });
//   });

  
//   // Mongoose middleware to capture changes
// DietModel.post('save', function (doc) {
//     // Emit the updated document to connected clients
//     io.emit('mealUpdated', doc);
//   });
  
//   // Serve the Socket.io client library
//   app.get('/socket.io.js', (req, res) => {
//     res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
//   });
  

// const db = mongoose.connection;

// const changeStream = DietModel.watch();
// var collectionData;
// changeStream.on('change', async () => {
//     try {
//         const todayDate = moment().format('YYYY-MM-DD');
//                  collectionData = await DietModel.find({
//                     'meals.date': todayDate,
//                     // Add more conditions if needed
//                 }).lean();

//         await exportDataToExcel("Boys Hostel 7");

//     } catch (error) {
//         console.error('Error processing change:', error);
//     }
// });

// THE APP WILL CALL ALL THE PATHS THAT ARE WRITTEN IN userRoutes object variable
app.use('/nitj_hostels', userRouter);
app.use('/nitj_hostels/hostelbook', userRouter2);
app.use('/nitj_hostels/hostelbook', userRouter3);
app.use('/nitj_hostels/hostelbook', userRouter4);
app.use('/nitj_hostels/hostelbook', userRouter5);
app.use('/nitj_hostels/hostelbook', userRouter6);

app.get("/nitj_hostels", (req, res) => {
    res.send("hii mesg sent")
});
//IN CASE USER WRITE ANY BAD URL THEN ERROR GOT PRINTED
app.use((req, res, next) => {
    res.status(404).json({
        error: "Bad request"
    });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})
