(function () {
    angular.module('app.authentication', [
        "angular-jwt"
    ])
        .config(routeConfig)
        .run(run);

    routeConfig.$inject = [
        'stateHelperProvider',
        'jwtOptionsProvider',
        '$httpProvider'
    ];

    function routeConfig(stateHelperProvider, jwtOptionsProvider, $httpProvider) {

        jwtOptionsProvider.config({
            tokenGetter: ['AuthenticationService', 'options', function (AuthenticationService, options) {
                //Skip sending token for template requests
                if (options.url.substr(options.url.length - 5) == '.html') {
                    return null;
                }

                var token = AuthenticationService.getToken();
                if (token) {
                    if (AuthenticationService.isTokenExpired()) {
                        //return AuthenticationService.refreshToken();
                    } else {
                        return token;
                    }
                }
            }],

            whiteListedDomains: ['192.168.33.10', 'localhost']
        });

        $httpProvider.interceptors.push('jwtInterceptor');

        stateHelperProvider
            .state({
                name: 'login',
                url: '/login',
                controller: 'AuthController as auth',
                templateUrl: 'templates/login.html',
                data: { loginNotRequired: true }
            }).state({
                name: 'restorePassword',
                url: '/restorePassword?token',
                controller: 'RestorePasswordController as restorePass',
                templateUrl: 'app/components/authentication/views/auth.restorePassword.view.html',
                data: { loginNotRequired: true }
            });
    }

    run.$inject = [
        '$rootScope',
        '$state',
        'AuthenticationService',
        'AUTH_DEFAULTS',
        'inform',
        '$state'
    ];

    function run($rootScope, $state, AuthenticationService, AUTH_DEFAULTS,inform, $state) {

        $rootScope.$on('$stateChangeStart', function (evt, to, toParams, from) {
            if ((to.data && !to.data.loginNotRequired) || !to.data) {
                if (!AuthenticationService.getToken()) {
                    evt.preventDefault();
                    $state.go(AUTH_DEFAULTS.LOGIN_STATE,
                        {
                            message: "Debe iniciar sesión"
                        },
                        {
                            reload: true
                        });
                }
                else if (AuthenticationService.isTokenExpired()) {
                    inform.add("Debe volver a Iniciar Sesión");
                    evt.preventDefault();
                    AuthenticationService.destroyToken();
                    $state.go(AUTH_DEFAULTS.LOGIN_STATE);
                } else if ((to.data && !to.data.authNotRequired) && !AuthenticationService.hasPermission(to.name)) {
                    evt.preventDefault();
                    $state.go(AUTH_DEFAULTS.FORBIDDEN_STATE);
                }
            } else if (AuthenticationService.getToken() && !AuthenticationService.isTokenExpired()
                && to.name === AUTH_DEFAULTS.LOGIN_STATE) {
                evt.preventDefault();
                $state.go(AUTH_DEFAULTS.LANDING_PAGE);
            }
        });
    }

})();