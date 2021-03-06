/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.project.projectedit", []).factory("projecteditService", ["$http", "$q", function (e, r) {
    return {
        createProject: function (t) {
            var c = r.defer();
            return e({
                method: "POST",
                url: charts_server + "/service/project",
                data: angular.toJson(t)
            }).success(function (e) {
                e.error ? c.reject(e) : c.resolve(e)
            }).error(function (e) {
                c.reject(e)
            }), c.promise
        }, updateProject: function (t) {
            var c = r.defer();
            return e({
                method: "PUT",
                url: charts_server + "/service/project",
                data: angular.toJson(t)
            }).success(function (e) {
                e.error ? c.reject(e) : c.resolve(e)
            }).error(function (e) {
                c.reject(e)
            }), c.promise
        }
    }
}]).controller("projecteditCtrl", ["$scope", "$modalInstance", "projecteditService", "project", "projectlist", function (e, r, t, c, o) {
    e.project = c, e.isOkBtnDisabled = function () {
        if (_.isEmpty(e.project.name))return e.warning = "*项目名称不能为空", !0;
        for (var r in o)if (e.project.id != o[r].id && e.project.name == o[r].name)return e.warning = "*项目名称不能重复", !0;
        return !1
    }, e.ok = function () {
        var c;
        c = _.isEmpty(e.project.id) ? t.createProject(e.project) : t.updateProject(e.project), c.then(function (t) {
            1 != t.object && (e.project = t.object), r.close(e.project)
        }, function (e) {
            alert("保存失败")
        })
    }, e.cancel = function () {
        r.dismiss("cancel")
    }
}]);