/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.profile", []).config(["$stateProvider", function (e) {
    e.state("app.page.profile", {
        url: "/profile/{{currentTab}}/{{errorTip}}",
        templateUrl: "modules/profile/profile.html",
        resolve: {
            deps: ["uiLoad", "$ocLazyLoad", function (e, o) {
                return o.load("ngImgCrop").then(o.load("toaster")).then(function () {
                    return e.load(["modules/profile/profile_controller.js"])
                })
            }]
        }
    })
}]);