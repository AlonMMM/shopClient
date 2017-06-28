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
    'LocalStorageModule',
    'cartApp'

]);

myApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/home'});
}]);
myApp.controller('mainController', ['userService','cartService','productDetailsService','$http','$location','$uibModal','localStorageService','$window', function(userService,cartService,productDetailsService,$http,$location,$uibModal, localStorageService,$window){
    var self = this;
    self.userEmail = userService.userEmail;
    self.userService = userService;
    self.cartService = cartService;
    self.productDetailsService = productDetailsService;

    self.logOut=function() {
        userService.logOut(localStorageService);
        $window.alert('Bye Bye see you next time!!');
        $location.path('/home');
    }

    self.cartService = cartService;


    self.openContactModal = function () {
        $uibModal.open({
            templateUrl: 'tamplates/contactModal.html'
        });
    }

    self.openAboutModal = function () {
        $uibModal.open({
            templateUrl: 'tamplates/aboutModal.html'
        });
    }
}]);

myApp.factory('productService', function () {
    var service = {};
    service.productCategories=["Pianos","Guitars","Saxophones","Trumpets","Flutes","Drums","Violins"];
    service.allCategory = function () {
        return service.productCategories;
    };
    service.set = function (data) {
        service.productId = data;
    };
    service.get = function () {
        return service.productId;
    };
    return service;
});

myApp.factory('cartService', function () {
    var service = {};
    service.productInCart = [];
    service.totalPrice = 0;
    service.insertToCart = function (product) {
        service.totalPrice += product.Price;
        service.productInCart.push(product);
    };
    service.removeFromCart = function (product) {
        service.totalPrice -= product.Price;
        var index = service.productInCart.indexOf(product);
        service.productInCart.splice(index, 1);
    };
    service.getProductInCart = function () {
        return service.productInCart;
    };

    service.getTotalPrice = function () {
        return service.totalPrice;
    };
    return service;
});

myApp.factory('productDetailsService', function ($uibModal) {
    var service = {};
    service.product = {};
    service.totalPrice = 0;
    service.productDetails = function (product) {
        service.product = product;
        $uibModal.open({
            templateUrl: 'ProductDetails/productDetails.html',
            resolve: {
                product: function () {
                    return product;
                }
            }
        });
    };
    service.getProductInCart = function () {
        return service.productInCart;
    };
    service.getTotalPrice = function () {
        return service.totalPrice;
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
    };

    service.getLoggedIn = function(){
        return service.isLoggedIn;
    }
    return service;
}]);
