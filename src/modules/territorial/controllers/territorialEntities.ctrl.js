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

        self.uploadMunicipalities = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Ordenamiento',
                ariaDescribedBy: 'cargar-ordenamiento',
                templateUrl: 'templates/upload-territories.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                TerritorialService.uploadMunicipalities(data).then(
                    function(response){
                        inform.add("Se ha cargado el ordenamiento.", { type: "success" });
                        //self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al guardar el ordenamiento territorial.", {type: "warning"});
                    }
                );
            });
        }


        self.init = function () {
            
        }

        self.init();


    }
})(angular.module("app"));
