
(function (module) {
    module.service("TerritorialService", TerritorialService);

    TerritorialService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function TerritorialService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.uploadMunicipalities = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/municipalities/upload"
            });
        }

        self.uploadAreas = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/areas/upload"
            });
        }

        self.uploadAdministrativeUnits = function(file){
            return Upload.upload({
                data: file,
                url: APP_DEFAULTS.ENDPOINT + "/administrative-units/upload"
            });
        }


    }
})(angular.module("app"));