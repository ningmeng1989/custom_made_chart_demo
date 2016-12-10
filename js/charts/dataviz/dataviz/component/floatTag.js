;(function (name, definition) {
  if (typeof define === 'function') { // Module
    define(definition);
  } else { // Assign to common namespaces or simply the global object (window)
    this[name] = definition(function (id) { return this[id];});
  }
})('floatTag', function (require) {
	
	var DataViz = require("DataViz");
	
	/**
     * @class FloatTag
     * FloatTag模块,用来显示tooltip信息
	 *
     * example:
	 * 
	 *		floatTag	:	{
	 *			border	:	"3px solid",
	 *			borderColor : "black",
	 *			borderRadius : "10px",
	 *			backgroundColor : "white",
	 *          tipFormat : function (e) {
     *    		  	var tip = "";
     *   		  	tip =tip + '类别 : ' + e.name + '<br/>';
     *   		  	tip =tip + '总值: ' + e.amount + '<br/>';
     *            	   return tip;
     *      		}
	 *		   }
	 */
	var floatTag = DataViz.extend(DataViz.Chart, {
	    initialize: function (node, options) {
		  	this.type = "floatTag";
	    	/**
		     * @cfg {Spring} [border="3px solid"]
		     * 提示框边框宽度及样式
		     */
		  	this.defaults.border = "3px solid";
	    	/**
		     * @cfg {Spring} [borderColor="black"]
		     * 提示框边框颜色
		     */
		  	this.defaults.borderColor = "black";
	    	/**
		     * @cfg {Spring} [borderRadius="10px"]
		     * 提示框圆角半径
		     */
		  	this.defaults.borderRadius = "10px";
	    	/**
		     * @cfg {Spring} [backgroundColor="white"]
		     * 提示框背景颜色
		     */
		  	this.defaults.backgroundColor = "white";
	    	/**
		     * @cfg {Spring} [fontSize="12px"]
		     * 提示框文本字体大小
		     */
		  	this.defaults.fontSize = "12px";
	    	/**
		     * @cfg {Spring} [fontFamily="Microsoft Yahei"]
		     * 提示框文本字体
		     */
		  	this.defaults.fontFamily = "Microsoft Yahei";
	    	/**
		     * @cfg {Spring} [fontColor= "black"]
		     * 提示框文本颜色
		     */
		  	this.defaults.fontColor = "black";
	    	/**
		     * @cfg {Spring} [textAlign="left"]
		     * 提示框文本对齐方式
		     * 
		     * - 'right' 文本右对齐
		     * - 'left' 文本左对齐，默认
		     * - 'center' 文本居中
		     */
		  	this.defaults.textAlign = "left";
	    	/**
		     * @cfg {Number} [margin= 0]
		     * 提示框的外边距
		     */
		  	this.defaults.margin = 0;
		  	/**
		     * @cfg {Number} [margin= 1]
		     * 提示框的透明度
		     */
		  	this.defaults.opacity = 1;
	    	/** 
		     * @event tipFormat
		     * 用户自定义函数，用于自定义提示框文本格式
		     * @param {Object} e 包含数据源中每个数据项的属性值
		     *
		     * example:
			 * 
			 *		tipFormat : function (e) {	
			 *						var tip = "";
		     *						for (var prop in e) {
		     *							if (e[prop]) {
		     *								tip = tip + prop + ': ' + e[prop] + '<br/>';
		     * 							}
		     * 						}
		     * 						return tip;
		     * 					};
			 */
		  	this.defaults.tipFormat = function (e) {
		  		var tip = "";
		  		for (var prop in e) {
		  			//保证数据值在0的情况下显示
		  			if ( typeof e[prop] != "undefined"){
		  				tip = tip + prop + ': ' + e[prop] + '<br/>';
		  			}
		  		}
        	    return tip;
		  	};
		  	
		  	this.setOptions(options);
	    }
	});
	
	floatTag.prototype.createFloatTag = function () {
		var mouseToFloatTag = {x: 20, y: 20};
		var setContent = function () {};
		var node;
		var container;
		var that = this;
		//set floatTag location, warning: the html content must be set before call this func,
		// because jqNode's width and height depend on it's content;
		var _changeLoc = function (m) {
			//m is mouse location, example: {x: 10, y: 20}
			//arguments[1]用于多图联动trigger触发时使用，此时鼠标位置并不好用
			var x = m.x || (arguments[1] && arguments[1].x);
			var y = m.y || (arguments[1] && arguments[1].y);
			var floatTagWidth = node.outerWidth ? node.outerWidth() : node.width();
			var floatTagHeight = node.outerHeight ? node.outerHeight() : node.height();
			
			if (floatTagWidth + x + 2 * mouseToFloatTag.x <=  $(container).width()) {
				x += mouseToFloatTag.x;
			} else {
				x = x - floatTagWidth - mouseToFloatTag.x;
			}

			if(x < 0) {
				x = 0;
			}
			
			if (y >= floatTagHeight + mouseToFloatTag.y) {
				y = y - mouseToFloatTag.y - floatTagHeight;
			} else {
				y += mouseToFloatTag.y;
			}
			node.css("left",  x);
			node.css("top",  y);
		};
		var _mousemove = function (e) { 
			var offset = $(container).offset();
			if (!(e.pageX && e.pageY)) {return false;}

			var x = e.pageX - offset.left,
			y = e.pageY - offset.top;
			
			that.currentPosition = {x: x, y: y};
			
			setContent.call(this);
			_changeLoc({'x': x, 'y': y});
		};
		
		var floatTag = function (cont) {
			container = $(cont);
			node = $("<div/>").css({
				"padding": "12px 8px",
				"box-shadow": "3px 3px 6px 0px rgba(0,0,0,0.58)",
				"z-index": 1000,
				"visibility": "hidden",
				"position": "absolute"
			});
			container.append(node);
			container.on('mousemove', _mousemove);
			container.on('tap', _mousemove);
			container.on('changeLoc', _changeLoc);
			node.creator = floatTag;
			return node;
		};
		
//		floatTag.setContent = function (sc) {
//			if (arguments.length === 0) {
//				return setContent;
//			}
//			setContent = sc;
//			return floatTag;
//		};
//		
//		floatTag.mouseToFloatTag = function (m) {
//			if (arguments.length === 0) {
//				return mouseToFloatTag;
//			}
//			mouseToFloatTag = m;
//			return floatTag;
//		};
		
		floatTag.changeLoc = _changeLoc;
		
		return floatTag;
	};
	
	floatTag.prototype._getTip = function (obj) {
		var formatter = this.defaults.tipFormat;
		return formatter.call(this, obj);
	};
	
	floatTag.prototype.show = function (obj) {
		var conf = this.defaults;
		this.div.html(this._getTip(obj));

		if (arguments[1]) {
			this.div.trigger("changeLoc", [arguments[1]]);
		}
		this.div.css({
			"border"	:	conf.border,
			"border-color"	:	conf.borderColor,
			"border-radius"	:	conf.borderRadius,
			"background-color"	:	conf.backgroundColor,
			"color"			:	conf.fontColor,
			"font-size"		:	conf.fontSize,
			"font-family"	:	conf.fontFamily,
			"text-align"	:	conf.textAlign,
			"visibility"	:	"visible",
			"margin"		:	conf.margin,
			"opacity"		:	conf.opacity
		});
	};
	
	floatTag.prototype.hide = function () {
		this.div.css({
			"visibility": "hidden"
		});	
	};
	
	return floatTag;
});
    