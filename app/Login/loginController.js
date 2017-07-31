'use strict';

angular.module('myLoginApp', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loginModal', {
            controller: 'loginController'
        });
    }])


    .controller('loginController', ['$http', 'loginService','userService','$scope','$uibModalInstance', function ($http, loginService,userService,$scope,$uibModalInstance) {
        var self = this;
        self.loginService = loginService;
        self.loginService  = userService;
        //self.logIn = userService.logIn();

        $scope.user= {
            mail:'',
            pass:''};
        $scope.logIn =function(valid)
        {
            if(valid){
                userService.login($scope.user)
                    .then(function (succes){
                            alert('You are logged in!');
                            $scope.close();
                            self.response= succes.data;
                        },function(error){
                            self.response= error.message;
                            alert('Login failed!');
                        }
                    )
            }
        }
        self.forgetUser= {
            mail:'',
            school:'',
            firstPet: ''};
        self.restorePassword =function(valid) {
            if (valid) {
                $http.post('http://localhost:3100/users/verifyUserAndRestorePass',  self.forgetUser)
                    .then(function (response) {
                            var res = response.data;
                            self.response=res[0].Password;
                            console.log(res[0].Password);
                            console.log(self.response);
                        }, function (reason) {
                            self.response = "error is " + reason.message;
                            console.log(reason);
                        }
                    )
            }
        }

        $scope.close = function () {
            $uibModalInstance.close();

        }
    }])