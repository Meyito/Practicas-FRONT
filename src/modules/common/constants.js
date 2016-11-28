(function (module) {
    "use strict";

    var ROOT_PATH = "https://whispering-garden-20822.herokuapp.com/";

    module.constant("APP_DEFAULTS", {
        ENDPOINT: ROOT_PATH + "api/v1",
        ROOT_PATH: ROOT_PATH
    });

})(angular.module('app'));