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
                inform.add("Se han cargado los asistentes correctamente.", { type: "success" });
                
                /*PlanService.uploadPlan(data.file, d).then(
                    function (response) {
                        inform.add("Se ha cargado el plan de desarrollo correctamente", { type: "info" });
                        //Refrescar todos los planes de desarrollo
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el plan de desarrollo", { type: "warning" });
                        //Descargar reporte de errores 
                    }
                );*/
            });
        }


        self.init = function () {
            $scope.saved = false;
            //$scope.saved = true;
        }

        self.init();





    }
})(angular.module("app"));
