'use strict';

angular.module('productsApp', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/products', {
            templateUrl: 'Products/products.html'

        });
    }])


    .controller('productsController', ['userService','productService', '$http', function (userService,productService, $http) {
        var reqUrl = "http://localhost:3100/musicalsInstruments/getAllProducts";
        var self = this;
        self.allCatrgories = productService.allCategory();
        self.isCategoryChoose = false;
        self.sortChoose = false;

        self.AllProduct = [];

        self.recomededProduct = [];
        self.products = [];


        self.userService = userService;
        self.searchProduct = "";

        self.showSerchProduct = false;

        self.searchInputIsDirty = function(){
            return self.searchProduct==="";
        };

        //buttun sort clicked
        self.sortChooseen = function(){
            self.sortChoose = true;

        };
        //get all products and push into products arr.

        $http.get(reqUrl)
            .then(function (response) {
                    console.log("**http Get!");
                    var productArr = response.data;
                    self.products = productArr;
                    self.productsByCategory=productArr;
                    console.log(productArr);

                }, function (reason) {
                    console.log(reason.message)
                }
            );

        $http.post("http://localhost:3100/users/getMatchProduct",{mail: userService.userEmail})
            .then(function (response) {
                    console.log("**http Get!");
                    var productArr = response.data;
                    self.recomededProduct = productArr;
                    console.log(productArr);

                }, function (reason) {
                    console.log(reason.message)
                }
            );
        self.productCat = [];
        self.selctedCategory = function (category) {
            self.isCategoryChoose=true;
            self.selectedCat = {Category : category};
            $http.post("http://localhost:3100/musicalsInstruments/getProductByCategory", self.selectedCat)
                .then(function (response) {
                        console.log("**http Get!");
                        var productArr = response.data;
                        self.productsByCategory = productArr;
                        console.log(productArr);


                    }, function (reason) {
                        console.log(reason.message)
                    }
                )
        }
        //categories sorter:
    }]);