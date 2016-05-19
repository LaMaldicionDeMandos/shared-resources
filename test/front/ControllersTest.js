/**
 * Created by boot on 4/7/16.
 */
describe('Controllers', function() {
    beforeEach(module('app'));
    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('Header Controller', function() {
        var $scope, controller, $modal, $window;
        beforeEach(function () {
            $scope = {};
            $modal = {open: function() { return true}};
        });
        describe('When controller init', function() {
            describe('If has activation', function() {
                beforeEach(function() {
                    $scope.modal = undefined;
                    $scope.activation = 'ac';

                });
                it('should show the facebook popup', function() {
                    controller = $controller('headerController', {$scope: $scope, $modal: $modal});
                    expect($scope.modal).toBe(true);
                });
            });
            describe('If has not activation', function() {
                beforeEach(function() {
                    $scope.modal = undefined;
                    $scope.activation = '';
                    controller = $controller('headerController', {$scope: $scope, $modal: $modal});
                });
                it('should not show the facebook popup', function() {
                    expect($scope.modal).toBe(undefined);
                });
            });
        });
        describe('Logout', function() {
            beforeEach(function() {
                $window = {location: {}};
                $scope.modal = undefined;
                $scope.activation = '';
                promise = {then: function(success, error){success();}};
                service = {logout: function(){return promise;}};
                spyOn(service, 'logout').and.callThrough();
                controller = $controller('headerController', {$scope: $scope, $modal: $modal, $window: $window,
                    userService: service});
            });
            it('should logout with service', function() {
                $scope.logout();
                expect(service.logout).toHaveBeenCalled();
                expect($window.location.href).toBe('/index');
            });
        });
    });
    describe('AdminsController', function() {
        var $scope, controller;
        beforeEach(function () {
            $scope = {};
            controller = $controller('adminsController', {$scope: $scope});
        });
        describe('When press add admin', function() {
            it('show new admin popup', function() {
            })
        });
    });
});