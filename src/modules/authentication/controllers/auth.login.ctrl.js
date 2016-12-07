(function (module) {
    'use strict';

    module.controller("AuthController", AuthController);

    AuthController.$inject = [
        "$scope",
        "AuthenticationService",
        "$state",
        "AUTH_DEFAULTS",
        "blockUI",
        "inform"
    ];

    function AuthController($scope, AuthenticationService, $state, AUTH_DEFAULTS, blockUI, inform) {
        var auth = this;
        auth.credentials = {};

        auth.login = function (formLogin) {

            if (formLogin.$invalid) {
                return;
            }

            blockUI.start();
            auth.error = undefined;

            AuthenticationService.login(auth.credentials).then(function () {
                $state.go(AUTH_DEFAULTS.LANDING_PAGE);
            }).catch(function (error) {
                inform.add("Usuario y/o contraseña incorrectos", {type: "warning"});
                if (error.status == 400) {
                    auth.error = error.data.error;
                }
            }).finally(function () {
                blockUI.stop();
            });
        };

        auth.showForgotPassword = function () {
            auth.credentials = {};
            auth.error = undefined;
            auth.forgotPassword = true;
            auth.recoveryEmail = undefined;
        };

        auth.hideForgotPassword = function () {
            auth.recoveryEmail = undefined;
            auth.forgotPassword = false;
        };

        auth.recoverPassword = function () {
            blockUI.start();
            auth.error = undefined;

            AuthenticationService.recoverPassword(auth.recoveryEmail).then(function (response) {
                auth.recoverSuccess = true;
            }).catch(function (error) {
                if (error.status == 400) {
                    auth.error = error.data.error;
                }
            }).finally(function () {
                blockUI.stop();
            });
        };
    }
})(angular.module("app.authentication"));