/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit.chartselect", []).constant("chartSelectConfig", {
    config: {
        chartLibraryRest: charts_server + "/service/chartcomponents/info/all/",
        chartSimpleJsonRest: charts_server + "/service/chartcomponent/simplejson/",
        chartMetaJsonRest: charts_server + "/service/chartcomponent/metajson/"
    }
}).service("chartSelectService", ["$http", "$q", "chartSelectConfig", "charteditConfig", function (e, r, t, i) {
    function n(i, n) {
        var o = r.defer(), s = n || t.config.chartLibraryRest;
        return i ? (u = i, o.resolve(i)) : u && 1 !== u.length ? o.resolve(u) : e({
            method: "get",
            url: s
        }).then(function (e) {
            e.data.error ? o.reject(e.data.error) : (u = e.data.object, o.resolve(u))
        }, function (e) {
            o.reject(e)
        }), o.promise
    }

    function o(i, o, a) {
        var p, c = r.defer();
        p = o == y.simpleJson ? a || t.config.chartSimpleJsonRest : a || t.config.chartMetaJsonRest;
        var m = s(i, o);
        if (m)c.resolve(m); else {
            var l = {method: "get", url: p + i};
            if (u) {
                var h = _.findWhere(u, {compId: i});
                e(l).then(function (e) {
                    _.isEmpty(e.data) ? c.reject(e.data) : (o == y.simpleJson ? h.simpleJson = e.data : h.metaJson = e.data, d[o][i] = h, c.resolve(h))
                }, function (e) {
                    c.reject(e)
                })
            } else n().then(function (r) {
                var t = _.findWhere(r, {compId: i});
                e(l).then(function (e) {
                    _.isEmpty(e.data) ? c.reject(e.data) : (o == y.simpleJson ? t.simpleJson = e.data : t.metaJson = e.data, d[o][i] = t, c.resolve(t))
                }, function (e) {
                    c.reject(e)
                })
            })
        }
        return c.promise
    }

    function s(e, r) {
        return d[r] ? d[r][e] : void 0
    }

    function a(e) {
        var r = {};
        r.string = 0, r.time = 0, r.map = 0, r.number = 0;
        for (var t in e)switch (e[t].type[0]) {
            case"string":
                r.string += e[t].bind.length;
                break;
            case"map":
                r.map += e[t].bind.length;
                break;
            case"time":
                r.time += e[t].bind.length;
                break;
            case"number":
                r.number += e[t].bind.length
        }
        return r
    }

    function p(e, r) {
        var t = JSON.parse(e.dataRequire), i = 0;
        for (var n in v)if ("0" != t[n])if (t[n] == r[n])i += 8; else if (t[n] == g && r[n] > 0)i += 6; else {
            if (t[n] == g && 0 == r[n])return 0;
            if (t[n] == J && r[n] > 1)i += 6; else {
                if (t[n] == J && r[n] <= 1)return 0;
                if (t[n] < r[n])i += 4; else if (t[n] > r[n])return 0
            }
        }
        return i
    }

    function c(e, r) {
        var t = [];
        return r[v.number] <= 0 || (t = _.chain(e).map(function (e) {
            return [e.compId, p(e, r)]
        }).filter(function (e) {
            return e[1] > 0
        }).sortBy("1").pluck("0").value().reverse()), t
    }

    function m(e) {
        return l(e)
    }

    function l(e) {
        var r = {};
        for (var t in e)if ("Array" === e[t].type[0])if (r[t] = [], e[t].items && e[t].items.anyOf) {
            var i = l(e[t].items.anyOf);
            for (var n in i)i[n][0] ? r[t].push(i[n][0]) : r[t].push(i[n])
        } else if (e[t].items)r[t].push(l(e[t].items.properties)); else if (e[t].properties)r[t].push(l(e[t].properties)); else {
            var o = e[t]["default"];
            if (o)for (var s in o)r[t].push(o[s])
        } else e[t].properties ? r[t] = l(e[t].properties) : r[t] = e[t]["default"];
        return r
    }

    function h(e, r) {
        var t = {};
        for (var i in e)_.isArray(e[i]) && 0 !== e[i].length ? "series" === i || "dataZoom" === i || "visualMap" === i ? (t[i] = {}, t[i].name = r.properties[i].name, t[i].type = r.properties[i].type, t[i].isShow = r.properties[i].isShow, t[i].items = {}, t[i].items.anyOf = [], _.each(e[i], function (e, n) {
            var o = {};
            o.name = r.properties[i].name, o.type = r.properties[i].type, o.isShow = r.properties[i].isShow, o.properties = h(e, r.properties[i].items.anyOf[n]), t[i].items.anyOf.push(o)
        })) : "xAxis" === i || "yAxis" === i ? (t[i] = {}, t[i].name = r.properties[i].name, t[i].type = r.properties[i].type, t[i].isShow = r.properties[i].isShow, _.each(e[i], function (e, n) {
            if (r.properties[i].items && r.properties[i].items.anyOf) {
                t[i].items = {}, t[i].items.anyOf = [];
                var o = {};
                o.name = r.properties[i].name, o.type = r.properties[i].type, o.isShow = r.properties[i].isShow, o.properties = h(e, r.properties[i].items.anyOf[n]), t[i].items.anyOf.push(o)
            } else r.properties[i].properties && (t[i].properties = h(e, r.properties[i]))
        })) : "radius" === i ? (t[i] = {}, t[i].name = r.properties[i].name, t[i].type = r.properties[i].type, t[i].isShow = r.properties[i].isShow, t[i]["default"] = e[i]) : "symbolSize" === i && (t[i] = {}, t[i].name = r.properties[i].name, t[i].type = r.properties[i].type, t[i].isShow = r.properties[i].isShow, t[i]["default"] = e[i]) : _.isObject(e[i]) ? (t[i] = {}, r.properties[i] && (t[i].name = r.properties[i].name, t[i].type = r.properties[i].type, t[i].isShow = r.properties[i].isShow, t[i].properties = h(e[i], r.properties[i]))) : (t[i] = {}, r.properties[i] && (t[i].name = r.properties[i].name, r.properties[i].items && (t[i].items = r.properties[i].items), t[i].type = r.properties[i].type, t[i].isShow = r.properties[i].isShow, t[i]["default"] = e[i]));
        return t
    }

    function f(e) {
        var t = r.defer();
        return o(e.compId, y.simpleJson).then(function (r) {
            t.resolve(h(e.simpleJson.option, r.simpleJson.option))
        }), t.promise
    }

    var u, d = {}, y = {simpleJson: 0, metaJson: 1}, v = {
        string: "string",
        time: "time",
        map: "map",
        number: "number"
    }, g = "n", J = "m";
    return d[y.simpleJson] = {}, d[y.metaJson] = {}, {
        getChartLibrary: n,
        getChartById: o,
        jsonType: y,
        getCounts: a,
        recommend: c,
        metaJsonToSimpleJson: m,
        updateUiJson: f
    }
}]).directive("datavizCharteditChartselect", ["chartSelectService", "toaster", "chartService", function (e, r, t) {
    return {
        restrict: "AE",
        scope: {config: "=?config", library: "=?library", chart: "=?chart"},
        templateUrl: "modules/chartedit/select/select.html",
        link: function (i) {
            i.chart, i.recommendChart, e.getChartLibrary(i.library, i.config).then(function (e) {
                i.library = e, i.groupLibrary = _.groupBy(e, function (e) {
                    return e.category
                }), i.recommendChart = _.pluck(e, "compId")
            }, function (e) {
                r.pop("error", "", "图表组件库请求失败")
            }), i.select = function (r, n) {
                n || t.dispose(i.chart), e.getChartById(r, e.jsonType.simpleJson, i.config).then(function (r) {
                    i.chart.compId = r.compId, i.chart.dataRequire = JSON.parse(r.dataRequire), i.chart.themeType = r.themeType, n || (i.chart.simpleJson.option = e.metaJsonToSimpleJson(r.simpleJson.option.properties), i.chart.simpleJson.data = JSON.parse(JSON.stringify(r.simpleJson.data)), i.chart.simpleJson.dom = r.simpleJson.dom, i.$emit("dataviz-select-changed"))
                })
            }, i.inRecommend = function (e) {
                return -1 !== _.indexOf(i.recommendChart, e)
            }, i.$on("dataviz-select-init", function (e, r, t) {
                i.select(r || "0", t)
            }), i.$on("dataviz-select-recommend", function () {
                var r = e.getCounts(i.chart.simpleJson.data.properties);
                i.recommendChart = e.recommend(i.library, r)
            }), i.$on("dataviz-recommend-init", function () {
                i.recommendChart = _.pluck(i.library, "compId")
            })
        }
    }
}]).directive("charteditScroll", ["$timeout", function (e) {
    return {
        restrict: "A", link: function (r, t) {
            e(function () {
                r.scrollHeight = {height: $(".ce-container-fr").height() - 120}, t.slimScroll({destroy: !0}), t.slimscroll(r.scrollHeight)
            }, 0), $(window).resize(function () {
                e(function () {
                    r.scrollHeight = {height: $(".ce-container-fr").height() - 120}, t.slimScroll({destroy: !0}), t.slimscroll(r.scrollHeight)
                }, 0)
            })
        }
    }
}]);