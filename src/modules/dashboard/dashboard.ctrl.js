(function (module) {
    'use strict';

    module.controller("DashboardCtrl", DashboardCtrl);

    DashboardCtrl.$inject = [
        "$scope",
        "AuthenticationService"
    ];

    function DashboardCtrl($scope, AuthenticationService) {

        var self = this;

        $scope.user = AuthenticationService.getCurrentUser().name;

        self.downloadGuide = function(){
            //Descargar el manual de usuario de acuerdo al rol del usuario.
        }

    }
})(angular.module("app"));
