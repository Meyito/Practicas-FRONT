(function (module) {
    'use strict';

    module.controller("DashboardCtrl", DashboardCtrl);

    DashboardCtrl.$inject = [
        "$scope",
        "AuthenticationService",
        "$window",
        "APP_DEFAULTS"
    ];

    function DashboardCtrl($scope, AuthenticationService, $window, APP_DEFAULTS ) {

        var self = this;

        $scope.user = AuthenticationService.getCurrentUser().name;
        $scope.role = AuthenticationService.getCurrentUser().role;

        self.downloadGuide = function(){
            if( $scope.role == "admin" ){
                $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Manual_Usuario_Admin.pdf');
            }else if( $scope.role == "secretaria" ){
                $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Manual_Usuario_Secretaria.pdf');
            }else if( $scope.role == "planeacion" ){
                $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Manual_Usuario_Planeacion.pdf');
            }
        }

    }
})(angular.module("app"));
