/**
 * Created by theotheu on 27-10-13.
 */

"use strict";

/**
 * @see http://docs.angularjs.org/guide/concepts
 */
angular.module('myApp', [ 'myApp.services'])
    .config(['$routeProvider', function ($routeProvider) {

        // Home
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: UserLoginCtrl
        });

        // Get all groups
        $routeProvider.when('/groups', {
            templateUrl: 'partials/group-list.html',
            controller: GroupListCtrl
        });
        // Get 1 group
        $routeProvider.when('/groups/:_id', {
            templateUrl: 'partials/group-detail.html',
            controller: GroupDetailCtrl
        });


        // Get all users
        $routeProvider.when('/users', {
            templateUrl: 'partials/user-list.html',
            controller: UserListCtrl
        });
        // Get 1 user
        $routeProvider.when('/users/:_id', {
            templateUrl: 'partials/user-detail.html',
            controller: UserDetailCtrl
        });
        // Generate User
        $routeProvider.when('/generateUser', {
            templateUrl: 'partials/user-detail.html',
            controller: UserGeneratorCtrl
        });


        // When no valid route is provided
        $routeProvider.otherwise({
              redirectTo: "/home"
        });


    }])
