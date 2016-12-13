/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset", ["common.utils.directive", "app.dataset.datatablelist", "app.dataset.datasetpreview", "app.dataset.relationmap", "app.datasource", "app.filterconditions", "app.dataset.save", "app.project.projectitems"]).config(["$stateProvider", function (t) {
    t.state("app.dataset", {
        url: "/dataset/{projectId}/{projectName}/{method}/{dsId}",
        templateUrl: "modules/dataset/dataset.html",
        resolve: {
            deps: ["$ocLazyLoad", function (t) {
                return t.load("toaster").then(function () {
                    return t.load(["modules/dataset/relationmap/js/viewer.js", "modules/dataset/relationmap/js/model.js", "modules/dataset/relationmap/js/moveset.js", "modules/dataset/relationmap/js/autolayout.js", "modules/dataset/relationmap/js/infosetviewer.js", "modules/dataset/relationmap/js/connectpoint.js", "modules/dataset/relationmap/js/infoitemsviewer.js", "modules/dataset/relationmap/js/itemviewer.js", "modules/dataset/relationmap/js/plainarrow.js", "modules/dataset/relationmap/js/arrowdrag.js", "modules/dataset/relationmap/js/relationviewer.js", "modules/dataset/relationmap/js/manager.js"])
                })
            }]
        }
    })
}]).factory("datasetService", ["$http", "$q", function (t, e) {
    var a = null;
    return {
        setCurrentDataSet: function (t) {
            a = t
        }, getCurrentDataSet: function () {
            return a
        }, getDataSet: function (a) {
            var n = e.defer();
            return t({method: "GET", url: charts_server + "/service/dataset/" + a}).success(function (t, e, a, o) {
                t.error ? n.reject(t) : n.resolve(t)
            }).error(function (t, e, a, o) {
                n.reject(t)
            }), n.promise
        }, validateDataSet: function (t, e) {
            if (t) {
                if (!t.dsEntities || 0 == t.dsEntities.length)return e && e.pop("warning", "提示", "请先拖拽一个表"), !1;
                if (!t.dataSetFields || 0 == t.dataSetFields.length)return e && e.pop("warning", "提示", "请先选择一个字段"), !1;
                if (t.dsEntities.length > 1) {
                    if (!t.entityRelations || 0 == t.entityRelations.length)return e && e.pop("warning", "提示", "请搭建表与表之间的关联关系"), !1;
                    for (var a in t.dsEntities) {
                        var n = t.dsEntities[a].id, o = !1;
                        for (var r in t.entityRelations) {
                            var s = t.entityRelations[r].entityA, i = t.entityRelations[r].entityB;
                            if (n == s || n == i) {
                                o = !0;
                                break
                            }
                        }
                        if (!o)return e && e.pop("warning", "提示", "请搭建" + n + "表与其他表之间的关联关系"), !1
                    }
                }
                return !0
            }
            return e && e.pop("warning", "提示", "请创建一个有效数据集"), !1
        }
    }
}]).controller("dataSetCtrl", ["$scope", "$rootScope", "$stateParams", "datasetService", "datasourceService", "toaster", "$modal", "$state", function (t, e, a, n, o, r, s, i) {
    if (t.project = {id: a.projectId, name: a.projectName}, "new" == a.method) {
        t.datasetEmpty = !0, t.method = "create", t.conditions = [];
        var d = a.dsId, c = [d];
        t.datatableConfig = {dataSourceIds: c}, o.getDataSource(d).then(function (e) {
            var a = e.object;
            "rdb" == a.kind ? t.datasetCategory = "DB_DATA" : "file" == a.kind && (t.datasetCategory = "UPLOAD_FILE")
        }, function (t) {
            r.pop("error", "提示", "数据源加载异常")
        })
    } else"edit" == a.method && (t.datasetEmpty = !1, t.method = "update", n.getDataSet(a.dsId).then(function (e) {
        t.dataset = e.object;
        var a = [];
        t.dataset.dsEntities.forEach(function (t) {
            var e = t.dataSourceId;
            a.indexOf(e) < 0 && a.push(e)
        }), t.dataset.filterConditions ? t.conditions = t.dataset.filterConditions : t.conditions = [], t.datatableConfig = {dataSourceIds: a}
    }, function (t) {
        r.pop("error", "提示", "数据集加载异常")
    }));
    var p = $("#mainDiv"), l = $("#relationmapDiv"), m = ($("#separatorDiv"), $("#previewDiv")), u = 7, f = p[0].clientHeight, v = 256, g = f - v - u;
    l.height(g / f * 100 + "%"), m.height(v / f * 100 + "%");
    var h = 0;
    angular.element("#separatorDiv").draggable({
        containment: "parent", cursor: "s-resize", helper: function () {
            return $("<div class='separate-drag-line'></div>")
        }, start: function (t) {
            h = t.clientY
        }, drag: function (t) {
        }, stop: function (t) {
            var e = t.clientY, a = p[0].clientHeight, n = l[0].clientHeight + (e - h), o = m[0].clientHeight - (e - h);
            l.height(n / a * 100 + "%"), m.height(o / a * 100 + "%")
        }
    }), t.showbig = !1, t.showBig = function () {
        t.showbig = !0, $("#footer").height("150px"), $("#mainMap").css("padding-bottom", "150px"), $("#mainMap").css("margin-bottom", "-150px")
    }, t.showSmall = function () {
        t.showbig = !1, $("#footer").height("53px"), $("#mainMap").css("padding-bottom", "53px"), $("#mainMap").css("margin-bottom", "-53px")
    }, t.goBack = function () {
        i.go("app.projectitems", {projectId: a.projectId, projectName: a.projectName})
    }, t.previewConfig = {refreshData: !1}, t.refreshData = function () {
        t.previewConfig.refreshData = !0
    }, t.saveDataSetInfo = function (e) {
        if ("update" == t.method && "保存" == e)t.$broadcast("saveDataSet", {
            name: t.dataset.name,
            remarks: t.dataset.remarks,
            conditions: t.conditions
        }); else {
            var a = s.open({
                templateUrl: "modules/dataset/save/save.html",
                controller: "saveCtrl",
                backdrop: !1,
                size: "sm",
                resolve: {
                    dataset: function () {
                        return "另存为" != e && t.dataset ? {name: t.dataset.name, remarks: t.dataset.remarks} : {
                            name: "",
                            remarks: ""
                        }
                    }, saveName: function () {
                        return e
                    }
                }
            });
            a.result.then(function (a) {
                "另存为" == e ? t.$broadcast("saveOtherDataSet", {
                    name: a.name,
                    conditions: t.conditions
                }) : t.$broadcast("saveDataSet", {name: a.name, conditions: t.conditions}), t.dataset = {name: a.name}
            }, function (t) {
                console.log(t)
            })
        }
    }
}]);