'use strict';

/**
 * @ngdoc function
 * @name bookmarksUiYoApp.controller:BookmarkCtrl
 * @description
 * # BookmarkCtrl
 * Controller of the bookmarksUiYoApp
 */
angular.module('bookmarksUiYoApp')
  .controller('BookmarkCtrl', function ($scope, $q, $location, $filter, growl, NgTableParams, Restangular, ProgressBarService, BookmarkService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.getBaseUrl = function () {
        console.log('getBaseUrl');
        return 'baseUrl';
    };

    var BOOKMARKS_TAB = 0;
    var TAG_TAB = 1;
    //var BULK_TAB = 2;

    $scope.activeTab = BOOKMARKS_TAB;
    $scope.bookmarksTableReload = true;

    $scope.isUriInvalid = function (bookmarkForm) {
        // var formUri = bookmarkForm.bookmarkUri;
        // console.log('isUriInvalid: dirty: ', formUri.$dirty);
        // var error = bookmarkForm.bookmarkUri.$error;
        // console.log('isUriInvalid: error: ', error);
        // console.log('isUriInvalid: required: ', error.required);
        // var v = formUri.$dirty && error !== null && error.required !== null;
        // console.log('isUriInvalid: v: ', v);
        // return v;
        return bookmarkForm.bookmarkUri.$invalid;
    };

    function activeTabChanged(newParam, oldParam) {
        console.log('activeTabChanged: newParam: ', newParam);
        console.log('activeTabChanged: oldParam: ', oldParam);
        if (angular.equals(newParam, oldParam)) {
            return;
        }
        $scope.conflictingTag = emptyTag();
        // TODO: add reload only when not on tag clicked
        //$scope.reloadBookmarksTable();
    }

    $scope.tabDeselected = function (selectedIndex) {
        console.log('tabDeselected: selectedIndex: ', selectedIndex);
        console.log('tabDeselected: bookmarksTableReload: ', $scope.bookmarksTableReload);
        if ($scope.bookmarksTableReload) {
            $scope.bookmarksTable.reload();
        }
        else {
            $scope.bookmarksTableReload = true;
        }
    };

    // $scope.$watch($scope.wrap.activeTab, activeTabChanged, true);
    $scope.$watch('activeTab', activeTabChanged, true);

    function initTab() {
        return {
            tags: [],
            associatedTags: [],
            excludedTags: [],
            associatedTagsSearch: false
        };
    }

    $scope.tabs = [
        initTab(), initTab(), initTab()
    ];

    $scope.isSystemTag = function (tag) {
        // TODO: name undefined
        return tag && tag.name && tag.name.startsWith('sys_');
    };

    function emptyBookmark() {
        return {
            'title': '',
            'uri': '',
            'tags': []
        };
    }

    $scope.clearBookmarkId = function () {
        console.log('clearBookmarkId');
        const newBookmark = emptyBookmark();
		newBookmark.tags = $scope.bookmark.tags
			.filter(function (tag) {
                return !$scope.isSystemTag(tag);
            })
			.reduce(function (tags, tag) {
				tags.push(tag);
				return tags;
			}, []);
        $scope.bookmark = newBookmark;
    };

    $scope.clearBookmark = function () {
        console.log('clearBookmark');
        $scope.bookmark = emptyBookmark();
    };

    $scope.clearTag = function () {
        console.log('clearTag');
        $scope.tag = emptyTag();
    };

    function emptyTag() {
        return {
            'name': '',
            'aliases': []
        };
    }

    $scope.bookmark = emptyBookmark();
    $scope.tag = emptyTag();

    $scope.printSystemTagLog = function () {
        if (!$scope.bookmark || !$scope.bookmark.systemTagLog) {
            return '<none>';
        }
        if ($scope.bookmark.systemTagLog.length === 0) {
            return '<empty>';
        }
        return _.map($scope.bookmark.systemTagLog, function (entry) {
            return JSON.stringify({
                'created': $filter('date')(entry.created, 'yyyy-MM-dd HH:mm:ss.sss'),//entry.created,
                'tagName': entry.tag.name
            });
        }).join();
    };

    // TODO: JSON mode support
    $scope.bulk = {
        placeholder:
            '[programming, cloud, amazon, aws, lab, training, online]\n' +
            'https://qwiklabs.com/\n' +
            '\n' +
            '# comment1\n' +
            '[sport, aktywni, wycieczka, weekend, podroz, wyprawa]\n' +
            'https://www.facebook.com/groups/AktywniTaktTV/\n' +
            '# comment2\n' +
            'http://aktywniplus.com/\n' +
            'http://www.wedrujemy.org.pl/\n',
        text: '',
        mode: 'mode1'
    };

    $scope.bulkLoad = function (bulkText, bulkMode) {//, bulkForm) {
        ProgressBarService.openModal(1000, 'Importing bookmarks bulk');
        BookmarkService.bulkLoad(bulkText, bulkMode).then(function (data) {
            ProgressBarService.closeModal();
            var bulkResponse = Restangular.stripRestangular(data);
            console.log('bulkLoad: bulkResponse: ', bulkResponse);
            var successMessage = null;
            var nImported = bulkResponse.createdBookmarkIds.length;
            if (nImported > 0) {
                successMessage = 'Imported  ' + nImported + ' bookmarks';
            }
            var nUpdated = bulkResponse.updatedBookmarkIds.length;
            if (nUpdated > 0) {
                if (successMessage) {
                    successMessage += '<br/>';
                }
                else {
                    successMessage = '';
                }
                successMessage += 'Updated  ' + nUpdated + ' bookmarks';
            }
            if (successMessage) {
                growl.success(successMessage);
                $scope.reloadBookmarksTable();
            }
            var nDuplicates = bulkResponse.duplicateBookmarkIds.length;
            if (nDuplicates > 0) {
                growl.info('Importing ' + nDuplicates + ' duplicates skipped');
            }
            var nFailed = bulkResponse.failedBookmarks.length;
            if (nFailed > 0) {
                growl.error('Importing ' + nFailed + ' bookmarks failed');
                setFailedBulk(bulkResponse.failedBookmarks);
            }
        }, function (error) {
            ProgressBarService.closeModal();
            console.error('bulkLoad failed: ', error);
        });
    };

    var setFailedBulk = function (failedBookmarks) {//, bulkForm) {
        console.log('setFailedBulk: $scope.bulk.text: ', $scope.bulk.text);
        $scope.bulk.text = '';
        failedBookmarks.forEach(function (failed) {
            $scope.bulk.text += '# ' + failed.reason + '\n[' +
                toJoinedTagNames(failed.bookmark.tags) + ']\n' +
                failed.bookmark.uri + '\n\n';
        });
    };

    var toJoinedTagIds = function (tags) {
        return _.map(tags, function (tag) {
            return tag.id;
        }).join();
    };

    var toJoinedTagNames = function (tags) {
        return _.map(tags, function (tag) {
            return tag.name;
        }).join(', ');
    };

    $scope.toJoinedTagNames = function () {
        return toJoinedTagNames($scope.bookmark.tags);
    };

    $scope.reloadBookmarksTable = function () {
        console.log('reloadBookmarksTable');
        $scope.tabs[$scope.activeTab].associatedTagsSearch = true;
        $scope.bookmarksTable.page(1);
        $scope.bookmarksTable.reload();
    };

    $scope.addTagFromAssociated = function (tag) {
        console.log('addTagFromAssociated: tag: ', tag);
        $scope.tabs[$scope.activeTab].tags.push(tag);
        $scope.reloadBookmarksTable();
    };

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

    function searchTagsAndFilter(txt, filter) {
        var deferred = $q.defer();
        BookmarkService.searchTags(txt).then(
            function (data) {
                var output = Restangular.stripRestangular(data);
                if (filter) {
                    output = filter(output);
                }
                deferred.resolve(output);
            },
            function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    }

    $scope.searchTags = function (txt) {
        return searchTagsAndFilter(txt);
    };

    function excludeTags(collection, excludes) {
        return _.filter(collection, function(tag) {
            return !excludes.some(function(excludeTag) {
                return excludeTag.id === tag.id;
            });
        });
    }

    function searchTagsAndExclude(txt, excludes) {
        if ($scope.tabs[$scope.activeTab].associatedTags.length === 0) {
            return searchTagsAndFilter(txt, function(foundTags) {
                return excludeTags(foundTags, excludes);
            });
        }
        else {
            var foundTags = _.filter($scope.tabs[$scope.activeTab].associatedTags, function (tag) {
                return tag.name.startsWith(txt);
            });
            return excludeTags(foundTags, excludes);
        }
    }

    $scope.searchQueryTags = function (txt) {
        // TODO: don't list excluded tags
        return searchTagsAndExclude(txt, $scope.tabs[$scope.activeTab].excludedTags);
    };

    $scope.searchExcludeTags = function (txt) {
        // TODO: don't list query tags
        return searchTagsAndExclude(txt, $scope.tabs[$scope.activeTab].tags);
    };

    $scope.searchCriteria = {
        firstResult: 0,
        resultsCount: 10,
    };

    $scope.bookmarksTotal = 0;

    $scope.bookmarksTable = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
            'lastModified': 'desc'
        }
    }, {
        getData: function ($defer, params) {
            console.log('getData: $scope.activeTab: ', $scope.activeTab);
            console.log('getData: tags: ', $scope.tabs[$scope.activeTab].tags);
            var sorting = params.sorting();
            var sortProperty = Object.keys(sorting)[0];
            var sortOrder = sorting[sortProperty];

            var criteria = {
                page: params.page()-1,
                size: params.count(),
                sort: sortProperty + ',' + sortOrder
            };
            // criteria['id.dir'] = 'desc';
            if ($scope.tabs[$scope.activeTab].tags.length > 0) {
                criteria.tagIds = toJoinedTagIds($scope.tabs[$scope.activeTab].tags);
            }
            if ($scope.tabs[$scope.activeTab].excludedTags.length > 0) {
                criteria.excludedTagsIds = toJoinedTagIds($scope.tabs[$scope.activeTab].excludedTags);
            }
            if ($scope.tabs[$scope.activeTab].associatedTagsSearch) {
                $scope.bookmarksTotal = 'Searching...';
                BookmarkService.searchBookmarksAndAssociatedTagsPageable(criteria).then(function (result) {
                    var pair = Restangular.stripRestangular(result);
                    var page = pair[0];
                    console.log('getData: page: ', page);
                    $scope.tabs[$scope.activeTab].associatedTags = pair[1];
                    params.total(page.totalElements);
                    $scope.bookmarksTotal = page.totalElements;
                    $defer.resolve(page.content);
                }, function (error) {
                    $scope.bookmarksTotal = 'Failed';
                    console.error('getData: searchBookmarksAndAssociatedTagsPageable failed: ', error);
                });
                $scope.associatedTagsSearch = false;
            }
            else {
                $scope.bookmarksTotal = 'Searching...';
                BookmarkService.searchBookmarksPageable(criteria).then(function (result) {
                    var page = Restangular.stripRestangular(result);
                    console.log('getData: page: ', page);
                    params.total(page.totalElements);
                    $scope.bookmarksTotal = page.totalElements;
                    $defer.resolve(page.content);
                }, function (error) {
                    $scope.bookmarksTotal = 'Failed';
                    console.error('getData: searchBookmarksPageable failed: ', error);
                });
                if ($scope.tabs[$scope.activeTab].tags.length === 0) {
                    $scope.tabs[$scope.activeTab].associatedTags = [];
                    return;
                }
            }

        }
    });

    $scope.displayNames = function (tags) {
        return _.map(tags, function (tag) {
            return tag.name;
        }).join();
    };

    $scope.copyTags = function () {
        console.log('copyTags');
        $scope.bookmark.tags = _.union($scope.bookmark.tags, $scope.tabs[$scope.activeTab].tags);
    };

    $scope.archive = function () {
        console.log('archive');
        growl.success('<b>archive</b><br/>new line<br/>another line', {
            ttl: 9000
        });
    };

    $scope.searchBookmarks = function () {
        console.log('search');
        //BookmarkService.searchBookmarks($scope.tags);
        $scope.bookmarksTable.reload();
        //$scope.getAssociatedTags();
    };

    $scope.onClick = function (bookmark) {
        console.log('onClick: bookmark: ', bookmark);
        $scope.bookmark = bookmark;
        // var path = 'bookmark/' + bookmark.id;
        // console.log('onClick: path: ', path);
        // $location.path(path);
    };

    $scope.tagClicked = function (tag) {
        console.log('tagClicked: tag: ', tag);
        $scope.bookmarksTableReload = false;
        $scope.activeTab = TAG_TAB;

        function setTag(tag) {
            $scope.tabs[$scope.activeTab].tags = [ tag ];
            $scope.tag = tag;
            $scope.reloadBookmarksTable();
        }

        if (tag.id) {
            BookmarkService.getTag(tag.id).then(function (tag) {
                tag = Restangular.stripRestangular(tag);
                setTag(tag);
            }, function (error) {
                console.error('getTag failed: ', error);
            });
        }
        else {
            BookmarkService.searchTags(tag.name, true).then(function (tags) {
                tags = Restangular.stripRestangular(tags);
                if (tags.length > 0) {
                    setTag(tags[0]);
                }
                else {
                    setTag(tag);
                }
            }, function (error) {
                console.error('searchTags failed: ', error);
            });
        }
    };

    $scope.loadTitle = function () {
        console.log('loadTitle');
        BookmarkService.loadTitle($scope.bookmark.uri).then(function (title) {
            console.log('loadTitle: title: ', title);
            $scope.bookmark.title = title;
            growl.success('Title scraped', { ttl: 5000 });
        }, function (error) {
            console.error('loadTitle failed: ', error);
        });
    };

    $scope.deleteBookmark = function () {
        console.log('deleteBookmark');
        if (!$scope.bookmark.id) {
            console.error('cant deleteBookmark - bookmark id is undefined');
            growl.error('Cant deleteBookmark - bookmark id is undefined', { ttl: 5000 });
            return;
        }
        BookmarkService.deleteBookmark($scope.bookmark.id).then(function () {
            growl.success('Bookmark deleted', { ttl: 5000 });
            $scope.clearBookmark();
            $scope.reloadBookmarksTable();
        }, function (error) {
            console.error('deleteBookmark failed: ', error);
        });
    };

    $scope.createOrUpdateBookmark = function (bookmark, bookmarkForm) {
        console.log('createOrUpdateBookmark');
        if (!bookmarkForm.$valid) {
            console.error('bookmarkForm invalid');
            growl.error('bookmarkForm invalid', { ttl: 5000 });
            return;
        }
        var operation = bookmark.id ? BookmarkService.updateBookmark : BookmarkService.createBookmark;
        ProgressBarService.openModal(1, 'Creating bookmark');
        operation(bookmark).then(function (bookmark) {
            ProgressBarService.closeModal();
            growl.success('Bookmark ' + ($scope.bookmark.id ? 'updated' : 'created'), { ttl: 5000 });
            $scope.bookmark = Restangular.stripRestangular(bookmark);
            $scope.reloadBookmarksTable();
        }, function (error) {
            ProgressBarService.closeModal();
            console.error('createOrUpdateBookmark failed: ', error);
            if (error.data && error.data.errorType === 'ConstraintViolationRestError') {
                console.log('error.data.errorType');
                bookmarkForm.bookmarkUri.$setValidity('required', false);
            }
        });
    };

    $scope.createOrUpdateTag = function (tag, tagForm) {
        console.log('createOrUpdateTag');
        if (!tagForm.$valid) {
            console.error('tagForm invalid');
            return;
        }
        var operation = tag.id ? BookmarkService.updateTag : BookmarkService.createTag;
        if (tag.aliases) {
            tag.aliases = tag.aliases.map(function (tag) {
                return tag.text;
            });
        }
        operation(tag).then(function (tag) {
            growl.success('Tag ' + $scope.tag.id ? 'updated' : 'created', { ttl: 5000 });
            $scope.tag = Restangular.stripRestangular(tag);
            $scope.reloadBookmarksTable();
        }, function (error) {
            console.error('createOrUpdateTag failed: ', error);
        });
    };

    $scope.deleteTag = function () {
        console.log('deleteTag');
        if (!$scope.tag.id) {
            console.error('cant deleteTag - tag id is undefined');
            growl.error('Cant deleteTag - tag id is undefined', { ttl: 5000 });
            return;
        }
        BookmarkService.deleteTag($scope.tag.id).then(function () {
            growl.success('Tag deleted', { ttl: 5000 });
            $scope.clearTag();
            $scope.reloadBookmarksTable();
        }, function (error) {
            console.error('deleteTag failed: ', error);
        });
    };

    $scope.isTagNameInvalid = function (tagForm) {
        return tagForm.tagName.$invalid;
    };

    $scope.isTagAliasValid = function (name) {
        console.log('isTagAliasValid: name: ', name);
        var deferred = $q.defer();
        BookmarkService.findByNameOrAliasIgnoreCase(name.text).then(function (result) {
            if (result) {
                var tag = Restangular.stripRestangular(result);
                $scope.conflictingTag = tag;
                deferred.resolve(false);
            }
            else {
                deferred.resolve(true);
            }
        }, function(error){
            console.error('isTagAliasValid failed: ', error);
            deferred.resolve(false);
        });
        return deferred.promise;
    };

    $scope.mergeTag = function (masterTagId, mergeTagId) {
        BookmarkService.mergeTags(masterTagId, mergeTagId).then(function (result) {
            growl.success('Tag merged', { ttl: 5000 });
            var tag = Restangular.stripRestangular(result);
            $scope.tag = tag;
            $scope.conflictingTag = emptyTag();
        }, function(error){
            console.error('mergeTag failed: ', error);
        });
    };
  });
