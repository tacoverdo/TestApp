/**
 * Created by theotheu on 27-10-13.
 */
"use strict";

/**
 * Best Practices for Designing a Pragmatic RESTful API
 * @see http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
 */

angular.module('myApp.services', ['ngResource'])
    .factory('usersService', ['$resource', '$http',
        function ($resource) {
            var actions = {
                    'get': {method: 'GET'},
                    'save': {method: 'POST'},
                    'update': {method: 'PUT'},
                    'query': {method: 'GET', isArray: true},
                    'delete': {method: 'DELETE'}
                },
                db = {};
            db.users = $resource('/users/:_id', {}, actions);
            return db;
        }
    ])
    .factory('groupsService', ['$resource', '$http',
        function ($resource) {

            var actions = {
                'get': {method: 'GET'},
                'save': {method: 'POST'},
                'update': {method: 'PUT'},
                'query': {method: 'GET', isArray: true},
                'delete': {method: 'DELETE'}
            }, db = {};
            db.groups = $resource('/groups/:_id', {}, actions);
            return db;
        }
    ])
;
