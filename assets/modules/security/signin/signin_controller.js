/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
"use strict";
angular.module("app").controller("SigninFormController", ["$scope", "$http", "$state", "$stateParams", "$rootScope", "toaster", "checkUser", "Idle", "$localStorage", "$interval", function (r, o, t, e, a, c, n, i, s, u) {
    function p() {
        var r = {
            method: "GET",
            url: charts_server + "/service/users/account/this",
            headers: {"Content-Type": "text/plain;charset=utf-8"}
        };
        o(r).then(function (r) {
            r.data.error ? c.pop("error", "", "系统出错，请稍后重试") : (a.userinfo = angular.copy(r.data.object), a.userinfo.isLogin = !0, i.watch())
        }, function (r) {
            c.pop("error", "", "系统出错，请稍后重试")
        })
    }

    r.user = {}, r.authError = null, r.currentSelectedTab = e.inOrUp, r.signup_form = {}, r.loginEmail = "", r.verifyCodePlaceholder = "请输入手机/邮箱收到的验证码", r.user.email = "demo", r.user.password = "demo", s.bindStatus = "";
    var h = /^1\d{10}$/;
    r.$watch("type", function (o, t) {
        1 == o ? r.verifyCodePlaceholder = "请输入手机收到的验证码" : 0 == o && (r.verifyCodePlaceholder = "请输入注册邮箱收到的验证码")
    }), r.charts_server = charts_server, r.sn = 0, 1 == r.currentSelectedTab && (r.captcha_src = charts_server + "/jcaptcha?s=" + r.sn++ % 10), r.onChangeCaptcha = function () {
        r.captcha_src = charts_server + "/jcaptcha?s=" + r.sn++ % 10
    }, r.showChartTab = function (o) {
        r.currentSelectedTab = o, 1 == r.currentSelectedTab && (r.captcha_src = charts_server + "/jcaptcha?s=" + r.sn++ % 10)
    }, r.checkEmail = function () {
        var o = n.checkEmail(r.user.email);
        o ? r.authError = o : r.authError = null
    }, r.clearErrorTip = function () {
        r.authError = null
    }, r.checkPassword = function () {
        var o = n.checkEmail(r.user.email);
        o ? r.authError = o : r.authError = null
    }, r.getVerifyCode = function () {
        r.inProcess = !0, r.signUpError = null, h.test(r.signup_form.email) ? r.type = 1 : r.type = 0;
        var t = {
            method: "POST",
            url: charts_server + "/service/registration/getcode",
            headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
            data: "account=" + r.signup_form.email + "&type=" + r.type + "&captcha=" + r.signup_form.captcha
        };
        o(t).then(function (o) {
            if (r.inProcess = !1, o.data.error)r.signUpError = o.data.error.m, r.signUpErrorCode = o.data.error.c; else {
                if (r.signUpError = null, r.signUpErrorCode = -1, 0 == r.type) {
                    c.pop("success", "", "验证码已发送到您的邮箱里,请查看");
                    var t = !1, e = r.signup_form.email.split("@")[1];
                    for (var a in l)a == e && (r.loginEmail = l[e], t = !0);
                    t || (r.loginEmail = "http://www.baidu.com/s?wd=" + e)
                } else c.pop("success", "", "验证码已发送到您的手机,请查收");
                r.onChangeCaptcha(), r.coolingDown = !0;
                var n = 120;
                $("#getcode").text(n + "s后重发");
                var i = u(function () {
                    n--, n ? $("#getcode").text(n + "s后重发") : (u.cancel(i), r.coolingDown = !1, $("#getcode").text("获取验证码"))
                }, 1e3)
            }
        }, function (o) {
            r.inProcess = !1, c.pop("error", "", "服务器出错，请稍后重试")
        })
    }, r.doGetUserInfoSuccess = function (r, o) {
        a.userinfo = angular.copy(r.data.object), a.userinfo.isLogin = !0, i.watch(), t.go("app.project")
    }, r.goWeiboAuth = function () {
        o.get(charts_server + "/service/oauth2/weiboAuth").then()
    }, r.goQQAuth = function () {
        o.get(charts_server + "/service/oauth2/qqAuth")
    }, r.signup = function () {
        if (r.signUpError = null, r.signup_form.pwd != r.signup_form.repeatPassword)return void c.pop("error", "", "两次输入的密码不一致");
        var e = {
            method: "POST",
            url: charts_server + "/service/registration/adduser",
            headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
            data: "username=" + r.signup_form.username + "&account=" + r.signup_form.email + "&password=" + CryptoJS.SHA256(r.signup_form.pwd) + "&code=" + r.signup_form.verifyCode + "&type=" + r.type
        };
        o(e).then(function (t) {
            if (!t.data.error) {
                a.setEmail(r.signup_form.email);
                var e = {
                    method: "POST",
                    url: charts_server + "/login",
                    headers: {"Content-Type": "application/x-www-form-urlencoded"},
                    data: "account=" + r.signup_form.email + "&password=" + r.signup_form.pwd
                };
                return o(e)
            }
            r.signUpError = t.data.error.m, r.signUpErrorCode = t.data.error.c
        }, function (o) {
            r.signupError = "系统出错，请稍后重试", r.signUpErrorCode = -1
        }).then(function (o) {
            o && (o.data.error ? (r.signUpError = o.data.error.m, r.signUpErrorCode = o.data.error.c) : (p(), t.go("app.project")))
        }, function (o) {
            r.signupError = "系统出错，请稍后重试", r.signUpErrorCode = -1
        })
    };
    var l = {
        "tubiaoxiu.com": "http://mail.tubiaoxiu.com",
        "qq.com": "http://mail.qq.com",
        "gmail.com": "http://mail.google.com",
        "sina.com": "http://mail.sina.com.cn",
        "163.com": "http://mail.163.com",
        "126.com": "http://mail.126.com",
        "yeah.net": "http://www.yeah.net/",
        "sohu.com": "http://mail.sohu.com/",
        "tom.com": "http://mail.tom.com/",
        "sogou.com": "http://mail.sogou.com/",
        "139.com": "http://mail.10086.cn/",
        "hotmail.com": "http://www.hotmail.com",
        "live.com": "http://login.live.com/",
        "live.cn": "http://login.live.cn/",
        "live.com.cn": "http://login.live.com.cn",
        "189.com": "http://webmail16.189.cn/webmail/",
        "yahoo.com.cn": "http://mail.cn.yahoo.com/",
        "yahoo.cn": "http://mail.cn.yahoo.com/",
        "eyou.com": "http://www.eyou.com/",
        "21cn.com": "http://mail.21cn.com/",
        "188.com": "http://www.188.com/",
        "foxmail.com": "http://www.foxmail.com",
        "outlook.com": "http://www.outlook.com",
        "neusoft.com": "http://mail.neusoft.com"
    };
    r.signin = function () {
        r.authError = null, r.inputboxBorderColor = "#cfdadd";
        var e = {
            method: "POST",
            url: charts_server + "/login",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            // data: "account=" + r.user.email + "&password=" + r.user.password
            data: "account=" + 'demo' + "&password=" + 'demo'
        };
        o(e).then(function (e) {
            e.data.error ? (r.showErrorInfo = !0, r.authError = e.data.error.m, r.inputboxBorderColor = "red") : (p(), o({
                method: "put",
                url: charts_server + "/service/chartdata/tz",
                data: {offset: (new Date).getTimezoneOffset()}
            }), t.go("app.project"))
        }, function (o) {
            r.authError = "系统出错，请稍后重试"
        })
    }, r.goThirdPartyLogin = function (r) {
        0 == r ? window.location = charts_server + "/service/oauth2/weiboAuth" : 1 == r ? window.location = charts_server + "/service/oauth2/qqAuth" : 2 == r && (window.location = charts_server + "/service/oauth2/weixinAuth")
    };
    r.signin();

}]);