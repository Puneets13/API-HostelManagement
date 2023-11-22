const Hostel = require('../models/Hostel.js');
const Status = require('../models/Status.js');
const User = require('../models/User.js');
const ExtraDietRecords = require('../models/ExtraSchema.js');
const Mess = require('../models/Mess.js');
const Constants = require('../models/Constants.js');
const mongoose = require('mongoose');
const ExtraSchema = require('../models/ExtraSchema.js');

module.exports.createmonthlydietRecord = async function (req, res) {

    const { rollNumber, hostelName, roomNumber, month, year, timestamp, mealType } = req.body;
    let scanyes = 0;
    try {
      // Find the student's diet record based on roll number, month, and year
      const studentRecord = await ExtraSchema.findOne({ rollNumber, month, year, hostelName, roomNumber });
  
      if (!studentRecord) {
        // Student record not found, you can handle this case as needed
        console.log("Student record not found.creating new");
        extradietRecord = new ExtraSchema({
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