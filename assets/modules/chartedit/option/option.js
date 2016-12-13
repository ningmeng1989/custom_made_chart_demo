/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit.option", ["dataviz.chartedit.chartselect"]).constant("chartOptionConfig", {rest: charts_server + "/service/chartInstance/{id}/"}).controller("chartOptionCtrl", ["chartOptionConfig", function (i) {
    function t(i) {
        i && (i = angular.extend({}, i), angular.extend(e, i))
    }

    var e = this;
    angular.extend(e, i), e.setOptions = t
}]).directive("datavizCharteditOption", ["chartSelectService", function (i) {
    return {
        restrict: "AE",
        scope: {config: "=", chart: "=", instant: "@?"},
        controller: "chartOptionCtrl",
        templateUrl: "modules/chartedit/option/option.html",
        link: function (t, e, n, o) {
            function r() {
                a ? i.getChartById(t.chart.compId, i.jsonType.simpleJson).then(function (i) {
                    t.uiProps = angular.copy(i.simpleJson.option.properties)
                }, function (i) {
                    console.error(i)
                }) : i.updateUiJson(t.chart).then(function (i) {
                    t.uiProps = i
                })
            }

            var a = !1, p = !1;
            t.config && o.setOptions(t.config), t.$watch("uiProps", function (e, n) {
                n && e !== n && (t.chart.simpleJson.option = i.metaJsonToSimpleJson(e), a ? a = !1 : p ? p = !1 : t.$emit("dataviz-option-changed"))
            }, !0), "true" === t.instant && r(), t.$on("dataviz-option-init", function (i, t) {
                a = !!t, r()
            }), t.$on("dataviz-option-update", function () {
                i.updateUiJson(t.chart).then(function (i) {
                    p = !0, t.uiProps = i
                })
            })
        }
    }
}]).directive("datavizUiRecursion", ["$compile", function (i) {
    return {
        restrict: "AE", scope: {value: "="}, replace: !0, link: function (t, e) {
            function n(o, r, a) {
                if (o.properties) {
                    var p = i(r)(t);
                    e.append(p);
                    for (var s in o.properties)if (o.properties[s].properties && o.properties[s].isShow) {
                        var c = a + ".properties." + s;
                        n(o.properties[s], "<div dataviz-option-ui inside-value='" + c + "'></div>", c)
                    }
                } else {
                    if (!o.items || !o.items.anyOf)return;
                    _.each(o.items.anyOf, function (r, p) {
                        var s = a + ".items.anyOf[" + p + "]", c = "<div dataviz-option-ui inside-value='" + s + "'></div>", u = i(c)(t);
                        e.append(u);
                        for (var d in o.items.anyOf[p].properties)if (o.items.anyOf[p].properties[d].properties && o.items.anyOf[p].properties[d].isShow) {
                            var v = s + ".properties." + d;
                            n(o.items.anyOf[p].properties[d], "<div dataviz-option-ui inside-value='" + v + "'></div>", v)
                        }
                    })
                }
            }

            var o = "value", r = "<div dataviz-option-ui inside-value='" + o + "'></div>";
            t.$watch("value", function (i) {
                e.empty(), o = "value", r = "<div dataviz-option-ui inside-value='" + o + "'></div>", n(i, r, o)
            }), t.$on("$destroy", function () {
            })
        }
    }
}]).directive("datavizOptionUi", [function () {
    return {
        restrict: "AE",
        scope: {insideValue: "="},
        templateUrl: "modules/chartedit/option/optiontpl.html",
        link: function (i) {
            i.$on("$destroy", function () {
            })
        }
    }
}]);