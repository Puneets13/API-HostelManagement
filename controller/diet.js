// code from copied
const Hostel = require('../models/Hostel.js');
const Status = require('../models/Status.js');
const User = require('../models/User.js');
// const DietRecords = require('../models/diet.js');
const DietRecords = require('../models/diet.js');
const Mess = require('../models/Mess.js');
const Constants = require('../models/Constants.js');
const mongoose = require('mongoose');
const moment = require('moment');


// const xlsx = require('xlsx-populate');
// const dbName = 'NITJ_HOSTEL_MANAGEMENT';
// const collectionName = 'dietrecords';

// const db = mongoose.connection;
// const collection = db.collection(collectionName);
// const DietModel = mongoose.model('Diet', DietRecords);

// const changeStream = DietRecords.watch();

// // const changeStream = collection.watch();
// // const excelFilePath = 'output.xlsx';


// console.log('Listening for changes in MongoDB...');

//  // Handle change events
//  changeStream.on('change', async (change) => {
//   try {
//     const document = change.fullDocument;

//     // Generate Excel file with dynamic filename
//     const fileName = `output_file.xlsx`;
//     const workbook = await xlsx.fromBlankAsync();
//     const sheet = workbook.sheet(0);
//     sheet.addRow(Object.keys(document));
//     sheet.addRow(Object.values(document));
//     console.log("Row added to a file");
//     // Save the changes to the Excel file
//     await workbook.toFileAsync(fileName);
//     console.log(`Excel file (${fileName}) updated.`);

//   } catch (error) {
//       console.error('Error processing change:', error);
//   }
// });


// module.exports.createFIle = function(req,res){
//   // const fileName = `output_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
//   const fileName = `output_file.xlsx`;
//   // Send the Excel file as a response
//   res.download(fileName, fileName, (err) => {
//       if (err) {
//           console.error('Error sending Excel file:', err);
//           res.status(500).send('Internal Server Error');
//       } else {
//           console.log('Excel file sent.');
//       }
//   });
// }

// module.exports.createExcleFile = function (req, res)=>{
//   // You can add additional logic here if needed before sending the file
//   // const fileName = `output_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
//   const fileName = `ouptut_file.xlsx`;
//   // Send the Excel file as a response
//   res.download(fileName, fileName, (err) => {
//       if (err) {
//           console.error('Error sending Excel file:', err);
//           res.status(500).send('Internal Server Error');
//       } else {
//           console.log('Excel file sent.');
//       }
//   });
// };







module.exports.messList =  async function(req, res){

  const hostelName = req.body.hostelName;
  const messRecords = [];

  try {
      // const currentDate = new Date().toISOString().split('T')[0]; // Today's date in "YYYY-MM-DD" format

      // Query MongoDB based on the current date
      const todayDate = moment().format('YYYY-MM-DD');
      // Get the current date
      const currentDate = moment();

      // Extract the year and month
      const year = currentDate.year();
      const month = currentDate.month() + 1; // Note: Months are zero-based, so add 1 to get the correct month


      const data = await DietRecords.find({
          month: month,
          year: year,
          hostelName: hostelName
      });


      messDate = new Date(currentDate);
      const FormattedDate = [
          messDate.getFullYear(),
          (messDate.getMonth() + 1).toString().padStart(2, '0'),
          messDate.getDate().toString().padStart(2, '0')
      ].join('-');
      console.log(FormattedDate);

      var currentDayMeal;
      // Assuming data is an array of objects, you can iterate over each object
      data.forEach((entry) => {
          // Check if 'meals' array exists and is an array
          if (entry.meals && Array.isArray(entry.meals)) {
              // Find the meal entry for the current date
               currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate);
              console.log(currentDate);

              var messRecordObj = {
                userName : entry.userName,
                rollNumber: entry.rollNumber,
                roomNumber: entry.roomNumber,
                date: currentDayMeal.date,
                breakfast: currentDayMeal.breakfast,
                lunch: currentDayMeal.lunch,
                dinner: currentDayMeal.dinner
              }
            messRecords.push(messRecordObj);
              if (currentDayMeal) {
                  // Do something with the found meal entry
                  console.log('Found meal for the current date:', currentDayMeal);
              } else {
                  console.log('No meal entry found for the current date');
              }
          } else {
              console.log('Invalid or missing "meals" array in the entry');
          }
      });

      res.status(200).json({
        message:"success",
        mealList:messRecords,
      })

  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};





// // FOR MESS LIST PRINT TO SCREEN

// // API endpoint to fetch data based on the current date
// module.exports.messList = async function (req, res) {

//   const hostelName = req.body.hostelName;
//   const messRecords = [];

//   try {
//     // const currentDate = new Date().toISOString().split('T')[0]; // Today's date in "YYYY-MM-DD" format

//     // Query MongoDB based on the current date
//     const todayDate = moment().format('YYYY-MM-DD');
//     // Get the current date
//     const currentDate1 = moment();
//     const currentDate = new Date();

//     // Extract the year and month
//     const year = currentDate1.year();
//     const month = currentDate1.month() + 1; // Note: Months are zero-based, so add 1 to get the correct month


//     const data = await DietRecords.find({
//       month: month,
//       year: year,
//       hostelName: hostelName
//     });


//     var messDate = new Date(currentDate1);
//     const FormattedDate = [
//       messDate.getFullYear(),
//       (messDate.getMonth() + 1).toString().padStart(2, '0'),
//       messDate.getDate().toString().padStart(2, '0')
//     ].join('-');
//     console.log(FormattedDate);

//     const hours = currentDate.getHours();
//     const minutes = currentDate.getMinutes();
//     const ampm = hours >= 12 ? 'pm' : 'am';

//     // const currentTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
//       // Format the time as HH:mm
//       const currentTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
   
//     var meal="" ,message="";

//     // Iterate over each DietRecord entry
//     for (const entry of data) {
//       // Check if 'meals' array exists and is an array
//       if (entry.meals && Array.isArray(entry.meals)) {
//         // Find the meal entry for the current date
//         var currentDayMeal;
//         if((currentTime >= '07:00' && currentTime <= '10:30') ){
//           meal = "breakfast"
//           message="success";
//           currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate && meal.breakfast ===1 );
//         }
//         else if((currentTime >= '12:00' && currentTime <= '15:00') ){
//           meal = "lunch"
//           message="success";
//           currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate && meal.lunch ===1 );
//         }
//         else if(((currentTime >= '19:00' && currentTime <= '23:50'))){
//           meal = "dinner"
//           message="success";
//           currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate && meal.dinner===1 );
//         }else{
//           message="Out of time";
//         }

//         // Find the corresponding user data based on rollNumber
//         const userData = await User.findOne({
//           rollNumber: entry.rollNumber
//         });

//         console.log(currentTime);
//         if (currentDayMeal) {
//           const messRecordObj = {
//             userName: userData ? userData.username : 'Unknown', // Use the username or provide a default value
//             avatar: userData? userData.avatar:"https://gravatar.com/avatar/?s=200&d=retro",
//             rollNumber: entry.rollNumber,
//             roomNumber: entry.roomNumber,
//             date: currentDayMeal.date+" "+currentTime,
//             meal:meal    
//           };
//           messRecords.push(messRecordObj);
//           console.log('Found meal for the current date:', currentDayMeal);
//         } else {
//           console.log('No meal entry found for the current date');
//         }
//       } else {
//         console.log('Invalid or missing "meals" array in the entry');
//       }
//     }

//     res.status(200).json({
//       message: "success",
//       mealList: messRecords,
//     });


//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



//  0 -> not taken
//  1 -> done meal
//  2 -> on leave 


// PUNEET CHANGED HERE

// to count all the diets consumed by the student till Now 
// for all the months
module.exports.countDietOfStudent = async function (req, res) {

  try {
    const { rollNumber, year } = req.body;
    // Find all documents that match the rollNumber
    const dietRecords = await DietRecords.find({ rollNumber, year });
    const hostelName = req.body.hostelName;
    var messStartDate;
    let constantRecords = await Constants.findOne({ hostelName });

    messStartDate = constantRecords.messStartDate;
    console.log("Mess start date found : " + messStartDate);

    messStartDate = new Date(messStartDate);
    messStartDate.setDate(messStartDate.getDate());
    console.log("mess start date : " + messStartDate);

    const FormattedDate = [
      messStartDate.getFullYear(),
      (messStartDate.getMonth() + 1).toString().padStart(2, '0'),
      messStartDate.getDate().toString().padStart(2, '0')
    ].join('-');

    console.log("formated date :" + FormattedDate)
    var monthFromConstant = FormattedDate.split('-')[1].toString();
    var yearFromConstant = FormattedDate.split('-')[0].toString();
    console.log("month : " + monthFromConstant)
    console.log("year : " + yearFromConstant)

    const currentDate = new Date().toISOString().split('T')[0];


    let totalDiet = 0;
    let whichMealFirstday = 0;
    // Iterate through the retrieved diet records and calculate the total diet
    dietRecords.forEach((record) => {
      let firstrec = 0
      record.meals.forEach((meal) => {
        var month = meal.date.split('-')[1].toString();
        if (month == monthFromConstant && year == yearFromConstant) {

          if (meal.date > FormattedDate) {
            if (firstrec == 0 && (meal.breakfast == 0 && meal.lunch == 0 && meal.dinner == 0)) {
              console.log("i am skiped huehuehuheehehe : " + meal.date);
            }
            else {
              firstrec = 1;
              // for start of mess by student this will run

              // ERRORR 
              // IF STUDENT EATS BREAKFAST AND SKIP LUNCH THEN IT WILL NOT BE COUNTED
              // HOW ARE YOU 
              // MY NAME IS KIRSANKEET


              if (firstrec == 1 && whichMealFirstday == 0) {
                if (meal.breakfast == 1) {
                  totalDiet += 1;
                }
                if (meal.lunch == 1 || meal.dinner != 2 || meal.breakfast != 2) {
                  totalDiet += 1;
                }
                if (meal.dinner == 1) {
                  totalDiet += 1;
                }
                whichMealFirstday = -1; // change this to -1 so that it can never be implemented again
              } else {
                // +6 condition so that while calculatiing the total diets , it will not
                if (meal.date >= FormattedDate && month <= monthFromConstant + 6 && month >= monthFromConstant) {  // count only when the current date is greater then the mess start date

                  if (meal.date > currentDate) {

                  } else {
                    totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
                    console.log("i m considered and from START MONTH : " + meal.date)
                  }


                } else {
                  console.log("i m not considered and from START MONTH")
                }
              }

            }
          }


        } else {
          totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
          console.log("i m considered and from other MONTH : " + meal.date)
        }
      });
    });

    res.status(200).json({
      dietCount: totalDiet,
      message: 'Total diet count retrieved successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message,
    });
  }

}

// to count the specific diets in particular month
module.exports.countDietPerMonth = async function (req, res) {
  try {
    const { rollNumber, month, year } = req.body;
    // Find all documents that match the rollNumber
    const dietRecords = await DietRecords.find({ rollNumber, month, year });
    // FETCHING THE START DATE FROM THE CONSTANTS SET IN COLLECTION
    const hostelName = req.body.hostelName;
    var messStartDate;
    let constantRecords = await Constants.findOne({ hostelName });

    messStartDate = constantRecords.messStartDate;
    console.log("Mess start date found : " + messStartDate);

    messStartDate = new Date(messStartDate);
    messStartDate.setDate(messStartDate.getDate());
    console.log("mess start date : " + messStartDate);

    const FormattedDate = [
      messStartDate.getFullYear(),
      (messStartDate.getMonth() + 1).toString().padStart(2, '0'),
      messStartDate.getDate().toString().padStart(2, '0')
    ].join('-');

    console.log("formated date :" + FormattedDate)
    var monthFromConstant = FormattedDate.split('-')[1].toString();
    var yearFromConstant = FormattedDate.split('-')[0].toString();
    console.log("month : " + monthFromConstant)
    console.log("year : " + yearFromConstant)

    let totalDiet = 0;
    console.log("month from front : " + month)

    if (monthFromConstant == month && yearFromConstant == year) {
      console.log("this is the starting month of mess")
      dietRecords.forEach((record) => {
        let firstrec = 0
        record.meals.forEach((meal) => {
          if (meal.date >= FormattedDate) {  // count only when the current date is greater then the mess start date
            if (firstrec == 0 && (meal.breakfast == 0 && meal.lunch == 0 && meal.dinner == 0)) {
            } else {
              firstrec = 1;
              totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
              console.log("i m considered :" + meal.date)
            }

          } else {
            console.log("i m not considered")
          }
        });
      });

    } else {
      // Iterate through the retrieved diet records and calculate the total diet
      console.log("this is not the starting month of mess")
      dietRecords.forEach((record) => {
        record.meals.forEach((meal) => {
          totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
          console.log("i m considered :" + meal.date)
        });
      });
    }
    res.status(200).json({
      dietCount: totalDiet,
      message: 'Total diet count retrieved successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message,
    });
  }

}

// count total diets consumed in a SINGLE HOSTEL by all students in a month
module.exports.countDietPerMonthForHostel = async function (req, res) {

  try {
    const { month, year, hostelName } = req.body;
    // Find all documents that match the rollNumber
    const dietRecords = await DietRecords.find({ hostelName, month, year });  // search by seeing the hostelName

    var messStartDate;
    let constantRecords = await Constants.findOne({ hostelName });

    messStartDate = constantRecords.messStartDate;
    console.log("Mess start date found : " + messStartDate);

    messStartDate = new Date(messStartDate);
    messStartDate.setDate(messStartDate.getDate());
    console.log("mess start date : " + messStartDate);

    const FormattedDate = [
      messStartDate.getFullYear(),
      (messStartDate.getMonth() + 1).toString().padStart(2, '0'),
      messStartDate.getDate().toString().padStart(2, '0')
    ].join('-');

    console.log("formated date :" + FormattedDate)
    var monthFromConstant = FormattedDate.split('-')[1].toString();
    var yearFromConstant = FormattedDate.split('-')[0].toString();
    console.log("month : " + monthFromConstant)
    console.log("year : " + yearFromConstant)



    let totalDiet = 0;

    if (monthFromConstant == month && yearFromConstant == year) {
      console.log("this is the starting month of mess")
      dietRecords.forEach((record) => {
        let firstrec = 0
        record.meals.forEach((meal) => {
          if (meal.date >= FormattedDate) {  // count only when the current date is greater then the mess start date
            if (firstrec == 0 && (meal.breakfast == 0 && meal.lunch == 0 && meal.dinner == 0)) {
            } else {
              firstrec = 1;
              totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
              console.log("i m considered :" + meal.date)
            }

          } else {
            console.log("i m not considered")
          }
        });
      });

    } else {
      // Iterate through the retrieved diet records and calculate the total diet
      console.log("this is not the starting month of mess")
      dietRecords.forEach((record) => {
        record.meals.forEach((meal) => {
          totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
          console.log("i m considered :" + meal.date)
        });
      });
    }




    // // Iterate through the retrieved diet records and calculate the total diet
    // dietRecords.forEach((record) => {
    //   record.meals.forEach((meal) => {
    //   var month = meal.date.split('-')[1].toString();
    //      if(month==monthFromConstant && year == yearFromConstant){
    //       if(meal.date >= FormattedDate){  // count only when the current date is greater then the mess start date
    //         totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
    //         console.log("i m considered and from START MONTH : "+meal.date)
    //       }else{
    //         console.log("i m not considered and from START MONTH")
    //       }
    //      }else{
    //       totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
    //       console.log("i m considered and from other MONTH : "+meal.date)
    //      }
    //   });
    // });


    res.status(200).json({
      dietCount: totalDiet,
      message: 'Total diet count retrieved successfully for a month',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message,
    });
  }

}






// function to apply leave for the student
module.exports.applyLeave = async function (req, res) {
  var error = "";
  var message = "";
  var rollNumber1 = "";
  try {
    const { rollNumber, hostelName, roomNumber, startDate, endDate, startMeal, endMeal } = req.body;
    rollNumber1 = rollNumber;
    if (!rollNumber || !startDate || !endDate) {
      return res.status(200).json({
        error: 'Roll number, start date, and end date are required in the request body',
      });
    }

    const currentTimestamp = new Date();
    const twentyFourHoursAhead = new Date(currentTimestamp);
    console.log("start date : " + startDate)
    twentyFourHoursAhead.setHours(currentTimestamp.getHours() + 24);

    console.log("next 24 hrs time : " + twentyFourHoursAhead);
    if (new Date(startDate) < twentyFourHoursAhead) {
      return res.status(200).json({
        error: 'Leave start date must be at least 24 hours ahead of the current time',
      });
    }

    // Find the corresponding document based on rollNumber, month, and year
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const month = startDateObj.getMonth() + 1; // Adding 1 because months are 0-based
    const year = startDateObj.getFullYear();


    // if number of days for which leave is to be applied is more then 25 then do not apply leave and throw error
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    // Calculate the difference in milliseconds
    const difference = Math.abs(endDateObj - startDateObj);

    // Convert the difference to days
    const daysDifference = Math.floor(difference / oneDay);

    if (daysDifference > 25) {
      console.log("difference is more then 25")
      return res.status(200).json({
        message: 'Leave cant be applied',
        error: "Number of days exceed 25"
      });
    }

    let dietRecord = await DietRecords.findOne({ rollNumber, month, year, hostelName, roomNumber });

    if (!dietRecord) {
      // Create a new diet record if it doesn't exist for the specified month and year
      dietRecord = new DietRecords({
        _id: new mongoose.Types.ObjectId(),
        rollNumber,
        roomNumber,
        hostelName,
        month,
        year,
        meals: [],
      });

      // Generate meal records for the entire month
      const firstDay = new Date(year, month - 1, 1); // Month is 0-based
      const lastDay = new Date(year, month, 0);

      for (let date = firstDay; date <= lastDay; date = new Date(date.getTime() + 86400000)) {
        const dateString = date.toISOString().split('T')[0];
        const meal = {
          date: dateString,
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        };

        dietRecord.meals.push(meal);
      }

      // Save the new diet record
      await dietRecord.save();
    }

    const studentRecord1 = await DietRecords.findOne({
      rollNumber,
      hostelName,
      roomNumber,
      month: month,
      year: year
    });

    if (studentRecord1) {
      // Previous month's record found, continue with the logic
      console.log("Record found:", studentRecord1);

      // Check and update the previous month's records as needed
      // to find the particular index from the student record
      var recordIndex = -1;
      const mealsArray = studentRecord1.meals;
      var createNextMonthRecord = -1; // to check if the end date is within the current month or not , else create next month record
      for (let i = 0; i < mealsArray.length; i++) {
        if (mealsArray[i].date == startDate) {
          console.log('record found')
          recordIndex = i; // Return the index if the date matches
        }
        const date = mealsArray[i].date;
        if (date >= startDate && mealsArray[i].date <= endDate) {
          if (startMeal == "breakfast" && date == startDate) {
            console.log("starting from breakfast")
            mealsArray[i].breakfast = 2;
            mealsArray[i].lunch = 2;
            mealsArray[i].dinner = 2;
          }
          else if (startMeal == "lunch" && date == startDate) {
            console.log("starting from lunch")
            mealsArray[i].lunch = 2;
            mealsArray[i].dinner = 2;
          }
          else if (startMeal == "dinner" && date == startDate) {
            console.log("starting from dinner")
            mealsArray[i].dinner = 2;
          }
          else if (endMeal == "breakfast" && date == endDate) {
            console.log("ending from breakfast")
            mealsArray[i].breakfast = 2;
          }
          else if (endMeal == "lunch" && date == endDate) {
            console.log("ending from lunch")
            mealsArray[i].breakfast = 2;
            mealsArray[i].lunch = 2;
          }
          else if (endMeal == "dinner" && date == endDate) {
            console.log("ending from dinner")
            mealsArray[i].breakfast = 2;
            mealsArray[i].lunch = 2;
            mealsArray[i].dinner = 2;
          } else {
            console.log("bechke dino mai")
            mealsArray[i].breakfast = 2;
            mealsArray[i].lunch = 2;
            mealsArray[i].dinner = 2;
          }
          if (mealsArray[i].date == endDate) {
            createNextMonthRecord = 1;
            console.log("main dubara set krdia hai 1")
          }
        }
        try {
          // Save the updated student record
          await studentRecord1.save();
        } catch (error) {
          console.error('Error saving updated student record:', error);
        }

      }
      // DONE
      // now check if the end date is greater then last date
      // to check leave has been applied to all the dates
      if (createNextMonthRecord == -1) {
        // to create the next month call 
        console.log("new month vala chalpada")
        try {

          // When calling the function again with different req parameters
          // set the startDate as the nextMonth first date

          var nextmonth = endDate.split('-')[1].toString();
          var nextYear = endDate.split('-')[0].toString();
          const firstDay = new Date(nextYear, nextmonth - 1, 1); // Month is 0-based
          var startDateNext = firstDay;
          console.log("new month agya : " + startDateNext)

          const nextMonthFirstDay = new Date(startDateObj.getFullYear(), startDateObj.getMonth() + 1, 1);

          var startMeal1 = "breakfast";

          const startDateObj1 = new Date(nextMonthFirstDay);
          const endDateObj = new Date(endDate);
          const month = startDateObj1.getMonth() + 1; // Adding 1 because months are 0-based
          const year = startDateObj1.getFullYear();

          let dietRecord = await DietRecords.findOne({ rollNumber, month, year, roomNumber, hostelName });

          if (!dietRecord) {
            // Create a new diet record if it doesn't exist for the specified month and year
            dietRecord = new DietRecords({
              _id: new mongoose.Types.ObjectId(),
              rollNumber,
              roomNumber,
              hostelName,
              month,
              year,
              meals: [],
            });

            // Generate meal records for the entire month
            const firstDay = new Date(year, month - 1, 1); // Month is 0-based
            const lastDay = new Date(year, month, 0);

            for (let date = firstDay; date <= lastDay; date = new Date(date.getTime() + 86400000)) {
              const dateString = date.toISOString().split('T')[0];
              const meal = {
                date: dateString,
                breakfast: 0,
                lunch: 0,
                dinner: 0,
              };
              dietRecord.meals.push(meal);
            }

            // Save the new diet record
            await dietRecord.save();
          }

          const studentRecord1 = await DietRecords.findOne({
            rollNumber,
            roomNumber,
            hostelName,
            month: month,
            year: year
          });

          if (studentRecord1) {
            // Previous month's record found, continue with the logic
            console.log("Second tym Record found:", studentRecord1);

            // Check and update the previous month's records as needed
            // to find the particular index from the student record
            var recordIndex = -1;
            const mealsArray = studentRecord1.meals;
            var createNextMonthRecord = -1; // to check if the end date is within the current month or not , else create next month record
            for (let i = 0; i < mealsArray.length; i++) {
              if (mealsArray[i].date == startDate) {
                console.log('record found')
                recordIndex = i; // Return the index if the date matches
              }
              const date = mealsArray[i].date;
              if (date >= startDate && mealsArray[i].date <= endDate) {
                if (startMeal1 == "breakfast" && date == startDate) {
                  console.log("starting from breakfast")
                  mealsArray[i].breakfast = 2;
                  mealsArray[i].lunch = 2;
                  mealsArray[i].dinner = 2;
                }
                else if (startMeal1 == "lunch" && date == startDate) {
                  console.log("starting from lunch")
                  mealsArray[i].lunch = 2;
                  mealsArray[i].dinner = 2;
                }
                else if (startMeal1 == "dinner" && date == startDate) {
                  console.log("starting from dinner")
                  mealsArray[i].dinner = 2;
                }
                else if (endMeal == "breakfast" && date == endDate) {
                  console.log("ending from breakfast")
                  mealsArray[i].breakfast = 2;
                }
                else if (endMeal == "lunch" && date == endDate) {
                  console.log("ending from lunch")
                  mealsArray[i].breakfast = 2;
                  mealsArray[i].lunch = 2;
                }
                else if (endMeal == "dinner" && date == endDate) {
                  console.log("ending from dinner")
                  mealsArray[i].breakfast = 2;
                  mealsArray[i].lunch = 2;
                  mealsArray[i].dinner = 2;
                } else {
                  console.log("bechke dino mai")
                  mealsArray[i].breakfast = 2;
                  mealsArray[i].lunch = 2;
                  mealsArray[i].dinner = 2;
                }
                if (mealsArray[i].date == endDate) {
                  createNextMonthRecord = 1;
                  console.log("End date reached")
                }
              }
              try {
                // Save the updated student record
                await studentRecord1.save();
              } catch (error) {
                console.error('Error saving updated student record:', error);
              }

            }
          }

        } catch (error) {
          console.error("Error:", error);
          error = "Internal server error";
        }

      }

    } else {
      console.log("No records found for the previous month.");
    }

    res.status(200).json({
      message: 'Leave applied successfully',
      error: error
    });
    // Save the updated diet record
    // }/


  } catch (error) {
    console.error('Error:', error);
    res.status(200).json({
      error: error.message,
    });
  }


}





// // modification for leave records if student continue in btw
module.exports.createmonthlydietRecord = async function (req, res) {

  const { rollNumber, hostelName, roomNumber, month, year, timestamp, mealType } = req.body;
  let scanyes = 0;
  try {
    // Find the student's diet record based on roll number, month, and year
    const studentRecord = await DietRecords.findOne({ rollNumber, month, year, hostelName, roomNumber });

    if (!studentRecord) {
      // Student record not found, you can handle this case as needed
      console.log("Student record not found.creating new");
      dietRecord = new DietRecords({
        _id: new mongoose.Types.ObjectId(),
        rollNumber,
        roomNumber,
        hostelName,
        month,
        year,
        meals: [],
      });

      // Generate meal records for the entire month
      const firstDay = new Date(year, month - 1, 1); // Month is 0-based
      const lastDay = new Date(year, month, 0);

      for (let date = firstDay; date <= lastDay; date = new Date(date.getTime() + 86400000)) {
        const dateString = date.toISOString().split('T')[0];
        const meal = {
          date: dateString,
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        };
        dietRecord.meals.push(meal);
      }
      console.log("Diet Record with Meals:", dietRecord);
      // Save the new diet record
      await dietRecord.save();
      // GIVING SOME EXCEPTION AS NULL MEALS CANT PUSH , BUT WORKING FINE
      module.exports.createmonthlydietRecord(req, res); // to again call this function so that once after creating the records , we can set the leave again
    }
    else {
      console.log(studentRecord);

      // to find the particular index from the student record
      var recordIndex = -1;
      const mealsArray = studentRecord.meals;

      for (let i = 0; i < mealsArray.length; i++) {
        if (mealsArray[i].date == timestamp) {
          recordIndex = i; // Return the index if the date matches
          console.log('record found')
        }
      }

      console.log("record Index: " + recordIndex)
      if (recordIndex != -1) {
        // Meal data found for the specified date
        const currentMeal = studentRecord.meals[recordIndex];
        console.log("current Meal : " + currentMeal)
        // Update the meal based on the meal type provided in the request


        if (mealType == 'breakfast') {
          console.log("iam in brekfast")

          // Move to the previous date
          const prevDate = new Date(timestamp);
          prevDate.setDate(prevDate.getDate() - 1);

          const FormattedPrevDate = [
            prevDate.getFullYear(),
            (prevDate.getMonth() + 1).toString().padStart(2, '0'),
            prevDate.getDate().toString().padStart(2, '0')
          ].join('-');

          console.log("formatted prev date : " + FormattedPrevDate);

          if (currentMeal.breakfast == 0) {
            currentMeal.breakfast = 1;

            // also check the prev meals if they are 0 , bcz agar banda koi mess skip krde aur phir next day jaye toh vo meal
            // 0 rhega aur uske next vala jo current hoga vo 1 hojayega,..toh phir number of meals count mai dikat ayegi.

            // everytime before applying SCAN yes , check prev record , if they are found 0 , mark them 1
            // while(true){

            //   if (studentRecord.meals[recordIndex-1].dinner != 0 && studentRecord.meals[recordIndex-1].lunch != 0 && studentRecord.meals[recordIndex-1].breakfast != 0) {
            //     console.log("stopppppp the prev of 0 checking")
            //     break;
            //   }
            //   if (studentRecord.meals[recordIndex-1].breakfast == 0 ) {
            //     studentRecord.meals[recordIndex-1].breakfast = 1;
            //     console.log("changing the prev breakfast to 1 as it is 0")
            //   } 
            //   if (studentRecord.meals[recordIndex-1].lunch == 0 ) {
            //     studentRecord.meals[recordIndex-1].lunch = 1;
            //     console.log("changing the prev lunch to 1 as it is 0")
            //   }
            //   if (studentRecord.meals[recordIndex-1].dinner == 0) {
            //     studentRecord.meals[recordIndex-1].dinner = 1;
            //     console.log("changing the prev dinner to 1 as it is 0")
            //   }

            //   recordIndex--;
            // }

            console.log('you can scan');
            res.status(200).json({
              message: "you can scan",
              error: "No error",
              scan: "yes"
            });
          }
          else if (currentMeal.breakfast == 1) {
            console.log('you can not scan. Already scanned once');
            res.status(200).json({
              message: "you can not scan",
              error: "dubara khane aya hai",
              scan: "No"
            });
          }
          else if (currentMeal.breakfast == 2) {
            console.log('you have applied leave');
            console.log('checking previous records entry')
            const firstDay = new Date(year, month - 1, 1); // Month is 0-based
            firstDay.setDate(firstDay.getDate());

            const FormattedFirstDate = [
              firstDay.getFullYear(),
              (firstDay.getMonth() + 1).toString().padStart(2, '0'),
              firstDay.getDate().toString().padStart(2, '0')
            ].join('-');

            console.log("formated first day of month :" + FormattedFirstDate)


            if (timestamp == FormattedFirstDate) {
              // we need to check the prev month record as well, so move to previous record  
              console.log("mai previous month mai hu")
              var Prevmonth = FormattedPrevDate.split('-')[1].toString();
              var Prevyear = FormattedPrevDate.split('-')[0].toString();
              console.log("Prev month : " + Prevmonth)
              console.log("Prev year : " + Prevyear)

              if (Prevmonth.startsWith('0')) {
                Prevmonth = Prevmonth.slice(1).toString(); // Remove the first character (zero)
                console.log("Prev month : " + Prevmonth)
              }

              const prevMonth = new Date(year, month - 2, 1); // Subtract 2 to get the previous month
              const prevYear = prevMonth.getFullYear();
              const prevMonthNumber = (prevMonth.getMonth() + 1).toString();

              try {
                const prevMonthStudentRecord = await DietRecords.findOne({
                  rollNumber,
                  hostelName,
                  roomNumber,
                  month: prevMonthNumber,
                  year: prevYear
                });

                if (prevMonthStudentRecord) {
                  // Previous month's record found, continue with the logic
                  console.log("Prev month record found:", prevMonthStudentRecord);

                  // Check and update the previous month's records as needed
                  // to find the particular index from the student record
                  var PrevrecordIndex = -1;
                  const PrevmealsArray = prevMonthStudentRecord.meals;

                  for (let i = 0; i < PrevmealsArray.length; i++) {
                    if (PrevmealsArray[i].date == FormattedPrevDate) {
                      PrevrecordIndex = i; // Return the index if the date matches
                      console.log('record found')
                    }
                  }

                  console.log("prev record Index: " + PrevrecordIndex)
                  console.log(prevMonthStudentRecord.meals[PrevrecordIndex])


                  if (prevMonthStudentRecord.meals[PrevrecordIndex].dinner == 2 && prevMonthStudentRecord.meals[PrevrecordIndex].lunch == 2 && prevMonthStudentRecord.meals[PrevrecordIndex].breakfast == 2) {
                    console.log('consectuive 3 meals leave found. Do not mark prev meals 1')
                    // now check the future meals also and mark them as 0 which are alredy marked 2
                    currentMeal.breakfast = 1;
                    studentRecord.meals[recordIndex].dinner = 0; // setting same day lunch and dinner from 2 to 0 if marked 2 
                    studentRecord.meals[recordIndex].lunch = 0;
                    recordIndex++;
                    while (true) {
                      if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                        studentRecord.meals[recordIndex].dinner = 0;
                        studentRecord.meals[recordIndex].lunch = 0;
                        studentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        recordIndex++;
                        // here we can't have that case that the recordIndex will  exceed 28 bcz max leave can be for 25
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                    currentMeal.breakfast = 1;
                    // mark current meal as 1 as he can eat now
                    res.status(200).json({
                      message: "Prev diet not effected, consecutive 3 meals found",
                      error: "Leave",
                      scan: "yes"
                    });
                    currentMeal.breakfast = 1;
                  } else {
                    console.log('consectuive 3 meals leave not found. mark prev meals 1')
                    prevMonthStudentRecord.meals[PrevrecordIndex].dinner = 1;
                    prevMonthStudentRecord.meals[PrevrecordIndex].lunch = 1;
                    prevMonthStudentRecord.meals[PrevrecordIndex].breakfast = 1;
                    currentMeal.breakfast = 1; // we are setting it again as 1 in next code , if got overriden

                    // now check the future meals also and mark them as 0 which are alredy marked 2
                    // TO CHANGE THE FUTURE MEALS TO 0 IF ONCE SCANNED
                    studentRecord.meals[recordIndex].dinner = 0; // setting same day lunch and dinner from 2 to 0 if marked 2 
                    studentRecord.meals[recordIndex].lunch = 0;
                    recordIndex++;
                    while (true) {
                      if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                        studentRecord.meals[recordIndex].dinner = 0;
                        studentRecord.meals[recordIndex].lunch = 0;
                        studentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        recordIndex++;
                        // here we can't have that case that the recordIndex will  exceed 28 bcz max leave can be for 25
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }

                    currentMeal.breakfast = 1; // we are setting it again as 1 here

                    res.status(200).json({
                      message: "Prev diet effected, consecutive 3 meals not found",
                      error: "Leave",
                      scan: "yes"

                    });

                  }

                } else {
                  console.log("No records found for the previous month.");
                }

              } catch (error) {
                console.error("Error querying for the previous month's record:", error);
              }

            } else {

              // for any other days except the first date of month , bcz we dont need to move to prev record 
              console.log(studentRecord.meals[recordIndex - 1])
              if (studentRecord.meals[recordIndex - 1].dinner == 2 && studentRecord.meals[recordIndex - 1].lunch == 2 && studentRecord.meals[recordIndex - 1].breakfast == 2) {
                console.log('consectuive 3 meals leave found. Do not mark prev meals 1')
                // mark current meal as 1 as he can eat now
                currentMeal.breakfast = 1;
                // now check the future meals also and mark them as 0 which are alredy marked 2
                studentRecord.meals[recordIndex].dinner = 0; // setting same day lunch and dinner from 2 to 0 if marked 2 
                studentRecord.meals[recordIndex].lunch = 0;
                recordIndex++;
                var nextMonthLeave = 0;
                var nextMonthDate;
                while (true) {
                  if ((studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2)) {
                    studentRecord.meals[recordIndex].dinner = 0;
                    studentRecord.meals[recordIndex].lunch = 0;
                    studentRecord.meals[recordIndex].breakfast = 0;
                    console.log("changing the future meals to 0")
                    console.log("record index : " + recordIndex)
                    recordIndex++;
                    // NEED TO HANDLE THE CASE WHERE IF THE LEAVE IS APPLIED AND IT IS SETTING 0 FOR FUTURE LEAVE
                    // THEN LAST RECORD GOES TO 30 OR 31 THEN IT IS NOT DEFINED SO THROWS ERROR
                    // for 28 days in month
                    if (recordIndex == 28 && studentRecord.meals.length == 28) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 29 days in month  LEAP year
                    if (recordIndex == 29 && studentRecord.meals.length == 29) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                    // for 30 days in month
                    if (recordIndex == 30 && studentRecord.meals.length == 30) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 31 days month
                    if (recordIndex == 31 && studentRecord.meals.length == 31) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                  }
                  else {
                    console.log("future override end")
                    break;
                  }
                }
                currentMeal.breakfast = 1;

                // checking if the leave has been applied for next month
                if (nextMonthLeave == 1) {
                  // search for next month record , if found it means there is a leave , bcz in this case only the next month entry will be generated
                  // else if not found then skip it
                  // Move to the previous date
                  nextMonthDate = new Date(nextMonthDate);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 1);
                  console.log("next month date : " + nextMonthDate);

                  const FormattedFirstDateNextMonth = [
                    nextMonthDate.getFullYear(),
                    (nextMonthDate.getMonth() + 1).toString().padStart(2, '0'),
                    nextMonthDate.getDate().toString().padStart(2, '0')
                  ].join('-');

                  console.log("formated first day of month :" + FormattedFirstDateNextMonth)


                  var Nextmonth = FormattedFirstDateNextMonth.split('-')[1].toString();
                  var Nextyear = FormattedFirstDateNextMonth.split('-')[0].toString();
                  console.log("next month : " + Nextmonth)
                  console.log("next year : " + Nextyear)
                  const nextMonthStudentRecord = await DietRecords.findOne({
                    rollNumber,
                    hostelName,
                    roomNumber,
                    month: Nextmonth,
                    year: Nextyear
                  });

                  if (nextMonthStudentRecord) {
                    console.log("student record found for next month : " + nextMonthStudentRecord)
                    var recordIndex = 0;

                    while (true) {
                      if ((nextMonthStudentRecord.meals[recordIndex].breakfast == 2 || nextMonthStudentRecord.meals[recordIndex].lunch == 2 || nextMonthStudentRecord.meals[recordIndex].dinner == 2)) {
                        nextMonthStudentRecord.meals[recordIndex].dinner = 0;
                        nextMonthStudentRecord.meals[recordIndex].lunch = 0;
                        nextMonthStudentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        console.log("record index : " + recordIndex)
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                  } else {
                    console.log("student record not found : ")
                  }

                  try {
                    // Save the updated student record
                    await nextMonthStudentRecord.save();
                    console.log('Meal records updated and saved successfully.');
                  } catch (error) {
                    console.error('Error saving updated student record:', error);
                  }

                }
                res.status(200).json({
                  message: "Prev diet not effected, consecutive 3 meals found",
                  error: "Leave",
                  scan: "yes"
                });
              } else {
                console.log('consectuive 3 meals leave not found. mark prev meals 1')
                studentRecord.meals[recordIndex - 1].dinner = 1;
                studentRecord.meals[recordIndex - 1].lunch = 1;
                studentRecord.meals[recordIndex - 1].breakfast = 1;
                currentMeal.breakfast = 1;
                studentRecord.meals[recordIndex].dinner = 0; // setting same day lunch and dinner from 2 to 0 if marked 2 
                studentRecord.meals[recordIndex].lunch = 0;
                recordIndex++;
                // now check the future meals also and mark them as 0 which are alredy marked 2
                var nextMonthLeave = 0;
                var nextMonthDate;
                while (true) {
                  if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                    studentRecord.meals[recordIndex].dinner = 0;
                    studentRecord.meals[recordIndex].lunch = 0;
                    studentRecord.meals[recordIndex].breakfast = 0;
                    console.log("changing the future meals to 0")
                    recordIndex++;
                    // NEED TO HANDLE THE CASE WHERE IF THE LEAVE IS APPLIED AND IT IS SETTING 0 FOR FUTURE LEAVE
                    // THEN LAST RECORD GOES TO 30 OR 31 THEN IT IS NOT DEFINED SO THROWS ERROR
                    // for 28 days in month
                    if (recordIndex == 28 && studentRecord.meals.length == 28) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 29 days in month  LEAP year
                    if (recordIndex == 29 && studentRecord.meals.length == 29) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                    // for 30 days in month
                    if (recordIndex == 30 && studentRecord.meals.length == 30) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 31 days month
                    if (recordIndex == 31 && studentRecord.meals.length == 31) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                  } else {
                    console.log("future override end")
                    break;
                  }
                }
                currentMeal.breakfast = 1;
                // checking if the leave has been applied for next month
                if (nextMonthLeave == 1) {
                  // search for next month record , if found it means there is a leave , bcz in this case only the next month entry will be generated
                  // else if not found then skip it
                  // Move to the previous date
                  nextMonthDate = new Date(nextMonthDate);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 1);
                  console.log("next month date : " + nextMonthDate);

                  const FormattedFirstDateNextMonth = [
                    nextMonthDate.getFullYear(),
                    (nextMonthDate.getMonth() + 1).toString().padStart(2, '0'),
                    nextMonthDate.getDate().toString().padStart(2, '0')
                  ].join('-');

                  console.log("formated first day of month :" + FormattedFirstDateNextMonth)
                  var Nextmonth = FormattedFirstDateNextMonth.split('-')[1].toString();
                  var Nextyear = FormattedFirstDateNextMonth.split('-')[0].toString();
                  console.log("next month : " + Nextmonth)
                  console.log("next year : " + Nextyear)
                  const nextMonthStudentRecord = await DietRecords.findOne({
                    rollNumber,
                    hostelName,
                    roomNumber,
                    month: Nextmonth,
                    year: Nextyear
                  });

                  if (nextMonthStudentRecord) {
                    console.log("student record found for next month : " + nextMonthStudentRecord)
                    var recordIndex = 0;

                    while (true) {
                      // this is for next month iteration 
                      if ((nextMonthStudentRecord.meals[recordIndex].breakfast == 2 || nextMonthStudentRecord.meals[recordIndex].lunch == 2 || nextMonthStudentRecord.meals[recordIndex].dinner == 2)) {
                        nextMonthStudentRecord.meals[recordIndex].dinner = 0;
                        nextMonthStudentRecord.meals[recordIndex].lunch = 0;
                        nextMonthStudentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        console.log("record index : " + recordIndex)
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                  } else {
                    console.log("student record not found : ")
                  }

                  try {
                    // Save the updated student record
                    await nextMonthStudentRecord.save();
                    console.log('Meal records updated and saved successfully.');
                  } catch (error) {
                    console.error('Error saving updated student record:', error);
                  }

                }
                res.status(200).json({
                  message: "Prev diet effected, consecutive 3 meals not found",
                  error: "Leave",
                  scan: "yes"
                });

              }
              // kya ye case possible hai ki jb scan kiya toh value 2 thi current meal ki but prev meals 0 ho???

            }

          }
          // update the data record on server
          try {
            // Save the updated student record
            await studentRecord.save();
            // await nextMonthStudentRecord.save();
            console.log('Meal records updated and saved successfully.');
          } catch (error) {
            console.error('Error saving updated student record:', error);
          }
        }



        // FOR LUNCH 
        if (mealType == 'lunch') {
          console.log("i am in lunch")

          // Move to the previous date
          const prevDate = new Date(timestamp);
          prevDate.setDate(prevDate.getDate() - 1);

          const FormattedPrevDate = [
            prevDate.getFullYear(),
            (prevDate.getMonth() + 1).toString().padStart(2, '0'),
            prevDate.getDate().toString().padStart(2, '0')
          ].join('-');

          console.log("formatted prev date : " + FormattedPrevDate);

          if (currentMeal.lunch == 0) {
            currentMeal.lunch = 1;

            // also check the prev meals if they are 0 , bcz agar banda koi mess skip krde aur phir next day jaye toh vo meal
            // 0 rhega aur uske next vala jo current hoga vo 1 hojayega,..toh phir number of meals count mai dikat ayegi.

            // everytime before applying SCAN yes , check prev record , if they are found 0 , mark them 1
            // while(true){
            //   if (studentRecord.meals[recordIndex-1].dinner != 0 && studentRecord.meals[recordIndex-1].lunch != 0 && studentRecord.meals[recordIndex].breakfast != 0) {
            //     console.log("stopppppp the prev of 0 checking")
            //     break;
            //   }
            //   if (studentRecord.meals[recordIndex].breakfast == 0 ) {
            //     studentRecord.meals[recordIndex].breakfast = 1;
            //     console.log("changing the curr breakfast to 1 as it is 0")
            //   } 
            //   if (studentRecord.meals[recordIndex-1].lunch == 0 ) {
            //     studentRecord.meals[recordIndex-1].lunch = 1;
            //     console.log("changing the prev lunch to 1 as it is 0")
            //   }
            //   if (studentRecord.meals[recordIndex-1].dinner == 0) {
            //     studentRecord.meals[recordIndex-1].dinner = 1;
            //     console.log("changing the prev dinner to 1 as it is 0")
            //   }

            //   recordIndex--;
            // }

            console.log('you can scan');
            res.status(200).json({
              message: "you can scan",
              error: "Leave",
              scan: "yes"
            });
          }
          else if (currentMeal.lunch == 1) {
            console.log('you can not scan. Already scanned once');
            res.status(200).json({
              message: "you can not scan",
              error: "dubara khane aya hai",
              scan: "No"
            });
          }
          else if (currentMeal.lunch == 2) {
            console.log('you have applied leave');
            console.log('checking previous records entry')
            const firstDay = new Date(year, month - 1, 1); // Month is 0-based
            firstDay.setDate(firstDay.getDate());

            const FormattedFirstDate = [
              firstDay.getFullYear(),
              (firstDay.getMonth() + 1).toString().padStart(2, '0'),
              firstDay.getDate().toString().padStart(2, '0')
            ].join('-');

            console.log("formated first day of month :" + FormattedFirstDate)


            if (timestamp == FormattedFirstDate) {
              // we need to check the prev month record as well, so move to previous record  
              console.log("mai previous month mai hu")
              var Prevmonth = FormattedPrevDate.split('-')[1].toString();
              var Prevyear = FormattedPrevDate.split('-')[0].toString();
              console.log("Prev month : " + Prevmonth)
              console.log("Prev year : " + Prevyear)

              if (Prevmonth.startsWith('0')) {
                Prevmonth = Prevmonth.slice(1).toString(); // Remove the first character (zero)
                console.log("Prev month : " + Prevmonth)
              }

              const prevMonth = new Date(year, month - 2, 1); // Subtract 2 to get the previous month
              const prevYear = prevMonth.getFullYear();
              const prevMonthNumber = (prevMonth.getMonth() + 1).toString();

              try {
                const prevMonthStudentRecord = await DietRecords.findOne({
                  rollNumber,
                  hostelName,
                  roomNumber,
                  month: prevMonthNumber,
                  year: prevYear
                });

                if (prevMonthStudentRecord) {
                  // Previous month's record found, continue with the logic
                  console.log("Prev month record found:", prevMonthStudentRecord);

                  // Check and update the previous month's records as needed
                  // to find the particular index from the student record
                  var PrevrecordIndex = -1;
                  const PrevmealsArray = prevMonthStudentRecord.meals;

                  for (let i = 0; i < PrevmealsArray.length; i++) {
                    if (PrevmealsArray[i].date == FormattedPrevDate) {
                      PrevrecordIndex = i; // Return the index if the date matches
                      console.log('record found')
                    }
                  }

                  console.log("prev record Index: " + PrevrecordIndex)
                  console.log(prevMonthStudentRecord.meals[PrevrecordIndex])

                  // CHANGING HERE BREAKFAST TO CURRENT DATE BREAKFAST here

                  if (prevMonthStudentRecord.meals[PrevrecordIndex].dinner == 2 && prevMonthStudentRecord.meals[PrevrecordIndex].lunch == 2 && studentRecord.meals[recordIndex].breakfast == 2) {
                    console.log('consectuive 3 meals leave found. Do not mark prev meals 1')
                    // mark current meal as 1 as he can eat now
                    res.status(200).json({
                      message: "Prev diet not effected, consecutive 3 meals found",
                      error: "No error",
                      scan: "yes"
                    });
                    currentMeal.lunch = 1;
                    studentRecord.meals[recordIndex].dinner = 0;
                    recordIndex++;
                    while (true) {
                      if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                        studentRecord.meals[recordIndex].dinner = 0;
                        studentRecord.meals[recordIndex].lunch = 0;
                        studentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        recordIndex++;
                        // here we can't have that case that the recordIndex will  exceed 28 bcz max leave can be for 25

                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                    currentMeal.lunch = 1; // we are setting it again as 1 here
                  } else {
                    console.log('consectuive 3 meals leave not found. mark prev meals 1')
                    prevMonthStudentRecord.meals[PrevrecordIndex].dinner = 1;
                    prevMonthStudentRecord.meals[PrevrecordIndex].lunch = 1;
                    studentRecord.meals[recordIndex].breakfast = 1;  // here it will be different
                    currentMeal.lunch = 1; // we are setting it again as 1 in next code , if got overriden

                    // now check the future meals also and mark them as 0 which are alredy marked 2
                    // TO CHANGE THE FUTURE MEALS TO 0 IF ONCE SCANNED
                    studentRecord.meals[recordIndex].dinner = 0;
                    recordIndex++;
                    while (true) {
                      if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                        studentRecord.meals[recordIndex].dinner = 0;
                        studentRecord.meals[recordIndex].lunch = 0;
                        studentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }

                    currentMeal.lunch = 1; // we are setting it again as 1 here

                    res.status(200).json({
                      message: "Prev diet effected, consecutive 3 meals not found",
                      error: "error",
                      scan: "yes"

                    });

                  }

                } else {
                  console.log("No records found for the previous month.");
                }

              } catch (error) {
                console.error("Error querying for the previous month's record:", error);
              }

            } else {

              // for any other days except the first date of month , bcz we dont need to move to prev record 
              console.log(studentRecord.meals[recordIndex - 1])
              if (studentRecord.meals[recordIndex - 1].dinner == 2 && studentRecord.meals[recordIndex - 1].lunch == 2 && studentRecord.meals[recordIndex].breakfast == 2) {
                console.log('consectuive 3 meals leave found. Do not mark prev meals 1')
                // mark current meal as 1 as he can eat now
                currentMeal.lunch = 1;
                studentRecord.meals[recordIndex].dinner = 0;  // set same day dinner to 0 , as breakfast will not be affected and 
                // do record index++ so that it can start from next day
                // now check the future meals also and mark them as 0 which are alredy marked 2
                recordIndex++;
                var nextMonthLeave = 0;
                var nextMonthDate;
                while (true) {
                  if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                    studentRecord.meals[recordIndex].dinner = 0;
                    studentRecord.meals[recordIndex].lunch = 0;
                    studentRecord.meals[recordIndex].breakfast = 0;
                    console.log("changing the future meals to 0")
                    console.log("record index : " + recordIndex)
                    recordIndex++;
                    // NEED TO HANDLE THE CASE WHERE IF THE LEAVE IS APPLIED AND IT IS SETTING 0 FOR FUTURE LEAVE
                    // THEN LAST RECORD GOES TO 30 OR 31 THEN IT IS NOT DEFINED SO THROWS ERROR
                    // for 28 days in month
                    if (recordIndex == 28 && studentRecord.meals.length == 28) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 29 days in month  LEAP year
                    if (recordIndex == 29 && studentRecord.meals.length == 29) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                    // for 30 days in month
                    if (recordIndex == 30 && studentRecord.meals.length == 30) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 31 days month
                    if (recordIndex == 31 && studentRecord.meals.length == 31) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                  } else {
                    console.log("future override end")
                    break;
                  }
                }
                currentMeal.lunch = 1;

                // checking if the leave has been applied for next month
                if (nextMonthLeave == 1) {
                  // search for next month record , if found it means there is a leave , bcz in this case only the next month entry will be generated
                  // else if not found then skip it
                  // Move to the previous date
                  nextMonthDate = new Date(nextMonthDate);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 1);
                  console.log("next month date : " + nextMonthDate);

                  const FormattedFirstDateNextMonth = [
                    nextMonthDate.getFullYear(),
                    (nextMonthDate.getMonth() + 1).toString().padStart(2, '0'),
                    nextMonthDate.getDate().toString().padStart(2, '0')
                  ].join('-');

                  console.log("formated first day of month :" + FormattedFirstDateNextMonth)


                  var Nextmonth = FormattedFirstDateNextMonth.split('-')[1].toString();
                  var Nextyear = FormattedFirstDateNextMonth.split('-')[0].toString();
                  console.log("next month : " + Nextmonth)
                  console.log("next year : " + Nextyear)
                  const nextMonthStudentRecord = await DietRecords.findOne({
                    rollNumber,
                    hostelName,
                    roomNumber,
                    month: Nextmonth,
                    year: Nextyear
                  });

                  if (nextMonthStudentRecord) {
                    console.log("student record found for next month : " + nextMonthStudentRecord)
                    var recordIndex = 0;

                    while (true) {
                      if ((nextMonthStudentRecord.meals[recordIndex].breakfast == 2 || nextMonthStudentRecord.meals[recordIndex].lunch == 2 || nextMonthStudentRecord.meals[recordIndex].dinner == 2)) {
                        nextMonthStudentRecord.meals[recordIndex].dinner = 0;
                        nextMonthStudentRecord.meals[recordIndex].lunch = 0;
                        nextMonthStudentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        console.log("record index : " + recordIndex)
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                  } else {
                    console.log("student record not found : ")
                  }

                  try {
                    // Save the updated student record
                    await nextMonthStudentRecord.save();
                    console.log('Meal records updated and saved successfully.');
                  } catch (error) {
                    console.error('Error saving updated student record:', error);
                  }

                }
                res.status(200).json({
                  message: "Prev diet not effected, consecutive 3 meals found",
                  error: "No error",
                  scan: "yes"
                });
              } else {
                console.log('consectuive 3 meals leave not found. mark prev meals 1')
                studentRecord.meals[recordIndex - 1].dinner = 1;
                studentRecord.meals[recordIndex - 1].lunch = 1;
                studentRecord.meals[recordIndex].breakfast = 1;
                currentMeal.lunch = 1;
                studentRecord.meals[recordIndex].dinner = 0; // it will not affect diet as the future diet can't be 1 , it can only be 2 and can be set to 0 
                recordIndex++;  // set same day dinner as zero incase it is marked 2and then using loop check and set further
                // now check the future meals also and mark them as 0 which are alredy marked 2
                var nextMonthLeave = 0;
                var nextMonthDate;
                while (true) {
                  if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                    studentRecord.meals[recordIndex].dinner = 0;
                    studentRecord.meals[recordIndex].lunch = 0;
                    studentRecord.meals[recordIndex].breakfast = 0;
                    console.log("changing the future meals to 0")
                    recordIndex++;
                    // THEN LAST RECORD GOES TO 30 OR 31 THEN IT IS NOT DEFINED SO THROWS ERROR
                    // for 28 days in month
                    if (recordIndex == 28 && studentRecord.meals.length == 28) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 29 days in month  LEAP year
                    if (recordIndex == 29 && studentRecord.meals.length == 29) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                    // for 30 days in month
                    if (recordIndex == 30 && studentRecord.meals.length == 30) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 31 days month
                    if (recordIndex == 31 && studentRecord.meals.length == 31) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                  } else {
                    console.log("future override end")
                    break;
                  }
                }
                currentMeal.lunch = 1;
                // checking if the leave has been applied for next month
                if (nextMonthLeave == 1) {
                  // search for next month record , if found it means there is a leave , bcz in this case only the next month entry will be generated
                  // else if not found then skip it
                  // Move to the previous date
                  nextMonthDate = new Date(nextMonthDate);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 1);
                  console.log("next month date : " + nextMonthDate);

                  const FormattedFirstDateNextMonth = [
                    nextMonthDate.getFullYear(),
                    (nextMonthDate.getMonth() + 1).toString().padStart(2, '0'),
                    nextMonthDate.getDate().toString().padStart(2, '0')
                  ].join('-');

                  console.log("formated first day of month :" + FormattedFirstDateNextMonth)
                  var Nextmonth = FormattedFirstDateNextMonth.split('-')[1].toString();
                  var Nextyear = FormattedFirstDateNextMonth.split('-')[0].toString();
                  console.log("next month : " + Nextmonth)
                  console.log("next year : " + Nextyear)
                  const nextMonthStudentRecord = await DietRecords.findOne({
                    rollNumber,
                    hostelName,
                    roomNumber,
                    month: Nextmonth,
                    year: Nextyear
                  });

                  if (nextMonthStudentRecord) {
                    console.log("student record found for next month : " + nextMonthStudentRecord)
                    var recordIndex = 0;

                    while (true) {
                      // this is for next month iteration 
                      if ((nextMonthStudentRecord.meals[recordIndex].breakfast == 2 || nextMonthStudentRecord.meals[recordIndex].lunch == 2 || nextMonthStudentRecord.meals[recordIndex].dinner == 2)) {
                        nextMonthStudentRecord.meals[recordIndex].dinner = 0;
                        nextMonthStudentRecord.meals[recordIndex].lunch = 0;
                        nextMonthStudentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        console.log("record index : " + recordIndex)
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                  } else {
                    console.log("student record not found : ")
                  }

                  try {
                    // Save the updated student record
                    await nextMonthStudentRecord.save();
                    console.log('Meal records updated and saved successfully.');
                  } catch (error) {
                    console.error('Error saving updated student record:', error);
                  }

                }
                res.status(200).json({
                  message: "Prev diet effected, consecutive 3 meals not found",
                  error: "error",
                  scan: "yes"
                });

              }
              // kya ye case possible hai ki jb scan kiya toh value 2 thi current meal ki but prev meals 0 ho???

            }

          }
          // update the data record on server
          try {
            // Save the updated student record
            await studentRecord.save();
            console.log('Meal records updated and saved successfully.');
          } catch (error) {
            console.error('Error saving updated student record:', error);
          }
        }


        // FOR DINNER
        if (mealType == 'dinner') {
          console.log("iam in dinner")

          // Move to the previous date
          const prevDate = new Date(timestamp);
          prevDate.setDate(prevDate.getDate() - 1);

          const FormattedPrevDate = [
            prevDate.getFullYear(),
            (prevDate.getMonth() + 1).toString().padStart(2, '0'),
            prevDate.getDate().toString().padStart(2, '0')
          ].join('-');

          console.log("formatted prev date : " + FormattedPrevDate);

          if (currentMeal.dinner == 0) {
            currentMeal.dinner = 1;

            // also check the prev meals if they are 0 , bcz agar banda koi mess skip krde aur phir next day jaye toh vo meal
            // 0 rhega aur uske next vala jo current hoga vo 1 hojayega,..toh phir number of meals count mai dikat ayegi.

            // everytime before applying SCAN yes , check prev record , if they are found 0 , mark them 1
            // while(true){
            //   if (studentRecord.meals[recordIndex-1].dinner != 0 && studentRecord.meals[recordIndex].lunch != 0 && studentRecord.meals[recordIndex].breakfast != 0) {
            //     console.log("stopppppp the prev of 0 checking")
            //     break;
            //   }
            //   if (studentRecord.meals[recordIndex].breakfast == 0 ) {
            //     studentRecord.meals[recordIndex].breakfast = 1;
            //     console.log("changing the curr breakfast to 1 as it is 0")
            //   } 
            //   if (studentRecord.meals[recordIndex].lunch == 0 ) {
            //     studentRecord.meals[recordIndex].lunch = 1;
            //     console.log("changing the prev lunch to 1 as it is 0")
            //   }
            //   if (studentRecord.meals[recordIndex-1].dinner == 0) {
            //     studentRecord.meals[recordIndex-1].dinner = 1;
            //     console.log("changing the prev dinner to 1 as it is 0")
            //   }

            //   recordIndex--;
            // }

            console.log('you can scan');
            res.status(200).json({
              message: "you can scan",
              error: "No error",
              scan: "yes"
            });
          }
          else if (currentMeal.dinner == 1) {
            console.log('you can not scan. Already scanned once');
            res.status(200).json({
              message: "you can not scan",
              error: "dubara khane aya hai",
              scan: "No"
            });
          }
          else if (currentMeal.dinner == 2) {
            console.log('you have applied leave');
            console.log('checking previous records entry')
            const firstDay = new Date(year, month - 1, 1); // Month is 0-based
            firstDay.setDate(firstDay.getDate());

            const FormattedFirstDate = [
              firstDay.getFullYear(),
              (firstDay.getMonth() + 1).toString().padStart(2, '0'),
              firstDay.getDate().toString().padStart(2, '0')
            ].join('-');

            console.log("formated first day of month :" + FormattedFirstDate)


            if (timestamp == FormattedFirstDate) {
              // we need to check the prev month record as well, so move to previous record  
              console.log("mai previous month mai hu")
              var Prevmonth = FormattedPrevDate.split('-')[1].toString();
              var Prevyear = FormattedPrevDate.split('-')[0].toString();
              console.log("Prev month : " + Prevmonth)
              console.log("Prev year : " + Prevyear)

              if (Prevmonth.startsWith('0')) {
                Prevmonth = Prevmonth.slice(1).toString(); // Remove the first character (zero)
                console.log("Prev month : " + Prevmonth)
              }

              const prevMonth = new Date(year, month - 2, 1); // Subtract 2 to get the previous month
              const prevYear = prevMonth.getFullYear();
              const prevMonthNumber = (prevMonth.getMonth() + 1).toString();

              try {
                const prevMonthStudentRecord = await DietRecords.findOne({
                  rollNumber,
                  roomNumber,
                  hostelName,
                  month: prevMonthNumber,
                  year: prevYear
                });

                if (prevMonthStudentRecord) {
                  // Previous month's record found, continue with the logic
                  console.log("Prev month record found:", prevMonthStudentRecord);

                  // Check and update the previous month's records as needed
                  // to find the particular index from the student record
                  var PrevrecordIndex = -1;
                  const PrevmealsArray = prevMonthStudentRecord.meals;

                  for (let i = 0; i < PrevmealsArray.length; i++) {
                    if (PrevmealsArray[i].date == FormattedPrevDate) {
                      PrevrecordIndex = i; // Return the index if the date matches
                      console.log('record found')
                    }
                  }

                  console.log("prev record Index: " + PrevrecordIndex)
                  console.log(prevMonthStudentRecord.meals[PrevrecordIndex])

                  // CHANGING HERE BREAKFAST TO CURRENT DATE BREAKFAST here

                  if (prevMonthStudentRecord.meals[PrevrecordIndex].dinner == 2 && studentRecord.meals[recordIndex].lunch == 2 && studentRecord.meals[recordIndex].breakfast == 2) {
                    console.log('consectuive 3 meals leave found. Do not mark prev meals 1')
                    // mark current meal as 1 as he can eat now
                    // TO CHANGE THE FUTURE MEALS TO 0 IF ONCE SCANNED
                    currentMeal.dinner = 1; // we are setting it again as 1 here
                    recordIndex++;  // since same day , no more meal and we can not have 2 as a meal so do ++
                    while (true) {
                      if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                        studentRecord.meals[recordIndex].dinner = 0;
                        studentRecord.meals[recordIndex].lunch = 0;
                        studentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        recordIndex++;
                        // here we can't have that case that the recordIndex will  exceed 28 bcz max leave can be for 25
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }

                    currentMeal.dinner = 1; // we are setting it again as 1 here

                    res.status(200).json({
                      message: "Prev diet not effected, consecutive 3 meals found",
                      error: "No error",
                      scan: "yes"
                    });
                    currentMeal.dinner = 1;
                  } else {
                    console.log('consectuive 3 meals leave not found. mark prev meals 1')
                    prevMonthStudentRecord.meals[PrevrecordIndex].dinner = 1;
                    prevMonthStudentRecord.meals[recordIndex].lunch = 1;
                    studentRecord.meals[recordIndex].breakfast = 1;  // here it will be different
                    currentMeal.dinner = 1; // we are setting it again as 1 in next code , if got overriden

                    // now check the future meals also and mark them as 0 which are alredy marked 2
                    // TO CHANGE THE FUTURE MEALS TO 0 IF ONCE SCANNED
                    recordIndex++;
                    while (true) {
                      if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                        studentRecord.meals[recordIndex].dinner = 0;
                        studentRecord.meals[recordIndex].lunch = 0;
                        studentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }

                    currentMeal.dinner = 1; // we are setting it again as 1 here

                    res.status(200).json({
                      message: "Prev diet effected, consecutive 3 meals not found",
                      error: "error",
                      scan: "yes"

                    });

                  }

                } else {
                  console.log("No records found for the previous month.");
                }

              } catch (error) {
                console.error("Error querying for the previous month's record:", error);
              }

            } else {

              // for any other days except the first date of month , bcz we dont need to move to prev record 
              console.log(studentRecord.meals[recordIndex - 1])
              if (studentRecord.meals[recordIndex - 1].dinner == 2 && studentRecord.meals[recordIndex].lunch == 2 && studentRecord.meals[recordIndex].breakfast == 2) {
                console.log('consectuive 3 meals leave found. Do not mark prev meals 1')
                // mark current meal as 1 as he can eat now
                currentMeal.dinner = 1;
                // TO CHANGE THE FUTURE MEALS TO 0 IF ONCE SCANNED
                recordIndex++;
                var nextMonthLeave = 0;
                var nextMonthDate;
                while (true) {
                  if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                    studentRecord.meals[recordIndex].dinner = 0;
                    studentRecord.meals[recordIndex].lunch = 0;
                    studentRecord.meals[recordIndex].breakfast = 0;
                    console.log("changing the future meals to 0")
                    recordIndex++;

                    // NEED TO HANDLE THE CASE WHERE IF THE LEAVE IS APPLIED AND IT IS SETTING 0 FOR FUTURE LEAVE
                    // THEN LAST RECORD GOES TO 30 OR 31 THEN IT IS NOT DEFINED SO THROWS ERROR
                    // for 28 days in month
                    if (recordIndex == 28 && studentRecord.meals.length == 28) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 29 days in month  LEAP year
                    if (recordIndex == 29 && studentRecord.meals.length == 29) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                    // for 30 days in month
                    if (recordIndex == 30 && studentRecord.meals.length == 30) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 31 days month
                    if (recordIndex == 31 && studentRecord.meals.length == 31) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                  } else {
                    console.log("future override end")
                    break;
                  }
                }

                currentMeal.dinner = 1; // we are setting it again as 1 here
                // checking if the leave has been applied for next month
                if (nextMonthLeave == 1) {
                  // search for next month record , if found it means there is a leave , bcz in this case only the next month entry will be generated
                  // else if not found then skip it
                  // Move to the previous date
                  nextMonthDate = new Date(nextMonthDate);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 1);
                  console.log("next month date : " + nextMonthDate);

                  const FormattedFirstDateNextMonth = [
                    nextMonthDate.getFullYear(),
                    (nextMonthDate.getMonth() + 1).toString().padStart(2, '0'),
                    nextMonthDate.getDate().toString().padStart(2, '0')
                  ].join('-');

                  console.log("formated first day of month :" + FormattedFirstDateNextMonth)


                  var Nextmonth = FormattedFirstDateNextMonth.split('-')[1].toString();
                  var Nextyear = FormattedFirstDateNextMonth.split('-')[0].toString();
                  console.log("next month : " + Nextmonth)
                  console.log("next year : " + Nextyear)
                  const nextMonthStudentRecord = await DietRecords.findOne({
                    rollNumber,
                    hostelName,
                    roomNumber,
                    month: Nextmonth,
                    year: Nextyear
                  });

                  if (nextMonthStudentRecord) {
                    console.log("student record found for next month : " + nextMonthStudentRecord)
                    var recordIndex = 0;

                    while (true) {
                      if ((nextMonthStudentRecord.meals[recordIndex].breakfast == 2 || nextMonthStudentRecord.meals[recordIndex].lunch == 2 || nextMonthStudentRecord.meals[recordIndex].dinner == 2)) {
                        nextMonthStudentRecord.meals[recordIndex].dinner = 0;
                        nextMonthStudentRecord.meals[recordIndex].lunch = 0;
                        nextMonthStudentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        console.log("record index : " + recordIndex)
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                  } else {
                    console.log("student record not found : ")
                  }

                  try {
                    // Save the updated student record
                    await nextMonthStudentRecord.save();
                    console.log('Meal records updated and saved successfully.');
                  } catch (error) {
                    console.error('Error saving updated student record:', error);
                  }

                }
                res.status(200).json({
                  message: "Prev diet not effected, consecutive 3 meals found",
                  error: "No error",
                  scan: "yes"
                });
              } else {
                console.log('consectuive 3 meals leave not found. mark prev meals 1')
                studentRecord.meals[recordIndex - 1].dinner = 1;
                studentRecord.meals[recordIndex].lunch = 1;
                studentRecord.meals[recordIndex].breakfast = 1;
                currentMeal.dinner = 1;
                recordIndex++;
                var nextMonthLeave = 0;
                var nextMonthDate;
                // now check the future meals also and mark them as 0 which are alredy marked 2
                while (true) {
                  if (studentRecord.meals[recordIndex].breakfast == 2 || studentRecord.meals[recordIndex].lunch == 2 || studentRecord.meals[recordIndex].dinner == 2) {
                    studentRecord.meals[recordIndex].dinner = 0;
                    studentRecord.meals[recordIndex].lunch = 0;
                    studentRecord.meals[recordIndex].breakfast = 0;
                    console.log("changing the future meals to 0")
                    recordIndex++;
                    // NEED TO HANDLE THE CASE WHERE IF THE LEAVE IS APPLIED AND IT IS SETTING 0 FOR FUTURE LEAVE
                    // THEN LAST RECORD GOES TO 30 OR 31 THEN IT IS NOT DEFINED SO THROWS ERROR
                    // for 28 days in month
                    if (recordIndex == 28 && studentRecord.meals.length == 28) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 29 days in month  LEAP year
                    if (recordIndex == 29 && studentRecord.meals.length == 29) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }

                    // for 30 days in month
                    if (recordIndex == 30 && studentRecord.meals.length == 30) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                    // for 31 days month
                    if (recordIndex == 31 && studentRecord.meals.length == 31) { // for length of months with days 30 or 31 
                      nextMonthLeave = 1; // now we will check if the next month leave have been applied or not
                      nextMonthDate = studentRecord.meals[recordIndex - 1].date;
                      break;
                    }
                  } else {
                    console.log("future override end")
                    break;
                  }
                }
                currentMeal.dinner = 1;
                // checking if the leave has been applied for next month
                if (nextMonthLeave == 1) {
                  // search for next month record , if found it means there is a leave , bcz in this case only the next month entry will be generated
                  // else if not found then skip it
                  // Move to the previous date
                  nextMonthDate = new Date(nextMonthDate);
                  nextMonthDate.setDate(nextMonthDate.getDate() + 1);
                  console.log("next month date : " + nextMonthDate);

                  const FormattedFirstDateNextMonth = [
                    nextMonthDate.getFullYear(),
                    (nextMonthDate.getMonth() + 1).toString().padStart(2, '0'),
                    nextMonthDate.getDate().toString().padStart(2, '0')
                  ].join('-');

                  console.log("formated first day of month :" + FormattedFirstDateNextMonth)


                  var Nextmonth = FormattedFirstDateNextMonth.split('-')[1].toString();
                  var Nextyear = FormattedFirstDateNextMonth.split('-')[0].toString();
                  console.log("next month : " + Nextmonth)
                  console.log("next year : " + Nextyear)
                  const nextMonthStudentRecord = await DietRecords.findOne({
                    rollNumber,
                    hostelName,
                    roomNumber,
                    month: Nextmonth,
                    year: Nextyear
                  });

                  if (nextMonthStudentRecord) {
                    console.log("student record found for next month : " + nextMonthStudentRecord)
                    var recordIndex = 0;

                    while (true) {
                      if ((nextMonthStudentRecord.meals[recordIndex].breakfast == 2 || nextMonthStudentRecord.meals[recordIndex].lunch == 2 || nextMonthStudentRecord.meals[recordIndex].dinner == 2)) {
                        nextMonthStudentRecord.meals[recordIndex].dinner = 0;
                        nextMonthStudentRecord.meals[recordIndex].lunch = 0;
                        nextMonthStudentRecord.meals[recordIndex].breakfast = 0;
                        console.log("changing the future meals to 0")
                        console.log("record index : " + recordIndex)
                        recordIndex++;
                      } else {
                        console.log("future override end")
                        break;
                      }
                    }
                  } else {
                    console.log("student record not found : ")
                  }

                  try {
                    // Save the updated student record
                    await nextMonthStudentRecord.save();
                    console.log('Meal records updated and saved successfully.');
                  } catch (error) {
                    console.error('Error saving updated student record:', error);
                  }

                }
                res.status(200).json({
                  message: "Prev diet effected, consecutive 3 meals not found",
                  error: "error",
                  scan: "yes"
                });

              }
              // kya ye case possible hai ki jb scan kiya toh value 2 thi current meal ki but prev meals 0 ho???

            }

          }
          // update the data record on server
          try {
            // Save the updated student record
            await studentRecord.save();
            console.log('Meal records updated and saved successfully.');
          } catch (error) {
            console.error('Error saving updated student record:', error);
          }
        }
        // Update the document with the modified meal data
        await studentRecord.save();
      } else {
        // Meal data not found for the specified date
        console.log(`Meal data not found for ${mealDate}`);
      }

    }

  } catch (error) {
    console.error("Error updating student record:", error);
  }

};


// it will consume alot of time in setting the records of all the students of the hostels as -1 for intial mess days

module.exports.fillStartMeals = async function (req, res) {
  // const messStartDate = req.body.messStartDate;
  const hostelName = req.body.hostelName;
  var messStartDate;
  let constantRecords = await Constants.findOne({ hostelName });
  if (constantRecords) {
    messStartDate = constantRecords.messStartDate;
    console.log("Mess start date found : " + messStartDate);

    messStartDate = new Date(messStartDate);
    messStartDate.setDate(messStartDate.getDate());
    console.log("mess start date : " + messStartDate);

    const FormattedDate = [
      messStartDate.getFullYear(),
      (messStartDate.getMonth() + 1).toString().padStart(2, '0'),
      messStartDate.getDate().toString().padStart(2, '0')
    ].join('-');

    console.log("formated date :" + FormattedDate)
    var month = FormattedDate.split('-')[1].toString();
    var year = FormattedDate.split('-')[0].toString();
    console.log("month : " + month)
    console.log("year : " + year)
    const firstDay = new Date(year, month - 1, 1); // Month is 0-based

    const FormattedFirstDateMonth = [
      firstDay.getFullYear(),
      (firstDay.getMonth() + 1).toString().padStart(2, '0'),
      firstDay.getDate().toString().padStart(2, '0')
    ].join('-');

    console.log("first date : " + firstDay)
    console.log("first date in format : " + FormattedFirstDateMonth)

    let dietRecord = await DietRecords.findOne({ rollNumber, month, year, hostelName, roomNumber });
  }
}



module.exports.getDietRecordList = async function (req, res) {
  const { rollNumber, hostelName, roomNumber } = req.body;
  const dietRecords = await DietRecords.find({ rollNumber, hostelName, roomNumber });

  let constantRecords = await Constants.findOne({ hostelName });

  messStartDate = constantRecords.messStartDate;
  console.log("Mess start date found : " + messStartDate);

  messStartDate = new Date(messStartDate);
  messStartDate.setDate(messStartDate.getDate());
  console.log("mess start date : " + messStartDate);

  const FormattedDate = [
    messStartDate.getFullYear(),
    (messStartDate.getMonth() + 1).toString().padStart(2, '0'),
    messStartDate.getDate().toString().padStart(2, '0')
  ].join('-');
  const currentDate = new Date().toISOString().split('T')[0];

  console.log("formated date :" + FormattedDate)
  var monthFromConstant = FormattedDate.split('-')[1].toString();
  var yearFromConstant = FormattedDate.split('-')[0].toString();
  console.log("month : " + monthFromConstant)
  console.log("year : " + yearFromConstant)
  const arraydiets = [];
  if (!dietRecords) {
    console.log("no record found");
  } else {

    dietRecords.forEach((record) => {
      let firstrec = 0
      record.meals.forEach((meal) => {
        var month = meal.date.split('-')[1].toString();
        var year = meal.date.split('-')[0].toString();
        if (monthFromConstant == month && yearFromConstant == year) {
          // console.log("this is the starting month of mess")

          if (meal.date >= FormattedDate) {  // count only when the current date is greater then the mess start date
            if (firstrec == 0 && (meal.breakfast == 0 && meal.lunch == 0 && meal.dinner == 0)) {
            } else {
              if (meal.date > currentDate) {

              }
              else {
                firstrec = 1;
                const diets = {
                  date: meal.date,
                  breakfast: meal.breakfast,
                  lunch: meal.lunch,
                  dinner: meal.dinner
                }
                arraydiets.push(diets);
              }

            }

          } else {
            console.log("i m not considered")
          }
        }
        else {
          // totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
          // console.log("i m considered and from other MONTH : "+meal.date)
          if (meal.date >= currentDate) {

          }
          else {
            const diets = {
              date: meal.date,
              breakfast: meal.breakfast,
              lunch: meal.lunch,
              dinner: meal.dinner
            }
            arraydiets.push(diets);
          }
        }

      });
    });

    //  }




  }


  arraydiets.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Sort in descending order (most recent to oldest)
  });

  res.json({
    rollNumber: rollNumber,
    roomNumber: roomNumber,
    hostelName: hostelName,
    mealList: arraydiets
  })
}
