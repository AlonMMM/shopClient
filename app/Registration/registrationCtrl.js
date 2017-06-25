'use strict';

angular.module('registrationApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'Registration/registration.html',
            controller: 'registerController'
        });
    }])


    .controller('registerController', ['$http', function($http) {
        var reqUrl = "http://localhost:3100/musicalsInstruments/getTop5Products";


    }]);