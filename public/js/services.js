/**
 * Created by boot on 4/4/16.
 */
angular.module('app.services', []).
    factory('userService', function($http, $q) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var rt = /^@?(\w){1,15}$/;
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
            validateTwitter: function(twitter) {
                return rt.test(twitter);
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
            },
            edit: function(admin) {
                var def = $q.defer();
                $http({
                    url: '/admin',
                    dataType: 'json',
                    data: admin,
                    headers: {'Content-Type': 'application/json'},
                    method: 'put'
                }).success(function(admin) {
                    def.resolve(admin);
                }).error(function(data, status) {
                    def.reject();
                });
                return def.promise;
            },
            remove: function(admin) {
                var def = $q.defer();
                $http({
                    url: '/admin/' + admin._id,
                    headers: {'Content-Type': 'application/json'},
                    method: 'delete'
                }).success(function(admin) {
                    def.resolve(admin);
                }).error(function(data, status) {
                    def.reject();
                });
                return def.promise;
            },
            findById: function(id) {
                var def = $q.defer();
                $http({
                    url: '/user/' + id,
                    headers: {'Content-Type': 'application/json'},
                    method: 'get'
                }).success(function(user) {
                    def.resolve(user);
                }).error(function(data, status) {
                    def.reject();
                });
                return def.promise;
            },
            updateUser: function(user) {
                var def = $q.defer();
                $http({
                    url: '/user',
                    headers: {'Content-Type': 'application/json'},
                    method: 'put',
                    data: user
                }).success(function(user) {
                    def.resolve(user);
                }).error(function(data, status) {
                    def.reject();
                });
                return def.promise;
            },
            findCurrent: function() {
                var def = $q.defer();
                $http({
                    url: '/user/me',
                    headers: {'Content-Type': 'application/json'},
                    method: 'get'
                }).success(function(user) {
                    def.resolve(user);
                }).error(function(data, status) {
                    def.reject();
                });
                return def.promise;
            }
        };

    });