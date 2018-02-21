'use strict';

/**
 * @ngdoc directive
 * @name bookmarksUiYoApp.directive:footer
 * @description
 * # footer
 */
 /*
 http://www.angularjs4u.com/directives/angularjs-basic-footer-directive/
  */
angular.module('bookmarksUiYoApp')
  .directive('footer', function () {
    return {
      template: '<div>bookmarks Footer</div>',
      restrict: 'E',
      //link: function postLink(scope, element, attrs) {
      link: function postLink(scope, element) {
        element.text('this is the bookmarks footer directive');
      }
    };
  });
