'use strict';
var bcrypt = require('bcrypt');

function hash(password) {
  console.log("hash begun");
    return new Promise(function(resolve, reject) {
      console.log("second hash step");
        bcrypt.genSalt(8, function(err, salt) {
            if (err) {
                reject(err);
            } else {
              console.log("salt");
                bcrypt.hash(password, salt, function(err, result) {
                    if (err) {
                      console.log(err);
                        reject(err);
                    } else {
                      console.log(result);
                        resolve(result);
                    }
                });
            }
        });
    });
}


module.exports = hash;
