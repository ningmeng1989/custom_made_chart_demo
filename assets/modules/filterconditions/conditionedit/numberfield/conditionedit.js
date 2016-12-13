/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.filterconditions.numberfieldconditionedit", ["vr.directives.slider"]).factory("numberFieldConditionEditService", ["$http", "$q", function (t, n) {
    return {
        getRange: function (e, i) {
            var o = n.defer();
            return t({
                method: "POST",
                url: charts_server + "/service/filtercondition/numberrange",
                data: angular.toJson({field: e, dataset: i}, !0)
            }).success(function (t) {
                t.error ? o.reject(t) : o.resolve(t)
            }).error(function (t) {
                o.reject(t)
            }), o.promise
        }, getAggregations: function () {
            var e = n.defer();
            return t({method: "GET", url: charts_server + "/service/chartdata/aggregations/all"}).success(function (t) {
                t.error ? e.reject(t) : e.resolve(t)
            }).error(function (t) {
                e.reject(t)
            }), e.promise
        }
    }
}]).controller("numberFieldConditionEditCtrl", ["$scope", "$modalInstance", "condition", "datasetService", "numberFieldConditionEditService", "toaster", function (t, n, e, i, o, a) {
    t.filterCondition = e, t.filterRange = {
        twoWay: {
            max: t.filterCondition.context.range.twoWay.max,
            min: t.filterCondition.context.range.twoWay.min
        },
        atLeast: {min: t.filterCondition.context.range.atLeast.min},
        atMost: {max: t.filterCondition.context.range.atMost.max}
    }, o.getRange(e.field, i.getCurrentDataSet()).then(function (n) {
        t.range = n.object, t.range.min == t.range.max && (t.range.max = t.range.min + 1), t.filterCondition.id ? (t.range.min > t.filterCondition.context.range.twoWay.min && (t.range.min = t.filterCondition.context.range.twoWay.min), t.range.min > t.filterCondition.context.range.atLeast.min && (t.range.min = t.filterCondition.context.range.atLeast.min), t.range.max < t.filterCondition.context.range.twoWay.max && (t.range.max = t.filterCondition.context.range.twoWay.max), t.range.max < t.filterCondition.context.range.atMost.max && (t.range.max = t.filterCondition.context.range.atMost.max)) : (t.filterCondition.context.range.twoWay.min = t.range.min, t.filterCondition.context.range.atLeast.min = t.range.min, t.filterCondition.context.range.twoWay.max = t.range.max, t.filterCondition.context.range.atMost.max = t.range.max)
    }, function (t) {
        a.pop("error", "提示", "最大值最小值加载失败")
    }), o.getAggregations().then(function (n) {
        t.aggregations = n.object
    }, function (t) {
        a.pop("error", "提示", "聚合类型获取失败")
    }), t.$watch("filterCondition.context.sort.number", function (n) {
        "custom" != n && (t.filterCondition.context.sort.count = 0)
    }), t.$watch("filterCondition.context.range.twoWay.max", function (n) {
        t.filterRange.twoWay.max = n
    }), t.$watch("filterCondition.context.range.twoWay.min", function (n) {
        t.filterRange.twoWay.min = n
    }), t.$watch("filterCondition.context.range.atLeast.min", function (n) {
        t.filterRange.atLeast.min = n
    }), t.$watch("filterCondition.context.range.atMost.max", function (n) {
        t.filterRange.atMost.max = n
    }), t.$watch("filterRange.twoWay.max", function (n) {
        t.range && parseInt(n) > t.range.max && (t.range.max = parseInt(n)), t.filterCondition.context.range.twoWay.max = n
    }), t.$watch("filterRange.twoWay.min", function (n) {
        t.range && parseInt(n) < t.range.min && (t.range.min = parseInt(n)), t.filterCondition.context.range.twoWay.min = n
    }), t.$watch("filterRange.atMost.max", function (n) {
        t.range && parseInt(n) > t.range.max && (t.range.max = parseInt(n)), t.filterCondition.context.range.atMost.max = n
    }), t.$watch("filterRange.atLeast.min", function (n) {
        t.range && parseInt(n) < t.range.min && (t.range.min = parseInt(n)), t.filterCondition.context.range.atLeast.min = n
    }), t.isOkBtnDisabled = function () {
        return !!(t.filterCondition.context.sort.active && "custom" == t.filterCondition.context.sort.number && t.filterCondition.context.sort.count < 0)
    }, t.ok = function () {
        n.close(t.filterCondition)
    }, t.cancel = function () {
        n.dismiss("cancel")
    }
}]);