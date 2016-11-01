(function (module) {
    'use strict';

    module.controller("ActivitiesCtrl", ActivitiesCtrl);

    ActivitiesCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal", 
        "$filter", 
        "inform",
        "PlanService",
        "$state"
    ];

    function ActivitiesCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService, $state) {

        var self = this;

        $scope.expanded = false;

        $scope.datePicker = {
            date: { startDate: null, endDate: null }
        } 

        $scope.development_plans = [
            {
                slogan: "un norte productivo para todos",
                init_year: 2016,
                end_year: 2019
            },
            {
                slogan: "un norte productivo para todos",
                init_year: 2012,
                end_year: 2015
            },
            {
                slogan: "un norte productivo para todos",
                init_year: 2008,
                end_year: 2011
            },
            {
                slogan: "un norte productivo para todos",
                init_year: 2008,
                end_year: 2011
            }
        ]

        $scope.activities = [
            {
                date: "09-12-2015",
                count: 50,
                place: "San Calixto",
                contratista: "Javier Plazas",
                subprogram: "El nombre de un suprograma algo largo solo para probar",
                goal: "100% cumplido, meta larga para probar, ajustes de CSS"
            },
            {
                date: "09-12-2015",
                count: 80,
                place: "Bochalema",
                contratista: "Andres Rodriguez",
                subprogram: "Subprograma 2",
                goal: "Apoyar el desarrollo de "
            },
        ];

        self.statistics = function(){
            $state.go("statistics");
        }

        self.newActivity = function(){
            $state.go("new-activity");
        }

        self.search = function(){

        }

        self.init = function() {
        }

        self.init();


    }
})(angular.module("app"));
