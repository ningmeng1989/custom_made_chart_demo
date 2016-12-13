/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit").controller("chartEditCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "chartEditService", "themeService", "$modal", "$timeout", "charteditConfig", function (t, a, e, d, i, n, r, o, c) {
    function s() {
        return r.open({
            scope: t,
            templateUrl: "modules/chartedit/dataset/datasetlist.html",
            controller: "datasetList",
            backdrop: !1,
            size: "md"
        }).result
    }

    function h(a) {
        t.chart.dataset.id = a.id, t.dataset.id = a.id, t.dataset.name = a.name, t.dataset.fields = a.fields
    }

    function l() {
        t.bindFields = [], t.dataProps = {}, t.$broadcast("dataviz-field-init"), t.$broadcast("dataviz-select-init"), t.$broadcast("dataviz-chart-clear")
    }

    function p(a, e) {
        return n.getThemeLibrary(t.themeConfig.rest).then(function (d) {
            t.themeLibrary = d, t.chart.themeId = a, n.applyThemeToChart(a, t.chart, e)
        })
    }

    function b() {
        var a = t.chart.simpleJson.data.properties, e = [];
        t.bindFields = [];
        for (var d in t.dataProps)if (0 !== t.dataProps[d].bind.length)for (var i in a)if (a[i].type[0] === t.dataProps[d].type[0] && 0 === a[i].bind.length)if (a[i].isMore === t.dataProps[d].isMore) {
            if (-1 == _.indexOf(e, i)) {
                a[i].bind = t.dataProps[d].bind, t.bindFields = t.bindFields.concat(t.dataProps[d].bind), e.push(i);
                break
            }
        } else if (-1 == _.indexOf(e, i)) {
            a[i].bind.push(t.dataProps[d].bind[0]), t.bindFields.push(t.dataProps[d].bind[0]), e.push(i);
            break
        }
    }

    t.project = {
        id: d.projectId || c.project.id,
        name: d.projectName || c.project.name
    }, "undefined" == typeof d.chartId ? t.chartId = c.chartId : t.chartId = d.chartId, t.chart, t.dataset = {}, t.themeLibrary, t.isSaved = !0, t.chartRenderCount = 0, t.bindFields, t.dataProps, t.conditions, t.isChart = !0, t.themeConfig = {
        rest: c.rest.theme,
        currentThemeId: c.theme.currentThemeId
    }, t.setDataset = function () {
        c.dataset.showDatasetList ? s().then(function (t) {
            t && (h(t), l())
        }) : (h(c.dataset.setDataset()), l())
    }, t.refreshData = function () {
        t.chart.simpleJson.data.conditions = t.conditions, a.$broadcast("getBindData")
    }, t.chartId && "" != t.chartId ? i.getChart(t.chartId).then(function (a) {
        t.chart = a, i.getDataset(t.chart.dataset.id).then(function (a) {
            t.bindFields = [], t.dataset = a, t.dataProps = angular.copy(t.chart.simpleJson.data.properties), t.themeConfig.currentThemeId = t.chart.themeId, t.conditions = t.chart.simpleJson.data.conditions, o(function () {
                t.$broadcast("dataviz-field-init"), t.$broadcast("dataviz-select-init", t.chart.compId, !0), t.$broadcast("dataviz-databind-init"), t.$broadcast("dataviz-option-init")
            }, 0);
            for (var e in t.dataProps)t.bindFields.push(t.dataProps[e].bind);
            t.bindFields = _.flatten(t.bindFields), i.getBindData(t.dataset.id, t.bindFields, t.conditions).then(function (a) {
                i.setDecimals(a, t.bindFields), t.chart.simpleJson.data["default"] = a, p(t.chart.themeId, !0).then(function () {
                    t.$broadcast("dataviz-chart-render"), t.$broadcast("dataviz-select-recommend")
                })
            }, function (t) {
                console.error(t)
            })
        })
    }) : (t.chart = {}, t.chart.id = "newChart", t.chart.name = "", t.chart.labels = [], t.chart.projectId = t.project.id, t.chart.dataset = {}, t.chart.simpleJson = {}, t.setDataset(), t.chart.themeId = "0", t.conditions = []), t.$on("getBindData", function (a, e) {
        t.bindFields = e || t.bindFields, t.dataProps = angular.copy(t.chart.simpleJson.data.properties), t.bindFields.length > 0 ? i.getBindData(t.dataset.id, t.bindFields, t.conditions).then(function (a) {
            i.setDecimals(a, t.bindFields), t.chart.simpleJson.data["default"] = a, p(t.chart.themeId).then(function () {
                t.$broadcast("dataviz-chart-render"), t.$broadcast("dataviz-select-recommend")
            })
        }, function (t) {
            console.error(t)
        }) : (t.$broadcast("dataviz-chart-clear"), t.$broadcast("dataviz-recommend-init"))
    }), t.$on("dataviz-option-changed", function (a) {
        t.$broadcast("dataviz-chart-render")
    }), t.$on("dataviz-theme-changed", function (a, e) {
        p(e).then(function () {
            t.$broadcast("dataviz-option-update"), t.$broadcast("dataviz-chart-render")
        })
    }), t.$on("dataviz-select-changed", function (a) {
        b(), t.$broadcast("dataviz-option-init", !0), t.$broadcast("dataviz-databind-init"), 0 !== t.bindFields.length && i.getBindData(t.dataset.id, t.bindFields, t.conditions).then(function (a) {
            t.chart.simpleJson.data["default"] = a, p(t.chart.themeId).then(function () {
                t.$broadcast("dataviz-chart-render")
            })
        }, function (t) {
            console.error(t)
        })
    }), t.$on("dataviz-chart-render-done", function () {
        t.chartRenderCount++, "newChart" == t.chart.id ? t.isSaved = !1 : t.chartRenderCount > 1 && (t.isSaved = !1)
    })
}]);