/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").directive("storyCharts", [function () {
    return {
        restrict: "AE", replace: !1, link: function (n, o, i) {
            function t() {
                $(window).off("resize", c)
            }

            n.$on("$destroy", function () {
                setTimeout(function () {
                    t()
                }, 0)
            });
            var e = o.parent(), r = {height: 0}, c = _.debounce(function () {
                o.slimScroll({destroy: !0}), r.height = e.height(), o.slimscroll(r)
            }, 200);
            setTimeout(function () {
                r.height = e.height(), o.slimscroll(r), $(window).on("resize", function () {
                    n.accordionGroupChart.open && c()
                }), n.$on("accordion-expand-done", function () {
                    e.height() !== r.height && c()
                })
            }, 0)
        }
    }
}]);