(function (angular) {
    'use strict';

    angular
        .module('in-viewport', []);

})(window.angular);
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

                if (iAttrs.viewportLeave && iElement.attr('viewport-leave-registered') !== 'true') {
                    iElement.attr('viewport-leave-registered', 'true');

                    // Lazy add leave callback
                    controller.add('leave', iElement[0], function () {
                        $scope.$apply(function () {
                            $scope.$eval(iAttrs.viewportLeave);
                        });
                    });
                }
            });
        }
    }

})(window.angular);

(function (angular) {
    'use strict';

    angular
        .module('in-viewport')
        .directive('viewport', ViewportDefinition);

    /**
     * Directive Definition for Viewport
     */
    function ViewportDefinition($window)
    {
        return {
            restrict: 'A',
            scope: true,
            controller: ViewportController,
            link: viewportLinking($window)
        };
    }

    ViewportDefinition.$inject = ['$window'];

    /**
     * Controller for viewport directive
     * @constructor
     */
    function ViewportController($window)
    {
        var viewportFn  = null,
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

            if (!viewportFn) {
                return;
            }

            if (isUpdating) {
                updateAgain = true;
                return;
            }

            isUpdating = true;

            viewportRect = viewportFn();

            angular.forEach(items, function (item) {
                elementRect = item.element.getBoundingClientRect();

                inViewport =
                    pointIsInsideBounds(elementRect.left, elementRect.top, viewportRect) ||
                    pointIsInsideBounds(elementRect.right, elementRect.top, viewportRect) ||
                    pointIsInsideBounds(elementRect.left, elementRect.bottom, viewportRect) ||
                    pointIsInsideBounds(elementRect.right, elementRect.bottom, viewportRect);

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
            return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
        }

        /**
         * Set the viewport box function
         * @param function
         */
        function setViewportFn(fn)
        {
            viewportFn = fn;
        }

        /**
         * Return the current viewport box function
         * @returns {*}
         */
        function getViewportFn()
        {
            return viewportFn;
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

        /**
         * Get list of items
         * @returns {Array}
         */
        function getItems()
        {
            return items;
        }

        angular.element($window)
            .on('resize', updateDelayed)
            .on('orientationchange', updateDelayed);

        this.setViewportFn  = setViewportFn;
        this.getViewportFn  = getViewportFn;
        this.add            = add;
        this.getItems       = getItems;
        this.updateDelayed  = updateDelayed;
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
    function viewportLinking($window)
    {
        var linkFn = function($scope, iElement, iAttrs, $ctrl) {
            if (iAttrs.viewport === 'window') {
                $ctrl.setViewportFn(function() {
                    return {
                        top: 0,
                        left: 0,
                        bottom: window.innerHeight || document.documentElement.clientHeight,
                        right: window.innerWidth || document.documentElement.clientWidth
                    };
                });
                angular.element($window).on('scroll', $ctrl.updateDelayed);
            } else {
                $ctrl.setViewportFn(function() {
                    return iElement[0].getBoundingClientRect();
                });
                iElement.on('scroll', $ctrl.updateDelayed);
            }

            // Trick angular in calling this on digest
            $scope.$watch(function () {
                $ctrl.updateDelayed();
            });
        };

        linkFn.$inject = ['$scope', 'iElement', 'iAttrs', 'viewport'];

        return linkFn;
    }

    viewportLinking.$inject = ['$window'];

})(window.angular);