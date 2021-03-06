/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").directive("storyNavigator", ["$timeout", "$modal", "dashboardService", "$q", function (e, t, r, n) {
    return {
        restrict: "AE",
        replace: !0,
        templateUrl: "modules/story/views/story-navigator.html",
        link: function (e, n, o) {
            function a() {
                $(window).off("resize", u), g && clearInterval(g)
            }

            function c(t) {
                e.current.widget = null, e.current.pageIndex = t, e.current.page = e.chartBook.pages[t], e.current.pageJson = angular.toJson(r.treeToArray(e.current.page.widget)), g && clearInterval(g), g = setInterval(function () {
                    e.checkPageShot(!0)
                }, 15e3), e.current.usedCharts = {}, r.traverseTree(e.current.page.widget, function (t) {
                    "chart" === t.type && (e.current.usedCharts[t.resource.id] = !0)
                })
            }

            function i() {
                setTimeout(function () {
                    var t = n.find(".story-nav-page:eq(" + e.current.pageIndex + ")")[0];
                    n.slimscroll({scrollTo: t.offsetTop + "px"})
                }, 0)
            }

            e.$on("$destroy", function () {
                setTimeout(function () {
                    a()
                }, 0)
            });
            var s = n.parent(), l = {height: 0, distance: "4px"}, u = _.debounce(function () {
                n.slimScroll({destroy: !0}), l.height = s.height(), n.slimscroll(l)
            }, 200);
            setTimeout(function () {
                l.height = s.height(), n.slimscroll(l), $(window).on("resize", function () {
                    e.accordionGroupPages.open && u()
                }), e.$on("accordion-expand-done", function () {
                    s.height() !== l.height && u()
                })
            }, 0), e.addPage = function (t) {
                t.stopPropagation();
                var n = {widget: r.getInitWidgetTree()};
                e.chartBook.pages.push(n), e.pagesChanged.push(!1), e.selectPage(e.chartBook.pages.length - 1), i()
            }, e.removePage = function (n, o) {
                if (n.stopPropagation(), 1 !== e.chartBook.pages.length) {
                    var a = t.open({
                        templateUrl: "modules/common/operation-confirm/operation-confirm.html",
                        size: "sm",
                        controller: ["$scope", "$modalInstance", function (e, t) {
                            e.message = "确定删除此页吗？", e.dismiss = function () {
                                t.dismiss()
                            }, e.submit = function () {
                                t.close()
                            }
                        }]
                    });
                    a.result.then(function () {
                        var t = e.chartBook.pages.splice(o, 1);
                        o === e.current.pageIndex && c(o === e.chartBook.pages.length ? o - 1 : o), r.traverseTree(t[0].widget, function (t) {
                            "chart" === t.type && delete e.usedCharts[t.resource.id]
                        })
                    })
                }
            }, e.prevPage = function () {
                e.current.pageIndex > 0 ? e.selectPage(e.current.pageIndex - 1) : void 0, i()
            }, e.nextPage = function () {
                e.current.pageIndex < e.chartBook.pages.length - 1 ? e.selectPage(e.current.pageIndex + 1) : void 0, i()
            };
            var g = null;
            e.selectPage = function (t, r) {
                if (t !== e.current.pageIndex) {
                    if ("actual" === e.chartBook.showMode.type) {
                        var n = $(".story-dashboard-container");
                        n.scrollTop(0), n.scrollLeft(0)
                    }
                    angular.isNumber(e.current.pageIndex) && e.checkPageShot(), c(t)
                }
            }, e.selectPage(0), e.insertPage = function () {
                var e = t.open({
                    templateUrl: "modules/story/views/story-insert-page.html",
                    controller: "InsertPageCtrl",
                    size: "lg",
                    backdrop: "static"
                });
                e.result.then(function (e) {
                }, function () {
                })
            }
        }
    }
}]).directive("storyNavSortable", [function () {
    return {
        restrict: "A", link: function (e, t) {
            t.sortable({
                placeholder: "story-nav-placeholder", distance: 10, update: function (t, r) {
                    var n = r.item.attr("ind"), o = r.item.next().attr("ind") || e.chartBook.pages.length;
                    o > n ? e.current.pageIndex = o - 1 : e.current.pageIndex = o;
                    var a = e.chartBook.pages.splice(n, 1)[0];
                    e.chartBook.pages.splice(e.current.pageIndex, 0, a);
                    var c = e.pagesChanged.splice(n, 1)[0];
                    e.pagesChanged.splice(e.current.pageIndex, 0, c), e.$$phase || e.$digest()
                }
            })
        }
    }
}]);