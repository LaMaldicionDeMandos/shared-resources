/**
 * Created by boot on 4/4/16.
 */
'use strict';

/* Controllers */
angular.module('app.controllers', []).
    controller('firstLoginController', function($scope, $modal) {
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
        }
    });
