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
