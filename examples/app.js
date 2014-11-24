(function (angular) {
    'use strict';

    /**
     * Just a test controller
     * @param $scope
     * @constructor
     */
    function TestCtrl($scope)
    {
        $scope.items = [{}, {}, {}, {}];
    }

    TestCtrl.$inject = ['$scope'];

    // Bootstrap app
    angular
        .module('app', ['in-viewport']);


    // Add test controller
    angular
        .module('app')
        .controller('TestCtrl', TestCtrl);


})(window.angular);