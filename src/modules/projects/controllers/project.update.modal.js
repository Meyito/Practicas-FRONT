(function (module) {
    'use strict';

    module.controller("ModalUpdateProjectCtrl", ModalUpdateProjectCtrl);

    ModalUpdateProjectCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "data"
    ];

    function ModalUpdateProjectCtrl($scope, $uibModalInstance, data) {

        var self = this;

        $scope.data = angular.copy(data);
        $scope.new_data = {};

        self.update = function () {
            $scope.data.project.status = $scope.data.project.s ? 'Activo' : 'Inactivo';
            $uibModalInstance.close($scope.data);
        };

        self.save = function () {
            $uibModalInstance.close($scope.new_data);
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        self.init = function(){
            $scope.data.project.s = $scope.data.project.status == 'Activo' ? true : false;
        }

        self.init();

    }
})(angular.module("app"));
