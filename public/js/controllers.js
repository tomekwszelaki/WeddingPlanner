/**
 * Created by tomasj on 26/04/14.
 */


var controllers = angular.module('controllers', []);

controllers.controller('GuestListCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.guestList = {};
    $scope.refreshStats = function() {
        $scope.stats = {};
        $scope.guestList.forEach(function(item) {
            Object.keys(item).forEach(function(key) {
                if (key != "name" && key != "notes" && key != "_id") {
                    if (!$scope.stats[key]) {
                        $scope.stats[key] = {};
                    }
                    if ($scope.stats[key][item[key]]) {
                        $scope.stats[key][item[key]] += 1;
                    }
                    else {
                        $scope.stats[key][item[key]] = 1;
                    }
                }
            });
        });
        delete $scope.stats.stayingFor[""];
        delete $scope.stats.stayingFor[null];
    }
    $scope.load = function() {
        $http.get('/guests')
            .success(function(data, status, headers, config) {
                $scope.guestList = data;
                $scope.refreshStats();
            })
            .error(function(data, status, headers, config){
                var resp = {
                    data: data,
                    status: status,
                    headers: headers,
                    config: config
                }
                $scope.guestList = resp;
            });
    }
    $scope.load();
    $scope.addNewGuest = function() {
        var guest = {
            name: $scope.name,
            age: $scope.age,
            invited: $scope.invited,
            confirmed: $scope.confirmed,
            stayingFor: $scope.stayingFor,
            notes: $scope.notes
        }
        $http.post('/guests', guest)
            .success(function(data, status, headers, config) {
                $scope.submitted = data;
                $scope.name = "";
                $scope.age = $scope.ages[0];
                $scope.invited = false;
                $scope.confirmed = $scope.confirmation[0];
                $scope.stayingFor = "";
                $scope.notes = "";
                $scope.load();
            })
            .error(function(data, status, headers, config){
                var resp = {
                    data: data,
                    status: status,
                    headers: headers,
                    config: config
                }
                $scope.submitted = resp;
            })
        };
    $scope.editionEnabled = false;
    $scope.modifyGuest = function(guest) {
        $http.put('guests/' + guest._id, guest)
                .success(function(data, status, headers, config) {
                    $scope.submitted = data;
                    $scope.refreshStats();
                })
                .error(function(data, status, headers, config){
                    var resp = {
                        data: data,
                        status: status,
                        headers: headers,
                        config: config
                    }
                    $scope.submitted = resp;
                });
    };
    $scope.ages = ['dorosly', 'dziecko (polowka)', 'dziecko'];
    $scope.age = $scope.ages[0];
    $scope.lengthOfVisit = [0,1,2,3,4,5,6,7,8,9];
    $scope.stayingFor = $scope.lengthOfVisit[0];
    $scope.invited = false;
    $scope.confirmation = ['Brak', 'Tak, nie przyjedzie', 'Tak, przyjedzie'];
    $scope.confirmed = $scope.confirmation[0];
    $scope.notes = "";
//    $scope.searchFor = "";
}]);

controllers.controller('ContactPageCtrl', ['$scope', function($scope) {
    $scope.contactPeople = [
        {
            name: 'Judyta Tomczak',
            email: 'email@judyta.com',
            phone: '+48436363434534',
            picture: 'some/URI/to/picture'
        },
        {
            name: 'Joanna Wszelaka-Staniak',
            email: 'email@joanna.com',
            phone: '+48436363222534',
            picture: 'some/URI/to/picture1'
        }
    ]
}])