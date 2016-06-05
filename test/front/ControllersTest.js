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
        var $scope, controller, userService;
        beforeEach(function () {
            $scope = {};
            userService = {
                validateEmail: function(email){return false;},
                getAdmins: function(){return {then: function(){ return true;}};},
                edit: function(admin){return {then: function(){ return true;}};}
            };
            controller = $controller('adminsController', {$scope: $scope, userService: userService});
        });
        describe('Validate name', function() {
            it('should return true if name not is empty', function() {
                $scope.form.name = 'aa';
                var result = $scope.validateName();
                expect(result);
            });
            it('should return false if name is empty', function() {
                $scope.form.name = '';
                var result = $scope.validateName();
                expect(!result);
            });
            it('should return false if name is undefined', function() {
                var result = $scope.validateName();
                expect(!result);
            });
        });
        describe('Validate email', function() {
            beforeEach(function () {
                spyOn(userService, 'validateEmail').and.returnValue(false);
                controller = $controller('adminsController', {$scope: $scope, userService: userService});
            });
            it('should return same as userService', function() {
                $scope.form.email = 'blabla';
                var result = $scope.validateEmail();
                expect(userService.validateEmail).toHaveBeenCalled();
                expect(!result);
            });
        });
        describe('When press add admin', function() {
            beforeEach(function () {
                promise = {then: function(success, error){success();}};
                userService = {
                    newAdmin: function(user){return promise;},
                    validateEmail: function(email){return true;},
                    getAdmins: function(){return {then: function(){ return true;}};}};
                spyOn(userService, 'newAdmin').and.returnValue(promise);
                controller = $controller('adminsController', {$scope: $scope, userService: userService});
            });
            it('should create an user with username, email, and role', function() {
                swal = function() {};
                $scope.form.name = 'bla';
                $scope.form.email = 'a@gmail.com';
                $scope.form.role = false;
                $scope.add();
                expect(userService.newAdmin).toHaveBeenCalledWith({username: 'bla', email: 'a@gmail.com', role:'admin'});
            });
            it('if dto.role == true, then create an user with sadmin role', function() {
            });
            it('if dto.role == false, then create an user with admin role', function() {
            });
        });
        describe('When click to edit', function() {
            var admin = {};
            it('Admin must has $edit to true', function() {
                $scope.edit(admin);
                expect(admin.$edit == true);
            });
        });

        describe('When click to save edit', function() {
            var admin = {$edit: true};
            beforeEach(function() {
                var promise = {then: function(success, error){success();}};
                userService = {
                    getAdmins: function(){return promise;},
                    edit: function(admin){return promise;}
                };
                spyOn(userService, 'edit').and.returnValue(promise);;
                controller = $controller('adminsController', {$scope: $scope, userService: userService});
            });
            it('Admin must has $edit to false', function() {
                $scope.saveEdit(admin);
                expect(admin.$edit == false);
            });
            it('Should call edit user on service', function() {
                $scope.saveEdit(admin);
                expect(userService.edit).toHaveBeenCalledWith(admin);
            });
        });

        describe('When click to delete', function() {
            var admin = {};
            beforeEach(function() {
                var promise = {then: function(success, error){success();}};
                userService = {
                    getAdmins: function(){return promise;},
                    remove: function(admin){return promise;}
                };
                spyOn(userService, 'remove').and.returnValue(promise);;
                controller = $controller('adminsController', {$scope: $scope, userService: userService});
            });
            it('Should call remove user on service', function() {
                $scope.admins = [admin];
                $scope.remove(admin);
                expect(userService.remove).toHaveBeenCalledWith(admin);
                expect($scope.admins.length == 0);
            });
        });
    });
});