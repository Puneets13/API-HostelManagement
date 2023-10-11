const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/diet.js');

router.post('/createmonthlydietRecord',callbackFunctions.createmonthlydietRecord);

module.exports = router;