/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.dataset.datasetpreview.fieldEdit",[]).controller("fieldEditCtrl",["$scope","$modalInstance","field","fieldlist",function(i,e,n,t){i.editField=n,i.isOkBtnDisabled=function(){if(_.isEmpty(i.editField.name))return i.warning="*字段名称不能为空",!0;if(!i.editField.name.match(/^[\w\u4e00-\u9fa5\|\-]+$/))return i.warning="*名称只能由汉字、数字、大小写字母及'_'和'-'组成",!0;for(var e=0,n=0;n<i.editField.name.length;n++)e+=i.editField.name.charCodeAt(n)>255?2:1;if(e>30)return i.warning="*名称不能多于15个汉字或30个字符",!0;for(var n in t)if(i.editField.id!=t[n].id&&i.editField.name==t[n].name)return i.warning="*字段名称已存在",!0;return!!_.isEmpty(i.editField.fieldRole)},i.isEntityField=function(){var e=i.editField.id.split(".");return 2==e.length},i.ok=function(){e.close(i.editField)},i.cancel=function(){e.dismiss("cancel")}}]);