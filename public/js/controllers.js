/**
 * Created by boot on 4/4/16.
 */
'use strict';

/* Controllers */
angular.module('app.controllers', []).
    controller('sidebarController', function($scope, $modal, $window, userService) {
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
        $scope.invalidEmail = false;
        $scope.invalidTwitter = false;

        $scope.editPassword = false;
        $scope.editSummary = false;
        $scope.editInfo = false;
        $scope.editContact = false;

        $scope.activeEditPassword = function() {
            $scope.editPassword = true;
        };
        $scope.activeEditSummary = function() {
            $scope.editSummary = true;
        };
        $scope.activeEditInfo = function() {
            $scope.editInfo = true;
        };
        $scope.activeEditContact = function() {
            $scope.editContact = true;
        };

        $scope.cancelPassword = function() {
            $scope.editPassword = false;
        };
        $scope.cancelSummary = function() {
            $scope.editSummary = false;
        };
        $scope.cancelInfo = function() {
            $scope.editInfo = false;
        };
        $scope.cancelContact = function() {
            $scope.editContact = false;
        };

        $scope.changeUser = function(errorMessage, flagName) {
            userService.updateUser($scope.user).then(
                function() {
                    $scope[flagName] = false;
                    swal({title:'Hecho!', text:'', type:'success', timer:1500, showConfirmButton: false});
                },
                function() {
                    swal({title:'Ops!', text:errorMessage, type:'error'});
                }
            );
        };

        $scope.changeSummary = function() {
            $scope.changeUser('El resumen no fue cambiado.', 'editSummary');
        };

        $scope.changeInfo = function() {
            $scope.changeUser('No se pudo cambiar la información básica', 'editInfo');
        };

        $scope.changePassword = function() {
            if ($scope.validatePassword()) {
                $scope.changeUser('La contraseña no fue cambiada.', 'editPassword');
            } else {
                if ($scope.user.password.length > 0) {
                    swal({title:'Ops!', text:'Vuelve a escribir la contraseña correctamente.', type:'error'});
                } else {
                    swal({title:'Ops!', text:'Debes escribir una contraseña.', type:'error'});
                }
            }
        };
        $scope.changeContact = function() {
            if (!$scope.validateEmail($scope.user.profile.contact.email)) {
                swal({title:'Ops!', text:'El email es invalido.', type:'error'});
            } else if(!$scope.validateTwitter($scope.user.profile.contact.twitter)) {
                swal({title:'Ops!', text:'El usuario de twitter es invalido, fijate si pusiste "@" antes del nombre.',
                    type:'error'});
            }
            else {
                $scope.changeUser('No se pudo cambiar la información de contacto', 'editContact');
            }
        };

        $scope.validateEmail = function(email) {
            var isValid = !email || email.length == 0 || userService.validateEmail(email);
            $scope.invalidEmail = !isValid;
            return isValid;
        };

        $scope.validateTwitter = function(twitter) {
            var isValid = !twitter || twitter.length == 0 || userService.validateTwitter(twitter);
            $scope.invalidTwitter = !isValid;
            return isValid;
        };

        $scope.validatePassword = function() {
            var isValid = $scope.user.password.length > 0 && $scope.user.password == $scope.user.rePassword;
            $scope.invalidPassword = !isValid;
            return isValid;
        };

        $scope.updatePhoto = function(file) {
            var task = firebase.storage().ref().child('photos/' + $scope.user._id).put(file);
            task.on('state_changed', function(snapshot){
                console.log('Progress: ' + snapshot);
            }, function(error) {
                console.log('Error: ' + error);
                swal({title:'Ops!', text:'La foto no pudo cambiarse.', type:'error'});
            }, function() {
                var downloadURL = task.snapshot.downloadURL;
                console.log('Success!! :) ' + downloadURL);
                $scope.user.profile.photo = downloadURL;
                $scope.changeUser('La foto no pudo cambiarse.', 'photo');
            });
        }
    }).
    controller('headerController', function($scope, userService) {
        userService.findCurrent().then(
            function(user) {
                $scope.user = user;
            },
            function(error) {
                console.log("Error: " + error);
            }
        );
        $scope.cleanMessages = function() {
            $scope.user.messages = [];
            userService.updateUser($scope.user);
        };
    });
