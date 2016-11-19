(function (module) {
    'use strict';

    module.controller("ModalProjectCtrl", ModalProjectCtrl);

    ModalProjectCtrl.$inject = [
        "$scope",
        "$uibModalInstance",
        "data"
    ];

    function ModalProjectCtrl($scope, $uibModalInstance, data) {

        var self = this;

        $scope.data = angular.copy(data);
        $scope.new_data = {};
        $scope.dimention = "";
        $scope.axe = "";
        $scope.program = "";

        self.update = function () {
            $uibModalInstance.close($scope.data);
        };

        self.save = function () {
            $uibModalInstance.close($scope.new_data);
        };

        self.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        self.init = function(){
            console.log($scope.data);
        }

        self.init();

    }
})(angular.module("app"));
