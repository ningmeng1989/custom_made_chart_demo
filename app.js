'use strict';

angular.module('app', [
    //angular 依赖
    "app.angularDependency",

    //UI 依赖
    "app.uiDependency",

    //Plugin 依赖
    "app.pluginDependency",

    "common",
    "app.security",
    "app.profile",
    "app.share",
    "dataviz.chartedit",
    "app.datasource",
    "app.project",
    "dataviz.story",
    "app.account",
    "app.simpleconditions",
    "app.filterconditions"
]);