;(function (name, definition) {
  if (typeof define === 'function') {
    define(definition);
  } else { 
    this[name] = definition(function (id) { return this[id];});
  }
})('Tagcloud', function (require) {
	var DataViz = require("DataViz");
	var DataProcessor = require("DataProcessor");
	var BaseComponent = require("BaseComponent");

 	var Tagcloud = DataViz.extend(BaseComponent, {
 		initialize: function (node, options) {
	      this.type = "Tagcloud";
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
	 * 		tagcloud.setSource(source, {
	 * 			"text":0, // "text"在样例数据文件里第0列位置(csv)或者对象的第0个字段(json)，代表标签的名称
	 * 			"weight":1, // "weight"在样例数据文件里第1列位置(csv)或者对象的第1个字段(json)，代表标签的权重
	 * 			"info":2// "info"在样例数据文件里第2列位置(csv)或者对象的第2个字段(json)，代表标签的自定义信息，可选
	 *		});
	 */
 	Tagcloud.prototype.setSource = function (source, map) {
 		// 验证数据完整性
 		this.isDataValidated = this.validateSource(source);
		if(!this.isDataValidated) {
			return false;
		}
 		if(!map && this.isV2){
			map = {text:0, weight:1, info:2};
		}
		this.source = DataProcessor.toList(source, map);

        //自定义维度类型
        var invertMap = _.invert(map);
        this.source.dimensionType = {};
        this.source.dimensionType[invertMap["0"]] = "ordinal";
        this.source.dimensionType[invertMap["1"]] = "quantitative";

		this.chartSource = DataProcessor.getSource(this.source, this.options.chart);
	};
  
	/**
	 * 兼容V1与V2版本
	 * @ignore
	 */
	Tagcloud.prototype._compatibility = function (options) {
		if (this.isV2(options)) {
			this.replaceOldName(options);
			this.options = this.buildStructure(options);
		} else {
			this.options = options;
		}
	};
	
	/**
	 * 创建各模块
	 * @ignore
	 */
	Tagcloud.prototype._draw = function (callback) {
		  
		var options = this.options,
			node = this.node;
		
		this.createTitle(node, options.title);
		
		this.createFloatTag(node, options.floatTag);
	  
		this.createChart(node, options.chart, this.chartSource, callback);
	};
    
	/**
	 * 构件通信
	 * @ignore
	 */
	Tagcloud.prototype._init = function () {
    };
	
    /**
	 * @method render
	 * 渲染函数
	 */
	Tagcloud.prototype.render = function () {
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
	Tagcloud.prototype.reRender = function () {
		this.clear();
		this.instances = [];
		this.colorDict = [];
		this.colorArray = [];
		this.applyAdaption(this.options);
		this.render();
	};
	
	/**
	 * @method chooseText
	 * 以text形式选择标签
	 * @param {Array} array
	 * 待选文本，需与数据源中的text对应
	 * @returns {Boolean}
	 * 若标签云中存在待选文本，返回true，否则返回false
	 */
	Tagcloud.prototype.chooseText = function (text) {
		return this.chart.chooseText(text);
	};
	
	/**
	 * @method chooseWeight
	 * 以weight形式选择标签
	 * @param {Array} array
	 * 待选权重值或者权重范围，当参数数组中只有一个值时，即完全与该权重值匹配；当参数数组中为两个值，即筛选这两个值的值域范围内的标签；当参数数组中为多个值时，只取前两个值；
	 * @returns {Boolean}
	 * 若标签云中存在待选权重范围，返回true，否则返回false
	 */
	Tagcloud.prototype.chooseWeight = function (weight) {
		return this.chart.chooseWeight(weight);
	};
	
	/**
	 * @method restore
	 * 恢复初始状态，即恢复chooseText及chooseWeight的选中状态
	 */
	Tagcloud.prototype.restore = function () {
		this.chart.restore();
	};
	
	return Tagcloud;
});
