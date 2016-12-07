
(function (module) {
    module.service("UsersService", UsersService);

    UsersService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS"
    ];

    function UsersService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.getRoles = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/roles"
            });
        }

        self.getUsers = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/users"
            });
        }

        self.addUser = function(data){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/users"
            });
        }

        self.deleteUser = function(id){
            return $http({
                method: 'DELETE',
                url: APP_DEFAULTS.ENDPOINT + "/users/" + id
            });
        }

        self.updatePassword = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + '/users/' + id + '/password'
            })
        }

    }
})(angular.module("app"));