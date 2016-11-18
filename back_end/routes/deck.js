'use strict';
var router = require('express').Router();
var db = require('monk')(process.env.MONGODB_URI || 'localhost/mastermage');
var decks = db.get('decks');

router.post('/find', function(req, res) {
  decks.find({user: req.body.iat})
  .then(function(data) {
    console.log(data);
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  });
});


router.post('/', function(req, res) {
  decks.insert({
    user: req.body.user.iat,
    deck: req.body.deck
  })
  .then(function(data) {
    console.log(data);
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
  })
})


module.exports = router;
