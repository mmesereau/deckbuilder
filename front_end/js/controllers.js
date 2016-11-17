'use strict';

app.controller("HomeController", ["HomeService", "$state", "$rootScope", "$window", "$http", function(HomeService, $state, $rootScope, $window, $http) {
  var vm = this;
  vm.$state = $state;
  if ($window.localStorage.token) {
    vm.loggedIn = true;
    $rootScope.profile = HomeService.getProfile();
  }
  vm.logout = function() {
    delete $window.localStorage.token;
    vm.loggedIn = false;
  };
  vm.search = function() {
    var api = "https://api.deckbrew.com/mtg/cards"
    vm.card.replace(" ", "%20");
    $http.get(api + "?name=" + vm.card)
    .then(function(data) {
      $rootScope.searchResults = data.data;
      $state.go('search');
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}]);

app.controller("RegisterController", ["RegisterService", "$state", "$rootScope", "$window", "$http", function(RegisterService, $state, $rootScope, $window, $http) {
  var vm = this;
  if ($window.localStorage.token) {
    $state.go("home");
  }
  vm.user = {};
  vm.register = function() {
    RegisterService.register(vm.user);
  }
}]);

app.controller("LoginController", ["LoginService", "$state", "$rootScope", "$window", "$http", function(LoginService, $state, $rootScope, $window, $http) {
  var vm = this;
  if ($window.localStorage.token) {
    $state.go("home");
  }
  vm.user = {};
  vm.login = function() {
    LoginService.login(vm.user);
  }
}]);

app.controller("SearchController", ["SearchService", "$state", "$rootScope", "$window", "$http", function(SearchService, $state, $rootScope, $window, $http) {
  var vm = this;
  $("#searchbar").innerText = "";
  if (!$rootScope.searchResults) {
    $state.go("home");
  }
}]);

app.controller("AdvancedController", ["AdvancedService", "$state", "$rootScope", "$window", "$http", function(AdvancedService, $state, $rootScope, $window, $http) {
  var vm = this;
  vm.options = {};
  vm.multicolor = false;
  vm.getOptions = function() {
    var api = "https://api.deckbrew.com/mtg/";
    $http.get(api + "sets")
    .then(function(data) {
      vm.options.sets = data.data;
      return $http.get(api + "types");
    })
    .then(function(data) {
      vm.options.types = data.data;
      return $http.get(api + "supertypes");
    })
    .then(function(data) {
      vm.options.supertypes = data.data;
      return $http.get(api + "subtypes");
    })
    .then(function(data) {
      vm.options.subtypes = data.data;
      return $http.get(api + "colors");
    })
    .then(function(data) {
      vm.options.colors = data.data;
      for (var i = 0; i < vm.options.colors.length; i++) {
        vm.criteria.colors.push(false);
      }
      console.log(vm.options);
      return "done";
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  vm.criteria = {
    format: [false, false, false, false, false],
    colors: [],
    rarity: [false, false, false, false],
    allcolors: [false]
  };
  vm.getOptions();
  vm.options.format = ["commander", "legacy", "vintage", "modern", "standard"];
  vm.options.rarity = ["common", "uncommon", "rare", "mythic"];
  vm.search = function() {
    AdvancedService.search(vm.criteria, vm.options);
    console.log(vm.criteria);
  };
  vm.colorLength = function() {
    var selected = 0;
    for (var i = 0; i < vm.criteria.colors.length; i++){
      if (vm.criteria.colors[i]) {
        selected++;
      }
    }
    if (selected >= 2) {
      vm.multicolor = true;
    }
    else {
      vm.multicolor = false;
    }
  }
}]);
