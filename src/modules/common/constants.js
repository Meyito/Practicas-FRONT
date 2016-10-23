(function (module) {
    "use strict";

    var ROOT_PATH = "http://192.168.33.10/Practicas-BACK/public/";

    module.constant("APP_DEFAULTS", {
        ENDPOINT: ROOT_PATH + "api/v1",
        ROOT_PATH: ROOT_PATH
    });

})(angular.module('app'));