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
        'ui.multiselect'
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
(function (module) {
    "use strict";

    var ROOT_PATH = "http://192.168.33.10/Practicas-BACK/public/";

    module.constant("APP_DEFAULTS", {
        ENDPOINT: ROOT_PATH + "api/v1",
        ROOT_PATH: ROOT_PATH
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
        "$state"
    ];

    function ActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ActivitiesService, $state) {

        var self = this;

        $scope.expanded = false;

        $scope.datePicker = {
            date: { startDate: null, endDate: null }
        } 

        $scope.development_plans = [
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
        ]

        $scope.activities = [
            {
                date: "09-12-2015",
                count: 50,
                place: "San Calixto",
                contratista: "Javier Plazas",
                subprogram: "El nombre de un suprograma algo largo solo para probar",
                goal: "100% cumplido, meta larga para probar, ajustes de CSS"
            },
            {
                date: "09-12-2015",
                count: 80,
                place: "Bochalema",
                contratista: "Andres Rodriguez",
                subprogram: "Subprograma 2",
                goal: "Apoyar el desarrollo de "
            },
        ];

        self.statistics = function(){
            $state.go("statistics");
        }

        self.newActivity = function(){
            $state.go("new-activity");
        }

        self.search = function(){

        }

        self.init = function() {
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

    }
})(angular.module("app"));
(function (module) {
    'use strict';

    module.controller("AnalyticsCtrl", AnalyticsCtrl);

    AnalyticsCtrl.$inject = [
        "$scope",
        "AnalyticsService",
        '$interval',
        '$filter'
    ];

    function AnalyticsCtrl($scope, AnalyticsService, $interval, $filter) {

        var self = this;

        self.graphs = {
            zones: [],
            time: [],
            labels: [],
            speed: [],
            count: [],
            avg_speed: [],
            acum: []
        }

        self.paint = function () {

        }

        self.randomData = function () {
            var i, s;
            for (i = 0; i < self.graphs.zones.length; i++) {
                if (i == 0) {
                    s = self.graphs.time[self.graphs.time.length - 1] + 60000;
                    self.graphs.time.push(s);
                    self.graphs.labels.push($filter('date')(s, "medium"));
                }
                self.graphs.count[i] = Math.floor((Math.random() * 100) + 1);
                s = Math.random() * 200 + 1;
                self.graphs.speed[i].push(s);
                self.graphs.acum[i] += s;
                self.graphs.avg_speed[i] = self.graphs.acum[i] / self.graphs.speed[i].length;
            }

            console.log(self.graphs);
        }

        self.parseData = function (data) {
            var i;
            for (i = 0; i < data.length; i++) {
                if (i == 0) {
                    self.graphs.time.push(data[i].data.time);
                    self.graphs.labels.push($filter('date')(data[i].data.time, "medium"));
                }
                self.graphs.zones.push(data[i].zoneId);
                var speed = [];
                speed[0] = data[i].data.speed;
                self.graphs.speed.push(speed);
                self.graphs.avg_speed.push(data[i].data.speed);
                self.graphs.acum.push(data[i].data.speed);
                self.graphs.count.push(data[i].data.count);
            }
            console.log(self.graphs);
        }

        self.init = function () {
            AnalyticsService.getData().then(
                function (response) {
                    self.parseData(response.data);
                    $interval(function () {
                        self.randomData();
                    },3000);
                }
            );
        }

        self.init();



    }
})(angular.module("app"));

(function(module){
  module.service("AnalyticsService", AnalyticsService);

  AnalyticsService.$inject = [
      "$http"
  ];

  function AnalyticsService($http){
    var self = this;

    self.getData = function () {
        return $http.get("/data/activity-data.json");
    }
    
  }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("NavigationCtrl", NavigationCtrl);

    NavigationCtrl.$inject = [
        "$scope",
        "$state"
    ];

    function NavigationCtrl($scope, $state) {

        var self = this;

        $scope.active = "";

        self.init = function() {
            $scope.active = $state.current.data.state;
        }

        self.logOut = function(){
            $state.go("login");
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

    module.controller("LoginCtrl", LoginCtrl);

    LoginCtrl.$inject = [
        "$scope",
        "$state"
    ];

    function LoginCtrl($scope, $state) {

        var self = this;

        $scope.data;

        self.login = function(){
            $state.go("development-plan");
        }

        self.init = function () {

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
                        inform.add("Ocurrió un error al guardar los proyectos", { type: "warning" });
                        //Descargar reporte de errores 
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
        "StatisticService"
    ];

    function StatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService) {

        var self = this;

        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
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

        self.parse = function(){
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

        self.getReport = function(){
            $scope.report = true;
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
                self.getData($scope.counter.filters[i]);
            }
        }

        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
        }

        self.init();





        self.updateGraph = function () {
            console.log($scope.selectedFilters);
        }

        self.add = function () {

        }

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
                            inform.add("Se han cargado las areas.", { type: "success" });
                            //self.refresh();
                        }, function(err){
                            inform.add("Ocurrió un error al guardar las areas.", {type: "warning"});
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