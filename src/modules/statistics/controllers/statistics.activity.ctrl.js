(function (module) {
    'use strict';

    module.controller("ActivityStatisticCtrl", ActivityStatisticCtrl);

    ActivityStatisticCtrl.$inject = [
        "$scope",
        "inform",
        "Counters",
        "StatisticService",
        "usSpinnerService",
        "AuthenticationService",
        "$stateParams",
        "$state",
        "Activity"
    ];

    function ActivityStatisticCtrl($scope, inform, Counters, StatisticService, usSpinnerService, AuthenticationService, $stateParams, $state, Activity) {

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
            var secretary = {
                column: "sp.id",
                value: $scope.secretary
            }

            var secretary = {
                column: "a.id",
                value: $stateParams.id
            }

            $scope.req.filters.push(secretary);
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
            $scope.counters = Counters.data;
            $scope.secretary = AuthenticationService.getCurrentUser().secretary_id;
            $scope.rol = AuthenticationService.getCurrentUser().role;

            if(Activity.data.secretary_id != $scope.secretary && $scope.rol != "planeacion" ){
                $state.go("forbidden");
            }
        }

        self.init();

    }
})(angular.module("app"));
