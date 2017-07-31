'use strict';

angular.module('registrationApp', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'Registration/registration.html'
        });
    }])

    .controller('registerController', ['userService', '$http','$location', '$window', function(userService, $http,$location, $window) {
        var registerUrl = "http://localhost:3100/users/registerUser";
        var c= this;
        c.logedIn="";
        c.countries= [];
        var countries = [{name: 'Mexico'},{name:'Israel'},{name:'Japan'} ,{name:'USA'} ,{name:'Egypt'}];
        c.countries= countries;
        c.mail="";
        c.password = "";
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
        };


    }]);

function cookieSet(musicMail,localStorageService , mail, password){
    var cookie = "";
    var decodeCookie = decodeURIComponent(document.cookie);
    var arr = decodeCookie.split(';');
    for (var i = 0; i < arr.length; i++) {
        var t = arr[i];
        while (t.charAt(0) === ' ') {
            t = t.substring(1);
        }
        if (t.indexOf(musicMail) === 0) {
            cookie = t.substring(musicMail.length, t.length);
        }
    }
    if (cookie === ""){
        if(localStorageService.cookie.set(mail, password))
            console.log("cookie good");
        else
            console.log("cookie bad");
    }
    else console.log("cookie already exist");
}