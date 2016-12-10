/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story", ["dataviz.dashboard", "dataviz.chartedit", "common.storyResource"]).constant("storyConfig", {
    restUrl: charts_server + "/service/chartbook/data/",
    imageUrl: charts_server + "/service/resource/image/",
    categoryUrl: charts_server + "/service/categories/data",
    chartListUrl: charts_server + "/service/chartinstances/info/byproject",
    dataSetsUrl: charts_server + "/service/datasets",
    themeUrl: charts_server + "/service/themes/data/"
});