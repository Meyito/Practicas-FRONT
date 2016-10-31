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
        "ProjectsService"
    ];

    function ProjectsCtrl($scope, $window, APP_DEFAULTS, $uibModal, $filter, inform, ProjectsService) {

        var self = this;

        self.edit = function(proyect, status){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/updateProject.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        project: {
                            name: proyect,
                            description: "Descripción del proyecto",
                            id: 1,
                            status: status,
                            seppi: 123123,
                            subprogram: {
                                name: "Educación"
                            }
                        }
                    }
                }
            });

            modalInstance.result.then(function (data) {
                inform.add("Se ha actualizado correctamente el proyecto", { type: "info" });

                /*ProjectsService.updateProject(data, id).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el proyecto", { type: "info" });
                        //Refrescar los proyectos
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );*/
            });
        }

        self.add = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Crear Nuevo Proyecto',
                ariaDescribedBy: 'crear-proyecto',
                templateUrl: 'templates/createProject.modad.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        subprograms: [
                            {
                                id: 1,
                                name: "Subprograma 1"
                            },
                            {
                                id: 2,
                                name: "Subprograma 2"
                            }
                        ]
                    }
                }
            });

            modalInstance.result.then(function (data) {
                inform.add("Se ha guardado correctamente el proyecto", { type: "info" });

                /*ProjectsService.addProject(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el proyecto", { type: "info" });
                        //Refrescar los proyectos
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );*/
            });
        }

        self.init = function () {
        }

        self.init();


    }
})(angular.module("app"));
