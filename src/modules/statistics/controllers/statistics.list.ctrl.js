(function (module) {
    'use strict';

    module.controller("StatisticsCtrl", StatisticsCtrl);

    StatisticsCtrl.$inject = [
        "$scope",
        "$filter",
        "inform",
        "DevelopmentPlans",
        "Secretaries",
        "Counters",
        "StatisticService"
    ];

    function StatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService) {

        var self = this;

        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.program = {};
        $scope.program_id;
        $scope.report = false;
        $scope.counter = {};
        $scope.selectedFilters = [];
        $scope.genders = [];
        $scope.age_range = [];
        $scope.special_conditions = [];
        $scope.hearing_impairments = [];
        $scope.visual_impairments = [];
        $scope.motor_disabilities = [];
        $scope.victim_types = [];
        $scope.ethnic_groups = [];

        self.parse = function(){
            $scope.program = {};
            var i;
            for (i = 0; i < $scope.axe.programs.length; i++) {
                if ($scope.axe.programs[i].id == $scope.program_id) {
                    $scope.program = $scope.axe.programs[i];
                    break;
                }
            }
        }

        self.belongsToSecretary = function (program) {
            if ($scope.secretary == -1) {
                return true;
            }
            var i;
            for (i = 0; i < program.secretaries.length; i++) {
                if (program.secretaries[i].secretary_id == $scope.secretary) {
                    return true;
                }
            }

            return false;
        }

        self.getReport = function(){
            $scope.report = true;
        }

        self.getData = function(filter){
            if(filter.endpoint == "NA"){
                return;
            }

            var ep = filter.endpoint.replace("-", "_");

            if( $scope[ep] == 0 ){
                StatisticService.genericGetter(filter.endpoint).then(
                    function(response){
                        $scope[ep] = response.data;
                    }
                );
            }
        }

        self.applyFilter = function(filter){
            var i;
            for(i = 0; i < $scope.selectedFilters.length; i++){
                if($scope.selectedFilters[i].column == filter){
                    return true;
                }
            }
            return false;
        }

        self.getFilters = function(){
            var i;
            for(i = 0; i < $scope.counter.filters.length; i++){
                self.getData($scope.counter.filters[i]);
            }
        }

        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
        }

        self.init();





        self.updateGraph = function () {
            console.log($scope.selectedFilters);
        }

        self.add = function () {

        }

        //EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];



    }
})(angular.module("app"));
