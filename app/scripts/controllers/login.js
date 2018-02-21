'use strict';

/**
 * @ngdoc function
 * @name bookmarksUiYoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the bookmarksUiYoApp
 */
angular.module('bookmarksUiYoApp')
  .controller('LoginCtrl', function ($scope, $q, $location, $filter, growl, BookmarkService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    
    function emptyCredentials() {
        return {
            'username': '',
            'password': ''
        };
    }

    $scope.clearCredentials = function () {
        console.log('clearCredentials');
        $scope.credentials = emptyCredentials();
    };

    $scope.clearCredentials();
    
    $scope.login = function (loginForm) {
        console.log('login');
        if (!loginForm.$valid) {
            console.error('loginForm invalid');
            growl.error('loginForm invalid', { ttl: 5000 });
            return;
        }
        BookmarkService.login($scope.credentials).then(function () {
            growl.success('login succeded', { ttl: 5000 });
        }, function (error) {
            console.error('login failed: ', error);
            growl.error('login failed', { ttl: 5000 });
        });
    };
  });
