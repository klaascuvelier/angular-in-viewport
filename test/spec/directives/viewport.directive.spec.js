'use strict';

describe('in-viewport: viewport directive', function() {

    var $compile,
        $rootScope,
        $scope;

    beforeEach(module('in-viewport'));

    beforeEach(inject(function (_$compile_, _$rootScope_, viewportDirective) {
        $compile        = _$compile_;
        $rootScope      = _$rootScope_;
        $scope          = $rootScope.$new();

    }));

    function createEvent(name)
    {
        var event = document.createEvent("HTMLEvents");
        event.initEvent(name, true, true)
        event.eventName = name;
        return event;
    }

    describe('Controller API', function () {
        var controller, element, elementScope;

        beforeEach(function () {
            element = angular.element('<div viewport></div>');

            $compile(element)($scope);
            elementScope = element.scope();
            $scope.$digest();
            controller = element.controller('viewport');
        });

        describe('setViewport/getViewport', function () {
            it('should set/get the current viewport element', function () {
                var viewport = {};
                controller.setViewport(viewport);
                expect(controller.getViewport()).toEqual(viewport);
            });
        });

        describe('add', function () {
            it('should throw an error when an invalid event is specified', function () {
                expect(function () {
                    controller.add('foo', {}, function () {});
                }).toThrow('invalid event specified');
            });

            it('should add the listeners to the list', function () {
                var element = {},
                    onEnter = function () {},
                    onLeave = function () {},
                    items;

                controller.add('enter', element, onEnter);
                controller.add('leave', element, onLeave);

                items = controller.getItems();

                expect(items.length).toBe(1);
                expect(items[0].leave).toBe(onLeave);
                expect(items[0].enter).toBe(onEnter);
                expect(items[0].element).toBe(element);
            });
        });

        describe('updateDelayed', function () {
            it('should exist', function () {
                expect(controller.updateDelayed).toBeDefined();
            });

            it('should be called on window resize', function () {
                spyOn(window, 'setTimeout');
                window.dispatchEvent(createEvent('resize'));
                expect(window.setTimeout.calls.count()).toBe(5);
            });

            it('should be called on window orientationchange', function () {
                spyOn(window, 'setTimeout');
                window.dispatchEvent(createEvent('orientationchange'));
                expect(window.setTimeout.calls.count()).toBe(6);
            });

            it('should be called on viewport scroll', function () {
                spyOn(window, 'setTimeout');
                element[0].dispatchEvent(createEvent('scroll'));
                expect(window.setTimeout.calls.count()).toBe(1);
            });
        });
    });

    describe('Update', function () {

        it('should call the on enter callback', function () {
            spyOn(window, 'setTimeout').and.callFake(function (callback) {
                callback();
            });

            var element = angular.element(
                    '<div viewport style="width: 400px; height: 200px; overflow: scroll">' +
                        '<div style="margin-top: 500px; height: 100px; width: 200px;" viewport-enter="entered = true"></div>' +
                    '</div>'
                ), elementScope;

            document.body.appendChild(element[0]);

            $compile(element)($scope);
            elementScope = element.scope();

            element[0].scrollTop = 550;
            element[0].dispatchEvent(createEvent('scroll'));
            expect(elementScope.entered).toBeTruthy();
        });

        it('should call the on enter callback', function () {
            spyOn(window, 'setTimeout').and.callFake(function (callback) {
                callback();
            });

            var element = angular.element(
                    '<div viewport style="width: 200px; height: 200px; overflow: auto">' +
                        '<div style="height: 210px; width: 200px"></div>' +
                        '<div style="height: 100px; width: 200px;" viewport-leave="leftIt = true"></div>' +
                    '</div>'
                ), elementScope;

            document.body.appendChild(element[0]);

            $compile(element)($scope);
            elementScope = element.scope();

            element[0].scrollTop = 550;
            element[0].dispatchEvent(createEvent('scroll'));;

            element[0].scrollTop = 0;
            element[0].dispatchEvent(createEvent('scroll'));
            expect(elementScope.leftIt).toBeTruthy();
        });

    });



});