/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit.menubar", []).directive("menubar", ["$modal", "$state", "chartEditService", "toaster", function (e, t, r, a) {
    return {
        restrict: "AE",
        replace: !0,
        templateUrl: "modules/chartedit/menubar/menubar.html",
        link: function (c, o, n) {
            function s(e) {
                var t = JSON.parse(JSON.stringify(c.chart));
                t.simpleJson.data["default"] = [], r.saveDataset(c.dataset).then(function (a) {
                    r.chartShot($(".chart"), function (o) {
                        t.imgData = o, r.saveChart(t).then(function (t) {
                            c.chart.id !== t && (c.chart.id = t), a && (c.isSaved = !0) && (c.chartRenderCount = 1), e(!0)
                        })
                    })
                })
            }

            var i, l = "8";
            c.clear = function () {
                c.bindFields = [], c.dataProps = {}, c.$broadcast("dataviz-field-init"), c.$broadcast("dataviz-select-init"), c.$broadcast("dataviz-chart-clear"), c.$broadcast("dataviz-recommend-init")
            }, c.refresh = function () {
                c.freshChart = {open: !!c.chart.refresh, frequency: c.chart.refresh}, e.open({
                    scope: c,
                    templateUrl: "modules/chartedit/menubar/refresh.html",
                    controller: "refreshCtrl",
                    backdrop: !1,
                    size: "sm"
                })
            }, c.addTag = function () {
                var t = e.open({
                    scope: c,
                    templateUrl: "modules/common/resource-tag/resource-tag.html",
                    controller: "resourceTagCtrl",
                    backdrop: "static",
                    resolve: {
                        projectId: function () {
                            return c.project.id
                        }, tags: function () {
                            return c.chart.labels
                        }
                    }
                });
                t.result.then(function (e) {
                    c.chart.labels = e
                })
            }, c.convertData = function () {
                i = c.isChart ? c.chart.compId : i, c.isChart ? c.$broadcast("dataviz-select-init", l) : c.$broadcast("dataviz-select-init", i), c.isChart = !c.isChart
            }, c.preview = function () {
                var e = "q.html?c=" + c.chart.id;
                c.isSaved ? window.open(e) : a.pop("info", "", "请先保存图表")
            }, c.save = function () {
                if ("" == c.chart.name) {
                    var t = e.open({
                        scope: c,
                        templateUrl: "modules/chartedit/menubar/save.html",
                        controller: "saveChartCtrl",
                        backdrop: !1,
                        size: "sm"
                    });
                    t.result.then(function (e) {
                        e && s(function (e) {
                            e && a.pop("success", "", "图表保存成功")
                        })
                    })
                } else s(function (e) {
                    e && a.pop("success", "", "图表保存成功")
                })
            }, c.rename = function () {
                var t = e.open({
                    scope: c,
                    templateUrl: "modules/chartedit/menubar/rename.html",
                    controller: "renameCtrl",
                    backdrop: !1,
                    size: "sm"
                });
                t.result.then(function (e) {
                    e && s(function (e) {
                        e && a.pop("success", "", "图表名称修改成功")
                    })
                })
            }, c.copy = function () {
                var r = e.open({
                    scope: c,
                    templateUrl: "modules/chartedit/menubar/copy.html",
                    controller: "copyCtrl",
                    backdrop: !1,
                    size: "sm"
                });
                r.result.then(function (e) {
                    e && ("newChart" !== c.chart.id ? c.chart.id = "newChart" : null, s(function (e) {
                        e && a.pop("success", "", "图表保存成功"), t.go("app.charting_edit", {
                            projectId: c.project.id,
                            projectName: c.project.name,
                            chartId: c.chart.id
                        })
                    }))
                })
            }, c.share = function () {
            }, c.back = function () {
                if (c.isSaved)t.go("app.projectitems", {projectId: c.project.id, projectName: c.project.name}); else {
                    var r = e.open({
                        scope: c,
                        templateUrl: "modules/chartedit/menubar/back.html",
                        controller: "backCtrl",
                        backdrop: !1,
                        size: "sm"
                    });
                    r.result.then(function (r) {
                        if (r)if ("" == c.chart.name) {
                            var o = e.open({
                                scope: c,
                                templateUrl: "modules/chartedit/menubar/save.html",
                                controller: "saveChartCtrl",
                                backdrop: !1,
                                size: "sm"
                            });
                            o.result.then(function (e) {
                                e && s(function (e) {
                                    e && a.pop("success", "", "图表保存成功"), t.go("app.projectitems", {
                                        projectId: c.project.id,
                                        projectName: c.project.name
                                    })
                                })
                            })
                        } else s(function (e) {
                            e && a.pop("success", "", "图表保存成功"), t.go("app.projectitems", {
                                projectId: c.project.id,
                                projectName: c.project.name
                            })
                        }); else t.go("app.projectitems", {projectId: c.project.id, projectName: c.project.name})
                    })
                }
            }
        }
    }
}]).controller("renameCtrl", ["$scope", "$modalInstance", function (e, t) {
    var r = e.chart.name;
    e.form = {header: "重命名"}, e.submit = function () {
        t.close(!0)
    }, e.dismiss = function () {
        e.chart.name = r, t.close(!1)
    }
}]).controller("copyCtrl", ["$scope", "$modalInstance", function (e, t) {
    e.form = {header: "另存为"}, e.submit = function () {
        t.close(!0)
    }, e.dismiss = function () {
        t.close(!1)
    }
}]).controller("backCtrl", ["$scope", "$modalInstance", function (e, t) {
    e.form = {header: "返回"}, e.submit = function () {
        t.close(!0)
    }, e.dismiss = function () {
        t.close(!1)
    }
}]).controller("saveChartCtrl", ["$scope", "$modalInstance", function (e, t) {
    var r = e.chart.name;
    e.form = {header: "保存"}, e.submit = function () {
        t.close(!0)
    }, e.dismiss = function () {
        e.chart.name = r, t.close(!1)
    }
}]).controller("refreshCtrl", ["$scope", "$modalInstance", function (e, t) {
    var r = e.freshChart.frequency, a = e.freshChart.open;
    e.form = {header: "自动刷新"}, e.submit = function () {
        e.freshChart.open || (e.freshChart.frequency = 0), e.chart.refresh = e.freshChart.frequency, t.close(!0)
    }, e.dismiss = function () {
        e.freshChart.frequency = r, e.freshChart.open = a, t.close(!1)
    }
}]);