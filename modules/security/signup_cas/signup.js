/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app.security.signup",["ui.router"]).config(["$stateProvider",function(u){u.state("access.signup",{url:"/signup",templateUrl:"modules/security/signup_cas/signup.html",resolve:{deps:["uiLoad","$ocLazyLoad",function(u,e){return e.load("toaster").then(function(){return u.load(["modules/security/signup/signup_controller.js"])})}]}})}]);