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
    });
});