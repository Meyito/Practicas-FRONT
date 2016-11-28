
(function (module) {
    module.service("StatisticService", StatisticService);

    StatisticService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS"
    ];

    function StatisticService($http, $q, APP_DEFAULTS) {
        var self = this;

        self.getDevelopmentPlans = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/development-plans'
            })
        }

        self.getSecretaries = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/secretaries'
            })
        }

        self.getCounters = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/counters'
            })
        }

        self.genericGetter = function(endpoint){
            return $http({
                method: "GET",
                url: APP_DEFAULTS.ENDPOINT + '/' + endpoint
            })
        }

        self.getGenericFilters = function(params){
            return $http({
                method: "GET",
                params: params,
                url: APP_DEFAULTS.ENDPOINT + '/generic-filters'
            })
        }

        self.getReport = function(params){
            return $http({
                method: "POST",
                data: params,
                url: APP_DEFAULTS.ENDPOINT + '/reports'
            })
        }

    }
})(angular.module("app"));