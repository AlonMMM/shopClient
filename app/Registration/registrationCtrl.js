'use strict';

angular.module('registrationApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'Registration/registration.html'
        });
    }])

    .controller('registerController', ['$http', function($http) {
        var registerUrl = "http://localhost:3100/users/registerUser";
        var loginUrl = "http://localhost:3100/Login";
        var c= this;
        c.logedIn="";
        c.countries= [];
        var countries = [{name: 'Mexico'},{name:'Israel'}];
        c.countries= countries;
        c.mail="";
        c.password = "";
        c.lmail="";
        c.lpassword = "";
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
        c.firstPet="";
        c.response= "";

        c.register =function()
        {
            var inData= {
                "mail":c.mail,
                "pass":c.password,
                "fName":c.fName,
                "lName":c.lName,
                "phone":c.phone,
                "cellular":c.cellular,
                "addr": c.addr,
                "city": c.city,
                "country":c.country,
                "creditCardNum":c.creditCardNum,
                "isAdmin":c.isAdmin,
                "interest_types":c.interest_types.toString(),
                "school":c.school,
                "firstPet":c.firstPet};
            $http.post(registerUrl, inData)
                .then(function (response) {
                    var res = response.data;
                        c.response= res;
                    }, function (reason) {
                        c.response = "error is " + reason.message;
                    }
                )
        }


        c.logIn =function()
        {
            var inData= {
                "mail":c.lmail,
                "pass":c.lpassword};
            $http.post(loginUrl, inData)
                .then(function (response) {
                        var res = response.data;
                        c.response=res[0].Mail;
                        if (c.lmail===res[0].Mail)
                            c.logedIn=c.lmail;
                    }, function (reason) {
                        c.response = "error is " + reason.message;
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