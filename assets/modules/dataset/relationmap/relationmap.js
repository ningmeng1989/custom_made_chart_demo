/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset.relationmap", ["app.dataset.relationmap.relationedit", "app.filterconditions", "app.dataset.tablerename"]).factory("relationmapService", ["$http", "$q", function (t, e) {
    return {
        updateDataSet: function (a) {
            var o = e.defer();
            return t({
                method: "PUT",
                url: charts_server + "/service/dataset",
                data: angular.toJson(a, !0)
            }).success(function (t, e, a, n) {
                t.error ? o.reject(t) : o.resolve(t)
            }).error(function (t, e, a, n) {
                o.reject(t)
            }), o.promise
        }, createDataSet: function (a) {
            var o = e.defer();
            return t({
                method: "POST",
                url: charts_server + "/service/dataset",
                data: angular.toJson(a)
            }).success(function (t, e, a, n) {
                t.error ? o.reject(t) : o.resolve(t)
            }).error(function (t, e, a, n) {
                o.reject(t)
            }), o.promise
        }, getDataTable: function (a, o) {
            var n = e.defer();
            return t({
                method: "GET",
                url: charts_server + "/service/datasource/datatable",
                params: {datasourceId: a, datatableId: o}
            }).success(function (t, e, a, o) {
                t.error ? n.reject(t) : n.resolve(t)
            }).error(function (t, e, a, o) {
                n.reject(t)
            }), n.promise
        }
    }
}]).directive("relationmap", ["$rootScope", "$stateParams", "$modal", "relationmapService", "datasetService", "toaster", function (t, e, a, o, n, r) {
    return {
        restrict: "AE",
        scope: {model: "=", category: "=", method: "=", datasetEmpty: "="},
        templateUrl: "modules/dataset/relationmap/relationmap.html",
        link: function (i, s, c) {
            function u(t, e, o) {
                return a.open({
                    templateUrl: "modules/dataset/relationmap/relationedit/relationedit.html",
                    controller: "relationeditCtrl",
                    backdrop: !1,
                    resolve: {
                        datatableA: function () {
                            return angular.copy(t)
                        }, datatableB: function () {
                            return angular.copy(e)
                        }, relation: function () {
                            return angular.copy(o)
                        }
                    }
                })
            }

            var d = new semantics.diagram.DiagramLayoutManager("mapContainer");
            d.excludeField = ["id"], i.projectId = e.projectId;
            var l = !1;
            i.$watch("model", function (t, e) {
                e || !t || l || (d.load(t), d.layout(), l = !0)
            }), i.$watch("method", function (t) {
                "create" == t && (d.layout(), l = !0)
            });
            var p = [];
            p.push(dojo.subscribe("/semantics/computeItemAdded", null, function (e) {
                t.$broadcast("addColumn", e)
            })), p.push(dojo.subscribe("/semantics/computeItemsAdded", null, function (e) {
                t.$broadcast("addColumns", e)
            })), p.push(dojo.subscribe("/semantics/computeItemRemoved", null, function (e) {
                t.$broadcast("deleteColumn", e)
            })), p.push(dojo.subscribe("/semantics/datasetEmpty", null, function () {
                i.datasetEmpty = !0, i.$$phase || i.$root.$$phase || i.$apply()
            })), p.push(dojo.subscribe("/semantics/addRelationEdit", null, function (t, e, a) {
                var o = {id: t.id, name: t.name, items: t.items}, n = {id: e.id, name: e.name, items: e.items};
                u(o, n, a).result.then(function (t) {
                    d.updateRelation(t)
                }, function (t) {
                    d.addRelationCancel(a), console.log(t)
                })
            })), p.push(dojo.subscribe("/semantics/editRelation", null, function (t, e, a) {
                var o = {id: t.id, name: t.name, items: t.items}, n = {id: e.id, name: e.name, items: e.items};
                u(o, n, a).result.then(function (t) {
                    d.updateRelation(t)
                }, function (t) {
                    console.log(t)
                })
            })), p.push(dojo.subscribe("/semantics/tablerename", null, function (t) {
                var e = a.open({
                    templateUrl: "modules/dataset/relationmap/tablerename/tablerename.html",
                    controller: "tablerenameCtrl",
                    backdrop: !1,
                    size: "sm",
                    resolve: {
                        table: function () {
                            return angular.copy(t)
                        }
                    }
                });
                e.result.then(function (t) {
                    d.updateTableName(t)
                }, function (t) {
                    console.log(t)
                })
            }));
            var m = [];
            m.push(i.$on("addComputeItem", function (t, e) {
                d.toAddComputeItem(e)
            })), m.push(i.$on("addDataTable", function (t, e) {
                for (var a = e.datasourceId, n = e.datatableId, s = $("#mapContainer").offset().top - $("#mapContainer").position().top, c = $("#mapContainer").offset().left - $("#mapContainer").position().left, u = c + 60 - $("#mapContainer").position().left, l = s + 40 - $("#mapContainer").position().top; ;) {
                    if (!d.isExistTable(u, l))break;
                    u += 430
                }
                o.getDataTable(a, n).then(function (t) {
                    var e = t.object;
                    e.x = u, e.y = l, e.showItems = !0, e.dataSourceId = a, d.addDataTable(e), i.datasetEmpty = !1
                }, function (t) {
                    r.pop("error", "提示", "数据表信息加载失败")
                })
            })), m.push(i.$on("removeComputeItem", function (t, e) {
                d.toRemoveComputeItem(e)
            })), m.push(i.$on("updateComputeItem", function (t, e) {
                d.updateComputeItem(e)
            })), m.push(i.$on("getCurrentDataSet", function (t, e) {
                n.setCurrentDataSet(d.getDataSet())
            })), m.push(i.$on("saveDataSet", function (t, e) {
                d.setDatasetName(e.name), d.setDatasetRemarks(e.remarks);
                var a = d.getDataSet();
                a.filterConditions = e.conditions, n.validateDataSet(a, r) && ("update" == i.method ? o.updateDataSet(a).then(function (t) {
                    t.object ? r.pop("success", "提示", "保存成功") : r.pop("error", "提示", "保存失败")
                }, function (t) {
                    r.pop("error", "提示", "保存失败")
                }) : "create" == i.method && (a.projectId = i.projectId, a.category = i.category, o.createDataSet(a).then(function (t) {
                    d.setDatasetId(t.object.id), i.method = "update", r.pop("success", "提示", "保存成功")
                }, function (t) {
                    r.pop("error", "提示", "保存失败")
                })))
            })), m.push(i.$on("saveOtherDataSet", function (t, e) {
                var a = d.getDataSet();
                a.name = e.name, a.projectId = i.projectId, a.filterConditions = e.conditions, n.validateDataSet(a, r) && o.createDataSet(a).then(function (t) {
                    d.setDatasetId(t.object.id), r.pop("success", "提示", "保存成功")
                }, function (t) {
                    r.pop("error", "提示", "保存失败")
                })
            })), i.$on("$destroy", function () {
                angular.forEach(m, function (t) {
                    t()
                }), dojo.forEach(p, dojo.unsubscribe), d.destroy()
            }), i.ondrop = function (t) {
                var e = t.getData().datatable, a = e.datasourceId, n = e.datatableId, s = $("#mapContainer").position().top, c = $("#mapContainer").position().left;
                o.getDataTable(a, n).then(function (e) {
                    var o = e.object;
                    o.x = t.clientX - c, o.y = t.clientY - s, o.showItems = !0, o.dataSourceId = a, d.addDataTable(o), i.datasetEmpty = !1
                }, function (t) {
                    r.pop("error", "提示", "数据表信息加载失败")
                })
            }
        }
    }
}]);