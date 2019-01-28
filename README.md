[![GitHub version](https://badge.fury.io/gh/showpad%2Fangular-in-viewport.svg)](http://badge.fury.io/gh/showpad%2Fangular-in-viewport)
[![NPM version](https://badge.fury.io/js/angular-in-viewport.svg)](http://badge.fury.io/js/angular-in-viewport)

[![Build Status](https://travis-ci.org/showpad/angular-in-viewport.svg)](https://travis-ci.org/showpad/angular-in-viewport)

angular-in-viewport
===================

Set of directives handling events when a DOM element enters or leaves a viewport

### viewport
Directive (attribute) specifying the DOM element which should be used as viewport.

To use `window` as the viewport element, set `viewport="window"` on any parent element.

### viewport-enter
Directive (attribute) specifying a DOM element which should be watched. When the element enters the viewport the value of the attribute will be evaluated.

### viewport-leave
Directive (attribute) specifying a DOM element which should be watched. When the element leaves the viewport the value of the attribute will be evaluated.
The viewport-leave attribute needs a viewport-enter attribute with valid callback


#Compatibility
This plugin works with Angular 1.x (v1.2 and higher)

#Example

Viewport container element:

```HTML
<ul style="width: 200px; height: 200px" viewport>
  <li ng-repeat="item in items" style="width: 200px; height: 200px" viewport-leave="item.visible = false" viewport-enter="item.visible = true">
</ul>
```

Window viewport:

```HTML
<ul style="width: 200px; height: 200px" viewport="window">
  <li ng-repeat="item in items" style="width: 200px; height: 200px" viewport-leave="item.visible = false" viewport-enter="item.visible = true">
</ul>
```

# License
This Angular module has been published under the [MIT license](LICENSE)
