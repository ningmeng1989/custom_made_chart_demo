/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit").service("chartEditService", ["$http", "$q", "charteditConfig", "chartSelectService", function (t, e, r, a) {
    function n(a) {
        var n = e.defer(), o = {method: "get", url: r.rest.chart + "/" + a};
        return t(o).then(function (t) {
            t.data.error ? n.reject(t.data.error) : n.resolve(t.data.object)
        }, function (t) {
            console.error(t)
        }), n.promise
    }

    function o(a, n) {
        var o = e.defer(), c = {method: "get", url: r.rest.datasets + "/" + a};
        return t(c).then(function (t) {
            t.data.error ? o.reject(t.data.error) : o.resolve(t.data.object)
        }, function (t) {
            console.error(t)
        }), o.promise
    }

    function c(a) {
        var n = e.defer(), o = {method: "put", url: r.rest.dataset, data: a};
        return t(o).then(function (t) {
            t.data.error ? n.reject(t.data.error) : n.resolve(t.data.object)
        }, function (t) {
            console.error(t)
        }), n.promise
    }

    function i(a) {
        var n = e.defer(), o = {method: "get", url: r.rest.dataset + a};
        return t(o).then(function (t) {
            t.data.error ? n.reject(t.data.error) : n.resolve(t.data.object)
        }, function (t) {
            console.error(t)
        }), n.promise
    }

    function s(a, n, o) {
        var c = e.defer(), i = {
            method: "post",
            url: r.rest.chartData,
            headers: {"X-Date": (new Date).toUTCString()},
            data: {datasetId: a, bindFields: n, conditions: o}
        };
        return r.chartData.getChartDataByRest ? t(i).then(function (t) {
            t.data.error ? c.reject(t.data.error) : c.resolve(t.data.object)
        }, function (t) {
            console.error(t)
        }) : r.chartData.getBindData ? c.resolve(r.chartData.getBindData()) : c.reject("chartData.getBindData is undefined !"), c.promise
    }

    function d(a) {
        var n = {}, o = e.defer();
        return "newChart" == a.id ? n.method = "post" : n.method = "put", n.url = r.rest.chart, n.data = a, t(n).then(function (t) {
            t.data.error ? o.reject(t.data.error) : o.resolve(t.data.object)
        }, function (t) {
            console.error(t)
        }), o.promise
    }

    function l(t, e) {
        _.each(e, function (e) {
            if (e.fieldSetting && e.fieldSetting.decimal)for (var r = _.indexOf(t[0], e.name), a = parseInt(e.fieldSetting.decimal.value), n = 1, o = t.length; o > n; n++)t[n][r] = t[n][r].toFixed(a)
        })
    }

    function u(t, e) {
        html2canvas(t, h).then(function (t) {
            !!e && e(t.toDataURL("image/png").substring(22))
        }, function (t) {
            toaster.pop("error", "", "保存图表截图失败")
        })
    }

    function f(t, e) {
        var r, a = t, n = a.children("svg").length, o = _.after(n, u);
        if (n && (r = a.find("> svg")).length)r.each(function (r, a) {
            var n = (new XMLSerializer).serializeToString(a);
            n = n.replace(/[^\s<]*xmlns[^\s>]+/g, "");
            var c = document.createElement("canvas");
            c.style.position = "absolute", c.style.left = a.style.left, c.style.top = a.style.top, canvg(c, n, {renderCallback: o(t, e)})
        }); else if (a.attr("_echarts_instance_")) {
            var c = echarts.getInstanceById(a.attr("_echarts_instance_")), i = c.getDataURL("png").substring(22);
            e && e(i)
        } else o(t, e)
    }

    return {
        getChart: n,
        getDataSetList: o,
        saveDataset: c,
        getBindData: s,
        saveChart: d,
        getDataset: i,
        setDecimals: l,
        chartShot: f
    };
    var h
}]);