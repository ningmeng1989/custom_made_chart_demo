/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset.datasetpreview.columnrename",[]).controller("fieldrenameCtrl",["$scope","$modalInstance","field","fieldlist",function(e,n,i,a){e.field=i,e.isOkBtnDisabled=function(){if(_.isEmpty(e.field.name))return e.warning="*字段名称不能为空",!0;if(!e.field.name.match(/^[\w\u4e00-\u9fa5\|\-]+$/))return e.warning="*名称只能由汉字、数字、大小写字母及'_'和'-'组成",!0;for(var n=0,i=0;i<e.field.name.length;i++)n+=e.field.name.charCodeAt(i)>255?2:1;if(n>30)return e.warning="*名称不能多于15个汉字或30个字符",!0;for(var i in a)if(e.field.id!=a[i].id&&e.field.name==a[i].name)return e.warning="*字段名称不能重复",!0;return!1},e.tnInputKeydown=function(i){e.isOkBtnDisabled()||13!=i.keyCode||n.close(e.table),i.stopPropagation()},e.ok=function(){n.close(e.field)},e.cancel=function(){n.dismiss("cancel")}}]);