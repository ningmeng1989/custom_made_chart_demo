/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.project", ["app.project.projectedit", "app.project.projectitems", "app.project.delete"]).config(["$stateProvider", function (e) {
    e.state("app.project", {url: "/projects", templateUrl: "modules/project/project.html"})
}]).factory("projectService", ["$http", "$q", function (e, t) {
    return {
        getProjectList: function () {
            var r = t.defer();
            return e({method: "GET", url: charts_server + "/service/projects"}).success(function (e) {
                e.error ? r.reject(e) : r.resolve(e)
            }).error(function (e) {
                r.reject(e)
            }), r.promise
        }, deleteProjects: function (r) {
            var o = t.defer();
            return e({
                method: "DELETE",
                url: charts_server + "/service/project",
                params: {projectIds: r.join(","), force: !0}
            }).success(function (e) {
                e.error ? o.reject(e) : o.resolve(e)
            }).error(function (e) {
                o.reject(e)
            }), o.promise
        }
    }
}]).controller("projectController", ["$scope", "$modal", "$state", "projectService", "toaster", "$timeout", function (e, t, r, o, c, l) {
    function s(r) {
        return t.open({
            templateUrl: "modules/project/projectedit/projectedit.html",
            controller: "projecteditCtrl",
            backdrop: !1,
            size: "sm",
            resolve: {
                project: function () {
                    return angular.copy(r)
                }, projectlist: function () {
                    return angular.copy(e.projectList)
                }
            }
        })
    }

    o.getProjectList().then(function (t) {
        e.projectList = t.object
    }, function (t) {
        e.projectList = []
    }), e.selectProject = function (t) {
        if (e["delete"].active) {
            var r = e["delete"].projectList.indexOf(t.id);
            r >= 0 ? (t["delete"] = !1, e["delete"].projectList.splice(r, 1)) : (t["delete"] = !0, e["delete"].projectList.push(t.id))
        }
    }, e.openProject = function (e) {
        r.go("app.projectitems", {projectId: e.id, projectName: e.name})
    }, e.newProject = function () {
        var t = s({});
        t.result.then(function (t) {
            e.projectList.push(t), c.pop("success", "提示", "保存成功")
        }, function (e) {
            console.log(e)
        })
    }, e.editProject = function (t) {
        var r = s(t);
        r.result.then(function (t) {
            for (var r in e.projectList)e.projectList[r].id == t.id && (e.projectList[r] = t);
            c.pop("success", "提示", "保存成功")
        }, function (e) {
            console.log(e)
        })
    }, e.scrollsmall = {value: !1}, $(".cell").scroll(function () {
        $(".cell").scrollTop() >= 30 ? e.scrollsmall.value || ($(".btn-circular-bar").addClass("btn-circular-bar-small"), $(".btn-circular").addClass("btn-circular-small"), e.scrollsmall.value = !0, l(function () {
            e.$$phase || e.$root && e.$root.$$phase || e.$apply()
        }, 200)) : e.scrollsmall.value && ($(".btn-circular-bar").removeClass("btn-circular-bar-small"), $(".btn-circular").removeClass("btn-circular-small"), e.scrollsmall.value = !1, l(function () {
            e.$$phase || e.$root && e.$root.$$phase || e.$apply()
        }, 200))
    }), e["delete"] = {active: !1, projectList: []}, e.startdelete = function () {
        e["delete"].active ? e.deleteCancel() : e["delete"].active = !e["delete"].active
    }, e.deleteProject = function () {
        var r = t.open({
            templateUrl: "modules/project/delete/deleteProjects.html",
            controller: "deleteCtrl",
            backdrop: !1,
            size: "sm"
        });
        r.result.then(function () {
            o.deleteProjects(e["delete"].projectList).then(function (t) {
                if (1 == t.object) {
                    e["delete"].active = !1, e["delete"].projectList = [];
                    for (var r = 0; r < e.projectList.length; r++)e.projectList[r]["delete"] && e.projectList.splice(r--, 1);
                    c.pop("success", "提示", "删除成功!")
                } else for (var r = 0; r < e.projectList.length; r++)if (e.projectList[r]["delete"]) {
                    var o = !1;
                    for (var l in t.object)if (t.object[l].realMessage == e.projectList[r].id) {
                        var s = e.projectList[r].name;
                        "CHART-501" == t.object[l].codeString ? (o = !0, c.pop("error", "提示", "'" + s + "'删除失败,要删除的项目中包含数据或图表等资源!")) : "CHART-503" == t.object[l].codeString || (o = !0, c.pop("error", "提示", "'" + s + "'删除失败,请重试!"));
                        break
                    }
                    if (!o) {
                        var i = e["delete"].projectList.indexOf(e.projectList[r].id);
                        i >= 0 && e["delete"].projectList.splice(i, 1), e.projectList.splice(r--, 1)
                    }
                }
            }, function (e) {
                c.pop("error", "提示", "删除失败,请重试!")
            })
        }, function (e) {
            console.log(e)
        })
    }, e.deleteCancel = function () {
        for (var t in e.projectList)e.projectList[t]["delete"] = !1;
        e["delete"].active = !1, e["delete"].projectList = []
    }
}]);