
(function (module) {
    module.service("ActivitiesService", ActivitiesService);

    ActivitiesService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function ActivitiesService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.uploadActivity = function(data, file){
            return Upload.upload({
                data: {file: file, data: data},
                url: APP_DEFAULTS.ENDPOINT + "/activities/upload"
            });
        }

        self.getActivities = function(params){
            return $http({
                method: "POST",
                data: params,
                url: APP_DEFAULTS.ENDPOINT + "/activities/lite"
            })
        }

    }
})(angular.module("app"));