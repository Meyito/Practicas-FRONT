(function (module) {
    'use strict';

    module.controller("ProjectsCtrl", ProjectsCtrl);

    ProjectsCtrl.$inject = [
        "$scope",
        "$window",
        "APP_DEFAULTS",
        "$uibModal",
        "inform",
        "ProjectsService",
        "DevPlan",
        "DevelopmentPlans",
        "Dimentions"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, inform, ProjectsService, DevPlan, DevelopmentPlans, Dimentions) {

        var self = this;
        $scope.status = "Activo"

        /* Table Config */
        $scope.configDT = {
            order: 'SEPPI',
            limit: 10,
            page: 1
        }
        
        /* Filtro de Proyectos */
        self.search = function(){
            $scope.configDT.page = 1;
            self.getProjects();
        }

        /* Obtiene todos los proyectos del Plan de Desarrollo */
        self.getProjects = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'subprogram',
                status: $scope.status,
                development_plan_id: $scope.development_plan
            }

            ProjectsService.getProjects(params).then(
                function (response) {
                    $scope.projects = response.data
                }, function (err) {
                    inform.add("Ocurrio un error al cargar los proyectos", { type: 'warning' })
                }
            )
        }

        /* Descarga el formato para el cargue de Proyectos */
        self.downloadFormat = function () {
            $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Proyectos.xlsx');
        }

        /* Modal para cargar Proyectos de Manera Másiva a traves de un documento de Excel. */
        self.upload = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Proyectos',
                ariaDescribedBy: 'cargar-proyecto',
                templateUrl: 'templates/uploadProjects.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {}
                }
            });

            modalInstance.result.then(function (data) {
                ProjectsService.uploadProjects(data.file).then(
                    function (response) {
                        inform.add("Se han cargado los proyectos correctamente", { type: "info" });
                        self.getProjects();
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar los Proyectos: \n"
                        var key, value, i;
                        for (var j in err.data) {
                            key = j;
                            value = err.data[j];
                            msg += key + ": ";
                            for (i = 0; i < err.data[j].length; i++) {
                                msg += err.data[j][i] + ",";
                            }
                            msg += "\n";
                        }
                        inform.add(msg, { ttl: -1, type: "warning" });
                    }
                );
            });
        }

        /* Modal que permite la creación de 1 nuevo proyecto */
        self.add = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/createProject.modal.html',
                controller: 'ModalProjectCtrl',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        dimentions: $scope.dimentions
                    }
                }
            });

            modalInstance.result.then(function (data) {
                data.status = "Activo";

                ProjectsService.addProject(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el proyecto", { type: "info" });
                        self.getProjects();
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );
            });
        }

        /* Modal para la actualización de proyectos */
        self.edit = function (project) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Actualizar Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/updateProject.modal.html',
                controller: 'ModalUpdateProjectCtrl',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        project: project
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ProjectsService.updateProject(data, data.project.id).then(
                    function (response) {
                        inform.add("Se ha actualizado correctamente el proyecto", { type: "info" });
                        self.getProjects();
                    }, function (err) {
                        inform.add("Ocurrió un error al actualizar el proyecto", { type: "warning" });
                    }
                );
            });
        }

        /* Configuración inicial de la vista */
        self.init = function () {
            $scope.development_plan = DevPlan.data.id;
            self.getProjects();
            $scope.development_plans = DevelopmentPlans.data;
            $scope.dimentions = Dimentions.data;
        }

        self.init();

    }
})(angular.module("app"));
