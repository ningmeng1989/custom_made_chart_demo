/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.share").factory("shareManager", ["$modal", "toaster", "shareResource", "$rootScope", function (e, r, t, o) {
    var n = /^[0-9a-zA-Z]{4}$/, s = {};
    s.shareType = {PUBLIC: 0, PRIVATE: 1, INSTATION: 2, COMMUNITY: 3}, s.dismiss = function () {
        s.modalInstance.dismiss()
    }, s.shareToWeixin = function () {
        $("#qrcodeDiv").fadeIn("fast")
    }, s.selectLink = function () {
        $("#shareLink").select()
    }, s.selectPass = function () {
        $("#sharePass").select()
    }, s.selectHtml = function () {
        $("#shareHtml").select()
    }, s.changePassword = function (e) {
        if (e) {
            if (s.newPass != s.pass) {
                if (!n.test(s.newPass))return r.pop("error", "", "分享密码是4位字母或数字的组合，请重新输入"), !1;
                t.changePass(s.code, s.newPass).then(function () {
                    r.pop("success", "", "修改分享密码成功"), s.pass = s.newPass
                }, function () {
                    r.pop("error", "", "修改分享密码失败")
                })
            }
        } else s.newPass = s.pass;
        return !0
    }, s.hideQRCode = function () {
        $("#qrcodeDiv").fadeOut("fast")
    }, s.revoke = function () {
        var o = e.open({
            templateUrl: "tpl/charting/shareRevokeConfirm.html",
            controller: "ShareRevokeCtrl",
            size: "sm"
        });
        o.result.then(function () {
            t.revoke(0, s.chartBook.id).then(function () {
                r.pop("success", "", "取消分享成功"), s.chartBook.sharing = null, s.modalInstance.close()
            }, function () {
                r.pop("error", "", "取消分享失败")
            })
        })
    }, s.preview = function () {
        window.open(s.shareLink)
    };
    var a = function (r, t) {
        s.code = r.code, s.shareLink = local_server + "/p.html?s=" + r.code, s.type = r.type, t ? s.pass = s.newPass = t : (delete s.pass, delete s.newPass), 1 === s.chartBook.type ? s.modalInstance = e.open({
            templateUrl: "tpl/charting/shareResultDemo.html",
            controller: "ShareResultCtrl",
            resolve: {
                Share: function () {
                    return s
                }
            }
        }) : s.modalInstance = e.open({
            templateUrl: "tpl/charting/shareResult.html",
            controller: "ShareResultCtrl",
            resolve: {
                Share: function () {
                    return s
                }
            }
        })
    };
    return {
        shareChartBook: function (o) {
            if (s.chartBook = o, o.sharing)o.sharing.type === s.shareType.PRIVATE ? t.getPass(o.sharing.code).then(function (e) {
                a(o.sharing, e)
            }, function () {
                r.pop("error", "", "获取分享失败")
            }) : a(o.sharing); else {
                if (1 == s.chartBook.type)return s.type = s.shareType.PUBLIC, void t.create(0, o.id, s.type).then(function (r) {
                    o.sharing = r, s.code = r.code, s.shareLink = local_server + "/p.html?s=" + r.code, s.modalInstance = e.open({
                        templateUrl: "tpl/charting/shareResultDemo.html",
                        controller: "ShareResultCtrl",
                        resolve: {
                            Share: function () {
                                return s
                            }
                        }
                    })
                }, function (e) {
                    "SEC-215" === e.c ? r.pop("error", "", "已经分享过了，不能重复分享") : r.pop("error", "", "添加分享失败")
                });
                var n = e.open({
                    templateUrl: "tpl/charting/shareMethod.html",
                    controller: "ShareMethodCtrl",
                    size: "sm"
                });
                n.result.then(function (n) {
                    s.type = n, t.create(0, o.id, n).then(function (r) {
                        o.sharing = r, s.code = r.code, s.shareLink = local_server + "/p.html?s=" + r.code, r.pass && (s.pass = r.pass, s.newPass = r.pass, delete o.sharing.pass), s.modalInstance = e.open({
                            templateUrl: "tpl/charting/shareResult.html",
                            controller: "ShareResultCtrl",
                            resolve: {
                                Share: function () {
                                    return s
                                }
                            }
                        })
                    }, function (e) {
                        "SEC-215" === e.c ? r.pop("error", "", "已经分享过了，不能重复分享") : r.pop("error", "", "添加分享失败")
                    })
                })
            }
        }
    }
}]).factory("shareResource", ["$resource", "$q", function (e, r) {
    var t = charts_server + "/service/resource/sharing", o = {
        query: {method: "GET", isArray: !1, url: t + "/password"},
        update: {method: "PUT", url: t + "/password"}
    }, n = e(t, null, o);
    return {
        create: function (e, t, o, s) {
            var a = r.defer();
            return n.save({type: e, id: t, shareType: o, pass: s}, {}, function (e) {
                e.error ? a.reject(e.error) : a.resolve(e.object)
            }, function (e) {
                a.reject(e)
            }), a.promise
        }, revoke: function (e, t) {
            var o = r.defer();
            return n.remove({type: e, id: t}, {}, function (e) {
                e.error ? o.reject(e.error) : o.resolve(e.object)
            }, function (e) {
                o.reject(e)
            }), o.promise
        }, getPass: function (e) {
            var t = r.defer();
            return n.query({code: e}, {}, function (e) {
                e.error ? t.reject(e.error) : t.resolve(e.object)
            }, function (e) {
                t.reject(e)
            }), t.promise
        }, changePass: function (e, t) {
            var o = r.defer();
            return n.update({code: e, pass: t}, {}, function (e) {
                e.error ? o.reject(e.error) : o.resolve()
            }, function (e) {
                o.reject(e)
            }), o.promise
        }
    }
}]).factory("sharingManager", ["$resource", "$q", function (e, r) {
    var t = charts_server + "/service/resource/sharing/resource", o = {
        query: {
            method: "GET",
            isArray: !1
        }
    }, n = e(t, {}, o);
    return {
        get: function (e) {
            var t = r.defer();
            return n.query({code: e}, {}, function (e) {
                e.error ? t.reject(e.error) : t.resolve(e.object)
            }, function (e) {
                t.reject(e)
            }), t.promise
        }
    }
}]);