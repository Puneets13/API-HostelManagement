// THIS FILE CONTAINS ALL THE CALLBACK FUNCTIONS OF VARIOUS ROUTES

const jwt = require('jsonwebtoken'); //for signup and login facility to verify the user
const User = require('../models/User.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   //for encrypting the password to be sent over the server

// define the cloudinary variable 
// const cloudinary = require('cloudinary').v2;

// CONFIGURE THE USER BY TAKING API KEY AND API_SECRET FROM cloudinary offical website
// cloudinary.config({
//     cloud_name: 'dytrs9xrm',    //get these values from the cloudinary after login
//     api_key: '497511148242921',
//     api_secret: 'Q_600GQHaMngyaWWBfllQRkk-iQ'
// });

module.exports.getAllUsers = function (req, res) {
    // fetching all the users from the mongoDB database
    User.find()
        .then(result => {
            console.log(result);
            res.status(200).json({
                users: result,
                error: "successfull"
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                error: err,
                message: "false"
            });
        });
};


// to add the file over the server at cloudinary ...add the code there in post function 
// FUNCTION TO UPLOAD THE IMAGE IN CLOUDINARY

// module.exports.createUser = function (req, res) {
//     console.log(req.body)
//     const file = req.files.photo;
//     cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
//         console.log(result);
// }
// )}


// THE CREATE FUNCTION BEFORE ADDING THE PICTURE TO CLOUDINARY 

module.exports.createUser = function (req, res) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err,
                message: "false"
            })
        }
        else {
            const { username, email, password } = req.body
            // FUNCTION TO MAKE THE EMAIL ENTER ONLY ONCE IN THE DATABASE 
            let user_exist = await User.findOne({ email: email });
            if (user_exist) {
                // if we will specify the status then whiile using the API in android ...we can not get the messages as a response 
                // bcx the status code is set as 500
                res.json({
                    error: "EMAIL already exists",
                    message: "false",

                })
            }
            else {
                let size = 200;
                let avatar = "https://gravatar.com/avatar/?s=" + size + '&d=retro';
                const user = new User({
                    _id: new mongoose.Types.ObjectId,
                    password: hash,
                    username: req.body.username,
                    email: req.body.email,
                    avatar: avatar

                });
                const token = jwt.sign({
                    username: username,
                    email: email,
                    avatar: avatar
                },
                    "This is secret key",   //this key is to be used in check_auth file for verification in verify function
                    {
                        expiresIn: '24h'
                    });

                user.save()
                    .then(result => {
                        console.log(result);
                        //   var user={    //since we are not using the user object created above bcz we have alredy created the above user 
                        //         "_id":req.body.ID,
                        //         "username":req.body.username,
                        //         "email":req.body.email,
                        //         "avatar":avatar
                        //     }
                        res.status(200).json({
                            message: "success",
                            error: "No Error",
                            user: user,
                            // username: req.body.username,
                            // email: req.body.email
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: "error in saving",
                            err: err,
                            message: "false"
                        });
                    });
            }


        }
    })
};

// FUNCTION FOR LOGGING IN USER (REQUIRES JWT INSTALLASTION)
module.exports.loginUser = function (req, res) {

    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length < 1) {
                // soecify return if the error message is to be printed without specifing the status(500) else server will crash
                return res.json({
                    error: "user not found",
                    message: "false"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (!result) {
                    return res.json({
                        message: "false",
                        error: "Incorrect Password"
                    })
                }
                if (result) {
                    // if result match then create the token
                    let size = 200;
                    let avatar = "https://gravatar.com/avatar/?s=" + size + '&d=retro';
                    console.log("User logged in");
                    const token = jwt.sign({
                        username: user[0].username,
                        email: user[0].email,
                        avatar: avatar

                    },
                        "This is secret key",   //this key is to be used in check_auth file for verification in verify function
                        {
                            expiresIn: '24h'
                        });
                    // var user = {
                    //     _id:user[0].ID,
                    //     username: user[0].username,
                    //     email: user[0].email,
                    //     avatar: avatar[0].avatar,
                    // }
                    res.status(200).json({
                        message: "User logged in",
                        error: "successful",
                        user: user[0],   //to get the 0th index user values out of the array received form find() function
                        token: token
                    })

                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}

module.exports.getUser = function (req, res) {
    User.findById(req.params.id)
        .then(result => {
            console.log(result);
            res.status(200).json({
                user: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });

};

// TO DELETE THE IMAGE FROM THE CLOUDNIARY AS WELL AS FROM MONGODB USE THIS METHOD 
// QUERY is used for deleteing the image from cloudinary using & , ?

// http:// localhost:3000/users?id="123456" & imageURL=" "
// using split() method to get the imageURL from the URL query 

module.exports.deleteData = function (req, res) {
    const imageURL = req.query.imageURL;
    const urlarr = imageURL.split("/")
    const image = urlarr[urlarr.length - 1];
    const Imagename = image.split(".")[0];

    const userID = req.query.ID;
    User.remove({ _id: userID }).
        then(result => {

            cloudinary.uploader.destroy(Imagename, (err, result) => {
                console.log(err, result);
            })
            res.status(200).json({
                message: result
            })
        }).catch(error => {
            res.status(500).json({
                err: err
            })
        })
}


module.exports.deleteUser = function (req, res) {
    User.remove({ _id: req.params.id })
        .then(result => {
            console.log("user Deleted");
            res.status(200).json({
                messsage: 'success',
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });

};

// USE PUT REQUEST TO UPDATE THE DATA AND TH EUPDATED DATA IS NOT REFLECTED ON THE RESPONSE

// we can either go by ID or by email ...since both are unique in ur case 
module.exports.UpdateUser = function (req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            username: req.body.username //USERNAME WILL BE UPDATED BUT NOW SHOWN IN THE RESPONSE SO WE NEET TO FETCH IT FROM DATABASE ITSELF 
            // OR FROM USER INPUT
        }
    })
        .then(result => {
            console.log("user Updated");
            user = {
                username: req.body.username,  //since the updated username is not shown on the response body 
                email: result.email,     //accessing the properties from the result received (result will contain all the properties of user)
                avatar: result.avatar,
            }
            res.status(200).json({
                messsage: 'user Updated Successfully',
                user: user   //the result will not be the updated value but the previous value so we created the new user json 

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            });
        });

};

    // FOR UPDATING THE USER PASSWORD  
    // TO COMPARE PASSWORD <<DONOT HASH THE OLD PASSWORD >>
    // 2. find the old password with the id entered by the user
    // 3. to compare hashed password and the password stored in the dDatabase ..use ==>  bcrypt.compare()
    // 4.Once user got authenticated then findOneAndUpdate() method is used and using id the user is again found
    // 5. the password is $set:{} and updated 
    module.exports.updatePassword = function (req, res) {
     
                // find the user and compare the password
                User.findById(req.params.id)
                    .then(result => {
                        console.log("userFound");
                        bcrypt.compare(req.body.oldpassword, result.password, (err, result1) => {
                            console.log(result1);
                            if (!result1) {     //if result1 is true  then 
                                return res.json({
                                    message: "false",
                                    error: "Password donot match"
                                })
                            } 
                            if(result1) {
                                // update the password
                                // encrypt the new password
                                // now update the password by encrypting new passsword
                                bcrypt.hash(req.body.newpassword, 10, async (err, hash) => {
                                    if (err) {
                                        return res.status(500).json({
                                            error: err,
                                            message: "false"
                                        })
                                    } else {
                                        // set the password using findoneandUpdate
                                        User.findOneAndUpdate({ _id: req.params.id }, {
                                            $set: {
                                                password: hash  //new password
                                            }
                                        })
                                            .then(result => {
                                                console.log("Password Updated");
                                                user = {
                                                    username: result.username,  //since the updated username is not shown on the response body 
                                                    email: result.email,     //accessing the properties from the result received (result will contain all the properties of user)
                                                    avatar: result.avatar
                                                }
                                                res.status(200).json({
                                                    error: 'Password Updated Successfully',
                                                    message:"success",
                                                    user: user   //the result will not be the updated value but the previous value so we created the new user json 

                                                });
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                res.status(500).json({
                                                    Error: err
                                                });
                                            });

                                    }
                                })
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            Error: err
                        });
                    });
          
    }







// // THIS FILE CONTAINS ALL THE CALLBACK FUNCTIONS OF VARIOUS ROUTES

// const jwt = require('jsonwebtoken'); //for signup and login facility to verify the user
// const User = require('../models/User.js');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');   //for encrypting the password to be sent over the server

// // define the cloudinary variable
// // const cloudinary = require('cloudinary').v2;

// // CONFIGURE THE USER BY TAKING API KEY AND API_SECRET FROM cloudinary offical website
// // cloudinary.config({
// //     cloud_name: 'dytrs9xrm',    //get these values from the cloudinary after login
// //     api_key: '497511148242921',
// //     api_secret: 'Q_600GQHaMngyaWWBfllQRkk-iQ'
// // });

// module.exports.getAllUsers = function (req, res) {
//     // fetching all the users from the mongoDB database
//     User.find()
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 AllUsers: result
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 Error: err
//             });
//         });
// };


// // to add the file over the server at cloudinary ...add the code there in post function
// // FUNCTION TO UPLOAD THE IMAGE IN CLOUDINARY

// // module.exports.createUser = function (req, res) {
// //     console.log(req.body)
// //     const file = req.files.photo;
// //     cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
// //         console.log(result);
// // }
// // )}


// // THE CREATE FUNCTION BEFORE ADDING THE PICTURE TO CLOUDINARY

// module.exports.createUser = function (req, res) {
//     bcrypt.hash(req.body.password, 10, async (err, hash) => {
//         if (err) {
//             return res.status(500).json({
//                 error: err
//             })
//         }
//         else {
//             const { username, email, password } = req.body
//             // FUNCTION TO MAKE THE EMAIL ENTER ONLY ONCE IN THE DATABASE
//             let user_exist = await User.findOne({ email: email });
//             if (user_exist) {
//                 res.json({
//                     success: false,
//                     message: "EMAIL already exists"
//                 })
//             }
//             else {
//                 let size = 200;
//                 let avatar = "https://gravatar.com/avatar/?s=" + size + '&d=retro';
//                 const user = new User({
//                     _id: new mongoose.Types.ObjectId,
//                     password: hash,
//                     username: req.body.username,
//                     email: req.body.email,
//                     avatar: avatar

//                 });
//                 const token = jwt.sign({
//                     username: username,
//                     email: email,
//                     avatar: avatar
//                 },
//                     "This is secret key",   //this key is to be used in check_auth file for verification in verify function
//                     {
//                         expiresIn: '24h'
//                     });

//                 user.save()
//                     .then(result => {
//                         console.log(result);
//                         res.status(200).json({
//                             newUser: result,
//                             token: token
//                         });
//                     })
//                     .catch(err => {
//                         console.log(err);
//                         res.status(500).json({
//                             Error: err
//                         });
//                     });
//             }


//         }
//     })
// };

// // FUNCTION FOR LOGGING IN USER (REQUIRES JWT INSTALLASTION)
// module.exports.loginUser = function (req, res) {

//     User.find({ email: req.body.email }).exec()
//         .then(user => {
//             if (user.length < 1) {
//                 res.status(500).json({
//                     errr: "user not found"
//                 })
//             }
//             bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//                 if (!result) {
//                     return res.status(500).json({
//                         errr: "Incorrect Password"
//                     })
//                 }
//                 if (result) {
//                     // if result match then create the token
//                     let size=200;
//                 let avatar = "https://gravatar.com/avatar/?s=" + size + '&d=retro';
//                     console.log("User logged in");
//                     const token = jwt.sign({
//                         username: user[0].username,
//                         email: user[0].email,
//                         avatar:avatar

//                     },
//                         "This is secret key",   //this key is to be used in check_auth file for verification in verify function
//                         {
//                             expiresIn: '24h'
//                         });
//                     res.status(200).json({
//                         message: "User logged in",
//                         username: user[0].username,
//                         email: user[0].email,
//                         avatar: avatar[0].avatar,
//                         token: token
//                     })

//                 }
//             })
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             })
//         })

// }

// module.exports.getUser = function (req, res) {
//     User.findById(req.params.id)
//         .then(result => {
//             console.log(result);
//             res.status(200).json({
//                 user: result
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 Error: err
//             });
//         });

// };

// // TO DELETE THE IMAGE FROM THE CLOUDNIARY AS WELL AS FROM MONGODB USE THIS METHOD
// // QUERY is used for deleteing the image from cloudinary using & , ?

// // http:// localhost:3000/users?id="123456" & imageURL=" "
// // using split() method to get the imageURL from the URL query

// module.exports.deleteData = function (req, res) {
//     const imageURL = req.query.imageURL;
//     const urlarr = imageURL.split("/")
//     const image = urlarr[urlarr.length - 1];
//     const Imagename = image.split(".")[0];

//     const userID = req.query.ID;
//     User.remove({ _id: userID }).
//         then(result => {

//             cloudinary.uploader.destroy(Imagename, (err, result) => {
//                 console.log(err, result);
//             })
//             res.status(200).json({
//                 message: result
//             })
//         }).catch(error => {
//             res.status(500).json({
//                 err: err
//             })
//         })
// }



// module.exports.deleteUser = function (req, res) {
//     User.remove({ _id: req.params.id })
//         .then(result => {
//             console.log("user Deleted");
//             res.status(200).json({
//                 messsage: 'id deleted',
//                 result: result
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 Error: err
//             });
//         });

// };

// module.exports.UpdateUser = function (req, res) {
//     User.findOneAndUpdate({ _id: req.params.id }, {
//         $set: {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,

//         }
//     })
//         .then(result => {
//             console.log("user Updated");
//             res.status(200).json({
//                 messsage: 'user Updated',
//                 updated_user: result    //the result will not be the updated value but the previous value
//                 //but the id got updated
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 Error: err
//             });
//         });

// };

// // 