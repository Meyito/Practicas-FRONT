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
        "StatisticService",
        "GenericFilters",
        "usSpinnerService"
    ];

    function StatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService,GenericFilters,usSpinnerService) {

        var self = this;

        $scope.spinner = false;

        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.subprogram = -1;
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
        $scope.reports = [];

        self.startSpin = function(){
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function(){
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        self.clean = function(){
            $scope.reports = [];
        }

        self.parse = function(){
            $scope.subprogram = -1;
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

        self.genericFilters = function(){
            var x;
            x = $scope.genericFilters[5];
            x.value = $scope.development_plan.id;
            $scope.req.filters.push(x);

            if($scope.dimention.id){
                x = $scope.genericFilters[4];
                x.value = $scope.dimention.id;
                $scope.req.filters.push(x);
            }

            if($scope.axe.id){
                x = $scope.genericFilters[3];
                x.value = $scope.axe.id;
                $scope.req.filters.push(x);
            }

            if($scope.secretary != -1){
                x = $scope.genericFilters[2];
                x.value = $scope.secretary;
                $scope.req.filters.push(x);
            }

            if($scope.program.id){
                x = $scope.genericFilters[1];
                x.value = $scope.program.id;
                $scope.req.filters.push(x);
            }

            if($scope.subprogram != -1){
                x = $scope.genericFilters[0];
                x.value = $scope.subprogram;
                $scope.req.filters.push(x);
            }
        }

        self.getReport = function(){
            self.startSpin();
            $scope.res = $scope.counter.response + " ";
            $scope.report = true;
            $scope.req = {
                total: $scope.counter.column,
            }
            var i = 0;

            $scope.req.filters = _.filter($scope.filters, function(f){
                if(f.data){
                    var x;
                    if(f.data.id){
                        f.value = f.data.id;
                        x = f.data.name
                    }else{
                        f.value = f.data;
                        x = f.value ? "si" : "no";
                    }
                    
                    if( i == 0 ){
                        $scope.res += "con las siguientes caracteristicas: "
                        i++;
                    }
                    $scope.res += f.label + " - " + x + ", ";
                    return true;
                }

                return false;
            });

            if($scope.counter.label == "Total Personas" || $scope.counter.label == "Total Municipios"){
                $scope.res += " es: ";
            }else{
                $scope.res += " son: ";
            }

            self.genericFilters();

            StatisticService.getReport($scope.req).then(
                function(response){
                    var i;
                    for(i = 0; i < response.data.length; i++){
                        for(var key in response.data[i]){
                            if(i > 0){
                                $scope.res+= ", "
                            }
                            $scope.res += response.data[i][key];
                        }
                    }
                    $scope.reports.push($scope.res);
                    self.getFilters();
                    self.stopSpin();
                },
                function(err){
                    inform.add("Ocurrió un error al consultar las estadisticas solicitadas", {type: "warning"});
                    self.stopSpin();
                }
            );
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
                delete $scope.counter.filters[i].data;
                self.getData($scope.counter.filters[i]);
            }
            $scope.filters = $scope.counter.filters;
        }

        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
            $scope.genericFilters = GenericFilters.data;
        }

        self.init();


        //EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];



    }
})(angular.module("app"));
