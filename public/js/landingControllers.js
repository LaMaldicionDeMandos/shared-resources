/**
 * Created by boot on 3/7/16.
 */
'use strict';

/* Controllers */

angular.module('landingApp.controllers', []).
    controller('registerController', function($scope) {
        console.log('Register Controller');
        $scope.user = {username:'', password: '', rePassword:'', email:''};

        $scope.register = function() {
            console.log(JSON.stringify($scope.user));
        };
    });