'use strict';

/**
 * @ngdoc service
 * @name bookmarksUiYoApp.BookmarkService
 * @description
 * # BookmarkService
 * Service in the bookmarksUiYoApp.
 */
angular.module('bookmarksUiYoApp')
  .service('BookmarkService', function (Restangular) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getBookmarks = function () {
        return Restangular.all('bookmark').getList();
    };
    this.getBookmark = function (bookmarkId) {
        console.log('getBookmark: bookmarkId: ' + bookmarkId);
        return Restangular.one('bookmark', bookmarkId).get();
    };
    this.loadTitle = function (url) {
        console.log('loadTitle: url: ' + url);
        return Restangular.one('bookmark/title').get({ 'uri': url });
    };
    this.createBookmark = function (bookmark) {
        return Restangular.all('bookmark').post(bookmark);
    };
    this.updateBookmark = function (bookmark) {
        //return Restangular.one('rest/groups', groupId).one('resources', resourceId).put({name: name});
        return Restangular.one('bookmark', bookmark.id).customPUT(bookmark);
    };
    this.deleteBookmark = function (bookmarkId) {
        console.log('deleteBookmark: bookmarkId: ' + bookmarkId);
        return Restangular.one('bookmark', bookmarkId).remove();
    };
    this.searchTags = function (txt, exact) {
        var searchCriteria = { 'name': txt };
        if (exact) {
            searchCriteria.prefix = !exact;
        }
        return Restangular.all('tag').getList(searchCriteria);
        //return Restangular.all('tag?name=' + txt).getList();
    };
    this.mergeTags = function (masterTagId, mergeTagId) {
        console.log('nameOrAliasIgnoreCaseExists: masterTagId: ', masterTagId, ', mergeTagId: ', mergeTagId);
        return Restangular.one('tag', masterTagId).customPUT(null, 'merge/' + mergeTagId);
    };
    this.nameOrAliasIgnoreCaseExists = function (txt) {
        console.log('nameOrAliasIgnoreCaseExists: txt: ', txt);
        return Restangular.one('tag/exists').get({ 'name': txt });
    };
    this.findByNameOrAliasIgnoreCase = function (txt) {
        console.log('nameOrAliasIgnoreCaseExists: txt: ', txt);
        return Restangular.one('tag/find').get({ 'name': txt });
    };
    this.getAssociatedTags = function (tags) {
        return Restangular.all('tag').customGETLIST('associated', { tagIds: tags });
    };
    // this.getAssociatedTags = function (tags, txt) {
        // return Restangular.all('tag').customGETLIST('associated/prefix', { tagIds: tags, prefix: txt });
    // };
    this.searchBookmarks = function (criteria) {
        return Restangular.all('bookmark').customGETLIST('', criteria);
    };
    this.searchBookmarksPaginated = function (tags) {
        return Restangular.all('bookmark').customGET('paginated', tags);
    };
    this.searchBookmarksPageable = function (criteria) {
        return Restangular.all('bookmark').customGET('pageable', criteria);
    };
    this.searchBookmarksAndAssociatedTagsPageable = function (criteria) {
        return Restangular.all('bookmark').customGET('associatedTags/pageable', criteria);
    };
    this.countBookmarks = function (criteria) {
        return Restangular.all('bookmark').customGET('count', criteria);
    };
    this.existsBookmark = function (criteria) {
        return Restangular.all('bookmark').customGET('exists', criteria);
    };
    this.getFirstBookmark = function (criteria) {
        return Restangular.all('bookmark').customGET('first', criteria);
    };
    this.getTag = function (tagId) {
        console.log('getTag: tagId: ' + tagId);
        return Restangular.one('tag', tagId).get();
    };
    this.createTag = function (tag) {
        return Restangular.all('tag').post(tag);
    };
    this.updateTag = function (tag) {
        return Restangular.one('tag', tag.id).customPUT(tag);
    };
    this.deleteTag = function (tagId) {
        console.log('deleteBookmark: tagId: ' + tagId);
        return Restangular.one('tag', tagId).remove();
    };
    this.bulkLoad = function (text, mode) {
        return Restangular.all('bookmark/bulk').post({ 'text': text, 'mode': mode });
    };
    this.isUniqueUri = function (uri) {
        return Restangular.one('bookmark/uri').get({ 'uri': uri });
    };
    // this.login = function (credentials) {
        // return Restangular.all('login').post(credentials);
        // return Restangular.all('login').get(credentials);
    // };
    this.login = function (credentials) {
        var basicAuth = credentials.username + ':' + credentials.password;
        console.log('login: basicAuth: ' + basicAuth);
        var basicAuthBase64 = btoa(basicAuth);
        console.log('login: basicAuthBase64: ' + basicAuthBase64);
        var authorization = {'Authorization': 'Basic ' + basicAuthBase64 };
        return Restangular.all('loginold').customGET('login', null, authorization);
    };
  });
