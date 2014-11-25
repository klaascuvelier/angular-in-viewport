[![GitHub version](https://badge.fury.io/gh/showpad%2Fangular-in-viewport.svg)](http://badge.fury.io/gh/showpad%2Fangular-in-viewport)
[![Bower version](https://badge.fury.io/bo/angular-in-viewport.svg)](http://badge.fury.io/bo/angular-in-viewport)
[![NPM version](https://badge.fury.io/js/angular-in-viewport.svg)](http://badge.fury.io/js/angular-in-viewport)

[![Build Status](https://travis-ci.org/showpad/angular-in-viewport.svg)](https://travis-ci.org/showpad/angular-in-viewport)

angular-in-viewport
===================

Set of directives handling events when a DOM element enters or leaves a viewport

### viewport
Directive (attribute) specifying the DOM element which should be used as viewport

### viewport-enter
Directive (attribute) specifying a DOM element which should be watched. When the element enters the viewport the value of the attribute will be evaled.

### viewport-leave
Directive (attribute) specifying a DOM element which should be watched. When the element leaves the viewport the value of the attribute will be evaled.

#Compatibility
This plugin has been tested with Angular 1.2 and 1.3

#Example
```HTML
<ul style="width: 200px; height: 200px" viewport>
  <li ng-repeat="item in items" style="width: 200px; height: 200px" viewport-leave="item.visible = false" viewport-enter="item.visible = true">
</ul>
```

# License
This Angular module has been published under the [MIT license](LICENSE)
