/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
"use strict";
angular.module("app").controller("AppCtrl", ["$scope", "$rootScope", "$translate", "$localStorage", "$window", "$location", "$state", "$http", function (e, t, n, i, o, s, a, r) {
    function p(e) {
        var t = e.navigator.userAgent || e.navigator.vendor || e.opera;
        return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(t)
    }

    var l = !!navigator.userAgent.match(/MSIE/i);
    l && angular.element(o.document.body).addClass("ie"), p(o) && angular.element(o.document.body).addClass("smart");
    var c = angular.element(o);
    c.bind("resize", function () {
        $(document).innerWidth() < 1100 && (t.app.settings.asideFolded = !0)
    }), t.local_server = local_server, t.showPic = !0, t.app = {
        name: "图表秀",
        version: "1.0.0",
        color: {
            primary: "#7266ba",
            info: "#23b7e5",
            success: "#27c24c",
            warning: "#fad733",
            danger: "#f05050",
            light: "#e8eff0",
            dark: "#3a3f51",
            black: "#1c2b36"
        },
        settings: {
            themeID: 12,
            navbarHeaderColor: "app-header-bg",
            navbarCollapseColor: "app-header-bg",
            asideColor: "app-aside-bg b-r",
            headerFixed: !0,
            asideFixed: !1,
            asideFolded: !1,
            rightFolded: !1,
            asideDock: !1,
            container: !1
        }
    }, t.userinfo = {
        email: "",
        isLogin: !1,
        avatar: "",
        limit: {bookcount: 20, pagecount: 30},
        basic: {
            realname: {content: "", secret: 0},
            username: {content: ""},
            gender: {content: 0, secret: 0},
            address: {province: "", city: "", secret: 0},
            tel: {content: ""},
            email: {content: ""},
            bio: {content: ""}
        },
        login: {local: "", type: "0", weibo: "", weiboName: "", qq: "", qqName: "", weixin: "", weixinName: ""},
        contact: {weibo: "", qq: ""},
        bind_account: {weibo: "", qq: ""}
    }, t.setEmail = function (e) {
        t.userinfo.email = e, t.userinfo.isLogin = !0
    }, t.setAvator = function (e) {
        t.userinfo.avatar = e
    }, t.clearUserInfo = function () {
        t.userinfo = {}, i.userinfo = null
    }, t.logout = function () {
        t.clearUserInfo(), a.go("access.signin"), r.get(charts_server + "/logout")
    }, e.showHelp = function () {
        var n = [];
        if ($(".trip-0").length > 0 && $(".trip-0")[0].clientHeight > 0)n = [{
            sel: $(".trip-0.step1"),
            content: "<span>针对当前的图表设置联动</span>",
            position: "s",
            expose: !0,
            url: help_server + "/book/edit/menu/base.html#linkset"
        }]; else if ($(".trip-1").length > 0)n = [{
            sel: $(".trip-1 .step1"),
            content: "<span>图表秀官方的样例，可以另存成您自己的</span>",
            position: "s",
            expose: !0,
            url: help_server + "/book/look/demolook.html"
        }, {
            sel: $(".trip-1 .step2"),
            content: "<span>新建图册，开始创建之旅</span>",
            url: help_server + "/book/look/new.html",
            position: "s",
            expose: !0
        }]; else if ($(".trip-2").length > 0 && $(".trip-2")[0].clientHeight > 0)n = [{
            sel: $(".trip-2.step1"),
            content: "<span>图册页操作区，可以添加、删除、复制、排序图册页</span>",
            position: "s",
            expose: !0,
            url: help_server + "/book/edit/navi/base.html"
        }, {
            sel: $(".trip-2.step2"),
            content: "<span>布局切换区，可以自由切换布局</span>",
            position: "s",
            expose: !0,
            url: help_server + "/book/edit/layout/base.html"
        }, {
            sel: $(".trip-2.step3"),
            content: "<span>主题切换区，选择您喜欢的主题</span>",
            position: "s",
            expose: !0,
            url: help_server + "/book/edit/theme/base.html"
        }]; else if ($(".trip-3").length > 0 && $(".trip-3")[0].clientHeight > 0)n = [{
            sel: $(".trip-3.step1"),
            content: "<span>左侧选择一个图表后，右侧会展现选择的图表样式以及图表的说明，点击确定按钮直接完成添加，也可直接进入编辑页面。</span>",
            position: "s",
            expose: !0,
            url: help_server + "/book/widget/chart/select.html"
        }]; else if ($(".trip-4").length > 0 && $(".trip-4")[0].clientHeight > 0) {
            n = [{
                sel: $(".trip-4.step1"),
                content: "<span>改变图表的数据</span>",
                position: "n",
                expose: !0,
                url: help_server + "/book/widget/chart/edit.html"
            }, {
                sel: $(".trip-4.step2"),
                content: "<span>改变图表的属性</span>",
                position: "n",
                expose: !0,
                url: help_server + "/book/widget/chart/edit.html#edit_option"
            }];
            var i = $("li.active:last").text().trim();
            if (CHART_PROPERTY_SECTION[i]) {
                var o = CHART_PROPERTY_SECTION[i];
                $(".tab-pane.active:last").find(".steps").each(function (e, i) {
                    var s = $(i), a = s.text();
                    if (a = a.substr(0, a.length - 1), o[a]) {
                        var r = $(document).innerHeight(), p = i.getBoundingClientRect();
                        if (p.top >= 170 && p.top + p.height <= r) {
                            var l = 2 === o[a].length ? help_server + "/chart/" + CHART_SECTION[t.tempSelectChartResource.compId] + "/base.html#" + o[a][1] : help_server + "/chart/public/" + o[a][1] + ".html#" + o[a][2];
                            n.push({sel: s, content: o[a][0], position: "w", expose: !0, url: l})
                        }
                    }
                })
            }
        }
        n.length > 0 && (e.trip1 = new Trip(n, {
            showNavigation: !1,
            showCloseBox: !1,
            animation: "fadeIn",
            tripTheme: "yeti",
            expose: !0,
            delay: -1
        }), e.trip1.startall())
    }, e.logout = function () {
        _.isUndefined(t.isSavedToServer) || t.isSavedToServer ? t.logout() : _.isEmpty(t.currentChartBookId) && t.logout()
    }, t.$on("$stateChangeStart", function (e, t, n, i, o) {
        "access.signin" == t.name || "access.signup" == t.name || "access.forgotpwd" == t.name || "oauth_weibo" == t.name || "oauth_qq" == t.name || "oauth_weixin" == t.name
    }), t.$on("userIntercepted", function (e) {
        t.userinfo.isLogin = !1, a.go("access.signin", {from: a.current.name, w: e})
    }), angular.isDefined(i.settings) ? e.app.settings = i.settings : i.settings = e.app.settings, e.$watch("app.settings", function () {
        e.app.settings.asideDock && e.app.settings.asideFixed && (e.app.settings.headerFixed = !0), i.settings = e.app.settings
    }, !0), _.isEmpty(i.userinfo) ? i.userinfo = t.userinfo : t.userinfo = i.userinfo, e.$watch("userinfo", function () {
        i.userinfo = e.userinfo
    }, !0), e.$on("IdleTimeout", function () {
        e.trip1 && e.trip1.cleanup(), e.logout()
    })
}]);