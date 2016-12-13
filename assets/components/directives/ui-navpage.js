/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").directive("profileScroll", ["$window", function (i) {
    return {
        restrict: "A", link: function (s, e) {
            var t = $(window).height() - 68;
            e.slimscroll({height: t + "px"});
            var c = angular.element(i);
            c.on("resize.profile", function () {
                var i = $(window).height() - 68;
                e.slimScroll({destroy: !0}), $(e).css("height", i + "px"), e.slimscroll({height: i + "px"})
            }), s.$on("$destroy", function () {
                c.off("resize.profile")
            })
        }
    }
}]), app.directive("cspagepart", ["$window", function (i) {
    return {
        restrict: "A", link: function (s, e) {
            var t = $(window).height() - 102, c = t - 84 - 102, n = t;
            $(window).width();
            $("#cs-left").css("height", t), $("#cs-left").slimscroll({height: t}), $("#cs-middle").css("height", c), $("#cs-middle").slimscroll({height: c}), $("#cs-right").css("height", n), $("#cs-chart").css("height", n - 55), $("#cs-handson").css("height", n - 55);
            var h = angular.element(i);
            h.bind("resize", function () {
                var i = $(window).height() - 102, s = i - 84 - 102, e = i;
                $("#cs-left").css("height", i), $("#cs-left").slimscroll({height: i}), $("#cs-middle").css("height", s), $("#cs-middle").slimscroll({height: s}), $("#cs-right").css("height", e), $("#cs-chart").css("height", e - 55), $("#cs-handson").css("height", e - 55)
            })
        }
    }
}]), app.directive("resourceThumbMask", function () {
    return {
        restrict: "A", link: function (i, s) {
            s.on("mouseover", function () {
                s.addClass("showNoTransparent")
            }).on("mouseout", function () {
                s.addClass("showTransparent")
            })
        }
    }
});