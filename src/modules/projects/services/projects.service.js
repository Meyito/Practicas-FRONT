
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
                url: APP_DEFAULTS.ENDPOINT + "/projects"
            })
        }

        self.updateProject = function(data, id){
            return $http({
                method: 'PUT',
                data: data,
                url: APP_DEFAULTS.ENDPOINT + "/projects/" + id
            })
        }

        self.uploadProjects = function(file){
            return Upload.upload({
                data: {file: file},
                url: APP_DEFAULTS.ENDPOINT + "/projects/upload"
            });
        }

        self.getProjects = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/projects"
            })
        }

        self.getDimentions = function(params){
            return $http({
                method: 'GET',
                params: params,
                url: APP_DEFAULTS.ENDPOINT + "/dimentions"
            })
        }

    }
})(angular.module("app"));