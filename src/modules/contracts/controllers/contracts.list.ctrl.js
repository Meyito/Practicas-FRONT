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
        "PlanService"
    ];

    function ContractsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService) {

        var self = this;

        self.init = function () {
        }

        self.init();


    }
})(angular.module("app"));
