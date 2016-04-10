/**
 * Created by boot on 3/11/16.
 */
describe('Landing Services', function() {
    beforeEach(module('landingApp.services'))
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
    describe('userService', function() {
        describe('When call register with valid user', function() {
            beforeEach(function() {
                $httpBackend.whenPOST('/register').respond(201, {});
            });
            it('should call backend: /register', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectPOST('/register');
                var promise = userService.register({});
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

        describe('When call register with invalid user', function() {
            beforeEach(function() {
                $httpBackend.whenPOST('/register').respond(400, {});
            });
            it('should call backend: /register', inject(function(userService) {
                var resolved = false;
                var reject = false;
                $httpBackend.expectPOST('/register');
                var promise = userService.register({});
                promise.then(function (success){
                    resolved = true;
                }, function (error){
                    reject = true
                });
                $httpBackend.flush();
                $rootScope.$digest();
                expect(resolved).toBe(false);
                expect(reject).toBe(true);
            }));
        });
        describe('when login', function() {
            describe('if login fail', function(){
                beforeEach(function() {
                    $httpBackend.whenPOST('/login').respond(400, {});
                });
                it('should call backend: /login and get error', inject(function(userService) {
                    var resolved = false;
                    var reject = false;
                    $httpBackend.expectPOST('/login');
                    var promise = userService.login({});
                    promise.then(function (success){
                        resolved = true;
                    }, function (error){
                        reject = true
                    });
                    $httpBackend.flush();
                    $rootScope.$digest();
                    expect(resolved).toBe(false);
                    expect(reject).toBe(true);
                }));
            });
            describe('if login success', function(){
                beforeEach(function() {
                    $httpBackend.whenPOST('/login').respond(201, {});
                });
                it('should call backend: /login and get error', inject(function(userService) {
                    var resolved = false;
                    var reject = false;
                    $httpBackend.expectPOST('/login');
                    var promise = userService.login({});
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
});