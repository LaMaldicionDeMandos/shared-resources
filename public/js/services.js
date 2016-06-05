/**
 * Created by boot on 4/4/16.
 */
angular.module('app.services', []).
    factory('userService', function($http, $q) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return {
            logout: function() {
                var def = $q.defer();
                $http({
                    url: '/logout',
                    method: 'get'
                }).success(function() {
                    def.resolve();
                }).error(function(data, status) {
                    def.reject(data);
                });
                    return def.promise;
                },
            newAdmin: function(admin) {
                var def = $q.defer();
                $http({
                    url: '/admin',
                    dataType: 'json',
                    data: admin,
                    headers: {'Content-Type': 'application/json'},
                    method: 'post'
                }).success(function(admin) {
                    def.resolve(admin);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
                },
            validateEmail: function(email) {
                return re.test(email);
            },
            getAdmins: function() {
                var def = $q.defer();
                $http({
                    url: '/admin',
                    dataType: 'json',
                    headers: {'Content-Type': 'application/json'},
                    method: 'get'
                }).success(function(admins) {
                    def.resolve(admins);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
            }
        };

    });