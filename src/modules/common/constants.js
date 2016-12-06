(function (module) {
    "use strict";

    //var ROOT_PATH = "https://whispering-garden-20822.herokuapp.com/";
    var ROOT_PATH = "http://192.168.33.10/Practicas-BACK/public/";

    module.constant("APP_DEFAULTS", {
        ENDPOINT: ROOT_PATH + "api/v1",
        ROOT_PATH: ROOT_PATH
    });

    module.constant("AUTH_DEFAULTS", {
        TOKEN_NAME: "token",
        LOGIN_STATE: "login",
        LANDING_PAGE: "dashboard",
        FORBIDDEN_STATE: "forbidden"
    });

})(angular.module('app'));