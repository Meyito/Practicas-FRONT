(function (module) {
    'use strict';

    module.controller("AuthController", AuthController);

    AuthController.$inject = [
        "$scope",
        "AuthenticationService",
        "$state",
        "AUTH_DEFAULTS"
        //"blockUI"
    ];

    function AuthController($scope, AuthenticationService, $state, AUTH_DEFAULTS) {
        var auth = this;
        //var loginSection = blockUI.instances.get('loginSection');
        auth.credentials = {};

        auth.login = function (formLogin) {

            if (formLogin.$invalid) {
                return;
            }

            //loginSection.start();
            auth.error = undefined;

            AuthenticationService.login(auth.credentials).then(function () {
                $state.go(AUTH_DEFAULTS.LANDING_PAGE);
            }).catch(function (error) {
                if (error.status == 400) {
                    auth.error = error.data.error;
                }
            }).finally(function () {
                //loginSection.stop();
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

            //loginSection.start();
            auth.error = undefined;

            AuthenticationService.recoverPassword(auth.recoveryEmail).then(function (response) {
                auth.recoverSuccess = true;
            }).catch(function (error) {
                if (error.status == 400) {
                    auth.error = error.data.error;
                }
            }).finally(function () {
                //loginSection.stop();
            });
        };
    }
})(angular.module("app.authentication"));