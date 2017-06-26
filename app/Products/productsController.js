'use strict';

angular.module('productsApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'Products/products.html',
            controller: 'productsController'
        });
    }])


    .controller('productsController', ['$http', function($http) {
        var reqUrl = "http://localhost:3100/musicalsInstruments/getAllProducts";

        var self = this;
        self.products = [];
        $http.get(reqUrl)
            .then(function (response) {
                    console.log("**http Get!");
                    var productArr = response.data;
                    self.products = productArr;
                    console.log(productArr);

                },function (reason) {
                    console.log(reason.message)
                }
            )
        }]);