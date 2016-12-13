/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").directive("storyData", ["toaster", "$modal", "storyService", function (t, a, e) {
    return {
        restrict: "AE",
        replace: !0,
        templateUrl: "modules/story/views/story-data.html",
        scope: {chartBook: "=", charts: "="},
        link: function (i, d, n) {
            function s(t, a) {
                var e = _.filter(i.chartBook.dataSetBindings, function (e) {
                    return e.l.dataset == t.dataset && e.r.field == a.field || e.r.dataset == t.dataset && e.l.field == a.field || e.l.dataset == a.dataset && e.r.field == t.field || e.r.dataset == a.dataset && e.l.field == t.field
                });
                e.length > 0 && (i.isDuplicate = !0)
            }

            var r = [];
            _.each(i.charts, function (t) {
                t.dataset && -1 === _.indexOf(r, t.dataset.id) && r.push(t.dataset.id)
            }), r.length && e.getDataSets(r.join(",")).then(function (t) {
                i.dataSets = _.sortBy(t, "name"), i.dataSetMap = {}, _.each(i.dataSets, function (t) {
                    i.dataSetMap[t.id] = t.name
                })
            }, function (a) {
                t.pop("error", "", "获取图表使用的数据集失败")
            }), i.isDuplicate = !1, i.dataDragStart = function (t, a, e) {
                t.setData("field", {name: a.name, type: a.type, dataSetId: e.id})
            }, i.dataDragEnter = function (t) {
                var a = $(t.target).attr("ind").split("-"), e = $(t.source).parent().attr("ind").split("-"), d = {
                    dataset: i.dataSets[e[0]].id,
                    field: i.dataSets[e[0]].fields[e[1]].name
                }, n = {dataset: i.dataSets[a[0]].id, field: i.dataSets[a[0]].fields[a[1]].name};
                s(d, n), i.isDuplicate || $(t.target).addClass("story-data-dragenter")
            }, i.dataDragLeave = function (t) {
                return i.isDuplicate ? void(i.isDuplicate = !1) : void $(t.target).removeClass("story-data-dragenter")
            }, i.dataDrop = function (t) {
                if (i.isDuplicate)return void(i.isDuplicate = !1);
                $(t.target).removeClass("story-data-dragenter");
                var a = $(t.target).attr("ind").split("-"), e = $(t.source).parent().attr("ind").split("-"), d = {
                    dataset: i.dataSets[e[0]].id,
                    field: i.dataSets[e[0]].fields[e[1]].name
                }, n = {dataset: i.dataSets[a[0]].id, field: i.dataSets[a[0]].fields[a[1]].name};
                i.chartBook.dataSetBindings.push({l: d, r: n})
            }, i.hasBinding = function (t, a) {
                return _.filter(i.chartBook.dataSetBindings, function (e) {
                        return e.l.dataset === t.id && e.l.field === a.name || e.r.dataset === t.id && e.r.field === a.name
                    }).length > 0
            }, i.showBindings = function (t, e) {
                i.getBindings(t, e);
                a.open({
                    templateUrl: "modules/story/views/story-data-bindings.html",
                    scope: i,
                    controller: ["$scope", "$modalInstance", function (t, a) {
                        t.submit = function () {
                            a.close()
                        }
                    }],
                    size: "md",
                    backdrop: "static"
                })
            }, i.getBindings = function (t, a) {
                i.currentBindings = _.filter(i.chartBook.dataSetBindings, function (e) {
                    return e.l.dataset === t.id && e.l.field === a.name || e.r.dataset === t.id && e.r.field === a.name
                })
            }, i.removeDataBinding = function (t) {
                i.chartBook.dataSetBindings.splice(t, 1)
            };
            $(".story-data-bindings");
            i.bindingDragLeave = function (t) {
                $(t.source).fadeOut(), $(t.source).on("dragstop", function () {
                    $(t.source).off("dragstop");
                    var a = $(t.source).attr("ind");
                    i.chartBook.dataSetBindings.splice(a, 1)
                })
            }, i.bindingDragEnter = function (t) {
                $(t.source).fadeIn(), $(t.source).off("dragstop")
            }, i.dismiss = function () {
                $modalInstance.dismiss()
            }
        }
    }
}]);