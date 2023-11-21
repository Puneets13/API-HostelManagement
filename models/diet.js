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

// ADD KRIAN PULL

// Define a pre-save middleware to initialize meals with default values
dietRecords.pre('save', function (next) {
  if (this.isNew) {
    // Initialize meals for the entire month
    const firstDay = new Date(this.year, this.month - 1, 1); // Month is 0-based
    const lastDay = new Date(this.year, this.month, 0);
    console.log(firstDay+""+lastDay);
    // Format the date as a string without the time and time zone
const formattedDate = firstDay.toLocaleDateString(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

console.log("formatted date : "+formattedDate);

    const mealDates = [];
    
    for (let date = firstDay; date <= lastDay; date = new Date(date.getTime() + 86400000)) { // 86400000 milliseconds in a day
      let date1 =  new Date(date.getTime() + 86400000) 
      const dateString = date1.toISOString();
      const parts = dateString.split('T');
// The 'parts' array will contain two elements, and you can access the front part using index 0.
const frontPart = parts[0];
console.log(frontPart+"\n");
      mealDates.push({
        date: frontPart , // Create a new date object for each date
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
