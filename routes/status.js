const express = require('express');
const router = express.Router();
const { checkauth } = require('../middleware/user_jwt.js');

const callbackFunctions = require('../controller/status.js');
const Status = require('../models/Status.js');

router.post('/proceed',checkauth,callbackFunctions.proceed);
router.post('/expire',checkauth,callbackFunctions.expire);
router.get('/getAllRoomStatus',callbackFunctions.getAllRoomStatus);
router.post('/proceed_single',checkauth,callbackFunctions.proceed_single);
router.post('/destroy',checkauth,callbackFunctions.simpledestroy);

module.exports = router;
