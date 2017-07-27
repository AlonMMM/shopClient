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
    self.test = "test";
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

myApp.factory('cartService',['localStorageService', function (localStorageService) {
    var service = {};
    service.productInCart = [];
    service.totalPrice = 0;

    service.insertToCart = function (product) {
        service.totalPrice += product.Price;
        service.productInCart.push(product);
        localStorageService.set("cart", service.productInCart);
        localStorageService.set("totalPrice", service.totalPrice);
    };
    service.removeFromCart = function (product) {
        service.totalPrice -= product.Price;
        var index = service.productInCart.indexOf(product);
        service.productInCart.splice(index, 1);
        localStorageService.set("cart", service.productInCart);
        localStorageService.set("totalPrice", service.totalPrice);
    };
    service.getProductInCart = function () {
        return service.productInCart;
    };

    service.getTotalPrice = function () {
        return service.totalPrice;
    };

    service.setFullCart=function(){
        service.productInCart=localStorageService.get("cart");
        service.totalPrice= localStorageService.get("totalPrice");
    };


    return service;
}]);

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


myApp.factory('userService', ['$http','localStorageService','cartService', function ($http, localStorageService,cartService) {
    var service = {};
    var userInStorage =  localStorageService.cookie.get("mail");
    if(userInStorage!=null)
    {
        service.userEmail=userInStorage;
        service.isLoggedIn = true;
        service.lastEntry=  localStorageService.cookie.get("lastEntry");
        var date = new Date();
        var dateString = date.toString();
        dateString = dateString.substring(0, dateString.indexOf("G"));
        service.lastLogin = "Last Entry: "+service.lastEntry;
        console.log("In userService - in storage: "+service.userEmail);
        localStorageService.cookie.set("lastEntry", dateString);
        cartService.setFullCart();
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
                service.cookieSet(user.mail,user.pass);
                service.lastLogin = "Last Entry: "+ localStorageService.cookie.get("lastEntry");
                service.isLoggedIn = true;
                service.userEmail = localStorageService.cookie.get("mail");
                return Promise.resolve(res);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };

    service.cookieSet=function(mail, password)
    {
        if (localStorageService.cookie.get("mail") == null) {
            localStorageService.cookie.set("mail", mail);
            localStorageService.cookie.set("password", password);
            var date = new Date();
            var dateString = date.toString();
            dateString = dateString.substring(0, dateString.indexOf("G"));
            localStorageService.cookie.set("lastEntry", dateString);
            console.log("cookie created!!!");
            // console.log(localStorageService.cookie.get("mail"));
            // console.log(localStorageService.cookie.get("password"));
            // console.log(localStorageService.cookie.get("lastEntry"));
        }
        else {
            console.log("cookie already exist");
            // console.log(localStorageService.cookie.get("mail"));
            // console.log(localStorageService.cookie.get("password"));
            // console.log(localStorageService.cookie.get("lastEntry"));
        }
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
