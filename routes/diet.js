const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/diet.js');

router.post('/createmonthlydietRecord',callbackFunctions.createmonthlydietRecord); // daily scanner
router.post('/countDietOfStudent',callbackFunctions.countDietOfStudent);  // count diet of student for "all months" in a year
router.post('/countDietPerMonth',callbackFunctions.countDietPerMonth); // count diet of students per month
router.post('/countDietPerMonthForHostel',callbackFunctions.countDietPerMonthForHostel); // count diet for particular hostel
router.post('/generateInvoice',callbackFunctions.generateInvoice); // count diet for particular hostel
router.post('/countExtrasPerMonthForHostel',callbackFunctions.countExtrasPerMonthForHostel); // count diet for particular hostel
router.post('/printConsumedItemsByStudent',callbackFunctions.printConsumedItemsByStudent); // count diet for particular hostel
router.post('/applyLeave',callbackFunctions.applyLeave); // leave
router.post('/getDietRecordList',callbackFunctions.getDietRecordList);
router.post('/messList',callbackFunctions.messList);
router.post('/createExtraMealRecord',callbackFunctions.getextrameal);
router.post('/getLeaveRecord',callbackFunctions.getLeaveRecord);


module.exports = router;