/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("common.utils.service", []).factory("userDataService", function () {
    function r(r, a) {
        var e = [], t = "行标题", n = "列标题", h = "数据值";
        if (angular.isArray(r)) {
            if (r[0] && "undefined" != typeof r[0][0])if (a)for (var c = 1, o = r.length; o > c; c++)for (var s = 1, u = r[0].length; u > s; s++) {
                var i = {};
                i[n] = r[0][s], i[t] = r[c][0], i[h] = r[c][s], e.push(i)
            } else for (var c = 1, o = r.length; o > c; c++) {
                for (var i = {}, s = 0, u = r[0].length; u > s; s++)i[r[0][s]] = r[c][s];
                e.push(i)
            } else e = r;
            return e
        }
    }

    function a(r, a) {
        var e = [];
        if (a) {
            e.push(["列标题", "行标题", "数据值"]);
            for (var t = 1, n = r.length; n > t; t++)for (var h = 1, c = r[0].length; c > h; h++) {
                var o = [];
                "" !== r[t][h] && (o.push(r[0][h]), o.push(r[t][0]), o.push(r[t][h]), e.push(o))
            }
            a = 0
        } else {
            var s, u, i = 1, f = 1, C = [], d = [];
            e[i] = [], e[0] = [], e[0][0] = "";
            for (var t = 1, n = r.length; n > t; t++)for (var h = 0, c = r[0].length; c > h; h++)0 == h ? void 0 == e[0][f] ? (e[0][f] = r[t][h]) && d.push(r[t][h]) : -1 != (u = _.indexOf(d, r[t][h])) ? f = u + 1 : ++f && (e[0][f] = r[t][h]) && d.push(r[t][h]) : 1 == h ? void 0 == e[i][0] ? (e[i][0] = r[t][h]) && C.push(r[t][h]) : -1 != (s = _.indexOf(C, r[t][h])) ? i = s + 1 : ++i && (e[i] = []) && (e[i][0] = r[t][h]) && C.push(r[t][h]) : e[i][f] = r[t][h];
            a = 1
        }
        return {newData: e, dataCrosstab: a}
    }

    return {array2json: r, cross2list: a}
}).factory("chartCodeCache", function () {
    var r = d3.map();
    return r
}).factory("chartCleanManager", ["$rootScope", "$interval", function (r, a) {
    function e() {
        r.ChartCache = r.ChartCache || [];
        for (var a = r.ChartCache.length - 1; a >= 0; a--)document.getElementById(r.ChartCache[a].domId) || (window.echarts.getInstanceById(r.ChartCache[a].echartId) && window.echarts.getInstanceById(r.ChartCache[a].echartId).dispose(), r.ChartCache.splice(a, 1))
    }

    a(function () {
        e()
    }, 3e4);
    return {
        storeChart: function (a, e) {
            r.ChartCache = r.ChartCache || [];
            var t = e[0].getAttribute("_echarts_instance_");
            t && r.ChartCache.push({domId: a, echartId: t})
        }
    }
}]);