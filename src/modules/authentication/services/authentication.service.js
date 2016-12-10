(function (module) {
    'use strict';

    module.service("AuthenticationService", AuthenticationService);

    AuthenticationService.$inject = [
        "$http",
        "$q",
        "store",
        'AUTH_DEFAULTS',
        "jwtHelper",
        "APP_DEFAULTS"
    ];

    function AuthenticationService($http, $q, store, AUTH_DEFAULTS, jwtHelper, APP_DEFAULTS) {
        var self = this;
        var resource = "/authenticate";

        self.getCurrentUser = function () {
            var payload = jwtHelper.decodeToken(self.getToken());
            
            var user = {
                id: payload.id,
                name: payload.name,
                role: payload.role.role_name,
                permissions: payload.views,
                secretary_id: payload.secretary_id
            };

            return user;
        };

        self.login = function (credentials) {
            var deferred = $q.defer();

            $http({
                method: "POST",
                data: credentials,
                skipAuthorization: true,
                url: APP_DEFAULTS.ENDPOINT + "/login",
            }).then(function (response) {
                self.setToken(response.data.token);
                deferred.resolve(self.getCurrentUser());
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        self.setToken = function (token) {
            store.set("token", token);
        };

        self.getToken = function () {
            return store.get(AUTH_DEFAULTS.TOKEN_NAME);
        };

        self.isTokenExpired = function () {
            return jwtHelper.isTokenExpired(self.getToken());
        };

        self.destroyToken = function () {
            return store.remove(AUTH_DEFAULTS.TOKEN_NAME);
        };

        self.recoverPassword = function (email) {
            return $http({
                method: "GET",
                params: { email: email },
                skipAuthorization: true,
                url: APP_DEFAULTS.ENDPOINT + resource + "/recover-password",
            });
        };

        self.getRestoreToken = function (token) {
            return $http({
                method: "GET",
                skipAuthorization: true,
                url: APP_DEFAULTS.ENDPOINT + resource + "/restore-token/" + token,
            });
        };

        self.updatePassword = function (params, id) {
            return $http({
                method: "PUT",
                data: params,
                url: APP_DEFAULTS.ENDPOINT + "/authentication/" + id + "/update"
            });
        };

        /**
         * Checks if the current user has permissions to
         * enter to the given view
         * @param view : view name to check if the user has the permission
         * @returns {boolean}
         */
        self.hasPermission = function (view) {
            var user = self.getCurrentUser();
            if ( user.permissions[view] ) {
                return true;
            }
            return false;
        };

        self.logout = function () {
            return $http({
                method: "GET",
                url: APP_DEFAULTS.ENDPOINT + "/logout"
            })
        };

        return self;
    }
})(angular.module("app.authentication"));