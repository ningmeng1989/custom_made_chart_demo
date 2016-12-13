/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").controller("storyCtrl", ["$scope", "$state", "$stateParams", "$location", "$q", "$window", "toaster", "storyPageshotService", "storyService", "dashboardService", function (e, o, r, t, n, a, i, d, c, s) {
    if (e.projectCategory = "我的项目", e.project = {
            id: r.projectId,
            name: r.projectName
        }, r.bookId)var l = c.getChartBook(r.bookId); else var l = c.createChartBook(e.project.id);
    l.then(function (o) {
        function i() {
            var o = n.defer();
            e.current.promise = o.promise;
            var r, t, a = e.current.page, i = $(".story-dashboard"), c = i.parent();
            "fit" === e.chartBook.showMode.type ? r = t = i.children().clone().css({
                zIndex: -1,
                position: "absolute"
            }).prependTo(i) : (r = c.clone().css({
                width: c.parent().width(),
                height: c.parent().height(),
                zIndex: -1,
                position: "absolute",
                transform: "initial"
            }).prependTo(c.parent()), t = r.children().children()), setTimeout(function () {
                d.pageShot(t, function (t) {
                    e.$apply(function () {
                        a.iconStore = t, r.remove(), o.resolve()
                    })
                })
            }, 0)
        }

        function c(e) {
            e.showMode || (e.showMode = {type: "fit"}), e.labels || (e.labels = []), e.dataSetBindings || (e.dataSetBindings = []), e.conditions || (e.conditions = []), e.themeId = "-1"
        }

        function l(e) {
            return e = angular.copy(e), e.pages.forEach(function (e) {
                e.widget = s.arrayToTree(e.widget)
            }), e
        }

        if (r.bookId)e.oldChartBookJson = angular.toJson(o); else {
            r.bookId = o.id;
            var u = t.url(), g = u + o.id;
            t.url(g), c(o), e.oldChartBookJson = ""
        }
        e.chartBook = l(o), e.current = {pageIndex: null, page: null, widget: null, pageJson: null, usedCharts: null};
        var p = n.defer();
        e.current.promise = p.promise, p.resolve(), e.$watch("chartBook.background", function (o) {
            if (o && (e.dashboardStyle = {}, o)) {
                if (o.color) {
                    var r = new tinycolor(o.color);
                    e.dashboardStyle.backgroundColor = r.toRgbString()
                }
                o.image && (e.dashboardStyle.backgroundImage = "url(" + o.image + ")")
            }
        }, !0), e.pagesChanged = new Array(e.chartBook.pages.length), e.checkPageShot = function (o) {
            var r = angular.toJson(s.treeToArray(e.current.page.widget));
            (r !== e.current.pageJson || e.pagesChanged[e.current.pageIndex]) && (e.pagesChanged[e.current.pageIndex] = !1, o && (e.current.pageJson = r), i())
        }, a.onbeforeunload = function () {
            e.$destroy()
        }
    }, function (e) {
        i.pop("error", "", e.m || "读取图册失败")
    })
}]);