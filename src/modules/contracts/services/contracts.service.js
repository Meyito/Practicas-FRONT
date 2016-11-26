
(function (module) {
    module.service("ContractsService", ContractsService);

    ContractsService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS"
    ];

    function ContractsService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.addContractor = function(data){
            return $http({
                method: "POST",
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/contractors"
            })
        }

        self.getContractors = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/contractors"
            })
        }

        self.updateContractor = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/contractors/" + id
            })
        }

        self.getIdentificationTypes = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/identification-types"
            })
        }

    }
})(angular.module("app"));