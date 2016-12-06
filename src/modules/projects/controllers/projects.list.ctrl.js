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
        "ProjectsService",
        "Dimentions",
        "Projects"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ProjectsService, Dimentions, Projects) {

        var self = this;

        /* Table Config */
        $scope.configDT = {
            order: 'SEPPI',
            limit: 10,
            page: 1
        }
        /* */

        /* Obtiene todos los proyectos del Plan de Desarrollo Actual */
        self.getProjects = function () {
            var params = {
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true,
                relationships: 'subprogram'
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
                            msg += key + ": " + value;
                            /*for (i = 0; i < err.data[j].length; i++) {
                                msg += err.data[j][i] + ",";
                            }*/
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
            $scope.dimentions = Dimentions.data;
            $scope.projects = Projects.data;
        }

        self.init();

    }
})(angular.module("app"));
