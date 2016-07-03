/**
 * Created by boot on 4/7/16.
 */
describe('Controllers', function() {
    beforeEach(module('app'));
    var $controller;

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('Sidebar Controller', function() {
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
                    controller = $controller('sidebarController', {$scope: $scope, $modal: $modal});
                    expect($scope.modal).toBe(true);
                });
            });
            describe('If has not activation', function() {
                beforeEach(function() {
                    $scope.modal = undefined;
                    $scope.activation = '';
                    controller = $controller('sidebarController', {$scope: $scope, $modal: $modal});
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
                controller = $controller('sidebar   Controller', {$scope: $scope, $modal: $modal, $window: $window,
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
    describe('ProfileController', function() {
        var $scope, controller, profileService;
        var shouldFail = false;
        beforeEach(function () {
            $scope = {};
        });
        describe('When controller init', function() {
            beforeEach(function() {
                $scope.userId = 'userid';
                $scope.profileId = 'id';
                var promise = {then: function(success, error){
                    if (!shouldFail) success({profile:{}});
                    else error('error');
                }};
                userService = {
                    findById: function(id){return promise;}
                };
                spyOn(userService, 'findById').and.returnValue(promise);
                controller = $controller('profileController', {$scope: $scope, userService: userService});
            });
            it('should get the userId', function() {
                expect($scope.profileId == 'id');
            });
            it('should call service with id', function() {
                expect(userService.findById).toHaveBeenCalledWith('id');
            });
            it('user must exist with profile', function() {
                expect($scope.user.profile);
            });
            describe('if user id not is present, then use parent', function() {
                beforeEach(function() {
                    $scope.profileId = undefined;
                    controller = $controller('profileController', {$scope: $scope, userService: userService});
                });
                it('should get the userId', function() {
                    expect($scope.profileId == 'userid');
                });
                it('should call service with userid', function() {
                    expect(userService.findById).toHaveBeenCalledWith('userid');
                });
            });
        });
        describe('Edit action', function() {
            beforeEach(function() {
                $scope.userId = 'userid';
                $scope.profileId = 'id';
                var promise = {then: function(success, error){
                    if (!shouldFail) success({profile:{}});
                    else error('error');
                }};
                userService = {
                    validateEmail: function(email){return true;},
                    validateTwitter: function(twitter){return true;},
                    findById: function(id){return promise;},
                    updateUser: function(user){return promise;}
                };
                spyOn(userService, 'findById').and.returnValue(promise);
                spyOn(userService, 'updateUser').and.returnValue(promise);
                controller = $controller('profileController', {$scope: $scope, userService: userService});
            });
            describe('Edit Summary', function() {
                describe('When click edit', function() {
                    it('should open editSummary flag', function() {
                        $scope.activeEditSummary();
                        expect($scope.editSummary);
                    });
                });
                describe('When cancel change summary', function() {
                    it('should close editSummary flag', function() {
                        $scope.cancelSummary();
                        expect(!$scope.editSummary);
                    });
                });
                describe('Change summary', function() {
                    it('should call updateUser', function() {
                        $scope.changeSummary();
                        expect(userService.updateUser).toHaveBeenCalledWith($scope.user);
                    });
                });
            });
            describe('Edit Password', function() {
                describe('When click password', function() {
                    it('should open editPassword flag', function() {
                        $scope.activeEditPassword();
                        expect($scope.editPassword);
                    });
                });
                describe('When cancel change password', function() {
                    it('should close editPassword flag', function() {
                        $scope.cancelPassword();
                        expect(!$scope.editPassword);
                    });
                });
                describe('Change password', function() {
                    it('should validate correct re password', function() {
                        $scope.user.password = 'pass';
                        $scope.user.rePassword = 'pass';
                        expect($scope.validatePassword());
                    });
                    it('should fail empty password', function() {
                        $scope.user.password = '';
                        $scope.user.rePassword = '';
                        expect(!$scope.validatePassword());
                    });
                    it('should fail incorrect re password', function() {
                        $scope.user.password = 'pass';
                        $scope.user.rePassword = 'pas';
                        expect(!$scope.validatePassword());
                    });
                    it('if password is valid, then should call updateUser', function() {
                        $scope.user.password = 'pass';
                        $scope.user.rePassword = 'pass';
                        $scope.changePassword();
                        expect(userService.updateUser).toHaveBeenCalledWith($scope.user);
                    });
                    it('if password is invalid, then should not call updateUser', function() {
                        $scope.user.password = 'pass';
                        $scope.user.rePassword = 'pas';
                        $scope.changePassword();
                        expect(userService.updateUser).not.toHaveBeenCalled();
                    });
                });
            });
            describe('Edit Basic information', function() {
                describe('When click edit', function() {
                    it('should open editBasic flag', function() {
                        $scope.activeEditInfo();
                        expect($scope.editInfo);
                    });
                });
                describe('When cancel change basic information', function() {
                    it('should close editBasic flag', function() {
                        $scope.cancelInfo();
                        expect(!$scope.editInfo);
                    });
                });
                describe('Change basic', function() {
                    it('should call updateUser', function() {
                        $scope.changeInfo();
                        expect(userService.updateUser).toHaveBeenCalledWith($scope.user);
                    });
                });
            });
            describe('Edit Contact Information', function() {
                describe('When click edit', function() {
                    it('should open editContact flag', function() {
                        $scope.activeEditContact();
                        expect($scope.editContact);
                    });
                });
                describe('When cancel change contact information', function() {
                    it('should close editContact flag', function() {
                        $scope.cancelContact();
                        expect(!$scope.editContact);
                    });
                });
                describe('Change contact', function() {
                    beforeEach(function() {
                        $scope.user = {
                            profile: {
                                contact: {
                                    email: 'email@email.com',
                                    phone: '15-6408-0807',
                                    twitter: '@marcelo.pasut',
                                    skype: 'pasut.marcelo'
                                }
                            }
                        };
                    });
                    it('should call updateUser', function() {
                        $scope.changeContact();
                        expect(userService.updateUser).toHaveBeenCalledWith($scope.user);
                    });
                    it('should validate correct email', function() {
                        userService.validateEmail = function() {return false};
                        $scope.user.profile.contact.email = 'email.com';
                        $scope.changeContact();
                        expect(userService.updateUser).not.toHaveBeenCalled();
                    });
                    it('should validate correct twitter', function() {
                        $scope.user.profile.contact.twitter = 'marcelo';
                        userService.validateTwitter = function() {return false};
                        $scope.changeContact();
                        expect(userService.updateUser).not.toHaveBeenCalled();
                    });
                    it('if email is empty, should pass', function() {
                        $scope.user.profile.contact.email = '';
                        userService.validateEmail = function() {return false};
                        $scope.changeContact();
                        expect(userService.updateUser).toHaveBeenCalledWith($scope.user);
                    });
                    it('if twitter is empty, should pass', function() {
                        $scope.user.profile.contact.twitter = '';
                        userService.validateTwitter = function() {return false};
                        $scope.changeContact();
                        expect(userService.updateUser).toHaveBeenCalledWith($scope.user);
                    });
                });
            });
        });
    });
});