/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartRecommend", []).factory("recommendService", ["$q", "chartSelectService", function (e, r) {
    function n(e, r) {
        var n = e.dataRequire, i = 0;
        if (n.dimension == r[u.dimension])i += 8; else if (n.dimension == t)i += 5; else {
            if (!(n.dimension < r[u.dimension]))return 0;
            i += 2
        }
        if (n.measure == r[u.measure])i += 5; else if (n.measure == t)i += 3; else {
            if (!(n.measure < r[u.measure]))return 0;
            i += 1
        }
        return i
    }

    function i(i) {
        var t = e.defer(), o = _.countBy(i.columns, function (e) {
            return e.type
        });
        return o[u.dimension] <= 0 || o[u.measure] <= 0 ? t.resolve([]) : r.getChartLibrary().then(function (e) {
            var r = _.chain(e).map(function (e) {
                return [e.compId, n(e, o)]
            }).filter(function (e) {
                return e[1] > 0
            }).sortBy("1").pluck("0").value().reverse();
            t.resolve(r)
        }, function () {
            t.resolve([])
        }), t.promise
    }

    var u = {dimension: "string", measure: "number"}, t = "0";
    return {recommend: i}
}]);