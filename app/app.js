'use strict';

// Declare app level module which depends on views, and components
var myApp=angular.module('myApp', [
  'ngRoute',
  'homeApp',
  'productsApp',
  'registrationApp',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/products'});
}]);

function HeaderCtrl($scope) {
    $scope.header = {name: "header.html", url: "header.html"};
}
