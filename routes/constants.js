const express = require('express');
const router = express.Router();
const { checkauth } = require('../middleware/user_jwt.js');

const callbackFunctions = require('../controller/constants.js');

// router.post('/setdailymeal',callbackFunctions.setdailymeal);//daily scanner meal amount
router.post('/createcollection',callbackFunctions.createConstants);//setting value of constants
router.post('/deletecollection',checkauth,callbackFunctions.deleteCollection);//deleting all collection at end of sem
router.post('/addExtraItem',checkauth,callbackFunctions.addExtraItem);//add  items to list
router.post('/deleteEntry',checkauth,callbackFunctions.deleteEntry);//delte one entry in list
router.post('/deleteAllList',checkauth,callbackFunctions.deleteAllList);// delete whole list
router.post('/editExtraItem',checkauth,callbackFunctions.editExtraItem);//change name and price of item
router.post('/fetchItems',checkauth,callbackFunctions.fetchItems);//fetch list of constants


router.post('/addTotalExpenditure',checkauth,callbackFunctions.addTotalExpenditure);//fetch list of constants
router.post('/editTotalExpenditure',checkauth,callbackFunctions.editTotalExpenditure);//fetch list of constants
router.post('/fetchTotalExpenditurePerMonth',checkauth,callbackFunctions.fetchTotalExpenditurePerMonth);//fetch list of constants


module.exports = router;