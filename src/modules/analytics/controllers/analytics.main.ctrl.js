(function (module) {
    'use strict';

    module.controller("AnalyticsCtrl", AnalyticsCtrl);

    AnalyticsCtrl.$inject = [
        "$scope",
        "AnalyticsService",
        '$interval',
        '$filter'
    ];

    function AnalyticsCtrl($scope, AnalyticsService, $interval, $filter) {

        var self = this;

        self.graphs = {
            zones: [],
            time: [],
            labels: [],
            speed: [],
            count: [],
            avg_speed: [],
            acum: []
        }

        self.paint = function () {

        }

        self.randomData = function () {
            var i, s;
            for (i = 0; i < self.graphs.zones.length; i++) {
                if (i == 0) {
                    s = self.graphs.time[self.graphs.time.length - 1] + 60000;
                    self.graphs.time.push(s);
                    self.graphs.labels.push($filter('date')(s, "medium"));
                }
                self.graphs.count[i] = Math.floor((Math.random() * 100) + 1);
                s = Math.random() * 200 + 1;
                self.graphs.speed[i].push(s);
                self.graphs.acum[i] += s;
                self.graphs.avg_speed[i] = self.graphs.acum[i] / self.graphs.speed[i].length;
            }

            console.log(self.graphs);
        }

        self.parseData = function (data) {
            var i;
            for (i = 0; i < data.length; i++) {
                if (i == 0) {
                    self.graphs.time.push(data[i].data.time);
                    self.graphs.labels.push($filter('date')(data[i].data.time, "medium"));
                }
                self.graphs.zones.push(data[i].zoneId);
                var speed = [];
                speed[0] = data[i].data.speed;
                self.graphs.speed.push(speed);
                self.graphs.avg_speed.push(data[i].data.speed);
                self.graphs.acum.push(data[i].data.speed);
                self.graphs.count.push(data[i].data.count);
            }
            console.log(self.graphs);
        }

        self.init = function () {
            AnalyticsService.getData().then(
                function (response) {
                    self.parseData(response.data);
                    $interval(function () {
                        self.randomData();
                    },3000);
                }
            );
        }

        self.init();



    }
})(angular.module("app"));
