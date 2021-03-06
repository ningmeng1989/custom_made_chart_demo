/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").controller("storyMainCtrl", ["$scope", function (o) {
    o.broadcastEvent = function () {
        o.$broadcast("story-condition-changed")
    }
}]).controller("storySettingsCtrl", ["$rootScope", "$scope", "$modalInstance", "storyService", function (o, e, a, r) {
    e.form = {};
    var t = new Date, s = t.format("yyyy-MM-dd hh:mm:ss");
    e.form.modifiedOn = s;
    var n = o.userinfo.name || o.userinfo.loginName;
    e.form.author = n, e.isSaveAs ? (e.form.name = "", e.form.oldName = e.chartBook.name, e.form.header = "图册另存为") : e.chartBook.isTemp ? (e.form.name = e.form.oldName = "", e.form.header = "保存图册") : (e.form.name = "", e.form.oldName = e.chartBook.name, e.form.header = "图册重命名"), e.dismiss = function () {
        a.dismiss()
    }, e.submit = function () {
        if (!e.isSaveAs || e.chartBook.isTemp)e.chartBook.name = e.form.name, e.chartBook.isTemp = !1, e.chartBook.author = e.form.author, a.close(); else {
            var o = angular.copy(e.chartBook);
            o.id = "", o.name = e.form.name, o.author = e.form.author, a.close(o)
        }
    }
}]).controller("storyLabelsCtrl", ["$scope", "$modalInstance", "storyService", "toaster", "labels", function (o, e, a, r, t) {
    o.form = {
        labels: t, addLabel: function (o) {
            return -1 === _.indexOf(this.labels, o) ? (this.labels.push(o), !0) : !1
        }, addNewLabel: function () {
            this.newLabel && this.addLabel(this.newLabel) && (this.newLabel = "")
        }, removeLabel: function (o) {
            this.labels.splice(o, 1)
        }
    }, a.getLabels().then(function (e) {
        o.form.allLabels = e
    }, function () {
        r.pop("error", "", "获取标签失败")
    }), o.dismiss = function () {
        e.dismiss()
    }, o.submit = function () {
        e.close(o.form.labels)
    }
}]);