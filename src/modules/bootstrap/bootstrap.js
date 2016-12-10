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
                    templateUrl: "templates/empty.html",
                    //controller: "ActivitiesCtrl as actCtrl"
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