const mongoose = require('mongoose');
const mealSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  date: {
    type: String,
    // unique:true,
   },
   breakfast: Number, // 0 for false, 1 for true
   lunch: Number,     // 0 for false, 1 for true
   dinner: Number,    //

});


const dietRecords= new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    roomNumber: {
        type: String,
        unique:true,
    },
    month: {
        type: [mealSchema],

    },

});

module.exports = mongoose.model('Hostel', hostelSchema);