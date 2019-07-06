var mongooseDb = require("mongoose");
var Schema = mongooseDb.Schema;
var objectId = Schema.Types.ObjectId;

module.exports.userSchema = new Schema({
    userName: String,
    password: String,
    displayName: String
});

module.exports.taskSchema = new Schema({
    user: objectId,
    description: String,
    status: String,
    date: Date
})