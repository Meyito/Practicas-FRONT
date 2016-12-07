(function () {
    'use strict';


    angular.module('app', [
        'ui.router',
        'ui.router.stateHelper',
        'angular.filter',
        'ui.bootstrap',
        'vAccordion',
        'ngAnimate',
        'ngFileUpload',
        'inform',
        'daterangepicker',
        'chart.js',
        'ngMaterial',
        'md.data.table',
        'ui.multiselect',
        'angularSpinner',
        'angular-jwt',
        'angular-storage',
        'app.authentication'
    ]).config(function ($stateProvider, $urlRouterProvider, stateHelperProvider) {

        /*$stateProvider
            .state('forbidden', {
                url: "/forbidden",
                templateUrl: "app/components/home/views/forbidden.view.html",
                data: {authNotRequired: true}
            })

            .state('home', {
                url: "/",
                templateUrl: "app/components/dashboard/views/dashboard.view.html",
                controller: "DashboardController as dashboard",
                data: {authNotRequired: true},
                resolve: {
                }
            });*/
            

        //Dashboard
        stateHelperProvider.state({
            name: 'dashboard',
            url: '/',
            data: {
                state: ""
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@dashboard': {
                    templateUrl: "templates/empty.html",
                    //controller: "ActivitiesCtrl as actCtrl"
                }
            }
        });

        //Plan de desarrollo
        stateHelperProvider.state({
            name: 'development-plan',
            url: '/plan-desarrollo',
            data: {
                state: "development-plan"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@development-plan': {
                    templateUrl: "templates/plan.detail.html",
                    controller: "PlanDetailCtrl as planCtrl"
                }
            },
            resolve: {
                DevelopmentPlans: ['PlanService', '$stateParams', function (PlanService, $stateParams) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms.goals",
                        //order_by: "id_"
                    }
                    return PlanService.getPlans(params);
                }],
            }
        });

        //Secretarias
        stateHelperProvider.state({
            name: 'secretaries',
            url: '/secretarias',
            data: {
                state: "secretaries"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@secretaries': {
                    templateUrl: "templates/secretaries.list.html",
                    controller: "SecretariesCtrl as secretariesCtrl"
                }
            },
            resolve: {
                Secretaries: ['SecretariesService', function (SecretariesService) {
                    var params = {}
                    return SecretariesService.getSecretaries(params);
                }],
            }
        });

        //Proyectos
        stateHelperProvider.state({
            name: 'projects',
            url: '/proyectos',
            data: {
                state: "projects"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@projects': {
                    templateUrl: "templates/projects.list.html",
                    controller: "ProjectsCtrl as projectsCtrl"
                }
            },
            resolve: {
                Dimentions: ['ProjectsService', function (ProjectsService) {
                    var params = {
                        relationships: "axes.programs.subprograms"
                    }
                    return ProjectsService.getDimentions(params);
                }],

                Projects: ['ProjectsService', function(ProjectsService){
                    var params = {
                        relationships: "subprogram",
                        'page': 1,
                        'items': 10,
                        'count': true
                    }
                    return ProjectsService.getProjects(params);
                }]
            }
        });

        //Estadisticas
        stateHelperProvider.state({
            name: 'statistics',
            url: '/estadisticas',
            data: {
                state: "statistics"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@statistics': {
                    templateUrl: "templates/statistics.list.html",
                    controller: "StatisticsCtrl as statisticsCtrl"
                }
            },
            resolve: {
                DevelopmentPlans: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms"
                        //relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
                    }
                    return StatisticService.getDevelopmentPlans(params);
                }],

               Secretaries: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getSecretaries(params);
                }],

                Counters: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "filters"
                    }
                    return StatisticService.getCounters(params);
                }],

                GenericFilters: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getGenericFilters(params);
                }]
            }
        });

        //Usuarios
        stateHelperProvider.state({
            name: 'users',
            url: '/usuarios',
            data: {
                state: "users"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@users': {
                    templateUrl: "templates/users.list.html",
                    controller: "UsersController as usersCtrl"
                }
            },
            resolve: {
                Roles: ['UsersService', function (UsersService) {
                    var params = {}
                    return UsersService.getRoles(params);
                }],

                Users: ['UsersService', function (UsersService) {
                    var params = {
                        relationships: 'role,secretary',
                        'page': 1,
                        'items': 15,
                        'count': true
                    }
                    return UsersService.getUsers(params);
                }],
                
                Secretaries: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getSecretaries(params);
                }]
            }
        });

        //Contratistas
        stateHelperProvider.state({
            name: 'contracts',
            url: '/contratistas',
            data: {
                state: "contracts"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@contracts': {
                    templateUrl: "templates/contracts.list.html",
                    controller: "ContractsCtrl as contractsCtrl"
                }
            },
            resolve: {
                IdentificationTypes: ['ContractsService', function (ContractsService) {
                    var params = {}
                    return ContractsService.getIdentificationTypes(params);
                }],
                Contractors: ['ContractsService', function (ContractsService) {
                    var params = {
                        relationships: 'contracts,identification_type',
                        'page': 1,
                        'items': 15,
                        'count': true
                    }
                    return ContractsService.getContractors(params);
                }]     
            }
        });

        //Entes Territoriales
        stateHelperProvider.state({
            name: 'territorial-entities',
            url: '/entes-territoriales',
            data: {
                state: "territorial-entities"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@territorial-entities': {
                    templateUrl: "templates/territorial-entities.view.html",
                    controller: "TerritorialCtrl as territorialCtrl"
                }
            }
        });

        //Actividades
        stateHelperProvider.state({
            name: 'activities',
            url: '/actividades',
            data: {
                state: "activities"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@activities': {
                    templateUrl: "templates/activities.list.html",
                    controller: "ActivitiesCtrl as actCtrl"
                }
            },
            resolve: {
                DevelopmentPlans: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms"
                        //relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
                    }
                    return StatisticService.getDevelopmentPlans(params);
                }],

                GenericFilters: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getGenericFilters(params);
                }],
                
                Secretaries: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getSecretaries(params);
                }]
            }
        });

        //Estadística de una Actividad
        stateHelperProvider.state({
            name: 'activity-statistics',
            url: '/actividades/{id}/estadistica',
            data: {
                state: "activities"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@activity-statistics': {
                    templateUrl: "templates/empty.html",
                    //controller: "ActivitiesCtrl as actCtrl"
                }
            },
            resolve: {
                DevelopmentPlans: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms"
                        //relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
                    }
                    return StatisticService.getDevelopmentPlans(params);
                }],

                GenericFilters: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getGenericFilters(params);
                }]
            }
        });

        //Nueva Actividad
        stateHelperProvider.state({
            name: 'new-activity',
            url: '/actividades/nueva',
            data: {
                state: "activities"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@new-activity': {
                    templateUrl: "templates/activities.new.html",
                    controller: "NewActivityCtrl as newActCtrl"
                }
            }
        });


    }).run(function ($rootScope) {

    });
})();
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
        'AUTH_DEFAULTS'
    ];

    function run($rootScope, $state, AuthenticationService, AUTH_DEFAULTS) {

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
                    AuthenticationService.refreshToken();
                } else if ((to.data && !to.data.authNotRequired) && !AuthenticationService.hasPermission(to.name)) {
                    evt.preventDefault();
                    //$state.go(AUTH_DEFAULTS.FORBIDDEN_STATE);
                    $state.go(AUTH_DEFAULTS.LOGIN_STATE);
                }
            } else if (AuthenticationService.getToken() && !AuthenticationService.isTokenExpired()
                && to.name === AUTH_DEFAULTS.LOGIN_STATE) {
                evt.preventDefault();
                $state.go(AUTH_DEFAULTS.LANDING_PAGE);
            }
        });
    }

})();
(function (module) {
    "use strict";

    //var ROOT_PATH = "https://whispering-garden-20822.herokuapp.com/";
    var ROOT_PATH = "http://192.168.33.10/Practicas-BACK/public/";

    module.constant("APP_DEFAULTS", {
        ENDPOINT: ROOT_PATH + "api/v1",
        ROOT_PATH: ROOT_PATH
    });

    module.constant("AUTH_DEFAULTS", {
        TOKEN_NAME: "token",
        LOGIN_STATE: "login",
        LANDING_PAGE: "dashboard",
        FORBIDDEN_STATE: "forbidden"
    });

})(angular.module('app'));
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
(function (module) {
    'use strict';

    module.controller("ModalController", ModalController);

    ModalController.$inject = [
        "$scope",
        "$uibModalInstance",
        "data"
    ];

    function ModalController($scope, $uibModalInstance, data) {

        var self = this;

        $scope.data = angular.copy(data);
        $scope.new_data = {};

        self.update = function () {
            $uibModalInstance.close($scope.data);
        };

        self.save = function () {
            $uibModalInstance.close($scope.new_data);
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /* Date Pickers */
        $scope.formats = ['yyyy','dd-MM-yyyy'];
        $scope.yearOnly = $scope.formats[0];
        $scope.dateComplete = $scope.formats[1];
        $scope.status = [false, false];

        $scope.open = function ($event, i) {
            $scope.status[i] = true;
        };

        $scope.yearOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'year'
        };
    }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("ActivitiesCtrl", ActivitiesCtrl);

    ActivitiesCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "$filter",
        "inform",
        "ActivitiesService",
        "$state",
        "DevelopmentPlans",
        "GenericFilters",
        "usSpinnerService",
        "Secretaries"
    ];

    function ActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ActivitiesService, $state, DevelopmentPlans, GenericFilters, usSpinnerService, Secretaries) {

        var self = this;

        $scope.expanded = false;
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.subprogram = -1;
        $scope.program = {};
        $scope.spinner = false;

        self.startSpin = function () {
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function () {
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        self.statistics = function (id) {
            $state.go("activity-statistics", { id: id });
        }

        self.newActivity = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Asistentes',
                ariaDescribedBy: 'cargar-asistentes',
                templateUrl: 'templates/assistants.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                ActivitiesService.uploadActivity(data).then(
                    function (response) {
                        inform.add("Se ha cargado la actividad correctamente", { type: "info" });
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar la actividad: \n"
                        var key, value, i;
                        for (var j in err.data) {
                            key = j;
                            value = err.data[j];
                            msg += key + ": ";
                            for (i = 0; i < err.data[j].length; i++) {
                                msg += err.data[j][i] + ",";
                            }
                            msg += "\n";
                        }
                        inform.add(msg, { ttl: -1, type: "warning" });
                    }
                );
            });
        }

        self.download = function () {
            $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_actividad.xlsx');
        }

        self.clearDevPlan = function(){
            $scope.dimention = {};
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearDim = function(){
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearAxe = function(){
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.parse = function () {
            $scope.subprogram = -1;
            $scope.program = {};
            var i;
            if ($scope.program_id) {
                for (i = 0; i < $scope.axe.programs.length; i++) {
                    if ($scope.axe.programs[i].id == $scope.program_id) {
                        $scope.program = $scope.axe.programs[i];
                        break;
                    }
                }
            }
        }

        self.belongsToSecretary = function (program) {
            if ($scope.secretary == -1) {
                return true;
            }
            var i;
            for (i = 0; i < program.secretaries.length; i++) {
                if (program.secretaries[i].secretary_id == $scope.secretary) {
                    return true;
                }
            }

            return false;
        }

        self.genericFilters = function () {
            var x;
            x = $scope.genericFilters[5];
            x.value = $scope.development_plan.id;
            $scope.req.filters.push(x);

            if ($scope.dimention.id) {
                x = $scope.genericFilters[4];
                x.value = $scope.dimention.id;
                $scope.req.filters.push(x);
            }

            if ($scope.axe.id) {
                x = $scope.genericFilters[3];
                x.value = $scope.axe.id;
                $scope.req.filters.push(x);
            }

            if ($scope.secretary != -1) {
                x = $scope.genericFilters[2];
                x.value = $scope.secretary;
                $scope.req.filters.push(x);
            }

            if ($scope.program.id) {
                x = $scope.genericFilters[1];
                x.value = $scope.program.id;
                $scope.req.filters.push(x);
            }

            if ($scope.subprogram != -1) {
                x = $scope.genericFilters[0];
                x.value = $scope.subprogram;
                $scope.req.filters.push(x);
            }
        }

        self.getActivities = function () {
            self.startSpin();
            $scope.activities = [];
            $scope.req = {
                filters: []
            };

            self.genericFilters();

            ActivitiesService.getActivities($scope.req).then(
                function (response) {
                    $scope.activities = response.data;
                    self.stopSpin();
                }, function (err) {
                    inform.add("Ocurrió un error al cargar las actividades", { type: "warning" });
                    self.stopSpin();
                }
            )
        }

        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.genericFilters = GenericFilters.data;
            $scope.secretaries = Secretaries.data;
        }

        self.init();


    }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("NewActivityCtrl", NewActivityCtrl);

    NewActivityCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "$filter",
        "inform",
        "ActivitiesService",
        "$state"
    ];

    function NewActivityCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ActivitiesService, $state) {

        var self = this;

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2000, 1, 1),
            startingDay: 1
        };

        $scope.popup1 = {
            opened: false
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.assistants = [];
        $scope.new_activity = {};


        self.saveActivity = function () {
            $scope.saved = true;
            inform.add("Se ha creado la nueva actividad", { type: "success" });
        }

        self.addAssistant = function () {
            $scope.assistants.push($scope.new_activity);
            $scope.new_activity = {};
        }

        self.saveAssistants = function () {
            inform.add("Se han guardado los asistentes a la actividad", { type: "success" });
        }

        self.deleteAssistant = function (id) {
            $scope.assistants.splice(id, 1);
        }

        self.upload = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Asistentes',
                ariaDescribedBy: 'cargar-asistentes',
                templateUrl: 'templates/assistants.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {                
                ActivitiesService.uploadActivity(data).then(
                    function (response) {
                        inform.add("Se ha cargado la actividad correctamente", { type: "info" });
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar la actividad", { type: "warning" });
                        //Descargar reporte de errores 
                    }
                );
            });
        }


        self.init = function () {
            $scope.saved = false;
            //$scope.saved = true;
        }

        self.init();





    }
})(angular.module("app"));


(function (module) {
    module.service("ActivitiesService", ActivitiesService);

    ActivitiesService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function ActivitiesService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.uploadActivity = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/activities/upload"
            });
        }

        self.getActivities = function(params){
            return $http({
                method: "POST",
                data: params,
                url: APP_DEFAULTS.ENDPOINT + "/activities/lite"
            })
        }

    }
})(angular.module("app"));
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
                name: payload.name,
                role: payload.role.name,
                permissions: payload.views
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

        self.updatePassword = function (params, token) {
            return $http({
                method: "PUT",
                data: params,
                skipAuthorization: true,
                url: APP_DEFAULTS.ENDPOINT + resource + "/" + token + "/update-password"
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
(function (module) {
    'use strict';

    module.controller("ContractsCtrl", ContractsCtrl);

    ContractsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal", 
        "$filter", 
        "inform",
        "IdentificationTypes",
        "ContractsService",
        "Contractors"
    ];

    function ContractsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, IdentificationTypes, ContractsService, Contractors) {

        var self = this;

        $scope.configDT = {
            limit: 15,
            page: 1
        }

        $scope.selectedContractor = {};

        self.getContractors = function(){
            var params = {
                relationships: 'contracts,identification_type',
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true
            };

            ContractsService.getContractors(params).then(
                function(response){
                    $scope.contractors = response.data;
                }, function (err){
                    inform.add("Ocurrió un error al consultar los contratistas", {type: "warning"});
                }
            );
        }

        self.addContract = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nuevo Contrato',
                ariaDescribedBy: 'crear-contrato',
                templateUrl: 'templates/addContract.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                ContractsService.addContract(data, $scope.selectedContractor.id ).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el contrato", { type: "info" });
                        $scope.selectedContractor.contracts.push(data);
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el contrato", { type: "warning" });
                    }
                );
            });
        }

        self.add = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nuevo Contratista',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/addContractor.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        identificationTypes: $scope.identificationTypes
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ContractsService.addContractor(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el contratista", { type: "info" });
                        self.getContractors();
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );
            });
        }

        self.edit = function(contractor){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/updateContrator.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        identificationTypes: $scope.identificationTypes,
                        contractor: contractor
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ContractsService.updateContractor(data, data.contractor.id).then(
                    function (response) {
                        inform.add("Se ha actualizado correctamente el contratista", { type: "info" });
                        self.getContractors();
                    }, function (err) {
                        inform.add("Ocurrió un error al actualizar el contratista", { type: "warning" });
                    }
                );
            });
        }

        self.selectContractor = function(contractor){
            $scope.selectedContractor = contractor;
        }

        self.init = function () {
            $scope.identificationTypes = IdentificationTypes.data;
            $scope.contractors = Contractors.data;
        }

        self.init();


    }
})(angular.module("app"));


(function (module) {
    module.service("ContractsService", ContractsService);

    ContractsService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS"
    ];

    function ContractsService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.addContractor = function(data){
            return $http({
                method: "POST",
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/contractors"
            })
        }

        self.getContractors = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/contractors"
            })
        }

        self.updateContractor = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/contractors/" + id
            })
        }

        self.addContract = function(data, id){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/contractors/" + id + "/contracts"
            })
        }

        self.getIdentificationTypes = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/identification-types"
            })
        }

    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("PlanDetailCtrl", PlanDetailCtrl);

    PlanDetailCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal", 
        "$filter", 
        "inform",
        "PlanService",
        "DevelopmentPlans"
    ];

    function PlanDetailCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService, DevelopmentPlans) {

        var self = this;

        $scope.active = true;

        /*$scope.plan = {
            slogan: "Un norte productivo para todos",
            init_year: 2016,
            end_year: 2019,
            dimensions: [{
                name: "Social",
                axes: [
                    {
                        name: "Eje 1",
                        programs: [
                            {
                                total: 4, //cantidad total de metas de ese programa
                                name: "Programa 1",
                                subprograms:[
                                    {
                                        name: "subprograma 1",
                                        goals: [
                                            {
                                                name: "meta 1"
                                            },
                                            {
                                                name: "meta 2"
                                            }
                                        ]
                                    },
                                    {
                                        name: "subprograma 2",
                                        goals: [
                                            {
                                                name: "meta 3"
                                            },
                                            {
                                                name: "meta 4"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }]
        }

        $scope.plans = [
            {
                slogan: "un norte productivo para todos",
                init_year: 2016,
                end_year: 2019
            },
            {
                slogan: "un norte productivo para todos",
                init_year: 2012,
                end_year: 2015
            },
            {
                slogan: "un norte productivo para todos",
                init_year: 2008,
                end_year: 2011
            },
            {
                slogan: "un norte productivo para todos",
                init_year: 2008,
                end_year: 2011
            }
        ]*/


        
        self.selectPlan = function () {
            
        }
        
        self.uploadPlan = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Plan de Desarrollo',
                ariaDescribedBy: 'cargar-plan',
                templateUrl : 'templates/uploadPlan.modal.html',
                controller : 'ModalController',
                controllerAs: 'modalCtrl',
                resolve:{
                    data: {}
                }
            });

            modalInstance.result.then(function(data) {
                var d = {                    
                    name: data.name,
                    init_year: $filter('date')(data.init_year, 'yyyy-MM-dd'),
                    end_year: $filter('date')(data.end_year, 'yyyy-MM-dd')
                }

                PlanService.uploadPlan(data.file, d).then(
                    function(response){
                        inform.add("Se ha cargado el plan de desarrollo correctamente", {type: "info"});
                        //Refrescar todos los planes de desarrollo
                    }, function(err){
                        inform.add("Ocurrió un error al guardar el plan de desarrollo", {type: "warning"});
                        //Descargar reporte de errores 
                    }
                );
            });
        }
        
        self.downloadFormat = function () {
            $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Plan_Desarrollo.xlsx');
        }

        self.init = function () {
            $scope.plans = DevelopmentPlans.data;
            $scope.plan = $scope.plans[ $scope.plans.length - 1 ];
        }

        self.init();


    }
})(angular.module("app"));


(function (module) {
    module.service("PlanService", PlanService);

    PlanService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function PlanService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.uploadPlan = function(file, data){
            return Upload.upload({
                data: {file: file, data: data},
                url: APP_DEFAULTS.ENDPOINT + "/plan/upload"
            });
        }

        self.getPlans = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/development-plans"
            });
        }
    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("ModalUpdateProjectCtrl", ModalUpdateProjectCtrl);

    ModalUpdateProjectCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "data"
    ];

    function ModalUpdateProjectCtrl($scope, $uibModalInstance, data) {

        var self = this;

        $scope.data = angular.copy(data);
        $scope.new_data = {};

        self.update = function () {
            $scope.data.project.status = $scope.data.project.s ? 'Activo' : 'Inactivo';
            $uibModalInstance.close($scope.data);
        };

        self.save = function () {
            $uibModalInstance.close($scope.new_data);
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        self.init = function(){
            $scope.data.project.s = $scope.data.project.status == 'Activo' ? true : false;
        }

        self.init();

    }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("ProjectsCtrl", ProjectsCtrl);

    ProjectsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "$filter",
        "inform",
        "ProjectsService",
        "Dimentions",
        "Projects"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ProjectsService, Dimentions, Projects) {

        var self = this;

        /* Table Config */
        $scope.configDT = {
            order: 'SEPPI',
            limit: 10,
            page: 1
        }
        /* */

        /* Obtiene todos los proyectos del Plan de Desarrollo Actual */
        self.getProjects = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'subprogram'
            }

            ProjectsService.getProjects(params).then(
                function (response) {
                    $scope.projects = response.data
                }, function (err) {
                    inform.add("Ocurrio un error al cargar los proyectos", { type: 'warning' })
                }
            )
        }

        /* Descarga el formato para el cargue de Proyectos */
        self.downloadFormat = function () {
            $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Proyectos.xlsx');
        }

        /* Modal para cargar Proyectos de Manera Másiva a traves de un documento de Excel. */
        self.upload = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Proyectos',
                ariaDescribedBy: 'cargar-proyecto',
                templateUrl: 'templates/uploadProjects.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                ProjectsService.uploadProjects(data.file).then(
                    function (response) {
                        inform.add("Se han cargado los proyectos correctamente", { type: "info" });
                        self.getProjects();
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar los Proyectos: \n"
                        var key, value, i;
                        for (var j in err.data) {
                            key = j;
                            value = err.data[j];
                            msg += key + ": " + value;
                            /*for (i = 0; i < err.data[j].length; i++) {
                                msg += err.data[j][i] + ",";
                            }*/
                            msg += "\n";
                        }
                        inform.add(msg, { ttl: -1, type: "warning" });
                    }
                );
            });
        }

        /* Modal que permite la creación de 1 nuevo proyecto */
        self.add = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/createProject.modal.html',
                controller: 'ModalProjectCtrl',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        dimentions: $scope.dimentions
                    }
                }
            });

            modalInstance.result.then(function (data) {
                data.status = "Activo";

                ProjectsService.addProject(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el proyecto", { type: "info" });
                        self.getProjects();
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );
            });
        }

        /* Modal para la actualización de proyectos */
        self.edit = function (project) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Actualizar Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/updateProject.modal.html',
                controller: 'ModalUpdateProjectCtrl',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        project: project
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ProjectsService.updateProject(data, data.project.id).then(
                    function (response) {
                        inform.add("Se ha actualizado correctamente el proyecto", { type: "info" });
                        self.getProjects();
                    }, function (err) {
                        inform.add("Ocurrió un error al actualizar el proyecto", { type: "warning" });
                    }
                );
            });
        }

        /* Configuración inicial de la vista */
        self.init = function () {
            $scope.dimentions = Dimentions.data;
            $scope.projects = Projects.data;
        }

        self.init();

    }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("ModalProjectCtrl", ModalProjectCtrl);

    ModalProjectCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "data"
    ];

    function ModalProjectCtrl($scope, $uibModalInstance, data) {

        var self = this;

        $scope.data = angular.copy(data);
        $scope.new_data = {};
        $scope.dimention = "";
        $scope.axe = "";
        $scope.program = "";

        self.update = function () {
            $uibModalInstance.close($scope.data);
        };

        self.save = function () {
            $uibModalInstance.close($scope.new_data);
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        self.init = function(){
            console.log($scope.data);
        }

        self.init();

    }
})(angular.module("app"));


(function (module) {
    module.service("ProjectsService", ProjectsService);

    ProjectsService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function ProjectsService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.addProject = function(data){
            return $http({
                method: "POST",
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/projects"
            })
        }

        self.updateProject = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/projects/" + id
            })
        }

        self.uploadProjects = function(file){
            return Upload.upload({
                data: {file: file},
                url: APP_DEFAULTS.ENDPOINT + "/projects/upload"
            });
        }

        self.getProjects = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/projects"
            })
        }

        self.getDimentions = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/dimentions"
            })
        }

    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("SecretariesCtrl", SecretariesCtrl);

    SecretariesCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "$filter",
        "inform",
        "Secretaries",
        "SecretariesService"
    ];

    function SecretariesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, Secretaries, SecretariesService) {

        var self = this;

        self.add = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nueva Secretaría',
                ariaDescribedBy: 'nueva-secretaría',
                templateUrl: 'templates/new-secretary.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                SecretariesService.saveSecretary(data).then(
                    function(response){
                        inform.add("Se ha creado la nueva dependencia.", { type: "success" });
                        self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al guardar la dependencia", {type: "warning"});
                    }
                );
            });
        }

        self.edit = function (secretary) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Editar Secretaría',
                ariaDescribedBy: 'editar-secretaría',
                templateUrl: 'templates/update-secretary.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        secretary: secretary
                    }
                }
            });

            modalInstance.result.then(function (data) {
                SecretariesService.updateSecretary(data, secretary.id).then(
                    function(response){
                        inform.add("Se ha actualizado la dependencia.", { type: "success" });
                        self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al actualizar la dependencia", {type: "warning"});
                    }
                );
            });
        }

        self.delete = function (secretary) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Eliminar Secretaría',
                ariaDescribedBy: 'eliminar-secretaría',
                templateUrl: 'templates/delete-secretary.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        secretary: secretary
                    }
                }
            });

            modalInstance.result.then(function (data) {
                SecretariesService.deleteSecretary(secretary.id).then(
                    function(response){
                        inform.add("Se ha eliminado la dependencia.", { type: "success" });
                        self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al eliminar la dependencia", {type: "warning"});
                    }
                );
            });
        }

        self.refresh = function(){
            SecretariesService.getSecretaries({}).then(
                function(response){
                    $scope.secretaries = response.data;
                }
            );
        }

        self.init = function () {
            $scope.secretaries = Secretaries.data;
        }

        self.init();


    }
})(angular.module("app"));


(function (module) {
    module.service("SecretariesService", SecretariesService);

    SecretariesService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function SecretariesService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.getSecretaries = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/secretaries"
            });
        }

        self.saveSecretary = function(data){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/secretaries"
            });
        }

        self.updateSecretary = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/secretaries/" + id
            })
        }

        self.deleteSecretary = function(id){
            return $http({
                method: 'DELETE',
                url: APP_DEFAULTS.ENDPOINT + "/secretaries/" + id
            })
        }
    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("StatisticsCtrl", StatisticsCtrl);

    StatisticsCtrl.$inject = [
        "$scope",
        "$filter",
        "inform",
        "DevelopmentPlans",
        "Secretaries",
        "Counters",
        "StatisticService",
        "GenericFilters",
        "usSpinnerService"
    ];

    function StatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService,GenericFilters,usSpinnerService) {

        var self = this;

        $scope.spinner = false;

        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.subprogram = -1;
        $scope.program = {};
        $scope.program_id;
        $scope.report = false;
        $scope.counter = {};
        $scope.selectedFilters = [];
        $scope.genders = [];
        $scope.age_range = [];
        $scope.special_conditions = [];
        $scope.hearing_impairments = [];
        $scope.visual_impairments = [];
        $scope.motor_disabilities = [];
        $scope.victim_types = [];
        $scope.ethnic_groups = [];
        $scope.reports = [];

        self.startSpin = function(){
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function(){
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        self.clean = function(){
            $scope.reports = [];
        }

        self.parse = function(){
            $scope.subprogram = -1;
            $scope.program = {};
            var i;
            for (i = 0; i < $scope.axe.programs.length; i++) {
                if ($scope.axe.programs[i].id == $scope.program_id) {
                    $scope.program = $scope.axe.programs[i];
                    break;
                }
            }
        }

        self.belongsToSecretary = function (program) {
            if ($scope.secretary == -1) {
                return true;
            }
            var i;
            for (i = 0; i < program.secretaries.length; i++) {
                if (program.secretaries[i].secretary_id == $scope.secretary) {
                    return true;
                }
            }

            return false;
        }

        self.genericFilters = function(){
            var x;
            x = $scope.genericFilters[5];
            x.value = $scope.development_plan.id;
            $scope.req.filters.push(x);

            if($scope.dimention.id){
                x = $scope.genericFilters[4];
                x.value = $scope.dimention.id;
                $scope.req.filters.push(x);
            }

            if($scope.axe.id){
                x = $scope.genericFilters[3];
                x.value = $scope.axe.id;
                $scope.req.filters.push(x);
            }

            if($scope.secretary != -1){
                x = $scope.genericFilters[2];
                x.value = $scope.secretary;
                $scope.req.filters.push(x);
            }

            if($scope.program.id){
                x = $scope.genericFilters[1];
                x.value = $scope.program.id;
                $scope.req.filters.push(x);
            }

            if($scope.subprogram != -1){
                x = $scope.genericFilters[0];
                x.value = $scope.subprogram;
                $scope.req.filters.push(x);
            }
        }

        self.getReport = function(){
            self.startSpin();
            $scope.res = $scope.counter.response + " ";
            $scope.report = true;
            $scope.req = {
                total: $scope.counter.column,
            }
            var i = 0;

            $scope.req.filters = _.filter($scope.filters, function(f){
                if(f.data){
                    var x;
                    if(f.data.id){
                        f.value = f.data.id;
                        x = f.data.name
                    }else{
                        f.value = f.data;
                        x = f.value ? "si" : "no";
                    }
                    
                    if( i == 0 ){
                        $scope.res += "con las siguientes caracteristicas: "
                        i++;
                    }
                    $scope.res += f.label + " - " + x + ", ";
                    return true;
                }

                return false;
            });

            if($scope.counter.label == "Total Personas" || $scope.counter.label == "Total Municipios"){
                $scope.res += " es: ";
            }else{
                $scope.res += " son: ";
            }

            self.genericFilters();

            StatisticService.getReport($scope.req).then(
                function(response){
                    var i;
                    for(i = 0; i < response.data.length; i++){
                        for(var key in response.data[i]){
                            if(i > 0){
                                $scope.res+= ", "
                            }
                            $scope.res += response.data[i][key];
                        }
                    }
                    $scope.reports.push($scope.res);
                    self.getFilters();
                    self.stopSpin();
                },
                function(err){
                    inform.add("Ocurrió un error al consultar las estadisticas solicitadas", {type: "warning"});
                    self.stopSpin();
                }
            );
        }

        self.getData = function(filter){
            if(filter.endpoint == "NA"){
                return;
            }

            var ep = filter.endpoint.replace("-", "_");

            if( $scope[ep] == 0 ){
                StatisticService.genericGetter(filter.endpoint).then(
                    function(response){
                        $scope[ep] = response.data;
                    }
                );
            }
        }

        self.applyFilter = function(filter){
            var i;
            for(i = 0; i < $scope.selectedFilters.length; i++){
                if($scope.selectedFilters[i].column == filter){
                    return true;
                }
            }
            return false;
        }

        self.getFilters = function(){
            var i;

            for(i = 0; i < $scope.counter.filters.length; i++){
                delete $scope.counter.filters[i].data;
                self.getData($scope.counter.filters[i]);
            }
            $scope.filters = $scope.counter.filters;
        }

        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
            $scope.genericFilters = GenericFilters.data;
        }

        self.init();


        //EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];



    }
})(angular.module("app"));


(function (module) {
    module.service("StatisticService", StatisticService);

    StatisticService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS"
    ];

    function StatisticService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.getDevelopmentPlans = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/development-plans'
            })
        }

        self.getSecretaries = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/secretaries'
            })
        }

        self.getCounters = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/counters'
            })
        }

        self.genericGetter = function(endpoint){
            return $http({
                method: "GET",
                url: APP_DEFAULTS.ENDPOINT + '/' + endpoint
            })
        }

        self.getGenericFilters = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/generic-filters'
            })
        }

        self.getReport = function(params){
            return $http({
                method: "POST",
                data: params,
                url: APP_DEFAULTS.ENDPOINT + '/reports'
            })
        }

    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("TerritorialCtrl", TerritorialCtrl);

    TerritorialCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "inform",
        "TerritorialService"
    ];

    function TerritorialCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, TerritorialService) {

        var self = this;

        self.uploadData = function (id, string) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Ordenamiento',
                ariaDescribedBy: 'cargar-ordenamiento',
                templateUrl: 'templates/upload-territories.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        type: string
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if( id == 1){
                    TerritorialService.uploadMunicipalities(data).then(
                        function(response){
                            inform.add("Se han cargado los municipios.", { type: "success" });
                            //self.refresh();
                        }, function(err){
                            inform.add("Ocurrió un error al guardar los municipios.", {type: "warning"});
                        }
                    );
                }else if(id == 2){
                    TerritorialService.uploadAreas(data).then(
                        function(response){
                            inform.add("Se han cargado las areas.", { type: "success" });
                            //self.refresh();
                        }, function(err){
                            inform.add("Ocurrió un error al guardar las areas.", {type: "warning"});
                        }
                    );
                }else if(id == 3){
                    TerritorialService.uploadAdministrativeUnits(data).then(
                        function(response){
                            inform.add("Se han cargado las unidades administrativas.", { type: "success" });
                            //self.refresh();
                        }, function(err){
                            inform.add("Ocurrió un error al guardar las unidades administrativas.", {type: "warning"});
                        }
                    );
                }
            });
        }


        self.init = function () {
            
        }

        self.init();


    }
})(angular.module("app"));


(function (module) {
    module.service("TerritorialService", TerritorialService);

    TerritorialService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function TerritorialService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.uploadMunicipalities = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/municipalities/upload"
            });
        }

        self.uploadAreas = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/areas/upload"
            });
        }

        self.uploadAdministrativeUnits = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/administrative-units/upload"
            });
        }


    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("UsersController", UsersController);

    UsersController.$inject = [
        "$scope",
        "$uibModal", 
        "inform",
        "Roles",
        "Users",
        "UsersService",
        "Secretaries"
    ];

    function UsersController($scope, $uibModal, inform, Roles, Users, UsersService, Secretaries) {

        var self = this;

        $scope.configDT = {
            limit: 15,
            page: 1
        }

        self.getUsers = function(){
            var params = {
                relationships: 'role,secretary',
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true
            };

            UsersService.getUsers(params).then(
                function(response){
                    $scope.users = response.data;
                }, function (err){
                    inform.add("Ocurrió un error al consultar los usuarios", {type: "warning"});
                }
            );
        }

        self.delete = function(user){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Eliminar Usuario',
                ariaDescribedBy: 'eliminar-usuario',
                templateUrl: 'templates/deleteUser.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        user: user,
                    }
                }
            });

            modalInstance.result.then(function (data) {
                UsersService.deleteUser(user.id).then(
                    function (response) {
                        inform.add("Se ha eliminado correctamente el usuario", { type: "info" });
                        self.getUsers();
                    }, function (err) {
                        inform.add("Ocurrió un error al eliminar el usuario", { type: "warning" });
                    }
                );
            });
        }

        self.add = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nuevo Usuario',
                ariaDescribedBy: 'crear-usuario',
                templateUrl: 'templates/addUser.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        roles: $scope.roles,
                        secretaries: $scope.secretaries
                    }
                }
            });

            modalInstance.result.then(function (data) {
                UsersService.addUser(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el usuario", { type: "info" });
                        self.getUsers();
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar el usuario: \n"
                        var key, value, i;
                        for (var j in err.data) {
                            key = j;
                            value = err.data[j];
                            msg += key + ": ";
                            for (i = 0; i < err.data[j].length; i++) {
                                msg += err.data[j][i] + ",";
                            }
                            msg += "\n";
                        }
                        inform.add(msg, { ttl: -1, type: "warning" });
                    }
                );
            });
        }

        self.edit = function(user){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cambiar Contraseña',
                ariaDescribedBy: 'cambiar-contraseña',
                templateUrl: 'templates/updatePassword.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        user: user
                    }
                }
            });

            modalInstance.result.then(function (data) {
                UsersService.updatePassword(data, user.id).then(
                    function (response) {
                        inform.add("Se ha actualizado correctamente el contratista", { type: "info" });
                        self.getUsers();
                    }, function (err) {
                        var msg = "Ocurrió un error al actualizar la contraseña  del usuario: \n"
                        var key, value, i;
                        for (var j in err.data) {
                            key = j;
                            value = err.data[j];
                            msg += key + ": ";
                            for (i = 0; i < err.data[j].length; i++) {
                                msg += err.data[j][i] + ",";
                            }
                            msg += "\n";
                        }
                        inform.add(msg, { ttl: -1, type: "warning" });
                    }
                );
            });
        }

        self.init = function () {
            $scope.roles = Roles.data;
            $scope.users = Users.data;
            $scope.secretaries = Secretaries.data;
        }

        self.init();


    }
})(angular.module("app"));


(function (module) {
    module.service("UsersService", UsersService);

    UsersService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS"
    ];

    function UsersService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.getRoles = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/roles"
            });
        }

        self.getUsers = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/users"
            });
        }

        self.addUser = function(data){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/users"
            });
        }

        self.deleteUser = function(id){
            return $http({
                method: 'DELETE',
                url: APP_DEFAULTS.ENDPOINT + "/users/" + id
            });
        }

        self.updatePassword = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + '/users/' + id + '/password'
            })
        }

    }
})(angular.module("app"));