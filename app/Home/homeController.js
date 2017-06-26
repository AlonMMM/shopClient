'use strict';

angular.module('homeApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'Home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', ['$http', function($http) {
    var reqUrl = "http://localhost:3100/musicalsInstruments/getTop5Products";
    var self = this;
    self.products = [];
    self.getTop5Product =function()
    {
        $http.get(reqUrl)
            .then(function (response) {
                    console.log("**http Get!");
                    var productArr = response.data;
                    self.products = productArr;
                    console.log(productArr);

                }, function (reason) {
                    console.log(reason.message)
                }
            )
    }

}]);