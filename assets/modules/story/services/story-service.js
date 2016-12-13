/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").factory("storyService", ["$http", "$q", "storyConfig", function (e, r, t) {
    var a = null, o = null;
    return {
        getChartBook: function (o) {
            var n = r.defer();
            return a && a.id === o ? n.resolve(a) : e({method: "get", url: t.restUrl + o}).then(function (e) {
                e.data.error ? n.reject(e.data.error) : (a = e.data.object, n.resolve(a))
            }, function (e) {
                n.reject(e)
            }), n.promise
        }, createChartBook: function (o) {
            var n = r.defer();
            return e.post(t.restUrl, null, {params: {projectId: o}}).then(function (e) {
                e.data.error ? n.reject(e.data.error) : (a = e.data.object, n.resolve(a))
            }, function (e) {
                n.reject(e)
            }), n.promise
        }, saveChartBook: function (o) {
            var n = r.defer();
            return e.put(t.restUrl, o).then(function (e) {
                e.data.error ? n.reject(e.data.error) : (a = o, e.data.object && (a.id = e.data.object), n.resolve(e.data.object))
            }, function (e) {
                n.reject(e)
            }), n.promise
        }, getCategories: function () {
            var a = r.defer();
            return o && 1 != o.chartCategory.length ? a.resolve(o) : e.get(t.categoryUrl).then(function (e) {
                e.data.error ? a.reject(e.data.error) : a.resolve(e.data.object)
            }, function (e) {
                a.reject(e)
            }), a.promise
        }, getChartInstanceList: function (a) {
            var o = r.defer();
            return e.get(t.chartListUrl, {params: {projectId: a}}).then(function (e) {
                e.data.error ? o.reject(e.data.error) : o.resolve(e.data.object)
            }, function (e) {
                o.reject(e)
            }), o.promise
        }, getChartInstance: function (a) {
            var o = r.defer();
            return e.get(t.chartUrl + a).then(function (e) {
                e.data.error ? o.reject(e.data.error) : o.resolve(e.data.object)
            }, function (e) {
                o.reject(e)
            }), o.promise
        }, getDataSets: function (a) {
            var o = r.defer();
            return e.get(t.dataSetsUrl, {params: {datasetIds: a}}).then(function (e) {
                e.data.error ? o.reject(e.data.error) : o.resolve(e.data.object)
            }, function (e) {
                o.reject(e)
            }), o.promise
        }
    }
}]);