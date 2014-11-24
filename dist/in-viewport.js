(function (angular) {
    'use strict';

    angular
        .module('in-viewport', []);

})(window.angular);
(function (angular) {
    'use strict';

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

    angular
        .module('in-viewport')
        .directive('viewportEnter', viewportEnterDefinition);

})(window.angular);
(function (angular) {
    'use strict';

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

    angular
        .module('in-viewport')
        .directive('viewportLeave', viewportLeaveDefinition);

})(window.angular);
(function (angular) {
    'use strict';


    /**
     * Directive Definition for Viewport
     */
    function ViewportDefinition()
    {
        return {
            restrict: 'A',
            scope: true,
            controller: ViewportController,
            link: ViewportLinking
        };
    }

    /**
     * Controller for viewport directive
     * @constructor
     */
    function ViewportController($window)
    {
        var viewport    = null,
            isUpdating  = false,
            updateAgain = false,
            elements    = [], // keep elements in array for quick lookup
            items       = [],
            updateTimeout;

        function update ()
        {
            var viewportRect,
                elementRect,
                inViewport;

            if (!viewport) {
                return;
            }

            if (isUpdating) {
                updateAgain = true;
                return;
            }

            isUpdating = true;

            viewportRect = viewport.getBoundingClientRect();

            angular.forEach(items, function (item) {
                elementRect = item.element.getBoundingClientRect();

                inViewport =
                    pointIsInsideBounds(elementRect.left, elementRect.top, viewportRect) ||
                    pointIsInsideBounds(elementRect.left + elementRect.width, elementRect.top, viewportRect) ||
                    pointIsInsideBounds(elementRect.left, elementRect.top + elementRect.height, viewportRect) ||
                    pointIsInsideBounds(elementRect.left + elementRect.width, elementRect.top + elementRect.height, viewportRect);

                // On first check and on change
                if (item.state === null || item.state !== inViewport) {
                    if (inViewport && typeof item.enter === 'function') {
                        item.enter();
                    } else if (!inViewport && typeof item.leave === 'function') {
                        item.leave();
                    }
                }

                item.state = inViewport;
            });

            isUpdating = false;

            if (updateAgain) {
                updateAgain = false;
                update();
            }
        }

        /**
         * Check if a point is inside specified bounds
         * @param x
         * @param y
         * @param bounds
         * @returns {boolean}
         */
        function pointIsInsideBounds(x, y, bounds)
        {
            return  x >= bounds.left &&
            y >= bounds.top &&
            x <= bounds.left + bounds.width &&
            y <= bounds.top + bounds.height;
        }

        /**
         * Set the viewport element
         * @param element
         */
        function setViewport (element)
        {
            viewport = element;
        }

        /**
         * trigger an update
         */
        function updateDelayed()
        {
            window.clearTimeout(updateTimeout);
            updateTimeout = window.setTimeout(function () {
                update();
            }, 100);
        }

        /**
         * Add listener for event
         * @param event
         * @param element
         * @param callback
         */
        function add (event, element, callback)
        {
            var index;

            if (['leave', 'enter'].indexOf(event) === -1) {
                throw 'invalid event specified';
            }

            index = elements.indexOf(element);

            if (index === -1) {
                elements.push(element);
                items.push({
                    element: element,
                    state: null,
                    leave: null,
                    enter: null
                });

                index = elements.length - 1;
            }

            items[index][event] = callback;
        }

        angular.element($window)
            .on('resize', updateDelayed)
            .on('orientationchange', updateDelayed);

        this.setViewport = setViewport;
        this.add = add;
        this.updateDelayed = updateDelayed;
    }

    // DI for controller
    ViewportController.$inject = ['$window'];

    /**
     * Linking method for viewport directive
     * @param $scope
     * @param iElement
     * @param controllers
     * @param controllers
     * @param $timeout
     * @constructor
     */
    function ViewportLinking($scope, iElement, iAttrs, viewport)
    {
        viewport.setViewport(iElement[0]);
        iElement.on('scroll', viewport.updateDelayed);

        // Trick angular in calling this on digest
        $scope.$watch(function () {
            viewport.updateDelayed();
        });
    }

    ViewportLinking.$inject = ['$scope', 'iElement', 'iAttrs', 'viewport'];

    angular
        .module('in-viewport')
        .directive('viewport', ViewportDefinition);


})(window.angular);