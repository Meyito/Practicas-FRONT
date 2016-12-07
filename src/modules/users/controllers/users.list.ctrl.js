(function (module) {
    'use strict';

    module.controller("UsersController", UsersController);

    UsersController.$inject = [
        "$scope",
        "$uibModal", 
        "inform",
        "Roles",
        "Users",
        "UsersService",
        "Secretaries"
    ];

    function UsersController($scope, $uibModal, inform, Roles, Users, UsersService, Secretaries) {

        var self = this;

        $scope.configDT = {
            limit: 15,
            page: 1
        }

        self.getUsers = function(){
            var params = {
                relationships: 'role,secretary',
                page: $scope.configDT.page,
                items: $scope.configDT.limit,
                count: true
            };

            UsersService.getUsers(params).then(
                function(response){
                    $scope.users = response.data;
                }, function (err){
                    inform.add("Ocurrió un error al consultar los usuarios", {type: "warning"});
                }
            );
        }

        self.delete = function(user){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Eliminar Usuario',
                ariaDescribedBy: 'eliminar-usuario',
                templateUrl: 'templates/deleteUser.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        user: user,
                    }
                }
            });

            modalInstance.result.then(function (data) {
                UsersService.deleteUser(user.id).then(
                    function (response) {
                        inform.add("Se ha eliminado correctamente el usuario", { type: "info" });
                        self.getUsers();
                    }, function (err) {
                        inform.add("Ocurrió un error al eliminar el usuario", { type: "warning" });
                    }
                );
            });
        }

        self.add = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Nuevo Usuario',
                ariaDescribedBy: 'crear-usuario',
                templateUrl: 'templates/addUser.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        roles: $scope.roles,
                        secretaries: $scope.secretaries
                    }
                }
            });

            modalInstance.result.then(function (data) {
                UsersService.addUser(data).then(
                    function (response) {
                        inform.add("Se ha guardado correctamente el usuario", { type: "info" });
                        self.getUsers();
                    }, function (err) {
                        var msg = "Ocurrió un error al guardar el usuario: \n"
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

        self.edit = function(user){
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cambiar Contraseña',
                ariaDescribedBy: 'cambiar-contraseña',
                templateUrl: 'templates/updatePassword.modal.html',
                controller: 'ModalController',
                controllerAs: 'modalCtrl',
                resolve: {
                    data: {
                        user: user
                    }
                }
            });

            modalInstance.result.then(function (data) {
                UsersService.updatePassword(data, user.id).then(
                    function (response) {
                        inform.add("Se ha actualizado correctamente el contratista", { type: "info" });
                        self.getUsers();
                    }, function (err) {
                        var msg = "Ocurrió un error al actualizar la contraseña  del usuario: \n"
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

        self.init = function () {
            $scope.roles = Roles.data;
            $scope.users = Users.data;
            $scope.secretaries = Secretaries.data;
        }

        self.init();


    }
})(angular.module("app"));
