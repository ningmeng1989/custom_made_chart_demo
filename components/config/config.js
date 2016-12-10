/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
var app = angular.module("app").config(["$controllerProvider", "$compileProvider", "$filterProvider", "$provide", "KeepaliveProvider", "IdleProvider", function (e, r, t, i, o, a) {
    app.controller = e.register, app.directive = r.directive, app.filter = t.register, app.factory = i.factory, app.service = i.service, app.constant = i.constant, app.value = i.value
}]).config(["$httpProvider", function (e) {
    e.defaults.withCredentials = !0, e.defaults.headers.common["Content-Type"] = "charset=utf-8", e.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest", e.interceptors.push("UserInterceptor")
}]).config(["KeepaliveProvider", "IdleProvider", function (e, r) {
    r.idle(1800), r.timeout(5), e.interval(600), e.http(charts_server + "/service/session/ping")
}]).config(["$translateProvider", function (e) {
    e.useStaticFilesLoader({prefix: "l10n/", suffix: ".json"}), e.preferredLanguage("zh-cn"), e.useLocalStorage()
}]);