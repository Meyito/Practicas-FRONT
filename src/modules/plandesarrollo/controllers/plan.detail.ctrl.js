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
            dimentions: [{
                name: "Social",
                axes: [
                    {
                        name: "Eje 1",
                        programs: [
                            {
                                goals_count: 4, //cantidad total de metas de ese programa
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
            $scope.plan = $scope.plans[0];
        }

        self.init();


    }
})(angular.module("app"));
