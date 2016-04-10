/**
 * Created by boot on 3/7/16.
 */
angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'app.controllers',
    'app.services'
])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/admins', {
                menuItem: 'admins',
                templateUrl: '/partials/admin_user'
            });
        $locationProvider.html5Mode(true);
    });