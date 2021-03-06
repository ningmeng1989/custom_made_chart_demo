/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
var playChartBook = angular.module("playChartBook", ["ngStorage", "ui.bootstrap", "toaster", "dataviz.dashboard", "common.storyResource", "dataviz.chartedit.chart", "dataviz.chartedit.theme", "app.simpleconditions"]);
playChartBook.config(["$httpProvider", function (o) {
    o.defaults.withCredentials = !0, o.defaults.headers.common["Content-Type"] = "charset=utf-8", o.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
}]), playChartBook.controller("playChartBook", ["$scope", "$rootScope", "$http", "$localStorage", "$modal", "toaster", "$location", "$q", "$compile", "dashboardService", "themeService", "storyChartService", function (o, e, t, a, r, n, c, i, h, s, d, l) {
    function u(o) {
        function t() {
            var o = n.width(), t = o / (e.chartBook.showMode.width + 2 * i), a = t * e.chartBook.showMode.height + i;
            a > n.height() && (a = n.height(), t = a / (e.chartBook.showMode.height + i)), r.css({transform: "scale(" + t + ")"}), s.setDashboardScale(t)
        }

        function a(o) {
            o.pages.forEach(function (o) {
                o.widget = s.arrayToTree(o.widget)
            })
        }

        var r = $(".play-container"), n = r.parent(), c = _.debounce(t, 200), i = 0;
        if (a(o), e.chartBook = o, e.conditions = e.chartBook.conditions, l.setChartBook(o), e.chartBook.pages.length > 1 && (M = !0, I = $(".play-progress").css("display", "block").children()), C >= e.chartBook.pages.length && (C = 0, v(C)), e.currentPageIndex = C, e.currentPage = e.chartBook.pages[C], M && k(), e.dashboardStyle = {}, e.chartBook.background) {
            var h = e.chartBook.background;
            if (h.color) {
                var d = new tinycolor(h.color);
                e.dashboardStyle.backgroundColor = d.toRgbString()
            }
            h.image && (e.dashboardStyle.backgroundImage = "url(" + h.image + ")")
        }
        "fit" !== e.chartBook.showMode.type && (e.$watch("chartBook.showMode.type", function (o, a) {
            "actual" === o ? (n.css("overflow", "auto"), r.css({
                width: e.chartBook.showMode.width + 2 * i,
                height: e.chartBook.showMode.height + i,
                transform: "initial"
            }), $(window).off("resize", c)) : (o === a && r.css({
                width: e.chartBook.showMode.width + 2 * i,
                height: e.chartBook.showMode.height + i,
                transform: "initial"
            }), n.scrollTop(0), n.scrollLeft(0), n.css("overflow", "hidden"), t(), $(window).on("resize", c))
        }), n.css("overflow", "hidden"), t(), $(window).on("resize", c))
    }

    function g() {
        d.getThemeLibrary().then(function () {
        })
    }

    function f() {
        var o = i.defer();
        return d.getThemeLibrary().then(function (t) {
            e.themeLibrary = t, o.resolve()
        }), o.promise
    }

    function p(o) {
        37 === o.keyCode ? e.prevPage() : 39 === o.keyCode && e.nextPage()
    }

    function v(o) {
        location.hash = "/" + o
    }

    function k() {
        var o = e.currentPageIndex / (e.chartBook.pages.length - 1);
        I.css("width", 100 * o + "%")
    }

    function b(o) {
        e.currentPage = e.chartBook.pages[e.currentPageIndex = o], v(o), M && k()
    }

    var w = function (o) {
        var a = charts_server + "/service/chartbook/data/" + o;
        t.get(a).success(function (o) {
            requirejs(["DataViz"], function () {
                var t = $('<div ng-if="!!chartbookId" class="play-container" ng-style="dashboardStyle"><dataviz-dashboard animate-on-change="currentPageIndex" model="currentPage.widget" editable="false"></dataviz-dashboard></div>');
                h(t)(e), $(".play-main").append(t), u(o.object), g()
            })
        }).error(function () {
            n.pop("error", "", "获取图册失败")
        })
    }, m = function (o) {
        var a = charts_server + "/service/chartinstance/object/" + o;
        t.get(a).success(function (o) {
            e.chart = o.object, e.conditions = e.chart.simpleJson.data.conditions, f(e.chart).then(function () {
                e.$broadcast("dataviz-chart-render")
            })
        }).error(function () {
            n.pop("error", "", "获取图表信息失败")
        })
    }, y = location.search.substr(1).split("="), B = location.hash.split("/");
    if (B[1])var C = parseInt(B[1]); else var C = 0;
    "b" === y[0] ? (e.chartbookId = y[1], w(e.chartbookId)) : "c" === y[0] && (e.chartId = y[1], m(e.chartId));
    var P = document.createElement("img");
    P.title = "DataViz", $(".navbar-brand").empty(), $(".navbar-brand").append(P);
    var I, M = !1;
    e.toggleShowMode = function () {
        "actual" === e.chartBook.showMode.type ? e.chartBook.showMode.type = "scale" : e.chartBook.showMode.type = "actual"
    }, e.broadcastEvent = function () {
        e.$broadcast("story-condition-changed")
    }, e.prevPage = function () {
        e.currentPageIndex > 0 && b(e.currentPageIndex - 1)
    }, e.nextPage = function () {
        e.currentPageIndex < e.chartBook.pages.length - 1 && b(e.currentPageIndex + 1)
    }, document.addEventListener("keydown", p, !1)
}]), playChartBook.directive("animateOnChange", function (o) {
    return function (e, t, a) {
        e.$watch(a.animateOnChange, function (e, a) {
            e != a && (t.addClass("changed"), o(function () {
                t.removeClass("changed")
            }, 200))
        })
    }
});