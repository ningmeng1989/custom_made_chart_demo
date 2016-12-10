/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.simpleconditions.stringcondition",[]).factory("stringConditionService",["$http","$q",function(e,t){return{getFieldValus:function(n){var i=t.defer();return e({method:"POST",url:charts_server+"/service/filtercondition/stringvalues",data:angular.toJson({field:n,dataset:null},!0)}).success(function(e){e.error?i.reject(e):i.resolve(e)}).error(function(e){i.reject(e)}),i.promise}}}]).directive("stringcondition",["$timeout","stringConditionService","toaster",function(e,t,n){return{restrict:"AE",scope:{model:"=",refreshData:"&"},templateUrl:"modules/simpleconditions/simplecondition/stringcondition/stringcondition.html",link:function(i){function o(){i.lastAddTime=new Date,e(function(){(new Date).getTime()-i.lastAddTime.getTime()>=300&&i.refreshData()},300)}i.model.context.routine.active&&t.getFieldValus(i.model.field).then(function(e){i.allValues=e.object},function(e){i.allValues=[],n.pop("error","提示","字段可选值加载失败")}),i.isSelected=function(e){return i.model.context.routine.matchValues.indexOf(e)>-1},i.changeValue=function(e){var t=i.model.context.routine.matchValues.indexOf(e);t>-1?i.model.context.routine.matchValues.splice(t,1):i.model.context.routine.matchValues.push(e)},i.model.context.routine.active&&i.$watch("model.context.routine.matchValues",function(e){o()},!0),i.model.context.wildcard.active&&(i.$watch("model.context.wildcard.matchType",function(e){"isEmpty"==e&&(i.model.context.wildcard.matchValue=""),o()}),i.$watch("model.context.wildcard.matchValue",function(e){"isEmpty"!=i.model.context.wildcard.matchType&&o()}))}}}]);