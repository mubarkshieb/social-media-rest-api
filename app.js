const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Create & import Routes
const userRouter = require('./api/routes/user');
const operatinRouter = require('./api/routes/operatins')
const timelineRouter = require('./api/routes/post');

// Connect To Database
mongoose.connect('mongodb://localhost/socialmedai');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT,GET,POST,PATCH,DELETE");
        return res.status(200).json({})
    }
    next();
});

//use Routes
app.use('/user', userRouter);
app.use('/ops', operatinRouter)
app.use('/timeline', timelineRouter);


//Error Handler
app.use((req, res, next) => {
    const error = new Error('Page not found !');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;