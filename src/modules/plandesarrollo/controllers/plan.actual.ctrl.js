(function (module) {
    'use strict';

    module.controller("PlanActualCtrl", PlanActualCtrl);

    PlanActualCtrl.$inject = [
        "$scope",
        "ActualPlan"
    ];

    function PlanActualCtrl($scope, ActualPlan) {

        var self = this;

        $scope.active = true;

        self.init = function () {
            $scope.selectedPlan = ActualPlan.data;
        }

        self.init();

    }
})(angular.module("app"));
