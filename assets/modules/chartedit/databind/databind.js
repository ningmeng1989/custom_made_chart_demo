/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit.databind", ["common.dvDropdown"]).constant("databindConfig", {
    config: {
        rest: {
            databind: charts_server + "/service/chartedit/databind/",
            aggregation: charts_server + "/service/chartdata/aggregations/all/"
        }
    },
    model: {
        value: {
            name: "数值轴",
            type: ["number"],
            isMore: !0,
            bind: [{
                name: "蒸发量",
                fieldSetting: {
                    aggregation: {name: "总计", formula: "sum"},
                    sort: "asc",
                    decimal: {},
                    prefix: null,
                    suffix: null,
                    delimiter: !1,
                    percentage: !1
                },
                chartType: "bar",
                "default": []
            }, {
                name: "降水量",
                fieldSetting: {
                    aggregation: {name: "总计", formula: "sum"},
                    sort: "desc",
                    decimal: {},
                    prefix: null,
                    suffix: null,
                    delimiter: !1,
                    percentage: !1
                },
                chartType: "bar",
                "default": []
            }]
        },
        xAxis: {
            name: "分类轴",
            type: ["string"],
            isMore: !1,
            bind: [{name: "数据轴", aggregation: {name: "总计", formula: "sum"}, chartType: "bar", "default": []}]
        }
    },
    fields: [{field: "分类1", type: "string"}],
    aggregations: [{name: "总计", formula: "sum"}]
}).service("databindService", ["$http", "$q", "databindConfig", function (e, i, t) {
    function n(n, r) {
        var d, g = i.defer();
        return d = r && r.rest ? r.rest.aggregation : t.config.rest.aggregation, n ? (a = n, g.resolve(n)) : e({
            method: "get",
            url: d
        }).then(function (e) {
            e.data.error ? g.reject(e.data.error) : (a = e.data.object, g.resolve(e.data.object))
        }, function (e) {
            g.reject(e)
        }), g.promise
    }

    var a;
    return {setAggregations: n}
}]).controller("databindCtrl", ["databindConfig", function (e) {
    function i(e) {
        e && (e = angular.extend({}, e), angular.extend(a, e))
    }

    function t(e) {
        var i = [], t = [], n = ["string", "String", "map", "Map", "time", "Time"], a = ["number", "Number"];
        return _.each(e, function (e) {
            -1 !== _.indexOf(n, e.type) ? i.push(e.name) : -1 !== _.indexOf(a, e.type) && t.push(e.name)
        }), {dimensions: i, measures: t}
    }

    function n(e) {
        var i = [];
        for (var t in e)i.push(e[t].bind);
        return _.flatten(i)
    }

    var a = this;
    angular.extend(a, e), a.setOptions = i, a.dimensionOrMeasure = t, a.getBindFields = n
}]).directive("datavizCharteditDatabind", ["$rootScope", "databindService", function (e, i) {
    return {
        restrict: "AE",
        scope: {config: "=?", chart: "=", dataset: "=?", aggregations: "=?"},
        controller: "databindCtrl",
        templateUrl: "modules/chartedit/databind/databind.html",
        link: function (e, t, n, a) {
            e.accept = ".dataviz-field-draggable", e.fieldSetting = {}, e.tempFieldSetting, e.dimensions = [], e.decimals = [{value: "0"}, {value: "1"}, {value: "2"}, {value: "3"}, {value: "4"}, {value: "5"}], e.fieldSetting = {}, e.fieldSetting.aggregation, e.fieldSetting.sort, e.fieldSetting.decimal, e.fieldSetting.prefix, e.fieldSetting.suffix, e.fieldSetting.delimiter, e.fieldSetting.percentage, e.dimensionFieldSetting = {}, e.dimensionFieldSetting.aggregation, e.dimensionFieldSetting.sort, i.setAggregations(e.aggregations).then(function (i) {
                e.aggregations = i
            }), a.setOptions(e.config), e.isDimension = function (i) {
                return -1 !== _.indexOf(e.dimensions, i)
            }, e.addField = function (i, t, n) {
                var r = {}, d = e.chart.simpleJson.data.properties;
                "number" == n && "number" == d[i].type[0] ? (r.fieldSetting = {}, r.fieldSetting.aggregation = _.findWhere(e.aggregations, {formula: "sum"}), r.name = t + "（" + r.fieldSetting.aggregation.name + "）", e.fieldSetting.aggregation = r.fieldSetting.aggregation) : "number" != n && "number" == d[i].type[0] ? (r.fieldSetting = {}, r.fieldSetting.aggregation = _.findWhere(e.aggregations, {formula: "count"}), r.name = t + "（" + r.fieldSetting.aggregation.name + "）", e.dimensionFieldSetting.aggregation = r.fieldSetting.aggregation) : r.name = t, r.fieldName = t, d[i].bind.push(r), e.$emit("getBindData", a.getBindFields(d))
            }, e.removeField = function (i, t) {
                for (var n = e.chart.simpleJson.data.properties, r = n[i].bind, d = 0, g = r.length; g > d; d++)if (r[d].name === t) {
                    r.splice(d, 1);
                    break
                }
                e.$emit("getBindData", a.getBindFields(n))
            }, e.dragStart = function (e, i) {
                e.setData("name", i.name), e.setData("key", i.key), e.setData("type", i.type)
            }, e.dragEnter = function (e) {
                $(e.target).children().css({"border-top": "1px solid #33deb1"})
            }, e.dragLeave = function (e) {
                $(e.target).children().css({"border-top": "1px solid transparent"})
            }, e.dragDropSelf = function (i, t) {
                var n, r, d, g, o = i.getData(), l = e.chart.simpleJson.data.properties, s = l[t.key].bind;
                if ($(i.target).children().css({"border-top": "1px solid transparent"}), o.name != t.name && o.type[0] == t.type[0]) {
                    for (var m = 0, c = s.length; c > m; m++)s[m].name == o.name ? (d = m, g = s[m]) : s[m].name == t.name && (n = m, r = s[m]);
                    s.splice(d, 1), s.splice(n, 0, g), e.$emit("getBindData", a.getBindFields(l))
                }
            }, e.dragDrop = function (i, t) {
                var n = i.getData(), r = e.chart.simpleJson.data.properties, d = {};
                "number" == n.type && "number" == t.type[0] ? (d.fieldSetting = {}, d.fieldSetting.aggregation = _.findWhere(e.aggregations, {formula: "sum"}), d.name = n.name + "（" + d.fieldSetting.aggregation.name + "）", e.fieldSetting.aggregation = d.fieldSetting.aggregation) : "number" != n.type && "number" == t.type[0] ? (d.fieldSetting = {}, d.fieldSetting.aggregation = _.findWhere(e.aggregations, {formula: "count"}), d.name = n.name + "（" + d.fieldSetting.aggregation.name + "）", e.dimensionFieldSetting.aggregation = d.fieldSetting.aggregation) : d.name = n.name, d.fieldName = n.name, r[t.key].bind.push(d), e.$emit("getBindData", a.getBindFields(r))
            }, e.openFieldSetting = function (i) {
                e.tempFieldSetting = angular.copy(i), $(".slimScrollDiv").css({overflow: "visible"}), $("[databind-scroll]").css({overflow: "visible"})
            }, e.openPlus = function () {
                $(".slimScrollDiv").css({overflow: "visible"}), $("[databind-scroll]").css({overflow: "visible"})
            }, e.confirm = function (i) {
                var t = e.isDimension(i.fieldName), n = t ? e.dimensionFieldSetting : e.fieldSetting;
                i.fieldSetting = n, i.name = i.fieldName + "（" + n.aggregation.name + "）", e.$emit("getBindData", a.getBindFields(e.chart.simpleJson.data.properties)), $(".slimScrollDiv").css({overflow: "hidden"}), $("[databind-scroll]").css({overflow: "hidden"})
            }, e.cancel = function () {
                e.fieldSetting = e.tempFieldSetting, e.fieldSetting.aggregation = _.findWhere(e.aggregations, {name: e.tempFieldSetting.aggregation.name}), e.tempFieldSetting.decimal && (e.fieldSetting.decimal = _.findWhere(e.decimals, {value: e.tempFieldSetting.decimal.value})), $(".slimScrollDiv").css({overflow: "hidden"}), $("[databind-scroll]").css({overflow: "hidden"})
            }, e.$on("dataviz-databind-init", function (i) {
                var t = [];
                e.dataOption = e.chart.simpleJson.data.properties, e.fieldTypes = e.dataset.fields, !!e.fieldTypes.dimensions.string && (t = t.concat(e.fieldTypes.dimensions.string)), !!e.fieldTypes.dimensions.time && (t = t.concat(e.fieldTypes.dimensions.time)), !!e.fieldTypes.dimensions.map && (t = t.concat(e.fieldTypes.dimensions.map)), e.dimensions = _.pluck(t, "name")
            }), e.$on("$destroy", function () {
            })
        }
    }
}]).directive("databindScroll", ["$timeout", function (e) {
    return {
        restrict: "A", link: function (i, t) {
            i.scrollHeight = {height: .6 * $(".ce-container-fl").height() - 40}, t.slimScroll({destroy: !0}), t.slimscroll(i.scrollHeight), $(window).resize(function () {
                e(function () {
                    i.scrollHeight = {height: .6 * $(".ce-container-fl").height() - 40}, $(t).css("height", i.scrollHeight.height), t.slimScroll({destroy: !0}), t.slimscroll(i.scrollHeight)
                }, 0)
            })
        }
    }
}]);