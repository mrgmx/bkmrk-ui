angular.module('bookmarksUiYoApp').service('ProgressBarService', function ($uibModal, /* $state, */ $timeout) {
    'use strict';

    var modalInstance;

    var promiseFromAutoRefresh;

    //var currentStateName;

    var progressBarModelController = function ($scope, expectedResponseTime, message) {
        $scope.progressBarValue = 1;

        $scope.expectedResponseTime = expectedResponseTime;

        $scope.message = message;

        (function autoRefresh() {
            if ($scope.progressBarValue < 100) {
                $scope.progressBarValue += 1;
            }
            promiseFromAutoRefresh = $timeout(autoRefresh, expectedResponseTime/100);
        })();
    };

    var openModal = function (expectedResponseTime, message) {
        //currentStateName = $state.current.name;
        modalInstance = $uibModal.open({
            //templateUrl: 'app/group/progressBarDialog.html',
            templateUrl: 'views/progressBarDialog.html',
            controller: progressBarModelController,
            resolve: {
                expectedResponseTime: function () {
                    return expectedResponseTime;
                },
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function() {
            $timeout.cancel(promiseFromAutoRefresh);
        });
    };

    var closeModal = function () {
        //if($state.current.name === currentStateName){
            console.log('ProgressBarService.closeModal');
            modalInstance.close();
        //}
    };

    return {
        openModal: openModal,
        closeModal: closeModal
    };
});
