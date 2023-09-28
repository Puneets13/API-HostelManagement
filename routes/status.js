const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/status.js');
const Status = require('../models/Status.js');

router.post('/proceed',callbackFunctions.proceed);
router.post('/expire',callbackFunctions.expire);
router.get('/getAllRoomStatus',callbackFunctions.getAllRoomStatus);
router.post('/proceed_single',callbackFunctions.proceed_single);
router.post('/destroy',callbackFunctions.simpledestroy);

module.exports = router;
