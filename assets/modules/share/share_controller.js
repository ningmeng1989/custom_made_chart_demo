/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.share").controller("ShareMethodCtrl", ["$scope", "$modalInstance", "$rootScope", function (e, o, n) {
    e.isAdministrator = "c5feb87d-7d73-401d-ba2f-afb102d4b95e" === n.userinfo.userid, e.dismiss = function () {
        o.dismiss()
    }, e.share = function (n) {
        e.shareToCommunity && 0 === n ? o.close(3) : o.close(n)
    }, e.shareToCommunity = !0
}]).controller("ShareRevokeCtrl", ["$scope", "$modalInstance", function (e, o) {
    e.dismiss = function () {
        o.dismiss()
    }, e.close = function () {
        o.close()
    }
}]).controller("ShareResultCtrl", ["$scope", "$modal", "shareResource", "$modalInstance", "toaster", "$timeout", "Share", function (e, o, n, r, t, i, s) {
    e.Share = s, s.type !== s.shareType.PRIVATE && (e.weiboShareURL = "http://service.weibo.com/share/share.php?appkey=1645969122&&language=zh_cn&addition=simple&type=icon&title=" + encodeURIComponent("快来看看我制作的图册 " + e.Share.chartBook.name) + "&pic=" + e.Share.chartBook.iconStore.replace("=", "%3D") + "&url=" + encodeURIComponent(e.Share.shareLink) + "&ralateUid=5641589175&picSearch=false", e.qqShareURL = function () {
        var e = {
            url: s.shareLink,
            desc: "来看看我用图表秀做的图册吧",
            pics: s.chartBook.iconStore,
            site: "图表秀",
            style: "202",
            width: 24,
            height: 24
        }, o = [];
        for (var n in e)o.push(n + "=" + encodeURIComponent(e[n] || ""));
        return "http://connect.qq.com/widget/shareqq/index.html?" + o.join("&")
    }(), e.qzoneShareURL = function () {
        var e = {
            url: s.shareLink,
            showcount: "0",
            desc: "来看看我用图表秀做的图册吧：" + s.shareLink,
            pics: s.chartBook.iconStore,
            site: "图表秀",
            style: "202",
            width: 24,
            height: 24
        }, o = [];
        for (var n in e)o.push(n + "=" + encodeURIComponent(e[n] || ""));
        return "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + o.join("&")
    }(), e.viewHtml = function () {
        e.showHtml = !0, i(function () {
            $("#copy-html").clipboard({
                path: "js/lib/jquery.clipboard.swf", copy: function () {
                    var e = $("#shareHtml").text();
                    return t.pop("success", "", "复制成功"), e
                }
            })
        }, 0)
    }), i(function () {
        $("#copy-link").clipboard({
            path: "js/lib/jquery.clipboard.swf", copy: function () {
                var e = "";
                return s.isPrivate && (e += "链接："), e += s.shareLink, s.isPrivate && (e += "  密码：" + s.pass), t.pop("success", "", "复制成功"), e
            }
        })
    }, 0)
}]);