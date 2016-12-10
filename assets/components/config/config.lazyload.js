/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("app").constant("JQ_CONFIG", {
    moment: ["bower_components/moment/moment.js"],
    screenfull: ["bower_components/screenfull/dist/screenfull.min.js"],
    slimScroll: ["bower_components/slimscroll/jquery.slimscroll.min.js"],
    sortable: ["bower_components/html5sortable/jquery.sortable.js"]
}).config(["$ocLazyLoadProvider", function (e) {
    e.config({
        debug: !0,
        events: !0,
        modules: [{
            name: "ui.select",
            files: ["bower_components/angular-ui-select/dist/select.min.js", "bower_components/angular-ui-select/dist/select.min.css"]
        }, {
            name: "angularFileUpload",
            files: ["bower_components/angular-file-upload/angular-file-upload.js"]
        }, {
            name: "ngImgCrop",
            files: ["bower_components/ngImgCrop/compile/minified/ng-img-crop.js", "bower_components/ngImgCrop/compile/minified/ng-img-crop.css"]
        }, {
            name: "toaster",
            files: ["bower_components/angularjs-toaster/toaster.js", "bower_components/angularjs-toaster/toaster.min.css"]
        }]
    })
}]);