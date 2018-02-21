'use strict';

/**
 * @ngdoc function
 * @name bookmarksUiYoApp.controller:CommonCtrl
 * @description
 * # CommonCtrl
 * Controller of the bookmarksUiYoApp
 */
angular.module('bookmarksUiYoApp')
  .controller('FooterCtrl', function ($scope, ApplicationSettings) {
    $scope.getBaseUrl = function () {
        return ApplicationSettings.baseUrl;
    };
  });
