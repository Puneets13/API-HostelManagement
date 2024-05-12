// THIS FILE CONTAINS ONLY THE ROUTES OF VARIOUS REQUESTS

const express = require('express');
const router = express.Router();
const { checkauth } = require('../middleware/user_jwt.js');

const callbackFunctions = require('../controller/hostel.js');
const Hostel = require('../models/Hostel.js');

router.post('/registerRoom',checkauth,callbackFunctions.registerRoom);
router.get('/getHostels',callbackFunctions.getAllRooms);
router.post('/searchbyRoom',callbackFunctions.searchbyRoom);// room+hostel as input=2 possible persons in 1 hostel room
router.post('/searchbyName',checkauth,callbackFunctions.searchbyName);//hostel+name as input =all possible persons in 1 hostel
router.post('/searchOnlybyName',checkauth,callbackFunctions.searchOnlybyName); // name  as input=all possible persons in all hostel
router.post('/searchAllOnehostel',checkauth,callbackFunctions.searchAllOnehostel);// hostel  as input=all possible persons in that hostel
router.post('/deleteHostelList',checkauth,callbackFunctions.deleteUserList);// hostel  as input=all possible persons in that hostel

router.post('/searchbyEmailProfile',checkauth,callbackFunctions.searchUserbyEmail); //profile

module.exports = router;


