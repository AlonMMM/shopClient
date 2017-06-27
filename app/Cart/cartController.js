/**
 * Created by windows on 25/06/2017.
 */
'use strict';

angular.module('cartApp', ['ngRoute','ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/cart', {
            templateUrl: 'Cart/cart.html'
        });
    }])

    .controller('cartController', ['productService','cartService','$http','$location','$uibModal', function(productService,cartService,$http,$location,$uibModal) {

        var self = this;
        self.products = cartService.getProductInCart();
        self.totalPrice = cartService.getTotalPrice();


    }]);