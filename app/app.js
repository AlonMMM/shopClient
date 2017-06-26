'use strict';

// Declare app level module which depends on views, and components
var myApp=angular.module('myApp', [
  'ngRoute',
  'homeApp',
  'productsApp',
  'registrationApp',
  'myLoginApp',
  'myApp.version'
]);
myApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/products'});
}]);

