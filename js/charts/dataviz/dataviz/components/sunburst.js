;(function (name, definition) {
  if (typeof define === 'function') {
    define(definition);
  } else { 
    this[name] = definition(function (id) { return this[id];});
  }
})('SunBurst', function (require) {
	var DataViz = require("DataViz");
	var BaseComponent = require("BaseComponent");
	var DataProcessor = require("DataProcessor");
	var Utils = require('Utils');

 	var SunBurst = DataViz.extend(BaseComponent, {
 		initialize: function (node, options) {
	      this.type = "SunBurst";
	      this.id = DataViz.idBase++;
	      this.node = this.checkContainer(node);
	      
	      this._compatibility(options);
	      this.checkOptions(this.options);
	      this.isV2 = this.isV2(options);
	      
	      DataViz.instances[this.id] = this;
		
	      this.instances = [];
	      this.widgets = [];
	      this.colorDict = [];
	      this.colorArray = [];
	      this.theme = DataViz.Theme.current;
	      this.isDataValidated = true;
 		}
  });
 	
 	/**
	 * @method setSource
	 * 数据源加载函数 
	 * @param {JSON | CSV} source
	 * @param {Object} map
	 * 
	 * example：  
	 * 		
	 * 		sunBurst.setSource(source, {
	 * 			"ID":0, // "ID"在样例数据文件里第0列位置(csv)或者对象的第0个字段(json)，代表扇块的ID
	 * 			"name":1, // "name"在样例数据文件里第1列位置(csv)或者对象的第1个字段(json)，代表扇块的名称
	 * 			"size":2,// "size"在样例数据文件里第2列位置(csv)或者对象的第2个字段(json)，影响扇块的宽度
	 * 			"parentID":3,// "parentID"在样例数据文件里第3列位置(csv)或者对象的第3个字段(json)，代表扇块的parentID
	 * 			"info":4// "info"在样例数据文件里第4列位置(csv)或者对象的第4个字段(json)，代表扇块的自定义信息，可选
	 *		});
	 */
 	SunBurst.prototype.setSource = function (source, map) {
 		// 验证数据完整性
 		this.isDataValidated = this.validateSource(source);
		if(!this.isDataValidated) {
			return false;
		}
 		if(!map && this.isV2){
			map = {ID:0, name:1, size:2, parentID:3, info:4};
		}
 		
 		this.chartSource = {};
 		var dimensions = DataProcessor.getDimensions(map);
 		var chartSource;
 		
 		if(Utils.detect(source) == "List") {
 			if(source[0].children) {
 				dimensions.splice(0, 0, "ID");
 	 			dimensions.splice(2, 1);
 	 			dimensions.splice(3, 0, "parentID");
 	 			chartSource = source[0];
 			} else {
 				var tempSource = Utils.tablify(source);
 	 			chartSource = DataProcessor.arrayToTreeJson(tempSource, map);
 			}
 		} else {
 			chartSource = DataProcessor.arrayToTreeJson(source, map);
 		}
 		
 		this.chartSource.dimensions = dimensions;
 		this.chartSource.source = chartSource;
	};
  
	SunBurst.prototype.getLastOneLeafDimensionsOfTree = function (treeObj) {
		if(treeObj.children) {
			return this.getLastOneLeafDimensionsOfTree(treeObj.children[0]);
		} else {
			var targetLeaf = treeObj;
			var tempList = [];
			tempList.push(targetLeaf);
			var tempRst = Utils.tablify(tempList);
			return tempRst[0];
		}
	};
	
	/**
	 * 兼容V1与V2版本
	 * @ignore
	 */
	SunBurst.prototype._compatibility = function (options) {
		if (this.isV2(options)) {
			this.replaceOldName(options);
			this.options = this.buildStructure(options);
		} else {
			this.options = options;
		}
	};
	
	SunBurst.prototype.createChart = function () {

    	var that = this;
    	
    	var node = arguments[0],
    		options = arguments[1],
    		source = arguments[2],
    		callback = arguments[3];
    	
    	if (!options) {
    		throw new Error("DataViz Error # Chart Error : Please create a chart module.");
    	}
    	
    	var chartSize = this.calculatePos(this.instances);
  	  	var newProp = {
  	  			type : options.type, 
  	  			width : chartSize.width, 
  	  			height : chartSize.height,
  	  			left : chartSize.left,
  	  			top : chartSize.top
  	  			};
  	  	
  	  	var typeName = undefined;
  	    if (DataViz.svg) {
  	    	typeName = this.jointChartStr(this.type);
  	    } else {
  	    	typeName = this.type + "2Chart";
  	    }
  	  	var chartOptions = this.merge(options, newProp);
	  	requirejs([ "" + typeName + "" ], function (Chart) {
	  		var chart = that.own(new Chart(node, chartOptions));
	  		chart.setSource(source);
	  		if (DataViz.svg) {
	  			chart.svg = that.svg;
	  		} else {
	  			chart.canvas = that.canvas;
	  		}
	  		chart.floatTag = that.floatTag;
	  		chart.render();
	  		
	  		that.chart = chart;
	  		
	  		callback && callback.call(that);
	  	});
	};
	
	/**
	 * 创建各模块
	 * @ignore
	 */
	SunBurst.prototype._draw = function (callback) {
		  
		var options = this.options,
			node = this.node;
		
		this.createTitle(node, options.title);
	  
		this.createLegend(node, options.legend, this.legendSource);
	  
		this.createFloatTag(node, options.floatTag);
	  
		this.createChart(node, options.chart, this.chartSource, callback);
	};
	
	/**
	 * 构件通信
	 * @ignore
	 */
	SunBurst.prototype._init = function () {
    };
    
    SunBurst.prototype.calculatePos = function (instances) {

    	
    	var that = this;
    	
    	var chartLeft = 0;
    	var chartTop = 0;
    	var chartWidth = $(this.node).width();
    	var chartHeight = $(this.node).height();
    	var initHeight = $(this.node).height();
    	var initWidth = $(this.node).width();
    	
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
    				var newWidth = x2;
    				var newHeight = initHeight;
    				that.legendCanvas.setSize(newWidth, newHeight);
    				
    				chartLeft = x2; 
    				chartWidth -= chartLeft;
    				break;
    			case "right":
    				var newWidth = x2;
    				var newHeight = initHeight;
    				that.legendCanvas.setSize(newWidth, newHeight);
    				
    				chartWidth = x - chartLeft;
    				break;
    			case "top":
    				var newWidth = initWidth;
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
    	if (DataViz.svg) {
    		var $chartSVG = $("#chartSVG");
        	$chartSVG.css({position:"absolute",left : Math.round(chartLeft), top : Math.round(chartTop)});
    	} else {
    		$(this.canvas.canvas).css({left : Math.round(chartLeft), top : Math.round(chartTop)});
        	that.canvas.setSize(chartWidth, chartHeight);
    	}
    	return {"left" : Math.round(chartLeft), "top" : Math.round(chartTop), "width" : Math.round(chartWidth), "height" : Math.round(chartHeight)};
    };
    
    /**
	 * 创建画布
	 * @ignore
	 */
    SunBurst.prototype._createCanvas = function () {
    	if (this.options.title) {
    		this.titleCanvas = DataViz.createCanvas(this.node, this.options.chart.width, 50);
    	} 
    	if (DataViz.svg) {
    		this.svg = d3.select(this.node)
    		.append("svg")
    		.attr("width", this.options.chart.width)
    		.attr("height",this.options.chart.height)
    		.attr("id", "chartSVG")
    		.append("g")
    		.attr("transform","translate(" + this.options.chart.width / 2 + "," + this.options.chart.height * .5 + ")");
    	} else {
    		this.canvas = DataViz.createCanvas(this.node, this.options.chart.width, this.options.chart.height);
    	}
	};
    
	/**
	 * @method drill
	 * 模拟鼠标点击API，产生钻取效果
	 * @param {String} text
	 * 钻取目标text
	 */
	SunBurst.prototype.drill = function(text) {
		this.chart.drill(text);
	};
	
	/**
	 * @method render
	 * 渲染函数
	 */
    SunBurst.prototype.render = function () {
    	if(!this.isDataValidated) {
			return false;
		}
		this._createCanvas();
		this._draw(this.options.chart.renderCallback);
		this.isLoaded(this.node);
	};
	
	/**
	 * @method reRender
	 * 重绘函数
	 */
	SunBurst.prototype.reRender = function () {
		this.clear();
		this.instances = [];
		this.colorDict = [];
		this.colorArray = [];
		this.applyAdaption(this.options);
		this.render();
	};
	
	return SunBurst;
});
