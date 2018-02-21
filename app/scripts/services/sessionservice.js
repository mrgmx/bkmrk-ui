'use strict';

/**
 * @ngdoc service
 * @name bookmarksUiYoApp.SessionService
 * @description
 * # SessionService
 * Factory in the bookmarksUiYoApp.
 */
angular.module('bookmarksUiYoApp')
  .factory('SessionService',
    function ($sessionStorage) {
        return $sessionStorage;
    }
      /*
      function () {
        // Service logic
        // ...

        var meaningOfLife = 42;

        // Public API here
        return {
          someMethod: function () {
            return meaningOfLife;
          }
        };
      }
      */
  );
