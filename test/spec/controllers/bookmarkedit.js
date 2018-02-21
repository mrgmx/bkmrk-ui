'use strict';

describe('Controller: BookmarkeditCtrl', function () {

  // load the controller's module
  beforeEach(module('bookmarksUiYoApp'));

  var BookmarkeditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookmarkeditCtrl = $controller('BookmarkeditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BookmarkeditCtrl.awesomeThings.length).toBe(3);
  });
});
