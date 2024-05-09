const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/mess.js');

// router.post('/getdailymeal',callbackFunctions.getdailymeal);//daily scanner
router.post('/createmessaccount',checkauth,callbackFunctions.createMessAccount);
// router.post('/getdailymeal',callbackFunctions.getdailymeal);
router.post('/getextrameal',checkauth,callbackFunctions.getextrameal);

module.exports = router;