/**
 * Created by boot on 3/9/16.
 */
describe('Landing Controllers', function() {
    beforeEach(module('landingApp'));
    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('registerController', function() {
        var $scope, controller, service, promise;
        beforeEach(function () {
            $scope = {};
            promise = {then: function(success, error){success();}};
            service = {register: function(user){return promise;}};
            spyOn(service, 'register').and.callThrough();
            controller = $controller('registerController', {$scope: $scope, userService: service});
        });
        describe('When registerController init', function() {
            it('must init user', function () {
                expect($scope.user).not.toBe(undefined);
            });
            it('must init errors', function () {
                expect($scope.errors.username).toBe(undefined);
                expect($scope.errors.password).toBe(undefined);
            });
        });
        describe('Validate username', function() {
            it('must set error message to username field if username is invalid', function () {
                $scope.register();
                expect($scope.errors.username).toBe('invalid_username');
                expect(service.register).not.toHaveBeenCalled();
            });
            it('must not has error for username', function () {
                $scope.user.username = 'mandos'
                $scope.register();
                expect($scope.errors.username).toBe(undefined);
            });
        });

        describe('Validate password', function() {
            it('must set error message to password field is invalid', function () {
                $scope.register();
                expect($scope.errors.password).toBe('invalid_password');
                expect(service.register).not.toHaveBeenCalled();
            });

            it('must not has error for username', function () {
                $scope.user.password = 'password';
                $scope.register();
                expect($scope.errors.password).toBe(undefined);
            });
        });

        describe('Validate re password', function() {
            it('must set error message to repassword field if it is invalid', function () {
                $scope.user.password = 'password';
                $scope.user.rePassword = 'repassword';
                $scope.register();
                expect($scope.errors.rePassword).toBe('invalid_re_password');
                expect(service.register).not.toHaveBeenCalled();
            });

            it('must not has error for re password', function () {
                $scope.user.password = 'password';
                $scope.user.rePassword = 'password';
                $scope.register();
                expect($scope.errors.rePassword).toBe(undefined);
            });
        });

        describe('Validate Email', function() {
            it('must set error message to email field if it is invalid', function () {
                $scope.user.email = 'badeamil';
                $scope.register();
                expect($scope.errors.email).toBe('invalid_email');
                expect(service.register).not.toHaveBeenCalled();
            });

            it('must not has error for email', function () {
                $scope.user.email = 'pasutmarcelo@gmail.com';
                $scope.register();
                expect($scope.errors.email).toBe(undefined);
            });
        });

        describe('Validate All and after reset errors', function() {
            it('must set error message but reset it in second call', function () {
                $scope.user.email = 'badeamil';
                $scope.register();
                expect($scope.errors.email).toBe('invalid_email');
                $scope.user.email = 'pasutmarcelo@gmail.com';
                $scope.register();
                expect($scope.errors.email).toBe(undefined);
            });
        });

        describe('Validate All', function() {
            it('must error message empty and call register of service with user', function () {
                $scope.user.username = 'username';
                $scope.user.password = 'password';
                $scope.user.rePassword = 'password';
                $scope.user.email = 'pasutmarcelo@gmail.com';
                $scope.register();
                expect(service.register).toHaveBeenCalledWith($scope.user);
                expect($scope.success).toBe(true);
            });
        });

        describe('Validate All but service with errors', function() {
            beforeEach(function () {
                promise = {then: function(success, error){error('invalid');}};
                service = {register: function(user){return promise;}};
                spyOn(service, 'register').and.callThrough();
                controller = $controller('registerController', {$scope: $scope, userService: service});
            });
            it('should pass error to errors', function () {
                $scope.user.username = 'username';
                $scope.user.password = 'password';
                $scope.user.rePassword = 'password';
                $scope.user.email = 'pasutmarcelo@gmail.com';
                $scope.register();
                expect(service.register).toHaveBeenCalledWith($scope.user);
                expect($scope.success).toBe(false);
                expect($scope.errors.user).toBe('invalid');
            });
        });

        describe('Validate All but service with exist user', function() {
            beforeEach(function () {
                promise = {then: function(success, error){error('already_exist_user');}};
                service = {register: function(user){return promise;}};
                spyOn(service, 'register').and.callThrough();
                controller = $controller('registerController', {$scope: $scope, userService: service});
            });
            it('should pass error to errors', function () {
                $scope.user.username = 'username';
                $scope.user.password = 'password';
                $scope.user.rePassword = 'password';
                $scope.user.email = 'pasutmarcelo@gmail.com';
                $scope.register();
                expect(service.register).toHaveBeenCalledWith($scope.user);
                expect($scope.success).toBe(false);
                expect($scope.errors.user).toBe('already_exist_user');
            });
        });
    });
    describe('loginController', function() {
        var $scope, controller, service, promise;
        beforeEach(function () {
            $scope = {};
            promise = {then: function(success, error){success();}};
            service = {login: function(user){return promise;}};
            spyOn(service, 'login').and.callThrough();
            controller = $controller('loginController', {$scope: $scope, userService: service});
        });
        describe('Login with Errors', function() {
            beforeEach(function () {
                promise = {then: function(success, error){error('error');}};
                service = {login: function(user){return promise;}};
                spyOn(service, 'login').and.callThrough();
                controller = $controller('loginController', {$scope: $scope, userService: service});
            });
            it('should pass error to errors', function () {
                $scope.login();
                expect(service.login).toHaveBeenCalledWith($scope.user);
                expect($scope.errors.user).toBe('error');
            });
        })
    });
});