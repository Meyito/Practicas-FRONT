(function (module) {
    'use strict';

    module.controller("SecretaryProjectsCtrl", SecretaryProjectsCtrl);

    SecretaryProjectsCtrl.$inject = [
        "$scope",
        "inform",
        "ProjectsService",
        "DevPlan"
    ];

    function SecretaryProjectsCtrl($scope, inform, ProjectsService, DevPlan) {

        var self = this;

        /* Table Config */
        $scope.configDT = {
            order: 'SEPPI',
            limit: 10,
            page: 1
        }

        /* Obtiene todos los proyectos del Plan de Desarrollo */
        self.getProjects = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'subprogram',
                development_plan_id: $scope.development_plan,
                status: "Activo"
            }

            ProjectsService.getProjects(params).then(
                function (response) {
                    $scope.projects = response.data
                }, function (err) {
                    inform.add("Ocurrio un error al cargar los proyectos", { type: 'warning' })
                }
            )
        }


        /* Configuración inicial de la vista */
        self.init = function () {
            $scope.development_plan = DevPlan.data.id;
            self.getProjects();
        }

        self.init();

    }
})(angular.module("app"));
