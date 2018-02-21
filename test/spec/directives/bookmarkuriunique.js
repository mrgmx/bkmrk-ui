'use strict';

describe('Directive: bookmarkUriUnique', function () {

  // load the directive's module
  beforeEach(module('bookmarksUiYoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bookmark-uri-unique></bookmark-uri-unique>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bookmarkUriUnique directive');
  }));
});
