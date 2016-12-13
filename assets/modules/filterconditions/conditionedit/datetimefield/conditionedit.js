/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.filterconditions.datetimefieldconditionedit", []).factory("datetimeFieldConditionEditService", ["$http", "$q", function (e, t) {
    var i = [{id: "year", name: "年"}, {id: "quarter", name: "季"}, {id: "month", name: "月"}, {
        id: "week",
        name: "周"
    }, {id: "day", name: "天"}, {id: "hour", name: "时"}, {id: "minute", name: "分"}, {id: "second", name: "秒"}];
    return {
        getRelativeTypes: function () {
            return i
        }, getRange: function (i, n) {
            var a = t.defer();
            return e({
                method: "POST",
                url: charts_server + "/service/filtercondition/daterange",
                data: angular.toJson({field: i, dataset: n}, !0)
            }).success(function (e) {
                e.error ? a.reject(e) : a.resolve(e)
            }).error(function (e) {
                a.reject(e)
            }), a.promise
        }
    }
}]).controller("datetimeFieldConditionEditCtrl", ["$scope", "$modalInstance", "condition", "datasetService", "datetimeFieldConditionEditService", function (e, t, i, n, a) {
    function r(e, t) {
        var i = "";
        if (angular.isDate(e)) {
            var n = e.getFullYear(), a = e.getMonth() + 1, r = e.getDate();
            a >= 1 && 9 >= a && (a = "0" + a), r >= 0 && 9 >= r && (r = "0" + r), i = n + "-" + a + "-" + r
        } else i = e;
        var m = t.getHours(), o = t.getMinutes(), d = t.getSeconds();
        return m >= 0 && 9 >= m && (m = "0" + m), o >= 0 && 9 >= o && (o = "0" + o), d >= 0 && 9 >= d && (d = "0" + d), i += " " + m + ":" + o + ":" + d
    }

    e.relativeTypes = a.getRelativeTypes(), e.filterCondition = i, e.rangeTime = {
        initStartDate: "",
        initEndDate: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
    }, e.startTime = {initDate: "", date: "", time: ""}, e.endTime = {
        initDate: "",
        date: "",
        time: ""
    }, a.getRange(i.field, n.getCurrentDataSet()).then(function (t) {
        e.range = t.object, _.isEmpty(e.filterCondition.context.rangeTime.startDateTime) ? (e.rangeTime.startDate = e.rangeTime.initStartDate = e.range.min.split(" ")[0], e.rangeTime.startTime = new Date(e.range.min)) : (e.rangeTime.startDate = e.rangeTime.initStartDate = e.filterCondition.context.rangeTime.startDateTime.split(" ")[0], e.rangeTime.startTime = new Date(e.filterCondition.context.rangeTime.startDateTime)), _.isEmpty(e.filterCondition.context.rangeTime.endDateTime) ? (e.rangeTime.endDate = e.rangeTime.initEndDate = e.range.max.split(" ")[0], e.rangeTime.endTime = new Date(e.range.max)) : (e.rangeTime.endDate = e.rangeTime.initEndDate = e.filterCondition.context.rangeTime.endDateTime.split(" ")[0], e.rangeTime.endTime = new Date(e.filterCondition.context.rangeTime.endDateTime)), _.isEmpty(e.filterCondition.context.startTime.dateTime) ? (e.startTime.date = e.startTime.initDate = e.range.min.split(" ")[0], e.startTime.time = new Date(e.range.min)) : (e.startTime.date = e.startTime.initDate = e.filterCondition.context.startTime.dateTime.split(" ")[0], e.startTime.time = new Date(e.filterCondition.context.startTime.dateTime)), _.isEmpty(e.filterCondition.context.endTime.dateTime) ? (e.endTime.date = e.endTime.initDate = e.range.max.split(" ")[0], e.endTime.time = new Date(e.range.max)) : (e.endTime.date = e.endTime.initDate = e.filterCondition.context.endTime.dateTime.split(" ")[0], e.endTime.time = new Date(e.filterCondition.context.endTime.dateTime))
    }, function (e) {
        toaster.pop("error", "提示", "最大日期最小日期加载失败")
    }), e.$watch("filterCondition.context.relativeTime.type", function (t, i) {
        for (var n in e.relativeTypes)if (t == e.relativeTypes[n].id) {
            e.currentType = e.relativeTypes[n];
            break
        }
    }), e.opened = {startDate: !1, endDate: !1}, e.startOpen = function (t) {
        t.preventDefault(), t.stopPropagation(), e.opened.startDate = !0
    }, e.endOpen = function (t) {
        t.preventDefault(), t.stopPropagation(), e.opened.endDate = !0
    }, e.dateOptions = {formatYear: "yyyy", startingDay: 0, "class": "datepicker"}, e.isOkBtnDisabled = function () {
        if ("relativeTime" == e.filterCondition.context.type); else if ("rangeTime" == e.filterCondition.context.type) {
            if (!angular.isDate(e.rangeTime.startDate) && e.rangeTime.initStartDate != e.rangeTime.startDate || !angular.isDate(e.rangeTime.startTime))return !0;
            if (!angular.isDate(e.rangeTime.endDate) && e.rangeTime.initEndDate != e.rangeTime.endDate || !angular.isDate(e.rangeTime.endTime))return !0;
            e.filterCondition.context.rangeTime.startDateTime = r(e.rangeTime.startDate, e.rangeTime.startTime), e.filterCondition.context.rangeTime.endDateTime = r(e.rangeTime.endDate, e.rangeTime.endTime)
        } else if ("startTime" == e.filterCondition.context.type) {
            if (!angular.isDate(e.startTime.date) && e.startTime.initDate != e.startTime.date || !angular.isDate(e.startTime.time))return !0;
            e.filterCondition.context.startTime.dateTime = r(e.startTime.date, e.startTime.time)
        } else if ("endTime" == e.filterCondition.context.type) {
            if (!angular.isDate(e.endTime.date) && e.endTime.initDate != e.endTime.date || !angular.isDate(e.endTime.time))return !0;
            e.filterCondition.context.endTime.dateTime = r(e.endTime.date, e.endTime.time)
        }
        return !1
    }, e.ok = function () {
        t.close(e.filterCondition)
    }, e.cancel = function () {
        t.dismiss("cancel")
    }
}]);