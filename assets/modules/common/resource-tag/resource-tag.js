/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("common.resourceTag", []).constant("resourceTagConfig", {tagsUrl: charts_server + "/service/project/tags?projectId="}).controller("resourceTagCtrl", ["$scope", "$modalInstance", "toaster", "$http", "resourceTagConfig", "projectId", "tags", function (t, s, o, r, a, e, n) {
    t.form = {
        tags: n, addTag: function (t) {
            return -1 === _.indexOf(this.tags, t) ? (this.tags.push(t), !0) : !1
        }, addNewTag: function () {
            this.newTag && this.addTag(this.newTag) && (this.newTag = "")
        }, removeTag: function (t) {
            this.tags.splice(t, 1)
        }
    }, r.get(a.tagsUrl + e).then(function (s) {
        s.data.error ? o.pop("error", "", "获取标签失败") : t.form.allTags = s.data.object
    }, function (t) {
        o.pop("error", "", "获取标签失败")
    }), t.dismiss = function () {
        s.dismiss()
    }, t.submit = function () {
        s.close(t.form.tags)
    }
}]);