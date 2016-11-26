(function (module) {
    'use strict';

    module.controller("ContractsCtrl", ContractsCtrl);

    ContractsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal", 
        "$filter", 
        "inform",
        "IdentificationTypes",
        "ContractsService",
        "Contractors"
    ];

    function ContractsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, IdentificationTypes, ContractsService, Contractors) {

        var self = this;

        $scope.configDT = {
            limit: 15,
            page: 1
        }

        $scope.selectedContractor = {};

        self.getContractors = function(){
            var params = {
                relationships: 'contracts,identification_type',
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true
            };

            ContractsService.getContractors(params).then(
                function(response){
                    $scope.contractors = response.data;
                }, function (err){
                    inform.add("Ocurrió un error al consultar los contratistas", {type: "warning"});
                }
            );
        }

        self.addContract = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nuevo Contrato',
                ariaDescribedBy: 'crear-contrato',
                templateUrl: 'templates/addContract.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                ContractsService.addContract(data, $scope.selectedContractor.id ).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el contrato", { type: "info" });
                        $scope.selectedContractor.contracts.push(data);
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el contrato", { type: "warning" });
                    }
                );
            });
        }

        self.add = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nuevo Contratista',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/addContractor.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        identificationTypes: $scope.identificationTypes
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ContractsService.addContractor(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el contratista", { type: "info" });
                        self.getContractors();
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );
            });
        }

        self.edit = function(contractor){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/updateContrator.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        identificationTypes: $scope.identificationTypes,
                        contractor: contractor
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ContractsService.updateContractor(data, data.contractor.id).then(
                    function (response) {
                        inform.add("Se ha actualizado correctamente el contratista", { type: "info" });
                        self.getContractors();
                    }, function (err) {
                        inform.add("Ocurrió un error al actualizar el contratista", { type: "warning" });
                    }
                );
            });
        }

        self.selectContractor = function(contractor){
            $scope.selectedContractor = contractor;
        }

        self.init = function () {
            $scope.identificationTypes = IdentificationTypes.data;
            $scope.contractors = Contractors.data;
        }

        self.init();


    }
})(angular.module("app"));
