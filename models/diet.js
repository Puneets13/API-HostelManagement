const mongoose = require('mongoose');

const mealSchema=new mongoose.Schema({
    date: Date,
    breakfast:Number,
    lunch: Number,
    dinner:Number,
})

const dietSchema = new mongoose.Schema({
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