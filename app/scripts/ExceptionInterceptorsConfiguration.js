angular.module('bookmarksUiYoApp').config(function ($httpProvider, $provide) {
    'use strict';
    //http errors will be shown using growl
    $provide.factory('GrowlHttpInterceptor', function ($location, $q, growl) {

        function createGrowl(rejection) {
            console.log('createGrowl');
            var errorMessage = null;
            if (rejection.data) {
                if (rejection.data.message) {
                    errorMessage = rejection.data.message;
                }
                else {
                    errorMessage = JSON.stringify(rejection.data);
                }
            }
            if (!errorMessage) {
                if (rejection.config && rejection.config.method && rejection.config.url) {
                    errorMessage = rejection.config.method + ' ' + rejection.config.url + ' failed';
                }
            }
            if (!errorMessage) {
                errorMessage = 'Unknown HTTP error';
            }
            growl.error(errorMessage.substring(0, 150), {ttl: 5000});
            return $q.reject(rejection);
        }

        function handleError(error) {
            console.log('handleError: error: ', JSON.stringify(error, null, 2));
            var status = error.status;
            console.log('handleError: status: ', status);
            if (status === 401 || status === 403) {
                console.log('handleError: handle auth');
                return handleAuth(error);
            }
            createGrowl(error);
            return $q.reject(error);
        }

        // https://github.com/witoldsz/angular-http-auth
        function handleAuth(error) {
            console.log('handleAuth');
            //var deferred = $q.defer();
            $location.path('/login');
            return $q.reject(error);
        }

        return {
            requestError: createGrowl,
            responseError: handleError
        };
    });

    $httpProvider.interceptors.push('GrowlHttpInterceptor');

    //js exceptions will be shown using growl
    //decorator used to keep logging functionality of original $exceptionHandler
    $provide.decorator('$exceptionHandler',
        function ($delegate, $injector) {
            return function (exception, cause) {
                $delegate(exception, cause);
                //using $injector to avoid circular dependency between growl and $exceptionHandler
                $injector.get('growl').error(exception.message);
            };
        });
});
