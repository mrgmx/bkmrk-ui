'use strict';

/**
 * @ngdoc function
 * @name bookmarksUiYoApp.controller:BookmarkeditCtrl
 * @description
 * # BookmarkeditCtrl
 * Controller of the bookmarksUiYoApp
 */
angular.module('bookmarksUiYoApp')
  .controller('BookmarkeditCtrl', function ($scope, $q, Restangular, BookmarkService, bookmark) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.bookmark = bookmark;//Restangular.stripRestangular(bookmark);

    $scope.searchTags = function (txt) {
        var deferred = $q.defer();
        BookmarkService.searchTags(txt).then(function (data) {
            var output = Restangular.stripRestangular(data);
            deferred.resolve(output);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    $scope.saveBookmark = function (bookmark) {
        console.log('saveBookmark');
        bookmark.put();
        //BookmarkService.saveBookmark(bookmark);
        //BookmarkService.createBookmark(bookmark);
    };
  });
