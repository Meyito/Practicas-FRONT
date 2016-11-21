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

        self.edit = function(proyect, status){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Actualizar Proyecto',
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

        self.refresh = function(){
            var params = {
                relationships: "subprogram"
            }

            ProjectsService.getProjects(params).then(
                function(response){
                    $scope.projects = response.data;
                }
            );
        }

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
                        self.refresh();
                    }, function (err) {
                        inform.add("Ocurrió un error al guardar el nuevo proyecto", { type: "warning" });
                    }
                );
            });
        }

        self.downloadFormat = function () {
            $window.open(APP_DEFAULTS.ROOT_PATH + '/formats/Formato_Proyectos.xlsx');
        }

        self.upload = function(){
            
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cargar Proyectos',
                ariaDescribedBy: 'cargar-proyecto',
                templateUrl : 'templates/uploadProjects.modal.html',
                controller : 'ModalController',
                controllerAs: 'modalCtrl',
                resolve:{
                    data: {}
                }
            });

            modalInstance.result.then(function(data) {
                ProjectsService.uploadProjects(data.file).then(
                    function(response){
                        inform.add("Se han cargado los proyectos correctamente", {type: "info"});
                        //Refrescar todos los proyectos
                    }, function(err){
                        inform.add("Ocurrió un error al guardar los proyectos", {type: "warning"});
                        //Descargar reporte de errores 
                    }
                );
            });
        }

        self.init = function () {
            $scope.dimentions = Dimentions.data;
            $scope.projects = Projects.data;
        }

        self.init();


    }
})(angular.module("app"));
