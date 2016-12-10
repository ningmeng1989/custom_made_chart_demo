/**
 * Created by fuyw on 2016/8/9.
 */
angular.module("common.storyResource", [])
    .value("storyChartConfig", {
        chartUrl: charts_server + '/service/chartinstance/object/'
        //themeConfig: {}
    })
    .run(["$templateCache", "dashboardService", function ($templateCache, dashboardService) {
        $templateCache.put("template/story/story-chart-template.html",
            '<story-chart></story-chart>'
        );
        $templateCache.put("template/story/story-image-template.html",
            '<story-image></story-image>'
        );
        $templateCache.put("template/story/story-text-template.html",
            '<div class="w-full h-full scrollable">\n' +
            '<story-text class="widget-box-text"></story-text>\n' +
            '</div>\n'
        );
        $templateCache.put("template/story/story-page-template.html",
            '<story-page></story-page>'
        );

        dashboardService.setTemplateConfig({
            templateDir: 'template/story/',
            prefix: 'story-',
            suffix: '-template'
        });
    }])
    .directive("storyText", function () {
        return {
            restrict: "AE",
            scope: false,
            link: function (scope, element, attrs) {

                var unwatch = scope.$watch("widget.resource.content", function (newValue, oldValue) {
                    if (newValue) {
                        element.empty().append(newValue);
                    }
                });
            }
        }
    })
    .directive("storyPage", ["$sce", function ($sce) {
        return {
            restrict: "AE",
            scope: true,
            template: // 添加蒙层，避免图片被意外拖动
            '<div ng-if="editable" style="width: 100%; height: 100%; position: absolute; background-color: rgba(0,0,0,0)"/>' +
            '<iframe ng-src="{{trustSrc}}" class="w-full h-full" style="border: none"></iframe>',
            link: function (scope, element, attrs) {

                scope.$watch('widget.resource.url', function (newValue, oldValue) {
                    if (newValue) {
                        scope.trustSrc = $sce.trustAsResourceUrl(scope.widget.resource.url);
                    }
                });

            }
        }
    }])
    .directive("storyChart", ["$http", "toaster", "$q", "themeService", "$rootScope", "storyChartConfig", "storyChartService",
        function ($http, toaster, $q, themeService, $rootScope, config, storyChartService) {
            return {
                restrict: "AE",
                replace: true,
                scope: false,
                template: '<div dataviz-chart chart="chart" class="w-full h-full" ng-if="chart"></div>',
                link: function (scope, element, attrs) {

                    var resource = scope.widget.resource;

                    // 请求最新图表实例
                    var chartId = resource.id;
                    storyChartService.getChartInstance(chartId).then(function (chart) {

                        if (!resource.simpleJson || resource.compId != chart.compId) {
                            resource.compId = chart.compId;
                            // 图表属性在图册中复制一份
                            resource.simpleJson = {
                                option: chart.simpleJson.option
                            };
                            //resource = scope.widget.resource = angular.copy(chart);
                            //// 删除对于图册来说没用的数据
                            //delete resource.simpleJson.data;
                            //resource.simpleJson.dom = {};
                        } else if (resource.simpleJson.option) {
                            // 覆盖图表本来的属性
                            chart.simpleJson.option = resource.simpleJson.option;
                        }

                        scope.chart = chart;

                        var oldConditions = chart.simpleJson.data.conditions || [];
                        //
                        //scope.chart.simpleJson.data.conditions = oldConditions.concat(storyChartService.getChartBook().conditions);
                        //themeService.applyThemeToChart(storyChartService.getChartBook().themeId, scope.chart.simpleJson);
                        //scope.$broadcast("dataviz-chart-render");

                        var chartBookConditions = storyChartService.getChartBook().conditions,
                            chartDatasetId = scope.chart.dataset.id,
                            tempConds = [];

                        _.each(chartBookConditions, function (cbCond) {
                            if (chartDatasetId == cbCond.field.dataSetId) {
                                tempConds.push(cbCond);
                            }
                        });

                        scope.chart.simpleJson.data.conditions = oldConditions.concat(tempConds);
                        scope.chart.simpleJson.data.default = [];

                        scope.$on("story-condition-changed", function ($event) {
                            var chartBookConditions = storyChartService.getChartBook().conditions,
                                chartDatasetId = scope.chart.dataset.id,
                                tempConds = [];

                            _.each(chartBookConditions, function (cbCond) {
                                if (chartDatasetId == cbCond.field.dataSetId) {
                                    tempConds.push(cbCond);
                                }
                            });

                            scope.chart.simpleJson.data.conditions = oldConditions.concat(tempConds);
                            scope.chart.simpleJson.data.default = [];
                            scope.$broadcast("dataviz-chart-render");
                        });
                        /****modify by ChenZhuo 2016-9-29 图册主题没有覆盖图表主题的问题*******start*******/
                        if (storyChartService.getChartBook().themeId >= 0) {
                            scope.chart.themeId = storyChartService.getChartBook().themeId;
                        }
                        /****modify by ChenZhuo 2016-9-29 图册主题没有覆盖图表主题的问题*******end*******/
                            //scope.$on("story-theme-changed", function($event) {
                            //    themeService.applyThemeToChart(storyChartService.getChartBook().themeId, scope.chart.simpleJson);
                            //    scope.$broadcast("dataviz-chart-render");
                            //});

                        scope.$watch(function () {
                            return storyChartService.getChartBook().themeId;
                        }, function (newValue) {
                            if (newValue && newValue != "-1") {
                                themeService.applyThemeToChart(newValue, scope.chart);
                            }
                            scope.$broadcast("dataviz-chart-render", null, newValue);
                        });

                    }, function (error) {
                        toaster.pop('error', '', '获取图表实例失败');
                    });

                    //scope.$on("chart-theme-changed", function(themeId) {
                    //    themeService.applyThemeToChart(themeId, scope.chart.simpleJson);
                    //    scope.$broadcast("dataviz-chart-render");
                    //});

                    //scope.$on("chart-option-changed", function() {
                    //    scope.chart.simpleJson.option = resource.simpleJson.option;
                    //    scope.$broadcast("dataviz-chart-render");
                    //});

                    scope.updateChartOption = function () {
                        scope.chart.simpleJson.option = resource.simpleJson.option;
                        scope.$broadcast("dataviz-chart-render");
                    };
                }
            }
        }])
    .factory("storyChartService", ["$http", "$q", "storyChartConfig", function ($http, $q, config) {

        var cacheTimeout = 60 * 1000,
            cacheMaxSize = 50;

        var _cache = [],
            index = 0;

        var _chartBook = null;

        function getFromCache(instanceId) {
            for (var i = 0; i < _cache.length; i++) {
                if (_cache[i].object.id === instanceId) {
                    if (Date.now() - _cache[i].ts < cacheTimeout) {
                        return _cache[i].object;
                    } else {
                        _cache.splice(i, 1);
                        index >= i && --index;
                        return null;
                    }
                }
            }
            return null;
        }

        function addToCache(instance) {
            var cacheItem = {
                object: instance,
                ts: Date.now()
            };

            _cache[index] = cacheItem;

            if (++index >= cacheMaxSize) {
                index = 0;
            }
        }

        return {
            setChartBook: function (chartBook) {
                _chartBook = chartBook;
            },

            getChartBook: function () {
                return _chartBook;
            },

            getChartInstance: function (instanceId) {
                var defer = $q.defer();

                // 尝试从缓存中取
                var instance = getFromCache(instanceId);

                if (instance) {
                    defer.resolve(instance);
                } else {
                    $http.get(config.chartUrl + instanceId)
                        .then(function (response) {
                            if (response.data.error) {
                                defer.reject(response.data.error);
                            } else {
                                defer.resolve(response.data.object);
                                addToCache(response.data.object);
                            }
                        }, function (response) {
                            defer.reject(response);
                        });
                }

                return defer.promise;
            }
        }
    }])
    .directive("storyImage", function () {
        return {
            restrict: "AE",
            scope: true,
            template: // 添加蒙层，避免图片被意外拖动
            //'<div ng-if="editable" style="width: 100%; height: 100%; position: absolute; background-color: rgba(0,0,0,0)"/>' +
            //'<img ng-src="{{widget.resource.imageStore}}" ng-style="imageStyle" />',
                '<div class="w-full h-full" ng-style="imageStyle"></div>',
            link: function (scope, element, attrs) {

                scope.imageStyle = {
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat'
                };

                var unwatch1 = scope.$watch("widget.resource.imageStore", function (newValue, oldValue) {
                    if (newValue) {
                        scope.imageStyle.backgroundImage = 'url(' + newValue + ')';
                    }
                });

                var unwatch2 = scope.$watch("widget.resource.showMode", function (newValue, oldValue) {
                    switch (newValue) {
                        case 'contain':
                            scope.imageStyle.backgroundSize = 'contain';
                            break;
                        case 'stretch':
                            scope.imageStyle.backgroundSize = '100% 100%';
                            break;
                        case 'cover':
                            scope.imageStyle.backgroundSize = 'cover';
                            break;
                        case 'origin':
                            scope.imageStyle.backgroundSize = '';
                            break;
                    }
                });
            }
        }
    });
