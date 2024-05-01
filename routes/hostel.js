// THIS FILE CONTAINS ONLY THE ROUTES OF VARIOUS REQUESTS

const express = require('express');
const router = express.Router();

const callbackFunctions = require('../controller/hostel.js');
const Hostel = require('../models/Hostel.js');

router.post('/registerRoom',callbackFunctions.registerRoom);
router.get('/getHostels',callbackFunctions.getAllRooms);
router.post('/searchbyRoom',callbackFunctions.searchbyRoom);// room+hostel as input=2 possible persons in 1 hostel room
router.post('/searchbyName',callbackFunctions.searchbyName);//hostel+name as input =all possible persons in 1 hostel
router.post('/searchOnlybyName',callbackFunctions.searchOnlybyName); // name  as input=all possible persons in all hostel
router.post('/searchAllOnehostel',callbackFunctions.searchAllOnehostel);// hostel  as input=all possible persons in that hostel
router.post('/deleteHostelList',callbackFunctions.deleteUserList);// hostel  as input=all possible persons in that hostel

router.post('/searchbyEmailProfile',callbackFunctions.searchUserbyEmail); //profile

module.exports = router;


