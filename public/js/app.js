/**
 * Created by tomasj on 26/04/14.
 */


var WeddingPlanner = angular.module('WeddingPlanner', [
    'ngRoute',
    'controllers'
]);

WeddingPlanner.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/guestList.html',
            controller: 'GuestListCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});