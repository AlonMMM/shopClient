'use strict';

angular.module('productsApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'Products/products.html'

        });
    }])


    .controller('productsController', ['productService','$http', function(productService,$http) {
        var reqUrl = "http://localhost:3100/musicalsInstruments/getAllProducts";
        var self = this;
        self.allCatrgories = productService.allCategory();

        self.selctedCategory = function (category) {
            self.selectedCat = category;
        };
        self.products = [];
        //get all products and push into products arr.
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

        self.getCategory = function(){

        }
        }]);

myApp.filter('filterCategories', function ($log) {
    return function (items, cat) {
        var result = {};

        if (cat !== "") {
            angular.forEach(items, function (value, key) {
                if (key.includes(cat)) {
                    result[key] = value;
                }
            });
        }
        else {
            result = items;
        }
        return result;
    };
})