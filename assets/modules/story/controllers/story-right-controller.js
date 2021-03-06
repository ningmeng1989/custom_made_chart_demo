/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").controller("storyRightCtrl", ["$scope", "$modal", "storyConfig", "themeService", "dashboardService", "$rootScope", "toaster", "storyChartService", function (o, e, t, r, a, h, c, n) {
    function i(o) {
        return o && "blank" !== o
    }

    function d() {
        var e = u.width(), t = e / (o.chartBook.showMode.width + 2 * k), r = t * o.chartBook.showMode.height + k;
        r > u.height() && (r = u.height(), t = r / (o.chartBook.showMode.height + k)), s.css({transform: "scale(" + t + ")"}), a.setDashboardScale(t)
    }

    o.$on("$destroy", function () {
        setTimeout(function () {
            $(window).off("resize", g)
        }, 200)
    }), o["default"] = o.chartBook.background && o.chartBook.background.color || "#fff", o.accordionGroupPages = {open: !0}, o.accordionGroupContent = {
        open: !1,
        disabled: !0
    }, o.accordionGroupBook = {open: !1};
    o.$watch("current.widget.type", function (e, t) {
        i(e) ? (o.accordionGroupContent.disabled = !1, o.accordionGroupContent.open = !0) : (o.accordionGroupContent.open && (o.accordionGroupPages.open = !0), o.accordionGroupContent.disabled = !0)
    });
    o.$on("dataviz-option-changed", function () {
        $(".dv-dashboard-element-selected [dataviz-chart]").children().scope().updateChartOption()
    });
    var s, u, g = _.debounce(d, 200), k = 16;
    setTimeout(function () {
        s = $(".story-dashboard").parent(), u = s.parent();
        o.$watch("chartBook.showMode.type", function (e, t) {
            if (e)switch (e) {
                case"fit":
                    e !== t && (s.css({
                        width: "100%",
                        height: "100%",
                        transform: "initial"
                    }), $(window).off("resize", g)), a.setDashboardScale(1);
                    break;
                case"actual":
                    u.css("overflow", "auto"), s.css({
                        width: o.chartBook.showMode.width + 2 * k,
                        height: o.chartBook.showMode.height + k,
                        transform: "initial"
                    }), $(window).off("resize", g), a.setDashboardScale(1);
                    break;
                case"scale":
                    e === t && s.css({
                        width: o.chartBook.showMode.width + 2 * k,
                        height: o.chartBook.showMode.height + k,
                        transform: "initial"
                    }), u.scrollTop(0), u.scrollLeft(0), u.css("overflow", "hidden"), d(), $(window).on("resize", g)
            }
        })
    }, 0), o.changeShowMode = function () {
        var e = o.chartBook.showMode;
        "fit" === e.type && (e.type = "actual", e.width || (e.width = 1366), e.height || (e.height = 768))
    };
    var f = 5e3, l = 1800;
    o.setChartBookWidth = function () {
        var e = o.chartBook.showMode.width;
        e > f ? (c.pop("info", "", "图册宽度不能大于" + f + "px"), o.chartBook.showMode.width = f) : 100 > e && (c.pop("info", "", "图册宽度不能小于100px"), o.chartBook.showMode.width = 100), s.width(o.chartBook.showMode.width), "scale" === o.chartBook.showMode.type && d()
    }, o.setChartBookHeight = function () {
        var e = o.chartBook.showMode.height;
        e > l ? (c.pop("info", "", "图册高度不能大于" + l + "px"), o.chartBook.showMode.height = l) : 100 > e && (c.pop("info", "", "图册高度不能小于100px"), o.chartBook.showMode.height = 100), s.height(o.chartBook.showMode.height), "scale" === o.chartBook.showMode.type && d()
    }, o.setBackgroundImage = function () {
        var t = e.open({
            templateUrl: "modules/story/views/story-add-image.html",
            controller: "AddImageCtrl",
            size: "lg",
            backdrop: "static",
            resolve: {
                projectId: function () {
                    return o.project.id
                }
            }
        });
        t.result.then(function (e) {
            o.chartBook.background || (o.chartBook.background = {}), o.chartBook.background.image = e
        }, function () {
        })
    }, o.removeBackgroundImage = function () {
        delete o.chartBook.background.image
    }, o.changeURL = function (e) {
        o.current.widget.resource.url = e
    }, n.setChartBook(o.chartBook), o.themeConfig = {
        rest: t.themeUrl,
        currentThemeId: o.chartBook.themeId
    }, r.getThemeLibrary(t.themeUrl).then(function (e) {
        o.themeStore = e
    }), o.$on("dataviz-theme-changed", function (e, t) {
        o.chartBook.themeId = t;
        var r = _.findWhere(o.themeStore, {id: t});
        o.chartBook.background || (o.chartBook.background = {}), o["default"] = o.chartBook.background.color = r.define.background;
        for (var a = 0; a < o.pagesChanged.length; a++)o.pagesChanged[a] = !0
    })
}]);