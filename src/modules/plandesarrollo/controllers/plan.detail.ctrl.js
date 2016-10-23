(function (module) {
    'use strict';

    module.controller("PlanDetailCtrl", PlanDetailCtrl);

    PlanDetailCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal"
    ];

    function PlanDetailCtrl($scope, $window, APP_DEFAULTS, $uibModal) {

        var self = this;

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
                    data: {name: "Meli"}
                }

            });

            modalInstance.result.then(function(data) {
                console.log(data.name);
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
