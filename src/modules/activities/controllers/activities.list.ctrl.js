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
        "$state",
        "DevelopmentPlans",
        "GenericFilters",
        "usSpinnerService"
    ];

    function ActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ActivitiesService, $state, DevelopmentPlans, GenericFilters, usSpinnerService) {

        var self = this;

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
                ActivitiesService.uploadActivity(data).then(
                    function (response) {
                        inform.add("Se ha cargado la actividad correctamente", { type: "info" });
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar la actividad: \n"
                        var key, value, i;
                        for (var j in err.data) {
                            key = j;
                            value = err.data[j];
                            msg += key +": ";
                            for(i = 0; i < err.data[j].length; i++){
                                msg += err.data[j][i] + ",";
                            }
                            msg += "\n";
                        }
                        inform.add(msg, { ttl: -1, type: "warning" });
                    }
                );
            });
        }

        self.parse = function () {
            $scope.subprogram = -1;
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
