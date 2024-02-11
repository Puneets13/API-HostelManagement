const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/constants.js');

router.post('/setdailymeal',callbackFunctions.setdailymeal);//daily scanner meal amount
router.post('/createcollection',callbackFunctions.createConstants);//setting value of constants
router.post('/deletecollection',callbackFunctions.deleteCollection);//deleting all collection at end of sem
router.post('/updateExtraList',callbackFunctions.updateExtraList);//add  items to list
router.delete('/deleteExtraListEntry',callbackFunctions.deleteExtraListEntry);//delte one entry in list
router.delete('/deleteExtraList',callbackFunctions.deleteExtraList);// delete whole list
router.post('/updateExtraListEntry',callbackFunctions.updateExtraListEntry);//change name and price of item
router.post('/fetchItems',callbackFunctions.fetchItems);//fetch list of constants
module.exports = router;