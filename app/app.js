'use strict';

// Declare app level module which depends on views, and components
var myApp=angular.module('myApp', [
  'ngRoute',
  'homeApp',
  'productsApp',
  'registrationApp',
  'myLoginApp',
  'detailsApp',
  'myApp.version',
    'ui.bootstrap'
]);
myApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/products'});
}]);

myApp.controller('mainController', ['userService','$http','$location','$uibModal', function(userService,$http,$location,$uibModal) {
    var self = this;
    self.userEmail = userService.getUserEmail();
}]);

myApp.factory('productService', function() {
    var service = {};
    service.productCategories=["Piano","Guitars","Saxophones","Trumpets","Flutes","Drums","Violins"];
    service.allCategory = function () {
        return service.productCategories;
    };
    service.set = function(data) {
        service.productId = data;
    };
    service.get = function() {
        return service.productId;
    };
    return service;
});


myApp.factory('userService', ['$http', function ($http) {
    var service = {};
    service.userEmail = "Guset"
    service.getUserEmail = function () {
        return service.userEmail;
    }
    
    service.isLoggedIn = false;
    service.login = function (user) {
        return $http.post('http://localhost:3100/Login', user)
            .then(function (res) {
                var tok = res.data;
                service.userEmail = res.data[0];
                $http.defaults.headers.common = {
                    //   'my-Token': tok,
                    'user': user.username
                };
                service.isLoggedIn = true;
                return Promise.resolve(res);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);