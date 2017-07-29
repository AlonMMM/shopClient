'use strict';

// Declare app level module which depends on views, and components
var myApp=angular.module('myApp', [
  'ngRoute',
  'homeApp',
  'productsApp',
  'registrationApp',
  'myLoginApp',
  'myApp.version',
    'ui.bootstrap',
    'LocalStorageModule',
    'cartApp'

]);

myApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

myApp.controller('mainController', ['userService','cartService','productDetailsService','$http','$location','$uibModal','localStorageService','$window','$scope', function(userService,cartService,productDetailsService,$http,$location,$uibModal, localStorageService,$window,$scope){
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

myApp.factory('cartService', function ($filter) {
    var service = {};
    service.productInCart =[];
    service.totalPrice = 0;
    service.insertToCart = function (product) {
        var productIndex = -1;
        for(var i = 0; i<service.productInCart.length ; i++)
        {
            if(service.productInCart[i].Musical_instrument === product.Musical_instrument){
                productIndex = i;
                break;
            }
        }
        if(productIndex===-1)
        {
            product.amount = 1;
            service.productInCart.push(product);
        }
        else
        {
            service.productInCart[productIndex].amount+=1;
        }
        service.totalPrice += product.Price;
        alert("Thank you , your product add to your cart!");
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

/*myApp.controller('detailsController', ['$uibModalInstance','productDetailsService','$http', function($uibModalInstance,productDetailsService,$http) {
        var self = this;
        self.detailService  = productDetailsService;
        self.productForModal  =  self.detailService.product;
        self.a = 5;
        console.log(self.a);

        var reqUrl = "http://localhost:3100/musicalsInstruments/getProductDetails";

    }]);
*/
myApp.controller('productDetailsModalController' , ['$scope', '$uibModalInstance','cartService' , 'prod',
    function ($scope, $uibModalInstance,cartService, prod) {
        $scope.msg = prod;
        var self = this;
        $scope.product = prod;
        $scope.confirm = function() {
            $uibModalInstance.close()
        };

        $scope.addToCart =  function(){
            cartService.insertToCart($scope.product);
            $scope.confirm();
        }
    }]);

myApp.factory('productDetailsService', function ($uibModal) {
    var service = {};
    service.product = {};
    service.productDetails = function (product) {

        var modalInstance = $uibModal.open({
            templateUrl: 'tamplates/productDetails.html',
            controller: 'productDetailsModalController',
            size: 'lg',
            resolve: {
                prod: function() {
                    return product
                }
            }
        });
    };
    return service;
});

myApp.factory('userService', ['$http','localStorageService', function ($http) {
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
                if(token === "wrong email or Password!")
                    return Promise.reject(res);
                console.log(token);
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

