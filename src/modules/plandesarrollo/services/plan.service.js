
(function (module) {
    module.service("PlanService", PlanService);

    PlanService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function PlanService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.uploadPlan = function(file, data){
            return Upload.upload({
                data: {file: file, data: data},
                url: APP_DEFAULTS.ENDPOINT + "/plan/upload"
            });
        }
    }
})(angular.module("app"));