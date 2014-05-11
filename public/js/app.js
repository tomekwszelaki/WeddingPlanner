/**
 * Created by tomasj on 26/04/14.
 */

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
// Initialize a new promise
    var deferred = $q.defer();
// Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
            $timeout(deferred.resolve, 0);
        }
        // Not Authenticated
        else {
            $rootScope.message = 'You need to log in.';
            $timeout(function() {
                deferred.reject();
            }, 0);
            $location.url('/login');
        }
    });
};

var WeddingPlanner = angular.module('WeddingPlanner', [
    'flow',
    'ngRoute',
    'controllers'
]);

WeddingPlanner.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        }).
        when('/list', {
            templateUrl: 'views/guestList.html',
            controller: 'GuestListCtrl',
            resolve: {
                loggedin: checkLoggedin
            }
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
        target: '/files',
        permanentErrors:[404, 500, 501],
        chunkSize: 10 * 1024 * 1024,
        testChunks: false

    };
    // You can also set default events:
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchall', event);
    });
    // Can be used with different implementations of Flow.js
    // flowFactoryProvider.factory = fustyFlowFactory;
}]);
