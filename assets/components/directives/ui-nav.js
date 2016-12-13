/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").directive("uiNav", ["$timeout", "$window", function (e, a) {
    return {
        restrict: "AC", link: function (e, a, t) {
            var o, n = $(window), s = 768, i = $(".app-aside"), r = ".dropdown-backdrop";
            a.on("click", "a", function (e) {
                o && o.trigger("mouseleave.nav");
                var a = $(this);
                a.parent().siblings(".active").toggleClass("active"), a.next().is("ul") && a.parent().toggleClass("active") && e.preventDefault(), a.next().is("ul") || n.width() < s && $(".app-aside").removeClass("show off-screen")
            }), a.on("mouseenter", "a", function (e) {
                if (o && o.trigger("mouseleave.nav"), $("> .nav", i).remove(), !(!$(".app-aside-fixed.app-aside-folded").length || n.width() < s || $(".app-aside-dock").length)) {
                    var a, t = $(e.target), p = $(window).height(), v = 50, c = 150;
                    !t.is("a") && (t = t.closest("a")), t.next().is("ul") && (o = t.next(), t.parent().addClass("active"), a = t.parent().position().top + v, o.css("top", a), a + o.height() > p && o.css("bottom", 0), a + c > p && o.css("bottom", p - a - v).css("top", "auto"), o.appendTo(i), o.on("mouseleave.nav", function (e) {
                        $(r).remove(), o.appendTo(t.parent()), o.off("mouseleave.nav").css("top", "auto").css("bottom", "auto"), t.parent().removeClass("active")
                    }), $(".smart").length && $('<div class="dropdown-backdrop"/>').insertAfter(".app-aside").on("click", function (e) {
                        e && e.trigger("mouseleave.nav")
                    }))
                }
            }), i.on("mouseleave", function (e) {
                o && o.trigger("mouseleave.nav"), $("> .nav", i).remove()
            })
        }
    }
}]);