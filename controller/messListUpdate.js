// const http = require('http');
// const mongoose = require('mongoose');
// const socketIO = require('socket.io');
// const server = http.createServer(app);
// const io = socketIO(server);
// const DietRecords = require('../models/diet.js');


// // Set up Socket.IO for real-time communication
// io.on('connection', (socket) => {
//     console.log('Client connected');

//     // Listen for changes in MongoDB data and emit updates to connected clients
//     DietRecords.watch().on('change', (change) => {
//         io.emit('dataUpdate', change.fullDocument);
//     });
// });

// socketIo.js

const socketIO = require('socket.io');
const DietRecords = require('../models/diet.js');

function setupSocketIO(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('Client connected');

        // Listen for changes in MongoDB data and emit updates to connected clients
        DietRecords.watch().on('change', (change) => {
            io.emit('dataUpdate', change.fullDocument);
        });
    });

    return io;
}

module.exports = { setupSocketIO };
