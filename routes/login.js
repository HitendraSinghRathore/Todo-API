var express = require('express');
var router = express.Router();
var enc = require('../encrypt');
var schemas = require('../schema');

var mongooseDb = require("mongoose");


var Users = mongooseDb.model('users', schemas.userSchema, 'users');


router.post('/', function(req, res, next) {
    console.log("CALLED");

    try {
        let userObj = req.body;

        Users.findOne({ userName: userObj.userName }, function(err, user) {
            console.log("In");
            if (!user) {
                res.status(404);
                res.send({
                    message: "Invalid username or password.",
                    data: err
                });
            } else
                enc.decryptPassword(userObj.password, user.password, function(error, result) {
                    if (error) {
                        console.log("Some error")
                        res.status(500);
                        res.send({
                            message: "Some error occured.",
                            data: error
                        });
                    }
                    if (result == true) {
                        console.log("User ducces")
                        let returnUser = {
                            userName: user.userName,
                            _id: user._id,
                            displayName: user.displayName
                        }
                        res.status(200);
                        res.send({
                            data: returnUser
                        });
                    } else {


                        res.status(401);
                        res.send({
                            message: "Invalid username or password."
                        })
                    }
                });

        })
    } catch (error) {
        res.status(500);
        res.send({
            message: "Internal Server Error ",
            data: error
        })
    }


});


router.post('/addUser', function(req, res, next) {
    try {


        let userObj = req.body;
        console.log(userObj)

        Users.findOne({ userName: userObj.userName }, function(err, user) {
            if (user) {
                res.status(400);
                res.send({
                    message: "User Already exists. Try loggin in.",
                    data: err
                });
            } else {
                enc.cryptPassword(userObj.password, function(error, hash) {
                    if (error) {
                        res.status(500);
                        res.send({
                            message: "Some error occured.",
                            data: error
                        });
                    } else {
                        let newUser = new Users({
                            userName: userObj.userName,
                            password: hash,
                            displayName: userObj.displayName
                        });
                        newUser.save(function(error, userSave) {
                            if (err) {
                                res.status(500);
                                res.send({
                                    message: "Some error occured, please try again later.",
                                    data: error
                                });
                            } else {
                                let returnUser = {
                                    _id: userSave._id,
                                    userName: userSave.userName,
                                    displayName: userSave.displayName
                                };
                                res.status(201);
                                res.send({
                                    message: "User creation success.",
                                    data: returnUser
                                });
                            }
                        })
                    }
                })
            }

        })

    } catch (error) {
        res.status(500);
        res.send({
            message: "Internal Server Error",
            data: error
        })
    }
});
module.exports = router;