/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.chartedit", ["dataviz.chartedit.chart", "dataviz.chartedit.field", "dataviz.chartedit.databind", "dataviz.chartedit.chartselect", "dataviz.chartedit.option", "dataviz.chartedit.theme", "dataviz.chartedit.menubar", "common.dvAccordion", "common.utils.directive"]).config(["$stateProvider", function (t) {
    t.state("app.charting_edit", {
        url: "/charting_edit/{projectId}/{projectName}/{chartId}",
        templateUrl: "modules/chartedit/chartedit.html",
        resolve: {
            deps: ["$ocLazyLoad", function (t) {
                return t.load(["modules/chartedit/chart/chart.js"])
            }]
        }
    })
}]).constant("charteditConfig", {
    rest: {
        datasets: charts_server + "/service/datasets/info/",
        chartData: charts_server + "/service/chartdata/calculate/chart/",
        dataset: charts_server + "/service/dataset/info/",
        chart: charts_server + "/service/chartinstance/object/",
        theme: charts_server + "/service/themes/data"
    },
    project: {id: "63d19a97-0807-4883-96b8-bc111ed89744", name: "DataInsight"},
    chartId: "bc7376a7-a793-4da0-83d6-a8d0614dbd37",
    theme: {show: !0, currentThemeId: 0},
    dataset: {
        showDatasetList: !0, setDataset: function () {
        }
    },
    chartData: {
        getChartDataByRest: !0, getBindData: function (t, a, e) {
        }
    }
}).run(function () {
    requirejs(["DataViz"], function (t) {
    })
});