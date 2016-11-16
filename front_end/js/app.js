'use strict';

var app = angular.module("MTGApp", [])
.controller("TestController", ["$http", function($http) {
  var vm = this;
  vm.api = "https://api.deckbrew.com/mtg/cards"
  $http.get(vm.api + "?name=black%20lotus")
  .then(function(data) {
    vm.cards = data.data;
    console.log(vm.cards);
  })
  .catch(function(err) {
    console.log(err);
  });
}]);
