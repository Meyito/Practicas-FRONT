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
