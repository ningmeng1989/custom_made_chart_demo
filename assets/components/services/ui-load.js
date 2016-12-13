/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
"use strict";
angular.module("ui.load", []).service("uiLoad", ["$document", "$q", "$timeout", function (e, r, n) {
    var t = [], o = !1, i = r.defer();
    this.load = function (e) {
        e = angular.isArray(e) ? e : e.split(/\s+/);
        var r = this;
        return o || (o = i.promise), angular.forEach(e, function (e) {
            o = o.then(function () {
                return e.indexOf(".css") >= 0 ? r.loadCSS(e) : r.loadScript(e)
            })
        }), i.resolve(), o
    }, this.loadScript = function (o) {
        if (t[o])return t[o].promise;
        var i = r.defer(), u = e[0].createElement("script");
        return u.src = o, u.onload = function (e) {
            n(function () {
                i.resolve(e)
            })
        }, u.onerror = function (e) {
            n(function () {
                i.reject(e)
            })
        }, e[0].body.appendChild(u), t[o] = i, i.promise
    }, this.loadCSS = function (o) {
        if (t[o])return t[o].promise;
        var i = r.defer(), u = e[0].createElement("link");
        return u.rel = "stylesheet", u.type = "text/css", u.href = o, u.onload = function (e) {
            n(function () {
                i.resolve(e)
            })
        }, u.onerror = function (e) {
            n(function () {
                i.reject(e)
            })
        }, e[0].head.appendChild(u), t[o] = i, i.promise
    }
}]);