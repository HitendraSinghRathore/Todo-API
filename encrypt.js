var bcrypt = require("bcryptjs");



module.exports.cryptPassword = function(password, callback) {

    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            return callback(err);
        else
            bcrypt.hash(password, salt, function(err, hash) {
                return callback(err, hash);
            })
    })
};

module.exports.decryptPassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, result) {
        if (err)
            return callback("");
        else
            return callback(null, result);
    })
};