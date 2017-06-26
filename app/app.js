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

