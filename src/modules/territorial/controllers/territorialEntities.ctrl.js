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
                if (id == 1) {
                    TerritorialService.uploadMunicipalities(data).then(
                        function (response) {
                            inform.add("Se han cargado los municipios.", { type: "success" });
                        }, function (err) {
                            inform.add("Ocurrió un error al guardar los municipios.", { type: "warning" });
                        }
                    );
                } else if (id == 2) {
                    TerritorialService.uploadAreas(data).then(
                        function (response) {
                            inform.add("Se han cargado las areas.", { type: "success" });
                        }, function (err) {
                            inform.add("Ocurrió un error al guardar las areas.", { type: "warning" });
                        }
                    );
                } else if (id == 3) {
                    TerritorialService.uploadAdministrativeUnits(data).then(
                        function (response) {
                            inform.add("Se han cargado las unidades administrativas.", { type: "success" });
                        }, function (err) {
                            inform.add("Ocurrió un error al guardar las unidades administrativas.", { type: "warning" });
                        }
                    );
                }
            });
        }

        self.download = function( id ){
            if( id == 1 ){
                $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Municipios.xlsx');
            }else if( id == 2 ){
                $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Areas.xlsx');
            }else{
                $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Unidades.xlsx');
            }
        }


        self.init = function () {

        }

        self.init();


    }
})(angular.module("app"));
