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
                }
                
            });
        }


        self.init = function () {
            
        }

        self.init();


    }
})(angular.module("app"));
