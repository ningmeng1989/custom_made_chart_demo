/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.filterconditions.stringfieldconditionedit", []).factory("stringFieldConditionEditService", ["$http", "$q", function (t, i) {
    return {
        getFieldValus: function (e, n) {
            var o = i.defer();
            return t({
                method: "POST",
                url: charts_server + "/service/filtercondition/stringvalues",
                data: angular.toJson({field: e, dataset: n}, !0)
            }).success(function (t) {
                t.error ? o.reject(t) : o.resolve(t)
            }).error(function (t) {
                o.reject(t)
            }), o.promise
        }
    }
}]).controller("stringFieldConditionEditCtrl", ["$scope", "$modalInstance", "condition", "datasetService", "stringFieldConditionEditService", function (t, i, e, n, o) {
    o.getFieldValus(e.field, n.getCurrentDataSet()).then(function (i) {
        t.allValues = i.object
    }, function (i) {
        t.allValues = []
    }), t.filterCondition = e, t.isSelected = function (i) {
        return t.filterCondition.context.routine.matchValues.indexOf(i) > -1
    }, t.changeValue = function (i) {
        var e = t.filterCondition.context.routine.matchValues.indexOf(i);
        e > -1 ? t.filterCondition.context.routine.matchValues.splice(e, 1) : t.filterCondition.context.routine.matchValues.push(i)
    }, t.checkAll = function (i) {
        i ? t.filterCondition.context.routine.matchValues = angular.copy(t.allValues) : t.filterCondition.context.routine.matchValues = []
    }, t.isOkBtnDisabled = function () {
        if (t.filterCondition.context.routine.active) {
            if (0 == t.filterCondition.context.routine.matchValues.length)return !0
        } else if (t.filterCondition.context.wildcard.active && "isEmpty" != t.filterCondition.context.wildcard.matchType && _.isEmpty(t.filterCondition.context.wildcard.matchValue))return !0;
        return !1
    }, t.$watch("filterCondition.context.wildcard.matchType", function (i, e) {
        "isEmpty" == i && (t.filterCondition.context.wildcard.matchValue = "")
    }), t.ok = function () {
        i.close(t.filterCondition)
    }, t.cancel = function () {
        i.dismiss("cancel")
    }
}]);