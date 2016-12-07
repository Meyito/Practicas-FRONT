(function (module) {
    "use strict";

    module.directive('hasPermission', function (AuthenticationService) {

        return function (scope, element, attrs) {
            if (!AuthenticationService.hasPermission(attrs["hasPermission"])) {
                element.remove();
            }
        }
    });

})(angular.module('app'));