const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/constants.js');

router.post('/setdailymeal',callbackFunctions.setdailymeal);//daily scanner meal amount
router.post('/createcollection',callbackFunctions.createConstants);//setting value of constants
router.post('/deletecollection',callbackFunctions.deleteCollection);//deleting all collection at end of sem

module.exports = router;