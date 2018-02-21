angular.module('bookmarksUiYoApp').constant('ApplicationSettings', {
    // baseUrl: 'http://localhost:8080/malibu',
    // baseUrl: 'http://bkmrk-marrhub.rhcloud.com/malibu',
    baseUrl: 'https://malibubkmrk.herokuapp.com/malibu'
});

angular.module('bookmarksUiYoApp').config(function (RestangularProvider, ApplicationSettings) {
    'use strict';
    RestangularProvider.setBaseUrl(ApplicationSettings.baseUrl);
    RestangularProvider.setDefaultHttpFields({
        'withCredentials': true
    });
    RestangularProvider.setDefaultHeaders({
        'X-Requested-With': 'XMLHttpRequest'
    });
    /*
    RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    */
});

// http://stackoverflow.com/questions/41211875/angularjs-1-6-0-latest-now-routes-not-working
angular.module('bookmarksUiYoApp').config(['$locationProvider', function($locationProvider) {
    'use strict';
  $locationProvider.hashPrefix('');
}]);