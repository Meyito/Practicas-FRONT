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
        "Secretaries",
        "SecretariesService"
    ];

    function SecretariesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, Secretaries, SecretariesService) {

        var self = this;

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
                SecretariesService.saveSecretary(data).then(
                    function(response){
                        inform.add("Se ha creado la nueva dependencia.", { type: "success" });
                        self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al guardar la dependencia", {type: "warning"});
                    }
                );
            });
        }

        self.edit = function (secretary) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Editar Secretaría',
                ariaDescribedBy: 'editar-secretaría',
                templateUrl: 'templates/update-secretary.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        secretary: secretary
                    }
                }
            });

            modalInstance.result.then(function (data) {
                SecretariesService.updateSecretary(data, secretary.id).then(
                    function(response){
                        inform.add("Se ha actualizado la dependencia.", { type: "success" });
                        self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al actualizar la dependencia", {type: "warning"});
                    }
                );
            });
        }

        self.delete = function (secretary) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Eliminar Secretaría',
                ariaDescribedBy: 'eliminar-secretaría',
                templateUrl: 'templates/delete-secretary.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        secretary: secretary
                    }
                }
            });

            modalInstance.result.then(function (data) {
                SecretariesService.deleteSecretary(secretary.id).then(
                    function(response){
                        inform.add("Se ha eliminado la dependencia.", { type: "success" });
                        self.refresh();
                    }, function(err){
                        inform.add("Ocurrió un error al eliminar la dependencia", {type: "warning"});
                    }
                );
            });
        }

        self.refresh = function(){
            SecretariesService.getSecretaries({}).then(
                function(response){
                    $scope.secretaries = response.data;
                }
            );
        }

        self.init = function () {
            $scope.secretaries = Secretaries.data;
        }

        self.init();


    }
})(angular.module("app"));
