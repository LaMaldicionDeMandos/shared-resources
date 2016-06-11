/**
 * Created by boot on 4/4/16.
 */
'use strict';

/* Controllers */
angular.module('app.controllers', []).
    controller('headerController', function($scope, $modal, $window, userService) {
        if ($window.location.hash == '#_=_') {
            $window.location.href = '/';
        }
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
        };
        $scope.logout = function() {
            var success = function() {
                $window.location.href = '/index';
            };
            var fail = function(error) {
                console.log('Error on logout ' + error);
            };
            userService.logout().then(success, fail);
        };
    }).
    controller('adminsController', function($scope, userService) {
        $scope.form = {};
        $scope.nameIsValid = true;
        $scope.emailIsValid = true;
        $scope.admins = [];
        $scope.validateEmail = function() {
            $scope.emailIsValid = userService.validateEmail($scope.form.email);
            return $scope.emailIsValid;
        };
        $scope.validateName = function() {
            $scope.nameIsValid = $scope.form.name && $scope.form.name.length > 0;
            return $scope.nameIsValid;
        };
        $scope.findAll = function() {
            userService.getAdmins().then(
                function(admins) {
                    $scope.admins = admins;
                },
                function() {
                    swal('Error!', 'Por algun motivo no pudimos encontrar los administradores', 'error');
                }
            )
        };
        $scope.add = function() {
            if($scope.validateName() && $scope.validateEmail()) {
                var user = {
                    username: $scope.form.name,
                    email: $scope.form.email,
                    role: $scope.form.role ? 'sadmin' : 'admin'
                };
                userService.newAdmin(user).then(
                    function(admin) {
                        $scope.admins.push(admin);
                        swal('Hecho!', '', 'success');
                    },
                    function() {
                        swal('Error!', 'El usuario no se creó, puede ser que el usuario o el email ya existan', 'error')
                    }
                );
            } else {
                var message = $scope.validateName()
                    ? 'Debe escribir un email correcto'
                    : 'El nombre de usuario es obligatorio';
                swal('Error!', message, 'error');
            }
        };
        $scope.edit = function(admin) {
            admin.$edit = true;
        };
        $scope.saveEdit = function(admin) {
            admin.$edit = false;
            userService.edit(admin).then(
                function() {
                    swal({title:'Hecho!', text:'', type:'success', timer:2000, showConfirmButton: false});
                },
                function() {
                    swal({title:'Error!', text:'El usuario no pudo editarse', type:'error', timer:2000,
                        showConfirmButton: false});
                }
            );
        };
        $scope.remove = function(admin) {
            userService.remove(admin).then(
                function() {
                    swal({title:'Hecho!', text:'', type:'success', timer:2000, showConfirmButton: false});
                    $scope.admins.splice($scope.admins.indexOf(admin), 1);
                },
                function() {
                    swal({title:'Error!', text:'No pudimos borrar al usuario.', type:'error', timer:2000,
                    showConfirmButton: false});
                }
            );
        };
        $scope.findAll();
    }).
    controller('profileController', function($scope, userService) {
        if (!$scope.profileId) {
            $scope.editable = true;
            $scope.profileId = $scope.userId;
        }
        userService.findById($scope.profileId).then(
            function(user) {
                $scope.user = user;
            },
            function(error) {
                swal({title:'Ops!', text:'No pudimos encontrar el perfil.', type:'error', timer:1500,
                    showConfirmButton: false});
            }
        );

        $scope.invalidPassword = false;

        $scope.editPassword = false;
        $scope.editSummary = false;

        $scope.activeEditPassword = function() {
            $scope.editPassword = true;
        };
        $scope.activeEditSummary = function() {
            $scope.editSummary = true;
        };

        $scope.cancelPassword = function() {
            $scope.editPassword = false;
        };

        $scope.changePassword = function() {
            if ($scope.validatePassword()) {
                userService.updateUser($scope.user).then(
                    function() {
                        $scope.editPassword = false;
                        swal({title:'Hecho!', text:'', type:'success', timer:2000, showConfirmButton: false});
                    },
                    function() {
                        swal({title:'Ops!', text:'La contraseña no fue cambiada.', type:'error', timer:1500,
                            showConfirmButton: false});
                    }
                );
            } else {
                if ($scope.user.password.length > 0) {
                    swal({title:'Ops!', text:'Vuelve a escribir la contraseña correctamente.', type:'error'});
                } else {
                    swal({title:'Ops!', text:'Debes escribir una contraseña.', type:'error'});
                }
            }
        };

        $scope.validatePassword = function() {
            var isValid = $scope.user.password.length > 0 && $scope.user.password == $scope.user.rePassword;
            $scope.invalidPassword = !isValid;
            return isValid;
        };
    });
