/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit.theme", []).constant("themeConfig", {config: {rest: charts_server + "/service/themes/data/"}}).run(function () {
    requirejs(["DataViz"], function (e) {
    })
}).service("themeService", ["$http", "$q", "themeConfig", "$timeout", function (e, t, r, n) {
    function o(n, o) {
        var i = t.defer(), a = n && n.rest || r.config.rest;
        return o || m ? i.resolve(o || m) : e({method: "get", url: a}).then(function (e) {
            e.data.error ? i.reject(e.data.error) : (m = e.data.object, _.each(e.data.object, function (e) {
                chroma.brewer["theme" + e.id + "_0"] = e.define.qualitative, chroma.brewer["theme" + e.id + "_1"] = e.define.sequential, chroma.brewer["theme" + e.id + "_2"] = e.define.diverging
            }), i.resolve(e.data.object))
        }, function (e) {
            console.error(e)
        }), i.promise
    }

    function i(e, t, r) {
        var n = t.simpleJson;
        if (m && !_.isEmpty(n)) {
            var o = _.findWhere(m, {id: e});
            setThemePalette(o, t), r || setChartJsonColor(o, t)
        }
    }

    function a(e, t) {
        _.each(e.widgets, function (e) {
            i(t, e.resource)
        })
    }

    function c(e, t) {
        $(t.simpleJson.dom).parent().css("background-color", _.findWhere(m, {id: e}).define.background)
    }

    function h(e) {
        $(e.simpleJson.dom).parent().css("background-color", "transparent")
    }

    var m;
    return {getThemeLibrary: o, applyThemeToChart: i, applyThemeToChartbook: a, applyThemeToDom: c, removeThemeToDom: h}
}]).directive("datavizCharteditTheme", ["themeService", function (e) {
    return {
        restrict: "AE",
        scope: {config: "=", themeLibrary: "=?"},
        templateUrl: "modules/chartedit/theme/theme.html",
        link: function (t, r, n) {
            e.getThemeLibrary(t.config, t.themeLibrary).then(function (e) {
                t.themeLibrary = e
            }, function (e) {
                console.error(e)
            }), t.select = function (e) {
                t.config.currentThemeId = e, t.$emit("dataviz-theme-changed", e)
            }
        }
    }
}]);