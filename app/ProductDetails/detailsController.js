/**
 * Created by windows on 26/06/2017.
 */
'use strict';

angular.module('detailsApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/productDetails', {
            templateUrl: 'ProductDetails/productDetails.html'
        });
    }])

    .controller('detailsController', ['productService','$http', function(productService,$http) {
        var self = this;
        self.productId = productService.get();
        var reqUrl = "http://localhost:3100/musicalsInstruments/getProductDetails";

        self.getDetails = function () {
            var inData = { "instrumentID" : self.productId } ;
            console.log(inData);
            $http.post(reqUrl,inData)
                .then(function (response) {
                        console.log("**http post!");
                        var productObj = response.data;
                        self.productObject = productObj[0];
                        console.log(productObj);

                    }, function (reason) {
                        console.log(reason.message)
                    }
                )};

        self.getDetails();
    }]);