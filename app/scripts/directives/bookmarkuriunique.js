'use strict';

/**
 * https://www.algotech.solutions/blog/javascript/how-to-create-custom-validator-directives-with-angularjs/
 * @ngdoc directive
 * @name bookmarksUiYoApp.directive:bookmarkUriUnique
 * @description
 * # bookmarkUriUnique
 */
angular.module('bookmarksUiYoApp')
    .directive('bookmarkUriUnique', ['Restangular', 'growl', 'BookmarkService', '$q', function (Restangular, growl, BookmarkService, $q) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
                console.log('bookmarkUriUnique: scope: ', scope);
                console.log('bookmarkUriUnique: element: ', element);
                console.log('bookmarkUriUnique: attr: ', attr);
                console.log('bookmarkUriUnique: ngModel: ', ngModel);
                console.log('bookmarkUriUnique: $scope.bookmark: ', scope.bookmark);
                function merge(formBookmark, foundBookmark) {
                    if (formBookmark.title) {
                        return false;
                    }
                    // TODO: doesn't work as expected - updates view but in BookmarkCtrl $scope.bookmark is empty and without $$hashKey
                    // scope.bookmark = foundBookmark;
                    var bakFormTags = formBookmark.tags;
                    Object.assign(formBookmark, foundBookmark); // (target, ...sources)
                    var formBookmarkTagNames = formBookmark.tags.map(function (tag) {
                        return tag.name;
                    });
                    bakFormTags.forEach(function (tag) {
                        if (!formBookmarkTagNames.includes(tag.name)) {
                            formBookmark.tags.push(tag);
                        }
                    });
                    //Array.prototype.push.apply(formBookmark.tags, bakFormTags); // target, source
                    growl.info('Merged prepared bookmark with existing by same URI', { ttl: 5000 });
                    return true;
                }
                ngModel.$asyncValidators.isUnique = function(modelValue, viewValue) {
                    console.log('bookmarkUriUnique: isUnique: modelValue: ', modelValue);
                    console.log('bookmarkUriUnique: isUnique: viewValue: ', viewValue);
                    var deferred = $q.defer();
                    var criteria = {
                        uri: modelValue
                    };
                    BookmarkService.getFirstBookmark(criteria).then(function (result) {
                        if (result) {
                            var bookmark = Restangular.stripRestangular(result);
                            console.log('bookmarkUriUnique: isUnique: bookmark: ', bookmark);
                            if (scope.bookmark && scope.bookmark.id) {
                                console.log('bookmarkUriUnique: bookmark update');
                                if (scope.bookmark.id === bookmark.id) {
                                    deferred.resolve();
                                }
                                else {
                                    deferred.reject();
                                }
                            }
                            else {
                                if (merge(scope.bookmark, bookmark)) {
                                    deferred.resolve();
                                }
                                else {
                                    deferred.reject();
                                }
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