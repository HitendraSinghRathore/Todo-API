var express = require('express');
var router = express.Router();
var enc = require('../encrypt');
var schemas = require('../schema');

var mongooseDb = require("mongoose");


var Users = mongooseDb.model('users', schemas.userSchema, 'users');


router.post('/', function(req, res, next) {
    console.log("CALLED");

    try {
        let userObj = req.body.userObj;
        console.log(userObj);
        Users.findOne({ userName: userObj.userName }, function(err, user) {
            if (!user) {
                res.status(404);
                res.json({
                    message: "User Record not found",
                    data: err
                });
            } else
                enc.decryptPassword(userObj.password, user.password, function(error, result) {
                    if (error) {
                        res.status(500);
                        res.json({
                            message: "Internal Server Error",
                            data: error
                        });
                    }
                    if (result == true) {
                        let returnUser = {
                            userName: user.userName,
                            _id: user._id,
                            displayName: user.displayName
                        }
                        res.status(200);
                        res.json({
                            data: returnUser
                        });
                    } else {
                        res.status(401);
                        console.log("dsds")
                        res.json({
                            message: "Unauthorised User"
                        })
                    }
                });

        })
    } catch (error) {
        res.status(500);
        res.json({
            message: "Internal Server Error ",
            data: error
        })
    }


});


router.post('/addUser', function(req, res, next) {
    try {


        let userObj = req.body.userObj;

        Users.findOne({ userName: userObj.userName }, function(err, user) {
            if (user) {
                res.status(403);
                res.json({
                    message: "User Already exists",
                    data: err
                });
            } else {
                enc.cryptPassword(userObj.password, function(error, hash) {
                    if (error) {
                        res.status(500);
                        res.json({
                            message: "Internal Server Error",
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
                                res.json({
                                    message: "Cannot save user",
                                    data: error
                                });
                            } else {
                                let returnUser = {
                                    _id: userSave._id,
                                    userName: userSave.userName,
                                    displayName: userSave.displayName
                                };
                                res.status(201);
                                res.json({
                                    message: "User created",
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
        res.json({
            message: "Internal Server Error",
            data: error
        })
    }
});
module.exports = router;