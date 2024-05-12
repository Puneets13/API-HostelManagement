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
const axios = require('axios');


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








module.exports.messList = async function (req, res) {

  const hostelName = req.body.hostelName;
  const meal_received = req.body.meal_received;
  const messRecords = [];

  try {
    // const currentDate = new Date().toISOString().split('T')[0]; // Today's date in "YYYY-MM-DD" format

    // Query MongoDB based on the current date
    // const todayDate = moment().format('YYYY-MM-DD');
    // Get the current date
    const currentDate = moment();
    const currentDate1 = new Date();

    // Extract the year and month
    const year = currentDate.year();
    const month = currentDate.month() + 1; // Note: Months are zero-based, so add 1 to get the correct month


    const data = await DietRecords.find({
      month: month,
      year: year,
      hostelName: hostelName
    });


    var messDate = new Date(currentDate);
    const FormattedDate = [
      messDate.getFullYear(),
      (messDate.getMonth() + 1).toString().padStart(2, '0'),
      messDate.getDate().toString().padStart(2, '0')
    ].join('-');
    console.log(FormattedDate);

    const hours = currentDate1.getHours();
    const minutes = currentDate1.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // const currentTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    // Format the time as HH:mm
    const currentTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;


    var meal_type = "", message = "";
    var currentDayMeal;
    // Iterate over each DietRecord entry
    for (const entry of data) {

      // Find the corresponding user data based on rollNumber
      const userData = await User.findOne({
        rollNumber: entry.rollNumber
      });

      // Check if 'meals' array exists and is an array
      if (entry.meals && Array.isArray(entry.meals)) {
        // Find the meal entry for the current date

        if (meal_received == "breakfast") {
          meal_type = "breakfast"
          message = "success";
          currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate && meal.breakfast === 1);
          console.log(currentDayMeal);
          if (currentDayMeal) {
            var messRecordObj = {
              userName: userData ? userData.username : 'Unknown', // Use the username or provide a default value
              avatar: userData ? userData.avatar : "https://gravatar.com/avatar/?s=200&d=retro",
              rollNumber: entry.rollNumber,
              roomNumber: entry.roomNumber,
              date: currentDayMeal.date,
              breakfast: currentDayMeal.breakfast,
              lunch: currentDayMeal.lunch,
              dinner: currentDayMeal.dinner,
              meal_type: meal_type,
              timeStamp: entry.timeStamp
            };
            messRecords.push(messRecordObj);
            console.log('Found meal for the current date:', currentDayMeal);
          }
        }
        else if (meal_received == "lunch") {
          meal_type = "lunch"
          message = "success";
          currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate && meal.lunch === 1);
          if (currentDayMeal) {
            var messRecordObj = {
              userName: userData ? userData.username : 'Unknown', // Use the username or provide a default value
              avatar: userData ? userData.avatar : "https://gravatar.com/avatar/?s=200&d=retro",
              rollNumber: entry.rollNumber,
              roomNumber: entry.roomNumber,
              date: currentDayMeal.date,
              breakfast: currentDayMeal.breakfast,
              lunch: currentDayMeal.lunch,
              dinner: currentDayMeal.dinner,
              timeStamp: entry.timeStamp
            };
            messRecords.push(messRecordObj);
            console.log('Found meal for the current date:', currentDayMeal);
          }
        }

        else if (meal_received == "dinner") {
          meal_type = "dinner"
          message = "success";
          currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate && meal.dinner === 1);
          if (currentDayMeal) {
            var messRecordObj = {
              userName: userData ? userData.username : 'Unknown', // Use the username or provide a default value
              avatar: userData ? userData.avatar : "https://gravatar.com/avatar/?s=200&d=retro",
              rollNumber: entry.rollNumber,
              roomNumber: entry.roomNumber,
              date: currentDayMeal.date,
              breakfast: currentDayMeal.breakfast,
              lunch: currentDayMeal.lunch,
              dinner: currentDayMeal.dinner,
              meal_type: meal_type,
              timeStamp: entry.timeStamp

            };
            messRecords.push(messRecordObj);
            console.log('Found meal for the current date:', currentDayMeal);
          }
        }

        else {
          message = "Out of time";
        }

        // const currentDayMeal = entry.meals.find((meal) => meal.date === FormattedDate);
        // if (currentDayMeal) {
        //   var messRecordObj = {
        //     userName: userData ? userData.username : 'Unknown', // Use the username or provide a default value
        //     avatar: userData ? userData.avatar : "https://gravatar.com/avatar/?s=200&d=retro",
        //     rollNumber: entry.rollNumber,
        //     roomNumber: entry.roomNumber,
        //     date: currentDayMeal.date,
        //     breakfast: currentDayMeal.breakfast,
        //     lunch: currentDayMeal.lunch,
        //     dinner: currentDayMeal.dinner,
        //     meal_type: meal_type
        //   };
        //   messRecords.push(messRecordObj);
        //   console.log('Found meal for the current date:', currentDayMeal);
        // } else {
        //   console.log('No meal entry found for the current date');
        // }
      } else {
        console.log('Invalid or missing "meals" array in the entry');
      }
    }

    // Sort messRecords based on timeStamp
    messRecords.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    res.status(200).json({
      message: message,
      mealList: messRecords
    });

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
// // for all the months
// module.exports.countDietOfStudent = async function (req, res) {

//   try {
//     const { rollNumber, year } = req.body;
//     // Find all documents that match the rollNumber
//     const dietRecords = await DietRecords.find({ rollNumber, year });
//     const hostelName = req.body.hostelName;
//     var messStartDate;
//     let constantRecords = await Constants.findOne({ hostelName });

//     messStartDate = constantRecords.messStartDate;
//     console.log("Mess start date found : " + messStartDate);

//     messStartDate = new Date(messStartDate);
//     messStartDate.setDate(messStartDate.getDate());
//     console.log("mess start date : " + messStartDate);

//     const FormattedDate = [
//       messStartDate.getFullYear(),
//       (messStartDate.getMonth() + 1).toString().padStart(2, '0'),
//       messStartDate.getDate().toString().padStart(2, '0')
//     ].join('-');

//     console.log("formated date :" + FormattedDate)
//     var monthFromConstant = FormattedDate.split('-')[1].toString();
//     var yearFromConstant = FormattedDate.split('-')[0].toString();
//     console.log("month : " + monthFromConstant)
//     console.log("year : " + yearFromConstant)

//     // const currentDate = new Date().toISOString().split('T')[0];

//     const messStartDate_new = new Date(constantRecords.messStartDate);
//     console.log("Mess start date:", messStartDate_new.toISOString());

//     const currentDate = new Date();
//     console.log("Today's date:", currentDate.toISOString());



//     let totalDiet = 0;
//     let whichMealFirstday = 0;
//     // Iterate through the retrieved diet records and calculate the total diet
//     dietRecords.forEach((record) => {
//       let firstrec = 0
//       record.meals.forEach((meal) => {
//         var month = meal.date.split('-')[1].toString();
//         if (month == monthFromConstant && year == yearFromConstant) {

//           if (meal.date > FormattedDate) {
//             if (firstrec == 0 && (meal.breakfast == 0 && meal.lunch == 0 && meal.dinner == 0)) {
//               console.log("i am skiped huehuehuheehehe : " + meal.date);
//             }
//             else {
//               firstrec = 1;
//               // for start of mess by student this will run

//               // ERRORR 
//               // IF STUDENT EATS BREAKFAST AND SKIP LUNCH THEN IT WILL NOT BE COUNTED
//               // HOW ARE YOU 
//               // MY NAME IS KIRSANKEET


//               if (firstrec == 1 && whichMealFirstday == 0) {
//                 if (meal.breakfast == 1) {
//                   totalDiet += 1;
//                 }
//                 if (meal.lunch == 1 || meal.dinner != 2 || meal.breakfast != 2) {
//                   totalDiet += 1;
//                 }
//                 if (meal.dinner == 1) {
//                   totalDiet += 1;
//                 }
//                 whichMealFirstday = -1; // change this to -1 so that it can never be implemented again
//               } else {
//                 // +6 condition so that while calculatiing the total diets , it will not
//                 if (meal.date >= FormattedDate && month <= monthFromConstant + 6 && month >= monthFromConstant) {  // count only when the current date is greater then the mess start date

//                   if (meal.date > currentDate) {

//                   } else {
//                     totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
//                     console.log("i m considered and from START MONTH : " + meal.date)
//                   }


//                 } else {
//                   console.log("i m not considered and from START MONTH")
//                 }
//               }

//             }
//           }


//         } else {
//           totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
//           console.log("i m considered and from other MONTH : " + meal.date)
//         }
//       });
//     });

//     res.status(200).json({
//       dietCount: totalDiet,
//       message: 'Total diet count retrieved successfully',
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       error: error.message,
//     });
//   }

// }




// this function counts the diet of the student till he joined for all months 
module.exports.countDietOfStudent = async function (req, res) {

  try {
    const { rollNumber, year } = req.body;

    // Find all documents that match the rollNumber
    const dietRecords = await DietRecords.find({ rollNumber, year });
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



    const messStartDate_new = new Date(constantRecords.messStartDate);
    console.log("Mess start date:", messStartDate_new.toISOString());

    const currentDate = new Date();
    console.log("Today's date:", currentDate.toISOString());



    if (yearFromConstant == year) {
      console.log("this is the starting month of mess")
      dietRecords.forEach((record) => {
        let firstrec = 0
        record.meals.forEach((meal) => {
          const mealDate = new Date(meal.date);
          if (mealDate >= messStartDate_new && mealDate <= currentDate) {  // count only when the current date is greater then the mess start date
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

          const mealDate = new Date(meal.date);
          if (mealDate >= messStartDate_new && mealDate <= currentDate) {  // count only when the current date is greater then the mess start date

            {
              firstrec = 1;
              totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
              console.log("i m considered :" + meal.date)
            }

          } else {
            console.log("i m not considered")
          }
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


    const messStartDate_new = new Date(constantRecords.messStartDate);
    console.log("Mess start date:", messStartDate_new.toISOString());

    const currentDate = new Date();
    console.log("Today's date:", currentDate.toISOString());


    //IF IT IS THE STARTING MONTH OF THE MESS , IT WILL CALCULATE FROM THE DAY YOU START CONSUMIING MEAL
    // BUT IF IT IS NOT THE STARTING MONTH OF THE MESS, IT WILL COUNT FROM THE 1ST DATE OF THE MONTH.
    if (monthFromConstant == month && yearFromConstant == year) {
      console.log("this is the starting month of mess")
      dietRecords.forEach((record) => {
        let firstrec = 0
        record.meals.forEach((meal) => {
          const mealDate = new Date(meal.date);
          if (mealDate >= messStartDate_new && mealDate <= currentDate) {  // count only when the current date is greater then the mess start date
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

          const mealDate = new Date(meal.date);
          if (mealDate >= messStartDate_new && mealDate <= currentDate) {  // count only when the current date is greater then the mess start date

            {
              firstrec = 1;
              totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
              console.log("i m considered :" + meal.date)
            }

          } else {
            console.log("i m not considered")
          }
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


// UPDATED 08/04/2024

// // -- considering MONTH
// // to count the specific diets in particular month
// module.exports.countDietPerMonth = async function (req, res) {
//   try {
//     const { rollNumber, month, year, hostelName } = req.body;

//     // Find all diet records that match the specified criteria
//     const dietRecords = await DietRecords.find({ rollNumber, month, year });
//     console.log("Diet records found:", dietRecords);

//     // Fetch mess start date from constants set in collection
//     const constantRecords = await Constants.findOne({ hostelName });
//     const messStartDate = new Date(constantRecords.messStartDate);
//     console.log("Mess start date:", messStartDate.toISOString());

//     const currentDate = new Date();
//     console.log("Today's date:", currentDate.toISOString());

//     let totalDiet = 0;

//     // Iterate through diet records
//     dietRecords.forEach((record) => {
//       record.meals.forEach((meal) => {
//         const mealDate = new Date(meal.date);

//         // Check if meal date is within the valid range (from start date to today's date)
//         if (mealDate >= messStartDate && mealDate <= currentDate) {
//           // Count valid diets (exclude meals where all breakfast, lunch, dinner = 2)
//           if (!(meal.breakfast === 2 && meal.lunch === 2 && meal.dinner === 2)) {
//             totalDiet += (meal.breakfast !== 2 ? 1 : 0) + (meal.lunch !== 2 ? 1 : 0) + (meal.dinner !== 2 ? 1 : 0);
//             console.log("Meal considered for counting:", meal.date);
//           }
//         }
//       });
//     });

//     // Send response with total diet count
//     res.status(200).json({
//       dietCount: totalDiet,
//       message: 'Total diet count retrieved successfully',
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// }





// make sure to stop at todays date for counting exact diet

// count total diets consumed in a SINGLE HOSTEL by all students in a month
module.exports.countDietPerMonthForHostel = async function (req, res) {

  try {
    const { month, year, hostelName } = req.body;
    // Find all documents that match the rollNumber
    const dietRecords = await DietRecords.find({ hostelName, month, year });  // search by seeing the hostelName

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



    // Fetch mess start date from constants set in collection
    // const constantRecords = await Constants.findOne({ hostelName });
    const messStartDate_new = new Date(constantRecords.messStartDate);
    console.log("Mess start date:", messStartDate_new.toISOString());

    const currentDate = new Date();
    console.log("Today's date:", currentDate.toISOString());


    let totalDiet = 0;

    if (monthFromConstant == month && yearFromConstant == year) {
      console.log("this is the starting month of mess")


      //kj
      dietRecords.forEach((record) => {
        let firstrec = 0
        record.meals.forEach((meal) => {

          const mealDate = new Date(meal.date);
          if (mealDate >= messStartDate_new && mealDate <= currentDate) {  // count only when the current date is greater then the mess start date
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
          const mealDate = new Date(meal.date);
          if (mealDate >= messStartDate_new && mealDate <= currentDate) {  // count only when the current date is greater then the mess start date

            {
              firstrec = 1;
              totalDiet += (meal.breakfast != 2 ? 1 : 0) + (meal.lunch != 2 ? 1 : 0) + (meal.dinner != 2 ? 1 : 0);
              console.log("i m considered :" + meal.date)
            }

          } else {
            console.log("i m not considered")
          }
        });
      });
    }

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

  const { rollNumber, hostelName, roomNumber, month, year, timestamp, mealType, formatedTime_24 } = req.body;
  let scanyes = 0;
  try {
    // Find the student's diet record based on roll number, month, and year
    const studentRecord = await DietRecords.findOne({ rollNumber, month, year, hostelName, roomNumber });

    console.log("\nFound record :" + studentRecord);

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
        timeStamp: "" + timestamp + " : " + formatedTime_24
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
          // HERE DO WE NEED TO INIIALISE THE breakfastextraMeal array
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
      //kiran
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

            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;

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

                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;


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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;

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
                studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;


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

                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;

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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;

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
            timeStamp = "" + timestamp + " : " + formatedTime_24;
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
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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
                studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24

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
                studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24

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
                    studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24

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
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24
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





module.exports.getextrameal = async function (req, res) {

  const { rollNumber, hostelName, roomNumber, month, year, timestamp, mealType, formatedTime_24 } = req.body;
  let scanyes = 0;

  const { item, amount } = req.body;
  const studentRecord = await DietRecords.findOne({ rollNumber, month, year, hostelName, roomNumber });


  console.log("RollNumber " + rollNumber);
  console.log("Student record extra found\n\n\n" + studentRecord + "\n\n\nMilgeyaaaaaaaaa..........");


  if (!studentRecord) {
    // Student record not found, you can handle this case as needed
    console.log("Student record not found.creating new..");

    dietRecord = new DietRecords({
      _id: new mongoose.Types.ObjectId(),
      rollNumber,
      roomNumber,
      hostelName,
      month,
      year,
      meals: [],
      timeStamp: "" + timestamp + " : " + formatedTime_24
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
        breakfastExtra: [],
        lunchExtra: [],
        eveningExtra: [],
        dinnerExtra: []

        // HERE DO WE NEED TO INIIALISE THE breakfastextraMeal array
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

    console.log("mai else mai hu , merko shuru se nhi banaayaaaa....")
    console.log(studentRecord);

    if (mealType == 'breakfast') {

      console.log("iam in brekfast")

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

          if (currentMeal.breakfast != 2) {
            // currentMeal.breakfast = 1;
            console.log('you can eat extra');

            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            var extras = {
              item: item,
              amount: amount
            }
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            currentMeal.breakfastExtra.push(extras);

            res.status(200).json({
              message: "you have consumed extras",
              error: "No error",
              scan: "yes"
            });

          }
          else if (currentMeal.breakfast == 2) {
            console.log('you have applied leave');
            res.status(200).json({
              message: "you are on leave",
              error: "error",
              scan: "No"
            });

          }
        }
      } else {
        console.log("record not found");
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


    if (mealType == 'lunch') {

      console.log("iam in lunch")

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


        if (mealType == 'lunch') {
          if (currentMeal.breakfast != 2) {
            console.log('you can eat extra');
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            var extras = {
              item: item,
              amount: amount
            }
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            currentMeal.lunchExtra.push(extras);

            res.status(200).json({
              message: "you have consumed extras",
              error: "No error",
              scan: "yes"
            });

          }
          else if (currentMeal.lunch == 2) {
            console.log('you are on leave');
            res.status(200).json({
              message: "you are on leave",
              error: "error",
              scan: "No"
            });

          }
        }
      } else {
        console.log("record not found");
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


    if (mealType == 'snacks') {

      console.log("iam in snacks")

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


        if (mealType == 'snacks') {
          // checking previous meal before snack
          if (currentMeal.lunch != 2) {
            console.log('you can eat extra');
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            var extras = {
              item: item,
              amount: amount
            }
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            currentMeal.eveningExtra.push(extras);

            res.status(200).json({
              message: "you have consumed extras",
              error: "No error",
              scan: "yes"
            });

          }
          else if (currentMeal.lunch == 2) {
            console.log('you are on leave');
            res.status(200).json({
              message: "you are on leave",
              error: "error",
              scan: "No"
            });

          }
        }
      } else {
        console.log("record not found");
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

    if (mealType == 'dinner') {

      console.log("iam in dinner")

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


        if (mealType == 'dinner') {
          if (currentMeal.breakfast != 2) {
            console.log('you can eat extra');
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            var extras = {
              item: item,
              amount: amount
            }
            studentRecord.timeStamp = "" + timestamp + " : " + formatedTime_24;
            currentMeal.dinnerExtra.push(extras);

            res.status(200).json({
              message: "you have consumed extras",
              error: "No error",
              scan: "yes"
            });

          }
          else if (currentMeal.dinner == 2) {
            console.log('you have applied leave');
            res.status(200).json({
              message: "you are on leave",
              error: "error",
              scan: "No"
            });

          }
        }
      } else {
        console.log("record not found");
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




  }

}




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


module.exports.getLeaveRecord = async function (req, res) {

  const { rollNumber, hostelName, roomNumber } = req.body;
  let responseDataList = [];
  try {
    // Find the student's diet record based on roll number, month, and year
    const studentRecord = await DietRecords.find({ rollNumber, hostelName, roomNumber });
    console.log(studentRecord);

    /* 
    [
    {
      month : 04,
      datesList : [
        date: 01-04-2024,
        count_diet:3
        onLeave:false
      ]
    },
    {
      month : 05,
      datesList:[
        date: 02-04-2024,
        count_diet:3
        onLeave:false
      ]
    }
    ]
    
     */

    console.log("------------here-------------");
    const { month, meals } = studentRecord;
    for (let data = 0; data < studentRecord.length; data++) {

      console.log(data + "\n------------------\n")
      const responseData = [
        {
          month: data.month,
          datesList: data.meals.map(meal => ({
            date: meal.date,
            count_diet: meal.breakfast + meal.lunch + meal.dinner,
            onLeave: false // Assuming this is a default value
          })
          )
        }
      ];

      responseDataList.push(responseData);
    }

    res.status(200).json({
      message: "success",
      attendanceRecord: responseDataList
    })


    // Prepare response data in the desired format

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}





module.exports.generateInvoice = async function (req, res) {
  try {
    const { rollNumber, hostelName, month, year } = req.body;

    // Constants from Munshi
    var totalSpentInaMonth = 0;
    var totalEarnedFromExtra = 0;

    const hostelDocument = await Constants.findOne({ hostelName });

    if (!hostelDocument) {
      return res.status(404).json({
        message: 'Hostel not found'
      });
    }

    // to concat month_year to search in map
    const monthString = String(month).padStart(2, '0'); // Pad with leading zero if necessary
    const yearString = String(year);

    // Concatenate month and year strings
    const key = monthString + "_" + yearString;

    // Access the items field from the hostelDocument
    if (hostelDocument.TotalExpenditurePerMonth.has(key)) {
      totalSpentInaMonth = hostelDocument.TotalExpenditurePerMonth.get(key);
      console.log(totalSpentInaMonth)
    } else {
      res.status(200).json({
        message: 'Wait till end of month',
        error: "fail"
      });
      return
    }


    // check if that entry exist or not in dietRecords
    const dietRecords = await DietRecords.find({ rollNumber, hostelName, month, year });
    if (!dietRecords) {
      res.status(200).json({
        message: 'Wait till end of month',
        error: "fail"
      });
      return
    }


    var totalEarnedFromExtra;
    var dietCount;
    var dietCountForHostel;

    console.log("Before 1 API")
     const totalEarnedFromExtraResponse = await axios.post('https://api-hostelmanagement-nitjhostels.onrender.com/nitj_hostels/hostelbook/countExtrasPerMonthForHostel', {
      // const totalEarnedFromExtraResponse = await axios.post('http://localhost:1313/nitj_hostels/hostelbook/countExtrasPerMonthForHostel', {
      month,
      year,
      hostelName,
    });

    totalEarnedFromExtra = totalEarnedFromExtraResponse.data.TotalExtraAmountGenerated;

    console.log("Before 2 API")
    // Retrieve the diet count for the specific rollNumber, month, and year
    const individualDietCountResponse = await axios.post('https://api-hostelmanagement-nitjhostels.onrender.com/nitj_hostels/hostelbook/countDietPerMonth', {
      // const individualDietCountResponse = await axios.post('http://localhost:1313/nitj_hostels/hostelbook/countDietPerMonth', {
    rollNumber,
      month,
      year,
      hostelName,
    });

    dietCount = individualDietCountResponse.data.dietCount;
    console.log("dietcount " + dietCount)

    console.log("Before 3 API")

    // Retrieve diet count for the hostel in the specified month and year
    const hostelDietCountResponse = await axios.post('https://api-hostelmanagement-nitjhostels.onrender.com/nitj_hostels/hostelbook/countDietPerMonthForHostel', {
      // const hostelDietCountResponse = await axios.post('http://localhost:1313/nitj_hostels/hostelbook/countDietPerMonthForHostel', {
      month,
      year,
      hostelName,
    });


    dietCountForHostel = hostelDietCountResponse.data.dietCount;
    console.log("dietCountForHostel " + dietCountForHostel)
    console.log("Extra CountForHostel " + totalEarnedFromExtraResponse.data.TotalExtraAmountGenerated)

    // Calculate perDietCost based on hostel diet count
    let perDietCost = (totalSpentInaMonth - totalEarnedFromExtra) / dietCountForHostel;

    // Calculate total invoice for the student
    let totalInvoice = dietCount * perDietCost;

    if (!perDietCost && perDietCost !== 0) {
      perDietCost = 0;
  }

  if (!totalInvoice && totalInvoice !== 0) {
    totalInvoice = 0;
}
   
    // Respond with the invoice data
    res.status(200).json({
      rollNumber: rollNumber,
      hostelName: hostelName,
      month: month,
      year: year,
      dietCount: dietCount,
      perDietCost: perDietCost,
      totalInvoice: totalInvoice,
      message: 'Invoice generated successfully',
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};




















// counting extraMeal amount

module.exports.countExtrasPerMonthForHostel = async function (req, res) {
  try {
    const { month, year, hostelName } = req.body;

    // Find all diet records that match the hostelName, month, and year
    const dietRecords = await DietRecords.find({ hostelName, month, year });


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


    const messStartDate_new = new Date(constantRecords.messStartDate);
    console.log("Mess start date:", messStartDate_new.toISOString());

    const currentDate = new Date();
    console.log("Today's date:", currentDate.toISOString());



    // Define a function to calculate total amount of extras from an array of extras
    // const calculateExtrasTotal = (extrasArray) => {
    //   let total = 0;
    //   let total_item = 0;
    //   for (const extra of extrasArray) {
    //     total_item += extra.amount;
    //     console.log(total_item);
    //     for (const item of extra.item) {
    //       const itemDetails = item.split(':'); // Split item string to get name and price
    //       // const itemName = itemDetails[0].trim();
    //       const itemPrice = Number(itemDetails[1].trim());
    //       total += itemPrice;
    //     }
    //   }
    //   return total;
    // };

    const calculateExtrasTotal = (extrasArray) => {
      let total = 0;
      for (const extra of extrasArray) {
        if (extra.amount) { // Ensure extra has an 'amount' property
          total += extra.amount;
        }
        if (extra.item && Array.isArray(extra.item)) {
          for (const item of extra.item) {
            const itemDetails = item.split(':'); // Split item string to get name and price
            if (itemDetails.length === 2) { // Ensure the split array has two elements
              const itemPrice = Number(itemDetails[1].trim());
              if (!isNaN(itemPrice)) { // Check if itemPrice is a valid number
                total += itemPrice;
              } else {
                console.error('Invalid item price:', itemPrice);
              }
            } else {
              console.error('Invalid item format:', item);
            }
          }
        } else {
          console.error('Invalid or missing "item" property:', extra.item);
        }
      }
      return total;
    };
    
    let totalBreakfastExtra = 0;
    let totalLunchExtra = 0;
    let totalEveningExtra = 0;
    let totalDinnerExtra = 0;

    dietRecords.forEach((record) => {
      record.meals.forEach((meal) => {
        const mealDate = new Date(meal.date);
        if (mealDate >= messStartDate_new && mealDate <= currentDate) {
          totalBreakfastExtra += calculateExtrasTotal(meal.breakfastExtra);
          totalLunchExtra += calculateExtrasTotal(meal.lunchExtra);
          totalEveningExtra += calculateExtrasTotal(meal.eveningExtra);
          totalDinnerExtra += calculateExtrasTotal(meal.dinnerExtra);
        }
      });
    });

    var TotalExtraAmountGenerated = totalBreakfastExtra + totalLunchExtra + totalEveningExtra + totalDinnerExtra;
    res.json({
      totalBreakfastExtra,
      totalLunchExtra,
      totalEveningExtra,
      totalDinnerExtra,
      TotalExtraAmountGenerated: TotalExtraAmountGenerated,
      message: 'Extras counted successfully',
      error: '0',
    });
  } catch (error) {
    console.error('Error counting extras:', error);
    res.status(500).json({ message: 'Failed to count extras', error: '1' });
  }
};







// Define a function to print consumed items by student for a specific month and year
module.exports.printConsumedItemsByStudent = async function (req, res) {
    try {

        console.log("------starting with detailed mess---------")
        const { rollNumber, month, year, hostelName,roomNumber } = req.body;

        // Find all diet records that match the rollNumber, month, and year
        const dietRecords = await DietRecords.find({ rollNumber, month, year, hostelName ,roomNumber});

        // Check if any records found for the student
        if (dietRecords.length === 0) {
            return res.status(404).json({
                message: 'No records found for the student for the specified month and year'
            });
        }


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
    
    
        const messStartDate_new = new Date(constantRecords.messStartDate);
        console.log("Mess start date:", messStartDate_new.toISOString());
    
        const currentDate = new Date();
        console.log("Today's date:", currentDate.toISOString());
  

        // Initialize an array to store consumed items
        let consumedItems = [];

        // Iterate through each record and add consumed items to the array
        dietRecords.forEach(record => {
            record.meals.forEach((meal) => {
                const mealDate = new Date(meal.date);
                if (mealDate >= messStartDate_new && mealDate <= currentDate) {
                    const consumedItem = {
                        date: meal.date,
                        breakfast: "",
                        lunch: "",
                        dinner: "",
                        breakfastExtra: [],
                        lunchExtra: [],
                        eveningExtra: [],
                        dinnerExtra: [],
                        extraTotal : 0
                    };

                    console.log(meal);
                    console.log("--------");
                    
                    // Check for breakfast
                    if (meal.breakfast == 1) {
                        consumedItem.breakfast = 'Consumed';
                    } else if (meal.breakfast == 2) {
                        consumedItem.breakfast = 'On Leave';
                    }

                    let extraTotalBreakfast = 0 , extraTotalLunch =0 , extraTotalSnacks = 0,extraTotalDinner =0 ;
                   
                    // Check for breakfastExtra
                    if (meal.breakfastExtra && meal.breakfastExtra.length > 0) {
                        meal.breakfastExtra.forEach(extra => {
                          console.log("ExtraAmount "+extra.amount)
                          extraTotalBreakfast  =  extraTotalBreakfast + extra.amount
                            extra.item.forEach(item => {
                                const itemDetails = item.split(':');
                                const itemName = itemDetails[0].trim();
                                const itemPrice = Number(itemDetails[1].trim());
                                // extraTotalBreakfast += itemPrice;
                                consumedItem.breakfastExtra.push({ item: itemName, amount: itemPrice });
                            });
                        });
                    }

                    // Check for lunch
                    if (meal.lunch == 1) {
                        consumedItem.lunch = 'Consumed';
                    } else if (meal.lunch == 2) {
                        consumedItem.lunch = 'On Leave';
                    }

                    // Check for lunchExtra
                    if (meal.lunchExtra && meal.lunchExtra.length > 0) {
                        meal.lunchExtra.forEach(extra => {
                          extraTotalLunch  = extraTotalLunch + extra.amount
                          console.log("ExtraAmount "+extra.amount)
                            extra.item.forEach(item => {
                                const itemDetails = item.split(':');
                                const itemName = itemDetails[0].trim();
                                const itemPrice = Number(itemDetails[1].trim());
                                // extraTotalLunch  += itemPrice;
                                consumedItem.lunchExtra.push({ item: itemName, amount: itemPrice });
                            });
                        });
                    }

                    // Check for dinner
                    if (meal.dinner == 1) {
                        consumedItem.dinner = 'Consumed';
                    } else if (meal.dinner == 2) {
                        consumedItem.dinner = 'On Leave';
                    }

                    // Check for dinnerExtra
                    if (meal.dinnerExtra && meal.dinnerExtra.length > 0) {
                        meal.dinnerExtra.forEach(extra => {
                          extraTotalDinner  = extraTotalDinner + extra.amount
                          console.log("ExtraAmount "+extra.amount)
                            extra.item.forEach(item => {
                                const itemDetails = item.split(':');
                                const itemName = itemDetails[0].trim();
                                const itemPrice = Number(itemDetails[1].trim());
                                // extraTotalDinner += itemPrice 
                                consumedItem.dinnerExtra.push({ item: itemName, amount: itemPrice });
                            });
                        });
                    }

                    // Check for eveningExtra
                    if (meal.eveningExtra && meal.eveningExtra.length > 0) {
                        meal.eveningExtra.forEach(extra => {
                          extraTotalSnacks  = extraTotalSnacks + extra.amount
                          console.log("ExtraAmount"+extra.amount)
                            extra.item.forEach(item => {
                                const itemDetails = item.split(':');
                                const itemName = itemDetails[0].trim();
                                const itemPrice = Number(itemDetails[1].trim());
                                extraTotalSnacks +=itemPrice;
                                consumedItem.eveningExtra.push({ item: itemName, amount: itemPrice });
                            });
                        });
                    }
                    console.log("All extras "+ extraTotalBreakfast+ extraTotalLunch+extraTotalSnacks+extraTotalDinner)
                    var allExtrasTemp = extraTotalBreakfast+ extraTotalLunch+extraTotalSnacks+extraTotalDinner;
                    console.log("All extras 2 "+allExtrasTemp)
                    consumedItem.extraTotal = extraTotalBreakfast+ extraTotalLunch+extraTotalSnacks+extraTotalDinner;

                    consumedItems.push(consumedItem);
                }
            });
        });

        // Return the consumed items as a response
        return res.status(200).json({
            message: 'Consumed items retrieved successfully',
            consumedItems: consumedItems
        });
    } catch (error) {
        // Handle errors
        console.error('Error retrieving consumed items by student:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
