'use strict';

angular.module('homeApp', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'Home/home.html'
  });
}])

.controller('homeCtrl', ['productService','$http','$location','$uibModal', function(productService,$http,$location,$uibModal) {

    var reqUrl = "http://localhost:3100/musicalsInstruments/getTop5Products";

    var self = this;
    self.products = [];
    self.getTop5Product =function() {
        $http.get(reqUrl)
            .then(function (response) {
                    var productArr = response.data;
                    self.products = productArr;
                    console.log(productArr);

                }, function (reason) {
                    console.log(reason.message)
                }
            )
    }

    self.getTop5Product();

    self.detail = function (product) {
        $uibModal.open({
            templateUrl: 'ProductDetails/productDetails.html',
            resolve: {
                product: function () {
                    return product;
                }
            }
        });

        // productService.set(product);
        // $location.path("/productDetails");
    }

}]);