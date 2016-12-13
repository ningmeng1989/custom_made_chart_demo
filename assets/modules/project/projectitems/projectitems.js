/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.project.projectitems", ["app.datasource", "app.dataset", "dataviz.chartedit", "app.project.delete"]).config(["$stateProvider", function (t) {
    t.state("app.projectitems", {
        url: "/project/items/{projectId}/{projectName}",
        templateUrl: "modules/project/projectitems/projectitems.html",
        resolve: {
            deps: ["$ocLazyLoad", function (t) {
                return t.load("toaster").then(function () {
                    return t.load([])
                })
            }]
        }
    })
}]).factory("projectItemService", ["$http", "$q", function (t, e) {
    return {
        getDateSetList: function (r) {
            var a = e.defer();
            return t({method: "GET", url: charts_server + "/service/datasets/" + r}).success(function (t) {
                t.error ? a.reject(t) : a.resolve(t)
            }).error(function (t) {
                a.reject(t)
            }), a.promise
        }, getChartList: function (r) {
            var a = e.defer();
            return t({
                method: "GET",
                url: charts_server + "/service/chartinstances/info/byproject",
                params: {projectId: r}
            }).success(function (t) {
                t.error ? a.reject(t) : a.resolve(t)
            }).error(function (t) {
                a.reject(t)
            }), a.promise
        }, getStoryList: function (r) {
            var a = e.defer();
            return t({
                method: "GET",
                url: charts_server + "/service/chartbooks/info/byproject",
                params: {projectId: r}
            }).success(function (t) {
                t.error ? a.reject(t) : a.resolve(t)
            }).error(function (t) {
                a.reject(t)
            }), a.promise
        }, deleteItems: function (r, a, s) {
            var o = e.defer();
            return t({
                method: "DELETE",
                url: charts_server + "/service/project/items",
                params: {datasetIds: r.join(","), chartIds: a.join(","), storyIds: s.join(",")}
            }).success(function (t) {
                t.error ? o.reject(t) : o.resolve(t)
            }).error(function (t) {
                o.reject(t)
            }), o.promise
        }
    }
}]).controller("projectItemsCtrl", ["$scope", "$stateParams", "$state", "$modal", "projectItemService", "$timeout", "toaster", function (t, e, r, a, s, o, c) {
    t.project = {id: e.projectId, name: e.projectName}, t.showAll = {
        dataset: !1,
        chart: !1,
        story: !1
    }, t.datasetList = [], t.chartList = [], t.storyList = [];
    var i = $("#itemsContainer").width();
    t.num = parseInt(i / 221), t.datasetNum = t.num, t.chartNum = t.num, t.storyNum = t.num, $("#itemsContainer").resize(function () {
        var e = $("#itemsContainer").width(), r = parseInt(e / 221);
        r != t.num && (t.num = r, t.showAll.dataset || (t.datasetList && t.datasetList.length > t.num ? t.datasetNum = t.num - 1 : t.datasetNum = t.num), t.showAll.chart || (t.chartList && t.chartList.length > t.num ? t.chartNum = t.num - 1 : t.chartNum = t.num), t.showAll.story || (t.storyList && t.storyList.length > t.num ? t.storyNum = t.num - 1 : t.storyNum = t.num), t.$$phase || t.$root && t.$root.$$phase || t.$apply())
    }), t.projectId = e.projectId, t.projectName = e.projectName, t.goBack = function () {
        r.go("app.project")
    }, s.getDateSetList(t.projectId).then(function (e) {
        t.datasetList = e.object, !t.showAll.dataset && t.datasetList.length > t.num && (t.datasetNum = t.num - 1)
    }, function (e) {
        c.pop("error", "提示", "数据集加载失败"), t.datasetList = []
    }), s.getChartList(t.projectId).then(function (e) {
        t.chartList = e.object, !t.showAll.chart && t.chartList.length > t.num && (t.chartNum = t.num - 1)
    }, function (e) {
        c.pop("error", "提示", "图表加载失败"), t.chartList = []
    }), s.getStoryList(t.projectId).then(function (e) {
        t.storyList = e.object, !t.showAll.story && t.storyList.length > t.num && (t.storyNum = t.num - 1)
    }, function (e) {
        c.pop("error", "提示", "图册加载失败"), t.storyList = []
    }), t["delete"] = {active: !1, datasetList: [], chartList: [], storyList: []}, t.startDelete = function () {
        t["delete"].active ? t.deleteCancel() : t["delete"].active = !t["delete"].active
    }, t.isDelete = function () {
        return 0 == t["delete"].datasetList.length && 0 == t["delete"].chartList.length && 0 == t["delete"].storyList.length
    }, t.showAllDataset = function () {
        t.datasetNum = t.datasetList.length, t.showAll.dataset = !0
    }, t.showAllChart = function () {
        t.chartNum = t.chartList.length, t.showAll.chart = !0
    }, t.showAllStory = function () {
        t.storyNum = t.storyList.length, t.showAll.story = !0
    }, t.showRowDataset = function () {
        t.datasetList && t.datasetList.length > t.num ? t.datasetNum = t.num - 1 : t.datasetNum = t.num, o(function () {
            t.showAll.dataset = !1, t.$$phase || t.$root && t.$root.$$phase || t.$apply()
        }, 400)
    }, t.showRowChart = function () {
        t.chartList && t.chartList.length > t.num ? t.chartNum = t.num - 1 : t.chartNum = t.num, o(function () {
            t.showAll.chart = !1, t.$$phase || t.$root && t.$root.$$phase || t.$apply()
        }, 400)
    }, t.showRowStory = function () {
        t.storyList && t.storyList.length > t.num ? t.storyNum = t.num - 1 : t.storyNum = t.num, o(function () {
            t.showAll.story = !1, t.$$phase || t.$root && t.$root.$$phase || t.$apply()
        }, 400)
    }, t.deleteOK = function () {
        var e = a.open({
            templateUrl: "modules/project/delete/delete.html",
            controller: "deleteCtrl",
            backdrop: !1,
            size: "sm"
        });
        e.result.then(function () {
            s.deleteItems(t["delete"].datasetList, t["delete"].chartList, t["delete"].storyList).then(function (e) {
                for (var r = 0; r < t.storyList.length; r++)t.storyList[r]["delete"] && t.storyList.splice(r--, 1);
                if (t["delete"].storyList = [], 1 == e.object) {
                    t["delete"].active = !1;
                    for (var r = 0; r < t.chartList.length; r++)t.chartList[r]["delete"] && t.chartList.splice(r--, 1);
                    for (var r = 0; r < t.datasetList.length; r++)t.datasetList[r]["delete"] && t.datasetList.splice(r--, 1);
                    t["delete"].datasetList = [], t["delete"].chartList = [], c.pop("success", "提示", "删除成功!")
                } else {
                    for (var r = 0; r < t.datasetList.length; r++)if (t.datasetList[r]["delete"]) {
                        var a = !1;
                        for (var s in e.object.dataset)if (e.object.dataset[s].realMessage == t.datasetList[r].id) {
                            var o = t.datasetList[r].name;
                            "CHART-502" == e.object.dataset[s].codeString ? (a = !0, c.pop("error", "提示", "数据集'" + o + "'删除失败,要删除的数据集已被引用!")) : (a = !0, c.pop("error", "提示", "数据集'" + o + "'删除失败,请重试!"));
                            break
                        }
                        if (!a) {
                            var i = t["delete"].datasetList.indexOf(t.datasetList[r].id);
                            i >= 0 && t["delete"].datasetList.splice(i, 1), t.datasetList.splice(r--, 1)
                        }
                    }
                    for (var r = 0; r < t.chartList.length; r++)if (t.chartList[r]["delete"]) {
                        var a = !1;
                        for (var s in e.object.chart)if (e.object.chart[s].realMessage == t.chartList[r].id) {
                            var o = t.chartList[r].name;
                            "CHART-502" == e.object.chart[s].codeString ? (a = !0, c.pop("error", "提示", "图表'" + o + "'删除失败,要删除的图表已被引用!")) : (a = !0, c.pop("error", "提示", "图表'" + o + "'删除失败,请重试!"));
                            break
                        }
                        if (!a) {
                            var i = t["delete"].chartList.indexOf(t.chartList[r].id);
                            i >= 0 && t["delete"].chartList.splice(i, 1), t.chartList.splice(r--, 1)
                        }
                    }
                }
                t.showAll.dataset || (t.datasetList.length > t.num ? t.datasetNum = t.num - 1 : t.datasetNum = t.num), t.showAll.chart || (t.chartList.length > t.num ? t.chartNum = t.num - 1 : t.chartNum = t.num), t.showAll.story || (t.storyList.length > t.num ? t.storyNum = t.num - 1 : t.storyNum = t.num), t.$$phase || t.$root && t.$root.$$phase || t.$apply()
            }, function (t) {
                c.pop("error", "提示", "删除失败,请重试!")
            })
        }, function (t) {
            console.log(t)
        })
    }, t.deleteCancel = function () {
        t["delete"].active = !1, t["delete"].datasetList = [], t["delete"].chartList = [], t["delete"].storyList = [];
        for (var e in t.datasetList)t.datasetList[e]["delete"] = !1;
        for (var e in t.chartList)t.chartList[e]["delete"] = !1;
        for (var e in t.storyList)t.storyList[e]["delete"] = !1
    }, t.checkDataset = function (e) {
        var r = t["delete"].datasetList.indexOf(e.id);
        r >= 0 ? (t["delete"].datasetList.splice(r, 1), e["delete"] = !1) : (t["delete"].datasetList.push(e.id), e["delete"] = !0)
    }, t.checkChart = function (e) {
        var r = t["delete"].chartList.indexOf(e.id);
        r >= 0 ? (t["delete"].chartList.splice(r, 1), e["delete"] = !1) : (t["delete"].chartList.push(e.id), e["delete"] = !0)
    }, t.checkStory = function (e) {
        var r = t["delete"].storyList.indexOf(e.id);
        r >= 0 ? (t["delete"].storyList.splice(r, 1), e["delete"] = !1) : (t["delete"].storyList.push(e.id), e["delete"] = !0)
    }, t.scrollsmall = {value: !1}, $(".cell").scroll(function () {
        $(".cell").scrollTop() >= 30 ? t.scrollsmall.value || ($(".btn-circular-bar").addClass("btn-circular-bar-small"), $(".btn-circular").addClass("btn-circular-small"), t.scrollsmall.value = !0, o(function () {
            t.$$phase || t.$root && t.$root.$$phase || t.$apply()
        }, 200)) : t.scrollsmall.value && ($(".btn-circular-bar").removeClass("btn-circular-bar-small"), $(".btn-circular").removeClass("btn-circular-small"), t.scrollsmall.value = !1, o(function () {
            t.$$phase || t.$root && t.$root.$$phase || t.$apply()
        }, 200))
    }), t.newDataset = function () {
        r.go("app.datasource", {projectId: t.projectId, projectName: t.projectName})
    }, t.newChart = function () {
        r.go("app.charting_edit", {projectId: t.projectId, projectName: t.projectName, chartId: ""})
    }, t.newStory = function () {
        r.go("app.story", {projectId: t.projectId, projectName: t.projectName, bookId: ""})
    }, t.editDataset = function (e) {
        r.go("app.dataset", {projectId: t.projectId, projectName: t.projectName, method: "edit", dsId: e.id})
    }, t.playChart = function (t) {
        var e = "q.html?c=" + t.id;
        window.open(e)
    }, t.shareChart = function (t) {
    }, t.editChart = function (e) {
        r.go("app.charting_edit", {projectId: t.projectId, projectName: t.projectName, chartId: e.id})
    }, t.playStory = function (t) {
        var e = "q.html?b=" + t.id;
        window.open(e)
    }, t.shareStory = function (t) {
    }, t.editStory = function (e) {
        r.go("app.story", {projectId: t.projectId, projectName: t.projectName, bookId: e.id})
    }
}]);