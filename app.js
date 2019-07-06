var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var indexRouter = require('./routes/login');
var taskRouter = require('./routes/tasks');
var bodyParser = require('body-parser');
var mongooseDB = require('mongoose');

var app = express();
var mongoUrl = "mongodb://admin:admin@cluster0-shard-00-00-uhtmy.mongodb.net:27017,cluster0-shard-00-01-uhtmy.mongodb.net:27017,cluster0-shard-00-02-uhtmy.mongodb.net:27017/TaskApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongooseDB.connect(mongoUrl, { useNewUrlParser: true });


// view engine setup

//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/login', indexRouter);

app.use('/api/tasks', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

});

module.exports = app;