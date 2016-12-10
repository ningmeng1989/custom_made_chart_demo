/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").directive("uiButterbar",["$rootScope","$anchorScroll",function(a,e){return{restrict:"AC",template:'<span class="bar"></span>',link:function(a,t,n){t.addClass("butterbar hide"),a.$on("$stateChangeStart",function(a){e(),t.removeClass("hide").addClass("active")}),a.$on("$stateChangeSuccess",function(a,e,n,s){a.targetScope.$watch("$viewContentLoaded",function(){t.addClass("hide").removeClass("active")})})}}}]);