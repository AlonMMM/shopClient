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

myApp.factory('cartService',['localStorageService', function (localStorageService) {
    var service = {};
    service.productInCart = [];
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
        service.totalPrice += product.Price;
        service.productInCart.push(product);
        localStorageService.set("cart", service.productInCart);
        localStorageService.set("totalPrice", service.totalPrice);
        alert("Thank you , your product add to your cart!");
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
                if(token === "wrong email or Password!")
                    return Promise.reject(res);
                console.log(token);
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
