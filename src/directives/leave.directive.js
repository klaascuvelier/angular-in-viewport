(function (angular) {
    'use strict';

    angular
        .module('in-viewport')
        .directive('viewportLeave', viewportLeaveDefinition);

    /**
     * Directive definition for viewport-enter
     */
    function viewportLeaveDefinition()
    {
        return {
            require: '^viewport',
            restrict: 'A',
            link: viewportLeaveLinker
        };
    }

    /**
     * Linker method for leave directive
     * @param $scope
     * @param iElement
     * @param iAttrs
     * @param viewportController
     */
    function viewportLeaveLinker($scope, iElement, iAttrs, controller)
    {
        if (iElement[0].nodeType !== 8 && iAttrs.viewportLeave) {
            controller.add('leave', iElement[0], function () {
                $scope.$apply(function () {
                    $scope.$eval(iAttrs.viewportLeave);
                });
            });
        }
    }

})(window.angular);