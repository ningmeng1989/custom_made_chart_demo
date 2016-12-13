/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
"use strict";
angular.module("ui.jq", ["ui.load"]).value("uiJqConfig", {}).directive("uiJq", ["uiJqConfig", "JQ_CONFIG", "uiLoad", "$timeout", function (i, n, u, t) {
    return {
        restrict: "A", compile: function (e, o) {
            if (!angular.isFunction(e[o.uiJq]) && !n[o.uiJq])throw new Error('ui-jq: The "' + o.uiJq + '" function does not exist');
            var r = i && i[o.uiJq];
            return function (i, e, o) {
                function c() {
                    var n = [];
                    return o.uiOptions ? (n = i.$eval("[" + o.uiOptions + "]"), angular.isObject(r) && angular.isObject(n[0]) && (n[0] = angular.extend({}, r, n[0]))) : r && (n = [r]), n
                }

                function a() {
                    t(function () {
                        e[o.uiJq].apply(e, c())
                    }, 0, !1)
                }

                function f() {
                    o.uiRefresh && i.$watch(o.uiRefresh, function () {
                        a()
                    })
                }

                o.ngModel && e.is("select,input,textarea") && e.bind("change", function () {
                    e.trigger("input")
                }), n[o.uiJq] ? u.load(n[o.uiJq]).then(function () {
                    a(), f()
                })["catch"](function () {
                }) : (a(), f())
            }
        }
    }
}]);