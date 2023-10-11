const mongoose = require('mongoose');
const mealSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  date: {
    type: Date,
    // unique:true,
   },
   breakfast: Number, // 0 for false, 1 for true
   lunch: Number,     // 0 for false, 1 for true
   dinner: Number,    //

});


const dietRecords= new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    rollNumber: {
        type: String,
    },
    roomNumber:{
        type:String,
    },
    hostelName:{
       type:String, 
    },
  month: Number, // Month number (e.g., 1 for January)
  year: Number, // Year
  meals: [mealSchema], // Array of daily meal data

});


// Define a pre-save middleware to initialize meals with default values
dietRecords.pre('save', function (next) {
  if (this.isNew) {
    // Initialize meals for the entire month
    const firstDay = new Date(this.year, this.month - 1, 1); // Month is 0-based
    const lastDay = new Date(this.year, this.month, 0);
    console.log(firstDay+""+lastDay);
    const mealDates = [];
    
    for (let date = firstDay; date <= lastDay; date = new Date(date.getTime() + 86400000)) { // 86400000 milliseconds in a day
      mealDates.push({
        date: new Date(date.getTime() + 86400000), // Create a new date object for each date
        breakfast: 0, // Set to 0 by default (false)
        lunch: 0,     // Set to 0 by default (false)
        dinner: 0,    // Set to 0 by default (false)
      });
    }
    

    this.meals = mealDates;
  }

  next();
});

module.exports = mongoose.model('DietRecords', dietRecords);
