'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
    'ngRoute',
    'homeApp',
    'productsApp',
    'registrationApp',
    'myLoginApp',
    'detailsApp',
    'myApp.version',
    'ui.bootstrap',
    'cartApp'
]);
myApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/products'});
}]);

myApp.controller('mainController', ['userService', 'cartService','productDetailsService', '$http', '$location', '$uibModal', function (userService, cartService,productDetailsService, $http, $location, $uibModal) {
    var self = this;
    self.userEmail = userService.getUserEmail();
    self.cartService = cartService;
    self.productDetailsService = productDetailsService;

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
    service.productCategories = ["Piano", "Guitars", "Saxophones", "Trumpets", "Flutes", "Drums", "Violins"];
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
    service.userEmail = "Guset";
    service.getUserEmail = function () {
        return service.userEmail;
    }

    service.isLoggedIn = false;
    service.login = function (user) {
        return $http.post('http://localhost:3100/Login', user)
            .then(function (res) {
                var tok = res.data;
                service.userEmail = res.data[0];
                $http.defaults.headers.common = {
                    //   'my-Token': tok,
                    'user': user.username
                };
                service.isLoggedIn = true;
                return Promise.resolve(res);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);