(function (module) {
    'use strict';

    module.controller("TerritorialListCtrl", TerritorialListCtrl);

    TerritorialListCtrl.$inject = [
        "$scope",
        "inform",
        "TerritorialService",
        "Municipalities",
        "SisbenZones",
        "AdministrativeUnits"
    ];

    function TerritorialListCtrl($scope, inform, TerritorialService, Municipalities, SisbenZones, AdministrativeUnits) {

        var self = this;

        $scope.searchCode = "";
        $scope.answer = "";
        $scope.municipality = {};
        $scope.sisben_zone = -1;
        $scope.area = -1;
        $scope.areas = [];

        /* Table Config */
        $scope.configDT = {
            limit: 15,
            page: 1
        }

        self.getTerritories = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'administrative_unit_type,area.municipality,area.area_type.sisben_zone',
            }

            if( $scope.municipality.id ){
                params.municipality_id = $scope.municipality.id;
            }

            if( $scope.sisben_zone != -1 ){
                params.sisben_zone_id = $scope.sisben_zone;
            }

            if( $scope.area != -1 ){
                params.area_id = $scope.area;
            }

            TerritorialService.getAdministrativeUnits(params).then(
                function (response) {
                    $scope.administrativeUnits = response.data
                }, function (err) {
                    inform.add("Ocurrio un error al cargar las unidades administrativas", { type: 'warning' })
                }
            )
        }

        self.searchTerritories = function(){
            $scope.configDT.page = 1;
            self.getTerritories();
        }

        self.searchCode = function () {
            var data = {
                code: $scope.searchCode
            }

            TerritorialService.queryCode(data).then(
                function (response) {
                    $scope.answer = "El código corresponde a la " + response.data[0].tipoU + " " + response.data[0].name + 
                    " del Municipio " + response.data[0].municipio ;
                }, function (err) {
                    var msg = "Ocurrió un error al consultar el territorio: ";
                    var key, value, i;
                    for (var j in err.data) {
                        key = j;
                        value = err.data[j];
                        msg += key + ": " + err.data[j];
                        msg += "\n";
                    }
                    inform.add(msg, { type: "warning" });
                }
            );
        }

        self.findAreas = function(){
            $scope.areas = [];
            $scope.area = -1;

            var params = {
                relationships: "area_type"
            };

            if( $scope.municipality.id ){
                params.municipality_id = $scope.municipality.id;
            }

            if( $scope.sisben_zone != -1 ){
                params.sisben_zone_id = $scope.sisben_zone;
            }

            TerritorialService.getAreas(params).then(
                function(response){
                    $scope.areas = response.data;
                }
            );

        }

        self.init = function () {
            $scope.municipalities = Municipalities.data;
            $scope.sisbenZones = SisbenZones.data;
            $scope.administrativeUnits = AdministrativeUnits.data;
        }

        self.init();
    }
})(angular.module("app"));
