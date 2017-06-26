'use strict';

angular.module('registrationApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'Registration/registration.html'
        });
    }])

    .controller('registerController', ['$http', function($http) {
        var registerUrl = "http://localhost:3100/users/registerUser";
        var c= this;
        c.countries= [];
        var countries = [{name: 'Mexico'},{name:'Israel'}];
        c.countries= countries;
        c.mail="hi";
        c.pass = "";
        c.fName= "";
        c.lName= "";
        c.phone="";
        c.cellular="";
        c.addr="";
        c.city="";
        c.country="";
        c.creditCardNum="";
        c.isAdmin=0;
        c.interest_types="";
        c.school= "";
        c.firsPet="";
        c.error= "";
        console.log("the mail: "+c.mail);

        c.register =function()
        {
            console.log("1");
            console.log("the mail: "+c.mail);
            var inData= {   "mail":c.mail,
                "password":c.pass,
                "fName":c.fName,
                "lName":c.lName,
                "phone":c.phone,
                "cellular":c.cellular,
                "addr": c.addr,
                "city": c.city,
                "country":c.country,
                "creditCardNum":c.creditCardNum,
                "isAdmin":c.isAdmin,
                "interest_types":c.interest_types,
                "School":c.school,
                "firstPet":c.firsPet}
            console.log("2");
            $http.post(registerUrl, inData)

                .then(function (response) {
                        console.log("**http Post!");
                        var res = response.data;
                        console.log(res);
                    }, function (reason) {
                        c.error = reason;
                        console.log(reason.message)

                    }
                )
        }

        /**   registrationApp.directive('myDirective', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, mCtrl) {
                    function myValidation(value) {
                        if (value.indexOf("e") > -1) {
                            c.$setValidity('charE', true);
                        } else {
                            c.$setValidity('charE', false);
                        }
                        return value;
                    }
                    mCtrl.$parsers.push(myValidation);
                }
            };
     });**/
    }]);