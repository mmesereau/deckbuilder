'use strict';
var router = require('express').Router();
var jwt = require('jsonwebtoken');
// var knex = require('../db/knex');
var hash = require('./hash');
var bcrypt = require('bcrypt');
var db = require('monk')(process.env.MONGODB_URI || 'localhost/mastermage');
var users = db.get('users');

router.post('/', function(req, res) {
  hash(req.body.password)
  .then(function(result) {
    return users.insert({
      username: req.body.username,
      email: req.body.email,
      password: result
    })
    .then(function(data) {
      var profile = {
        id: data._id,
        username: data.username,
        email: data.email
      };
      var token = jwt.sign(profile, process.env.SECRET);
      res.status(200).json({
        token: token
      });
    })
    .catch(function(err) {
      console.log(err);
      res.send('failure!');
    })
  })
})

router.post('/email', function(req, res) {
  users.find({email: req.body.email})
  .then(function(data) {
    if (data[0]) {
      res.send("Email Taken");
    }
    else {
      res.send("Clear");
    }
  })
  .catch(function(err) {
    res.send('failure!');
    console.log(err);
  });
});

router.post('/username', function(req, res) {
  users.find({username: req.body.username})
  .then(function(data) {
    if (data[0]) {
      res.send("Username Taken");
    }
    else {
      res.send("Clear");
    }
  })
  .catch(function(err) {
    res.send('failure!');
    console.log(err);
  });
});


module.exports = router;
