'use strict';
var router = require('express').Router();
var jwt = require('jsonwebtoken');
// var knex = require('../db/knex');
var hash = require('./hash');
var bcrypt = require('bcrypt');
var db = require('monk')(process.env.MONGODB_URI || 'localhost/mastermage');
var users = db.get('users');

router.post('/', function(req, res) {
  console.log(req.body);
  hash(req.body.password)
  .then(function(result) {
    console.log("hashed");
    return users.insert({
      username: req.body.username,
      email: req.body.email,
      password: result
    })
    .then(function(data) {
      console.log("inserted into database");
      var profile = {
        id: data._id,
        username: data.username,
        email: data.email
      };
      var token = jwt.sign(profile, process.env.SECRET);
      res.status(200).json({
        token: token
      });
      res.send(data);
    })
    .catch(function(err) {
      console.log(err);
      res.send('failure!');
    })
  })
})


module.exports = router;
