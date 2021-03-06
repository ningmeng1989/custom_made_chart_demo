/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.datasource", ["app.datasource.datasourceedit", "app.project.projectitems", "app.datasource.delete"]).config(["$stateProvider", function (e) {
    e.state("app.datasource", {
        url: "/datasources/{projectId}/{projectName}",
        templateUrl: "modules/datasource/datasource.html"
    })
}]).factory("datasourceService", ["$http", "$q", function (e, t) {
    return {
        getDataSource: function (r) {
            var o = t.defer();
            return e({method: "GET", url: charts_server + "/service/datasource/" + r}).success(function (e, t, r, c) {
                e.error ? o.reject(e) : o.resolve(e)
            }).error(function (e, t, r, c) {
                o.reject(e)
            }), o.promise
        }, getDataSourceList: function () {
            var r = t.defer();
            return e({method: "GET", url: charts_server + "/service/datasources"}).success(function (e, t, o, c) {
                e.error ? r.reject(e) : r.resolve(e)
            }).error(function (e, t, o, c) {
                r.reject(e)
            }), r.promise
        }, deleteDataSource: function (r) {
            var o = t.defer();
            return e({method: "DELETE", url: charts_server + "/service/datasource/" + r}).success(function (e) {
                e.error ? o.reject(e) : o.resolve(e)
            }).error(function (e) {
                o.reject(e)
            }), o.promise
        }
    }
}]).controller("datasourceCtrl", ["$scope", "$stateParams", "$state", "$modal", "datasourceService", "toaster", function (e, t, r, o, c, a) {
    function s(t) {
        var r = o.open({
            templateUrl: "modules/datasource/datasourceedit/datasourceedit.html",
            controller: "datasourceeditCtrl",
            backdrop: !1,
            resolve: {
                selectDatasource: function () {
                    return angular.copy(t)
                }
            }
        });
        r.opened.then(function () {
            console.log("modal is opened")
        }), r.result.then(function (t) {
            for (var r in e.datasourcelist)if (e.datasourcelist[r].id == t.id)return void(e.datasourcelist[r] = t);
            e.datasourcelist.push(t)
        }, function (e) {
            console.log(e)
        })
    }

    e.projectId = t.projectId, e.project = {
        id: t.projectId,
        name: t.projectName
    }, e.selectedIndex = -1, c.getDataSourceList().then(function (t) {
        e.datasourcelist = t.object
    }, function (t) {
        e.datasourcelist = []
    }), e.goBack = function () {
        r.go("app.projectitems", {projectId: t.projectId, projectName: t.projectName})
    }, e.selectClick = function (t) {
        e.selectedIndex == t ? e.selectedIndex = -1 : e.selectedIndex = t
    }, e.createDataSource = function () {
        s(null)
    }, e.editDataSource = function () {
        -1 != e.selectedIndex && s(e.datasourcelist[e.selectedIndex])
    }, e.deleteDataSource = function () {
        if (-1 != e.selectedIndex) {
            var t = o.open({
                templateUrl: "modules/datasource/delete/delete.html",
                controller: "deleteCtrl",
                backdrop: !1,
                size: "sm"
            });
            t.result.then(function () {
                var t = e.datasourcelist[e.selectedIndex].id;
                c.deleteDataSource(t).then(function (t) {
                    t.object ? (e.datasourcelist.splice(e.selectedIndex, 1), e.selectedIndex = -1, a.pop("success", "提示", "删除成功!")) : a.pop("error", "提示", "删除失败!")
                }, function (e) {
                    "CHART-502" == e.error.c ? a.pop("error", "提示", "删除失败,数据源已被使用!") : a.pop("error", "提示", "删除失败,请重试!")
                })
            }, function (e) {
                console.log(e)
            })
        }
    }, e.next = function () {
        if (-1 != e.selectedIndex) {
            var o = e.datasourcelist[e.selectedIndex].id;
            r.go("app.dataset", {projectId: e.projectId, projectName: t.projectName, method: "new", dsId: o})
        }
    }
}]);