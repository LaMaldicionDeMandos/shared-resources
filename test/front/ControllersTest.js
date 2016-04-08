/**
 * Created by boot on 4/7/16.
 */
describe('Controllers', function() {
    beforeEach(module('app'));
    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('firstLoginController', function() {
        var $scope, controller, $modal;
        beforeEach(function () {
            $scope = {};
            $modal = {open: function() { return true}};
        });
        describe('When controller init', function() {
            describe('If has activation', function() {
                beforeEach(function() {
                    $scope.modal = undefined;
                    $scope.activation = 'ac';
                    controller = $controller('firstLoginController', {$scope: $scope, $modal: $modal});
                });
                it('should show the facebook popup', function() {
                    expect($scope.modal).toBe(true);
                });
            });
            describe('If has not activation', function() {
                beforeEach(function() {
                    $scope.modal = undefined;
                    $scope.activation = '';
                    controller = $controller('firstLoginController', {$scope: $scope, $modal: $modal});
                });
                it('should not show the facebook popup', function() {
                    expect($scope.modal).toBe(undefined);
                });
            });
        });
    });
});