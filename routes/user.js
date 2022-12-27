// THIS FILE CONTAINS ONLY THE ROUTES OF VARIOUS REQUESTS

const express = require('express');
const router = express.Router();


// THIS OBJECT callbackFunctions CONTAINS ALL THE FUNCTIONS THAT ARE EXPORTED FROM users.js FROM Controller FOLDER 
// AND THE WAY OF IMPORTING THE FUNCTIONS IS DIFFERENT AS USED BELOW
const callbackFunctions = require('../controller/user.js');
const checkauth=require('../middleware/user_jwt.js');
// WE CAN SET THE ROUTES SECURITY BY SPECIFYING THE  check_auth.checkauth IN EVERY FUNCTION CALL 
// router.get('/',check_auth.checkauth, callbackFunctions.getAllUsers);

router.get('/fetchUsers', callbackFunctions.getAllUsers);


router.post('/Signup', callbackFunctions.createUser);
router.post('/login',callbackFunctions.loginUser);

// router.post('/login', checkauth.checkauth ,callbackFunctions.loginUser);

// to get user with particular id 
router.get('/:id',callbackFunctions.getUser);


// to delete the user with particular id 
router.delete('/:id', callbackFunctions.deleteUser);

// to delete all the data INCLUDING THE IMAGE AS WELL
//  QUERY WILL BE USED INSTEAD OF PARAMS HERE FOR DELETING THE IMAGE AS WELLL AS DATA 
router.delete('/', callbackFunctions.deleteData);



// to update the user array Profile
router.put('/:id', callbackFunctions.UpdateUser);

router.put('/password/:id',callbackFunctions.updatePassword);

module.exports = router;


// BELOW IS THE IMPLEMENTATION WITH ALL THE CALL BACK FUNCTIONS TOGETHER


// const express = require('express');
// const router = express.Router();
// const { v4: uuidv4 } = require('uuid');  //for imporintg uuid 
// let users = []; //array for storing user data

// router.get('/', (req, res) => {
//     res.send(users);
// })


// router.post('/', (req, res) => {
//     const user = req.body;
//     const userid = uuidv4();
//     const userwithId = { ...user, id: userid };
//     users.push(userwithId);
//     console.log(users);
//     res.send(`user ${user.firstName} with age ${user.age} added to Database`);
// })

// // to get user with particular id 

// router.get('/:id', (req, res) => {
//     const { id } = req.params;
//     const founduser = users.find((user) => user.id == id);
//     res.send(founduser);
//     console.log(`user found ${founduser.firstName} ${founduser.lastName}`);
// });

// // to delete the user with particular id 
// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     users = users.filter((user) => user.id != id);
//     res.send(users);
//     console.log(`user Deleted`);
// });



// // to update the user array Profile
// router.patch('/:id', (req, res) => {
//     const { id } = req.params;
//     const { firstName, lastName, age } = req.body;
//     const user = users.find((user) => user.id == id);
//     if (firstName) {
//         user.firstName = firstName;
//         console.log(`user firstname updated with ${firstName}`);

//     }
//     if (lastName) {
//         user.lastName = lastName;
//         console.log(`user lastname updated with ${lastName}`);

//     }
//     if (age) {
//         user.age = age;
//         console.log(`user age updated with ${age}`);

//     }
//     res.send(users);
// });

// module.exports = router;