// THIS FILE CONTAINS ONLY THE ROUTES OF VARIOUS REQUESTS

const express = require('express');
const router = express.Router();


const callbackFunctions = require('../controller/user.js');

router.get('/fetchUsers', callbackFunctions.getAllUsers);

router.post('/Signup', callbackFunctions.createUser);


//Lab work android
router.post('/Signup2', callbackFunctions.createUser2);
router.post('/login2',callbackFunctions.loginUser2);

router.post("/verifyOTP",callbackFunctions.otpverify);//otp verifiaction 
router.post('/resendOTP',callbackFunctions.resentOTP);
router.post('/login',callbackFunctions.loginUser);

// to get user with particular id 
router.get('/:id',callbackFunctions.getUser);


// to delete the user with particular id 
router.delete('/:id', callbackFunctions.deleteUser);

// to delete all the data INCLUDING THE IMAGE AS WELL
//  QUERY WILL BE USED INSTEAD OF PARAMS HERE FOR DELETING THE IMAGE AS WELLL AS DATA 
router.delete('/deleteProfile/:id', callbackFunctions.deleteProfile);

//for otp verification


// to update the user array Profile
router.put('/:id', callbackFunctions.UpdateUser);

router.put('/password/:id',callbackFunctions.updatePassword);

router.post('/uploadProfile/:id',callbackFunctions.setUserProfile);


module.exports = router;