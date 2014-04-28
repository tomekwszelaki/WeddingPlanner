/**
 * Created by tomasj on 26/04/14.
 */


var WeddingPlanner = angular.module('WeddingPlanner', [
    'flow',
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
        when('/upload', {
            templateUrl: 'views/upload.html',
            controller: 'UploadCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

WeddingPlanner.config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        target: '/BoxUploadThingamajig',
        permanentErrors:[404, 500, 501]
    };
    // You can also set default events:
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
    // flowFactoryProvider.factory = fustyFlowFactory;
}]);