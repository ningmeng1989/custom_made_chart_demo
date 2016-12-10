(function (window) {

    var dataVizType = [
        "bullet",
        "dot",
        "pinterest",
        "tagcloud",
        "chord",
        "rose",
        "doubleline",
        "stream",
        "sunburst",
        "calendar"
    ];
    var echartsType = [
        "bar",
        "boxplot",
        "candlestick",
        "funnel",
        "gauge",
        "graph",
        "heatmap",
        "line",
        "map",
        "parallel",
        "pie",
        "radar",
        "sankey",
        "scatter",
        "effectScatter",
        "treemap",
        "lines"
    ];

    var chartmap = {
        "bullet": "Bullet",
        "chord": "Chord",
        "dot" :"Dot",
        "pinterest": "Pinterest",
        "tagcloud" : "Tagcloud",
        "rose" : "Rose",
        "doubleline" : "Doubleline",
        "stream": "Stream",
        "sunburst": "SunBurst",
        "calendar": "Calendar"
    };

    var symbolSize = [5,20];
    var graphSymbolSize = [5,70];
    var linesSymbolSize = [1,20];

    var ColorType = {
        BINDLENGTH: 0,
        UNIQLENGTH: 1,
        FIRSTBINDUNIQLENGTH: 2,
        UNIQLENGTHPLUS: 3
    };

    var scale = d3.scale.linear();

    var theme = {
        name: null
    };

    /******************DOM解析***********************/

    /**
     * 地理坐标系，城市，数据转换
     */
    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
        }
        return res;
    };
    /**
     * 航线图数据转换
     */
    var convertLinesData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var fromCoord = geoCoordMap[data[i].srcName];
            var toCoord = geoCoordMap[data[i].tarName];
            if (fromCoord && toCoord) {
                res.push([{
                    name: data[i].srcName,
                    coord: fromCoord
                }, {
                    name: data[i].tarName,
                    coord: toCoord
                }]);
            }
        }
        return res;
    };
    /**
     * 获取DOM节点
     */
    function _getDom (chartOptions) {
        var dom = chartOptions.dom;
        return _checkDom (dom);
    }
    /**
     * 检查DOM
     */
    function _checkDom (dom) {
        var ret = null;
        if (typeof dom === "string") {
            ret = document.getElementById(dom);
        } else if (dom.nodeName) { //DOM-element
            ret = dom;
        } else if (dom.size() > 0) {
            ret = dom[0];
        }
        if (!ret) {
            throw new Error("DataViz Parse Error # DOM Error : Please specify a correct node to render.");
        }
        return ret;
    }
    /******************DOM解析结束***********************/

    /******************属性解析***********************/

    /**
     * 获取图表真实属性
     * TODO
     * 1.考虑不准备显示的属性
     */
    function _getProperties (chartOptions) {
        return _getPropertiesValue(chartOptions.option.properties);
    }

    function _convertDVOpion(option){
        for (var p in option){
            if (p == ""){

            }
        }
    }
    /**
     * 递归遍历属性值
     */
    function _getPropertiesValue (properties) {
        var ret = {};
        for (var p in properties) {
//			if (!!properties[p].isShow) {
            if (properties[p].type[0] === "Array") {
                ret[p] = [];
                if (!!properties[p].items && !!properties[p].items.anyOf) {			//series
                    var seriesTemp = _getPropertiesValue(properties[p].items.anyOf);
                    for (var st in seriesTemp){
                        ret[p].push(seriesTemp[st]);
                    }
                }else if (!!properties[p].items) {							//xAxis, yAxis
                    ret[p].push(_getPropertiesValue(properties[p].items.properties));
                } else if (!!properties[p].properties) {							//xAxis, yAxis
                    ret[p].push(_getPropertiesValue(properties[p].properties));
                } else {
                    var arr = properties[p]["default"];
                    if (!!arr){
                        for(var m in arr){
                            ret[p].push(arr[m]);
                        }
                    }//else{
                    //	ret[p].push("");
                    //}
                }
            } else {
                if (!!properties[p].properties) {
                    ret[p] = _getPropertiesValue(properties[p].properties);
                } else {
                    ret[p] = properties[p]["default"];
                }
            }
//			}
        };
        return ret;
    }
    /**
     * 根据图表类型，组织图表对应的series对象
     */
    function _initSeriesArray (chartProps) {
        var series = [];

        chartProps.data = null;
        series.push(chartProps);

        return series;
    }

    /******************属性解析结束***********************/


    /******************系列值解析***********************/

    /**
     * 请求数据
     */
    function _ajaxData (url, mime, callback) {
        _xhr(url, mime, function (response) {
            if (response.readyState==4) {
                if (response.status==200){
                    callback.call(null, JSON.parse(response.responseText));
                }
            } else {
                callback.call(null, JSON.parse(response.statusText));
            }
        });
    }

//	/**
//	 * 获取数据描述中的字段元数据、图例标识
//	 */
//	function _getDimenMesNames (chartOptions, seriesType) {
//		var	legendName = [],
//			dimensionNames = [],
//			measureNames = [],
//			dimensions = chartOptions.data.properties.dimensions.properties,
//			measures = chartOptions.data.properties.measures.properties;
//		
//		for(var dp in dimensions) {
//			dimensionNames.push(dimensions[dp].name);
//		}
//		
//		for(var sp in measures) {
//			measureNames.push(measures[sp].name);
//		}
//		
//		if (seriesType == 1) {
//			legendName = dimensionNames;
//		} else {
//			legendName = measureNames;
//		}
//		
//		return {
//			dimensionNames: dimensionNames,
//			measureNames: measureNames,
//			legendName: legendName
//		};
//	}

    /**
     * 获取数据描述中的字段元数据、图例标识
     */
    function _getDimenMesNames (chartOptions) {
        var dataProps = chartOptions.data.properties,
            components = [],
            dpNames = [];

        for (var dp in dataProps) {
            components.push(dp);
            dpNames.push(dataProps[dp].name);
        }

        return {
            components: components,
            dpNames: dpNames
        };
    }

    /**
     * 获取图例值及系列值
     * TODO：图例不支持绑定多项
     */
    function _getSeriesLegendDatas (dataOption, seriesOptions, listData) {
        var	dataProperties = dataOption.properties,
            coordinateSystem = seriesOptions.coordinateSystem,
            angleAxisType = seriesOptions.angleAxisType,
            radiusAxisType = seriesOptions.radiusAxisType,
            xAxisType = seriesOptions.xAxisType,
            yAxisType = seriesOptions.yAxisType,
            series = dataProperties.value,
            angleAxis = dataProperties.angleAxis,
            radiusAxis = dataProperties.radiusAxis,
            geo = dataProperties.geo,
            size = dataProperties.size,
            legend = dataProperties.legend,
            indicator = dataProperties.indicator,
            parallelAxis = dataProperties.parallelAxis,

            seriesBinds = [],
            legendNames = [],
            legendBinds = [],
            indicatorBinds = [],
            geoNames = [],
            geoBinds = [],
            sizeBinds = [],
            xBinds = [],
            yBinds = [],
            angleAxisBinds = [],
            radiusAxisBinds = [],
            parallelAxisBinds = [],
            ret = {};

        ret.legendData = [],
            ret.seriesData = {},
            ret.angleAxisData = {},
            ret.radiusAxisData = {},
            ret.xAxisData = {},
            ret.yAxisData = {},
            ret.dimension= {}, // just for scatter2
            ret.dimData = [];

        if (!!dataProperties.xAxis) {
            _.each(dataProperties.xAxis.bind, function (d) {
                xBinds.push(d.name);
            });
        }
        if (!!dataProperties.yAxis) {
            _.each(dataProperties.yAxis.bind, function (d) {
                yBinds.push(d.name);
            });
        }
        if (!!size) {
            _.each(size.bind, function (d) {
                sizeBinds.push(d.name);
            });
        }
        if (!!indicator){
            _.each(indicator.bind,function (d){
                indicatorBinds.push(d.name);
            });
        }
        if (!!parallelAxis) {
            _.each(parallelAxis.bind, function (d) {
                parallelAxisBinds.push(d.name);
            });
        }
        if (!!series) {
            _.each(series.bind, function (d) {
                seriesBinds.push(d.name);
            });
        }
        if (!!geo) {
            _.each(geo.bind, function (d) {
                geoNames.push(d.name);
                geoBinds=_.uniq(_.pluck(listData, d.name));
            });
        }

        if (!!angleAxis) {
            _.each(angleAxis.bind, function (d) {
                radiusAxisBinds.push(d.name);
            });
        }

        if (!!radiusAxis) {
            _.each(radiusAxis.bind, function (d) {
                angleAxisBinds.push(d.name);
            });
        }

        if (!!legend && !!legend.bind.length) {
            _.each(legend.bind, function (d) {
                legendNames.push(d.name);
                legendBinds = _.uniq(_.pluck(listData, d.name));
            });
        }else if(_.contains(seriesOptions.types,"scatter") && (coordinateSystem == "cartesian2d")
            && !_.contains(seriesOptions.types,"boxplot")){

            ret.legendData = sizeBinds;
            if (xAxisType === "value" && yAxisType === "value"){
                ret.seriesData = _.map(listData, function (d) {
                    return [d[xBinds[0]],d[yBinds[0]]];
                });

            }else if (xAxisType === "value" && yAxisType === "category"){
                _.each(yBinds, function (aab) {
                    ret.yAxisData = _.uniq(_.pluck(listData, aab));
                });
                ret.seriesData = _.map(listData, function (d) {
                    if (!!sizeBinds && sizeBinds.length > 0){
                        return [d[xBinds[0]],_.indexOf(ret.yAxisData, d[yBinds[0]]),d[sizeBinds[0]]];
                    }
                    return [d[xBinds[0]],_.indexOf(ret.yAxisData, d[yBinds[0]])];
                });
            }else if (xAxisType === "category" && yAxisType === "value"){
                _.each(xBinds, function (aab) {
                    ret.xAxisData = _.uniq(_.pluck(listData, aab));
                });
                ret.seriesData = _.map(listData, function (d) {
                    if (!!sizeBinds && sizeBinds.length > 0){
                        return [d[xBinds[0]],_.indexOf(ret.xAxisData, d[yBinds[0]]),d[sizeBinds[0]]];
                    }
                    return [d[xBinds[0]],_.indexOf(ret.xAxisData, d[yBinds[0]])];
                });
            }else{
                _.each(xBinds, function (aab) {
                    ret.xAxisData = _.uniq(_.pluck(listData, aab));
                });
                _.each(yBinds, function (aab) {
                    ret.yAxisData = _.uniq(_.pluck(listData, aab));
                });
                ret.seriesData = _.map(listData, function (d) {
                    if (!!sizeBinds && sizeBinds.length > 0){
                        return [_.indexOf(ret.xAxisData,d[xBinds[0]]),_.indexOf(ret.yAxisData, d[yBinds[0]]),d[sizeBinds[0]]];
                    }
                    return [_.indexOf(ret.xAxisData,d[xBinds[0]]),_.indexOf(ret.yAxisData, d[yBinds[0]])];
                });
            }

        }else if(coordinateSystem == "geo"){
            var geobindtemp = sizeBinds;
            if (_.contains(seriesOptions.types,"heatmap")){
                geobindtemp = seriesBinds;
            }
            ret.legendData = geobindtemp;
            _.each(geobindtemp, function (vb) {
                ret.seriesData[vb] = _.map(listData, function (d) {
                    return {
                        "name": d[geoNames],
                        "value": d[geobindtemp]
                    };
                });
            });
        }
        else if(_.contains(seriesOptions.types,"map")){
            ret.legendData = seriesBinds;
            _.each(seriesBinds, function (vb) {
                ret.seriesData[vb] = _.map(listData, function (d) {
                    return {
                        "name": d[geoNames],
                        "value": d[vb]
                    };
                });
            });
        }else if(_.contains(seriesOptions.types,"heatmap")){
            ret.legendData = seriesBinds;

            _.each(xBinds, function (aab) {
                ret.xAxisData = _.uniq(_.pluck(listData, aab));
            });
            _.each(yBinds, function (aab) {
                ret.yAxisData = _.uniq(_.pluck(listData, aab));
            });
            ret.seriesData = _.map(listData, function (d) {
                return [_.indexOf(ret.xAxisData,d[xBinds[0]]),_.indexOf(ret.yAxisData, d[yBinds[0]]), d[seriesBinds[0]] || '-'];
            });
        }
        else if (coordinateSystem === "polar") {
            ret.legendData = sizeBinds;
            if (angleAxisType === "value" && radiusAxisType === "value") {
                ret.seriesData = _.map(listData, function (d) {
                    if(!!sizeBinds && sizeBinds.length > 0){
                        return [d[angleAxisBinds[0]], d[radiusAxisBinds[0]],d[sizeBinds[0]]];
                    }
                    return [d[angleAxisBinds[0]], d[radiusAxisBinds[0]]];
                });
            }

            if (angleAxisType === "category" && radiusAxisType === "value") {
                _.each(angleAxisBinds, function (aab) {
                    ret.angleAxisData = _.uniq(_.pluck(listData, aab));
                });

                ret.seriesData = _.map(listData, function (d) {
                    if(!!sizeBinds && sizeBinds.length > 0){
                        return [_.indexOf(ret.angleAxisData,d[angleAxisBinds[0]]), d[radiusAxisBinds[0]],d[sizeBinds[0]]];
                    }
                    return [_.indexOf(ret.angleAxisData,d[angleAxisBinds[0]]), d[radiusAxisBinds[0]]];
                });
            }

            if (angleAxisType === "value" && radiusAxisType === "category") {
                _.each(radiusAxisBinds, function (rab) {
                    ret.radiusAxisData = _.uniq(_.pluck(listData, rab));
                });

                ret.seriesData = _.map(listData, function (d) {
                    if(!!sizeBinds && sizeBinds.length > 0){
                        return [d[angleAxisBinds[0]], _.indexOf(ret.radiusAxisData,d[radiusAxisBinds[0]]),d[sizeBinds[0]]];
                    }
                    return [d[angleAxisBinds[0]], _.indexOf(ret.radiusAxisData,d[radiusAxisBinds[0]])];
                });
            }

            if (angleAxisType === "category" && radiusAxisType === "category") {
                _.each(radiusAxisBinds, function (rab) {
                    ret.radiusAxisData = _.uniq(_.pluck(listData, rab));
                });

                _.each(angleAxisBinds, function (aab) {
                    ret.angleAxisData = _.uniq(_.pluck(listData, aab));
                });

                ret.seriesData = _.map(listData, function (d) {
                    if(!!sizeBinds && sizeBinds.length > 0){
                        return [_.indexOf(ret.angleAxisData,d[angleAxisBinds[0]]), _.indexOf(ret.radiusAxisData,d[radiusAxisBinds[0]]),d[sizeBinds[0]]];
                    }
                    return [_.indexOf(ret.angleAxisData,d[angleAxisBinds[0]]), _.indexOf(ret.radiusAxisData,d[radiusAxisBinds[0]])];
                });
            }
        }
        else if(_.contains(seriesOptions.types,"gauge")){
            _.each(seriesBinds, function (vb) {
                ret.seriesData[vb] = _.map(listData, function (d) {
                    return {
                        "name": seriesBinds[0],
                        "value": d[seriesBinds]
                    };
                });
            });
        }else if (coordinateSystem === "parallel")	{
            ret.legendData = legendBinds;
            ret.dimData = seriesBinds;
            ret.seriesData = _.map(listData, function (d) {
                return  _.values(d);
            });
        }else if (_.contains(seriesOptions.types,"boxplot"))	{
            ret.legendData = seriesBinds;
            var xyName;
            if (!!xBinds.length){
                xyName = xBinds;
            }else{
                xyName = yBinds;
            }
            var xyObj = _.groupBy(listData,xyName[0]);
            var xyBinds = _.uniq(_.pluck(listData, xyName[0]));

            _.each(xyBinds,function(xyb){
                var a = [];
                _.each(seriesBinds, function (vb) {
                    a[vb] = _.pluck(xyObj[xyb], vb);
                });
                ret.seriesData[xyb]= a;
            });
        }else{
            ret.legendData = seriesBinds;

            _.each(seriesBinds, function (vb) {
                ret.seriesData[vb] = _.pluck(listData, vb);
            });
        }

        if (coordinateSystem === "cartesian2d" || coordinateSystem === "null"
            || coordinateSystem === "parallel" || coordinateSystem === "geo") {
            if (!!legendNames) {
                _.each(legendNames, function (ln) {
                    var legendObj = _.groupBy(listData, ln);

                    //直角坐标系下处理交叉表和冗余列表
                    if (coordinateSystem === "cartesian2d") {
                        if (_.contains(seriesOptions.types,"boxplot")){
                            var xyBinds;
                            if (!!xBinds.length){
                                xyBinds = xBinds;
                            }else{
                                xyBinds = yBinds;
                            }
                            _.each(legendBinds, function (lb) {
                                _.each(xyBinds,function(xyb){
                                    ret.legendData.push(lb);
                                    ret.seriesData[lb] = _.groupBy(legendObj[lb],xyb);
                                    _.each(ret.seriesData[lb],function(sd){
                                        _.each(sd,function(d,i){
                                            sd[i] = JSON.parse(_.values(_.omit(_.omit(d,xyBinds[0]),legendNames[0])));
                                        });
                                    });
                                });
                            });
                        }else if (_.contains(seriesOptions.types,"scatter")){
                            _.each(legendBinds, function (lb) {
                                ret.seriesData[lb] = _.map(legendObj[lb],function(lgb){
                                    return [
                                        lgb[xBinds[0]],lgb[yBinds[0]],lgb[sizeBinds[0]]
                                    ]
                                });
                                ret.legendData = legendBinds;
                                ret.dimension = 2;
                            });
                        }else{
                            _.each(legendBinds, function (lb) {
                                _.each(seriesBinds, function (vb) {
                                    ret.legendData.push(lb + "-" + vb);
                                    ret.seriesData[lb + "-" + vb] = _.pluck(legendObj[lb], vb);
                                });
                            });
                        }
                    }else if (coordinateSystem === "parallel")	{
                        //平行坐标
                        ret.legendData = legendBinds;
                        ret.dimData = seriesBinds;
                        _.each(legendBinds, function (lb) {
                            ret.seriesData[lb] = _.map(legendObj[lb], function (d) {
                                return  _.values(_.omit(d,legendNames[0]));
                            });
                        });
                    }
                    else if (_.contains(seriesOptions.types,"radar"))	{
                        //雷达图
                        ret.legendData = seriesBinds;
                        _.each(seriesBinds, function (vb) {
                            ret.seriesData[vb] = _.pluck(listData, vb);
                        });
                        ret.dimData[indicatorBinds[0]] = _.pluck(listData, indicatorBinds[0]);
                    }
                    else if (_.contains(seriesOptions.types,"map"))	{
                        //地图
                        ret.legendData = legendBinds;
                        _.each(legendBinds, function (lb) {
                            ret.seriesData[lb] = _.map(legendObj[lb], function (d) {
                                return {
                                    "name": d[geoNames],
                                    "value": d[seriesBinds]
                                };
                            });
                        });
                    }
                    else if (coordinateSystem === "null")	{
                        //饼图
                        ret.legendData = legendBinds;
                        ret.seriesData = _.map(listData, function (d) {
                            return {
                                "name": d[legendNames],
                                "value": d[seriesBinds]
                            };
                        });
                    }else if (coordinateSystem === "geo") {//scatter6
                        ret.legendData = legendBinds;
                        _.each(legendBinds, function (lb) {
                            ret.seriesData[lb] = _.map(legendObj[lb], function (d) {
                                return {
                                    "name": d[geoNames],
                                    "value": d[sizeBinds]
                                };
                            });
                        });
                    }
                });
            }
        }

        return ret;
    }

    /**
     * 从请求的结果中按照字段元数据整理数据
     *
     */
    function _getValueFromDefault (field, list, isUniq) {
        var ret = _.pluck(list, field);

        if (isUniq) {
            return _.uniq(ret);
        } else {
            return ret;
        }
    }

    /**
     * 针对报表的特殊情况，可以直接从数据描述对象中的default取元数据对应的值
     */
    function _getValueFromDescDefault () {

    }

    /**
     * 将获取的元数据对应的值填充至图例中
     */
    function _fillLegend (option, legendDatas) {
        !!option.legend && (option.legend.data = legendDatas);
    }

    /**
     * 填充坐标系
     * @param option
     * @param dimensionNames
     */
    function _fillCoordinateSystem (option, dataOption, seriesOptions, listData,seriesLegendDatas) {
        var coordinateSystem = seriesOptions.coordinateSystem;

        switch (coordinateSystem) {
            case "null": _fillNull(option, dataOption, listData);break;
            case "cartesian2d": _fillCartesian2d(option, dataOption, seriesOptions, listData);break;
            case "polar": _fillPolar(option, dataOption, seriesOptions, listData);break;
            case "geo":  _fillGeo(option, dataOption, listData);break;
            case "parallel": _fillParallel(option, dataOption, listData,seriesLegendDatas);break;
            default: _fillCartesian2d(option, dataOption, seriesOptions, listData);
        };
    }

    /**
     * 填充无坐标系：饼图、雷达图、树图、地图、节点关系图、桑基图、漏斗图、仪表
     */
    function _fillNull (option, dimensionDatas) {

    }

    /**
     * 填充直角坐标系：散点图、折线图、柱状图、特效散点图、箱形图、K线图、热图、节点关系图
     */
    function _fillCartesian2d (option, dataOption, seriesOptions, listData) {
        var	xAxis = dataOption.properties.xAxis,
            yAxis = dataOption.properties.yAxis;

        if (!!xAxis && !!xAxis.bind.length) {
            if (seriesOptions.xAxisType === "category") {
                _.each(xAxis.bind, function (xb, i) {
                    if (_.isArray(option.xAxis)){
                        option.xAxis[i].data = _.uniq(_.pluck(listData, xb.name));
                    }else{
                        option.xAxis.data = _.uniq(_.pluck(listData, xb.name));
                    }
                });
            }
        }

        if (!!yAxis && !!yAxis.bind.length) {
            if (seriesOptions.yAxisType === "category") {
                _.each(yAxis.bind, function (yb, i) {
                    if (_.isArray(option.xAxis)){
                        option.yAxis[i].data = _.uniq(_.pluck(listData, yb.name));
                    }else{
                        option.yAxis.data = _.uniq(_.pluck(listData, yb.name));
                    }
                });
            }
        }
    }

    /**
     * 填充极坐标系：折线图、散点图、特效散点图、节点关系图
     */
    function _fillPolar (option, dataOption, seriesOptions, listData) {
        var	angleAxis = dataOption.properties.angleAxis,
            radiusAxis = dataOption.properties.radiusAxis;

        if (!!angleAxis && !!angleAxis.bind.length) {
            if (seriesOptions.angleAxisType === "category") {
                _.each(angleAxis.bind, function (aa) {
                    option.angleAxis.type = "category";
                    option.angleAxis.data = _.uniq(_.pluck(listData, aa.name));
                });
            }
        }

        if (!!radiusAxis && !!radiusAxis.bind.length) {
            if (seriesOptions.radiusAxisType === "category") {
                _.each(radiusAxis.bind, function (aa) {
                    option.radiusAxis.type = "category";
                    option.radiusAxis.data = _.uniq(_.pluck(listData, aa.name));
                });
            }
        }
    }

    /**
     * 填充地理坐标系：散点图、特效散点图、热图、航线图、节点关系图
     */
    function _fillGeo () {

    }

    /**
     * 填充平行坐标系：平行坐标系
     */
    function _fillParallel (option, dataOption, listData,seriesLegendDatas) {
        var dim = JSON.parse(JSON.stringify(option.parallelAxis.pop()));
        var category = dataOption.properties.parallelAxis;
        var dimData = seriesLegendDatas.dimData;

        for (var p in dimData){
            dim = JSON.parse(JSON.stringify(dim));
            dim.name = dimData[p];
            dim.dim = parseInt(p);
            if(!dim.dim){
                dim.nameLocation = "start";
                dim.inverse = true;
            }
            option.parallelAxis.push(dim);
        }
        if (!!category && !!category.bind.length) {
            dim = JSON.parse(JSON.stringify(dim));
            dim.dim = parseInt(dimData.length);
            dim.name = category.bind[0].name;
            dim.type = "category";
            dim.data = _.uniq(_.pluck(listData, dim.name));
            option.parallelAxis.push(dim);
        }
    }
    /**
     * 箱线图数据准备
     */
    function prepareBoxplotData(rawData, opt) {
        opt = opt || [];
        var boxData = [];
        var outliers = [];
        var axisData = [];
        var boundIQR = opt.boundIQR;

        for (var p in rawData) {
            var ascList = numberUtil.asc(rawData[p].slice());

            var Q1 = quantile(ascList, 0.25);
            var Q2 = quantile(ascList, 0.5);
            var Q3 = quantile(ascList, 0.75);
            var IQR = Q3 - Q1;

            var low = boundIQR === 'none'
                ? ascList[0]
                : Q1 - (boundIQR == null ? 1.5 : boundIQR) * IQR;
            var high = boundIQR === 'none'
                ? ascList[ascList.length - 1]
                : Q3 + (boundIQR == null ? 1.5 : boundIQR) * IQR;

            boxData.push([low, Q1, Q2, Q3, high]);

            for (var j = 0; j < ascList.length; j++) {
                var dataItem = ascList[j];
                if (dataItem < low || dataItem > high) {
                    var outlier = [i, dataItem];
                    opt.layout === 'vertical' && outlier.reverse();
                    outliers.push(outlier);
                }
            }
        }
        return {
            boxData: boxData,
            outliers: outliers,
            axisData: axisData
        };
    };
    /**
     * 将获取的元数据对应的值填充至Series对象中
     */
    function _fillSeries (option, seriesOptions, seriesLegendDatas, listData, dataoption) {
        var data = [],
            seriesData = seriesLegendDatas.seriesData,
            chartTypes = seriesOptions.chartTypes,
            seriesType = seriesOptions.seriesType,
            coordinateSystem = seriesOptions.coordinateSystem,
            xAxis = dataoption.properties.xAxis,
            legend = dataoption.properties.legend,
            values = dataoption.properties.value,
            yAxis = dataoption.properties.yAxis,
            size = dataoption.properties.size;

        if(coordinateSystem == "cartesian2d"){
            if(_.contains(seriesOptions.types,"boxplot")){
                var tempObj = [];
                var sizex = values.bind.length;
                if(!legend.bind.length){
                    for(var i = 0; i < sizex; i++){
                        tempObj[i]=new Array();
                    }
                    var j = 0;
                    for (var p in seriesData){
                        var i = 0;
                        for(var q in seriesData[p]){
                            tempObj[i][j] = seriesData[p][q].slice();
                            i = i + 1;
                        }
                        j = j + 1;
                    }
                }else{
                    var tempObj = seriesData;
                }
                var seriescatter = JSON.parse(JSON.stringify(option.series.pop()));
                var serieboxplot = JSON.parse(JSON.stringify(option.series.pop()));
                var i = 0;
                _.each(tempObj,function(to) {
                    serieboxplot = JSON.parse(JSON.stringify(serieboxplot));
                    serieboxplot.name = option.legend.data[i];
                    var tempdata = echarts.dataTool.prepareBoxplotData(to);
                    serieboxplot.data = tempdata.boxData;
                    option.series.push(serieboxplot);
                    if (!!tempdata.outliers.length && !legend.bind.length
                        && values.bind.length < 2){//多系列,多值不显示outliers
                        seriescatter = JSON.parse(JSON.stringify(seriescatter));
                        seriescatter.name = option.legend.data[i];
                        seriescatter.data = tempdata.outliers;
                        option.series.push(seriescatter);
                    }
                    i = i + 1;
                });
            }else if (_.contains(seriesOptions.types,"scatter") || _.contains(seriesOptions.types,"heatmap")) {
                if (!!legend && !!legend.bind.length){
                    var serie = JSON.parse(JSON.stringify(option.series.pop()));
                    for (var p in seriesData) {
                        serie = JSON.parse(JSON.stringify(serie));
                        serie.name = p;
                        serie.data = seriesData[p];
                        option.series.push(serie);
                    }
                    if (!!option.visualMap){
                        option.visualMap[0].dimension = seriesLegendDatas.dimension;
                        var text = "圆形大小：" + size.bind[0].name;
                        option.visualMap[0].text.push(text);
                    }
                    if (!!xAxis.bind.length && !!yAxis.bind.length){
                        if(_.isArray(option.xAxis)){
                            option.xAxis[0].name = xAxis.bind[0].name;
                        }else{
                            option.xAxis.name = xAxis.bind[0].name;
                        }
                        if(_.isArray(option.yAxis)){
                            option.yAxis[0].name = yAxis.bind[0].name;
                        }else{
                            option.yAxis.name = yAxis.bind[0].name;
                        }
                    }
                }else{
                    var serie = JSON.parse(JSON.stringify(option.series.pop()));
                    serie.name = seriesLegendDatas.legendData;
                    serie.data = seriesData;
                    // 散点图symbolSize设置如下
                    if(_.has(serie,"symbolSize")){
                        var maxSize = seriesData[0][2];
                        var minSize = seriesData[0][2];
                        _.each(seriesData,function(sd){
                            if (sd[2] > maxSize){
                                maxSize = sd[2];
                            }
                            if (sd[2] < minSize){
                                minSize = sd[2];
                            }
                        });
                        if (_.has(serie,"symbolSizeMin") && _.has(serie,"symbolSizeMax")){
                            var symbolSizeMin = parseInt(serie.symbolSizeMin);
                            var symbolSizeMax = parseInt(serie.symbolSizeMax);
                            serie.symbolSize = function(val){
                                return symbolSizeMin+(val[2]-minSize)*(symbolSizeMax-symbolSizeMin)/(maxSize-minSize);
                            }
                        } else {
                            serie.symbolSize = function(val){
                                return symbolSize[0]+(val[2]-minSize)*(symbolSize[1]-symbolSize[0])/(maxSize-minSize);
                            }
                        }
                    }
                    option.series.push(serie);
                    if(_.has(option.tooltip,"formatter")){
                        option.tooltip.formatter = function (params) {
                            return params.seriesName + '<br>' +
                                seriesLegendDatas.xAxisData[params.value[0]] + ' , ' +
                                seriesLegendDatas.yAxisData[params.value[1]] + ' , ' + params.value[2];
                        }
                    }
                }
            } else if (!!yAxis && !!yAxis.bind[0].rid){
                var serie = JSON.parse(JSON.stringify(option.series.pop()));
                for (var p in seriesData) {
                    serie = JSON.parse(JSON.stringify(serie));
                    serie.name = p;
                    serie.data = seriesData[p];
                    option.series.push(serie);
                }
            }else{
                var serie = [];
                var series_length = option.series.length;
                for (var i = 0; i < series_length; i++) {
                    serie.push(JSON.parse(JSON.stringify(option.series.pop())));
                }

                for (var p in seriesData) {
                    var q = p.split("-");
                    _.each(dataoption.properties.value.bind, function (xb,i) {
                        if((xb.name === p) || _.contains(q,xb.name)){
                            for (var i = 0; i < series_length; i++) {
                                var obj = JSON.parse(JSON.stringify(serie[i]));
                                //!xb.chartType通常情况
                                //xb.chartType === obj.type 指定了chartType的柱线图情况
                                if(!xb.chartType || (xb.chartType === obj.type)){
                                    obj.name = p;
                                    obj.data = seriesData[p];
                                    if (!!xb.AxisIndex){
                                        if(!!xAxis && !!xAxis.bind.length){
                                            obj.yAxisIndex = 1;
                                        }else{
                                            obj.xAxisIndex = 1;
                                        }
                                    }
                                    option.series.push(obj);
                                    break;
                                }
                            }
                            return false;
                        }
                    });
                }
            }

        }else if (coordinateSystem == "geo") {
            if (!!legend && !!legend.bind.length){
                var serie = JSON.parse(JSON.stringify(option.series.pop()));
                for (var p in seriesData) {
                    serie = JSON.parse(JSON.stringify(serie));
                    serie.name = p;
                    serie.data = _.map(seriesData[p],function (itemOpt) {
                        return {
                            name: itemOpt.name,
                            value: [
                                latlong[code[itemOpt.name]].longitude,
                                latlong[code[itemOpt.name]].latitude,
                                itemOpt.value
                            ]
                        };
                    });
                    option.series.push(serie);
                }
            }else{
                var serie = JSON.parse(JSON.stringify(option.series.pop()));
                for (var p in seriesData) {
                    serie = JSON.parse(JSON.stringify(serie));
                    serie.name = p;
                    serie.data = convertData(seriesData[p]);
                    // 散点图symbolSize设置如下
                    if(_.has(serie,"symbolSize")){
                        var maxSize = seriesData[p][0].value;
                        var minSize = seriesData[p][0].value;
                        _.each(seriesData[p],function(sd){
                            if (sd.value > maxSize){
                                maxSize = sd.value;
                            }
                            if (sd.value < minSize){
                                minSize = sd.value;
                            }
                        });
                        if (_.has(serie,"symbolSizeMin") && _.has(serie,"symbolSizeMax")){
                            var symbolSizeMin = parseInt(serie.symbolSizeMin);
                            var symbolSizeMax = parseInt(serie.symbolSizeMax);
                            serie.symbolSize = function(val){
                                return symbolSizeMin+(val[2]-minSize)*(symbolSizeMax-symbolSizeMin)/(maxSize-minSize);
                            }
                        } else {
                            serie.symbolSize = function(val){
                                return symbolSize[0]+(val[2]-minSize)*(symbolSize[1]-symbolSize[0])/(maxSize-minSize);
                            }
                        }
                    }
                    option.series.push(serie);
                }
            }
        }else if (coordinateSystem == "parallel") {
            var serie = JSON.parse(JSON.stringify(option.series.pop()));
            if (!!legend && !!legend.bind.length){
                for (var p in seriesData) {
                    serie = JSON.parse(JSON.stringify(serie));
                    serie.name = p;
                    serie.data = seriesData[p];
                    option.series.push(serie);
                }
            }else{
                serie.data = seriesData;
                option.series.push(serie);
            }
        }else if (_.contains(seriesOptions.types,"map")) {
            var serie = JSON.parse(JSON.stringify(option.series.pop()));
            for (var p in seriesData) {
                serie = JSON.parse(JSON.stringify(serie));
                serie.name = p;
                serie.data = seriesData[p];
                option.series.push(serie);
            }
        }else if (_.contains(seriesOptions.types,"radar")) {
            var serie = option.series[0].data;
            var indicator = option.radar.indicator;
            if (!!serie) {
                serie = option.series[0].data.pop();
            } else {
                serie = {name: "", value: []}
                option.series[0].data = [];
            }
            if (!!indicator) {
                indicator = option.radar.indicator.pop()
            } else {
                indicator = {min: 0, max: 0, name: ""}
                option.radar.indicator = [];
            }
            var indicatorNames = _.pluck(listData, legend.bind[0].name);
            for (var p in seriesData) {
                serie = JSON.parse(JSON.stringify(serie));
                serie.name = p;
                serie.value = seriesData[p];
                option.series[0].data.push(serie);
            }
            for (var q in seriesLegendDatas.dimData) {
                _.each(seriesLegendDatas.dimData[q],function(sl,i){
                    indicator = JSON.parse(JSON.stringify(indicator));
                    indicator.name = indicatorNames[i];
                    indicator.max = sl;
                    option.radar.indicator.push(indicator);
                });
            }
        }else if (_.contains(seriesOptions.types,"pie") || _.contains(seriesOptions.types,"funnel")) {
            var serie = JSON.parse(JSON.stringify(option.series.pop()));
            serie.data = seriesData;
            option.series.push(serie);
        }
        else if (coordinateSystem == "polar") {
            var serie = JSON.parse(JSON.stringify(option.series.pop()));
            if (seriesLegendDatas.legendData.length > 0){
                serie.name = seriesLegendDatas.legendData[0];
            }
            serie.data = seriesData;
            // 散点图symbolSize设置如下
            if(_.has(serie,"symbolSize")){
                var maxSize = seriesData[0][2];
                var minSize = seriesData[0][2];
                _.each(seriesData,function(sd){
                    if (sd[2] > maxSize){
                        maxSize = sd[2];
                    }
                    if (sd[2] < minSize){
                        minSize = sd[2];
                    }
                });
                serie.symbolSize = function(val){
                    return symbolSize[0]+(val[2]-minSize)*(symbolSize[1]-symbolSize[0])/(maxSize-minSize);
                }
            }
            option.series.push(serie);
        }
        else{
            var serie = JSON.parse(JSON.stringify(option.series.pop()));
            for (var p in seriesData) {
                serie = JSON.parse(JSON.stringify(serie));
                serie.name = p;
                serie.data = seriesData[p];
                option.series.push(serie);
            }
        }

    }

    /**
     * 填充单系列无坐标系图表series
     */
    function _fillSeriesCoordNull (tableDatas) {
        var data = [];
        _.each(tableDatas.slice(1), function (row) {
            var temp = {};
            temp["name"] = row[0];
            temp["value"] = row.unshift;
            data.push(temp);
        });
        return data;
    }

    /**
     * 填充单系列无坐标系Map Series
     */
    function _fillSeriesCoordNullMap (tableDatas) {

    }

    /**
     * 填充单系列无坐标系Lines Series
     */
    function _fillSeriesCoordNullLines (tableDatas) {

    }

    /**
     * 填充单系列无坐标系SanKey Series
     */
    function _fillSeriesCoordNullSankey (tableDatas) {

    }

    /**
     * 填充单系列无坐标系Treemap Series
     */
    function _fillSeriesCoordNullTreemap (tableDatas) {

    }

    /**
     * 判断图表类型
     * TODO series中出现多个数组或者多个类型？？
     */
    function _judgeChart (chartOption) {
        var types = [],
            coordinateSystem,
            seriesType,
            angleAxisType,
            radiusAxisType,
            xAxisType,
            yAxisType;

        _.each(chartOption.series.items.anyOf, function (d) {
            types.push(d.properties.type["default"]);
            if (!!d.properties.coordinateSystem) {
                coordinateSystem = d.properties.coordinateSystem["default"];
            }
        });

        if (!coordinateSystem) {
            if (!!chartOption.xAxis && !!chartOption.yAxis) {
                coordinateSystem = "cartesian2d";
            } else {
                coordinateSystem = "null";
            }
        }else if (coordinateSystem === "polar") {
            angleAxisType = chartOption.angleAxis.properties.type["default"];
            radiusAxisType = chartOption.radiusAxis.properties.type["default"];
        }else if (coordinateSystem === "cartesian2d"){
            xAxisType = "value";
            yAxisType = "value";
            if (!chartOption.xAxis.items){
                xAxisType = chartOption.xAxis.properties.type["default"];
            }
            if (!chartOption.yAxis.items){
                yAxisType = chartOption.yAxis.properties.type["default"];
            }
        }

        seriesType = types.length;

        return {
            types: types,
            coordinateSystem: coordinateSystem,
            seriesType: seriesType,
            angleAxisType: angleAxisType,
            radiusAxisType: radiusAxisType,
            xAxisType: xAxisType,
            yAxisType: yAxisType
        };
    }
    /**
     * 判断x,y轴 类型
     *
     */
    function _judgeAxis(axis){
        var AxisType;

        if(_.isArray(axis)){
            AxisType = axis[0].type;
        }else{
            AxisType = axis.type;
        }
        return AxisType;
    }
    /**
     * 判断精简版JSON的图表类型
     * TODO series中出现多个数组或者多个类型？？
     */
    function _judgeChartByShort (chartOption) {
        var types = [],
            coordinateSystem,
            seriesType,
            angleAxisType,
            radiusAxisType,
            xAxisType,
            yAxisType;

        if(_.isArray(chartOption.series)){
            _.each(chartOption.series, function (d) {
                types.push(d.type);
                if (!!d.coordinateSystem) {
                    coordinateSystem = d.coordinateSystem;
                }
            });
        }else{
            types.push(chartOption.series.type);
            if (!!chartOption.series.coordinateSystem) {
                coordinateSystem = chartOption.series.coordinateSystem;
            }
        }

        if (coordinateSystem === "cartesian2d"){
            xAxisType = _judgeAxis(chartOption.xAxis);
            yAxisType = _judgeAxis(chartOption.yAxis);
        }else if (coordinateSystem === "polar") {
            angleAxisType = chartOption.angleAxis.type;
            radiusAxisType = chartOption.radiusAxis.type;
        }else if (!coordinateSystem) {
            if (!!chartOption.xAxis && !!chartOption.yAxis) {
                coordinateSystem = "cartesian2d";
                xAxisType = _judgeAxis(chartOption.xAxis);
                yAxisType = _judgeAxis(chartOption.yAxis);
            } else {
                coordinateSystem = "null";
            }
        }

        seriesType = types.length;

        return {
            types: types,
            coordinateSystem: coordinateSystem,
            seriesType: seriesType,
            angleAxisType: angleAxisType,
            radiusAxisType: radiusAxisType,
            xAxisType: xAxisType,
            yAxisType: yAxisType
        };
    }
    /**
     * 将二维数组转换为list
     */
    function _toList (table, head) {
        var ret = [];
        if (table.length < 2) {
            return ret;
        }
        var keys = head || table[0];
        _.each(table.slice(1), function (row) {
            var obj = {};
            _.each(keys, function (key, index) {
                obj[key] = row[index];
            });
            ret.push(obj);
        });
        return ret;
    };

    /**
     * 底层ajax请求
     */
    function _xhr (url, mime, callback) {
        var req;

        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (arguments.length < 3) {
            callback = mime, mime = null;
        }
        else if (mime && req.overrideMimeType) {
            req.overrideMimeType(mime);
        }

        req.open("GET", url, true);

        if (mime) {
            req.setRequestHeader("Accept", mime);
        }

        req.onreadystatechange = function() {
            if (req.readyState === 4) callback(req.status < 300 ? req : null);
        };

        req.send(null);
    };

    /**
     * K线图 函数
     */
    function calculateMA(dayCount,data) {
        var result = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += data[i - j][1];
            }
            result.push(sum / dayCount);
        }
        return result;
    }

    /**
     * 关系图 节点ID获取
     */
    function findId(nodes,name){
        for (var p in nodes){
            if (name === nodes[p].name){
                return nodes[p].id;
            }
        }
    }
    /**
     * 数组去重
     */
    function unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }
    /**
     * 矩形树图数据准备
     */
    function convert(legendObj,results,i,legendName,valueName,basePath){
        for (var key in legendObj) {
            var path = basePath ? (basePath + '.' + key) : key;

            results.children = results.children || [];
            var valueBinds = _.pluck(legendObj[key],valueName);
            var values = 0;
            _.each(valueBinds,function(vb){
                values = values + vb;
            });
            var child = {
                name: path,
                value: values
            };
            results.children.push(child);
            if (i < legendName.length){
                var temp = _.groupBy(legendObj[key],legendName[i]);
                convert(temp, child, i+1,legendName,valueName,path);
            }
        }
    }
    /******************系列值解析结束***********************/

    /******************组装Echarts Option***********************/

    function render (chartOptions) {
        var	dataOption = chartOptions.data,
            seriesLegendDatas,
            listData,
            option,
            dom,
            seriesOptions = {};

        if (!!chartOptions.option.properties){
            seriesOptions = _judgeChart(chartOptions.option.properties);
            option = _getProperties(chartOptions);
        } else {
            seriesOptions = _judgeChartByShort(chartOptions.option);
            option = chartOptions.option;
        }

        dom = _getDom(chartOptions);

        var tableDatas = chartOptions.data["default"];
        listData = _toList(tableDatas);

        if (_.contains(dataVizType, seriesOptions.types[0])){
            option.series = JSON.parse(JSON.stringify(option.series.pop()));

            option = JSON.stringify(option);
            option = option.replace("tooltip","floatTag");
            option = option.replace("series","chart");
            var dataVizOption = JSON.parse(option);
            var type = 	chartmap[seriesOptions.types[0]];

            _convertDVOpion(option);
            requirejs([type, "DataViz"], function(Bullet, DataViz) {
                var bullet = new Bullet("chart", dataVizoption);

                bullet.setSource(listData, {"marker":0,"measures0":1,"measures1":2,"measures2":3,"measures3":4});
                bullet.reRender();
            });
        } else {
            if(_.contains(seriesOptions.types,"candlestick")){
                var categoryData = _.pluck(listData, dataOption.properties.xAxis.bind[0].name);
                var value = _.map(listData, function (d) {
                    return [d[dataOption.properties.open.bind[0].name],d[dataOption.properties.close.bind[0].name]
                        ,d[dataOption.properties.lowest.bind[0].name],d[dataOption.properties.highest.bind[0].name]];
                });
                var serieline = JSON.parse(JSON.stringify(option.series.pop()));
                var seriecandlestick = JSON.parse(JSON.stringify(option.series.pop()));

                if(_.isArray(option.xAxis)){
                    option.xAxis[0].data = categoryData;
                }else{
                    option.xAxis.data = categoryData;
                }

                option.legend.data = ["日K","MA5","MA10","MA20","MA30"];
                seriecandlestick.name = "日K";
                seriecandlestick.data = value;
                option.series.push(seriecandlestick);
                _.each([5,10,20,30],function(d){
                    var name = "MA" + d;
                    var obj = JSON.parse(JSON.stringify(serieline));
                    obj.name = name;
                    obj.data = calculateMA(d,value);
                    option.series.push(obj);
                });

            }else if(_.contains(seriesOptions.types,"graph") || _.contains(seriesOptions.types,"sankey")
                || _.contains(seriesOptions.types,"lines")){
                var category_src = dataOption.properties.category_src,
                    category_tar = dataOption.properties.category_tar,
                    source = dataOption.properties.source,
                    target = dataOption.properties.target,
                    value = dataOption.properties.value,
                    srcBinds = [],
                    tarBinds = [],
                    valBinds = [],
                    categorySB = [],
                    categoryTB = [],
                    nodes = [],
                    links = [],
                    legend = [];

                if (!!source) {
                    _.each(source.bind, function (d) {
                        srcBinds=_.uniq(_.pluck(listData, d.name));
                    });
                }
                if (!!target) {
                    _.each(target.bind, function (d) {
                        tarBinds=_.uniq(_.pluck(listData, d.name));
                    });
                }
                if (!!value) {
                    _.each(value.bind, function (d) {
                        valBinds=_.pluck(listData, d.name);
                    });
                }
                if (!!category_src && !!category_src.bind.length){
                    _.each(category_src.bind, function (d) {
                        categorySB=_.uniq(_.pluck(listData, d.name));
                    });
                }
                if(!!category_tar && !!category_tar.bind.length){
                    _.each(category_tar.bind, function (d) {
                        categoryTB=_.uniq(_.pluck(listData, d.name));
                    });
                }

                var srcObj = _.groupBy(listData,source.bind[0].name);
                var tarObj = _.groupBy(listData,target.bind[0].name);
                var i = 0;
                if(_.contains(seriesOptions.types,"lines")){
                    option.legend.data = srcBinds;

                    serieEScatter = JSON.parse(JSON.stringify(option.series.pop()));
                    serieLines = JSON.parse(JSON.stringify(option.series.pop()));

                    var seriesName = {};
                    var seriesValue = {};
                    for (var p in srcObj){
                        seriesName[p] = _.map(srcObj[p],function(so){
                            return {
                                "srcName": p,
                                "tarName": so[target.bind[0].name]
                            };
                        });
                        seriesValue[p] = _.map(srcObj[p],function(so){
                            return {
                                "name": so[target.bind[0].name],
                                "value": so[value.bind[0].name]
                            };
                        });
                    }
                    var maxSize = Number.MIN_VALUE;
                    var minSize = Number.MAX_VALUE;
                    _.each(seriesValue,function(ssv){
                        _.each(ssv,function(sv){
                            if (sv.value > maxSize){
                                maxSize = sv.value;
                            }
                            if (sv.value < minSize){
                                minSize = sv.value;
                            }
                        })
                    });
                    for (var p in seriesName) {
                        var lines = JSON.parse(JSON.stringify(serieLines));
                        var scatter = JSON.parse(JSON.stringify(serieEScatter));
                        lines.name = scatter.name = p;
                        lines.data = convertLinesData(seriesName[p]);
                        scatter.data = seriesValue[p].map(function (dataItem) {
                            return {
                                name: dataItem.name,
                                value: geoCoordMap[dataItem.name].concat([dataItem.value])
                            };
                        });
                        scatter.symbolSize = function(val){
                            return linesSymbolSize[0]+(val[2]-minSize)*(linesSymbolSize[1]-linesSymbolSize[0])/(maxSize-minSize);
                        }
                        option.series.push(lines);
                        option.series.push(scatter);
                    }
                }else if(_.contains(seriesOptions.types,"sankey")){
                    var merge = srcBinds.concat(tarBinds);
                    merge = unique(merge);
                    for (var sd in merge){
                        nodes.push({
                            "name":merge[sd]
                        });
                    };
                    _.each(listData,function(sd,i){
                        links.push({
                            "source": sd[source.bind[0].name],
                            "target":sd[target.bind[0].name],
                            "value": sd[value.bind[0].name]
                        });
                    });
                    option.series[0].data = nodes;
                    option.series[0].links = links;
                }else{
                    if(!!category_tar && !!category_tar.bind.length
                        && !!category_src && !!category_src.bind.length){

                        var merge = categorySB.concat(categoryTB);
                        merge = unique(merge);
                        var categories = [];
                        for(var j = 0 ; j < merge.length; j++){
                            categories[j] = {
                                "name": merge[j]
                            };
                        }
                        for (var sd in srcObj){
                            var nodevalue = 0;
                            _.each(srcObj[sd],function(d){
                                nodevalue = nodevalue + d[value.bind[0].name];
                            });
                            var symbolSizeValue = symbolSize[0]+(nodevalue-minSize)*(symbolSize[1]-symbolSize[0])/(maxSize-minSize);
                            nodes.push({
                                "id":i.toString(),
                                "name":sd,
                                "category": srcObj[sd][0][category_src.bind[0].name],
                                "value": parseInt(nodevalue),
                                "symbolSize":parseInt(symbolSizeValue)
                            });
                            i = i + 1;
                        };
                        for (var sd in tarObj){
                            var nodevalue = 0;
                            _.each(tarObj[sd],function(d){
                                nodevalue = nodevalue + d[value.bind[0].name];
                            });
                            var symbolSizeValue = symbolSize[0]+(nodevalue-minSize)*(symbolSize[1]-symbolSize[0])/(maxSize-minSize);
                            nodes.push({
                                "id":i.toString(),
                                "name":sd,
                                "category": tarObj[sd][0][category_tar.bind[0].name],
                                "value": parseInt(nodevalue),
                                "symbolSize":parseInt(symbolSizeValue)
                            });
                            i = i + 1;
                        };
                        _.each(listData,function(sd,i){
                            var srcId = findId(nodes,sd[source.bind[0].name]);
                            var tarId = findId(nodes,sd[target.bind[0].name]);
                            links.push({
                                "id":i.toString,
                                "name": "null",
                                "source": srcId,
                                "target":tarId
                            });
                        });
                        option.series[0].data = nodes;
                        option.series[0].links = links;
                        option.series[0].categories = categories;
                        option.legend.data = merge;
                    }else{
                        for (var sd in srcObj){
                            var nodevalue = 0;
                            _.each(srcObj[sd],function(d){
                                nodevalue = nodevalue + d[value.bind[0].name];
                            });
                            legend[i] = sd;
                            nodes.push({
                                "id":i.toString(),
                                "name":sd,
                                "value": parseInt(nodevalue),
                                "symbolSize":parseInt(nodevalue)
                            });
                            i = i + 1;
                        };
                        for (var sd in tarObj){
                            var nodevalue = 0;
                            _.each(tarObj[sd],function(d){
                                nodevalue = nodevalue + d[value.bind[0].name];
                            });
                            legend[i] = sd;
                            nodes.push({
                                "id":i.toString(),
                                "name":sd,
                                "value": parseInt(nodevalue),
                                "symbolSize":parseInt(nodevalue)
                            });
                            i = i + 1;
                        };
                        _.each(listData,function(sd,i){
                            var srcId = findId(nodes,sd[source.bind[0].name]);
                            var tarId = findId(nodes,sd[target.bind[0].name]);
                            links.push({
                                "id":i.toString,
                                "name": "null",
                                "source": srcId,
                                "target":tarId
                            });
                        });
                        option.series[0].data = nodes;
                        option.series[0].links = links;
                        option.legend.data = legend;
                    }

                }
            }else if(_.contains(seriesOptions.types,"treemap")){
                var legend = dataOption.properties.legend,
                    value = dataOption.properties.value,
                    legendName = [],
                    results = {},
                    valueName = [];

                if (!!legend){
                    _.each(legend.bind,function(lb){
                        legendName.push(lb.name);
                    });
                }
                if (!!value){
                    _.each(value.bind,function(vb){
                        valueName.push(vb.name);
                    });
                }
                var legendObj = _.groupBy(listData,legendName[0]);
                convert(legendObj,results,1,legendName,valueName);
                option.series.name = "treemap";
                option.series[0].data = results.children;

            } else if (_.contains(seriesOptions.types, "bar") && _.contains(seriesOptions.types, "line")) {
                _.each(dataOption.properties.valueBar.bind, function (bind) {
                    bind.chartType = "bar";
                    bind.AxisIndex = 1;
                });

                _.each(dataOption.properties.value.bind, function (bind) {
                    bind.chartType = "line";
                });

                dataOption.properties.value.bind = dataOption.properties.value.bind.concat(dataOption.properties.valueBar.bind);

                seriesLegendDatas = _getSeriesLegendDatas(dataOption, seriesOptions, listData);

                _fillLegend(option, seriesLegendDatas.legendData);
                _fillCoordinateSystem(option, dataOption, seriesOptions, listData, seriesLegendDatas);
                _fillSeries(option, seriesOptions, seriesLegendDatas, listData, dataOption);
            } else {
                seriesLegendDatas = _getSeriesLegendDatas(dataOption, seriesOptions, listData);

                _fillLegend(option, seriesLegendDatas.legendData);
                _fillCoordinateSystem(option, dataOption, seriesOptions, listData, seriesLegendDatas);
                _fillSeries(option, seriesOptions, seriesLegendDatas, listData, dataOption);
            }
            return option;
        };
    }
    /******************组装Echarts Option结束***********************/

    /****************组装DataViz option *****************/
    function _toDataVizTitle (option) {
        var title = {};
        title.show = option.title.show;
        title.text = option.title.text;
        title.marginLeft = option.title.left;
        title.marginBottom = option.title.marginBottom;
        title.color = option.title.textStyle.color;
        title.fontWeight = option.title.textStyle.fontWeight;
        title.fontFamily = option.title.textStyle.fontFamily;
        title.fontSize = option.title.textStyle.fontSize+"px";

        if (!!option.title.subtext){
            title.subTitle = {};
            title.subTitle.text = option.title.subtext;
            title.subTitle.color = option.title.subtextStyle.color;
            title.subTitle.fontWeight = option.title.subtextStyle.fontWeight;
            title.subTitle.fontFamily = option.title.subtextStyle.fontFamily;
            title.subTitle.fontSize = option.title.subtextStyle.fontSize+"px";
            title.subTitle.marginTop = option.title.itemGap;
        }

        if (!!option.title.left) {
            switch(option.title.left) {
                case "left":title.marginLeft = "0%";break;
                case "center":title.marginLeft = "50%";break;
                case "right":title.marginLeft = "100%";break;
            }
        }
        return title;

    }

    function _toDataVizLegend (option,optionData) {
        var legend = {};
        legend.show = option.legend.show;
        legend.colorMode = option.legend.colorMode;
        switch(_getChartType(option)){
            case "chord":
                legend.data= optionData.properties.source.bind[0].name;
                break;
            case "dot":
                legend.data = optionData.properties.legend.bind[0].name;
                break;
            case "rose":
                legend.data = optionData.properties.legend.bind[0].name;
                break;
            case "stream":
                legend.data = optionData.properties.legend.bind[0].name;
                break;
        }

        legend.item = {};
        legend.item.markStyle = option.legend.item.markStyle;
        legend.item.markWidth = option.legend.item.markWidth;
        legend.item.markTextWidth =  option.legend.item.markTextWidth;
        legend.item.markRadius = option.legend.item.markRadius;
        legend.item.fontColor = option.legend.item.color;
        legend.item.fontWeight = option.legend.item.fontWeight;
        legend.item.fontFamily = option.legend.item.fontFamily;
        legend.item.fontSize = option.legend.item.fontSize + "px";
        legend.item.mouseOverColor = option.legend.item.mouseOverColor;
        legend.item.mouseOverBgColor =  option.legend.item.mouseOverBgColor;
        legend.opacity = option.legend.opacity;
        legend.position = option.legend.position;

        return legend;

    }

    function _toDataVizFloatTag (option) {
        var floatTag = {};
        floatTag.backgroundColor = option.tooltip.backgroundColor;
        floatTag.borderColor = option.tooltip.borderColor;
        floatTag.border = option.tooltip.border;
        floatTag.borderRadius = option.tooltip.borderRadius + "px";
        floatTag.fontColor = option.tooltip.textStyle.color;
        floatTag.fontFamily = option.tooltip.textStyle.fontFamily;
        floatTag.fontSize = option.tooltip.textStyle.fontSize +"px";
        floatTag.textAlign = option.tooltip.textAlign;
        floatTag.margin = option.tooltip.margin;
        floatTag.show = option.tooltip.show;

        return floatTag;

    }

    function _toChordOption (option,optionData,listEvent) {

        var title = _toDataVizTitle(option),
            legend = _toDataVizLegend(option,optionData),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.donutTextType = option.series[0].donutTextType;
        chart.isSorted = option.series[0].isSorted;
        chart.showGraduation = option.series[0].showGraduation;
        chart.showGraduationAmount = option.series[0].showGraduationAmount;
        chart.textShowMode = option.series[0].textShowMode;
        chart.graduationTextStyle = {};
        chart.graduationTextStyle["font-size"] = option.series[0].graduationTextStyle.fontSize + "px";
        chart.graduationTextStyle["fill"] = option.series[0].graduationTextStyle.color;
        chart.graduationTextStyle["font-family"] = option.series[0].graduationTextStyle.fontFamily;
        chart.textStyle = {};
        chart.textStyle["font-size"] = option.series[0].textStyle.fontSize + "px";
        chart.textStyle["fill"] = option.series[0].textStyle.color;
        chart.textStyle["font-family"] = option.series[0].textStyle.fontFamily;
        chart.textStyle["text-anchor"] = option.series[0].textStyle.textAnchor;
        chart.animation = option.animation;

        for (var p in listEvent){
            chart[p] = listEvent[p];
        }



        return {
            chart: chart,
            title: title,
            legend: legend,
            floatTag: floatTag
        };
    }


    function _toChordData (listData) {
        //TODO 处理chord图数据
        var listVerseData = [];
        keys = _.keys(listData[0]);
        for(var i=0;i<listData.length-1;i++) {
            var obj = {};
            obj[keys[1]] = listData[i][keys[0]];
            obj[keys[0]] = listData[i][keys[1]];
            obj[keys[2]] = listData[i][keys[2]];
            listVerseData.push(obj);
        }
        return listData.concat(listVerseData);
    }



    function _toDotOption (option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            legend = _toDataVizLegend(option,optionData),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.circleFontStyle = {};
        chart.circleFontStyle.font = option.series[0].circleFontStyle.font;
        chart.circleFontStyle.stroke = option.series[0].circleFontStyle.stroke;
        chart.circleFontStyle.fill = option.series[0].circleFontStyle.color;
        chart.colLabelStyle = {};
        chart.colLabelStyle["font-weight"] = option.series[0].colLabelStyle.fontWeight;
        chart.colLabelStyle["font-size"] = option.series[0].colLabelStyle.fontSize;
        chart.colRotate = option.series[0].colRotate;
        chart.rowLabelStyle = {};
        chart.rowLabelStyle["font-weight"] = option.series[0].rowLabelStyle.fontWeight;
        chart.rowLabelStyle["font-size"] = option.series[0].rowLabelStyle.fontSize;
        chart.padding = {};
        chart.padding.top = option.series[0].padding.top;
        chart.padding.bottom = option.series[0].padding.bottom;
        chart.padding.left = option.series[0].padding.left;
        chart.padding.right = option.series[0].padding.right;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.showGradient = option.series[0].showGradient;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }
        return {
            chart: chart,
            title: title,
            legend: legend,
            floatTag: floatTag
        };

    }

    function _toBulletOption (option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.axisType = option.series[0].axisType;
        chart.backgroundColor = option.series[0].backgroundColor;
        chart.centerBarRatio = option.series[0].centerBarRatio;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.horizonal = option.series[0].horizonal;
        chart.label = option.series[0].label;
        chart.labelStyle = {};
        chart.labelStyle.fill  = option.series[0].labelStyle.color;
        chart.labelStyle["font-family"] = option.series[0].labelStyle.fontFamily;
        chart.logBase =  option.series[0].logBase;
        chart.margin =  option.series[0].margin;
        chart.markerColor =  option.series[0].markerColor;
        chart.markerRatio =  option.series[0].markerRatio;
        chart.markerWidth =  option.series[0].markerWidth;
        chart.measureColor =  option.series[0].measureColor;
        chart.subLabel =  option.series[0].subLabel;
        chart.subLabelStyle = {};
        chart.subLabelStyle.fill = option.series[0].subLabelStyle.color;
        chart.subLabelStyle["font-family"] = option.series[0].subLabelStyle.fontFamily;
        chart.tickDivide = option.series[0].tickDivide;
        chart.ranges = [10, 921.79, 6433.52, 118259];
        chart.animation= option.animation;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }
        return {
            chart: chart,
            title: title,
            floatTag: floatTag
        };

    }

    function _toPinterestOption(option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.backGroundColor = option.series[0].backGroundColor;
        chart.showBackground = option.series[0].showBackground;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.textColor = option.series[0].textColor;
        chart.animation = option.animation;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }

        return {
            chart: chart,
            title: title,
            floatTag: floatTag
        };
    }

    function _toTagcloudOption(option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.clickable = option.series[0].clickable;
        chart.rotateAngle = option.series[0].rotateAngle;
        chart.shape = option.series[0].shape;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.textStyle = {};
        chart.textStyle.weight = option.series[0].textStyle.fontWeight;
        chart.textStyle["font-family"] = option.series[0].textStyle.fontFamily;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }

        return {
            chart: chart,
            title: title,
            floatTag: floatTag
        };
    }

    function _toRoseOption(option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            legend = _toDataVizLegend(option,optionData),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.arcRadius = option.series[0].arcRadius;
        chart.innerRadius = option.series[0].innerRadius;
        chart.padding = option.series[0].padding;
        chart.sortType = option.series[0].sortType;
        chart.text = option.series[0].text;
        chart.textStyle = {};
        chart.textStyle.fill = option.series[0].textStyle.color;
        chart.textStyle["font-family"] = option.series[0].textStyle.fontFamily;
        chart.textStyle["font-size"] = option.series[0].textStyle.fontSize+"px";
        chart.textStyle["text-anchor"] = option.series[0].textStyle.textAnchor;
        chart.tickCount = option.series[0].tickCount;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.animation = option.animation;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }
        return {
            chart: chart,
            title: title,
            legend: legend,
            floatTag: floatTag
        };
    }

    function _toDoublelineOption(option, optionData, listEvent){
        var title = _toDataVizTitle(option);
        var chart = {};

        chart.adaption = option.series[0].adaption;
        chart.captionStyle = {};
        chart.captionStyle["font-size"] = option.series[0].captionStyle.fontSize +"px";
        chart.captionStyle.fill = option.series[0].captionStyle.color;
        chart.captionStyle["font-family"] = option.series[0].captionStyle.fontFamily;
        chart.focusStyle = {};
        chart.focusStyle["font-size"] = option.series[0].focusStyle.fontSize+"px";
        chart.focusStyle["font-weight"] = option.series[0].focusStyle.fontWeight;
        chart.headerStyle = {};
        chart.headerStyle["font-size"] = option.series[0].headerStyle.fontSize+"px";
        chart.headerStyle.fill = option.series[0].headerStyle.color;
        chart.headerStyle["font-family"] = option.series[0].headerStyle.fontFamily;
        chart.textStyle = {};
        chart.textStyle["font-size"] = option.series[0].textStyle.fontSize+"px";
        chart.textStyle["font-family"] = option.series[0].textStyle.fontFamily;
        chart.textStyle["fill"] = option.series[0].textStyle.color;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }
        return {
            chart: chart,
            title: title
        };

    }

    function _toCalendarOption(option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            legend = {},
            floatTag = _toDataVizFloatTag(option),
            listData = _toList(optionData["default"]),
            valueName = optionData.properties.value.bind[0].name,
            legendData = _.pluck(listData,valueName),
            chart = {},
            legendDataMax = _.max(legendData),
            legendDataMin = _.min(legendData);

        legend.show = option.legend.show;
        legend.data =[[0,11381],[11381,11806],[11806,13000],[13000,14354],[14354,20000]];
        chart.legendStyle = {};
        chart.legendStyle["fill"]  = option.legend.textStyle.color;
        chart.legendStyle["font-size"] = option.legend.textStyle.fontSize + "px";
        chart.legendStyle["font-family"] = option.legend.textStyle.fontFamily;
        chart.legendStyle["text-anchor"] = option.legend.textStyle.textAnchor;

        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.adaption = option.series[0].adaption;
        chart.startYear = option.series[0].startYear;
        chart.isSorted = option.series[0].isSorted;
        chart.endYear = option.series[0].endYear;
        chart.showYearLabel = option.series[0].showYearLabel;
        chart.showGroupLabel = option.series[0].showGroupLabel;
        chart.yearStyle = {};
        chart.yearStyle["font-size"] = option.series[0].yearStyle.fontSize + "px";
        chart.yearStyle["fill"] = option.series[0].yearStyle.color;
        chart.yearStyle["text-anchor"] = option.series[0].yearStyle.textAnchor;
        chart.labelStyle = {};
        chart.labelStyle["font-size"] = option.series[0].textStyle.fontSize + "px";
        chart.labelStyle["fill"] = option.series[0].textStyle.color;
        chart.labelStyle["text-anchor"] = option.series[0].textStyle.textAnchor;
        chart.animation = option.animation;

        if (optionData.properties.legend.bind.length < 1){
            chart.showGroupLabel = false;
        }
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }

        return {
            chart: chart,
            title: title,
            legend: legend,
            floatTag: floatTag
        };
    }

    function _toStreamOption(option, optionData, listEvent){
        var title = _toDataVizTitle(option),
            legend = _toDataVizLegend(option,optionData),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.axisTextColor = option.series[0].axisTextColor;
        chart.autoHeight = option.series[0].autoHeight;
        chart.axisPopColor = option.series[0].axisPopColor;
        chart.axisPopTextColor = option.series[0].axisPopTextColor;
        chart.heightWidthRatio = option.series[0].heightWidthRatio;
        chart.max = option.series[0].max;
        chart.more = option.series[0].more;
        chart.moreLabel =option.series[0].moreLabel;
        chart.percentageBarColor = option.series[0].percentageBarColor;
        chart.percentageBarTextColor = option.series[0].percentageBarTextColor;
        chart.showAxis = option.series[0].showAxis;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        chart.pathLabel = option.series[0].pathLabel;
        chart.axisfontSize = option.series[0].axisfontSize+"px";
        chart.fontSize = option.series[0].fontSize+"px";
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }
        return {
            chart: chart,
            title: title,
            legend: legend,
            floatTag: floatTag
        };
    }


    function _toSunBurstOption(option,optionData,listEvent){
        var title = _toDataVizTitle(option),
            floatTag = _toDataVizFloatTag(option),
            chart = {};

        chart.adaption = option.series[0].adaption;
        chart.arcStyle = {};
        chart.arcStyle.stroke = option.series[0].arcStyle.stroke;
        chart.arcStyle["fill-opacity"] = option.series[0].arcStyle.opacity;
        chart.decimalFormat = option.series[0].decimalFormat;
        chart.isSorted = option.series[0].isSorted;
        chart.showPercentage = option.series[0].showPercentage;
        chart.textAlign = option.series[0].textAlign;
        chart.textShowMode = option.series[0].textShowMode;
        chart.textStyle = {};
        chart.textStyle.fill = option.series[0].textStyle.color;
        chart.textStyle["fill-opacity"] = option.series[0].textStyle.opacity;
        chart.textStyle["font-size"] = option.series[0].textStyle.fontSize+"px";
        chart.tipStyle = {};
        chart.tipStyle.color = option.series[0].tipStyle.color;
        chart.tipStyle.margin = option.series[0].tipStyle.margin;
        chart.tipStyle["text-align"] = option.series[0].tipStyle.textAlign;
        chart.tipStyle["font-family"] = option.series[0].tipStyle.fontFamily;
        chart.height = option.series[0].height;
        chart.width = option.series[0].width;
        for (var p in listEvent){
            chart[p] = listEvent[p];
        }
        return {
            chart: chart,
            title: title,
            floatTag: floatTag
        };

    }

    function _toSunBurstData (listData, optionData, root) {
        //TODO 处理sunburst图数据
        //var listVerseData = [];
        var listVerseData = [
            {
                id: 0,
                name: root,
                size: 0,
                parentid: ""
            }
        ];
        var i = 1;
        var lastp = null;
        var legendBind = optionData.properties.legend.bind;
        var valueBind = optionData.properties.value.bind;

        for(var p in legendBind ){
            var srcObj = _.groupBy(listData,legendBind[p].name);
            if(i == 1){
                var keys = _.keys(srcObj);
                _.each(keys, function(k){
                    var value = srcObj[k];
                    var valuedata = 0;
                    _.each(value, function(vd){
                        valuedata = valuedata + vd[valueBind[0].name];
                    });
                    listVerseData.push({
                        id : parseInt(i),
                        name: k,
                        size: valuedata,
                        //parentid: ""
                        parentid: 0
                    });
                    i = i+1;
                });
            }else{
                var keys = _.keys(srcObj);
                _.each(keys, function(k){
                    var value = srcObj[k];
                    var valuedata = 0;
                    var parentname =null ;
                    _.each(value, function(vd){
                        valuedata = valuedata + vd[valueBind[0].name];
                        parentname = vd[legendBind[lastp].name];
                    });
                    var parentid = findId(listVerseData, parentname);
                    listVerseData.push({
                        id : parseInt(i),
                        name: k,
                        size: valuedata,
                        parentid: parentid

                    });
                    i = i+1;
                });
            }
            lastp = p;
        }
        return listVerseData;
    }



    function _getChartType (option) {
        return option.series[0].type;
    }

    function _renderDataViz (dom, option, listData, optionData, listEvent) {
        var chartType = _getChartType(option),
            keys = _.keys(listData[0]),
            dtd = $.Deferred(),
            mapping = {};

        for (var p in optionData.properties) {
            mapping[optionData.properties[p].bind[0].name] = optionData.properties[p].mapping;
        }

        switch(chartmap[chartType]) {
            case "Chord":
                var chordDataVizOption = _toChordOption(option, optionData, listEvent);
                var chordDataVizData = _toChordData(listData);
                _renderChord(dom, chordDataVizOption, chordDataVizData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Dot":
                var dotDataVizOption = _toDotOption(option, optionData,listEvent);
                _renderDot(dom, dotDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Bullet":
                var bulletDataVizOption = _toBulletOption(option, optionData,listEvent);
                _renderBullet(dom, bulletDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Pinterest":
                var pinterestDataVizOption = _toPinterestOption(option, optionData, listEvent);
                _renderPinterest(dom, pinterestDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Tagcloud":
                var tagcloudDataVizOption = _toTagcloudOption(option, optionData,listEvent);
                _renderTagcloud(dom, tagcloudDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Rose":
                var roseDataVizOption = _toRoseOption(option, optionData,listEvent);
                _renderRose(dom, roseDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Doubleline":
                var doublelineDataVizOption = _toDoublelineOption(option, optionData,listEvent);
                _renderDoubleline(dom, doublelineDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Stream":
                var streamDataVizOption = _toStreamOption(option, optionData,listEvent);
                _renderStream(dom, streamDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "Calendar":
                var calendarDataVizOption = _toCalendarOption(option, optionData,listEvent);
                _renderDataVizCalendar(dom, calendarDataVizOption, listData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
            case "SunBurst":
                var sunburstDataVizOption = _toSunBurstOption(option, optionData, listEvent);
                var sunburstDataVizData = _toSunBurstData(listData, optionData, option.root.value);
                keys = _.keys(sunburstDataVizData[0]),
                mapping = {};

                for (var i = 0, l = keys.length; i < l; i++) {
                    mapping[keys[i]] = i;
                }
                _renderSunBurst(dom, sunburstDataVizOption, sunburstDataVizData, mapping).then(function (chartInstance) {
                    dtd.resolve(chartInstance);
                });
                break;
        }

        return dtd.promise();
    }


    function _renderChord (dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Chord", "DataViz"], function(Chord, DataViz) {
            var chord = new Chord(dom, option);
            chord.setSource(listData, mapping);
            chord.reRender();
            dtd.resolve(chord);
        });

        return dtd.promise();
    }


    function _renderDot (dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Dot", "DataViz"], function(Dot, DataViz) {
            var dot = new Dot(dom, option);
            dot.setSource(listData, mapping);
            dot.reRender();
            dtd.resolve(dot);
        });

        return dtd.promise();
    }

    function _renderBullet (dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Bullet", "DataViz"], function(Bullet, DataViz) {
            var bullet = new Bullet(dom, option);
            bullet.setSource(listData, mapping);
            bullet.reRender();
            dtd.resolve(bullet);
        });

        return dtd.promise();
    }

    function _renderPinterest (dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Pinterest", "DataViz"], function(Pinterest, DataViz) {
            var pinterest = new Pinterest(dom, option);
            pinterest.setSource(listData, mapping);
            pinterest.reRender();
            dtd.resolve(pinterest);
        });

        return dtd.promise();
    }

    function _renderTagcloud(dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Tagcloud", "DataViz"], function(Tagcloud, DataViz) {
            var tagcloud = new Tagcloud(dom, option);
            tagcloud.setSource(listData, mapping);
            tagcloud.reRender();
            dtd.resolve(tagcloud);
        });

        return dtd.promise();
    }

    function _renderRose(dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Rose", "DataViz"], function(Rose, DataViz) {
            var rose = new Rose(dom, option);
            rose.setSource(listData, mapping);
            rose.reRender();
            dtd.resolve(rose);
        });

        return dtd.promise();
    }

    function _renderDoubleline(dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["DoubleLine", "DataViz"], function(DoubleLine, DataViz) {
            var doubleline = new DoubleLine(dom, option);
            doubleline.setSource(listData, mapping);
            doubleline.reRender();
            dtd.resolve(doubleline);
        });

        return dtd.promise();
    }

    function _renderDataVizCalendar(dom, option, listData, mapping){
        var dtd = $.Deferred();

        requirejs(["Calendar", "DataViz"], function(Calendar, DataViz) {
            var calendar = new Calendar(dom, option);
            calendar.setSource(listData, mapping);
            calendar.reRender();
            dtd.resolve(calendar);
        });

        return dtd.promise();
    }

    function _renderStream(dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["Stream", "DataViz"], function(Stream, DataViz) {
            var stream = new Stream(dom, option);
            stream.setSource(listData, mapping);
            stream.reRender();
            dtd.resolve(stream);
        });

        return dtd.promise();
    }

    function _renderSunBurst(dom, option, listData, mapping) {
        var dtd = $.Deferred();

        requirejs(["SunBurst", "DataViz"], function(SunBurst, DataViz) {
            var sunburst = new SunBurst(dom, option);
            sunburst.setSource(listData, mapping);
            sunburst.reRender();
            dtd.resolve(sunburst);
        });

        return dtd.promise();
    }

    /******************接口***********************/
    function _getOptionType(option){
        var types;
        if (!!option.option.properties){
            types = option.option.properties.series.items.anyOf[0].properties.type["default"];
        }else{
            if(_.isArray(option.option.series)){
                types = option.option.series[0].type;
            }else{
                types = option.option.series.type;
            }
        }
        return types;
    }

    function _isDataViz(types){
        return _.contains(dataVizType, types);
    }

    function _isEcharts(types){
        return _.contains(echartsType, types);
    }

    function _isSimpleJson(json) {
        return !json.option.properties;
    }

    function _isUiJson(json) {
        return !!json.option.properties;
    }

    function DataVizChartInstance(option){
        this.option = option;
        var dom = _getDom(option);
        requirejs(["DataViz"], function(DataViz) {
            this.instance = DataViz.getInstanceByDom(dom) || {};
        });
        //this.instance = DataViz.getInstanceByDom(dom) || {};
        this.themeName = option.themeName;
        if (!this.themeName) {
            this.themeName = new Date().getTime().toString();
        }
    }

    DataVizChartInstance.prototype.render = function () {
        var option,
            dom = _getDom(this.option),
            optionData = this.option.data,
            listData = _toList(this.option.data["default"]),
            //listEvent = this.instance["event"],
            that = this;

        if (_isUiJson(this.option)){
            option = _getProperties(this.option);
        }else if (_isSimpleJson(this.option)) {
            option = this.option.option;
        }
        //_renderDataViz(dom, option, listData,optionData,listEvent).then(function (chartInstance) {
        _renderDataViz(dom, option, listData, optionData).then(function (chartInstance) {
            that.instance = chartInstance;
        });
    };

    DataVizChartInstance.prototype.resize = function () {
        this.instance.reRender();
    };

    DataVizChartInstance.prototype.dispose = function () {
        this.instance.clear();
    };

    DataVizChartInstance.prototype.on = function (event, callback) {
        if(!this.instance["event"])
            this.instance["event"]={};

        switch(event) {
            case "click":
                this.instance["event"]["onClick"] = callback;
                break;
            case "mouseover":
                this.instance["event"]["onMouseOver"] = callback;
                break;
            case "mouseout":
                this.instance["event"]["onMouseOut"] = callback;
                break;
            case "renderCallback":
                this.instance["event"]["renderCallback"] = callback;
                break;
        }
    };

    function EchartsChartInstance(option){
        this.option = option;
        var dom = _getDom(option);
        this.instance = echarts.getInstanceByDom(dom);
        this.themeName = option.themeName;
        if (!this.themeName) {
            this.themeName = new Date().getTime().toString();
        }
    }

    EchartsChartInstance.prototype.render = function (isRefresh) {
        if (!this.instance) {
            this.instance = echarts.init(this.option.dom, this.themeName);
        } else {
            if (!isRefresh) {
                this.instance.clear();
                this.instance = echarts.init(this.option.dom, this.themeName);
            }
        }

        this.option = render(this.option);
        this.instance.setOption(this.option);
    };

    EchartsChartInstance.prototype.resize = function () {
        this.instance.resize();
    };

    EchartsChartInstance.prototype.dispose = function () {
        //this.instance.dispose();
        this.instance.clear();
    };

    EchartsChartInstance.prototype.on = function (event, callback) {
        this.instance.on(event, callback);
    };

    function OtherChartInstance(option) {
        this.option = option;
        this.instance = Pivot.getInstance(option);
    }

    OtherChartInstance.prototype.render = function () {
        this.instance.render();
    };

    OtherChartInstance.prototype.resize = function () {
        this.instance.resize();
    };

    OtherChartInstance.prototype.dispose = function () {
        this.instance.dispose();
    };

    OtherChartInstance.prototype.on = function (event, callback) {
        this.instance.on(event, callback);
    };

    OtherChartInstance.prototype.setThemePalette = function(color) {
        this.instance.setThemeColor(color);
    };

    function getChartsInstance (option) {
        var chartInstance;

        var types = _getOptionType(option);
        if (_isDataViz(types)) {
            chartInstance = new DataVizChartInstance (option);
        } else if (_isEcharts(types)) {
            chartInstance = new EchartsChartInstance (option);
        } else {
            chartInstance = new OtherChartInstance (option);
        }

        return chartInstance;
    }
    /******************图表渲染结束***********************/

    function chroma_scale(length, chroma_scale) {
        var colors = [];
        scale.domain([1, length]);

        for (var i = 1; i <= length; i++) {
            var color = chroma_scale(scale(i)).darken(0.2).desaturate(0.2)._rgb;
            colors.push("rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")");
        }

        return colors;
    }

    function setThemePalette (themeData, chart) {
        var colorLength,
            colorArray,
            datavizThemeColor = {},
            themeType = chart.themeType,
            data = chart.simpleJson.data.default,
            dataProps = chart.simpleJson.data.properties,
            colorType = {
                BINDLENGTH: 0,
                UNIQLENGTH: 0,
                FIRSTBINDUNIQLENGTH: 0,
                UNIQLENGTHPLUS: 0
            },
            types = _getOptionType(chart.simpleJson),
            themeName = chart.simpleJson.themeName;

        if (!themeName) {
            themeName = new Date().getTime().toString();
            chart.simpleJson.themeName = themeName;
        }

        for (var p in dataProps) {
            switch(dataProps[p].colorType) {
                case ColorType.BINDLENGTH:
                    colorType.BINDLENGTH += dataProps[p].bind.length;
                    break;
                case ColorType.UNIQLENGTH:
                    if (dataProps[p].bind.length) {
                        var index = _.indexOf(data[0], dataProps[p].bind[0].name);
                        colorType.UNIQLENGTH += _.uniq(_.unzip(data)[index]).length;
                    }
                    break;
                case ColorType.FIRSTBINDUNIQLENGTH:
                    if (dataProps[p].bind.length) {
                        var index = _.indexOf(data[0], dataProps[p].bind[0].name);
                        colorType.FIRSTBINDUNIQLENGTH += _.uniq(_.unzip(data)[index]).length;
                    }
                    break;
                case ColorType.UNIQLENGTHPLUS:
                    if (dataProps[p].bind.length) {
                        _.each(dataProps[p].bind, function (bind) {
                            var index = _.indexOf(data[0], bind.name);
                            colorType.UNIQLENGTHPLUS += _.uniq(_.unzip(data)[index]).length;
                        });
                    }
                    break;
            }
        }

        colorLength = (colorType.BINDLENGTH || 1) * (colorType.UNIQLENGTH || 1) * (colorType.FIRSTBINDUNIQLENGTH || 1) * (colorType.UNIQLENGTHPLUS || 1);
        if (colorLength % 2 == 1) {
            colorLength += 1;
        }
        colorArray = chroma_scale(colorLength, chroma.scale("theme" + themeData.id + "_" + themeType));

        if (_isDataViz(types)) {
            datavizThemeColor.COLOR_ARGS = [];

            var arrays = [];
            _.each(colorArray, function (color, i) {
                arrays.push(color);
                if (i % 2 == 1) {
                    datavizThemeColor.COLOR_ARGS.push(arrays);
                    arrays = [];
                }
            });

            if (datavizThemeColor.COLOR_ARGS.length) {
                requirejs(["DataViz"], function(DataViz) {
                    //DataViz注册主题
                    DataViz.Theme.add(themeName, datavizThemeColor);
                    DataViz.Theme.changeTheme(themeName);
                });
            }
        } else if (_isEcharts(types)) {
            //Echarts注册主题
            echarts.registerTheme(themeName, {
                color: colorArray
            });
        } else {
            var sequential = _.clone(themeData.define.sequential);
            Pivot.setThemeColor(sequential);
        }
    }

    function setChartJsonColor (themeData, chart) {
        var chartJson = chart.simpleJson,
            types = _getOptionType(chart.simpleJson);

        if (_isEcharts(types)) {
            _setEchartsJson(themeData, chartJson);
        } else if (_isDataViz(types)) {
            _setDataVizJson(themeData, chartJson, types);
        } else {
            _setOtherJson(themeData, chartJson, types);
        }
    }

    function _setEchartsJson (themeData, chartJson) {
        if (!!chartJson.option.series[0].label) {
            if(typeof (chartJson.option.series[0].label.normal.textStyle) !== "undefined"){
                chartJson.option.series[0].label.normal.textStyle.color=themeData.define.text;
            }
        }

        if (!!chartJson.option.geo) {
            if (!!chartJson.option.geo.label) {
                if(typeof (chartJson.option.geo.label.normal) !== "undefined"){
                    if(typeof (chartJson.option.geo.label.normal.textStyle) !== "undefined"){
                        chartJson.option.geo.label.normal.textStyle.color = themeData.define.text;
                    }
                }
                if(typeof (chartJson.option.geo.label.emphasis) !== "undefined"){
                    if(typeof (chartJson.option.geo.label.emphasis.textStyle) !== "undefined"){
                        chartJson.option.geo.label.emphasis.textStyle.color = themeData.define.text;
                    }
                }
                if(typeof (chartJson.option.geo.itemStyle.normal) !== "undefined"){
                    chartJson.option.geo.itemStyle.normal.areaColor = themeData.define.tooltipBackground;
                }
                if(typeof (chartJson.option.geo.itemStyle.emphasis) !== "undefined"){
                    chartJson.option.geo.itemStyle.emphasis.areaColor = themeData.define.text;
                }
            }
        }

        if(typeof (chartJson.option.title) !== "undefined"){
            if(typeof (chartJson.option.title.textStyle) !== "undefined"){
                if(typeof (chartJson.option.title.textStyle.color) !== "undefined"){
                    chartJson.option.title.textStyle.color=themeData.define.title;
                }
            }
            if(typeof (chartJson.option.title.subtextStyle) !== "undefined"){
                if(typeof (chartJson.option.title.subtextStyle.color) !== "undefined"){
                    chartJson.option.title.subtextStyle.color=themeData.define.subtitle;
                }
            }
            if(typeof (chartJson.option.title.backgroundColor) !== "undefined"){
                chartJson.option.title.backgroundColor=themeData.define.background;
            }
        }

        if(typeof (chartJson.option.legend) !== "undefined"){
            if(typeof (chartJson.option.legend.textStyle) !== "undefined"){
                if(typeof (chartJson.option.legend.textStyle.color) !== "undefined"){
                    chartJson.option.legend.textStyle.color=themeData.define.legendText;
                }
            }
        }

        if(typeof (chartJson.option.grid) !== "undefined"){
            if(typeof (chartJson.option.grid.backgroundColor) !== "undefined"){
                chartJson.option.grid.backgroundColor=themeData.define.axisGrid;
            }
        }

        if(typeof (chartJson.option.xAxis) !== "undefined"){
            for (var x=0; x< chartJson.option.xAxis.length; x++){
                if(typeof (chartJson.option.xAxis[x].nameTextStyle) !== "undefined"){
                    if(typeof (chartJson.option.xAxis[x].nameTextStyle.color) !== "undefined"){
                        chartJson.option.xAxis[x].nameTextStyle.color=themeData.define.text;
                    }
                }
                if(typeof (chartJson.option.xAxis[x].axisLine) !== "undefined"){
                    if(typeof (chartJson.option.xAxis[x].axisLine.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.xAxis[x].axisLine.lineStyle.color) !== "undefined"){
                            chartJson.option.xAxis[x].axisLine.lineStyle.color=themeData.define.axisLine;
                        }
                    }
                }
                if(typeof (chartJson.option.xAxis[x].axisTick) !== "undefined"){
                    if(typeof (chartJson.option.xAxis[x].axisTick.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.xAxis[x].axisTick.lineStyle.color) !== "undefined"){
                            chartJson.option.xAxis[x].axisTick.lineStyle.color=themeData.define.axisTick;
                        }
                    }
                }
                if(typeof (chartJson.option.xAxis[x].axisLabel) !== "undefined"){
                    if(typeof (chartJson.option.xAxis[x].axisLabel.textStyle) !== "undefined"){
                        if(typeof (chartJson.option.xAxis[x].axisLabel.textStyle.color) !== "undefined"){
                            chartJson.option.xAxis[x].axisLabel.textStyle.color=themeData.define.axisText;
                        }
                    }
                }
            }
        }

        if(typeof (chartJson.option.yAxis) !== "undefined"){
            for (var y=0; y< chartJson.option.yAxis.length; y++){
                if(typeof (chartJson.option.yAxis[y].nameTextStyle) !== "undefined"){
                    if(typeof (chartJson.option.yAxis[y].nameTextStyle.color) !== "undefined"){
                        chartJson.option.yAxis[y].nameTextStyle.color=themeData.define.text;
                    }
                }
                if(typeof (chartJson.option.yAxis[y].axisLine) !== "undefined"){
                    if(typeof (chartJson.option.yAxis[y].axisLine.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.yAxis[y].axisLine.lineStyle.color) !== "undefined"){
                            chartJson.option.yAxis[y].axisLine.lineStyle.color=themeData.define.axisLine;
                        }
                    }
                }
                if(typeof (chartJson.option.yAxis[y].axisTick) !== "undefined"){
                    if(typeof (chartJson.option.yAxis[y].axisTick.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.yAxis[y].axisTick.lineStyle.color) !== "undefined"){
                            chartJson.option.yAxis[y].axisTick.lineStyle.color=themeData.define.axisTick;
                        }
                    }
                }
                if(typeof (chartJson.option.yAxis[y].axisLabel) !== "undefined"){
                    if(typeof (chartJson.option.yAxis[y].axisLabel.textStyle) !== "undefined"){
                        if(typeof (chartJson.option.yAxis[y].axisLabel.textStyle.color) !== "undefined"){
                            chartJson.option.yAxis[y].axisLabel.textStyle.color=themeData.define.axisText;
                        }
                    }
                }
            }
        }

        if(typeof (chartJson.option.radiusAxis) !== "undefined"){
            if(typeof (chartJson.option.radiusAxis.nameTextStyle) !== "undefined"){
                if(typeof (chartJson.option.radiusAxis.nameTextStyle.color) !== "undefined"){
                    chartJson.option.radiusAxis.nameTextStyle.color=themeData.define.text;
                }
            }
            if(typeof (chartJson.option.radiusAxis.axisLine) !== "undefined"){
                if(typeof (chartJson.option.radiusAxis.axisLine.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.radiusAxis.axisLine.lineStyle.color) !== "undefined"){
                        chartJson.option.radiusAxis.axisLine.lineStyle.color=themeData.define.axisLine;
                    }
                }
            }
            if(typeof (chartJson.option.radiusAxis.axisTick) !== "undefined"){
                if(typeof (chartJson.option.radiusAxis.axisTick.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.radiusAxis.axisTick.lineStyle.color) !== "undefined"){
                        chartJson.option.radiusAxis.axisTick.lineStyle.color=themeData.define.axisTick;
                    }
                }
            }
            if(typeof (chartJson.option.radiusAxis.axisLabel) !== "undefined"){
                if(typeof (chartJson.option.radiusAxis.axisLabel.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.radiusAxis.axisLabel.textStyle.color) !== "undefined"){
                        chartJson.option.radiusAxis.axisLabel.textStyle.color=themeData.define.axisText;
                    }
                }
            }
        }

        if(typeof (chartJson.option.angleAxis) !== "undefined"){
            if(typeof (chartJson.option.angleAxis.axisLine) !== "undefined"){
                if(typeof (chartJson.option.angleAxis.axisLine.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.angleAxis.axisLine.lineStyle.color) !== "undefined"){
                        chartJson.option.angleAxis.axisLine.lineStyle.color=themeData.define.axisLine;
                    }
                }
            }
            if(typeof (chartJson.option.angleAxis.axisTick) !== "undefined"){
                if(typeof (chartJson.option.angleAxis.axisTick.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.angleAxis.axisTick.lineStyle.color) !== "undefined"){
                        chartJson.option.angleAxis.axisTick.lineStyle.color=themeData.define.axisTick;
                    }
                }
            }
            if(typeof (chartJson.option.angleAxis.axisLabel) !== "undefined"){
                if(typeof (chartJson.option.angleAxis.axisLabel.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.angleAxis.axisLabel.textStyle.color) !== "undefined"){
                        chartJson.option.angleAxis.axisLabel.textStyle.color=themeData.define.axisText;
                    }
                }
            }
        }

        if(typeof (chartJson.option.radar) !== "undefined"){
            if(typeof (chartJson.option.radar.nameGap) !== "undefined"){
                if(typeof (chartJson.option.radar.nameGap.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.radar.nameGap.textStyle.color) !== "undefined"){
                        chartJson.option.radar.nameGap.textStyle.color=themeData.define.text;
                    }
                }
            }
            if(typeof (chartJson.option.radar.axisLine) !== "undefined"){
                if(typeof (chartJson.option.radar.axisLine.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.radar.axisLine.lineStyle.color) !== "undefined"){
                        chartJson.option.radar.axisLine.lineStyle.color = themeData.define.axisLine;
                    }
                }
            }
            if(typeof (chartJson.option.radar.axisTick) !== "undefined"){
                if(typeof (chartJson.option.radar.axisTick.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.radar.axisTick.lineStyle.color) !== "undefined"){
                        chartJson.option.radar.axisTick.lineStyle.color=themeData.define.axisTick;
                    }
                }
            }
            if(typeof (chartJson.option.radar.axisLabel) !== "undefined"){
                if(typeof (chartJson.option.radar.axisLabel.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.radar.axisLabel.textStyle.color) !== "undefined"){
                        chartJson.option.radar.axisLabel.textStyle.color = themeData.define.axisText;
                    }
                }
            }
            if(typeof (chartJson.option.radar.name) !== "undefined"){
                if(typeof (chartJson.option.radar.name.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.radar.name.textStyle.color) !== "undefined"){
                        chartJson.option.radar.name.textStyle.color = themeData.define.text;
                    }
                }
            }
        }

        if(typeof (chartJson.option.tooltip) !== "undefined"){
            if(typeof (chartJson.option.tooltip.textStyle) !== "undefined"){
                if(typeof (chartJson.option.tooltip.textStyle.color) !== "undefined"){
                    chartJson.option.tooltip.textStyle.color=themeData.define.tooltipText;
                }
            }
            if(typeof (chartJson.option.tooltip.backgroundColor) !== "undefined"){
                chartJson.option.tooltip.backgroundColor=themeData.define.tooltipBackground;
            }
            if(typeof (chartJson.option.tooltip.borderColor) !== "undefined"){
                chartJson.option.tooltip.borderColor=themeData.define.tooltipBorder;
            }
        }

        if(typeof (chartJson.option.geo) !== "undefined"){
            if(typeof (chartJson.option.geo.label) !== "undefined"){
                if(typeof (chartJson.option.geo.label.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.geo.label.textStyle.color) !== "undefined"){
                        chartJson.option.geo.label.textStyle.color=themeData.define.text;
                    }
                }
            }
            if(typeof (chartJson.option.geo.itemStyle) !== "undefined"){
                if(typeof (chartJson.option.geo.itemStyle.normal) !== "undefined"){
                    if(typeof (chartJson.option.geo.itemStyle.normal.color) !== "undefined"){
                        chartJson.option.geo.itemStyle.normal.color=themeData.define.axisLine;
                    }
                }
            }
        }

        if(typeof (chartJson.option.parallel) !== "undefined"){
            if(typeof (chartJson.option.parallel.parallelAxisDefault) !== "undefined"){
                if(typeof (chartJson.option.parallel.parallelAxisDefault.nameTextStyle) !== "undefined"){
                    if(typeof (chartJson.option.parallel.parallelAxisDefault.nameTextStyle.color) !== "undefined"){
                        chartJson.option.parallel.parallelAxisDefault.nameTextStyle.color=themeData.define.axisText;
                    }
                }
                if(typeof (chartJson.option.parallel.parallelAxisDefault.axisLine) !== "undefined"){
                    if(typeof (chartJson.option.parallel.parallelAxisDefault.axisLine.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.parallel.parallelAxisDefault.axisLine.lineStyle.color) !== "undefined"){
                            chartJson.option.parallel.parallelAxisDefault.axisLine.lineStyle.color=themeData.define.axisLine;
                        }
                    }
                }
                if(typeof (chartJson.option.parallel.parallelAxisDefault.axisTick) !== "undefined"){
                    if(typeof (chartJson.option.parallel.parallelAxisDefault.axisTick.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.parallel.parallelAxisDefault.axisTick.lineStyle.color) !== "undefined"){
                            chartJson.option.parallel.parallelAxisDefault.axisTick.lineStyle.color=themeData.define.axisTick;
                        }
                    }
                }
                if(typeof (chartJson.option.parallel.parallelAxisDefault.axisLabel) !== "undefined"){
                    if(typeof (chartJson.option.parallel.parallelAxisDefault.axisLabel.lineStyle) !== "undefined"){
                        if(typeof (chartJson.option.parallel.parallelAxisDefault.axisLabel.lineStyle.color) !== "undefined"){
                            chartJson.option.parallel.parallelAxisDefault.axisLabel.lineStyle.color=themeData.define.axisText;
                        }
                    }
                }
            }
        }

        if(typeof (chartJson.option.parallelAxis) !== "undefined"){
            if(typeof (chartJson.option.parallelAxis.nameTextStyle) !== "undefined"){
                if(typeof (chartJson.option.parallelAxis.nameTextStyle.color) !== "undefined"){
                    chartJson.option.parallelAxis.nameTextStyle.color=themeData.define.text;
                }
            }
            if(typeof (chartJson.option.parallelAxis.axisLine) !== "undefined"){
                if(typeof (chartJson.option.parallelAxis.axisLine.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.parallelAxis.axisLine.lineStyle.color) !== "undefined"){
                        chartJson.option.parallelAxis.axisLine.lineStyle.color=themeData.define.axisLine;
                    }
                }
            }
            if(typeof (chartJson.option.parallelAxis.axisTick) !== "undefined"){
                if(typeof (chartJson.option.parallelAxis.axisTick.lineStyle) !== "undefined"){
                    if(typeof (chartJson.option.parallelAxis.axisTick.lineStyle.color) !== "undefined"){
                        chartJson.option.parallelAxis.axisTick.lineStyle.color=themeData.define.axisTick;
                    }
                }
            }
            if(typeof (chartJson.option.parallelAxis.axisLabel) !== "undefined"){
                if(typeof (chartJson.option.parallelAxis.axisLabel.textStyle) !== "undefined"){
                    if(typeof (chartJson.option.parallelAxis.axisLabel.textStyle.color) !== "undefined"){
                        chartJson.option.parallelAxis.axisLabel.textStyle.color=themeData.define.axisText;
                    }
                }
            }
        }
    }

    function _setDataVizJson (themeData, chartJson, types) {

        if(typeof (chartJson.option.title) !== "undefined"){
            if(typeof (chartJson.option.title.textStyle) !== "undefined"){
                if(typeof (chartJson.option.title.textStyle.color) !== "undefined"){
                    chartJson.option.title.textStyle.color=themeData.define.title;
                }
            }
            if(typeof (chartJson.option.title.subtextStyle) !== "undefined"){
                if(typeof (chartJson.option.title.subtextStyle.color) !== "undefined"){
                    chartJson.option.title.subtextStyle.color=themeData.define.subtitle;
                }
            }
            if(typeof (chartJson.option.title.backgroundColor) !== "undefined"){
                chartJson.option.title.backgroundColor=themeData.define.background;
            }
        }

        if(typeof (chartJson.option.tooltip) !== "undefined"){
            if(typeof (chartJson.option.tooltip.textStyle) !== "undefined"){
                if(typeof (chartJson.option.tooltip.textStyle.color) !== "undefined"){
                    chartJson.option.tooltip.textStyle.color=themeData.define.tooltipText;
                }
            }
            if(typeof (chartJson.option.tooltip.backgroundColor) !== "undefined"){
                chartJson.option.tooltip.backgroundColor=themeData.define.tooltipBackground;
            }
            if(typeof (chartJson.option.tooltip.borderColor) !== "undefined"){
                chartJson.option.tooltip.borderColor=themeData.define.tooltipBorder;
            }
        }

        if(typeof (chartJson.option.legend) !== "undefined"){
            if(typeof (chartJson.option.legend.item) !== "undefined"){
                if(typeof (chartJson.option.legend.item.color) !== "undefined"){
                    chartJson.option.legend.item.color=themeData.define.legendText;
                }
            }
        }

        switch(types) {
            case "stream": _setStreamJson(themeData, chartJson);break;
            case "chord": _setChordJson(themeData, chartJson);break;
            case "doubleline": _setDoublelineJson(themeData, chartJson);break;
        }
    }

    function _setOtherJson (themeData, chartJson, types) {
        switch(types) {
            case "pivot": _setPivotJson(themeData, chartJson);break;
        }
    }

    function _setStreamJson (themeData, chartJson) {
        if(typeof (chartJson.option.series) !== "undefined"){
            if(typeof (chartJson.option.series[0].axisPopColor) !== "undefined"){
                chartJson.option.series[0].axisPopColor=themeData.define.tooltipBackground;
            }
            if(typeof (chartJson.option.series[0].axisPopTextColor) !== "undefined"){
                chartJson.option.series[0].axisPopTextColor=themeData.define.tooltipText;
            }
            if(typeof (chartJson.option.series[0].axisTextColor) !== "undefined"){
                chartJson.option.series[0].axisTextColor=themeData.define.axisText;
            }
            if(typeof (chartJson.option.series[0].percentageBarTextColor) !== "undefined"){
                chartJson.option.series[0].percentageBarTextColor=themeData.define.text;
            }
            if(typeof (chartJson.option.series[0].axisPopColor) !== "undefined"){
                chartJson.option.series[0].axisPopColor=themeData.define.tooltipBackground;
            }
        }

        if (typeof (chartJson.option.legend) !== "undefined") {
            if(typeof (chartJson.option.legend.item.color) !== "undefined"){
                chartJson.option.legend.item.color = themeData.define.legendText;
            }
        }
    }

    function _setChordJson (themeData, chartJson) {
        if(typeof (chartJson.option.series[0]) !== "undefined"){
            if(typeof (chartJson.option.series[0].textStyle) !== "undefined"){
                chartJson.option.series[0].textStyle.color=themeData.define.text;
            }
        }
    }

    function _setDoublelineJson (themeData, chartJson) {
        if(typeof (chartJson.option.series[0]) !== "undefined"){
            if(typeof (chartJson.option.series[0].captionStyle) !== "undefined"){
                chartJson.option.series[0].captionStyle.color=themeData.define.text;
            }
            if(typeof (chartJson.option.series[0].headerStyle) !== "undefined"){
                chartJson.option.series[0].headerStyle.color=themeData.define.text;
            }
            if(typeof (chartJson.option.series[0].textStyle) !== "undefined"){
                chartJson.option.series[0].textStyle.color=themeData.define.text;
            }
        }
    }

    function _setPivotJson(themeData, chartJson) {
        if (chartJson.option.series[0].label) {
            if (typeof (chartJson.option.series[0].label.normal.textStyle) !== "undefined") {
                chartJson.option.series[0].label.normal.textStyle.color = themeData.define.text;
            }
        }

        if (chartJson.option.series[0].background) {
            chartJson.option.series[0].background.color = themeData.define.sequential;
        }

        if (typeof (chartJson.option.xAxis) !== "undefined") {
            for (var x = 0; x < chartJson.option.xAxis.length; x++) {
                if (typeof (chartJson.option.xAxis[x].axisLine) !== "undefined") {
                    if (typeof (chartJson.option.xAxis[x].axisLine.lineStyle) !== "undefined") {
                        if (typeof (chartJson.option.xAxis[x].axisLine.lineStyle.color) !== "undefined") {
                            chartJson.option.xAxis[x].axisLine.lineStyle.color = themeData.define.axisLine;
                        }
                    }
                }
                if (typeof (chartJson.option.xAxis[x].axisLabel) !== "undefined") {
                    if (typeof (chartJson.option.xAxis[x].axisLabel.textStyle) !== "undefined") {
                        if (typeof (chartJson.option.xAxis[x].axisLabel.textStyle.color) !== "undefined") {
                            chartJson.option.xAxis[x].axisLabel.textStyle.color = themeData.define.axisText;
                        }
                    }
                }
            }
        }

        if (typeof (chartJson.option.yAxis) !== "undefined") {
            for (var y = 0; y < chartJson.option.yAxis.length; y++) {
                if (typeof (chartJson.option.yAxis[y].axisLine) !== "undefined") {
                    if (typeof (chartJson.option.yAxis[y].axisLine.lineStyle) !== "undefined") {
                        if (typeof (chartJson.option.yAxis[y].axisLine.lineStyle.color) !== "undefined") {
                            chartJson.option.yAxis[y].axisLine.lineStyle.color = themeData.define.axisLine;
                        }
                    }
                }
                if (typeof (chartJson.option.yAxis[y].axisLabel) !== "undefined") {
                    if (typeof (chartJson.option.yAxis[y].axisLabel.textStyle) !== "undefined") {
                        if (typeof (chartJson.option.yAxis[y].axisLabel.textStyle.color) !== "undefined") {
                            chartJson.option.yAxis[y].axisLabel.textStyle.color = themeData.define.axisText;
                        }
                    }
                }
            }
        }
    }

    window.getChartsInstance = getChartsInstance;
    window.setThemePalette = setThemePalette;
    window.setChartJsonColor = setChartJsonColor;

})(window);