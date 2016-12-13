/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").controller("EditTextCtrl", ["$scope", "$modalInstance", "content", function (e, t, n) {
    e.form = {content: n}, e.dismiss = function () {
        t.dismiss()
    }, e.submit = function () {
        t.close(e.form.content)
    }
}]).controller("AddPageCtrl", ["$scope", "$modalInstance", function (e, t) {
    var n = /^https?:\/\//i;
    e.form = {url: "http://"}, e.dismiss = function () {
        t.dismiss()
    }, e.submit = function () {
        n.test(e.form.url) || (e.form.url = "http://" + e.form.url), t.close(e.form.url)
    }
}]).controller("InsertPageCtrl", ["$scope", "$modalInstance", function (e, t) {
    e.dismiss = function () {
        t.dismiss()
    }, e.submit = function () {
        t.close()
    }
}]).controller("AddImageCtrl", ["$scope", "$modal", "$modalInstance", "toaster", "storyImageService", "$rootScope", "storyConfig", "projectId", function (e, t, n, o, i, s, r, l) {
    function a() {
        c(), i.getImages(g, e.pageNO, l, e.searchText).then(function (t) {
            e.totalCount = t.total, e.totalPages = Math.ceil(t.total / g), e.images = t.items, e.useCustom ? e.selectedImageIndex = null : e.selectedImageIndex = 0, m()
        }, function (e) {
            o.pop("error", "", "图片获取失败"), m()
        })
    }

    function c() {
        $(".loading-img").show()
    }

    function m() {
        $(".loading-img").hide()
    }

    function u() {
        var n = $("#fileUpload").fileupload(d);
        n.on("fileuploadadd", function (n, i) {
            if (i.originalFiles[0].type && !d.acceptFileTypes.test(i.originalFiles[0].type))return void t.open({
                templateUrl: "tpl/charting/confirm_modal.html",
                controller: "ConfirmModalCtrl",
                size: "sm",
                resolve: {
                    msg: function () {
                        return "只支持png|jp(e)g|gif|bmp格式的图片"
                    }
                }
            });
            var r = i.originalFiles[0].name;
            if (r && !d.acceptFileTypes.test(r.substring(r.lastIndexOf("."))))return void t.open({
                templateUrl: "tpl/charting/confirm_modal.html",
                controller: "ConfirmModalCtrl",
                size: "sm",
                resolve: {
                    msg: function () {
                        return "只能上传图片格式文件"
                    }
                }
            });
            if (i.originalFiles[0].size && i.originalFiles[0].size > d.maxFileSize)return void t.open({
                templateUrl: "tpl/charting/confirm_modal.html",
                controller: "ConfirmModalCtrl",
                size: "sm",
                resolve: {
                    msg: function () {
                        return "图片大小不能超过3M"
                    }
                }
            });
            c();
            i.submit().success(function (t, n, i) {
                t.error && t.error.m ? o.pop("error", "图片上传失败", t.error.m) : (o.pop("success", "", "图片上传成功"), e.images.push(t.object), e.selectedImageIndex = e.images.length - 1);
                try {
                    e.$apply(function () {
                        m()
                    })
                } catch (s) {
                }
            }).error(function (t, n, i) {
                var r = t.status;
                if (401 === r)e.dismiss(), s.$emit("userIntercepted", "notLogin", t); else {
                    o.pop("error", "", "图片上传失败");
                    try {
                        e.$apply(function () {
                            m()
                        })
                    } catch (l) {
                    }
                }
            })
        })
    }

    var g = 12;
    e.pageNO = 0, e.imageStore = "", e.useCustom = !1, e.$watch("useCustom", function (t, n) {
        t ? e.selectedImageIndex = null : (e.selectedImageIndex = 0, e.imageStore = "")
    }), e.searchText = "", e.totalPages = 1, a(), e.canSubmit = function () {
        return angular.isNumber(e.selectedImageIndex) || e.imageStore
    }, e.searchImages = function () {
        e.pageNO = 0, a()
    }, e.nextPage = function () {
        e.pageNO < e.totalPages - 1 && (e.pageNO++, a())
    }, e.prevPage = function () {
        e.pageNO > 0 && (e.pageNO--, a())
    }, e.dismiss = function () {
        n.dismiss()
    }, e.submit = function () {
        angular.isNumber(e.selectedImageIndex) ? n.close(e.images[e.selectedImageIndex].src) : e.imageStore ? n.close(e.imageStore) : n.dismiss()
    };
    var d = {
        url: r.imageUrl + "?projectId=" + l,
        xhrFields: {withCredentials: !0},
        dataType: "json",
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i,
        maxFileSize: 3e6
    };
    setTimeout(function () {
        u()
    }, 0), e.selectImage = function (t) {
        e.selectedImageIndex !== t ? e.selectedImageIndex = t : e.selectedImageIndex = null
    }, e.removeImage = function (n, s, r) {
        r.stopPropagation();
        var l = t.open({
            templateUrl: "modules/common/operation-confirm/operation-confirm.html",
            size: "sm",
            controller: ["$scope", "$modalInstance", function (e, t) {
                e.message = "确定删除此图片吗？", e.dismiss = function () {
                    t.dismiss()
                }, e.submit = function () {
                    t.close()
                }
            }]
        });
        l.result.then(function () {
            i.removeImage(n).then(function () {
                e.images.splice(s, 1), o.pop("success", "", "图片删除成功"), e.images.length ? e.selectedImageIndex = 0 : e.selectedImageIndex = null
            }, function () {
                o.pop("error", "", "图片删除失败")
            })
        })
    }
}]);