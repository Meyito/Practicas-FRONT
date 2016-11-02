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
                inform.add("Se han creado la nueva secretaría.", { type: "success" });

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
        }

        self.init();


    }
})(angular.module("app"));
