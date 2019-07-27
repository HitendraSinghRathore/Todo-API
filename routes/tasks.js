var express = require('express');
var router = express.Router();
var mongooseDb = require("mongoose");
var schemas = require('../schema');


var Schema = mongooseDb.Schema;
var objectId = mongooseDb.Types.ObjectId;

var Tasks = mongooseDb.model('tasks', schemas.taskSchema, 'tasks');

router.get('/getTasks/:user', function(req, res) {
    try {
        let userId = req.params.user;

        Tasks.find({ user: new objectId(userId) }).exec(function(err, tasks) {
            if (!tasks || tasks.length == 0) {
                res.status(404)
                res.send({
                    message: "No Tasks found",
                    data: err
                });
            } else {
                res.status(200);
                res.send({
                    tasksList: tasks
                });
            }
        });

    } catch (error) {
        res.status(500);
        res.send({

            message: "Internal Server Error",
            data: error
        });
    }
});

router.post('/addTask', function(req, res, next) {
    try {
        let task = new Tasks({
            user: new objectId(req.body.taskObj.user),
            description: req.body.taskObj.description,
            status: "new",
            date: Date.now()
        });
        task.save(function(err, taskSaved) {
            if (err) {
                res.status(500);
                res.send({
                    message: "Cannot save task",
                    data: err
                });
            } else {
                res.status(201);
                res.send({
                    message: "Task Added",
                    data: taskSaved
                });
            }
        })

    } catch (error) {
        res.status(500);
        res.send({
            message: "Internal Server Error",
            data: error
        });
    }

});

router.delete('/deleteTask/:taskId', function(req, res) {
    try {
        let taskId = req.params.taskId;
        Tasks.deleteOne({ _id: new objectId(taskId) }, function(err, result) {
            if (result.deletedCount == 0) {
                console.log("error");
                res.status(500);
                res.send({
                    message: "Error deleting task",
                    data: err
                });
            } else {

                res.status(200);
                res.send({
                    message: "Deleted Succesfully"
                })
            }
        })
    } catch (error) {

        res.send({
            message: "Internal Server Error",
            data: error
        })
    }
});

router.put('/updateTask', function(req, res) {
    try {
        Tasks.findOneAndUpdate({ _id: req.body.taskObj._id }, { $set: { status: req.body.taskObj.status } }, { new: true }, function(err, task) {
            if (err) {

                res.send({
                    message: "Cannot Update task",
                    data: err
                });
            } else {
                res.status(200);
                res.send({
                    message: "Task Updated",
                    data: task
                })
            }
        })
    } catch (error) {

        res.send({
            message: "Internal Server Error",
            data: error
        })
    }
})

module.exports = router;