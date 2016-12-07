(function (module) {
    'use strict';

    module.controller("NavigationCtrl", NavigationCtrl);

    NavigationCtrl.$inject = [
        "$scope",
        "$state",
        "AuthenticationService"
    ];

    function NavigationCtrl($scope, $state, AuthenticationService) {

        var self = this;

        $scope.active = "";

        self.init = function() {
            $scope.active = $state.current.data.state;
            $scope.currentUser = AuthenticationService.getCurrentUser();
        }

        self.logOut = function(){
            AuthenticationService.logout().then(
                function(response){
                    AuthenticationService.destroyToken();
                    $state.go("login");
                }
            );
        }

        self.init();
    }
})(angular.module("app"));
