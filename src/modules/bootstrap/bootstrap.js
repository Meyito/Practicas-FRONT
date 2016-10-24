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
        'inform'
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


    }).run(function ($rootScope) {

    });
})();