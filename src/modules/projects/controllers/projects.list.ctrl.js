(function (module) {
    'use strict';

    module.controller("ProjectsCtrl", ProjectsCtrl);

    ProjectsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal", 
        "$filter", 
        "inform",
        "PlanService"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService) {

        var self = this;

        self.add = function(){

        }

        self.init = function() {
        }

        self.init();


    }
})(angular.module("app"));
