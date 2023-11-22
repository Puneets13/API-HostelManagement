const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/diet.js');

router.post('/createmonthlydietRecord',callbackFunctions.createmonthlydietRecord); // daily scanner
// router.post('/fillStartMeals',callbackFunctions.fillStartMeals);

router.post('/countDietOfStudent',callbackFunctions.countDietOfStudent);  // count diet of student for all months in a year
router.post('/countDietPerMonth',callbackFunctions.countDietPerMonth); // count diet of students per month
router.post('/countDietPerMonthForHostel',callbackFunctions.countDietPerMonthForHostel); // count diet 

router.post('/applyLeave',callbackFunctions.applyLeave); // leave


router.post('/getDietRecordList',callbackFunctions.getDietRecordList);

module.exports = router;