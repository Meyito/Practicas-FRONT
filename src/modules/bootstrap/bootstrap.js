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
        'chart.js'
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
            }
        });

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
            }
        });

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
            }
        });

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
            }
        });

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
                    templateUrl: "templates/empty.html",
                    //controller: "StatisticsCtrl as statisticsCtrl"
                }
            }
        });

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
                    templateUrl: "templates/empty.html",
                    //controller: "StatisticsCtrl as statisticsCtrl"
                }
            }
        });

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
                    templateUrl: "templates/empty.html",
                    //controller: "StatisticsCtrl as statisticsCtrl"
                }
            }
        });


    }).run(function ($rootScope) {

    });
})();