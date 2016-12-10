/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
"use strict";
angular.module("app").run(["$rootScope", "$state", "$stateParams", function (t, e, a) {
    t.$state = e, t.$stateParams = a
}]).config(["$stateProvider", "$urlRouterProvider", "JQ_CONFIG", function (t, e, a) {
    t.state("app", {"abstract": !0, url: "/app", templateUrl: "components/app.html"}).state("app.page", {
        url: "/page",
        template: '<div ui-view class="fade-in-down"></div>'
    }).state("oauth_weibo", {
        url: "/oauth_weibo",
        templateUrl: "tpl/security/oauth_weibo_page.html",
        resolve: {
            deps: ["uiLoad", "$ocLazyLoad", function (t, e) {
                return e.load("toaster").then(function () {
                    return t.load(["js/app/security/controllers/oauth_weibo.js"])
                })
            }]
        }
    }).state("oauth_weixin", {
        url: "/oauth_weixin",
        templateUrl: "tpl/security/oauth_weixin_page.html",
        resolve: {
            deps: ["uiLoad", "$ocLazyLoad", function (t, e) {
                return e.load("toaster").then(function () {
                    return t.load(["js/app/security/controllers/oauth_weixin.js"])
                })
            }]
        }
    }).state("oauth_qq", {
        url: "/oauth_qq",
        templateUrl: "tpl/security/oauth_qq_page.html",
        resolve: {
            deps: ["uiLoad", "$ocLazyLoad", function (t, e) {
                return e.load("toaster").then(function () {
                    return t.load(["js/app/security/controllers/oauth_qq.js"])
                })
            }]
        }
    }).state("access", {url: "/access", templateUrl: "tpl/access.html"}).state("access.404", {
        url: "/404",
        templateUrl: "tpl/page_404.html"
    }).state("app.story", {
        url: "/story/{projectId}/{projectName}/{bookId}",
        templateUrl: "modules/story/views/story.html"
    }).state("app.account", {
        url: "/accounts",
        templateUrl: "modules/account/account-list.html"
    }), e.otherwise("/app/projects")
}]);