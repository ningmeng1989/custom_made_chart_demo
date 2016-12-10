/*!***********************************************
Copyright (c) 2014, Neusoft Inc.
All rights reserved.
SaCa DataViz Version 2.0.0
************************************************/
(function (name, definition) {
    if (typeof define === 'function') { 
        define(definition);
    } else {
        this[name] = definition(function (id) { return this[id];});
    }
})('DataViz', function (require) {
	
	/**
	 * @class DataViz
	 * DataViz全局命名空间对象定义
	 */
	var DataViz = function () {};
    
    var DOM = window.jQuery || window.Zepto;
    /**
     * @property {String} [version = "2.1.0"]
     * DataViz版本号
     */
    DataViz.version = "2.1.0";
    
    /**
     * 全局图表ID基数
     * @ignore
     */
    DataViz.idBase = 0;
    DataViz.loading = [];
    /**
     * 自适应拖拽属性
     * @ignore
     */
    DataViz.dragFlag = false;		//拖拽标记位
    DataViz.dragNum = 0;			//记录resize次数
    DataViz.dragLastNum = 0;		//记录上一次resize次数，用于判断是否拖拽停止
    DataViz.adaption = [];			//页面自适应数据
    DataViz.fontRatio = 1; 			//页面自适应字体比例
    DataViz.percentageAdaption = {};
    /**
     * 上一次url请求结果
     * @ignore
     */
    DataViz.lastURLRst = {};
    
    /**
     * 各构件set集合
     * @ignore
     */
    DataViz.setArray = [];

    /**
     * 图表实例数组
     * @ignore
     */
    DataViz.instances = []; 
    
    /**
     * SVG、VML检测
     * @ignore
     */
    DataViz.svg =  Raphael.svg;
    DataViz.vml =  Raphael.vml;
    DataViz.code="";

    /**
     * @method json
     * 请求一个JSON文件
     * @param {String} url JSON文件地址
     * @param {Function} callback 回调函数
     * @param {Number} millisec 可选：设置轮询目标URL的间隔毫秒数
     * 
     * Example:
     * 
     * 		DataViz.json("dot.json", function(source) {
	 * 			dot.setSource(source);
	 *			dot.render();
	 *		}, [millisec]); 
	 *
	 *
     */
    DataViz.json = function (url, callback, millisec) {
    	d3.json(url, function (json) {
    		DataViz.lastURLRst[url] = {intervalHandler: undefined, rst: json};
			callback(json);
        });
    	if(millisec && _.isNumber(millisec)) {
    		var intervalHandler = setInterval(function() {
    			d3.json(url, function (json) {
    				var lastRst = DataViz.lastURLRst[url].rst;
    				DataViz.lastURLRst[url].intervalHandler = intervalHandler;
    				// 判断请求结果是否发生了改变，若改变，则执行callback
    				if(!_.isEqual(json, lastRst)) {
    					DataViz.lastURLRst[url].rst = json;
        				callback(json);
    				}
    	        });
    		},millisec);
    	}
    };
    
    /**
     * @method csv
     * 请求一个CSV文件，并解析
     * @param {String} url CSV文件地址
     * @param {Function} callback 回调函数，得到解析后的结果
     * @param {Number} millisec 可选：设置轮询目标URL的间隔毫秒数
     * 
     * Example:
     * 
     * 		DataViz.csv("dot.csv", function(source) {
	 * 			dot.setSource(source);
	 *			dot.render();
	 *		}, [millisec]); 
	 * 
     * 
     */
    DataViz.csv = function (url, callback, millisec) {
    	d3.text(url,"text/csv", function (text) {
    		var currentRst = (text && d3.csv.parseRows(text)); 
    		DataViz.lastURLRst[url] = {intervalHandler: undefined, rst: currentRst};
			callback(currentRst);
        });
    	if(millisec && _.isNumber(millisec)) {
    		var intervalHandler = setInterval(function() {
    			d3.text(url, "text/csv", function (text) {
    				var lastRst = DataViz.lastURLRst[url].rst;
    				DataViz.lastURLRst[url].intervalHandler = intervalHandler;
    				// 判断请求结果是否发生了改变，若改变，则执行callback
    				var currentRst = (text && d3.csv.parseRows(text));
    				if(!_.isEqual(currentRst, lastRst)) {
    					DataViz.lastURLRst[url].rst = currentRst;
    					callback(currentRst);
    				}
    	        });
    		},millisec);
    	}
    };
    
    /**
     * @method clearPolling
     * 取消轮询
     * @param {String} url 轮询请求的URL
     */
    DataViz.clearPolling = function (url) {
    	if(url && DataViz.lastURLRst[url]) {
    		var intervalHandler = DataViz.lastURLRst[url].intervalHandler;
    		window.clearInterval(intervalHandler);
    		DataViz.lastURLRst[url].intervalHandler = undefined;
    	}
    };
    
    /**
     * 数据转换
     * @ignore
     */
    DataViz.csvRemap = function(source){
        var remaped = [];
        var first = source.shift();
        for (var i = 1; i < first.length; i++) {
        for (var j = 0; j < source.length; j++) {
           remaped.push([first[i], source[j][0], parseFloat(source[j][i])]);
          }
        }
        return remaped;
    };
    
    
    /**
     * DataViz消息发布与订阅
     * @ignore
     */
    DataViz._topicStack = {};
	/**
	 * @method _type
	 * 类型判断
	 * @param {Object} param
	 * @ignore
	 */
    DataViz._type = function(param) {
		var _type = typeof (param);
		return (_type === 'object' ? param === null && 'null'
				|| Object.prototype.toString.call(param).slice(8, -1) : _type)
				.toLowerCase();
	};
	/**
	 * @method _namespace
	 * 命名空间注册和获取函数
	 * @param {Boolean} set
	 * @param {Object} ns
	 * @param {Function} callback
	 * @ignore
	 */
	DataViz._namespace = function(set, ns, callback) {
		// 命名空间格式验证
		if (!/\.{2,}|\.$/g.test(ns)
				&& /^[a-zA-Z_\$][a-zA-Z0-9_\.\$]*$/g.test(ns)) {
			// 命名空间根节点
			var o = DataViz._topicStack;
			// 当前对象的父对象
			var parentNs = o;
			// 拆分命名空间
			var arr = ns.split('.');
			var len = arr.length;
			if (set) {
				// 设置命名空间模式
				for ( var i = 0; i < len; i++) {
					var _ns = arr[i];
					// 设置私有属性
					if (_ns !== '__Listeners__') {
						parentNs = o;
						o = o[_ns] = o[_ns] || {};
					}
				}
				// 设置成功后回调
				DataViz._type(callback) === 'function'
						&& callback.call(o, parentNs, _ns);
			} else {
				// 获取命名空间模式
				for ( var i = 0; i < len; i++) {
					var _ns = arr[i];
					if (_ns !== '__Listeners__') {
						var _targetNs = o[_ns];
						if (_targetNs) {
							parentNs = o;
							o = _targetNs;
							// 获取最后一个命名空间
							if (i === len - 1) {
								DataViz._type(callback) === 'function'
										&& callback.call(o, parentNs, _ns);
							}
						} else {
							// 命名空间不存在跳出循环
							break;
						}
					}
				}
			}
		} else {
			// 命名空间格式不合法
			throw new Error('DataViz Error # The topic is illegal !');
		}
	};
	/**
	 * @method _notifyUpdate
	 * 通知主题更新
	 * @param {Object} obj
	 * @param {Object} msg
	 * @ignore
	 */
	DataViz._notifyUpdate = function(obj, msg) {
		var listeners = obj.__Listeners__ || [];
		for ( var i = 0, listenersLen = listeners.length; i < listenersLen; i++) {
			listeners[i].call(window, msg);
		}
		// 通知子空间
		for ( var i in obj) {
			if (i !== '__Listeners__') {
				arguments.callee(obj[i], msg);
			}
		}
	};
	/**
	 * @method _deleteTopic
	 * 判断当前主题能否被删除
	 * @ignore
	 */
	DataViz._deleteTopic = function(obj) {
		for ( var i in obj) {
			if (i === '__Listeners__') {
				if (obj[i].length) {
					return false;
				} else {
					continue;
				}
			} else {
				return false;
			}
		}
		return true;
	};
	/**
	 * @method _deleteTopic
	 * 注销指定主题下面的指定监听器
	 * @ignore
	 */
	DataViz._removeListeners = function(obj, handler, parentNs, ns) {
		var listeners = obj.__Listeners__ || [];
		var cachelisteners = [];
		for ( var i = 0, listenersLen = listeners.length; i < listenersLen; i++) {
			var listener = listeners[i];
			if (listener !== handler) {
				cachelisteners.push(listener);
			}
		}
		obj.__Listeners__ = cachelisteners;
		// 如果当前主题已经没有监听器且不存在子主题则删除当前主题
		DataViz._deleteTopic(obj) && delete parentNs[ns];
	};
	
	/**
	 * @method subscribe
	 * 订阅主题
	 * @param {String | Array} topic
	 * 订阅的主题
	 * @param {Function} handler
	 * 订阅主题触发时的回调函数
	 */
	DataViz.subscribe = function(topic, handler) {
		// 如果参数都存在
		if (topic && handler) {
			// 参数类型
			var topicType = DataViz._type(topic);
			var handlerType = DataViz._type(handler);
			// 临时处理函数
			var tempHandler = function() {
				var that = this;
				that.__Listeners__ = that.__Listeners__ || [];
				if (handlerType === 'function') {
					that.__Listeners__.push(handler);
				} else if (handlerType === 'array') {
					for ( var i = 0, handlerLen = handler.length; i < handlerLen; i++) {
						var _handler = handler[i];
						if (DataViz._type(_handler) === 'function') {
							that.__Listeners__.push(_handler);
						}
					}
				}
			};
			// 注册监听器
			if (topicType === 'string') {
				DataViz._namespace(true, topic, tempHandler);
			} else if (topicType === 'array') {
				for ( var i = 0, topicLen = topic.length; i < topicLen; i++) {
					var _topic = topic[i];
					if (DataViz._type(_topic) === 'string') {
						DataViz._namespace(true, _topic, tempHandler);
					}
				}
			}
		}
	};
	/**
	 * @method publish
	 * 发布主题
	 * @param {String | Array} topic
	 * 发布的主题
	 * @param {Object} msg
	 * 主题附加信息
	 */
	DataViz.publish = function(topic, msg) {
		// 如果主题存在
		if (topic) {
			// 参数类型
			var topicType = DataViz._type(topic);
			// 临时处理函数
			var tempHandler = function() {
				var that = this;
				DataViz._notifyUpdate(that, msg);
			};
			// 广播主题
			if (topicType === 'string') {
				DataViz._namespace(false, topic, tempHandler);
			} else if (topicType === 'array') {
				for ( var i = 0, topicLen = topic.length; i < topicLen; i++) {
					var _topic = topic[i];
					DataViz._namespace(false, _topic, tempHandler);
				}
			}
		}
	};
	
	/**
	 * @method unsubscribe
	 * 取消订阅
	 * @param {String | Array} topic
	 * 取消订阅的主题
	 * @param {Function} handler
	 * 取消订阅主题触发时的回调函数
	 */
	DataViz.unsubscribe = function(topic, handler) {
		// 获取参数长度
		var argsLen = arguments.length;
		// 如果参数存在
		if (argsLen) {
			// 参数类型
			var topicType = DataViz._type(topic);
			var handlerType = DataViz._type(handler);
			// 临时处理函数
			var tempHandler = function(parentNs, ns) {
				var that = this;
				if (argsLen === 1) {
					delete parentNs[ns];
				} else if (handlerType === 'function') {
					DataViz._removeListeners(that, handler, parentNs, ns);
				} else if (handlerType === 'array') {
					for ( var i = 0, handlerLen = handler.length; i < handlerLen; i++) {
						var _handler = handler[i];
						if (DataViz._type(_handler) === 'function') {
							DataViz._removeListeners(that, _handler, parentNs, ns);
						}
					}
				}
			};
			//注销监听器
			if (topicType === 'string') {
				DataViz._namespace(false, topic, tempHandler);
			} else if (topicType === 'array') {
				for ( var i = 0, topicLen = topic.length; i < topicLen; i++) {
					var _topic = topic[i];
					if (DataViz._type(_topic) === 'string') {
						DataViz._namespace(false, _topic, tempHandler);
					}
				}
			}
		}
	};

    DOM.fn.wall = function () {
        return $(this).each(function () {
            $(this).css('visibility', 'hidden');
        });
    };
    DOM.fn.unwall = function () {
        return $(this).each(function () {
            $(this).css('visibility', 'visible');
        });
    };

    /**
     * 继承
     * @param {Function} parent 父类
     * @param {Object} properties 新属性
     * @return {Function} 新的子类
     * @ignore
     */
    DataViz.extend = function (parent, properties) {
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
            }
        };
        sub.prototype = new parent();
        sub.prototype.constructor = parent;
        $.extend(sub.prototype, properties);
        return sub;
    };

    DataViz.Chart = require("Chart");
    
    DataViz.more = function (list, level, step, last) {
        var selected;
        var start = level * step, end;
        last = last || function (remains) {
            return remains[0];
        };

        var needMoreRow;
        if (start + step >= list.length) {
            needMoreRow = false;
            end = list.length - 1;
        } else {
            needMoreRow = true;
            end = start + step - 1;
        }
        if (!needMoreRow) {
            selected = list.slice(start);
        } else {
            selected = list.slice(start, end);
            selected.push(last(list.slice(end)));
        }
        return selected;
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
     */
	DataViz.Chart.prototype.setOptions = function (options) {
		var obj={};
        for (var prop in this.defaults) {
            obj[prop] = this.defaults[prop];
          }
        for (var prop in options) {
        	var p = options[prop];
        	if (_.isObject(p) && !_.isArray(p) && !_.isFunction(p)) {
        		if (obj[prop]) {
        			for (var k in p) {
        				obj[prop][k] = p[k];
        			}
        		} else {
        			obj[prop] = options[prop];
        		}
        	} else {
        		obj[prop] = options[prop];
        	}
          }
        this.defaults = obj;
        
        //若组件adaption属性为真，则进行页面自适应
//        if (typeof this.defaults.adaption != 'undefined' && this.defaults.adaption) {
//        	var isSavedId = false;
//        	for (var i = 0, l = DataViz.adaption.length; i < l; i++) {
//        		isSavedId = DataViz.adaption[i].id == that.node.id ? true : false;
//        		if (isSavedId) {
//        			break;
//        		}
//        	}
//        	if (!isSavedId) {
//	        	this.defaults.width = that.defaults.width*parseInt(that.node.style.width)*0.01;
//	        	this.defaults.height = that.defaults.height*parseInt(that.node.style.height)*0.01;
//	        	DataViz.adaption.push({"id" : that.node.id, "obj": that, "initialWH" : [that.defaults.width, that.defaults.height]});
//	        	//如果是 <= ie8 div加<>
//	        	if(DataViz.vml){
//	        		var divNode = $("#"+that.node.id);
//	        		divNode.css("overflow","hidden");
//	        		
//	        	}
//        	}
//        }
        return this.defaults;
    };
   
    /**
     * 自适应相应函数
     * @ignore
     */
    DataViz.onresize = window.onresize = function () {
    	DataViz.dragNum += 1;
    	
    	listenResize = function () {
    		if(DataViz.dragNum != DataViz.dragLastNum){
    			DataViz.dragLastNum = DataViz.dragNum;
    		} else {
    			clearInterval(DataViz.listenID);
    			DataViz.getDivWH();
    			DataViz.dragFlag = false;
    			//重绘
    			for(var i = 0 ,len = DataViz.adaption.length; i < len;  i++){
    				var adaptioner = DataViz.adaption[i],
    					node = adaptioner.id,
    					that = adaptioner.obj;
    				
            		DataViz.fontRatio = Math.round(Math.min(
            				adaptioner.currentWH[0] / adaptioner.initialWH[0],
            				adaptioner.currentWH[1] / adaptioner.initialWH[1]
            				));//  ----???1440/“100%”
            		//去除滚动条
            		document.getElementById(node).style.overflow = "hidden";
            		
        			that.options.chart.width = adaptioner.currentWH[0];
            		that.options.chart.height = adaptioner.currentWH[1];
            		
            		that.reRender();
    			}
    		}
    	};
    	
    	if(!DataViz.dragFlag){
    		DataViz.dragFlag = true;
    		DataViz.listenID = window.setInterval(listenResize,200);
    	}
    };
    
    /**
     * 获取Div宽高
     * @ingore
     */
    DataViz.getDivWH = function () {
    	for (var i = 0, l = DataViz.adaption.length; i < l; i++) {
    		var id = DataViz.adaption[i].id;
    		var width = $('#' + id).width();
    		var height = $('#' + id).height();
    		
    		DataViz.adaption[i].currentWH = [width, height];
    	}
    };
    
     /**
      * @method destroy
      * 销毁实例对象
      */
     DataViz.destroy = function (instance) {
    	 if (arguments.length !== 0 && instance.destroy) {
    		 instance.destroy();
    	 } else {
    		 for (var i = 0, l = DataViz.instances.length; i < l; i++) {
        		 for (var prop in DataViz.instances[i]) {
        			 if (typeof prop != 'function') {
        				 delete DataViz.instances[i][prop];
        			 }
        		 }
    		 }
    	 }
     };
     
//     $.ajax({
//         url : WEB_APP_PATH+'/DataViz',
//         data:{},
//         cache : false,
//         async : false,
//         type : "GET",
//         dataType :"text",
//         success : function (result){
//             DataViz.code = result;
//         },
//         error : function(error){
//        	 console.log(error);
//         }
//     });
//     d3.text('/DataViz/DataViz','text',function(text){
//    	 DataViz.code = text;
//    	 console.log("前台得到的key为"+text);
//     });
//     
//     setInterval(function(){
//    	  d3.text('/DataVizServlet','',function(text){
//    		  DataViz.code = text;
//    	     }); 
//     },1000*60*60*24);
     
     /**
      * @method createCanvas
      * 创建公共画布DataViz.canvas
      * @param {String} node
      * 用于创建公共画布的DIV节点
      * @param {Object} option
      * 创建公共画布的设置参数
      */
     DataViz.createCanvas = function (node, width, height) {
    	 
    	 width ? width : width = 600;
    	 height ? height : height = 600;
    	 
    	 node.style.position = "relative";
    	 
		 var Canvas = require("Canvas");
		 
		 var canvas = new Canvas(node, {
			 width	:	width,
			 height	:	height
		 }).canvas;
		 
		 $(canvas.canvas).css({position : "absolute", left : 0, top : 0});
		 
    	 if (!canvas || typeof canvas !== "object") {
    		 throw new Error("DataViz Error # Canvas Error : Create canvas failed!");
    	 } else {
    		 return canvas;
    	 }
     };
     
     DataViz.Theme = require("Theme");
     
     /**
      * @method add
      * 添加自定义主题
      * 
      * <font color='red'>  
      * 注：本方法已过时，推荐使用替代方法： DataViz.Theme.add(themeName, theme)
      * </font> 
      * 
      * @param {String} themeName 
      * 主题名称
      * @param {Object} theme 
      * 主题对象json, contain attribute "COLOR_ARGS", theme.COLOR_ARGS is a 2-d array;
      * 
      * example:
      * 
      *		DataViz.add('theme1', {
	  *		    COLOR_ARGS: [
	  *		        ["#e72e8b", "#ff7fbf"],
	  *		        ["#d94f21", "#ff9673"],
	  *		         ["#f3c53c", "#ffe38c"],
	  *		         ["#8be62f", "#bfff7f"],
	  *		        ["#14cc14", "#66ff66"],
	  *		        ["#2fe68a", "#7fffc0"]
	  *		     ]
	  *		    });
      */
     DataViz.add = function (themeName, theme) {
    	 DataViz.Theme.add(themeName, theme);
     };
     
     /**
      * @method changeTheme
      * 切换当前主题
      * 
      * <font color='red'>  
      * 注：本方法已过时，推荐使用替代方法： DataViz.Theme.changeTheme(themeName)
      * </font> 
      * 
      * @param {String} themeName 主题名称
      * @return {Boolean} 返回是否切换成功
      */
     DataViz.changeTheme = function (themeName) {
    	return  DataViz.Theme.changeTheme(themeName);
     };

    DataViz.getInstanceByDom = function (dom) {
        var chartInstance;

        for (var i = 0, l = DataViz.instances.length; i < l; i++) {
            if (DataViz.instances[i].node === dom) {
                chartInstance = DataViz.instances[i];
                break;
            }
        }

        return chartInstance;
    };
     
     /**
      * 封装demo数据切割API
      */
     var Utils = require("Utils");
     
     /**
      * @method getData
      * 取数据源的指定列
      * @param {JSON | CSV} source
      * 数据源
      * @param {Array} arr 
      * 需要过滤出的列
      * @param {Object} cond 
      * 数据行的过滤条件
      */
     DataViz.getData = Utils.getData;
     
     /**
      * @method dataFilter
      * 对数据源进行分组求和
      * @param {JSON | CSV} source
      * 数据源
      * @param {Array} arr 
      * 需要过滤出的列
      * @param {Object} cond 
      * 分组条件
      */
     DataViz.dataFilter = Utils.dataFilter;
     
     /**
      * @method uniq
      * 去除重复列
      * @param {JSON | CSV} source
      * 数据源
      * @param {Array} cond 
      * 需要对比的属性
      */
     DataViz.uniq = Utils.uniq;
     
     DataViz.isMobile = Utils.isMobile();

    window.DataViz = DataViz;
     
    return DataViz;
});
//-------------------------------
