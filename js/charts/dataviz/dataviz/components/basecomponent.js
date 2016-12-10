/*!***********************************************
Copyright (c) 2014, Neusoft Inc.
All rights reserved.
SaCa DataViz Version 2.0.0
************************************************/
(function (name, definition) {
  if (typeof define === 'function') { 
    define(definition);
  } else { 
    this[name] = definition(function (id) {
      return this[id];
    });
  }
})('BaseComponent',function (require) {
	
	var DataViz = require("DataViz");
	var EventProxy = require('EventProxy');
	var Utils = require("Utils");
	
	/**
	 * @class BaseComponent
     * 所有Chart的源定义
     * Examples:
     * 
     *    	var Stream = DataViz.extend(DataViz.BaseComponent, {
     *        	initialize: function () {
     *            	this.type = "Stream";
     *        	},
     *       	 clearCanvas: function () {
     *            	this.canvas.clear();
     *            	this.legend.innerHTML = "";
     *        	}
     *    	});
     *
     */
    var BaseComponent = DataViz.extend(EventProxy, {
        type: "BaseComponent",
        initialize: function () {
        	this.spliceProp = {
        			legend	:	["showLegend", "colorMode", "legendColor", "valueRange", "typeName",
        			      	 	 "rectColor","leftLegendWidth","legendPosition", "topLegendHeight",
        			      	 	 "showStatistics","marginLeft","position","marginTop","data","legendStyle"],
        			floatTag:	["tipStyle", "tipFormat", "showTips"],
        			title:	["caption","captionFont"]
        	};
        	this.changeProp = {
        			"sorted" : "isSorted",
        			"sort" : "isSorted",
        			"yearStart" : "startYear",
        			"yearEnd" : "endYear",
        			"donutTextAttr" :"textStyle",
        			"graduationTextAttr":"graduationTextStyle",
        			"color":"legendColor",
        			"hasGraduation":"showGraduation",
        			"hasGraduationAmount":"showGraduationAmount",
        			"onClickChord":"onClick",
        			"onDonutTipFormat":"donutTipFormat",
        			"onChordTipFormat":"chordTipFormat",
        			"color":"arcColor",
        			"onDblclick":"onDblClick",
        			"onRootClick":"onLeafClick",
        			"angle":"rotateAngle",
        			"onSpecialBubbleColor":"onSpecialColor",
        			"autoHeight":"adaption"
        	};
        	this.v3keys = ["chart", "title", "legend", "floatTag"];
        }
    });
    
    /**
     * 拥有一个组件
     */
    BaseComponent.prototype.own = function (widget) {
        widget.setOptions(this.defaults);
        widget.owner = this;
        this.widgets.push(widget);
        return widget;
    };
    
    /**
     * setSource时未取到数据处理方法
     */
    BaseComponent.prototype.validateSource = function (source) {
    	var errMsg = "";
    	if(!source) {
    		errMsg = "未能取到数据";
    	} else {
    		if(_.isArray(source)) {
    			switch (Utils.detect(source)) {
        		case 'Table_WITH_HEAD':
        			if(!source[1]) {
        				errMsg = "没有需要展示的数据";
        			}
        			break;
        		case 'List':
        			if(!source[0] || _.keys(source[0]).length == 0) {
        				errMsg = "没有需要展示的数据";
        			}
        			break;
        		case 'Unknown':
        			errMsg = "提供的数据格式不正确";
        			break;
        		  	default:
        		}
    		} else if(_.isObject(source)) {
    			if(_.keys(source).length == 0) {
    				errMsg = "没有需要展示的数据";
    			}
    		} else {
    			errMsg = "提供的数据格式不正确";
    		}
    	}
    	
    	if(errMsg) {
    		this.isLoaded(this.node);
    		var nodeHeight = $(this.node).height();
			$(this.node).html("<p style='width:100px;color:#a94442; font-family:Microsoft YaHei; line-height:"+nodeHeight+"px; " +
					"margin: 0 auto;'>"+errMsg+"</p>");
    		
    		return false;
    	} else {
    		return true;
    	}
    };
    
    /**
     * 建立标准属性数据结构
     */
    BaseComponent.prototype.buildStructure = function (options) {
    	var obj = {};
    	obj["chart"] = {};
    	obj["floatTag"] = {};
    	
    	for(var prop in options) {
    		for (var k in this.spliceProp) {
    			if (_.contains(this.spliceProp[k], prop)) {
    				obj[k] ? obj[k] : obj[k] = {};
    				obj[k][prop] = options[prop];
    				delete options[prop];
    			}
    		}
    		if (options[prop] != undefined) {
    			obj["chart"][prop] = options[prop];
    			delete options[prop];
    		}
    	}
    	
    	this._judgeWidthHeight(obj);
    	this._buildLegendTag(obj);
    	this._buildFloatTag(obj);
    	this._buildTitle(obj);
    	
    	return obj;
    };
    
    /**
     * 判断是否设置高度(v3目前必须设置宽高)
     */
    BaseComponent.prototype._judgeWidthHeight = function(obj){
    	if(obj.chart.width && !obj.chart.height){
    		obj.chart.height = obj.chart.width;
    	}else if(!obj.chart.width && obj.chart.height){
    		obj.chart.height = obj.chart.width = 500;
    	}
    };
    
    /**
     * 建立标准属性数据结构:兼容处理legend
     */
    BaseComponent.prototype._buildLegendTag = function (obj) {
    	if (!obj.legend) {
    		return;
    	}else if(!obj.legend.showLegend){
    		delete obj.legend;
    		return;
    	}
    	var color = obj.legend.rectColor || obj.legend.valueRange;
    	if (color && obj.legend.colorMode == "custom") {
    		var data = [];
			var legendColor = [];
			if (color[0].min) {
				_.each(color, function(o){
					data.push([o.min, o.max]);
					legendColor.push(o.color);
				});
			}
			if (color[0].range) {
				_.each(color, function(o){
					data.push(o.range);
					var item = {};
					item.name = "["+o.range.toString()+"]";
					item.color = o.color;
					legendColor.push(item);
				});
			}
			obj.legend.data = data;
			obj.legend.legendColor = legendColor;
    	}
    };
    
    /**
     * 建立标准属性数据结构:兼容处理floattag
     */
    BaseComponent.prototype._buildFloatTag = function (obj) {
    	
    	if (obj.floatTag) {
    		var tipStyle = obj.floatTag.tipStyle;
    		
    		if (tipStyle) {
				for(var prop in tipStyle) {
					obj.floatTag[prop] = tipStyle[prop];
				}
    		}
    		delete obj.floatTag.tipStyle;
    	}
    };
    
    /**
     * 建立标准属性数据结构:兼容处理title
     */
    BaseComponent.prototype._buildTitle = function (obj) {
    	
    	if (obj.title) {
    		var titleStyle = obj.title;
    		
    		if (titleStyle) {
				for(var prop in titleStyle) {
					obj.title[prop] = titleStyle[prop];
				}
    		}
    	}
    };
    
    /**
     * 判断当前属性版本
     */
    BaseComponent.prototype.isV2 = function (options) {
    	if (options.chart) {
    		return false;
    	} else {
    		return true;
    	}
    };
    
    /**
     * 替换掉旧属性名
     */
    BaseComponent.prototype.replaceOldName = function (options) {
    	var oldKeys = _.keys(this.changeProp); 
    	for(var i in options) {
    		if (_.contains(oldKeys, i)) {
    			options[this.changeProp[i]] = options[i];
    			delete options[i];
    		}
    	}
    };
    
    /**
     * 保存初始宽高
     */
    BaseComponent.prototype._saveInitWH = function (options) {
    	DataViz.adaption.push({"id" : this.node.id, "obj": this, "initialWH" : [options.width, options.height]});
    	//如果是 <= ie8 div加<>
    	if(DataViz.vml){
    		var divNode = $("#"+this.node.id);
    		divNode.css("overflow","hidden");
    		
    	}
    	options.width = $(this.node).width();
        options.height = $(this.node).height();
    };
    
    BaseComponent.prototype._saveInitPercentageWH = function () {
    	var $nodeParent = $(this.node).parent(),
    		nodeParentW = $nodeParent.width(),
    		nodeParentH = $nodeParent.height(),
    		nodeW = $(this.node).width(),
    		nodeH = $(this.node).height(),
    		percentageW = parseInt((nodeW / nodeParentW * 100)) + "%",
    		percentageH = parseInt((nodeH / nodeParentH * 100)) + "%";
    	DataViz.percentageAdaption[this.node.id] = [percentageW, percentageH];
    };
    
    /**
     * 应用自适应
     * @param options
     */
    BaseComponent.prototype.applyAdaption = function (options) {
    	if (options.chart.adaption) {
    		//$(this.node).width(DataViz.percentageAdaption[this.node.id][0]);
    		//$(this.node).height(DataViz.percentageAdaption[this.node.id][1]);
    		var that = this;
    		var tarAdaption = _.find(DataViz.adaption, function(item){ 
    				return item.id == that.node.id; 
    			});
    		if(tarAdaption) {
    			tarAdaption.initialWH = DataViz.percentageAdaption[this.node.id];
    		} else {
    			DataViz.adaption.push({"id" : this.node.id, "obj": this, "initialWH" : DataViz.percentageAdaption[this.node.id]});
    		}
    	} else {
    		var tarAdaption = [];
    		for(var i = 0; i < DataViz.adaption.length; i++) {
    			if(DataViz.adaption[i].id != this.node.id) {
    				tarAdaption.push(DataViz.adaption[i]);
    			}
    		}
    		DataViz.adaption = tarAdaption;
    	}
    };
    
    /**
     * @method checkOptions
     * 返回options中的构件类型
     * @return {Array} 
     */
    BaseComponent.prototype.checkOptions = function (options) {
    	if (!options.chart) {
    		//错误码需要统一
    		throw new Error("DataViz Error # Chart Error : Please create a chart module. ");
    	}
    	
    	this._saveInitPercentageWH();
    	
    	if (options.chart.adaption) {
    		this._saveInitWH(options.chart);
    	} else {
            $(this.node).width(options.chart.width);
            $(this.node).height(options.chart.height);
    	}
    	
    	for (var prop in options) {
    		options[prop]["type"] = prop;
    	}
    };
    
    /**
     * 如果node是字符串，会当作ID进行查找。
     * 如果是DOM元素，直接返回该元素。
     * 如果是jQuery对象，返回对象中的第一个元素。
     * 如果节点不存在，则抛出异常
     * Examples:
     * ```
     * BaseComponent.checkContainer("id");
     * BaseComponent.checkContainer(document.getElementById("id"));
     * BaseComponent.checkContainer($("#id"));
     * ```
     * @param {Mix} node The element Id or Dom element
     * @return {Object} 返回找到的DOM节点
     * @ignore
     */
    BaseComponent.prototype.checkContainer = function (node) {
        var ret = null;

        if (typeof node === "string") {
            ret = document.getElementById(node);
        } else if (node.nodeName) { //DOM-element
            ret = node;
        } else if (node.size() > 0) {
            ret = node[0];
        }
        if (!ret) {
        	throw new Error("DataViz Error # DOM Error : Please specify a correct node to render.");
        }
        $(ret).css({position:"relative"});
        return ret;
    };
    
    /**
     * @method isLoaded
     * 判断该节点是否有loading，如果有就隐藏
     */
    BaseComponent.prototype.isLoaded = function (node) {
    	var loadingArr = DataViz.loading,
    		restArr = [];
    	if(loadingArr.length > 0){
			for(var i = 0; i<loadingArr.length; i++){
				if(loadingArr[i].node == node || loadingArr[i].node == $("body")[0]){
					loadingArr[i].hideLoading();
				}else{
					restArr.push(loadingArr[i]);
				}
			}
			DataViz.loading = restArr;
		}
	};
	
    /**
     * @method createTitle
     * 创建标题
     */
    BaseComponent.prototype.createTitle = function () {
    	var node = arguments[0];
    	var options = arguments[1];
    	if (!options || !options.show) {
    		return;
    	}
    	var Title = require("Title");
    	this.title = this.own(new Title(node, options));
    	this.title.canvas = this.titleCanvas;
    	this.title.canvas.setStart();
    	this.title.render();
		this.title.st = this.titleCanvas.setFinish();
		this.instances.push(this.title);
    };
    
    /**
     * @method createLegend
     * 创建图例
     */
    BaseComponent.prototype.createLegend = function () {
    	var node = arguments[0];
    	var options = arguments[1];
    	var source = arguments[2];
    	
    	if (!options || !source || !options.show) {
    		return;
    	}
    	
    	var Legend = require("LegendNew");
    	this.legend = this.own(new Legend(node, options));
    	this.legend.setSource(source);
    	this.legend.canvas = this.legendCanvas;
    	this.legend.render();
    	this.instances.push(this.legend);
    };
    
    /**
     * @method createFloatTag
     * 创建提示框
     */
    BaseComponent.prototype.createFloatTag = function () {
    	var node = arguments[0];
    	var options = arguments[1];
    	
    	if (!options || !options.show) {
    		return;
    	}
    	if(options.showTips == true || options.showTips == undefined) {
    		var FloatTag = require("floatTag");
    		this.floatTag = new FloatTag(node, options);
    		this.floatTag.div = this.floatTag.createFloatTag()(node);
    	}
    };
    
    /**
     * @method createChart
     * 创建图表
     */
    BaseComponent.prototype.createChart = function () {
    	var that = this;
    	
    	var node = arguments[0],
    		options = arguments[1],
    		source = arguments[2],
    		callback = arguments[3];
    	
    	var chartSize = this.calculatePos(this.instances);
  	  	var newProp = {
  	  			type : options.type, 
  	  			width : chartSize.width, 
  	  			height : chartSize.height,
  	  			left : chartSize.left,
  	  			top : chartSize.top
  	  			};
  	  	
  	  	var typeName = this.jointChartStr(this.type);
  	  	var chartOptions = this.merge(options, newProp);
	  	requirejs([ "" + typeName + "" ], function (Chart) {
	  		var chart = that.own(new Chart(node, chartOptions));
	  		chart.setSource(source);
	  		chart.canvas = that.canvas;
	  		chart.floatTag = that.floatTag;
	  		chart.render();
	  		
	  		that.chart = chart;
	  		that.instances.push(that.chart);
	  		that._init();
	  		if(callback) {
	  			callback.call(that);
	  		}
	  	});
    };
    
    /**
     * @method jointChartStr
     * 拼接require的Chart对象
     */
    BaseComponent.prototype.jointChartStr = function () {
    	return arguments[0] + "Chart";
    };
    
    /**
     * @method merge
     * 合并对象属性值
     */
    BaseComponent.prototype.merge = function (obj, props) {
    	return _.extend(obj, props);
    };
    
    /**
     * @method setOptions
     * 合并对象属性值
     */
    BaseComponent.prototype.setOptions = function (options) {
    	var obj = this.options;
    	var keys = _.keys(options);
    	var isV3 = false;
    	
    	for (var i = 0, l = keys.length; i < l; i++) {
    		if (_.contains(this.v3keys, keys[i])) {
    			isV3 = true;
    			break;
    		}
    	}
    	
    	if (isV3) {
    		for(var p in options) {
    			var props = options[p];
    			if(p == "legend") {
    				props["showLegend"] = true;
    			}
    			var tarSpliceProp = this.spliceProp[p];
    			for(var prop in props) {
    				if(tarSpliceProp) {
    					if (_.contains(tarSpliceProp, prop)) {
    						obj[p] ? obj[p] : obj[p] = {};
    						obj[p]["type"] = p;
    						obj[p][prop] = props[prop];
    					}
        			}
    				
    				if (props[prop] != undefined) {
    					if(!obj[p]) {
    						obj[p] = {};
							obj[p]["type"] = p;
    					}
    					obj[p][prop] = props[prop];
    				}
    			}
    		}
    	} else {
    		this.replaceOldName(options);
    		for(var prop in options) {
        		for (var k in this.spliceProp) {
        			if (_.contains(this.spliceProp[k], prop)) {
        				obj[k] ? obj[k] : obj[k] = {};
        				obj[k][prop] = options[prop];
        			}
        		}
        		if (options[prop] != undefined) {
        			obj["chart"][prop] = options[prop];
        		}
        	}
    	}
    	
    	this._buildLegendTag(obj);
    	this._buildFloatTag(obj);
    	this._buildTitle(obj);
    };
    
    /**
     * @method calculatePos
     * 计算图表位置
     */
    BaseComponent.prototype.calculatePos = function (instances) {
    	
    	var that = this;
    	
    	var chartLeft = 0;
    	var chartTop = 0;
    	
    	var w = $(this.node).width();
    	var h = $(this.node).height();
    	
    	var chartWidth = initWidth = w;
    	var chartHeight = initHeight = h;
    	
    	instances.forEach(function(instance){
    		var st = instance.st;
    		var bBox = st.getBBox();
    		
    		var height = bBox.height;
    		var x = bBox.x;
    		var y = bBox.y;
    		var x2 = bBox.x2;
    		var y2 = bBox.y2;
    		
    		switch(instance.type) {
    		case "Title":
				var newWidth = chartWidth;
				var newHeight = y2;
				that.titleCanvas.setSize(newWidth, newHeight);
				
    			switch (instance.defaults.position) {
    			case "top":
    				chartTop = newHeight;
    				chartHeight -= chartTop;
    				break;
    			case "bottom":
    				chartHeight -= height;
    				break;
    			}
    			break;
    		case "Legend":
    			switch (instance.defaults.position) {
    			case "left":
    				var newWidth = x2 + 10;
    				var newHeight = y2;
    				that.legendCanvas.setSize(newWidth, newHeight);
    				
    				chartLeft = x2 + 10; 
    				chartWidth -= chartLeft;
    				break;
    			case "right":
    				var newWidth = x2;
    				var newHeight = y2;
    				that.legendCanvas.setSize(newWidth, newHeight);
    				
    				chartWidth = x - chartLeft;
    				break;
    			case "top":
    				var newWidth = x2;
    				var newHeight = y2;
    				that.legendCanvas.setSize(newWidth, newHeight);
    				
    				chartTop = y2;
    				chartHeight = initHeight - chartTop;
    				break;
    			case "bottom":
    				var newWidth = initWidth;
    				var newHeight = y2;
    				that.legendCanvas.setSize(newWidth, newHeight);
    				
    				chartHeight = y - chartTop;
    				break;
    			}
    			break;
    		}
    	});
    	$(this.canvas.canvas).css({left : Math.round(chartLeft), top : Math.round(chartTop)});
    	that.canvas.setSize(chartWidth, chartHeight);
    	return {"left" : Math.round(chartLeft), "top" : Math.round(chartTop), "width" : Math.round(chartWidth), "height" : Math.round(chartHeight)};
    };
    
    BaseComponent.prototype._createCanvas = function () {
    	var width = $(this.node).width(),
    		height = $(this.node).height();
    	
		this.canvas = DataViz.createCanvas(this.node, width, height);
		if (this.options.title) {
			this.titleCanvas = DataViz.createCanvas(this.node,  width,  height);
		} 
		if (this.options.legend) {
			this.legendCanvas = DataViz.createCanvas(this.node,  width,  height);
		}
	};
	
    BaseComponent.prototype.clear = function () {
    	if (!!this.chart) {
    		for(var p in this.chart) {
    			if (_.isArray(this.chart[p])) {
    				if (this.chart[p].length && !!this.chart[p][0] && !!this.chart[p][0].paper) {
    					_.each(this.chart[p], function(d){
    						d.removeData();
    						d.unhover();
    						d.unmouseover();
    						d.unmouseout();
    						d.unclick();
    						d.undblclick();
    					});	
    				}
    			}
    		}
    	}
    	if (!!this.legend) {
			if (!!this.legend.st) {
				_.each(this.legend.st, function(d){
					d.removeData();
					d.unhover();
					d.unmouseover();
					d.unmouseout();
					d.unclick();
					d.undblclick();
				});	
			}
    	}
    	if (!!this.title) {
			if (!!this.title.st) {
				_.each(this.title.st, function(d){
					d.removeData();
					d.unhover();
					d.unmouseover();
					d.unmouseout();
					d.unclick();
					d.undblclick();
				});	
			}
    	}
    	this.canvas = this.canvas || this.paper;
    	if (!!this.canvas) {
    		this.canvas.clear();
    		this.canvas.remove();
    	}
    	$(this.node).empty();
	};
	
    BaseComponent.prototype.judgeLegendDimension = function () {
    	var legendOption = arguments[0];
    	var chartDimensions = arguments[1];
    	
    	if (legendOption) {
    		var legendDimension = legendOption.data;
    		if (_.contains(chartDimensions, legendDimension)) {
        		return;
        	} else {
        		throw new Error("DataViz Error # Legend Error :Property data must be included in " + chartDimensions.toString());
        	}
    	}
	};
	
    return BaseComponent;
});