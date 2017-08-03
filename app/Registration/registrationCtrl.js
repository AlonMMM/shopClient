'use strict';

angular.module('registrationApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'Registration/registration.html'
        });
    }])

    .controller('registerController', ['userService', '$http','$location', '$window','DataSource', function(userService, $http,$location, $window, DataSource) {
        var registerUrl = "http://localhost:3100/users/registerUser";
        var c = this;
        c.logedIn = "";
        c.countries = [];
        var countries = [{name: 'Mexico'}, {name: 'Israel'}, {name: 'Japan'}, {name: 'USA'}, {name: 'Egypt'}];
        c.countries = countries;
        c.mail = "";
        c.password = "";
        c.fName = "";
        c.lName = "";
        c.phone = "";
        c.cellular = "";
        c.addr = "";
        c.city = "";
        c.country = "";
        c.creditCardNum = "";
        c.isAdmin = 0;
        c.interest_types = "";
        c.school = "";
        c.firstPet = "";
        c.response = "";

        c.register = function () {
            var inData = {
                "mail": c.mail,
                "pass": c.password,
                "fName": c.fName,
                "lName": c.lName,
                "phone": c.phone,
                "cellular": c.cellular,
                "addr": c.addr,
                "city": c.city,
                "country": c.country,
                "creditCardNum": c.creditCardNum,
                "isAdmin": c.isAdmin,
                "interest_types": c.interest_types.toString(),
                "school": c.school,
                "firstPet": c.firstPet
            };
            $http.post(registerUrl, inData)
                .then(function (response) {
                        var res = response.data;
                        c.response = res;
                    }, function (reason) {
                        c.response = "error is " + reason.message;
                    }
                )
        };

        // $http({
        //     method: "GET",
        //     url:  "http://localhost:3100/countries.xml",
        // }).success(function(data)
        // {
        //     alert(data);
        //     var x2js = new X2JS();
        //     var json = x2js.xml_str2json(data);
        //     alert(json);
        // })
        //
        //
        // $http.get("countries",
        //     {
        //         transformResponse: function (cnv) {
        //             var x2js = new X2JS();
        //             var aftCnv = x2js.xml_str2json(cnv);
        //             return aftCnv;
        //         }
        //     })
        //     .success(function (response) {
        //         console.log(response);
        //     });
        var SOURCE_FILE = "file/countries.xml";
        var xmlTransform = function (data) {
            console.log("transform data");
            var x2js = new X2JS();
            var json = x2js.xml_str2json(data);
            return json.Countries;
        };
        var setData = function (data) {
            console.log("setData", data);
            self.countries = data;
            self.dataSet = data;
        };
        DataSource.get(SOURCE_FILE, setData, xmlTransform);

    }]);
