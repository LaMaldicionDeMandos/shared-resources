/**
 * Created by boot on 4/4/16.
 */
'use strict';

/* Controllers */
angular.module('app.controllers', []).
    controller('firstLoginController', function($scope) {
        console.log("First Login activation: " + $scope.activation)
    });
