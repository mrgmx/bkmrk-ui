'use strict';

describe('Controller: BookmarkCtrl', function () {

  // load the controller's module
  beforeEach(module('bookmarksUiYoApp'));

  var BookmarkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookmarkCtrl = $controller('BookmarkCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BookmarkCtrl.awesomeThings.length).toBe(3);
  });
});
