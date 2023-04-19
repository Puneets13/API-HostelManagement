const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/status.js');
const Status = require('../models/Status.js');

router.post('/proceed',callbackFunctions.proceed);


module.exports = router;
