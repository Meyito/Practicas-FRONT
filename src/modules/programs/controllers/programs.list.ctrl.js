(function (module) {
    'use strict';

    module.controller("ProgramsCtrl", ProgramsCtrl);

    ProgramsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "inform",
        "ProjectsService",
        "DevPlan",
        "Secretaries",
        "ProgramsService"
    ];

    function ProgramsCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, ProjectsService, DevPlan, Secretaries, ProgramsService) {

        var self = this;

        $scope.program_secretaries = [];

        self.getPrograms = function () {
            var params = {
                development_plan_id: $scope.development_plan,
                relationships: 'secretaries,axe.dimention.development_plan'
            }

            ProgramsService.getPrograms(params).then(
                function (response) {
                    $scope.programs = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.program_secretaries[i] = [];
                        angular.copy($scope.secretaries, $scope.program_secretaries[i]);
                    }
                }
            );
        }

        self.updateProgram = function (index) {
            var data = {
                secretaries: _.map($scope.programs[index].secretaries, function (s) {
                return s.id;
                })
            }

            ProgramsService.updateSecretaries(data, $scope.programs[index].id).then(
                function(response){
                    inform.add("Se actualizaron exitosamente las secretarias del programa", {type: "success"})
                }, function(err){
                    inform.add("Ocurrió un error al actualizar las secretarias del programa", {type: "warning"});
                }
            );
        }

        /* Configuración inicial de la vista */
        self.init = function () {
            $scope.development_plan = DevPlan.data.id;
            self.getPrograms();
            $scope.secretaries = Secretaries.data;
        }

        self.init();

    }
})(angular.module("app"));
