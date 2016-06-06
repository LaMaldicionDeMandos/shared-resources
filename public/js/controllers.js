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
    controller('profileController', function($scope) {
        $scope.user = {
            username: $scope.$parent.$parent.username,
            role: $scope.$parent.$parent.role
        };
    });
