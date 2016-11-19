
(function (module) {
    module.service("SecretariesService", SecretariesService);

    SecretariesService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function SecretariesService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.getSecretaries = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/secretaries"
            });
        }

        self.saveSecretary = function(data){
            return $http({
                method: 'POST',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/secretaries"
            });
        }
    }
})(angular.module("app"));