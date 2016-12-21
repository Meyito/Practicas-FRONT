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

    function StatisticsCtrl($scope, $filter, inform, DevelopmentPlans, Secretaries, Counters, StatisticService, GenericFilters, usSpinnerService) {

        var self = this;

        /************ SPINNER **********/
        $scope.spinner = false;

        self.startSpin = function () {
            $scope.spinner = true;
            usSpinnerService.spin('spinner-1');
        }
        self.stopSpin = function () {
            $scope.spinner = false;
            usSpinnerService.stop('spinner-1');
        }

        /******** FILTROS GENÉRICOS ******/
        $scope.expanded = false;
        $scope.development_plan = {};
        $scope.dimention = {};
        $scope.axe = {};
        $scope.secretary = -1;
        $scope.subprogram = -1;
        $scope.program = {};
        $scope.program_id;

        self.clearDevPlan = function () {
            $scope.dimention = {};
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearDim = function () {
            $scope.axe = {};
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearAxe = function () {
            $scope.program = {};
            $scope.subprogram = -1;
        }

        self.clearProgram = function () {
            $scope.subprogram = -1;
            $scope.secretary = -1;
        }

        /***** FILTROS REPORTE ******/
        $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        $scope.counter = {};
        $scope.selectedFilters = [];

        /* Verifica si el filtro se debe mostrar */
        self.applyFilter = function (filter) {
            var i;
            for (i = 0; i < $scope.selectedFilters.length; i++) {
                if ($scope.selectedFilters[i].label == filter) {
                    return true;
                }
            }
            return false;
        }

        /* Inicializa los filtros de acuerdo al Counter elegido */
        self.getFilters = function () {
            var i;
            $scope.filtersData = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""];

            for (i = 0; i < $scope.counter.filters.length; i++) {
                self.getData($scope.counter.filters[i]);
            }

            $scope.filters = $scope.counter.filters;
        }

        /* Método que se encarga de consultar las opciones 
        de cada uno de los filtros poblacionales */
        self.getData = function (filter) {
            if (filter.endpoint == "NA") {
                return;
            }

            var ep = filter.endpoint.replace("-", "_");

            if (!$scope[ep]) {
                StatisticService.genericGetter(filter.endpoint).then(
                    function (response) {
                        $scope[ep] = response.data;
                    }
                );
            }
        }

        /********** REPORTES *********/
        $scope.report = false;
        $scope.reports = [];

        /* Limpia los reportes que se han consultado */
        self.clean = function () {
            $scope.reports = [];
        }

        /* Ajusta los filtros genericos para realizar la consulta */
        self.parseGenericFilters = function () {
            var x;
            x = $scope.genericFilters[5];
            x.value = $scope.development_plan.id;
            $scope.req.filters.push(x);

            if ($scope.dimention.id) {
                x = $scope.genericFilters[4];
                x.value = $scope.dimention.id;
                $scope.req.filters.push(x);
            }

            if ($scope.axe.id) {
                x = $scope.genericFilters[3];
                x.value = $scope.axe.id;
                $scope.req.filters.push(x);
            }

            if ($scope.secretary != -1) {
                x = $scope.genericFilters[2];
                x.value = $scope.secretary;
                $scope.req.filters.push(x);
            }

            if ($scope.program.id) {
                x = $scope.genericFilters[1];
                x.value = $scope.program.id;
                $scope.req.filters.push(x);
            }

            if ($scope.subprogram != -1) {
                x = $scope.genericFilters[0];
                x.value = $scope.subprogram;
                $scope.req.filters.push(x);
            }
        }

        /* Ajusta los filtros poblacionales para realizar la consulta */
        self.parseSpecificFilters = function () {
            var i = 0;

            $scope.req.filters = _.filter($scope.filters, function (f) {
                if ($scope.filtersData[f.id] != "") {
                    var ans = $scope.filtersData[f.id];
                    var x;
                    if (ans.id) {
                        f.value = ans.id;
                        x = ans.name;
                    } else {
                        f.value = ans;
                        if (f.id == 11) {
                            x = f.value;
                        } else {
                            x = f.value ? "si" : "no";
                        }
                    }

                    if (i == 0) {
                        $scope.res += "con las siguientes caracteristicas: "
                        i++;
                    }
                    $scope.res += f.label + " - " + x + ", ";
                    return true;
                }
                return false;
            });

            if ($scope.counter.label == "Cuales Municipios" || $scope.counter.label == "Cuales Proyectos") {
                $scope.res += " son: ";
            } else {
                $scope.res += " es: ";
            }
        }

        /* Ajusta la respuesta de los totales */
        self.parseTotals = function (data) {
            $scope.res += data[0].total;
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los cuales */
        self.parseWhich = function (data) {
            var i;
            for (i = 0; i < data.length; i++) {
                for (var key in data[i]) {
                    $scope.res += data[i][key] + ", ";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Ajusta la respuesta de los datos agrupados */
        self.parseTotalGroup = function(data){
            var i;
            for (i = 0; i < data.length; i++) {
                if(data[i].total != 0 ){
                    $scope.res += " " + data[i].name + ": " + data[i].total + ",";
                }
            }
            $scope.reports.push($scope.res);
        }

        /* Realiza la consulta con base a los filtros seleccionados */
        self.getReport = function () {
            self.startSpin();
            $scope.res = $scope.counter.response + " ";
            $scope.report = true;
            $scope.req = {
                total: $scope.counter.column,
                group: $scope.counter.group_by
            }

            self.parseSpecificFilters();
            self.parseGenericFilters();

            StatisticService.getReport($scope.req).then(
                function (response) {
                    if ($scope.counter.id == 1 || $scope.counter.id == 2) {
                        self.parseTotals(response.data);
                    } else if ($scope.counter.id == 3 || $scope.counter.id == 4) {
                        self.parseWhich(response.data);
                    } else {
                        self.parseTotalGroup(response.data);
                    }
                    
                    self.getFilters();
                    self.stopSpin();
                },
                function (err) {
                    inform.add("Ocurrió un error al consultar las estadisticas solicitadas", { type: "warning" });
                    self.stopSpin();
                }
            );
        }


        /********** CARGUE INICIAL **********/
        self.init = function () {
            $scope.development_plans = DevelopmentPlans.data;
            $scope.secretaries = Secretaries.data;
            $scope.counters = Counters.data;
            $scope.genericFilters = GenericFilters.data;
        }

        self.init();

    }
})(angular.module("app"));
