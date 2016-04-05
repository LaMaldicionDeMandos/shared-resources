/**
 * Created by boot on 3/7/16.
 */
'use strict';

/* Controllers */
angular.module('landingApp.controllers', []).
    controller('registerController', function($scope, userService) {
        console.log('Register Controller');
        $scope.user = {username:'', password: '', rePassword:'', email:''};
        $scope.errors = {};
        $scope.register = function() {
            $scope.success = false;
            $scope.errors = {};
            var valid = validateUser($scope.user);
            if (valid) {
                userService.register($scope.user).then(
                    function() {
                        $scope.success = true;
                    },
                    function(error) {
                        $scope.errors.user = error;
                    }
                );
            }
        };

        var validateUser = function(user) {
            var valid = true;
            if (!user.username || user.username.length == 0) {
                $scope.errors.username = 'invalid_username';
                valid = false;
            }

            if (!user.password || user.password.length == 0) {
                $scope.errors.password = 'invalid_password';
                valid = false;
            }

            if (user.password !=  user.rePassword) {
                $scope.errors.rePassword = 'invalid_re_password';
                valid = false;
            }

            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!re.test(user.email)) {
                $scope.errors.email = 'invalid_email';
                valid = false;
            }
            return valid;
        };
    })
    .controller('loginController', function($scope, $window, userService) {
        $scope.user = {username:'', password: ''};
        $scope.errors = {};
        $scope.login = function() {
            $scope.errors = {};
            var success = function() {
                $scope.success = true;
                $window.location.href = '/main';
            };
            var fail = function(error) {
                $scope.errors.user = error;
            };
            userService.login($scope.user).then(success, fail);
        };
    });
