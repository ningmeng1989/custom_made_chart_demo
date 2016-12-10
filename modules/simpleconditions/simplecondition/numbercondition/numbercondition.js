/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.simpleconditions.numbercondition",["dataviz.slider"]).factory("numberConditionService",["$http","$q",function(e,t){return{getRange:function(n){var o=t.defer();return e({method:"POST",url:charts_server+"/service/filtercondition/numberrange",data:angular.toJson({field:n,dataset:null},!0)}).success(function(e){e.error?o.reject(e):o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}}]).directive("numbercondition",["$timeout","numberConditionService","toaster",function(e,t,n){return{restrict:"AE",scope:{model:"=",refreshData:"&"},templateUrl:"modules/simpleconditions/simplecondition/numbercondition/numbercondition.html",link:function(o){function a(){o.lastAddTime=new Date,e(function(){(new Date).getTime()-o.lastAddTime.getTime()>=300&&o.refreshData()},300)}"special"!=o.model.context.range.type&&t.getRange(o.model.field).then(function(e){o.range=e.object,o.range.min==o.range.max&&(o.range.max=o.range.min+1),"twoWay"==o.model.context.range.type&&(o.range.max<o.model.context.range.twoWay.max&&(o.range.max=o.model.context.range.twoWay.max),o.range.min>o.model.context.range.twoWay.min&&(o.range.min=o.model.context.range.twoWay.min)),"atLeast"==o.model.context.range.type&&o.range.min>o.model.context.range.atLeast.min&&(o.range.min=o.model.context.range.atLeast.min),"atMost"==o.model.context.range.type&&o.range.max<o.model.context.range.atMost.max&&(o.range.max=o.model.context.range.atMost.max)},function(e){n.pop("error","提示","最大值最小值加载失败")}),"twoWay"==o.model.context.range.type&&(o.$watch("model.context.range.twoWay.min",function(){a()}),o.$watch("model.context.range.twoWay.max",function(){a()})),"atMost"==o.model.context.range.type&&o.$watch("model.context.range.atMost.max",function(){a()}),"atLeast"==o.model.context.range.type&&o.$watch("model.context.range.atLeast.min",function(){a()}),"special"==o.model.context.range.type&&o.$watch("model.context.range.special.value",function(){a()})}}}]);