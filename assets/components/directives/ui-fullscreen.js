/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").directive("uiFullscreen", ["uiLoad", "JQ_CONFIG", "$document", "$window", function (e, a, n, l) {
    return {
        restrict: "AC",
        template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
        link: function (l, t, c) {
            t.addClass("hide"), e.load(a.screenfull).then(function () {
                screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./) && t.removeClass("hide"), t.on("click", function () {
                    var e;
                    c.target && (e = $(c.target)[0]), screenfull.toggle(e)
                }), n.on(screenfull.raw.fullscreenchange, function () {
                    screenfull.isFullscreen ? t.addClass("active") : t.removeClass("active")
                })
            })
        }
    }
}]);