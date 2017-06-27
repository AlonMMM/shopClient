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
    'ui.bootstrap',
    'LocalStorageModule'
]);
myApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider, localStorageServiceProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/products'});
 // localStorageServiceProvider.setPrefix('music_');
}]);
myApp.controller('mainController', ['userService','$http','$location','$uibModal','localStorageService','$window', function(userService,$http,$location,$uibModal, localStorageService,$window){
    var self = this;
    self.userEmail = userService.userEmail;
    self.userService = userService;

    self.logOut=function() {
        userService.logOut(localStorageService);
        $window.alert('Bye Bye see you next time!!');
        $location.path('/home');
    }
}]);
myApp.factory('productService', function() {
    var service = {};
    service.productCategories=["Pianos","Guitars","Saxophones","Trumpets","Flutes","Drums","Violins"];
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
    var userInStorage =  decodeURIComponent(document.cookie);
    if(userInStorage!="")
    {
        service.userEmail=userInStorage.substring(3,userInStorage.indexOf("="));
        service.isLoggedIn = true;
        var date = new Date();
        var dateString = date.toString();
        dateString = dateString.substring(0, dateString.indexOf("G"));
        service.lastLogin = "Last Entry: "+dateString;
        console.log("2. in storage: "+service.userEmail);
    }
    else
    {
        service.userEmail= "Guest";
        service.isLoggedIn = false;
        service.lastLogin = "";
    }
    service.login = function (user) {
        return $http.post('http://localhost:3100/Login', user)
            .then(function (res) {
                var token = res.data;
                $http.defaults.headers.common = {
                    'my-Token': token,
                    'user': user.mail,
                    'lastLogin' : user.lastLogin
                };
                var date = new Date();
                var dateString = date.toString();
                dateString = dateString.substring(0, dateString.indexOf("G"));
                service.lastLogin = "Last Entry: "+dateString;
                service.isLoggedIn = true;
                service.userEmail = user.mail;
               //  var musicMail= user.mail+"=";
               // cookieSet(musicMail , localStorageService , user.mail, user.pass);
                return Promise.resolve(res);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };

    service.logOut=function(localStorageService){
        localStorageService.cookie.clearAll();
        localStorageService.clearAll();
        service.userEmail= "Guest";
        service.isLoggedIn = false;
        service.lastLogin = "";
    }
    return service;
}]);
