(function (angular) {
    'use strict';

    angular
        .module('in-viewport')
        .directive('viewportEnter', viewportEnterDefinition);

    /**
     * Directive definition for viewport-enter
     */
    function viewportEnterDefinition()
    {
        return {
            require: '^viewport',
            restrict: 'A',
            link: viewportEnterLinker
        };
    }

    /**
     * Linker method for enter directive
     * @param $scope
     * @param iElement
     * @param iAttrs
     * @param viewportController
     */
    function viewportEnterLinker($scope, iElement, iAttrs, controller)
    {
        if (iElement[0].nodeType !== 8 && iAttrs.viewportEnter) {
            controller.add('enter', iElement[0], function () {
                $scope.$apply(function () {
                    $scope.$eval(iAttrs.viewportEnter);
                });
            });
        }
    }

})(window.angular);