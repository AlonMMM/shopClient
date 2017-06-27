'use strict';

// Declare app level module which depends on views, and components
var myApp=angular.module('myApp', [
  'ngRoute',
  'homeApp',
  'productsApp',
  'registrationApp',
  'myLoginApp',
  'detailsApp',
  'myApp.version'
]);
myApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/products'});
}]);

myApp.factory('productService', function() {
    var service = {};
    function set(data) {
        service.productId = data;
    }
    function get() {
        return service.productId;
    }
    return {
        set: set,
        get: get
    }
});


myApp.factory('userService', ['$http', function ($http) {
    var service = {};
    service.isLoggedIn = false;
    service.login = function (user) {
        return $http.post('http://localhost:3100/Login', user)
            .then(function (res) {
                var tok = res.data;
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