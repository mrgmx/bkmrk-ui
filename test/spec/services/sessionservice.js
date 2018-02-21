'use strict';

describe('Service: SessionService', function () {

  // load the service's module
  beforeEach(module('bookmarksUiYoApp'));

  // instantiate service
  var SessionService;
  beforeEach(inject(function (_SessionService_) {
    SessionService = _SessionService_;
  }));

  it('should do something', function () {
    expect(!!SessionService).toBe(true);
  });

});
