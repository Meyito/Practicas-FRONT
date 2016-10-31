
(function (module) {
    module.service("ProjectsService", ProjectsService);

    ProjectsService.$inject = [
        "$http",
        "$q",
        "APP_DEFAULTS",
        "Upload"
    ];

    function ProjectsService($http, $q, APP_DEFAULTS, Upload) {
        var self = this;

        self.addProject = function(data){
            return $http({
                method: "POST",
                data: data,
                url: APP_DEFAULTS.ENDPOINT + ""
            })
        }

        self.updateProject = function(data, id){
            return $hhtp({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + ""
            })
        }

    }
})(angular.module("app"));