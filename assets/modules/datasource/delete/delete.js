/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.datasource.delete", []).controller("deleteCtrl", ["$scope", "$modalInstance", function (e, o) {
    e.ok = function () {
        o.close()
    }, e.dismiss = function () {
        o.dismiss()
    }
}]);