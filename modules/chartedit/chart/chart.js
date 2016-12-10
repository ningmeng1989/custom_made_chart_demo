/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit.chart", ["dataviz.chartedit.theme"]).constant("chartConfig", {
    rest: {
        chart: charts_server + "/service/chart/",
        getData: charts_server + "/service/chartdata/calculate/chart/"
    }, id: "xxx"
}).service("chartService", ["$http", "$q", "chartConfig", function ($http, $q, chartConfig) {
    function _saveModel(e) {
        _modelStore[e.id] = e
    }

    function _hasModel(e) {
        !!_modelStore.hasOwnProperty(e)
    }

    function setModel(model, config) {
        var defer = $q.defer(), config = config || chartConfig.rest.chart;
        if (model)defer.resolve(model); else {
            if (_hasModel(config.id))return defer.resolve(getModel(config.id));
            var httpParms = {method: "get", url: config};
            $http(httpParms).then(function (reponse) {
                model = eval(reponse.data), defer.resolve(model)
            }, function (e) {
                defer.reject(e)
            })
        }
        return model && _saveModel(model), defer.promise
    }

    function getModel(e) {
        return e ? _modelStore[e] : _modelStore
    }

    function _delModel(e) {
        delete _modelStore[e]
    }

    function render(e) {
        if (e)getChartsInstance(_modelStore[e]).render(_modelStore[e]); else for (var t in _modelStore)getChartsInstance(_modelStore[t]).render(_modelStore[t])
    }

    function dispose(e) {
        if (e.simpleJson.dom && "" !== e.simpleJson.dom && (chartInstance = getInstance(e.simpleJson), chartInstance.instance)) {
            chartInstance.dispose();
            for (var t in e.simpleJson.data.properties)e.simpleJson.data.properties[t].bind = []
        }
    }

    function getBindData(e, t, r) {
        var n = {
            method: "post",
            url: chartConfig.rest.getData,
            headers: {"X-Date": (new Date).toUTCString()},
            data: {datasetId: e, bindFields: t, conditions: r}
        }, a = $q.defer();
        return $http(n).then(function (e) {
            e.data.error ? a.reject(e.data.error) : a.resolve(e.data.object)
        }, function (e) {
            console.error(e)
        }), a.promise
    }

    function setDecimals(e, t) {
        _.each(t, function (t) {
            if (t.fieldSetting && t.fieldSetting.decimal)for (var r = _.indexOf(e[0], t.name), n = parseInt(t.fieldSetting.decimal.value), a = 1, o = e.length; o > a; a++)e[a][r] = e[a][r].toFixed(n)
        })
    }

    function getInstance(e) {
        if (e.data) {
            var t = {};
            return t.dom = e.dom, t.themeName = e.themeName, t.data = angular.copy(e.data), t.option = angular.copy(e.option), getChartsInstance(t)
        }
    }

    var _modelStore = {}, _bindData = {};
    return {
        setModel: setModel,
        getModel: getModel,
        render: render,
        dispose: dispose,
        getBindData: getBindData,
        setDecimals: setDecimals,
        _delModel: _delModel
    }
}]).controller("chartCtrl", ["chartConfig", function (e) {
    function t(e) {
        e && (e = angular.extend({}, e), angular.extend(s, e))
    }

    function r(e, t) {
        var r = t.find(".chart");
        if (0 === r.length) {
            var n = document.createElement("div");
            n.style.width = "100%", n.style.height = "100%", n.setAttribute("class", "chart"), e.dom = n, t.append(n)
        } else e.dom = r[0];
        return e
    }

    function n(e) {
        return e.id || (e.id = UUID.prototype.createUUID("")), e
    }

    function a(e) {
        if (e.data) {
            var t = {};
            return t.dom = e.dom, t.themeName = e.themeName, t.data = angular.copy(e.data), t.option = angular.copy(e.option), getChartsInstance(t)
        }
    }

    function o(e, require) {
        if (!e || !require)return !1;
        var t = e.data.properties, r = {string: 0, map: 0, time: 0, number: 0};
        for (var n in t)switch (t[n].type[0]) {
            case"string":
                r.string += t[n].bind.length;
                break;
            case"map":
                r.map += t[n].bind.length;
                break;
            case"time":
                r.time += t[n].bind.length;
                break;
            case"number":
                r.number += t[n].bind.length
        }
        for (var n in require)"n" == require[n] ? require[n] = 1 : "m" == require[n] && (require[n] = 2);
        return r.string >= require.string && r.number >= require.number && r.map >= require.map && r.time >= require.time
    }

    function i(e) {
        var t = [];
        for (var r in e)t.push(e[r].bind);
        return _.flatten(t)
    }

    var s = this;
    angular.extend(s, e), s.setOptions = t, s.setDom = r, s.setId = n, s.getInstance = a, s.readyToRender = o, s.getBindFields = i
}]).directive("datavizChart", ["chartService", "$rootScope", "themeService", function (e, t, r) {
    return {
        restrict: "A",
        transclude: !0,
        scope: {config: "=?", chart: "=?"},
        controller: "chartCtrl",
        link: function (n, a, o, i) {
            var s, d, c, l, m, h;
            i.setOptions(n.config), n.$on("dataviz-chart-render", function (t, o, h) {
                c = h ? "-1" == h ? n.chart.themeId : h : n.chart.themeId, i.readyToRender(n.chart.simpleJson, n.chart.dataRequire) ? (l = i.getBindFields(n.chart.simpleJson.data.properties), m = n.chart.simpleJson.data.conditions, 0 == n.chart.simpleJson.data["default"].length ? e.getBindData(n.chart.dataset.id, l, m).then(function (t) {
                    e.setDecimals(t, l), n.chart.simpleJson.data["default"] = t, d = i.setDom(n.chart.simpleJson, a), r.applyThemeToChart(c, n.chart, !0), h && "-1" !== h ? r.removeThemeToDom(n.chart) : r.applyThemeToDom(c, n.chart), s = i.getInstance(d), console.log("render"), s.render(), l = []
                }, function (e) {
                    console.error(e)
                }) : (d = i.setDom(n.chart.simpleJson, a), h && "-1" !== h ? r.removeThemeToDom(n.chart) : r.applyThemeToDom(c, n.chart), s = i.getInstance(d), console.log("render"), s.render(o), n.$emit("dataviz-chart-render-done"))) : s && s.instance && s.dispose()
            }), n.$watch("chart.refresh", function (e, r) {
                e !== r && (h && clearInterval(h), 0 !== e && (h = setInterval(function () {
                    t.$broadcast("dataviz-chart-render", !0)
                }, 1e3 * e)))
            }), n.$on("$destroy", function () {
                s && (s.dispose(), e._delModel(n.chart.id)), clearInterval(h)
            }), n.$on("dataviz-chart-clear", function (e) {
                n.dispose()
            }), n.dispose = function () {
                if (n.chart.simpleJson.dom && "" !== n.chart.simpleJson.dom && (s = i.getInstance(n.chart.simpleJson), s.instance)) {
                    s.dispose();
                    for (var e in n.chart.simpleJson.data.properties)n.chart.simpleJson.data.properties[e].bind = []
                }
            };
            var p = function () {
                _.isEmpty(n.chart) || _.isEmpty(n.chart.simpleJson) || !n.chart.simpleJson.dom.nodeName || (s = i.getInstance(n.chart.simpleJson), s && s.instance && s.resize())
            };
            a.resize(p)
        }
    }
}]);