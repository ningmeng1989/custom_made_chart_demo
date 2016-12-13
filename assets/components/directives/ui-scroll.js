/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").directive("uiScrollTo", ["$location", "$anchorScroll", function (o, c) {
    return {
        restrict: "AC", link: function (n, i, l) {
            i.on("click", function (n) {
                o.hash(l.uiScrollTo), c()
            })
        }
    }
}]);