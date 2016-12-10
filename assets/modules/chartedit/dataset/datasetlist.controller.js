/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit").controller("datasetList",["$scope","$modalInstance","chartEditService",function(t,e,a){var i;t.form={header:"选择数据"},a.getDataSetList(t.project.id).then(function(e){t.datasetList=e}),t.selectDataset=function(e){i=_.findWhere(t.datasetList,{id:e})},t.submit=function(){e.close(i)},t.dismiss=function(){e.close()}}]);