'use strict';

describe('Directive: tagUnique', function () {

  // load the directive's module
  beforeEach(module('bookmarksUiYoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tag-unique></tag-unique>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tagUnique directive');
  }));
});
