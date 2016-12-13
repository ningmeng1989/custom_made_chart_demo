/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset.relationmap.relationedit", []).controller("relationeditCtrl", ["$scope", "$modalInstance", "datatableA", "datatableB", "relation", function (i, e, t, l, n) {
    i.datatableA = t, i.datatableB = l, i.relation = n, i.fieldAEditIndex = -1, i.fieldBEditIndex = -1, i.deleteRelationDetail = function (e) {
        i.relation.relationDetails.splice(e, 1)
    }, i.addEmptyRelationDetail = function () {
        i.relation.relationDetails.push({
            fieldA: "",
            fieldB: "",
            type: "="
        }), i.fieldAEditIndex = i.relation.relationDetails.length - 1, i.fieldBEditIndex = i.relation.relationDetails.length - 1
    }, 0 == i.relation.relationDetails.length && i.addEmptyRelationDetail(), i.isAddBtnShow = function () {
        for (var e in i.relation.relationDetails)if (_.isEmpty(i.relation.relationDetails[e].fieldA) || _.isEmpty(i.relation.relationDetails[e].fieldB))return !1;
        return !0
    }, i.isOkBtnDisabled = function () {
        if (0 == i.relation.relationDetails.length)return !0;
        for (var e in i.relation.relationDetails)if (_.isEmpty(i.relation.relationDetails[e].fieldA) || _.isEmpty(i.relation.relationDetails[e].fieldB))return !0;
        return !1
    }, i.editFieldA = function (e) {
        -1 != i.fieldAEditIndex && _.isEmpty(i.relation.relationDetails[i.fieldAEditIndex].fieldA) || (i.fieldAEditIndex = e)
    }, i.editFieldB = function (e) {
        -1 != i.fieldBEditIndex && _.isEmpty(i.relation.relationDetails[i.fieldBEditIndex].fieldB) || (i.fieldBEditIndex = e)
    }, i.blurFieldA = function (e) {
        _.isEmpty(i.relation.relationDetails[e].fieldA) || (i.fieldAEditIndex = -1)
    }, i.blurFieldB = function (e) {
        _.isEmpty(i.relation.relationDetails[e].fieldB) || (i.fieldBEditIndex = -1)
    }, i.ok = function () {
        e.close(i.relation)
    }, i.cancel = function () {
        e.dismiss("cancel")
    }
}]);