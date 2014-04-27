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
        when('/gallery', {
            templateUrl: 'views/gallery.html',
            controller: 'GalleryCtrl'
        }).
        when('/map', {
            templateUrl: 'views/map.html',
            controller: 'MapPageCtrl'
        }).
        when('/contact', {
            templateUrl: 'views/contact.html',
            controller: 'ContactPageCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});