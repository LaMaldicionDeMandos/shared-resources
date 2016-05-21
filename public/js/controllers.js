/**
 * Created by boot on 4/4/16.
 */
'use strict';

/* Controllers */
angular.module('app.controllers', []).
    controller('headerController', function($scope, $modal, $window, userService) {
        if ($window.location.hash == '#_=_') {
            $window.location.href = '/';
        }
        if ($scope.activation != '') {
            console.log("First Login activation: " + $scope.activation);
            $scope.modal = $modal.open(
                {
                    templateUrl: 'modals/facebook_association',
                    scope: $scope,
                    size: '',
                    animation: true
                }
            );
        }
        $scope.dismiss = function() {
            $scope.modal.dismiss();
        };
        $scope.logout = function() {
            var success = function() {
                $window.location.href = '/index';
            };
            var fail = function(error) {
                console.log('Error on logout ' + error);
            };
            userService.logout().then(success, fail);
        };
    }).
    controller('adminsController', function($scope, userService) {
        $scope.form = {};
        $scope.nameIsValid = true;
        $scope.emailIsValid = true;
        $scope.validateEmail = function() {
            $scope.emailIsValid = userService.validateEmail($scope.form.email);
            return $scope.emailIsValid;
        };
        $scope.validateName = function() {
            $scope.nameIsValid = $scope.form.name && $scope.form.name.length > 0;
            return $scope.nameIsValid;
        }
        $scope.add = function() {
            if($scope.validateName() && $scope.validateEmail()) {
                var user = {
                    username: $scope.form.name,
                    email: $scope.form.email,
                    role: $scope.form.role ? 'sadmin' : 'admin'
                };
                swal('Hecho!','', 'success');
            } else {
            }
        };
    });
