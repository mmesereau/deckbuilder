'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
var app = express();
var expressJwt=require('express-jwt');
app.use(cors());
var bcrypt = require('bcrypt');

var register = require('./routes/register.js');
var login = require('./routes/login.js');
var deck = require('./routes/deck.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/register', register);
app.use('/login', login);
app.use('/deck', deck);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).json(err);
    });
}



app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Application is running on port:', port);
});
