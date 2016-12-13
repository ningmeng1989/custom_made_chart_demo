/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").directive("storyToolbar", ["dashboardService", "storyPageshotService", "storyService", "$state", "toaster", "$modal", "$q", "$rootScope", function (o, e, t, r, n, c, s, a) {
    return {
        restrict: "AE",
        replace: !0,
        templateUrl: "modules/story/views/story-toolbar.html",
        link: function (e, a, i) {
            function l(o, r, c) {
                var a = s.defer();
                return t.saveChartBook(o).then(function (o) {
                    n.pop("success", "", "图册保存成功"), e.oldChartBookJson = r, a.resolve()
                }, function () {
                    n.pop("error", "", "图册保存失败"), a.reject()
                }), a.promise
            }

            function u(o) {
                var t = c.open({
                    scope: e,
                    templateUrl: "modules/story/views/story-info-settings.html",
                    controller: "storySettingsCtrl"
                });
                t.result.then(function (e) {
                    o && p(e)
                })
            }

            function p(o, c) {
                n.pop("info", "", "图册保存中..."), e.checkPageShot(!0), e.current.promise.then(function () {
                    o = o || angular.copy(e.chartBook);
                    var s = f(o);
                    t.saveChartBook(o).then(function (o) {
                        n.pop("success", "", "图册保存成功"), e.isSaveAs ? r.go("app.story", {
                            projectName: e.projectName,
                            bookId: o
                        }) : (e.oldChartBookJson = s, c && c())
                    }, function () {
                        n.pop("error", "", "图册保存失败")
                    })
                })
            }

            function f(e) {
                return e.pages.forEach(function (e) {
                    e.widget = o.treeToArray(e.widget)
                }), angular.toJson(e)
            }

            e.$on("$destroy", function () {
                window.onbeforeunload = null
            }), e.addTag = function () {
                var o = c.open({
                    scope: e,
                    templateUrl: "modules/common/resource-tag/resource-tag.html",
                    controller: "resourceTagCtrl",
                    backdrop: "static",
                    resolve: {
                        projectId: function () {
                            return e.project.id
                        }, tags: function () {
                            return e.chartBook.labels
                        }
                    }
                });
                o.result.then(function (o) {
                    e.chartBook.labels = o
                })
            }, e.toggleFullScreen = function () {
                window.screenfull && (screenfull.isFullscreen ? screenfull.exit() : screenfull.request($(".story-dashboard")[0]))
            }, e.preview = function () {
                if (e.chartBook.isTemp)return void n.pop("info", "", "请先保存图册");
                var o = "q.html?b=" + e.chartBook.id + "#/" + e.current.pageIndex, t = $.extend(!0, {}, e.chartBook), r = f(t);
                if (r === e.oldChartBookJson)window.open(o); else {
                    var c = window.open();
                    l(t, r).then(function () {
                        c.location.href = o
                    })
                }
            }, e.save = function (o) {
                e.isSaveAs = !1, e.chartBook.isTemp ? u(!0) : p(null, o)
            }, e.rename = function () {
                e.isSaveAs = !1, u()
            }, e.saveAs = function () {
                e.isSaveAs = !0, u(!0)
            }, e.share = function () {
            }, e["return"] = function () {
                var o = angular.copy(e.chartBook), t = f(o);
                if (t !== e.oldChartBookJson) {
                    var n = c.open({
                        templateUrl: "modules/common/operation-confirm/operation-confirm.html",
                        size: "sm",
                        controller: ["$scope", "$modalInstance", function (o, e) {
                            o.message = "图册尚未保存，确定要离开吗？", o.dismiss = function () {
                                e.dismiss()
                            }, o.submit = function () {
                                e.close()
                            }
                        }]
                    });
                    n.result.then(function () {
                        r.go("app.projectitems", {projectId: e.project.id, projectName: e.project.name})
                    })
                } else r.go("app.projectitems", {projectId: e.project.id, projectName: e.project.name})
            }, window.onbeforeunload = function (o) {
                var t = angular.copy(e.chartBook), r = f(t);
                if (r !== e.oldChartBookJson) {
                    var n = "编辑内容尚未同步到服务端，离开可能造成数据丢失，请先点击'留在此页'或'取消'，然后点击工具栏的保存按钮,保存成功提示后再离开";
                    return o.returnValue = n, n
                }
            }
        }
    }
}]);