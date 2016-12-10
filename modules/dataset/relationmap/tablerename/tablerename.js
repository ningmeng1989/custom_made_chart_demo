/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset.tablerename",[]).controller("tablerenameCtrl",["$scope","$modalInstance","table",function(e,n,t){e.table=t,e.isOkBtnDisabled=function(){return!!_.isEmpty(e.table.name)},e.tnInputKeydown=function(t){e.isOkBtnDisabled()||13!=t.keyCode||n.close(e.table),t.stopPropagation()},e.ok=function(){n.close(e.table)},e.cancel=function(){n.dismiss("cancel")}}]);