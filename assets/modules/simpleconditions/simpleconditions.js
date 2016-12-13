/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.simpleconditions", ["app.simpleconditions.datetimecondition", "app.simpleconditions.numbercondition", "app.simpleconditions.stringcondition"]).directive("simpleconditions", ["$modal", "$rootScope", function (i, o) {
    return {
        restrict: "AE",
        scope: {model: "=", refreshData: "&"},
        templateUrl: "modules/simpleconditions/simpleconditions.html",
        link: function (i, o, n) {
        }
    }
}]);