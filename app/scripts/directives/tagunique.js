'use strict';

/**
 * @ngdoc directive
 * @name bookmarksUiYoApp.directive:tagUnique
 * @description
 * # tagUnique
 */
angular.module('bookmarksUiYoApp')
  //.directive('tagUnique', function () {
  .directive('tagUnique', ['Restangular', 'growl', 'BookmarkService', '$q', function (Restangular, growl, BookmarkService, $q) {
    return {
      // template: '<div></div>',
      // restrict: 'E',
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModel) {
        // element.text('this is the tagUnique directive');
        console.log('tagUnique: scope: ', scope);
        console.log('tagUnique: element: ', element);
        console.log('tagUnique: attr: ', attr);
        console.log('tagUnique: ngModel: ', ngModel);
        console.log('tagUnique: $scope.bookmark: ', scope.bookmark);
        ngModel.$asyncValidators.isUnique = function(modelValue, viewValue) {
            console.log('tagUnique: isUnique: modelValue: ', modelValue);
            console.log('tagUnique: isUnique: viewValue: ', viewValue);
            var deferred = $q.defer();
            BookmarkService.findByNameOrAliasIgnoreCase(modelValue).then(function (result) {
                console.log('tagUnique: isUnique: result: ', result);
                if (result) {
                    var tag = Restangular.stripRestangular(result);
                    console.log('tagUnique: isUnique: tag: ', tag);
                    if (scope.tag && scope.tag.id && scope.tag.id === tag.id) {
                        // editing existing tag
                        deferred.resolve();
                    }
                    else {
                        // creating new tag
                        // TODO: doesn't work as expected - updates view but in BookmarkCtrl $scope.bookmark is empty and without $$hashKey
                        // scope.conflictingTag = tag;
                        Object.assign(scope.conflictingTag, tag); // (target, ...sources)
                        deferred.reject();
                    }
                }
                else {
                    deferred.resolve();
                }
            }, function (error) {
                deferred.reject(error);
            });
            console.log('bookmarkUriUnique: isUnique: deferred: ', deferred);
            // deferred.resolve();
            return deferred.promise;
        };
      }
    };
  }]);
