/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
"use strict";
app.controller("ModalInstanceCtrl", ["$scope", "$modalInstance", "items", function (e, a, n) {
    e.items = n, e.selected = {item: e.items[0]}, e.ok = function () {
        a.close(e.selected.item)
    }, e.cancel = function () {
        a.dismiss("cancel")
    }
}]), app.controller("ModalDemoCtrl", ["$scope", "$modal", "$log", function (e, a, n) {
    e.items = ["item1", "item2", "item3"], e.open = function (o) {
        var t = a.open({
            templateUrl: "myModalContent.html",
            controller: "ModalInstanceCtrl",
            size: o,
            resolve: {
                items: function () {
                    return e.items
                }
            }
        });
        t.result.then(function (a) {
            e.selected = a
        }, function () {
            n.info("Modal dismissed at: " + new Date)
        })
    }
}]), app.controller("TypeaheadDemoCtrl", ["$scope", "$http", function (e, a) {
    e.selected = void 0, e.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"], e.getLocation = function (e) {
        return a.get("http://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: e,
                sensor: !1
            }
        }).then(function (e) {
            var a = [];
            return angular.forEach(e.data.results, function (e) {
                a.push(e.formatted_address)
            }), a
        })
    }
}]);