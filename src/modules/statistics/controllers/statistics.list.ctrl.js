(function (module) {
    'use strict';

    module.controller("StatisticsCtrl", StatisticsCtrl);

    StatisticsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "$filter",
        "inform",
        "PlanService"
    ];

    function StatisticsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, PlanService) {

        var self = this;

        $scope.expanded = false;

        $scope.secretaries = [
            {
                name: "Consolidado"
            },
            {
                name: "Secretaría de Atención Integral a Victimas"
            },
            {
                name: "Secretaría de Planeación y Desarrollo Territorial"
            },
            {
                name: "Secretaría de Tecnologías de la Información y Comunicaciones "
            },
            {
                name: "Secretaría General"
            },
            {
                name: "Secretaría Privada "
            },
            {
                name: "Secretaría de Agua Potable y Saneamiento Básico"
            },
            {
                name: "Secretaría de Cultura"
            },
            {
                name: "Secretaría de Desarollo Económico"
            },
            {
                name: "Secretaría de Desarrollo Social"
            },
            {
                name: "Secretaría de Educación"
            },
            {
                name: "Secretaría de Fronteras y Cooperación Internacional"
            },
            {
                name: "Secretaría de Gobierno"
            },
            {
                name: "Secretaría de Hacienda"
            },
            {
                name: "Secretaría de Infraestructura"
            },
            {
                name: "Secretaría de la Mujer"
            },
            {
                name: "Secretaría de Minas y Energía"
            },
            {
                name: "Secretaría de Tránsito"
            },
            {
                name: "Secretaría de Vivienda y Medio Ambiente"
            },
            {
                name: "Secretaría Jurídica"
            }
        ];

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

        $scope.datePicker = {};

        $scope.datePicker.date = { startDate: null, endDate: null };

        self.add = function () {

        }

        self.init = function () {
        }

        self.init();

        //EXAMPLE CHART
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];

    }
})(angular.module("app"));
