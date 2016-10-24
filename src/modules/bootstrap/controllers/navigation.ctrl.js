(function (module) {
    'use strict';

    module.controller("NavigationCtrl", NavigationCtrl);

    NavigationCtrl.$inject = [
        "$scope",
        "$state"
    ];

    function NavigationCtrl($scope, $state) {

        var self = this;

        $scope.active = "";

        self.init = function() {
            $scope.active = $state.current.name;
        }

        self.logOut = function(){
            $state.go("login");
        }

        self.init();
    }
})(angular.module("app"));
