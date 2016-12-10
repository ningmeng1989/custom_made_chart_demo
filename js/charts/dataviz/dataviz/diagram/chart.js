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
})('Chart',function (require) {
	function extend (parent, properties) {
        if (typeof parent !== "function") {
            properties = parent;
            parent = function () {};
        }

        properties = properties || {};
        var sub = function () {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === parent && this.initialize) {
                this.initialize.apply(this, arguments);
                if (arguments.length > 0) {
                	DataViz.instances[DataViz.idBase - 1] = this;
                }
            }
        };
        sub.prototype = new parent();
        sub.prototype.constructor = parent;
        $.extend(sub.prototype, properties);
        return sub;
    };
	var EventProxy = require('EventProxy');
	/**
	 * @class Chart
     * 所有Chart的源定义
     * Examples:
     * 
     *    	var Stream = DataViz.extend(DataViz.Chart, {
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
    var Chart = extend(EventProxy, {
        type: "Chart",
        initialize: function () {
            // 默认设置
            this.defaults = {};
            // 插件
            this.plugins = {};
            // 纬度
            this.dimension = {};
            // 格式化
            this.formatter = {};
            // 挂件
            this.widgets = [];
        }
    });

    /**
     * @method getType
     * 返回当前Chart的类型
     * @return {String} 
     * 返回Chart类型
     * 
     */
    Chart.prototype.getType = function () {
        return this.type;
    };
    
    /**
     * @method getNode
     * 返回当前Chart绑定的Node节点
     * @return {DOM}
     * 返回图表绑定的DOM节点
     */
    Chart.prototype.getNode = function () {
        return this.node;
    };
    
    /**
     * @method getId
     * 返回当前Chart ID
     * example:
     * 
     * 		var dot = new Dot("chart", {
	 *			width : 800,
	 *			height : 400,
	 *			userColor : [ "red", "green", "blue", "orange", "black" ]
	 *		});
	 *		var dot_id = dot.getId();
	 *
     * @return {Number} 
     * 返回ID
     * 
     */
    Chart.prototype.getId = function () {
    	return this.id;
    };

    /**
     * 优先返回用户传入的值或者方法，如果不存在，取实例方法返回
     * @param {String} key 方法或值的名称
     * @param {Mix} 值或方法
     * @ignore
     */
    Chart.prototype.getFormatter = function (key) {
        var noop = function (input) {
            // 转为字符串
            return '' + input;
        };
        return this.defaults[key] || this.formatter[key] || noop;
    };

    /**
     * 如果node是字符串，会当作ID进行查找。
     * 如果是DOM元素，直接返回该元素。
     * 如果是jQuery对象，返回对象中的第一个元素。
     * 如果节点不存在，则抛出异常
     * Examples:
     * ```
     * chart.checkContainer("id");
     * chart.checkContainer(document.getElementById("id"));
     * chart.checkContainer($("#id"));
     * ```
     * @param {Mix} node The element Id or Dom element
     * @return {Object} 返回找到的DOM节点
     * @ignore
     */
    Chart.prototype.checkContainer = function (node) {
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
        return ret;
    };

    /**
     * @method setOptions
     * 设置自定义选项
     * Examples:
     * 
     * 		var dot = new Dot("chart", {
	 *			width : 800,
	 *			height : 400,
	 *		});
	 *		dot.setOptions({userColor : [ "red", "green", "blue", "orange", "black" ]})
	 *
	 *
     * @param {Object} options 自定义选项对象
     * @return {Object} 覆盖后的图表选项对象
     * @ignore
     */
    Chart.prototype.setOptions = function (options) {
        return _.extend(this.defaults, options);
    };

    /**
     * 添加插件方法到实例对象上
     * @param {String} name plugin name
     * @param {Function} fn plugin function
     * @return {Object} A reference to the host object
     * @ignore
     */
    Chart.prototype.plug = function (name, fn) {
        this[name] = fn;
        this.plugins[name] = fn;
        return this;
    };

    /**
     * 从实例上移除插件方法
     * @param {String} plugin The namespace of the plugin
     * @return {Object} A reference to the host object
     * @ignore
     */
    Chart.prototype.unplug = function (name) {
        if (this.plugins.hasOwnProperty(name)) {
            delete this.plugins[name];
            delete this[name];
        }
        return this;
    };

    /**
     * 数据源映射
     * @ignore
     */
    Chart.prototype.map = function (map) {
        var that = this;
        _.forEach(map, function (val, key) {
            if (that.dimension.hasOwnProperty(key)) {
                that.dimension[key].index = map[key];
            }
        });
        var ret = {};
        _.forEach(that.dimension, function (val, key) {
            ret[key] = val.index;
        });

        ret.hasField = _.any(ret, function (val) {
            return typeof val === 'string';
        });
        this.mapping = ret;
        return ret;
    };

    /**
     * 创建画布
     * @ignore
     */
    Chart.prototype.createCanvas = function () {
        var conf = this.defaults;
        this.node.style.position = "relative";
        this.paper = new Raphael(this.node, conf.width, conf.height);
    };

    /**
     * 拥有一个组件
     * @ignore
     */
    Chart.prototype.own = function (widget) {
        widget.setOptions(this.defaults);
        widget.owner = this;
        this.widgets.push(widget);
        return widget;
    };
    /**
     * @method show
     * 显示当前chart组件
     */
    Chart.prototype.show = function () {
        $(this.node).unwall();
    };
    /**
     * @method hidden
     * 隐藏当前chart组件
     */
    Chart.prototype.hidden = function () {
        $(this.node).wall();
    };
    /**
     * @method destroy
     * 销毁当前chart实例
     */
    Chart.prototype.destroy = function () {
        var that = this;
        for(var key in that) {
			 if (typeof key != 'function') {
				 delete that[key];
			 }
        }
    };
    
    /**
     * @method clear
     * 清除画布，使用Raphael原生clearAPI
     * 
     */
    Chart.prototype.clear = function () {
    	this.canvas = this.canvas || this.paper;
        this.canvas.clear();
    };
    
    /**
     * @method clearDiv
     * 清除DOM节点，使用Jquery empty方法
     */
    Chart.prototype.clearDiv = function () {
    	$(this.node).empty();
    };
    
    Chart.prototype.createGeneralObj = function (source, dimension) {
    	var obj = {};
    	
    	_.each(dimension, function (d) {
    		obj[d] = source[d];
    	});
    	
    	return obj;
//    	return _.clone(source);
    };
    return Chart;
});