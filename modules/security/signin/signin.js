/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.security.signin", ["ui.router", "app.security.signin.service"]).config(["$stateProvider", function (i) {
    i.state("access.signin", {
        url: "/signin/{inOrUp}",
        templateUrl: "modules/security/signin/signin.html",
        resolve: {
            deps: ["uiLoad", "$ocLazyLoad", function (i, n) {
                return n.load("toaster").then(function () {
                    return i.load(["modules/security/signin/signin_controller.js"])
                })
            }]
        }
    })
}]);