/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").directive("uiToggleClass",["$timeout","$document",function(e,t){return{restrict:"AC",link:function(e,t,a){t.on("click",function(e){function l(e,t){for(var a=new RegExp("\\s"+e.replace(/\*/g,"[A-Za-z0-9-_]+").split(" ").join("\\s|\\s")+"\\s","g"),l=" "+$(t)[0].className+" ";a.test(l);)l=l.replace(a," ");$(t)[0].className=$.trim(l)}e.preventDefault();var n=a.uiToggleClass.split(","),s=a.target&&a.target.split(",")||Array(t),i=0;angular.forEach(n,function(e){var t=s[s.length&&i];-1!==e.indexOf("*")&&l(e,t),$(t).toggleClass(e),i++}),$(t).toggleClass("active")})}}}]);