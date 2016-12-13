/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset.save", []).controller("saveCtrl", ["$scope", "$modalInstance", "dataset", "saveName", function (a, e, t, s) {
    a.saveName = s, a.dataset = t, a.isOkBtnDisabled = function () {
        return !!_.isEmpty(a.dataset.name)
    }, a.ok = function () {
        e.close(a.dataset)
    }, a.cancel = function () {
        e.dismiss("cancel")
    }
}]);