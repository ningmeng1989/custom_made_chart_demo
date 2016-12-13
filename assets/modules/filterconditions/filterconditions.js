/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.filterconditions", ["app.filterconditions.stringfieldconditionedit", "app.filterconditions.numberfieldconditionedit", "app.filterconditions.datetimefieldconditionedit"]).factory("filterconditionService", [function () {
    return {
        createFilterCondition: function (e) {
            return "string" == e.type ? {
                caption: "",
                field: e,
                context: {
                    routine: {active: !0, matchValues: [], others: !1},
                    wildcard: {active: !1, matchValue: "", matchType: "isEmpty", others: !1}
                }
            } : "number" == e.type ? {
                caption: "",
                field: e,
                context: {
                    range: {
                        active: !0,
                        type: "twoWay",
                        twoWay: {min: -999999999999, max: 999999999999, includeMin: !1, includeMax: !1},
                        atMost: {max: 999999999999, includeMax: !1},
                        atLeast: {min: -999999999999, includeMin: !1},
                        special: {value: "all"},
                        aggregateFilter: "false",
                        aggregation: "sum"
                    },
                    sort: {
                        active: !1,
                        orderType: "asc",
                        number: "custom",
                        count: 0,
                        aggregateFilter: "false",
                        aggregation: "sum"
                    }
                }
            } : "datetime" == e.type ? {
                caption: "",
                field: e,
                context: {
                    type: "relativeTime",
                    relativeTime: {type: "day", item: "current", before: 0, after: 0},
                    rangeTime: {startDateTime: "", endDateTime: ""},
                    startTime: {dateTime: ""},
                    endTime: {dateTime: ""},
                    specialTime: {specialValue: "all"}
                }
            } : void 0
        }
    }
}]).directive("filterconditions", ["$modal", "$rootScope", "filterconditionService", "datasetService", function (e, t, i, n) {
    return {
        restrict: "AE",
        scope: {filterAccept: "@", config: "=", model: "=", refreshData: "&"},
        templateUrl: "modules/filterconditions/filterconditions.html",
        link: function (n, o, a) {
            function r(i) {
                _.isEmpty(i.field.dataSetId) && t.$broadcast("getCurrentDataSet", "");
                var n = "", o = "";
                return "string" == i.field.type ? (n = "modules/filterconditions/conditionedit/stringfield/conditionedit.html", o = "stringFieldConditionEditCtrl") : "number" == i.field.type ? (n = "modules/filterconditions/conditionedit/numberfield/conditionedit.html", o = "numberFieldConditionEditCtrl") : "datetime" == i.field.type && (n = "modules/filterconditions/conditionedit/datetimefield/conditionedit.html", o = "datetimeFieldConditionEditCtrl"), e.open({
                    templateUrl: n,
                    controller: o,
                    backdrop: !1,
                    windowClass: "app-modal-window",
                    resolve: {
                        condition: function () {
                            return angular.copy(i)
                        }
                    }
                })
            }

            function c(e) {
                var t = e.field.name;
                if ("string" == e.field.type) {
                    if (e.context.routine.active) {
                        var i = "";
                        e.context.routine.others && (i = "不"), t += "值" + i + "为[" + e.context.routine.matchValues + "]"
                    } else if (e.context.wildcard.active) {
                        var i = "";
                        e.context.wildcard.others && (i = "不"), "isEmpty" == e.context.wildcard.matchType ? t += "值" + i + "为空" : ("contains" == e.context.wildcard.matchType ? t += i + "包含" : "startWith" == e.context.wildcard.matchType ? t += "开头" + i + "为" : "endWith" == e.context.wildcard.matchType ? t += "结尾" + i + "为" : "equals" == e.context.wildcard.matchType && (t += i + "等于"), t += "'" + e.context.wildcard.matchValue + "'")
                    }
                } else if ("number" == e.field.type)e.context.range.active ? ("true" == e.context.range.aggregateFilter && (t = e.context.range.aggregation + "(" + t + ")"), "twoWay" == e.context.range.type ? (t = e.context.range.twoWay.min + "<" + (e.context.range.twoWay.includeMin ? "=" : "") + t, t = t + "<" + (e.context.range.twoWay.includeMax ? "=" : "") + e.context.range.twoWay.max) : "atMost" == e.context.range.type ? t += "<" + (e.context.range.atMost.includeMax ? "=" : "") + e.context.range.atMost.max : "atLeast" == e.context.range.type ? t += "<" + (e.context.range.atLeast.includeMin ? "=" : "") + e.context.range.atLeast.min : "special" == e.context.range.type && (t += "值为", "isNull" == e.context.range.special.value ? t += "Null值" : "isNotNull" == e.context.range.special.value ? t += "非Null值" : "all" == e.context.range.special.value && (t += "所有值"))) : e.context.sort.active && ("true" == e.context.sort.aggregateFilter && (t = e.context.sort.aggregation + "(" + t + ")"), (e.context.sort.orderType = "asc") ? t += "取前" : (e.context.sort.orderType = "desc") && (t += "取后"), "5" == e.context.sort.number ? t += e.context.sort.number : "10" == e.context.sort.number ? t += e.context.sort.number : "20" == e.context.sort.number ? t += e.context.sort.number : "50" == e.context.sort.number ? t += e.context.sort.number : "100" == e.context.sort.number ? t += e.context.sort.number : "custom" == e.context.sort.number && (t += e.context.sort.count), t += "条"); else if ("datetime" == e.field.type)if ("relativeTime" == e.context.type) {
                    var n = "";
                    "year" == e.context.relativeTime.type ? n = "年" : "quarter" == e.context.relativeTime.type ? n = "季" : "month" == e.context.relativeTime.type ? n = "月" : "week" == e.context.relativeTime.type ? n = "周" : "day" == e.context.relativeTime.type ? n = "天" : "hour" == e.context.relativeTime.type ? n = "时" : "minute" == e.context.relativeTime.type ? n = "分" : "second" == e.context.relativeTime.type && (n = "秒"), "before" == e.context.relativeTime.item ? t += "=前" + e.context.relativeTime.before + n : "current" == e.context.relativeTime.item ? t += "=当前" + n : "after" == e.context.relativeTime.item && (t += "=后" + e.context.relativeTime.after + n)
                } else"rangeTime" == e.context.type ? (t = e.context.rangeTime.startDateTime + "<=" + t, t = t + "<=" + e.context.rangeTime.endDateTime) : "startTime" == e.context.type ? t += ">=" + e.context.startTime.dateTime : "endTime" == e.context.type ? t += "<=" + e.context.endTime.dateTime : "specialTime" == e.context.type && (t += "为", "isNull" == e.context.specialTime.specialValue ? t += "Null值" : "isNotNull" == e.context.specialTime.specialValue ? t += "非Null值" : "all" == e.context.specialTime.specialValue && (t += "所有值"));
                return t
            }

            n.edit = function (e) {
                var t = r(e);
                t.result.then(function (e) {
                    e.caption = c(e);
                    for (var t in n.model)if (n.model[t].id == e.id) {
                        n.model[t] = e, n.refreshData();
                        break
                    }
                }, function (e) {
                    console.log(e)
                })
            }, n.remove = function (e) {
                var t = n.model.indexOf(e);
                t > -1 && (n.model.splice(t, 1), n.refreshData())
            }, n.tagsinputClick = function () {
                var e = $("input", o);
                e.focus()
            }, n.inputKeydown = function (e) {
                8 != e.keyCode && 46 != e.keyCode || n.model.length > 0 && (n.model.splice(n.model.length - 1, 1), n.refreshData())
            }, n.ondrop = function (e) {
                var t = e.getData().field || e.getData(), o = i.createFilterCondition(t), a = r(o);
                a.result.then(function (e) {
                    e.caption = c(e), e.id = Math.uuid(), n.model.push(e), n.refreshData()
                }, function (e) {
                    console.log(e)
                })
            };
            var l = [];
            l.push(n.$on("updateComputeItem", function (e, t) {
                for (var i in n.model)if (n.model[i].field.id == t.id) {
                    n.model[i].field.type != t.fieldRole ? (n.model.splice(i, 1), n.refreshData()) : n.model[i].field.name != t.name && (n.model[i].field.name = t.name, n.model[i].caption = c(n.model[i]));
                    break
                }
            })), l.push(n.$on("deleteColumn", function (e, t) {
                for (var i in n.model)if (n.model[i].field.id == t.id) {
                    n.model.splice(i, 1), n.refreshData();
                    break
                }
            })), n.$on("$destroy", function () {
                angular.forEach(l, function (e) {
                    e()
                })
            })
        }
    }
}]);