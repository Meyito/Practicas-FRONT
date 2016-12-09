
(function (module) {
    module.service("ProgramsService", ProgramsService);

    ProgramsService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
    ];

    function ProgramsService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.getPrograms = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/programs'
            });
        }

        self.updateSecretaries = function(data, id){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + '/programs/' + id + '/secretaries'
            })
        }
        
    }
})(angular.module("app"));