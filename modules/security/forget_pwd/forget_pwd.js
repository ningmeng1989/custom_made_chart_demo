/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.security.forget",["ui.router","app.security.forget.service"]).config(["$stateProvider",function(e){e.state("access.forgotpwd",{url:"/forgotpwd",templateUrl:"modules/security/forget_pwd/forget_pwd.html",resolve:{deps:["uiLoad","$ocLazyLoad",function(e,t){return t.load("toaster").then(function(){return e.load(["modules/security/forget_pwd/forget_pwd.js"])})}]}})}]);