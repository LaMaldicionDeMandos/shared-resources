/**
 * Created by boot on 4/4/16.
 */
angular.module('app.services', []).
    factory('userService', function($http, $q) {
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
                }).success(function() {
                    def.resolve();
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
                }
            };

    });