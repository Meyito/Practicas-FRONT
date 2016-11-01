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
                    templateUrl: "templates/activities.list.html",
                    controller: "ActivitiesCtrl as actCtrl"
                }
            }
        });

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
        $scope.formats = ['yyyy'];
        $scope.yearOnly = $scope.formats[0];
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
        "PlanService",
        "$state"
    ];

    function ActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService, $state) {

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
        "PlanService",
        "$state"
    ];

    function NewActivityCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService, $state) {

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
        

        self.saveActivity = function(){
            $scope.saved = true;
        } 

        self.addAssistant = function(){
            $scope.assistants.push( $scope.new_activity );
            $scope.new_activity = {};
        }

        

        self.init = function () {
            //$scope.saved = false;
            $scope.saved = true;
        }

        self.init();





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
        "PlanService"
    ];

    function PlanDetailCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService) {

        var self = this;

        $scope.active = true;

        $scope.plan = {
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
        ]
        
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
                    name: "",
                    slogan: data.slogan,
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
            /*return Upload.upload({
                data: {file: file, data: data},
                url: APP_DEFAULTS.ENDPOINT + "/plan/upload"
            });*/

            return $http({
                method: 'GET',
                url: APP_DEFAULTS.ENDPOINT + "/plan/upload"
            });
        }
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
        "ProjectsService"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ProjectsService) {

        var self = this;

        self.edit = function(proyect, status){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/updateProject.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        project: {
                            name: proyect,
                            description: "Descripción del proyecto",
                            id: 1,
                            status: status,
                            seppi: 123123,
                            subprogram: {
                                name: "Educación"
                            }
                        }
                    }
                }
            });

            modalInstance.result.then(function (data) {
                inform.add("Se ha actualizado correctamente el proyecto", { type: "info" });

                /*ProjectsService.updateProject(data, id).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el proyecto", { type: "info" });
                        //Refrescar los proyectos
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );*/
            });
        }

        self.add = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/createProject.modad.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        subprograms: [
                            {
                                id: 1,
                                name: "Subprograma 1"
                            },
                            {
                                id: 2,
                                name: "Subprograma 2"
                            }
                        ]
                    }
                }
            });

            modalInstance.result.then(function (data) {
                inform.add("Se ha guardado correctamente el proyecto", { type: "info" });

                /*ProjectsService.addProject(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el proyecto", { type: "info" });
                        //Refrescar los proyectos
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );*/
            });
        }

        self.init = function () {
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
                url: APP_DEFAULTS.ENDPOINT + ""
            })
        }

        self.updateProject = function(data, id){
            return $hhtp({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + ""
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
        "PlanService"
    ];

    function SecretariesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService) {

        var self = this;

        $scope.secretaries = [
            {
                name: "Secretaría de Atención Integral a Victimas"
            },
            {
                name: "Secretaría de Planeación y Desarrollo Territorial"
            },
            {
                name: "Secretaría de Tecnologías de la Información y Comunicaciones "
            },
            {
                name: "Secretaría General"
            },
            {
                name: "Secretaría Privada "
            },
            {
                name: "Secretaría de Agua Potable y Saneamiento Básico"
            },
            {
                name: "Secretaría de Cultura"
            },
            {
                name: "Secretaría de Desarollo Económico"
            },
            {
                name: "Secretaría de Desarrollo Social"
            },
            {
                name: "Secretaría de Educación"
            },
            {
                name: "Secretaría de Fronteras y Cooperación Internacional"
            },
            {
                name: "Secretaría de Gobierno"
            },
            {
                name: "Secretaría de Hacienda"
            },
            {
                name: "Secretaría de Infraestructura"
            },
            {
                name: "Secretaría de la Mujer"
            },
            {
                name: "Secretaría de Minas y Energía"
            },
            {
                name: "Secretaría de Tránsito"
            },
            {
                name: "Secretaría de Vivienda y Medio Ambiente"
            },
            {
                name: "Secretaría Jurídica"
            }
        ];

        self.add = function(){

        }

        self.init = function() {
        }

        self.init();


    }
})(angular.module("app"));

(function (module) {
    'use strict';

    module.controller("StatisticsCtrl", StatisticsCtrl);

    StatisticsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "$filter",
        "inform",
        "PlanService"
    ];

    function StatisticsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService) {

        var self = this;

    
        $scope.expanded = false;

        $scope.secretaries = [
            {
                name: "Consolidado"
            },
            {
                name: "Secretaría de Atención Integral a Victimas"
            },
            {
                name: "Secretaría de Planeación y Desarrollo Territorial"
            },
            {
                name: "Secretaría de Tecnologías de la Información y Comunicaciones "
            },
            {
                name: "Secretaría General"
            },
            {
                name: "Secretaría Privada "
            },
            {
                name: "Secretaría de Agua Potable y Saneamiento Básico"
            },
            {
                name: "Secretaría de Cultura"
            },
            {
                name: "Secretaría de Desarollo Económico"
            },
            {
                name: "Secretaría de Desarrollo Social"
            },
            {
                name: "Secretaría de Educación"
            },
            {
                name: "Secretaría de Fronteras y Cooperación Internacional"
            },
            {
                name: "Secretaría de Gobierno"
            },
            {
                name: "Secretaría de Hacienda"
            },
            {
                name: "Secretaría de Infraestructura"
            },
            {
                name: "Secretaría de la Mujer"
            },
            {
                name: "Secretaría de Minas y Energía"
            },
            {
                name: "Secretaría de Tránsito"
            },
            {
                name: "Secretaría de Vivienda y Medio Ambiente"
            },
            {
                name: "Secretaría Jurídica"
            }
        ];

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

        $scope.datePicker = {};

        $scope.datePicker.date = { startDate: null, endDate: null };

        self.updateGraph = function(){
            
        }

        self.add = function () {

        }

        self.init = function () {
        }

        self.init();

        //EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];

        

    }
})(angular.module("app"));
