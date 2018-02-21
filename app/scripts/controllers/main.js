'use strict';

/**
 * @ngdoc function
 * @name bookmarksUiYoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bookmarksUiYoApp
 */
angular.module('bookmarksUiYoApp')
  .controller('MainCtrl', function ($scope) {
    console.log('MainCtrl');

    $scope.getBaseUrl = function () {
        console.log('MainCtrl.getBaseUrl');
        return 'baseUrl';
    };
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.tags = [{
        'text': 'scopetext'
    }];
  });
