/**
 * Created by boot on 4/10/16.
 */
describe('Services', function() {
    beforeEach(module('app.services'))
    var $httpBackend, $rootScope;
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.resetExpectations();
    });
    describe('userService', function () {
        describe('When logout', function() {
            beforeEach(function() {
                $httpBackend.whenGET('/logout').respond(200, {});
            });
            it('should call backend: /logout', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectGET('/logout');
                var promise = userService.logout({});
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
        describe('When new Admin', function() {
            var admin = {role: 'admin'};
            beforeEach(function() {
                $httpBackend.whenPOST('/admin', admin).respond(201, {});
            });
            it('should send a post with user', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectPOST('/admin');
                var promise = userService.newAdmin(admin);
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
        describe('Validate email', function() {
            it('Valid email should return true', inject(function(userService) {
                expect(userService.validateEmail('pasutmarcelo@gmail.com'));
            }));
            it('invalid email should return false', inject(function(userService) {
                expect(userService.validateEmail('pasutmarcelo'));
            }));
        });
        describe('Validate Twitter', function() {
            it('Valid twitter should return true', inject(function(userService) {
                expect(userService.validateTwitter('@marcelo.pasut'));
            }));
            it('invalid twitter should return false', inject(function(userService) {
                expect(userService.validateTwitter('pasutmarcelo'));
            }));
        });
        describe('When edit Admin', function() {
            var admin = {role: 'admin'};
            beforeEach(function() {
                $httpBackend.whenPUT('/admin', admin).respond(200, {});
            });
            it('should send a put with user', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectPUT('/admin');
                var promise = userService.edit(admin);
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
        describe('When delete Admin', function() {
            var admin = {_id: 'aaa'};
            beforeEach(function() {
                $httpBackend.whenDELETE('/admin/aaa').respond(200, {});
            });
            it('should send a delete with user', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectDELETE('/admin/aaa');
                var promise = userService.remove(admin);
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
        describe('When get profile', function() {
            beforeEach(function() {
                $httpBackend.whenGET('/user/aaa').respond(200, {});
            });
            it('should send a get to get profile', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectGET('/user/aaa');
                var promise = userService.findById('aaa');
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
        describe('when update user', function() {
            beforeEach(function() {
                $httpBackend.whenPUT('/user').respond(200, {});
            });
            it('should send a put to user', inject(function(userService) {
                var resolved = false;
                var reject = false;
                var user = {_id:'aaa'};
                $httpBackend.expectPUT('/user');
                var promise = userService.updateUser(user);
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
        describe('When get current user', function() {
            beforeEach(function() {
                $httpBackend.whenGET('/user/me').respond(200, {});
            });
            it('should send a get to me', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectGET('/user/me');
                var promise = userService.findCurrent();
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(true);
                expect(reject).toBe(false);
            }));
        });
    });
});