(function(module){
  module.service("AnalyticsService", AnalyticsService);

  AnalyticsService.$inject = [
      "$http"
  ];

  function AnalyticsService($http){
    var self = this;

    self.getData = function () {
        return $http.get("/data/activity-data.json");
    }
    
  }
})(angular.module("app"));
