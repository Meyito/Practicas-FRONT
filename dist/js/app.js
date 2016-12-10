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
        'app.authentication',
        'blockUI',
        'checklist-model'
    ]).config(function ($stateProvider, $urlRouterProvider, stateHelperProvider, blockUIConfig) {

        blockUIConfig.autoBlock = false;
        blockUIConfig.templateUrl = "templates/state-change-blocker.html";

        /***************************************/
        /*********** COMMON VIEWS **************/
        /***************************************/

        /* ERROR STATE */
        stateHelperProvider.state({
            name: 'forbidden',
            url: '/forbidden',
            data: { authNotRequired: true },
            templateUrl: 'templates/forbidden.html'
        });

        /*Dashboard*/
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
                    templateUrl: "templates/dashboard.html",
                    controller: "DashboardCtrl as dCtrl"
                }
            }
        });

        /*Cambio Contraseña*/
        stateHelperProvider.state({
            name: 'password',
            url: '/password',
            data: {
                state: ""
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@password': {
                    templateUrl: "templates/updatePassword.html",
                    controller: "AuthController as auth"
                }
            }
        });

        /* Contratistas */
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

        /* Estadística de una Actividad (Admin NO) */
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
                    templateUrl: "templates/statistics.activity.html",
                    controller: "ActivityStatisticCtrl as statisticsCtrl"
                }
            },
            resolve: {
                Counters: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "filters"
                    }
                    return StatisticService.getCounters(params);
                }],

                Activity: ['ActivitiesService', '$stateParams', function (ActivitiesService, $stateParams) {
                    var params = {}
                    return ActivitiesService.getActivity(params, $stateParams.id);
                }]
            }
        });

        /* Entes Territoriales (Admin NO) */
        stateHelperProvider.state({
            name: 'territorial-list',
            url: '/territorios',
            data: {
                state: "territorial-entities"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@territorial-list': {
                    templateUrl: "templates/territorial.list.html",
                    controller: "TerritorialListCtrl as territorialCtrl"
                }
            },
            resolve: {
                Municipalities: ['TerritorialService', function (TerritorialService) {
                    var params = {}
                    return TerritorialService.getMunicipalities(params);
                }],

                SisbenZones: ['TerritorialService', function (TerritorialService) {
                    var params = {}
                    return TerritorialService.getSisbenZones(params);
                }],

                AdministrativeUnits: ['TerritorialService', function (TerritorialService) {
                    var params = {
                        relationships: 'administrative_unit_type,area.municipality,area.area_type.sisben_zone',
                        'page': 1,
                        'items': 15,
                        'count': true
                    }
                    return TerritorialService.getAdministrativeUnits(params);
                }]
            }
        });

        /***************************************/
        /************ ADMIN VIEWS **************/
        /***************************************/

        /* Secretarias */
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

        /* Usuarios */
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

        /* Administración Territorial */
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


        /***************************************/
        /********* SECRETARIES VIEWS ***********/
        /***************************************/

        /* Estadisticas SOLO de la Secretaría */
        stateHelperProvider.state({
            name: 'secretary-statistics',
            url: '/estadisticas/secretaria',
            data: {
                state: "statistics"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@secretary-statistics': {
                    templateUrl: "templates/statistics.secretary.html",
                    controller: "SecretaryStatisticsCtrl as statisticsCtrl"
                }
            },
            resolve: {
                DevelopmentPlans: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
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

        /* Proyectos */
        stateHelperProvider.state({
            name: 'secretary-projects',
            url: '/proyectos/secretaria',
            data: {
                state: "projects"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@secretary-projects': {
                    templateUrl: "templates/projects.secretary.html",
                    controller: "SecretaryProjectsCtrl as projectsCtrl"
                }
            },
            resolve: {
                DevPlan: ['ProjectsService', 'PlanService', function (ProjectsService, PlanService) {
                    return PlanService.getLastDevelopmentPlan({});
                }]
            }
        });

        /* Actividades SOLO de la Secretaría */
        stateHelperProvider.state({
            name: 'secretary-activities',
            url: '/actividades/secretaria',
            data: {
                state: "activities"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@secretary-activities': {
                    templateUrl: "templates/activities.secretary.html",
                    controller: "SecretaryActivitiesCtrl as actCtrl"
                }
            },
            resolve: {
                DevelopmentPlans: ['StatisticService', function (StatisticService) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
                    }
                    return StatisticService.getDevelopmentPlans(params);
                }],

                GenericFilters: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getGenericFilters(params);
                }]
            }
        });

        /* Plan de desarrollo */
        stateHelperProvider.state({
            name: 'actual-development-plan',
            url: '/plan-desarrollo-actual',
            data: {
                state: "development-plan"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@actual-development-plan': {
                    templateUrl: "templates/plan.actual.html",
                    controller: "PlanActualCtrl as planCtrl"
                }
            },
            resolve: {
                ActualPlan: ['PlanService', function (PlanService, $stateParams) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms.goals"
                    }
                    return PlanService.getLastDevelopmentPlan(params);
                }]
            }
        });


        /***************************************/
        /********** PLANEACION VIEWS ***********/
        /***************************************/

        /* Planes de desarrollo */
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
                DevelopmentPlans: ['PlanService', function (PlanService, $stateParams) {
                    var params = {}
                    return PlanService.getPlans(params);
                }],

                ActualPlan: ['PlanService', function (PlanService, $stateParams) {
                    var params = {
                        relationships: "dimentions.axes.programs.subprograms.goals"
                    }
                    return PlanService.getLastDevelopmentPlan(params);
                }]
            }
        });

        /* Actividades */
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
                        relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
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

        /* Estadisticas */
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
                        relationships: "dimentions.axes.programs.subprograms,dimentions.axes.programs.secretaries"
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

        /* Proyectos */
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
                DevPlan: ['ProjectsService', 'PlanService', function (ProjectsService, PlanService) {
                    return PlanService.getLastDevelopmentPlan({});
                }],

                DevelopmentPlans: ['StatisticService', function (StatisticService) {
                    var params = {}
                    return StatisticService.getDevelopmentPlans(params);
                }],

                Dimentions: ['ProjectsService', function (ProjectsService) {
                    var params = {
                        relationships: "axes.programs.subprograms"
                    }
                    return ProjectsService.getDimentions(params);
                }],
            }
        });

        /* Asociar Programa a Secretaría */
        stateHelperProvider.state({
            name: 'programs',
            url: '/programas',
            data: {
                state: "programs"
            },
            views: {
                '': {
                    templateUrl: "templates/template.html",
                    controller: "NavigationCtrl as navCtrl"
                },
                'content@programs': {
                    templateUrl: "templates/programs.list.html",
                    controller: "ProgramsCtrl as programsCtrl"
                }
            },
            resolve: {
                DevPlan: ['ProjectsService', 'PlanService', function (ProjectsService, PlanService) {
                    return PlanService.getLastDevelopmentPlan({});
                }],

                Secretaries: ['SecretariesService', function (SecretariesService) {
                    var params = {}
                    return SecretariesService.getSecretaries(params);
                }],
            }
        });


    }).run(function ($rootScope, blockUI) {
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams, options) {
                console.log("buuuu");
                if (fromState.name !== toState.name) {
                    blockUI.start();
                }
            });

        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            blockUI.stop();
            blockUI.stop(); //Because if either token not found or invalid token, it's necessary call it twice
        });

        $rootScope.$on('$stateChangeError',
            function (event, toState, toParams, fromState, fromParams, error) {
                console.log("hellowsito");
                //$state.go("login");
                blockUI.stop();
            });

        $rootScope.$on('$stateNotFound',
            function (event, unfoundState, fromState, fromParams, $state) {
                console.log("hello");
                $state.go("forbidden");
                blockUI.stop();
            });
    });
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

        self.init = function(){
            console.log($scope.data);
        }

        self.init();

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
        "inform",
        "ActivitiesService",
        "$state",
        "DevelopmentPlans",
        "GenericFilters",
        "usSpinnerService",
        "Secretaries",
        "AuthenticationService"
    ];

    function ActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, ActivitiesService, $state, DevelopmentPlans, GenericFilters, usSpinnerService, Secretaries, AuthenticationService) {

        var self = this;

        var secretary_id = AuthenticationService.getCurrentUser().secretary_id;

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
                ActivitiesService.uploadActivity({secretary_id: secretary_id}, data.file).then(
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

        self.clearProgram = function () {
            $scope.subprogram = -1;
            $scope.secretary = -1;
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
    'use strict';

    module.controller("SecretaryActivitiesCtrl", SecretaryActivitiesCtrl);

    SecretaryActivitiesCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "inform",
        "ActivitiesService",
        "$state",
        "DevelopmentPlans",
        "GenericFilters",
        "usSpinnerService",
        "AuthenticationService"
    ];

    function SecretaryActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, ActivitiesService, $state, DevelopmentPlans, GenericFilters, usSpinnerService, AuthenticationService) {

        var self = this;

        var secretary_id = AuthenticationService.getCurrentUser().secretary_id;

        $scope.expanded = false;
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = secretary_id;
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
                ActivitiesService.uploadActivity({ secretary_id: secretary_id }, data.file).then(
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

        self.clearDevPlan = function () {
            $scope.dimention = {};
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearDim = function () {
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearAxe = function () {
            $scope.program = {};
            $scope.subprogram = -1;
            $scope.program_id = -1;
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

        self.uploadActivity = function(data, file){
            return Upload.upload({
                data: {file: file, data: data},
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

        self.getActivity = function(params, id){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/activities/" + id
            })
        }

    }
})(angular.module("app"));
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

        auth.restorePassword = function (restoreLogin) {
            if (restoreLogin.$invalid) {
                return;
            }
            blockUI.start();
            auth.error = undefined;

            var data = {
                password: auth.credentials.new_password,
                actual_password: auth.credentials.password
            }

            var id = AuthenticationService.getCurrentUser().id;

            AuthenticationService.updatePassword(data, id).then(function () {
                inform.add("Se ha actualizado la contraseña exitosamente", {type: "success"});
                AuthenticationService.destroyToken();
                $state.go("login");
            }).catch(function (error) {
                inform.add("Ocurrió un error al actualizar la contraseña", {type: "warning"});
                if (error.status == 400) {
                    auth.error = error.data.error;
                }
            }).finally(function () {
                blockUI.stop();
            });
        }
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

        self.updatePassword = function(){
            $state.go("password");
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

    module.controller("PlanActualCtrl", PlanActualCtrl);

    PlanActualCtrl.$inject = [
        "$scope",
        "ActualPlan"
    ];

    function PlanActualCtrl($scope, ActualPlan) {

        var self = this;

        $scope.active = true;

        self.init = function () {
            $scope.selectedPlan = ActualPlan.data;
        }

        self.init();

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
        "DevelopmentPlans",
        "ActualPlan"
    ];

    function PlanDetailCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService, DevelopmentPlans, ActualPlan) {

        var self = this;

        $scope.active = true;

        self.selectPlan = function (id) {
            var params = {
                relationships: 'dimentions.axes.programs.subprograms.goals'
            }

            PlanService.getPlan(id, params).then(
                function (response) {
                    $scope.selectedPlan = response.data;
                }, function (err) {
                    inform.add("Ocurrió un error al cargar el plan de desarrollo.", {type: "warning"});
                }
            );
        }

        self.getPlans = function () {
            return PlanService.getPlans({}).then(
                function (response) {
                    $scope.plans = response.data;
                }
            );
        }

        self.uploadPlan = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Plan de Desarrollo',
                ariaDescribedBy: 'cargar-plan',
                templateUrl: 'templates/uploadPlan.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                var d = {
                    name: data.name,
                    init_year: $filter('date')(data.init_year, 'yyyy-MM-dd'),
                    end_year: $filter('date')(data.end_year, 'yyyy-MM-dd')
                }

                PlanService.uploadPlan(data.file, d).then(
                    function (response) {
                        inform.add("Se ha cargado el plan de desarrollo correctamente", { type: "info" });
                        self.getPlans();
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar el plan de desarrollo: \n"
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

        self.downloadFormat = function () {
            $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Plan_Desarrollo.xlsx');
        }

        self.init = function () {
            $scope.plans = DevelopmentPlans.data;
            $scope.selectedPlan = ActualPlan.data;
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

        self.getLastDevelopmentPlan = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/development-plans/last'
            })
        }

        self.getPlan = function(id, params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/development-plans/" + id
            });
        }
    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("ProgramsCtrl", ProgramsCtrl);

    ProgramsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "inform",
        "ProjectsService",
        "DevPlan",
        "Secretaries",
        "ProgramsService"
    ];

    function ProgramsCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, ProjectsService, DevPlan, Secretaries, ProgramsService) {

        var self = this;

        $scope.program_secretaries = [];

        self.getPrograms = function () {
            var params = {
                development_plan_id: $scope.development_plan,
                relationships: 'secretaries,axe.dimention.development_plan'
            }

            ProgramsService.getPrograms(params).then(
                function (response) {
                    $scope.programs = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.program_secretaries[i] = [];
                        angular.copy($scope.secretaries, $scope.program_secretaries[i]);
                    }
                }
            );
        }

        self.updateProgram = function (index) {
            var data = {
                secretaries: _.map($scope.programs[index].secretaries, function (s) {
                return s.id;
                })
            }

            ProgramsService.updateSecretaries(data, $scope.programs[index].id).then(
                function(response){
                    inform.add("Se actualizaron exitosamente las secretarias del programa", {type: "success"})
                }, function(err){
                    inform.add("Ocurrió un error al actualizar las secretarias del programa", {type: "warning"});
                }
            );
        }

        /* Configuración inicial de la vista */
        self.init = function () {
            $scope.development_plan = DevPlan.data.id;
            self.getPrograms();
            $scope.secretaries = Secretaries.data;
        }

        self.init();

    }
})(angular.module("app"));


(function (module) {
    module.service("ProgramsService", ProgramsService);

    ProgramsService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
    ];

    function ProgramsService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.getPrograms = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/programs'
            });
        }

        self.updateSecretaries = function(data, id){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + '/programs/' + id + '/secretaries'
            })
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
        "inform",
        "ProjectsService",
        "DevPlan",
        "DevelopmentPlans",
        "Dimentions"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, ProjectsService, DevPlan, DevelopmentPlans, Dimentions) {

        var self = this;
        $scope.status = "Activo"

        /* Table Config */
        $scope.configDT = {
            order: 'SEPPI',
            limit: 10,
            page: 1
        }
        
        /* Filtro de Proyectos */
        self.search = function(){
            $scope.configDT.page = 1;
            self.getProjects();
        }

        /* Obtiene todos los proyectos del Plan de Desarrollo */
        self.getProjects = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'subprogram',
                status: $scope.status,
                development_plan_id: $scope.development_plan
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
            $scope.development_plan = DevPlan.data.id;
            self.getProjects();
            $scope.development_plans = DevelopmentPlans.data;
            $scope.dimentions = Dimentions.data;
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
    'use strict';

    module.controller("SecretaryProjectsCtrl", SecretaryProjectsCtrl);

    SecretaryProjectsCtrl.$inject = [
        "$scope",
        "inform",
        "ProjectsService",
        "DevPlan"
    ];

    function SecretaryProjectsCtrl($scope, inform, ProjectsService, DevPlan) {

        var self = this;

        /* Table Config */
        $scope.configDT = {
            order: 'SEPPI',
            limit: 10,
            page: 1
        }

        /* Obtiene todos los proyectos del Plan de Desarrollo */
        self.getProjects = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'subprogram',
                development_plan_id: $scope.development_plan,
                status: "Activo"
            }

            ProjectsService.getProjects(params).then(
                function (response) {
                    $scope.projects = response.data
                }, function (err) {
                    inform.add("Ocurrio un error al cargar los proyectos", { type: 'warning' })
                }
            )
        }


        /* Configuración inicial de la vista */
        self.init = function () {
            $scope.development_plan = DevPlan.data.id;
            self.getProjects();
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

    module.controller("ActivityStatisticCtrl", ActivityStatisticCtrl);

    ActivityStatisticCtrl.$inject = [
        "$scope",
        "inform",
        "Counters",
        "StatisticService",
        "usSpinnerService",
        "AuthenticationService",
        "$stateParams",
        "$state",
        "Activity"
    ];

    function ActivityStatisticCtrl($scope, inform, Counters, StatisticService, usSpinnerService, AuthenticationService, $stateParams, $state, Activity) {

        var self = this;

        /************ SPINNER **********/
        $scope.spinner = false;

        self.startSpin = function () {
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function () {
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        /***** FILTROS REPORTE ******/
        $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        $scope.counter = {};
        $scope.selectedFilters = [];

        /* Verifica si el filtro se debe mostrar */
        self.applyFilter = function (filter) {
            var i;
            for (i = 0; i < $scope.selectedFilters.length; i++) {
                if ($scope.selectedFilters[i].label == filter) {
                    return true;
                }
            }
            return false;
        }

        /* Inicializa los filtros de acuerdo al Counter elegido */
        self.getFilters = function () {
            var i;
            $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

            for (i = 0; i < $scope.counter.filters.length; i++) {
                self.getData($scope.counter.filters[i]);
            }

            $scope.filters = $scope.counter.filters;
        }

        /* Método que se encarga de consultar las opciones 
        de cada uno de los filtros poblacionales */
        self.getData = function (filter) {
            if (filter.endpoint == "NA") {
                return;
            }

            var ep = filter.endpoint.replace("-", "_");

            if (!$scope[ep]) {
                StatisticService.genericGetter(filter.endpoint).then(
                    function (response) {
                        $scope[ep] = response.data;
                    }
                );
            }
        }

        /********** REPORTES *********/
        $scope.report = false;
        $scope.reports = [];

        /* Limpia los reportes que se han consultado */
        self.clean = function () {
            $scope.reports = [];
        }

        /* Ajusta los filtros genericos para realizar la consulta */
        self.parseGenericFilters = function () {
            var secretary = {
                column: "sp.id",
                value: $scope.secretary
            }

            var secretary = {
                column: "a.id",
                value: $stateParams.id
            }

            $scope.req.filters.push(secretary);
        }

        /* Ajusta los filtros poblacionales para realizar la consulta */
        self.parseSpecificFilters = function () {
            var i = 0;

            $scope.req.filters = _.filter($scope.filters, function (f) {
                if ($scope.filtersData[f.id] != "") {
                    var ans = $scope.filtersData[f.id];
                    var x;
                    if (ans.id) {
                        f.value = ans.id;
                        x = ans.name;
                    } else {
                        f.value = ans;
                        if (f.id == 11) {
                            x = f.value;
                        } else {
                            x = f.value ? "si" : "no";
                        }
                    }

                    if (i == 0) {
                        $scope.res += "con las siguientes caracteristicas: "
                        i++;
                    }
                    $scope.res += f.label + " - " + x + ", ";
                    return true;
                }
                return false;
            });

            if ($scope.counter.label == "Cuales Municipios" || $scope.counter.label == "Cuales Proyectos") {
                $scope.res += " son: ";
            } else {
                $scope.res += " es: ";
            }
        }

        /* Ajusta la respuesta de los totales */
        self.parseTotals = function (data) {
            $scope.res += data[0].total;
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los cuales */
        self.parseWhich = function (data) {
            var i;
            for (i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    $scope.res += data[i][key] + ", ";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los datos agrupados */
        self.parseTotalGroup = function(data){
            var i;
            for (i = 0; i < data.length; i++) {
                if(data[i].total != 0 ){
                    $scope.res += " " + data[i].name + ": " + data[i].total + ",";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Realiza la consulta con base a los filtros seleccionados */
        self.getReport = function () {
            self.startSpin();
            $scope.res = $scope.counter.response + " ";
            $scope.report = true;
            $scope.req = {
                total: $scope.counter.column,
                group: $scope.counter.group_by
            }

            self.parseSpecificFilters();
            self.parseGenericFilters();

            StatisticService.getReport($scope.req).then(
                function (response) {
                    if ($scope.counter.id == 1 || $scope.counter.id == 2) {
                        self.parseTotals(response.data);
                    } else if ($scope.counter.id == 3 || $scope.counter.id == 4) {
                        self.parseWhich(response.data);
                    } else {
                        self.parseTotalGroup(response.data);
                    }
                    
                    self.getFilters();
                    self.stopSpin();
                },
                function (err) {
                    inform.add("Ocurrió un error al consultar las estadisticas solicitadas", { type: "warning" });
                    self.stopSpin();
                }
            );
        }


        /********** CARGUE INICIAL **********/
        self.init = function () {
            $scope.counters = Counters.data;
            $scope.secretary = AuthenticationService.getCurrentUser().secretary_id;
            $scope.rol = AuthenticationService.getCurrentUser().role;

            if(Activity.data.secretary_id != $scope.secretary && $scope.rol != "planeacion" ){
                $state.go("forbidden");
            }
        }

        self.init();

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

    function StatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService, GenericFilters, usSpinnerService) {

        var self = this;

        /************ SPINNER **********/
        $scope.spinner = false;

        self.startSpin = function () {
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function () {
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        /******** FILTROS GENÉRICOS ******/
        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.subprogram = -1;
        $scope.program = {};
        $scope.program_id;

        self.clearDevPlan = function () {
            $scope.dimention = {};
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearDim = function () {
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearAxe = function () {
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearProgram = function () {
            $scope.subprogram = -1;
            $scope.secretary = -1;
        }

        /***** FILTROS REPORTE ******/
        $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        $scope.counter = {};
        $scope.selectedFilters = [];

        /* Verifica si el filtro se debe mostrar */
        self.applyFilter = function (filter) {
            var i;
            for (i = 0; i < $scope.selectedFilters.length; i++) {
                if ($scope.selectedFilters[i].label == filter) {
                    return true;
                }
            }
            return false;
        }

        /* Inicializa los filtros de acuerdo al Counter elegido */
        self.getFilters = function () {
            var i;
            $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

            for (i = 0; i < $scope.counter.filters.length; i++) {
                self.getData($scope.counter.filters[i]);
            }

            $scope.filters = $scope.counter.filters;
        }

        /* Método que se encarga de consultar las opciones 
        de cada uno de los filtros poblacionales */
        self.getData = function (filter) {
            if (filter.endpoint == "NA") {
                return;
            }

            var ep = filter.endpoint.replace("-", "_");

            if (!$scope[ep]) {
                StatisticService.genericGetter(filter.endpoint).then(
                    function (response) {
                        $scope[ep] = response.data;
                    }
                );
            }
        }

        /********** REPORTES *********/
        $scope.report = false;
        $scope.reports = [];

        /* Limpia los reportes que se han consultado */
        self.clean = function () {
            $scope.reports = [];
        }

        /* Ajusta los filtros genericos para realizar la consulta */
        self.parseGenericFilters = function () {
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

        /* Ajusta los filtros poblacionales para realizar la consulta */
        self.parseSpecificFilters = function () {
            var i = 0;

            $scope.req.filters = _.filter($scope.filters, function (f) {
                if ($scope.filtersData[f.id] != "") {
                    var ans = $scope.filtersData[f.id];
                    var x;
                    if (ans.id) {
                        f.value = ans.id;
                        x = ans.name;
                    } else {
                        f.value = ans;
                        if (f.id == 11) {
                            x = f.value;
                        } else {
                            x = f.value ? "si" : "no";
                        }
                    }

                    if (i == 0) {
                        $scope.res += "con las siguientes caracteristicas: "
                        i++;
                    }
                    $scope.res += f.label + " - " + x + ", ";
                    return true;
                }
                return false;
            });

            if ($scope.counter.label == "Cuales Municipios" || $scope.counter.label == "Cuales Proyectos") {
                $scope.res += " son: ";
            } else {
                $scope.res += " es: ";
            }
        }

        /* Ajusta la respuesta de los totales */
        self.parseTotals = function (data) {
            $scope.res += data[0].total;
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los cuales */
        self.parseWhich = function (data) {
            var i;
            for (i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    $scope.res += data[i][key] + ", ";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los datos agrupados */
        self.parseTotalGroup = function(data){
            var i;
            for (i = 0; i < data.length; i++) {
                if(data[i].total != 0 ){
                    $scope.res += " " + data[i].name + ": " + data[i].total + ",";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Realiza la consulta con base a los filtros seleccionados */
        self.getReport = function () {
            self.startSpin();
            $scope.res = $scope.counter.response + " ";
            $scope.report = true;
            $scope.req = {
                total: $scope.counter.column,
                group: $scope.counter.group_by
            }

            self.parseSpecificFilters();
            self.parseGenericFilters();

            StatisticService.getReport($scope.req).then(
                function (response) {
                    if ($scope.counter.id == 1 || $scope.counter.id == 2) {
                        self.parseTotals(response.data);
                    } else if ($scope.counter.id == 3 || $scope.counter.id == 4) {
                        self.parseWhich(response.data);
                    } else {
                        self.parseTotalGroup(response.data);
                    }
                    
                    self.getFilters();
                    self.stopSpin();
                },
                function (err) {
                    inform.add("Ocurrió un error al consultar las estadisticas solicitadas", { type: "warning" });
                    self.stopSpin();
                }
            );
        }


        /********** CARGUE INICIAL **********/
        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
            $scope.genericFilters = GenericFilters.data;
        }

        self.init();


        /* EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];
        */

    }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("SecretaryStatisticsCtrl", SecretaryStatisticsCtrl);

    SecretaryStatisticsCtrl.$inject = [
        "$scope",
        "$filter",
        "inform",
        "DevelopmentPlans",
        "Secretaries",
        "Counters",
        "StatisticService",
        "GenericFilters",
        "usSpinnerService",
        "AuthenticationService"
    ];

    function SecretaryStatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService, GenericFilters, usSpinnerService, AuthenticationService) {

        var self = this;

        /************ SPINNER **********/
        $scope.spinner = false;

        self.startSpin = function () {
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function () {
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        /******** FILTROS GENÉRICOS ******/
        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.subprogram = -1;
        $scope.program = {};
        $scope.program_id;

        self.clearDevPlan = function () {
            $scope.dimention = {};
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearDim = function () {
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearAxe = function () {
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
            var i;
            for (i = 0; i < program.secretaries.length; i++) {
                if (program.secretaries[i].secretary_id == $scope.secretary) {
                    return true;
                }
            }
            return false;
        }

        /***** FILTROS REPORTE ******/
        $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        $scope.counter = {};
        $scope.selectedFilters = [];

        /* Verifica si el filtro se debe mostrar */
        self.applyFilter = function (filter) {
            var i;
            for (i = 0; i < $scope.selectedFilters.length; i++) {
                if ($scope.selectedFilters[i].label == filter) {
                    return true;
                }
            }
            return false;
        }

        /* Inicializa los filtros de acuerdo al Counter elegido */
        self.getFilters = function () {
            var i;
            $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

            for (i = 0; i < $scope.counter.filters.length; i++) {
                self.getData($scope.counter.filters[i]);
            }

            $scope.filters = $scope.counter.filters;
        }

        /* Método que se encarga de consultar las opciones 
        de cada uno de los filtros poblacionales */
        self.getData = function (filter) {
            if (filter.endpoint == "NA") {
                return;
            }

            var ep = filter.endpoint.replace("-", "_");

            if (!$scope[ep]) {
                StatisticService.genericGetter(filter.endpoint).then(
                    function (response) {
                        $scope[ep] = response.data;
                    }
                );
            }
        }

        /********** REPORTES *********/
        $scope.report = false;
        $scope.reports = [];

        /* Limpia los reportes que se han consultado */
        self.clean = function () {
            $scope.reports = [];
        }

        /* Ajusta los filtros genericos para realizar la consulta */
        self.parseGenericFilters = function () {
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

        /* Ajusta los filtros poblacionales para realizar la consulta */
        self.parseSpecificFilters = function () {
            var i = 0;

            $scope.req.filters = _.filter($scope.filters, function (f) {
                if ($scope.filtersData[f.id] != "") {
                    var ans = $scope.filtersData[f.id];
                    var x;
                    if (ans.id) {
                        f.value = ans.id;
                        x = ans.name;
                    } else {
                        f.value = ans;
                        if (f.id == 11) {
                            x = f.value;
                        } else {
                            x = f.value ? "si" : "no";
                        }
                    }

                    if (i == 0) {
                        $scope.res += "con las siguientes caracteristicas: "
                        i++;
                    }
                    $scope.res += f.label + " - " + x + ", ";
                    return true;
                }
                return false;
            });

            if ($scope.counter.label == "Cuales Municipios" || $scope.counter.label == "Cuales Proyectos") {
                $scope.res += " son: ";
            } else {
                $scope.res += " es: ";
            }
        }

        /* Ajusta la respuesta de los totales */
        self.parseTotals = function (data) {
            $scope.res += data[0].total;
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los cuales */
        self.parseWhich = function (data) {
            var i;
            for (i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    $scope.res += data[i][key] + ", ";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los datos agrupados */
        self.parseTotalGroup = function(data){
            var i;
            for (i = 0; i < data.length; i++) {
                if(data[i].total != 0 ){
                    $scope.res += " " + data[i].name + ": " + data[i].total + ",";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Realiza la consulta con base a los filtros seleccionados */
        self.getReport = function () {
            self.startSpin();
            $scope.res = $scope.counter.response + " ";
            $scope.report = true;
            $scope.req = {
                total: $scope.counter.column,
                group: $scope.counter.group_by
            }

            self.parseSpecificFilters();
            self.parseGenericFilters();

            StatisticService.getReport($scope.req).then(
                function (response) {
                    if ($scope.counter.id == 1 || $scope.counter.id == 2) {
                        self.parseTotals(response.data);
                    } else if ($scope.counter.id == 3 || $scope.counter.id == 4) {
                        self.parseWhich(response.data);
                    } else {
                        self.parseTotalGroup(response.data);
                    }
                
                    self.getFilters();
                    self.stopSpin();
                },
                function (err) {
                    inform.add("Ocurrió un error al consultar las estadisticas solicitadas", { type: "warning" });
                    self.stopSpin();
                }
            );
        }


        /********** CARGUE INICIAL **********/
        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
            $scope.genericFilters = GenericFilters.data;
            $scope.secretary = AuthenticationService.getCurrentUser().secretary_id;
        }

        self.init();


        /* EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];
        */

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

    module.controller("TerritorialListCtrl", TerritorialListCtrl);

    TerritorialListCtrl.$inject = [
        "$scope",
        "inform",
        "TerritorialService",
        "Municipalities",
        "SisbenZones",
        "AdministrativeUnits"
    ];

    function TerritorialListCtrl($scope, inform, TerritorialService, Municipalities, SisbenZones, AdministrativeUnits) {

        var self = this;

        $scope.searchCode = "";
        $scope.answer = "";
        $scope.municipality = {};
        $scope.sisben_zone = -1;
        $scope.area = -1;
        $scope.areas = [];

        /* Table Config */
        $scope.configDT = {
            limit: 15,
            page: 1
        }

        self.getTerritories = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'administrative_unit_type,area.municipality,area.area_type.sisben_zone',
            }

            if( $scope.municipality.id ){
                params.municipality_id = $scope.municipality.id;
            }

            if( $scope.sisben_zone != -1 ){
                params.sisben_zone_id = $scope.sisben_zone;
            }

            console.log($scope.area);
            if( $scope.area != -1 ){
                params.area_id = $scope.area;
            }

            TerritorialService.getAdministrativeUnits(params).then(
                function (response) {
                    $scope.administrativeUnits = response.data
                }, function (err) {
                    inform.add("Ocurrio un error al cargar las unidades administrativas", { type: 'warning' })
                }
            )
        }

        self.searchTerritories = function(){
            $scope.configDT.page = 1;
            self.getTerritories();
        }

        self.searchCode = function () {
            var data = {
                code: $scope.searchCode
            }

            TerritorialService.queryCode(data).then(
                function (response) {
                    $scope.answer = "El código corresponde a la " + response.data[0].tipoU + " " + response.data[0].name + 
                    " del Municipio " + response.data[0].municipio ;
                }, function (err) {
                    var msg = "Ocurrió un error al consultar el territorio: ";
                    var key, value, i;
                    for (var j in err.data) {
                        key = j;
                        value = err.data[j];
                        msg += key + ": " + err.data[j];
                        msg += "\n";
                    }
                    inform.add(msg, { type: "warning" });
                }
            );
        }

        self.findAreas = function(){
            $scope.areas = [];
            $scope.area = -1;

            var params = {
                relationships: "area_type"
            };

            if( $scope.municipality.id ){
                params.municipality_id = $scope.municipality.id;
            }

            if( $scope.sisben_zone != -1 ){
                params.sisben_zone_id = $scope.sisben_zone;
            }

            TerritorialService.getAreas(params).then(
                function(response){
                    $scope.areas = response.data;
                }
            );

        }

        self.init = function () {
            $scope.municipalities = Municipalities.data;
            $scope.sisbenZones = SisbenZones.data;
            $scope.administrativeUnits = AdministrativeUnits.data;
        }

        self.init();
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

        self.queryCode = function(data){
            return $http({
                method: "GET",
                params: data,
                url: APP_DEFAULTS.ENDPOINT + "/administrative-units/query"
            })
        }

        self.getMunicipalities = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/municipalities"
            });
        }

        self.getSisbenZones = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/sisben-zones"
            });
        } 

        self.getAreas = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/areas"
            });
        }

        self.getAdministrativeUnits = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/administrative-units"
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