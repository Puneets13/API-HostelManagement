const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/constants.js');

router.post('/setdailymeal',callbackFunctions.setdailymeal);//daily scanner meal amount
router.post('/createcollection',callbackFunctions.createConstants);//setting value of constants
router.post('/deletecollection',callbackFunctions.deleteCollection);//deleting all collection at end of sem
router.post('/addExtraItem',callbackFunctions.addExtraItem);//add  items to list
router.post('/deleteEntry',callbackFunctions.deleteEntry);//delte one entry in list
router.post('/deleteAllList',callbackFunctions.deleteAllList);// delete whole list
router.post('/editExtraItem',callbackFunctions.editExtraItem);//change name and price of item
router.post('/fetchItems',callbackFunctions.fetchItems);//fetch list of constants



router.post('/addTotalExpenditure',callbackFunctions.addTotalExpenditure);//fetch list of constants
router.post('/editTotalExpenditure',callbackFunctions.editTotalExpenditure);//fetch list of constants
router.post('/fetchTotalExpenditurePerMonth',callbackFunctions.fetchTotalExpenditurePerMonth);//fetch list of constants


module.exports = router;