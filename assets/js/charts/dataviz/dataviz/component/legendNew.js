/*global Raphael, $, define, _ */
/*!
 * LegendNew 图例
 */
;(function (name, definition) {
  if (typeof define === 'function') { // Module
    define(definition);
  } else { // Assign to common namespaces or simply the global object (window)
    this[name] = definition(function (id) { return this[id];});
  }
})('LegendNew', function(require) {
  var DataViz = require('DataViz');
  var Color = require("Color");

    /**
     * @class Legend
     * Legend模块,用来设置图表的图例信息
     *
     * example:
	 * 
	 *		legend	:	{
	 *				data : "name",
	 *				position : "bottom",
	 *				marginTop : "80%", 
	 *				item : {
	 *					marginTop : 10,
	 *					marginBottom : 0,
	 *					marginLeft : 20, 
	 *					marginRight : 0,
	 *					markStyle : "circle",
	 *					markRadius : 7,
	 *					markTextWidth : 30,
	 *					fontFamily : "Microsoft YaHei",
	 *					fontSize : "14px",
	 *					fontWeight: "normal",
	 *					fontColor : "#333"
	 *				}
	 *			}
	 */
  var Legend = DataViz.extend(DataViz.Chart, {
    initialize: function (node, options) {
    	options.showLegend = true;
	  	this.type = "Legend";
    	/**
	     * @cfg {String} [data]
	     * 设置数据源中的某一列为图例项的text，无默认值，必须手动指定
	     */
	  	
	  	/**
	     * @cfg {String} [colorMode = "random"]
	     * 图例的配色模式
	     * 
		 * - 'random' 图例颜色根据当前主题颜色的配置方案从左至右自上而下顺序选取，legendColor属性无效
		 * - 'discrete' 图例颜色将从当前主题颜色的二维数组中顺序选取左侧第一列的颜色值
		 * - 'custom' 必须配合使用legendColor属性，图例颜色将根据自定义颜色逐一顺序选取
		 * - 'gradient' 必须配合使用legendColor属性，图例颜色将根据自定义颜色序列生成图例数量的渐变色
		*/
	  	this.defaults.colorMode = "random";		  
		/**
	    * @cfg {Array} [legendColor]
	    * 用户自定义颜色数组,与colorMode配合使用
	    */
	  	
    	// legend default style
    	/**
	     * @cfg {String} [position = "left"]
	     * 图例相对于图表的位置
	     * 
	     * - 'left' 左侧
	     * - 'right' 右侧
	     * - 'top' 上方
	     * - 'bottom' 下方
	     * 
	     * 值为top或bottom时图例为横向，为left或right时图例为纵向
	     */
    	this.defaults.position = "left";//left,top,bottom,right
    	/**
	     * @cfg {Number} [roundRatio = undefined]
	     * 图例图标的圆角弧度值，当item.isRoundCorner值为true时生效
	     */
    	this.defaults.roundRatio = undefined;
    	/**
	     * @cfg {Number} [opacity = 1]
	     * 图例图标的透明度
	     */
    	this.defaults.opacity = 1;
    	
    	/** 
	     * @event onClick
	     * 用户自定义click事件，鼠标单击图例项触发
	     * @param {Object} e
	     * 
	     *- {String} e.text 图例项名称  
	     *- {Number} e.index 图例项索引
	     *
	     * example:
	     * 
	     *		onClick : function(e){		
	     *			alert(e.text);
	     * 		}
	     */
    	this.defaults.onClick = function (e) {};
    	
    	/** 
	     * @event onMouseOver
	     * 用户自定义mouseover事件，鼠标悬在图例项上触发
	     * @param {Object} e
	     * 
	     *- {String} e.text 图例项名称  
	     *- {Number} e.index 图例项索引
	     *
	     * example:
	     * 
	     *		onMouseOver ： function(e){		
	     *			alert(e.text);
	     * 		}
	     */
    	this.defaults.onMouseOver = function (e) {};
    	
    	/** 
	     * @event onMouseOut
	     * 用户自定义mouseout事件，鼠标从图例项离开时触发
	     * @param {Object} e
	     * 
	     *- {String} e.text 图例项名称  
	     *- {Number} e.index 图例项索引
	     *
	     * example:
	     * 
	     *		onMouseOut ： function(e){		
	     *			alert(e.text);
	     * 		}
	     */
    	this.defaults.onMouseOut = function (e) {};
    	
		/**
	     * @cfg {Object} item
	     * 图例项设置，包含但不仅限于如下属性
	     * @cfg {Number} [item.marginTop = 5]
	     * 图例项之间的上间距，支持百分比
	     * @cfg {Number} [item.marginLeft = 10]
	     * 图例项之间的左间距，支持百分比
	     * @cfg {Number} [item.marginBottom = 5]
	     * 图例项之间的下间距，支持百分比
	     * @cfg {Number} [item.marginRight = 10]
	     * 图例项之间的右间距，支持百分比
	     * @cfg {String} [item.markStyle ="rect"]
	     * 图例图标形状
	     * 
	     * - 'rect' 矩形
	     * - 'circle' 圆形
	     * 
	     * @cfg {Number} [item.markWidth = 15]
	     * 图例图标宽度，item.markStyle="rect"生效
	     * @cfg {Number} [item.markHeight = 7]
	     * 图例图标高度，item.markStyle="rect"生效
	     * @cfg {Number} [item.markTextWidth]
	     * 图例文字宽度
	     * @cfg {Number} [item.markRadius = 7]
	     * 图例图标半径，item.markStyle="circle"生效
	     * @cfg {Boolean} [item.isRoundCorner = "false"]
	     * 图例图标是否为圆角，item.markStyle="rect"生效
	     * @cfg {Boolean} [item.isMarkAboveMarkText = "false"]
	     * 图例图标是否位于图例文本之上,图例为横向时生效
	     * @cfg {String} [item.fontFamily = "Microsoft YaHei"]
	     * 图例文本字体
	     * @cfg {String} [item.fontSize = "14px"]
	     * 图例文本字号
	     * @cfg {String} [item.fontWeight = "normal"]
	     * 图例文本weight
	     * @cfg {String} [item.fontColor = "#333"]
	     * 图例文本颜色
	     * @cfg {String} [item.mouseOverColor = "#333"]
	     * mouseover时，图例文本颜色
	     * @cfg {String} [item.mouseOverBgColor = "#ccc"]
	     * mouseover时，图例文本背景颜色 
	     */
    	this.defaults.item = {};
    	this.defaults.item.marginTop = 5;
    	this.defaults.item.marginBottom = 5;
    	this.defaults.item.marginLeft = 10;
    	this.defaults.item.marginRight = 10;
    	this.defaults.item.markStyle = "rect";
    	this.defaults.item.markWidth = 15;
    	this.defaults.item.markHeight = 7;
    	this.defaults.item.markRadius = 7;
    	this.defaults.item.isRoundCorner = false;
    	this.defaults.item.isMarkAboveMarkText = false;
    	this.defaults.item.fontFamily = "Microsoft Yahei";
    	this.defaults.item.fontSize = "14px";
    	this.defaults.item.fontWeight = "normal";
    	this.defaults.item.fontColor = "#333";
    	this.defaults.item.mouseOverColor = "#333";
    	this.defaults.item.mouseOverBgColor = "#ccc";
    	
    	this.setOptions(options);
    	/**
	     * @cfg {Number} [marginLeft = 0]
	     * 图例距页面左侧的距离，支持百分比
	     */
    	this.defaults.marginLeft =  this.defaults.leftLegendWidth || this.defaults.marginLeft;
    	
    	if(this.defaults.item.isRoundCorner == true) {
    		this.defaults.roundRatio = 4;
    	}
    	this.LegendSource = [];
    	this.underBn = {};
    	this.legendText = {};
    	this.lastClickText = undefined;
    }
  });
  
  Legend.prototype._setColor = function () {	
	  this.owner.colorArray = Color.setColor(this.defaults.colorMode, this.defaults.legendColor,
			  this.LegendSource.length, this.owner.theme);
	  if(this.defaults.colorMode == "custom") {
		  this.owner.themeColor = Color.setColor("random", this.defaults.legendColor,
				  this.LegendSource.length, this.owner.theme);//保存主题颜色
		  this.owner.colorDict = this.defaults.legendColor || []; 
	  }
  };
  
  Legend.prototype.setSource = function (source) {
	  this.LegendSource = source;
  };

  Legend.prototype.render = function () {
    this._setColor();  
    this.owner.legendData = this.defaults.data;
	this.defaults.canvasWidth = this.canvas.width;
	this.defaults.canvasHeight = this.canvas.height;

	this.tempMarkTextWidth = undefined;
	this.tempMarkTextHeight = undefined;
	
    // 设置marginLeft、marginTop 
    var tempMarginLeft = this.defaults.marginLeft;
    this.defaults.marginLeft = this.defaults.marginLeft || 0;

    if(typeof this.defaults.marginTop == 'undefined') {
    	if(this.defaults.position == "left" || this.defaults.position == "right") {
    		switch(this.defaults.item.markStyle)
			{
				case "rect":
					this.defaults.height = this.LegendSource.length * (this.defaults.item.markHeight + this.defaults.item.marginTop +
		        			this.defaults.item.marginBottom + 2);
					break;
				case "circle":
					this.defaults.height = this.LegendSource.length * (2*this.defaults.item.markRadius + this.defaults.item.marginTop +
		        			this.defaults.item.marginBottom + 2);
					break;
				default:
					this.defaults.height = this.LegendSource.length * (this.defaults.item.markHeight + this.defaults.item.marginTop +
		        			this.defaults.item.marginBottom + 2);
			}
    		if(this.defaults.height > this.defaults.canvasHeight) {
            	this.defaults.marginTop = 0;
            } else {
            	this.defaults.marginTop = this.defaults.canvasHeight - this.defaults.height;
            }
    	} else {
    		this.defaults.marginTop = 0.01 * this.defaults.canvasHeight;
    	}
    }
    // 支持百分比
	this.defaults.marginLeft = (this.defaults.marginLeft + "").indexOf("%") > -1 ? 
			this.defaults.marginLeft.replace("%","") / 100 * this.defaults.canvasWidth :  this.defaults.marginLeft;
	this.defaults.marginTop = (this.defaults.marginTop + "").indexOf("%") > -1 ? 
					this.defaults.marginTop.replace("%","") / 100 * this.defaults.canvasHeight :  this.defaults.marginTop;
    
    var conf = this.defaults;
    // 绘制图例
    this.canvas.setStart();
	if(conf.position == "top" || conf.position == "bottom") {
		this.renderHorizon(this.canvas, conf);
	} else if(conf.position == "left" || conf.position == "right") {
		this.renderVertical(this.canvas, conf);
	}
	this.st = this.canvas.setFinish();
	if((conf.position == "top" || conf.position == "bottom")) {
		if(tempMarginLeft == undefined) {
			var legendWidth = 0;
			if(conf.item.isMarkAboveMarkText == true) {
				var realWidth = 0; 
				switch(conf.item.markStyle)
				{
					case "rect":
						realWidth = this.tempMarkTextWidth > conf.item.markWidth ? this.tempMarkTextWidth : conf.item.markWidth;
						legendWidth = (realWidth + 5 + conf.item.marginLeft + conf.item.marginRight) * this.LegendSource.length; 
						break;
					case "circle":
						realWidth = this.tempMarkTextWidth > conf.item.markRadius * 2 ? this.tempMarkTextWidth : conf.item.markRadius * 2;
						legendWidth = (realWidth + 5 + conf.item.marginLeft + conf.item.marginRight) * this.LegendSource.length; 
						break;
					default:
						realWidth = this.tempMarkTextWidth > conf.item.markWidth ? this.tempMarkTextWidth : conf.item.markWidth;
						legendWidth = (realWidth + 5 + conf.item.marginLeft + conf.item.marginRight) * this.LegendSource.length; 
				}
				
			} else {
				switch(conf.item.markStyle)
				{
					case "rect":
						legendWidth = (this.tempMarkTextWidth + 10 + conf.item.markWidth + 
								conf.item.marginLeft + conf.item.marginRight) * this.LegendSource.length; 
						break;
					case "circle":
						legendWidth = (this.tempMarkTextWidth + 10 + conf.item.marginLeft + 
								2*conf.item.markRadius + conf.item.marginRight) * this.LegendSource.length; 
						break;
					default:
						legendWidth = (this.tempMarkTextWidth + 10 + conf.item.markWidth + 
								conf.item.marginLeft + conf.item.marginRight) * this.LegendSource.length; 
				}
			}
			if(legendWidth < this.defaults.canvasWidth) {
				this.st.transform("t"+((this.defaults.canvasWidth - legendWidth) / 2 )+",0");
			}
		}
	}
  };
  
  // 绘制横向图例
  Legend.prototype.renderHorizon = function (paper, conf) {
	  	var itemConf = conf.item;
		var indentX = conf.marginLeft;
		var indentYMark = 0;
		var verticalRatio = 1;
		var markTextWidh = itemConf.markTextWidth || 0;
		for(var i = 0; i < this.LegendSource.length; i++) {
			var underMark;
			// 绘制mark
			var mark;
			var indentYMarkText;
			var underbnX = 0, underbnY = 0, unberbnWidth = 0, underbnHeight = 0; // 绘制背景框需要的参数
			
			switch(itemConf.markStyle)
			{
				case "rect":
					indentX += itemConf.marginLeft;
				    underbnX = indentX - 2;
                    if (conf.position === "top") {
                        if(itemConf.isMarkAboveMarkText == true) {
                            indentYMark = conf.marginTop + 30 + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * (itemConf.markHeight
                            + itemConf.markHeight / 2 + (this.tempMarkTextHeight || 0) + itemConf.marginBottom);
                        } else {
                            indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight +
                            (verticalRatio - 1) * itemConf.marginBottom;
                        }
                        indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
                    } else {
                        if(itemConf.isMarkAboveMarkText == true) {
                            indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * (itemConf.markHeight
                            + itemConf.markHeight / 2 + (this.tempMarkTextHeight || 0) + itemConf.marginBottom);
                        } else {
                            indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * itemConf.markHeight +
                            (verticalRatio - 1) * itemConf.marginBottom;
                        }
                        indentYMarkText = conf.canvasHeight - verticalRatio * (itemConf.marginTop) - itemConf.markHeight/2 - (verticalRatio - 1) * itemConf.markHeight - (verticalRatio - 1) * itemConf.marginBottom;
                    }

				    underbnY = indentYMark - 4;

				    mark = paper.rect(indentX, indentYMark , itemConf.markWidth, itemConf.markHeight, this.defaults.roundRatio);
				    indentX +=  5 + itemConf.markWidth;
				    break;
				case "circle":
				    indentX += itemConf.marginLeft + itemConf.markRadius;
				    underbnX = indentX - itemConf.markRadius - 2;
                    if (conf.position === "top") {
                        if(itemConf.isMarkAboveMarkText == true) {
                            indentYMark = conf.marginTop + 30 + verticalRatio * (itemConf.marginTop + itemConf.markRadius) +
                            (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius + (this.tempMarkTextHeight || 0));
                            indentYMarkText = indentYMark + itemConf.markRadius + 17;
                        } else {
                            indentYMark = conf.marginTop + verticalRatio * (itemConf.marginTop + itemConf.markRadius) +
                            (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius);
                            indentYMarkText = indentYMark;
                        }
                    } else {
                        if(itemConf.isMarkAboveMarkText == true) {
                            indentYMark = conf.canvasHeight - verticalRatio * (itemConf.marginTop + itemConf.markRadius) -
                            (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius + (this.tempMarkTextHeight || 0));
                            indentYMarkText = indentYMark + itemConf.markRadius + 17;
                        } else {
                            indentYMark = conf.canvasHeight - verticalRatio * (itemConf.marginTop + itemConf.markRadius) -
                            (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius);
                            indentYMarkText = indentYMark;
                        }
                    }
				    underbnY = indentYMark - itemConf.markRadius - 4;

				    mark = paper.circle(indentX,indentYMark,itemConf.markRadius);
				    indentX += itemConf.markRadius + 5;
				    break;
				default:
					indentX += itemConf.marginLeft;
				    underbnX = indentX - 2;
                    if (conf.position === "top") {
                        if(itemConf.isMarkAboveMarkText == true) {
                            indentYMark = conf.marginTop + 30 + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * (itemConf.markHeight
                            + itemConf.markHeight / 2 + (this.tempMarkTextHeight || 0) + itemConf.marginBottom);
                        } else {
                            indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight +
                            (verticalRatio - 1) * itemConf.marginBottom;
                        }
                        indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
                    } else {
                        if(itemConf.isMarkAboveMarkText == true) {
                            indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * (itemConf.markHeight
                            + itemConf.markHeight / 2 + (this.tempMarkTextHeight || 0) + itemConf.marginBottom);
                        } else {
                            indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * itemConf.markHeight +
                            (verticalRatio - 1) * itemConf.marginBottom;
                        }
                        indentYMarkText = conf.canvasHeight - verticalRatio * (itemConf.marginTop) - itemConf.markHeight/2 - (verticalRatio - 1) * itemConf.markHeight - (verticalRatio - 1) * itemConf.marginBottom;
                    }

				    underbnY = indentYMark - 4;
				    mark = paper.rect(indentX, indentYMark , itemConf.markWidth, itemConf.markHeight, this.defaults.roundRatio);
				    indentX +=  5 + itemConf.markWidth;
			}
			
			// 动态设置颜色和文本
			//var color = Color.getColor(this.LegendSource[i], this.owner.colorDict, this.owner.colorArray);
			//获得legendColor或主题颜色
			var color = Color.getColor(this.LegendSource[i], this.owner.colorDict, this.owner.colorArray, this.owner.themeColor,this.defaults.colorMode);
			mark.attr({"text-anchor":"start",
				"stroke":color,
				"stroke-opacity":0.5,
				"fill-opacity":this.defaults.opacity,
				"fill":color
				});
			// 绘制markText
			var markText = paper.text(indentX, itemConf.marginTop, this.LegendSource[i]);
			markText.attr({
				"font-family" : itemConf.fontFamily,
				"font-size" : itemConf.fontSize,
				"font-weight" : itemConf.fontWeight,
				"fill" : itemConf.fontColor
			});
			// hover 事件 
			var st = paper.set();
			st.push(mark);
			st.push(markText);
			var that = this;
			this.LegendSource[i].index = i;
			st.data("obj", this.LegendSource[i]).data("index", i)
	         .hover(function () {
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.highlight(tarObj.text);
	        	 that.fire('hoverIn', tarObj);
	        	 that.defaults.onMouseOver(tarObj);
	         },function () {
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.lowlight(tarObj.text);
	        	 that.fire('hoverOut', tarObj);
	        	 that.defaults.onMouseOut(tarObj);
	         }).click(function () {
	        	 if (DataViz.isMobile) return null;
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.fire('click', tarObj);
        		 that.defaults.onClick(tarObj);
	         }).touchstart(function () {
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.fire('click', tarObj);
        		 that.defaults.onClick(tarObj);
	         });
			var markTextBBox = markText.getBBox();
			this.tempMarkTextWidth = (markTextBBox.width < markTextWidh ? markTextWidh : markTextBBox.width);
			
			
			var tarMarkTextY = indentYMarkText;
			var tarMarkTextX = indentX;
			// mark在上，markText在下
			if(itemConf.isMarkAboveMarkText == true) { 
				switch(itemConf.markStyle)
				{
					case "rect":
						tarMarkTextY = indentYMarkText + verticalRatio * (itemConf.markHeight / 2 + markTextBBox.height);
						// 修正mark、markText的位置
						tarMarkTextX = indentX - itemConf.markWidth - 5;
						var maxMarkOrTextLength = itemConf.markWidth > this.tempMarkTextWidth ? itemConf.markWidth : this.tempMarkTextWidth;
						var tempMarkX = tarMarkTextX + (maxMarkOrTextLength - itemConf.markWidth) / 2;
						tarMarkTextX = tarMarkTextX + (maxMarkOrTextLength - markTextBBox.width) / 2;
						mark.attr({"x":""+tempMarkX+""});
						// 设置indentX
						if(itemConf.markWidth <= this.tempMarkTextWidth) {
							indentX = indentX - itemConf.markWidth - 5 + itemConf.marginRight + 
							this.tempMarkTextWidth;
						} else {
							indentX = indentX - itemConf.markWidth - 5 + itemConf.marginRight + 
							itemConf.markWidth;
							tarMarkTextX = tarMarkTextX - 3;// 修正markText的位置 
						}
						// 修正underbnX
						if(itemConf.markWidth > markTextBBox.width) {
							underbnX = tempMarkX - 2;
						} else {
							underbnX = tarMarkTextX - 2;
						}
					  break;
					case "circle":
						// 修正mark、markText的位置
						tarMarkTextX = indentX - 2*itemConf.markRadius;
						var maxMarkOrTextLength = 2*itemConf.markRadius > this.tempMarkTextWidth ? 2*itemConf.markRadius : this.tempMarkTextWidth;
						var tempMarkX = tarMarkTextX + (maxMarkOrTextLength - 2*itemConf.markRadius) / 2 + itemConf.markRadius;
						tarMarkTextX = tarMarkTextX + (maxMarkOrTextLength - markTextBBox.width) / 2 - markTextBBox.width/2 + itemConf.markRadius;
						mark.attr({"cx":""+tempMarkX+""});
						// 设置indentX
						if(2*itemConf.markRadius <= this.tempMarkTextWidth) {
							indentX = indentX - 2*itemConf.markRadius + itemConf.marginRight + itemConf.markRadius +
							this.tempMarkTextWidth;
						} else {
							indentX = indentX - 2*itemConf.markRadius + itemConf.marginRight + itemConf.markRadius + 
							2*itemConf.markRadius;
							tarMarkTextX = tarMarkTextX - itemConf.markRadius + markTextBBox.width/2 - 3;// 修正markText的位置 
						}
						// 修正underbnX
						if(2*itemConf.markRadius > markTextBBox.width) {
							underbnX = tempMarkX - itemConf.markRadius - 2;
						} else {
							underbnX = tarMarkTextX - 2;
						}
					  break;
					default:
						tarMarkTextY = indentYMarkText + verticalRatio * (itemConf.markHeight / 2 + markTextBBox.height);
						// 修正mark、markText的位置
						tarMarkTextX = indentX - itemConf.markWidth - 5;
						var maxMarkOrTextLength = itemConf.markWidth > this.tempMarkTextWidth ? itemConf.markWidth : this.tempMarkTextWidth;
						var tempMarkX = tarMarkTextX + (maxMarkOrTextLength - itemConf.markWidth) / 2;
						tarMarkTextX = tarMarkTextX + (maxMarkOrTextLength - markTextBBox.width) / 2;
						mark.attr({"x":""+tempMarkX+""});
						// 设置indentX
						if(itemConf.markWidth <= this.tempMarkTextWidth) {
							indentX = indentX - itemConf.markWidth - 5 + itemConf.marginRight + 
							this.tempMarkTextWidth;
						} else {
							indentX = indentX - itemConf.markWidth - 5 + itemConf.marginRight + 
							itemConf.markWidth;
							tarMarkTextX = tarMarkTextX - 3;// 修正markText的位置 
						}
						// 修正underbnX
						if(itemConf.markWidth > markTextBBox.width) {
							underbnX = tempMarkX - 2;
						} else {
							underbnX = tarMarkTextX - 2;
						}
				}
			}
			
			markText.attr({
				"x" : tarMarkTextX,
				"text-anchor":"start",
				"y": tarMarkTextY
			}).attr(this.defaults.legendStyle && this.defaults.legendStyle);
			// 折行
			var wrapWidth = indentX + 5 +(markTextBBox.width < markTextWidh ? markTextWidh : markTextBBox.width) + itemConf.marginRight;
			if(itemConf.isMarkAboveMarkText == true) {
				wrapWidth = indentX + itemConf.marginRight;
			}
			// 如果超过了画布宽度
			if(wrapWidth > conf.canvasWidth) {
				indentX = conf.marginLeft;
				verticalRatio += 1;
				this.tempMarkTextHeight = markTextBBox.height;
				switch(itemConf.markStyle)
				{
					case "rect":
					  indentX += itemConf.marginLeft;	
					  underbnX = indentX - 2;
                        if (conf.position === "top") {
                            if(itemConf.isMarkAboveMarkText == true) {
                                indentYMark = conf.marginTop + 30 + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * (itemConf.markHeight
                                + itemConf.markHeight / 2 + markTextBBox.height + itemConf.marginBottom);
                            } else {
                                indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight +
                                (verticalRatio - 1) * itemConf.marginBottom;
                            }
                            indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
                        } else {
                            if(itemConf.isMarkAboveMarkText == true) {
                                indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * (itemConf.markHeight
                                + itemConf.markHeight / 2 + markTextBBox.height + itemConf.marginBottom);
                            } else {
                                indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * itemConf.markHeight +
                                (verticalRatio - 1) * itemConf.marginBottom;
                            }
                            indentYMarkText = conf.canvasHeight - verticalRatio * (itemConf.marginTop) - itemConf.markHeight/2 - (verticalRatio - 1) * itemConf.markHeight - (verticalRatio - 1) * itemConf.marginBottom;
                        }
					  underbnY = indentYMark - 4;
				      mark.attr({
							"x":indentX,
							"y":indentYMark
						});
					  indentX += 5 + itemConf.markWidth;
					  break;
					case "circle":
				      indentX += itemConf.marginLeft + itemConf.markRadius;
					  underbnX = indentX - itemConf.markRadius - 2;
                        if (conf.position === "top") {
                            if(itemConf.isMarkAboveMarkText == true) {
                                indentYMark = conf.marginTop + 30 + verticalRatio * (itemConf.marginTop + itemConf.markRadius) +
                                (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius + (this.tempMarkTextHeight || 0));
                                indentYMarkText = indentYMark + itemConf.markRadius + 17;
                            } else {
                                indentYMark = conf.marginTop + verticalRatio * (itemConf.marginTop + itemConf.markRadius) +
                                (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius);
                                indentYMarkText = indentYMark;
                            }
                        } else {
                            if(itemConf.isMarkAboveMarkText == true) {
                                indentYMark = conf.canvasHeight - verticalRatio * (itemConf.marginTop + itemConf.markRadius) -
                                (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius + (this.tempMarkTextHeight || 0));
                                indentYMarkText = indentYMark + itemConf.markRadius + 17;
                            } else {
                                indentYMark = conf.canvasHeight - verticalRatio * (itemConf.marginTop + itemConf.markRadius) -
                                (verticalRatio - 1) * (itemConf.marginBottom + itemConf.markRadius);
                                indentYMarkText = indentYMark;
                            }
                        }

					  underbnY = indentYMark - itemConf.markRadius - 4;

					  mark.attr({
						  "cx":indentX,
						  "cy": indentYMark
					  });
					  indentX += itemConf.markRadius + 5;
					  break;
					default:
					  indentX += itemConf.marginLeft;	
					  underbnX = indentX - 2;
                        if (conf.position === "top") {
                            if(itemConf.isMarkAboveMarkText == true) {
                                indentYMark = conf.marginTop + 30 + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * (itemConf.markHeight
                                + itemConf.markHeight / 2 + markTextBBox.height + itemConf.marginBottom);
                            } else {
                                indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight +
                                (verticalRatio - 1) * itemConf.marginBottom;
                            }
                            indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
                        } else {
                            if(itemConf.isMarkAboveMarkText == true) {
                                indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * (itemConf.markHeight
                                + itemConf.markHeight / 2 + markTextBBox.height + itemConf.marginBottom);
                            } else {
                                indentYMark = conf.canvasHeight - verticalRatio * itemConf.marginTop - (verticalRatio - 1) * itemConf.markHeight +
                                (verticalRatio - 1) * itemConf.marginBottom;
                            }
                            indentYMarkText = conf.canvasHeight - verticalRatio * (itemConf.marginTop) - itemConf.markHeight/2 - (verticalRatio - 1) * itemConf.markHeight - (verticalRatio - 1) * itemConf.marginBottom;
                        }
					  underbnY = indentYMark - 4;
				      mark.attr({
							"x":indentX,
							"y":indentYMark
						});
					  indentX += 5 + itemConf.markWidth;
				}

				var tarMarkTextX = indentX;
				// 如果mark在markText上面
			    if(itemConf.isMarkAboveMarkText == true) {
			    	switch(itemConf.markStyle)
					{
						case "rect":
							// 修正mark、markText的位置
							tarMarkTextX = indentX - itemConf.markWidth - 5;
							indentX = indentX - itemConf.markWidth - 5;
							var maxMarkOrTextLength = itemConf.markWidth > this.tempMarkTextWidth ? itemConf.markWidth : this.tempMarkTextWidth;
							var tempMarkX = tarMarkTextX + (maxMarkOrTextLength - itemConf.markWidth) / 2;
							tarMarkTextX = tarMarkTextX + (maxMarkOrTextLength - markTextBBox.width) / 2;
							mark.attr({"x":""+tempMarkX+""});
							// 设置indentX
							if(itemConf.markWidth <= this.tempMarkTextWidth) {
								indentX = indentX + itemConf.marginRight + 
								this.tempMarkTextWidth + itemConf.marginLeft;
							} else {
								indentX = indentX + itemConf.marginRight + 
								itemConf.markWidth + itemConf.marginLeft;
								tarMarkTextX = tarMarkTextX - 3;// 修正markText的位置 
							}
							// 修正underbnX
							if(itemConf.markWidth > markTextBBox.width) {
								underbnX = tempMarkX - 2;
							} else {
								underbnX = tarMarkTextX - 2;
							}
							
							markText.attr({
								"x":tarMarkTextX ,
								"y":indentYMarkText + verticalRatio * (itemConf.markHeight / 2 + markTextBBox.height)
							});
						  break;
						case "circle": 
							tarMarkTextY = indentYMarkText;
							// 修正mark、markText的位置 
							tarMarkTextX = indentX - 2*itemConf.markRadius;
							var maxMarkOrTextLength = 2*itemConf.markRadius > this.tempMarkTextWidth ? 2*itemConf.markRadius : this.tempMarkTextWidth;
							var tempMarkX = tarMarkTextX + (maxMarkOrTextLength - 2*itemConf.markRadius) / 2 + itemConf.markRadius;
							tarMarkTextX = tarMarkTextX + (maxMarkOrTextLength - markTextBBox.width) / 2 - markTextBBox.width/2 + itemConf.markRadius;
							mark.attr({"cx":""+tempMarkX+""});
							// 设置indentX
							if(2*itemConf.markRadius <= this.tempMarkTextWidth) {
								indentX = indentX - 2*itemConf.markRadius + itemConf.marginRight + itemConf.markRadius +
								this.tempMarkTextWidth + itemConf.marginLeft;
							} else {
								indentX = indentX - 2*itemConf.markRadius + itemConf.marginRight + itemConf.markRadius + 
								2*itemConf.markRadius + itemConf.marginLeft;
								tarMarkTextX = tarMarkTextX - itemConf.markRadius + markTextBBox.width/2 - 3;// 修正markText的位置 
							}
							// 修正underbnX
							if(2*itemConf.markRadius > markTextBBox.width) {
								underbnX = tempMarkX - itemConf.markRadius - 2;
							} else {
								underbnX = tarMarkTextX - 2;
							}
							markText.attr({
								"x":tarMarkTextX ,
								"y":tarMarkTextY
							});
						  break;
						default:
							tarMarkTextX = tarMarkTextX - itemConf.markWidth - 5;
							indentX = indentX - itemConf.markWidth - 5;
							if(itemConf.markWidth <= markTextBBox.width) {
								var tempMarkX =tarMarkTextX + (markTextBBox.width - itemConf.markWidth) / 2;
								mark.attr({"x":""+tempMarkX+""});
								indentX += markTextBBox.width + itemConf.marginRight + itemConf.marginLeft;
							} else {
								tarMarkTextX = tarMarkTextX + (itemConf.markWidth - markTextBBox.width) / 2;
								indentX += itemConf.markWidth + itemConf.marginRight + itemConf.marginLeft;
							}
							markText.attr({
								"x":tarMarkTextX ,
								"y":indentYMarkText + verticalRatio * (itemConf.markHeight / 2 + markTextBBox.height)
							});
					}
				}
			    // mark在markText左边
			    else {
					markText.attr({
						"x":tarMarkTextX,
						"y":indentYMarkText
					});
					indentX += 5 +(markTextBBox.width < markTextWidh ? markTextWidh : markTextBBox.width) + itemConf.marginRight;
				 }
			}
			// 没有超过画布宽度
			else {
				if(itemConf.isMarkAboveMarkText == true) { 
					indentX += itemConf.marginRight + 10;
				} else {
					indentX +=  5 +(markTextBBox.width < markTextWidh ? markTextWidh : markTextBBox.width) + itemConf.marginRight;
				}
			}
			// 绘制underbn
			var markBox = mark.getBBox(),
				markTextBox = markText.getBBox();
			if(itemConf.isMarkAboveMarkText == true) {
				var tempWidth = markBox.width > markTextBox.width ? markBox.width : markTextBox.width;
				unberbnWidth = tempWidth + 4;
				underbnHeight = mark.getBBox().height + markTextBox.height + 12;
			} else {
				unberbnWidth = markBox.width + 5 + markTextBox.width + 4;
				underbnHeight = markBox.height + 8;
			}
			
			underMark = paper.rect(underbnX, underbnY, unberbnWidth, underbnHeight)
	        .attr({"stroke-width":"0","fill":itemConf.mouseOverBgColor})
	        .hide().toBack();
			this.underBn[this.LegendSource[i]] = underMark;
			this.legendText[this.LegendSource[i]] = markText;
		}
  };
  
  // 绘制纵向图例
  Legend.prototype.renderVertical = function (paper, conf) {
	  var textWidthArr = [];
	  var itemConf = conf.item;
		var indentX = 0;
		var indentYMark = 0;
		var verticalRatio = 1;
		var horizonRatio = 1;
		var markTextWidh = itemConf.markTextWidth || 0;
		var textBoxWidth = 0;
		var underMark;
		var everysourcelength=[];
		var max=0;
		var flag;
		var maxLengthText;
		var maxtextBoxWidth;
		
		for(var i = 0, l = this.LegendSource.length; i < l; i++) {
			sourceLength = this.LegendSource[i].length;
			if  (max < sourceLength){
				max=sourceLength;
				flag=i;
			}
		}
		
		maxLengthText = this.LegendSource[flag];
		
		var markText = paper.text(indentX, itemConf.marginTop, maxLengthText);
		markText.attr({
			"text-anchor":"start",
			"font-family" : itemConf.fontFamily,
			"font-size" : itemConf.fontSize,
			"font-weight" : itemConf.fontWeight
		}).attr(this.defaults.legendStyle && this.defaults.legendStyle);
		
		markTextWidh = markText.getBBox().width;
		
		markText.remove();
		
		for(var i = 0; i < this.LegendSource.length; i++) {
			// 绘制mark
			var mark;
			var indentYMarkText;
			var underbnX = 0, underbnY = 0, unberbnWidth = 0, underbnHeight = 0; // 绘制背景框需要的参数
			switch(itemConf.markStyle)
			{
				case "rect":
                    if (conf.position === "left") {
                        indentX = conf.marginLeft + horizonRatio * itemConf.marginLeft + (horizonRatio - 1) * (
                        itemConf.markWidth + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
                    } else {
                        indentX = conf.canvasWidth - 10 - markTextWidh - horizonRatio * itemConf.marginLeft + (horizonRatio - 1) * (
                        itemConf.markWidth + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
                    }

				  underbnX = indentX - 2;
				  indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
				  underbnY = indentYMark - 4;
				  
				  indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
				  mark = paper.rect(indentX, indentYMark , itemConf.markWidth, itemConf.markHeight, this.defaults.roundRatio);
				  indentX +=  5 + itemConf.markWidth;
				  break;
				case "circle":
                    if (conf.position === "left") {
                        indentX = conf.marginLeft + horizonRatio *(itemConf.marginLeft + itemConf.markRadius)+ (horizonRatio - 1) * (
                        2*itemConf.markRadius + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
                    } else {
                        indentX = conf.canvasWidth - 10 - markTextWidh - horizonRatio *(itemConf.marginLeft + itemConf.markRadius)+ (horizonRatio - 1) * (
                        2*itemConf.markRadius + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
                    }

				  underbnX = indentX - itemConf.markRadius - 2;
				  indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio) * itemConf.markRadius + (verticalRatio - 1) * itemConf.marginBottom + (verticalRatio - 1) * itemConf.markRadius;
				  underbnY = indentYMark - itemConf.markRadius - 4;
				  
				  indentYMarkText = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio) * itemConf.markRadius + (verticalRatio - 1) * itemConf.marginBottom + (verticalRatio - 1) * itemConf.markRadius;
				  mark = paper.circle(indentX,indentYMark,itemConf.markRadius);
				  indentX +=  5 + itemConf.markRadius;
				  break;
				default:
                    if (conf.position === "left") {
                        indentX = conf.marginLeft + horizonRatio * itemConf.marginLeft + (horizonRatio - 1) * (
                        itemConf.markWidth + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
                    } else {
                        indentX = conf.canvasWidth - 10 - markTextWidh - horizonRatio * itemConf.marginLeft + (horizonRatio - 1) * (
                        itemConf.markWidth + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
                    }

				    underbnX = indentX - 2;
					indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
					underbnY = indentYMark - 4;
					
					indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
					mark = paper.rect(indentX, indentYMark , itemConf.markWidth, itemConf.markHeight);
					indentX +=  5 + itemConf.markWidth;
			}
			// 动态设置颜色和文本
			//var color = Color.getColor(this.LegendSource[i], this.owner.colorDict, this.owner.colorArray);
			//获得legendColor或主题颜色
			var color = Color.getColor(this.LegendSource[i], this.owner.colorDict, this.owner.colorArray, this.owner.themeColor,this.defaults.colorMode);
			mark.attr({
				"text-anchor":"start",
				"stroke":color,
				"stroke-opacity":0.5,
				"fill":color,
				"fill-opacity":this.defaults.opacity
				});
			// 绘制markText
			var markText = paper.text(indentX, itemConf.marginTop, this.LegendSource[i]);
			// hover 事件 
			var st = paper.set();
			st.push(mark);
			st.push(markText);
			var that = this;
			this.LegendSource[i].index = i;
			st.data("obj", this.LegendSource[i]).data("index", i)
	         .hover(function () {
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.highlight(tarObj.text);
	        	 that.fire('hoverIn', tarObj);
	        	 that.defaults.onMouseOver(tarObj);
	         },function () {
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.lowlight(tarObj.text);
	        	 that.fire('hoverOut', tarObj);
	        	 that.defaults.onMouseOut(tarObj);
	         }).click(function () {
	        	 if (DataViz.isMobile) return null;
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.fire('click', tarObj);
        		 that.defaults.onClick(tarObj);
	         }).touchstart(function () {
	        	 var tarObj = {text: this.data("obj"), index: this.data("index")};
	        	 that.fire('click', tarObj);
        		 that.defaults.onClick(tarObj);
	         });
			markText.attr({
				"text-anchor":"start",
				"y": indentYMarkText,
				"font-family" : itemConf.fontFamily,
				"font-size" : itemConf.fontSize,
				"font-weight" : itemConf.fontWeight,
				"fill" : itemConf.fontColor
			}).attr(this.defaults.legendStyle && this.defaults.legendStyle);
			// 折行
			var markBBoxHeight = mark.getBBox().height;
			textBoxWidth = markText.getBBox().width;
			textWidthArr.push(textBoxWidth);
			textBoxWidth = _.sortBy(textWidthArr, function(num){ return num; }).reverse()[0];
			if(indentYMark + markBBoxHeight > conf.canvasHeight) {
				verticalRatio = 1;
				horizonRatio += 1;

				switch(itemConf.markStyle)
				{
					case "rect":
					  indentX = conf.marginLeft + horizonRatio * itemConf.marginLeft + (horizonRatio - 1) * (
						itemConf.markWidth + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);  
					  underbnX = indentX - 2;
					  indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
					  underbnY = indentYMark - 4;
					  
					  indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
						mark.attr({
							"x":indentX,
							"y":indentYMark
						});
						indentX +=  5 + itemConf.markWidth;
					  break;
					case "circle":
					  indentX = conf.marginLeft + horizonRatio *(itemConf.marginLeft + itemConf.markRadius)+ (horizonRatio - 1) * (
						2*itemConf.markRadius + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);
					  underbnX = indentX - itemConf.markRadius - 2;
					  indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio) * itemConf.markRadius + (verticalRatio - 1) * itemConf.marginBottom + (verticalRatio - 1) * itemConf.markRadius;
					  underbnY = indentYMark - itemConf.markRadius  - 4;
					  
					  indentYMarkText = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio) * itemConf.markRadius + (verticalRatio - 1) * itemConf.marginBottom + (verticalRatio - 1) * itemConf.markRadius;
						mark.attr({
							"cx":indentX,
							"cy": indentYMark
						});
						indentX +=  5 + itemConf.markRadius;
					  break;
					default:
						indentX = conf.marginLeft + horizonRatio * itemConf.marginLeft + (horizonRatio - 1) * (
								itemConf.markWidth + 5 + (textBoxWidth < markTextWidh ? markTextWidh : textBoxWidth) + itemConf.marginBottom);  
							  underbnX = indentX - 2;
							  indentYMark = conf.marginTop + verticalRatio * itemConf.marginTop + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
							  underbnY = indentYMark - 4;
							  
							  indentYMarkText = conf.marginTop + verticalRatio * (itemConf.marginTop) + itemConf.markHeight/2 + (verticalRatio - 1) * itemConf.markHeight + (verticalRatio - 1) * itemConf.marginBottom;
								mark.attr({
									"x":indentX,
									"y":indentYMark
								});
								indentX +=  5 + itemConf.markWidth;
				}
				markText.attr({
					"x":indentX,
					"y":indentYMarkText
				});
				verticalRatio += 1;
			} else {
				verticalRatio += 1;
			}
			
			var markBox = mark.getBBox(),
				markTextBox = markText.getBBox();
			unberbnWidth = markBox.width + 5 + markTextBox.width + 4;
			underbnHeight = markBox.height + 8;
			underMark = paper.rect(underbnX, underbnY, unberbnWidth, underbnHeight)
            .attr({"stroke-width":"0","fill":itemConf.mouseOverBgColor})
            .hide().toBack();
			this.underBn[this.LegendSource[i]] = underMark;
			this.legendText[this.LegendSource[i]] = markText;
		}
  };
  
  /**
   * 高亮
   * @param name
   */
  Legend.prototype.highlight = function (name) {
	  var underBnKeys = _.keys(this.underBn);
	  if(name && _.contains(underBnKeys, name + "")){
		  this.underBn[name].show();
		  this.legendText[name].attr({
			  "fill" : this.defaults.item.mouseOverColor
		  });
	  }
  };
  /**
   * 取消高亮
   * @param name
   */
  Legend.prototype.lowlight = function (name) {
	  var that = this;
	  _.each(this.underBn,function(item, index) {
		  item.hide && item.hide();
	  });
	  _.each(this.legendText,function(item, index) {
		  item.attr && item.attr({
			  "fill" : that.defaults.item.fontColor
		  });
	  });
	  if(this.lastClickText) {
		  this.underBn[this.lastClickText].show();
		  this.legendText[this.lastClickText].attr({
			  "fill" : this.defaults.item.mouseOverColor
		  });
	  }
  };
  /**
   * 鼠标点击保持高亮
   * @param name
   */
  Legend.prototype.holdLight = function (name) {
	  if(name == this.lastClickText) {
		  name && this.underBn[name].hide();
		  name && this.legendText[name].attr({
			  "fill" : this.defaults.item.fontColor
		  });
		  this.lastClickText = undefined;
	  } else {
		  this.lastClickText = undefined;	
		  this.lowlight();
		  name && this.underBn[name].show();
		  name && this.legendText[name].attr({
			  "fill" : this.defaults.item.mouseOverColor
		  });
		  this.lastClickText = name;
	  }
  };
  /**
   * 取消保持高亮
   */
  Legend.prototype.holdLightCancel = function () {
	  this.lastClickText = undefined;
	  this.lowlight();
  };
  return Legend;
});
