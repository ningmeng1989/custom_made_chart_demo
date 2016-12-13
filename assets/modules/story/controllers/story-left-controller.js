/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").controller("storyLeftCtrl", ["$scope", "$modal", "$q", "toaster", "storyService", function (t, e, r, o, n) {
    function a() {
        var t = r.defer(), o = e.open({
            templateUrl: "modules/story/views/story-add-page.html",
            controller: "AddPageCtrl",
            size: "md",
            backdrop: "static"
        });
        return o.result.then(function (e) {
            t.resolve({url: e})
        }, function () {
            t.reject()
        }), t.promise
    }

    function c() {
        var t = r.defer(), o = e.open({
            templateUrl: "modules/story/views/story-edit-text.html",
            controller: "EditTextCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                content: function () {
                    return "文字输入"
                }
            }
        });
        return o.result.then(function (e) {
            t.resolve({content: e})
        }, function () {
            t.reject()
        }), t.promise
    }

    function s(t) {
        var r = e.open({
            templateUrl: "modules/story/views/story-edit-text.html",
            controller: "EditTextCtrl",
            size: "md",
            backdrop: "static",
            resolve: {
                content: function () {
                    return t.content
                }
            }
        });
        r.result.then(function (e) {
            t.content = e
        }, function () {
        })
    }

    function i() {
        var o = r.defer(), n = e.open({
            templateUrl: "modules/story/views/story-add-image.html",
            controller: "AddImageCtrl",
            size: "lg",
            backdrop: "static",
            resolve: {
                projectId: function () {
                    return t.project.id
                }
            }
        });
        return n.result.then(function (t) {
            o.resolve({imageStore: t, showMode: "contain"})
        }, function () {
            o.reject()
        }), o.promise
    }

    t.$on("$destroy", function () {
    }), n.getChartInstanceList(t.project.id).then(function (e) {
        t.charts = e
    }), t.accordionGroupChart = {open: !0}, t.accordionGroupData = {open: !1}, t.showList = !1, t.toggleShow = function (e) {
        e.stopPropagation(), t.showList = !t.showList
    }, t.chartDragStart = function (t, e) {
        e.setData("type", "chart"), e.setData("resource", {id: t.id})
    }, t.textDragStart = function (t) {
        t.setData("type", "text"), t.setData("resourceFunc", c)
    }, t.titleDragStart = function (t) {
        t.setData("type", "title"), t.setData("resourceFunc", c)
    }, t.blankDragStart = function (t) {
        t.setData("type", "blank")
    }, t.pageDragStart = function (t) {
        t.setData("type", "page"), t.setData("resourceFunc", a)
    }, t.imageDragStart = function (t) {
        t.setData("type", "image"), t.setData("resourceFunc", i)
    }, t.$on("dashboard-element-added", function (e, r) {
        if ("chart" === r.type) {
            var o = _.findWhere(t.charts, {id: r.resource.id});
            o && (t.current.usedCharts[o.id] = !0)
        }
    }), t.$on("dashboard-element-removed", function (e, r) {
        if ("chart" === r.type) {
            var o = _.findWhere(t.charts, {id: r.resource.id});
            o && delete t.current.usedCharts[o.id]
        }
    }), t.$on("dashboard-element-doubleclicked", function (t, e) {
        "title" !== e.type && "text" !== e.type || s(e.resource)
    })
}]);