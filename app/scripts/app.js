'use strict';

/**
 * @ngdoc overview
 * @name bookmarksUiYoApp
 * @description
 * # bookmarksUiYoApp
 *
 * Main module of the application.
 */
angular
  .module('bookmarksUiYoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngTable',
    'restangular',
    'angular-growl',
    'ngTagsInput',
    'ui.bootstrap'
  ])
        /*
  .config(['$httpProvider',
    function($httpProvider) {
      // Use x-www-form-urlencoded Content-Type
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

      // Override $http service's default transformRequest
      $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
      }];
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    }])
      */
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/bookmark', {
        templateUrl: 'views/bookmark.html',
        controller: 'BookmarkCtrl',
        controllerAs: 'bookmarkCtrl'
      })
      .when('/bookmark/:bookmarkId', {
        templateUrl: 'views/bookmarkedit.html',
        controller: 'BookmarkeditCtrl',
        controllerAs: 'bookmarkedit',
        resolve: {
            bookmark: function (BookmarkService, $route) {
                return BookmarkService.getBookmark($route.current.params.bookmarkId);
            }
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'loginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
