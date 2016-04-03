/**
 * Created by boot on 3/9/16.
 */
angular.module('landingApp.services', []).
    factory('userService', function($http, $q) {
        return {
            register: function (user) {
                var def = $q.defer();
                $http({
                    url: '/register',
                    method: 'post',
                    dataType: 'json',
                    data: user,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    def.resolve(data);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
            },
            login: function(user) {
                var def = $q.defer();
                $http({
                    url: '/login',
                    method: 'post',
                    dataType: 'json',
                    data: user,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    def.resolve(data);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
            },
            firstLogin: function(user) {
                var def = $q.defer();
                $http({
                    url: '/firstLogin',
                    method: 'post',
                    dataType: 'json',
                    data: user,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    def.resolve(data);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
            },
            facebookLogin: function() {
                var def = $q.defer();
                $http({
                    url: '/auth/facebook',
                    method: 'get'
                }).success(function(data) {
                    def.resolve(data);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;
            }
        };
    });