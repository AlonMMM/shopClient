'use strict';

angular.module('myLoginApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/loginModal', {
            templateUrl: 'Login/loginModal.html',
            controller: 'loginController'
        });
    }])


    .controller('loginController', ['$http', function($http) {
        var reqUrl = "http://localhost:3100/musicalsInstruments/getTop5Products";


    }]);