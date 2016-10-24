(function (module) {
    'use strict';

    module.controller("LoginCtrl", LoginCtrl);

    LoginCtrl.$inject = [
        "$scope",
        "$state"
    ];

    function LoginCtrl($scope, $state) {

        var self = this;

        $scope.data;

        self.login = function(){
            $state.go("development-plan");
        }

        self.init = function () {

        }

        self.init();


    }
})(angular.module("app"));
