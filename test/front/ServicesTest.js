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
    });
});