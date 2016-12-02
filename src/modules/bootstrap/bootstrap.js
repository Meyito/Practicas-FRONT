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
        'angularSpinner'
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

        //Login
        stateHelperProvider.state({
            name: 'login',
            url: '/',
            views: {
                '': {
                    templateUrl: "templates/login.html",
                    controller: "LoginCtrl as loginCtrl",
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
                    templateUrl: "templates/empty.html",
                    //controller: "StatisticsCtrl as statisticsCtrl"
                }
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