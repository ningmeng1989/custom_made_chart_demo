/*!***********************************************
Copyright (c) 2014, Neusoft Inc.
All rights reserved.
SaCa DataViz Version 2.0.0
************************************************/
(function(name, definition) {
	if (typeof define === 'function') {
		define(definition);
	} else {
		this[name] = definition(function(id) {
			return this[id];
		});
	}
})('SunBurstChart',function(require) {

	var DataViz = require('DataViz');
	var Color = require("Color");
	var Utils = require("Utils");
	/**
     * @class SunBurst
     * @extends DataViz.Chart
     * 太阳辐射图（SunBurst）通常用于多层分组数据的可视化展现
     *  
     * <font color='red'>  
     * 注：本图不支持设置Legend 
     * </font>
     *  
	 *     @example
	 *			<script>
	 *				requirejs(["SunBurst", "Loading", "DataViz"], function(SunBurst, Loading, DataViz) {
	 *					DataViz.Theme.changeTheme("rainbow");
	 *					
	 *					var loading = new Loading("", {
	 *			    		mode : "3",
	 *			    		imgSrc :"test.GIF",
	 *			    		label:{
	 *			    			"text":"加载中...",
	 *			    			"color":"black",
	 *			    			"font-size":"16px",
	 *			    			"font-family":"Microsoft Yahei"
	 *			    		},
	 *			    		background:{
	 *			    			color:"white",
	 *			    			opacity:0.2
	 *			    		}
	 *			    	}); 
	 *					loading.showLoading();  
	 *					
	 *					var	sunBurst = new SunBurst("chart", {
	 *						chart : {
	 *							width 	:	600,
	 * 							height 	:	600
	 *						},
	 *						title : {
	 *							text : "全国各地人口图"
	 *						},
	 *						floatTag : {}
	 *					});
	 *					DataViz.csv("sunburst.csv", function(source) {
	 *						sunBurst.setSource(source, {ID:0, name:1, size:2, parentID:3, info:4});
	 *						sunBurst.render();
	 *					});
	 *				});
	 *			</script>
	 *
	 * <a href="data/sunburst.json">JSON格式数据</a>
	 * 
	 * <a href="data/sunburst.csv">CSV格式数据</a>
     */
	// 如果不支持svg，则使用兼容版显示。
	if (!DataViz.svg) {
		return require('SunBurst2Chart');
	}

	var SunBurstChart = DataViz.extend(DataViz.Chart, {
		initialize : function(node, options) {
			this.type = "SunBurstChart";
			this.node = this.checkContainer(node);
		  	/**
		  	 * @cfg {Number} [width=800]
		  	 * 宽度
		  	 */
			this.defaults.width = 800;
		    /**
		     * @cfg {Number} [height=800]
		     * 高度
		     */
			this.defaults.height = 800;
		    /**
		     * @cfg {Number} [textShowMode=0]
		     * 文本展现方式  
		     *- {Number} 0 以省略号的形式展现
		     *- {Number} 1 正常全部显示
		     */
			this.defaults.textShowMode = 0;
		    /**
		     * @cfg {Boolean} [isSorted=false]
		     * 是否按标签值大小排序  如果为ture，则从大到小排序
		     */
			this.defaults.isSorted = false;

		    /**
		     * @cfg {Array} [radiusArray]
		     * 定义各层级半径的增减值
		     * <font color='red'>  
		     * 注：  
		     * 1.数据长度必须与层级深度相匹配；  
		     * 2.IE8及以下浏览器该属性无效
		     * 3.各层级半径的增减值的和必须为0
		     * </font> 
		     */
			this.defaults.radiusArray;
		    /**
		     * @cfg {Boolean} [showPercentage=false]
		     * 是否在标签中显示百分比  
		     */
			this.defaults.showPercentage = false;
		    /**
		     * @cfg {String} [textAlign="innerCircle"]
		     * 标签文本的对齐方式  
		     * innerCircle：文本对齐到内圆边界；  
		     * center：文本居中；  
		     * outerCircle：文本对齐到外圆边界。
		     * <font color='red'>    
		     * 注：
		     * IE8及以下浏览器该属性无效 
		     * </font>
		     */
			this.defaults.textAlign = "innerCircle";
		    /**
		     * @cfg {Number} [decimalFormat=0]
		     * 数字保留小数位数
		     */
			this.defaults.decimalFormat = 0;
		    /**
		     * @cfg {String} target
		     * 初始化钻取标签
		     */
			this.defaults.target;
		    /**
		     * @cfg {Object} arcStyle 
		     * 扇形样式
		     * @cfg {String} [arcStyle.stroke="#fff"] 
		     * 描边颜色
		     * @cfg {Number} [arcStyle.fill-opacity=0.5] 
		     * 透明度
		     */
			this.defaults.arcStyle = {
				'stroke' : '#fff',
				'fill-opacity' : 0.6
			};
            /**
			 * @cfg {Object} tipStyle
			 * 提示文本样式设置，包含但不仅限于如下属性
			 * @cfg {String} [tipStyle.color = "#ffffff"]
			 * 提示框文本颜色设置
			 * @cfg {String} [tipStyle.margin = "auto"]
			 * 提示框文本外边距大小设置
			 * @cfg {String} [tipStyle.text-align = "left"]
			 * 提示框文本显示位置设置
			 * @cfg {String} [tipStyle.font-family = "Microsoft Yahei"]
			 * 提示框文本字体设置
			 * 
			 */
			this.defaults.tipStyle = {
					"textAlign" : "left",
					"margin" : "auto",
					"color" : "#ffffff",
					"font-family" : "Microsoft Yahei"
			};

			/**
			 * @event onLeafClick 用户自定义最外层叶子节点单击事件
			 * @param {Object} e
			 *
			 * example:
			 * 
			 *		onLeafClick : function(e){		
			 *			alert(e.toString());
			 * 		}
			 */
			this.defaults.onLeafClick = function(e) {};
			/**
			 * @event onClick 用户自定义单击事件
			 * @param {Object} e
			 *
			 * example:
			 * 
			 *		onClick : function(e){		
			 *			alert(e.toString());
			 * 		}
			 */
			this.defaults.onClick = function(e) {};
			/**
			 * @event onMouseOver 用户自定义mouseover事件
			 * @param {Object} e
			 *
			 * example:
			 * 
			 *		onMouseOver : function(e){		
			 *			alert(e.toString());
			 * 		}
			 */
			this.defaults.onMouseOver = function (e) {};
			/**
			 * @event onMouseOut 用户自定义mouseout事件
			 * @param {Object} e
			 * 
			 * example:
			 * 
			 *		onMouseOut : function(e){		
			 *			alert(e.toString());
			 * 		}
			 */
			this.defaults.onMouseOut = function (e) {};
			/**
			 * @event onDblClick 用户自定义双击事件
			 * @param {Object} e
			 *
			 * example:
			 * 
			 *		onDblClick : function(e){		
			 *			alert(e.toString());
			 * 		}
			 */
			this.defaults.onDblClick = function(e) {};
			/**
			 * @event onSpecialColor
			 * 用户自定义颜色
			 * @param {Object} e
			 * 
			 * example：  
			 * 		
			 * 		var title = [{'name':'china','color':'#000'},{'name':'japan','color':'#FFF'}];
			 *		onSpecialColor : function (obj) {
			 *			for(var i = 0; i < title.length; i++){
			 *				if(title[i].name == obj.name){
			 *					return title[i].color;
			 *				}
			 *			}
			 *		};
			 */
			this.defaults.onSpecialColor = undefined;

			this.setOptions(options);
			this.dimension = {};

			this.source;
			this.colorCount;
			this.drillTag; 				// 全局记录当前绘制节点，方便后续重绘或者自适应回到当前页面
			this.amount = [];
			this._initEvent();
		}
	});
	/**
	 * 设置颜色数组
	 * @ignore
	 */
	SunBurstChart.prototype._setColor = function () {
		var customTheme = this.owner.theme;
		this.owner.colorArray = this.owner.colorArray.length == 0 ? 
				Color.getThemeColor(customTheme) : this.owner.colorArray;
	};
	
	SunBurstChart.prototype._initEvent = function () {

    	var that = this,
    		conf = this.defaults,
    		duration = 1000,
    		radius = Math.min(conf.width, conf.height) / 2-45;
    	
		function arcTween2(d) {
			var my = maxY(d), 
				xd = d3.interpolate(that.x.domain(), [d.x, d.x + d.dx ]), 
				yd = d3.interpolate(that.y.domain(), [ d.y, my ]), 
				yr = d3.interpolate(that.y.range(), [ d.y ? 20 : 0, radius ]);
			return function(d) {
				return function(t) {
					that.x.domain(xd(t));
					that.y.domain(yd(t)).range(yr(t));
					return that.arc(d);
				};
			};
		}
		
		function maxY(d) {
			return d.children 
				? Math.max.apply(Math, d.children.map(maxY)) 
				: d.y + d.dy;
		}
		
		function isParentOf(p, c) {
			if (p === c)
				return true;
			if (p.children) {
				return p.children.some(function(d) {
					return isParentOf(d, c);
				});
			}
			return false;
		}
    	
    	function mouseclick () {
    		var d = arguments[0];
            var o = {};
            o[that.dimension.ID] = d.id;
            o[that.dimension.name] = d.name;
            o[that.dimension.size] = d.value;
            o[that.dimension.info] = d.info;
            if (d.parent) {
                o[that.dimension.parentID] = d.parent.id;
            }
			conf.onClick(o);
			if (d.children) {
				that.drillTag = d[that.dimension.name];
				that.path.transition().duration(duration).attrTween("d", arcTween2(d));
				that.text.style("visibility",function(e) {
						return isParentOf(d, e) 
							? null
							: d3.select(this).style("visibility");
					})
					.transition()
					.duration(duration)
					.attrTween("text-anchor",function(d) {
						return function() {
							switch (conf.textAlign) {
							case "innerCircle":
								return that.x(d.x + d.dx / 2) > Math.PI 
									? "end"
									: "start";
								break;
							case "center":
							case "middle":
								return "center";
								break;
							case "outerCircle":
								return that.x(d.x + d.dx / 2) > Math.PI 
									? "start"
									: "end";
								break;
							}
						};
					})
					.attrTween("transform",function(d) {
						return function() {
							// 如果是在中心点，中心的文字要居中显示。
							if (d.y == 0) {
								angle = 0;
								r = -that.y(d.dy) / 4;
							} else {
								angle = that.x(d.x + d.dx / 2) * 180 / Math.PI - 90;
								switch (conf.textAlign) {
								case "innerCircle":
									r = that.y(d.y) + (that.amount[d.depth - 1] || 0);
									break;
								case "center":
								case "middle":
									r = that.y(d.y + d.dy / 2) + (that.amount[d.depth - 1] || 0);
									break;
								case "outerCircle":
									r = that.y(d.y + d.dy) + (that.amount[d.depth - 1] || 0);
									break;
								}
							}
							return "rotate(" + angle + ")translate(" + r + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
						};
					})
					.style("fill-opacity", function(e) {
						return isParentOf(d, e) 
							? 1 
							: 1e-6;
					})
					.each("end",function(e) {
						d3.select(this)
							.style("visibility", isParentOf(d, e) 
								? null
								: "hidden"
							);
						that.textEnter.filter(function(d1, i) {
							return (Math.abs(that.x(d1.dx + d.x)) * 180 / Math.PI) > 4;
						}).attr("display",null);//角度过小则不显示文字
						that.textEnter.filter(function(d1, i) {
							return (Math.abs(that.x(d1.dx + d.x)) * 180 / Math.PI) < 4;
						}).attr("display","none");//角度过小则不显示文字
					});
			} else {
				conf.onLeafClick(d);
			}
    	}
    	
    	function mousedblclick () {
    		var d = arguments[0];
    		that.defaults.onDblClick(d);
    	}
    	
    	function mouseover () {
			var ID = arguments[0];
			var showFloatTag = arguments[1];
			
			typeof showFloatTag === "undefined" && that.floatTag
				? showFloatTag = true
				: showFloatTag = false;
			
    		that.pathEnter[0].forEach(function (d) {
    			if(d.__data__[that.dimension.ID] == ID){
    				var o = {};
    				o[that.dimension.name] = d.__data__[that.dimension.name];
    				//o["depth"] = d.__data__.depth;
    				o[that.dimension.size] = d.__data__.value;
                    o[that.dimension.ID] = ID;
                    if (d.__data__.parent) {
                        o[that.dimension.parentID] = d.__data__.parent[that.dimension.ID];
                    }
    				o[that.dimension.info] = d.__data__[that.dimension.info];
    				conf.onMouseOver(o);
				
					//showFloatTag && that.floatTag.show(o, {x : d.getBBox().x, y : d.getBBox().y});
					showFloatTag && that.floatTag.show(o,that.floatTag.defaults.format,that);
    			}
    		});
    	}
    	
    	function mouseout () {
    		var ID = arguments[0];
			var showFloatTag = arguments[1];
			
			typeof showFloatTag === "undefined" && that.floatTag
				? showFloatTag = true
				: showFloatTag = false;
			
    		that.pathEnter[0].forEach(function (d) {
    			if(d.__data__[that.dimension.ID] == ID){
    				conf.onMouseOut(d.__data__);
					showFloatTag && that.floatTag.hide();
    			}
    		});
    	}
    	
    	this.on("mouseclick", mouseclick);
    	this.on("mousedblclick", mousedblclick);
    	this.on("mouseover", mouseover);
    	this.on("mouseout", mouseout);
	};
	
	/**
	 * 组件绘制
	 * @ignore
	 */
	SunBurstChart.prototype._layout = function() {
		this._setColor();
		var svg = this.svg;
		var that = this, 
			conf = this.defaults;

		var width = conf.width, 
			height = conf.height, 
			// edit by  zhangsonghui for  自适应时太大
			radius = Math.min(width, height) / 2-45,
			x = d3.scale.linear().range([ 0, 2 * Math.PI ]), 
			color = d3.scale.category20c(), 
			y = d3.scale.pow().exponent(1.3).domain([ 0, 1 ]).range([ 0, radius ]);
		
		this.x = x;
		this.y = y;

		var floatTag = this.floatTag;

		var textStyle = _.clone(conf.textStyle);

        var fontSize = 'fontSize';
		textStyle[fontSize] = textStyle[fontSize]
			? parseInt(textStyle[fontSize])
			: 20;

		var duration = 1000, count = 0, amount = [], radiusArray = [];

		that.colorCount = 0;

		function comparator(a, b) {
			return b.value - a.value;
		}

		this.addStyle = function (object, style) {
			if (style) {
				for ( var p in style) {
					object.style(p, style[p]);
				}
			}
		};

		var sorted = conf.isSorted ? comparator : null;

		var partition = d3.layout.partition().sort(sorted)
				.value(function(d) {
					return d[that.dimension.size];
				});

		if (conf.radiusArray) {
			var calRadiusAmount = (function() {
				for ( var i = 0, l = conf.radiusArray.length; i < l; i++) {
					radiusArray.push(conf.radiusArray[i]);
				}
				amount = radiusArray;
				for ( var i = 1, l = radiusArray.length; i < l; i++) {
					amount[i] += amount[i - 1];
				}
			})();

			var arc = d3.svg.arc().startAngle(
					function(d) {
						return Math.max(0, Math.min(
								2 * Math.PI, x(d.x)));
					}).endAngle(
					function(d) {
						return Math.max(0, Math.min(
								2 * Math.PI, x(d.x + d.dx)));
					}).innerRadius(
					function(d) {
						if (d.depth == 0) {
							return 0;
						} else {
							return Math.max(0, d.y ? y(d.y)
									: d.y)
									+ amount[d.depth - 1];
						}
					}).outerRadius(
					function(d) {
						return Math.max(0, y(d.y + d.dy))
								+ amount[d.depth];
					});
		} else {
			var arc = d3.svg.arc().startAngle(
					function(d) {
						return Math.max(0, Math.min(
								2 * Math.PI, x(d.x)));
					}).endAngle(
					function(d) {
						return Math.max(0, Math.min(
								2 * Math.PI, x(d.x + d.dx)));
					}).innerRadius(function(d) {
				return Math.max(0, d.y ? y(d.y) : d.y);
			}).outerRadius(function(d) {
				return Math.max(0, y(d.y + d.dy));
			});
		}
		
		this.amount = amount;
		this.arc = arc;

		var path = svg.datum(this.source).selectAll("path")
				.data(partition.nodes);
		this.path = path;

		var findColor = function(d) {
			if (!d.parent) {
				return;
			}
			if (d.parent.color) {
				return d.parent.color;
			} else {
				return findColor(d.parent);
			}
		};

		var gradientColor = function(d, i) {
			var color;
			if (conf.onSpecialColor) {
				return color = conf.onSpecialColor(d);
			}
			if (d.depth <= 1) {
				color = Color.getColor(d[that.dimension.name], that.owner.colorDict, that.owner.colorArray);
				d.color = color;
			} else {
				color = findColor(d);
				if (!color) {
					color = 'red';
				}
				color = d3.rgb(Color.rgbToHex(color)).darker(d.depth / 7);
			}
			return color;
		};

		var pathEnter = path.enter().append("path")
			.attr("d",arc)
			.style("fill", gradientColor)
			.style("stroke","#fff")
			.style("fill-rule", "evenodd")
			.each(stash);

		this.addStyle(pathEnter, conf.arcStyle);
		
		d3.selectAll("input").on("change",function change() {
			var value = this.value === "count" 
				? function() {
					return 1;
				}
				: function(d) {
					return d[that.dimension.size];
				};

			pathEnter.data(partition.value(value).nodes)
				.transition()
				.duration(duration)
				.attrTween("d", arcTween);
		});
		// 事件绑定
		pathEnter.on("mouseover", function(d) {
			that.fire("mouseover", d[that.dimension.ID]);
		}).on("mouseout", function(d) {
			that.fire("mouseout", d[that.dimension.ID]);
		}).on("click", function (d) {
			that.fire("mouseclick", d);
		}).on("dblclick", function (d) {
			that.fire("mousedblclick", d);
		});
		
		this.pathEnter = pathEnter;

		// 绘制里面的文字
		var text = svg.datum(this.source).selectAll("text")
				.data(partition.nodes);
		this.text = text;
	
		var textEnter = text
				.enter()
				.append("text")
				.style("fill-opacity", 1)
				.style("fill", 'blue')
				.attr("text-anchor",
						function(d) {
							switch (conf.textAlign) {
							case "innerCircle":
								return x(d.x + d.dx / 2) > Math.PI ? "end"
										: "start";
								break;
							case "center":
							case "middle":
								return "center";
								break;
							case "outerCircle":
								return x(d.x + d.dx / 2) > Math.PI ? "start"
										: "end";
								break;
							}
						}).attr("dy", ".2em").attr(
						"transform",
						function(d) {
							// 如果是在中心点，中心的文字要居中显示。
							if (d.y == 0) {
								angle = 0;
								r = -y(d.dy) / 4;
							} else {
								angle = x(d.x + d.dx / 2) * 180
										/ Math.PI - 90;
								switch (conf.textAlign) {
								case "innerCircle":
									r = y(d.y) + (amount[d.depth - 1]  || 0);
									break;
								case "center":
								case "middle":
									r = y(d.y + d.dy / 2) + (amount[d.depth - 1]  || 0);
									break;
								case "outerCircle":
									r = y(d.y + d.dy) + (amount[d.depth - 1]  || 0);
									break;
								}
							}
							return "rotate(" + angle
									+ ")translate(" + r
									+ ")rotate("
									+ (angle > 90 ? -180 : 0)
									+ ")";
						}).each(stash);


//        if (_browserDetect.ie < 10) {
//            textEnter.attr({
//                'fontSize':conf.textStyle[fontSize]
//            });
//        } else {
//            textEnter.attr({
//                'font-size':conf.textStyle[fontSize]
//            });
//        }

		this.addStyle(textEnter, textStyle);
		
		this.textEnter = textEnter;

		textEnter.append("tspan")
				.attr("x", 0)
				.text(function(d) {
							switch (conf.showPercentage) {
							case false:
								switch (conf.textShowMode) {
								case 0:
									return d[that.dimension.name].length > 5 
										? d[that.dimension.name].substring(0, 5)+ ".."
										: d[that.dimension.name];
									break;
								case 1:
									return d[that.dimension.name];
									break;
								}
								break;
							case true:
								switch (conf.textShowMode) {
								case 0:
									return d[that.dimension.name].length > 5 
										? d[that.dimension.name].substring(0, 5) + ".." + " " + (d.dx * 100).toFixed(conf.decimalFormat) + "%"
										: d[that.dimension.name] + " " + (d.dx * 100).toFixed(conf.decimalFormat) + "%";
									break;
								case 1:
									return d[that.dimension.name] + " " + (d.dx * 100).toFixed(conf.decimalFormat) + "%";
									break;
								}
								break;
							}
						});

		textEnter.filter(function(d, i) {
			return (x(d.dx) * 180 / Math.PI) < 4;
		}).attr("display", "none");// 角度过小则不显示文字
		// 事件绑定
		textEnter.on("mouseover", function(d) {
			that.fire("mouseover", d[that.dimension.ID]);
		}).on("mouseout", function(d) {
			that.fire("mouseout", d[that.dimension.ID]);
		}).on("dblclick", function () {
			that.fire("mousedblclick", d);
		}).on("click", function (d) {
			that.fire("mouseclick", d);
		});

		function dblclick(d) {
			conf.onDblClick(d);
			that.drillTag = d[that.dimension.name];
		}

		function stash(d) {
			d.x0 = d.x;
			d.dx0 = d.dx;
		}

		function arcTween(a) {
			var i = d3.interpolate({
				x : a.x0,
				dx : a.dx0
			}, a);
			return function(t) {
				var b = i(t);
				a.x0 = b.x;
				a.dx0 = b.dx;
				return arc(b);
			};
		}

		if (typeof conf.target == 'string') {
			this.drill(conf.target);
		}
	};

	/**
	 * @event clearDiv
	 * 清除DOM节点
	 * @ignore
	 */
	SunBurstChart.prototype.clearDiv = function() {
		$(this.node).empty();
		this.svg = undefined;
	};
	/**
	 * @event clear
	 * 清除g标签，相当于清除画布
	 * @ignore
	 */
	SunBurstChart.prototype.clear = function() {
		$(this.node).find("svg").remove();
		this.svg = undefined;
	};

	/**
	 * @method drill
	 * 模拟鼠标点击API，产生钻取效果
	 * @param {String} target
	 * 钻取目标
	 * @ignore
	 */
	SunBurstChart.prototype.drill = function(target) {
		var index,
			count = 0, 
			id = "#" + this.node.id;
		
		switch (typeof target) {
		case 'string':
			selector = " text:contains("+ target + ")";
			break;
		case 'object':
			default:
				throw new Error("DataViz Error #" + target + 'is not a String type!');
		}

		for ( var i = 0, l = $(id + selector).length; i < l; i++) {
			if ($(id + selector)[i].__data__[this.dimension.name] == target) {
				index = i;
				count++;
			}
		}
		if (count == 1) {
			this.drillTag = target;
			this.fire("mouseclick", $(id + selector)[index].__data__);
		} else {
			alert("注意：数据中包含多个或没有(" + target + ")标签节点");
		}
	};
	
	SunBurstChart.prototype.setSource = function (source) {
		this.source = source.source;
		this.dimensions = source.dimensions;
		this.dimension = {};	
		this.dimension.ID = source.dimensions[0];
		this.dimension.name = source.dimensions[1];
		this.dimension.size = source.dimensions[2];
		this.dimension.parentID = source.dimensions[3];
		this.dimension.info = source.dimensions[4];
	};
	
	SunBurstChart.prototype.render = function () {

		this._layout();
	};

	return SunBurstChart;
});