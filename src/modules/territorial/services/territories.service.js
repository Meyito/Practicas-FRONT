
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

        self.queryCode = function(data){
            return $http({
                method: "GET",
                params: data,
                url: APP_DEFAULTS.ENDPOINT + "/administrative-units/query"
            })
        }

        self.getMunicipalities = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/municipalities"
            });
        }

        self.getSisbenZones = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/sisben-zones"
            });
        } 

        self.getAreas = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/areas"
            });
        }

        self.getAdministrativeUnits = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/administrative-units"
            });
        }


    }
})(angular.module("app"));