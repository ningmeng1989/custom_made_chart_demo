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
})('TagcloudChart', function (require) {

	var DataViz = require('DataViz');
	var Color = require("Color");
	/**
     * @class Tagcloud
	 * @extends DataViz.Chart
     * 标签云(Tagcloud)通常用于展现不同权重标签的排列关系。
     * 
     * <font color='red'>  
     * 注：本图不支持设置Legend 
     * </font>
     * 
	 *		@example
	 *			<script>
     *				requirejs(["Tagcloud", "Loading", "DataViz"], function (Tagcloud, Loading, DataViz) {
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
	 *			      	var tagcloud = new Tagcloud("chart",{
	 *			      		chart	:	{
	 *			      			width		:	800,
	 *			   	       	 	height		:	500
	 *			      		},
	 *			            title	:	{
	 *							"text" : "部门BBS风云人物"
	 *						},
	 *						floatTag:{}
	 *			       	});
	 *			      	DataViz.json("tagcloud.json",function(source){
	 *				  	  	tagcloud.setSource(source, {text:0, weight:1, info:2});
	 *				  		tagcloud.render();
	 *			      	});
	 *			    });
     *			</script>
     *
     * <a href="data/tagcloud.json">JSON格式数据</a>
     * 
     * <a href="data/tagcloud.csv">CSV格式数据</a>
     */
	var TagcloudChart = DataViz.extend(DataViz.Chart,{
		initialize : function(node, options) {
			this.type = "TagcloudChart";
			this.node = this.checkContainer(node);
			/**
			 * @cfg {Number} [width=400]
			 * 宽度
			 */
			this.defaults.width = 400;
			/**
			 * @cfg {Number} [height=400]
			 * 高度
			 */
			this.defaults.height = 400;
			/**
			 * @cfg {String} [shape = "circle"]
			 * 外形轮廓
			 * - circle 圆型
			 * - rectangle 矩形
			 */
			this.defaults.shape = "circle";
			/**
			 * @cfg {Number} [rotateAngle=0]
			 * 旋转角度
			 */
			this.defaults.rotateAngle = 0;
		    /**
			 * @cfg {Object} textStyle
			 * 文本样式设置，包含但不仅限于如下属性  
			 * @cfg {String} [textStyle.font-weight = "bold"]  
			 * 设置文本外粗细，斜体等   
			 * @cfg {String} [textStyle.font-family = "Microsoft Yahei"]  
			 * 文本字体  
			 */
		    this.defaults.textStyle = {
		    		"font-family"	:	"Microsoft YaHei",
		    		"font-weight"	:	"bold"
			};
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
	    
	    /**
	     * @event onClick 
	     * 用户自定义单击事件
	     * @param {Object} e
	     *
	     * example:
	     * 
	     *		onClick : function(e){		
	     *			alert(e.toString());
	     * 		}
	     */
		  this.defaults.onClick = function (e) {};
		  
		  /**
	     * @event onMouseOver
	     * 用户自定义mouseover事件
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
	     * @event onMouseOut
	     * 用户自定义mouseout事件
	     * @param {Object} e
	     *
	     * example:
	     * 
	     *		onMouseOut : function(e){		
	     *			alert(e.toString());
	     * 		}
	     */
		  this.defaults.onMouseOut = function (e) {};
		    
		    this.setOptions(options);
		    this.dimension = {};
		    this.weightDomain = 0;
		    this.rad;
		    this.source;
		    this.center = {
		    		x : this.defaults.width / 2.0,
		    		y : this.defaults.height / 2.0
		    };

		    this._setRad();
		  	this.canvas;
		  	this.textSet = [];
		  	//是否调用chooseText或chooseWeight方法
		  	this.isChoosed = false;
		}
	});

	/**
	 * 设置颜色数组
	 * @ignore
	 */
	TagcloudChart.prototype._setColor = function () {
		var customTheme = this.owner.theme;
		this.owner.colorArray = this.owner.colorArray.length == 0 ? 
				Color.getThemeColor(customTheme) : this.owner.colorArray;
	};
	
	/**
	 * 绘制
	 * @ignore
	 */
	TagcloudChart.prototype._layout = function() {
		this._setColor();
		var source = this.source,
			paper = this.canvas,
			floatTag = this.floatTag,
			that = this;
			
		var width = this.defaults.width,
			height = this.defaults.height;
		
		var	textEle = {},
			count = 0,
			radius = 0,
			angle = 0,
			step = 8,
			already_placed_words = [],
			len = source.length >= Math.min(width, height) * 0.3 ? Math.min(width, height) * 0.3 : source.length;
		
		var placeWord = function(){
			while(that._hitTest(textEle, already_placed_words) || that._overBorder(textEle)){
				//碰撞次数大于指定数目，丢弃
				if(count++ > 30){
					return;
				}
				//碰撞后调整
				radius += step;
				angle += 1 * step;
				if(angle > 1000000000){
					angle = 0;
				}
				that._adjustPosition(that.defaults.shape);
				textEle.attr("x", left_adjust);
				textEle.attr("y", top_adjust);
				//得到转换后的文本标签的中心坐标
				textEle.center = {
						x : (textEle.getBBox().x + textEle.getBBox().x2) / 2,
						y : (textEle.getBBox().y + textEle.getBBox().y2) / 2
				};
				that._getCoordinate(textEle);
			}
		};
		
		for(var i = 0; i < len; i++){
			var tarObj = source[i];
			textEle = paper.text(width/2, height/2, source[i][that.dimension.text])
				.data('obj', tarObj)
				.attr(that.defaults.textStyle)
				.attr({'font-size' : this._getWeight(i), 'fill' : this._getColor(tarObj)});
			textEle.text = source[i][that.dimension.text];
			textEle.weight = source[i][that.dimension.weight];
			textEle.hover(function(){
				floatTag && floatTag.show(this.data('obj'));
				this.attr({"cursor":"pointer"});
				if(!that.isChoosed){
					this.attr({"opacity":0.5});
				}
				that.defaults.onMouseOver(this.data('obj'));
			},function(){
				floatTag && floatTag.hide();
				this.attr({"cursor":"auto"});
				if(!that.isChoosed){
					this.attr({"opacity":1});
				}
				that.defaults.onMouseOut(this.data('obj'));
			}).click(function(){
				if (DataViz.isMobile) return null;
				var obj = this.data('obj');
				that.defaults.onClick(obj);
			}).touchstart(function(){
				var obj = this.data('obj');
				that.defaults.onClick(obj);
			});
			textEle.height = textEle.getBBox().height - 5;
			textEle.width = textEle.getBBox().width -  5;
			textEle.center = {
					x : (textEle.getBBox().x + textEle.getBBox().x2) / 2,
					y : (textEle.getBBox().y + textEle.getBBox().y2) / 2
			};
			this.textSet.push(textEle);
			if(i == 0){
				textEle.center.y = textEle.center.y + 5;
			}
			this._axisRotate(textEle);
			this._getCoordinate(textEle);
			placeWord();
			if(count < 30){
				already_placed_words.push(textEle);
			}else{
				textEle.hide();
			}
			radius = 0;
			count = 0;
		};
	};
		
	/**
	 * 坐标旋转
	 * @param word
	 * @ignore
	 */
	TagcloudChart.prototype._axisRotate = function(word){
		var sign = Math.random() - 0.5;
		sign = sign / Math.abs(sign);
		if(this.defaults.rotateAngle === 0){
			word.angle = 0;
		}else if(typeof this.defaults.rotateAngle === 'undefined'){
			word.angle = (sign * (word.id % 3 === 0 ?  0 : (word.id % 3 === 1 ? 30 : 45))) * Math.PI / 180;
		}else{
			word.angle = (sign * (word.id % 2 === 0 ?  0 : this.defaults.rotateAngle)) * Math.PI / 180;
		}
		word.transform("r" + word.angle * 180 / Math.PI);
	};
	
	/**
	 * 获取当前矩形框四个点的坐标
	 * @param word
	 * @ignore
	 */
	TagcloudChart.prototype._getCoordinate = function(word){
		word.p = [];
		word.diagonal = Math.sqrt(Math.pow(word.width, 2) + Math.pow(word.height, 2)) / 2;
		
		var angle = Math.asin(word.height / 2 / word.diagonal);
		
		word.angle_p0_rotate = angle  + word.angle;
		word.angle_p1_rotate = angle  - word.angle;
		
		var p0X = word.diagonal * Math.cos(word.angle_p0_rotate),
		p0Y = word.diagonal * Math.sin(word.angle_p0_rotate),
		p1X = word.diagonal * Math.cos(word.angle_p1_rotate),
		p1Y = word.diagonal * Math.sin(word.angle_p1_rotate);
		
		word.p[0] = {
				x : word.center.x - p0X,
				y : word.center.y - p0Y
		};
		
		word.p[1] = {
				x : word.center.x + p1X,
				y : word.center.y - p1Y
		};
		
		word.p[2] = {
				x : word.center.x + p0X,
				y : word.center.y + p0Y
		};
		
		word.p[3] = {
				x : word.center.x - p1X,
				y : word.center.y + p1Y
		};
	};
		
	/**
	 * 碰撞检测
	 * @param word_undetection
	 * @param already_placed_words
	 * @returns {Boolean}
	 * @ignore
	 */
	TagcloudChart.prototype._hitTest = function(word_undetection, already_placed_words){
		var crossCount = 0; //中心点与（0,0）位置的射线与矩形的交点数量，交点为奇数，则存在嵌套情况，交点为偶数，则不相交
		
		var crossMul = function(v1,v2){
			return   v1.x*v2.y-v1.y*v2.x;
		};
		var checkCross = function(p1,p2,p3,p4){
			
			var v1={x:p1.x-p3.x,y:p1.y-p3.y},
			v2={x:p2.x-p3.x,y:p2.y-p3.y},
			v3={x:p4.x-p3.x,y:p4.y-p3.y},
			v=crossMul(v1,v3)*crossMul(v2,v3),
			v1={x:p3.x-p1.x,y:p3.y-p1.y},
			v2={x:p4.x-p1.x,y:p4.y-p1.y},
			v3={x:p2.x-p1.x,y:p2.y-p1.y};
			
			return (v<=0&&crossMul(v1,v3)*crossMul(v2,v3)<=0)?true:false;
		};
		
		for(var i = 0; i < already_placed_words.length; i++){
			var distance = Math.sqrt(Math.pow((word_undetection.center.x - already_placed_words[i].center.x),2) + Math.pow((word_undetection.center.y - already_placed_words[i].center.y),2));
			if(distance < (word_undetection.diagonal + already_placed_words[i].diagonal)){
				crossCount = 0;
				for(var j = 0; j < 4; j++){
					for(var k = 0; k < 4; k++){
						if (checkCross(word_undetection.p[j%4], word_undetection.p[(j+1)%4] , already_placed_words[i].p[k%4], already_placed_words[i].p[(k+1)%4])) {
							return true;
						}
						//如果中心点相同，则认为重叠，避免嵌套情况发生
						if (checkCross({x:0,y:0}, word_undetection.center , already_placed_words[i].p[k%4], already_placed_words[i].p[(k+1)%4])) {
							crossCount += 1;
						}
					}
					if(crossCount % 2 === 1){
						return true;
					}
				}
			}
		}
		return false;
	};
		
	/**
	 * 越界检测
	 * @param word
	 * @returns {Boolean}
	 * @ignore
	 */
	TagcloudChart.prototype._overBorder = function(word){
		for(var i = 0; i < 4; i++){
			if((word.p[i].x < 0) || (word.p[i].x > this.defaults.width) || (word.p[i].y < 0) || (word.p[i].y > this.defaults.height)){
				return true;
			}
		}
		return false;
	};
		
	/**
	 * 位置调节模式
	 * @param shape
	 * @ignore
	 */
	TagcloudChart.prototype._adjustPosition = function(shape){
		if(shape === "circle"){
			var r = Math.random() * this.rad;
			var j = Math.random() * 2 * Math.PI;
			left_adjust = r * Math.cos(j) + this.defaults.width / 2;
			top_adjust =  r * Math.sin(j) + this.defaults.height / 2;
		}else if(shape === "rectangle"){
			left_adjust = Math.random() * this.defaults.width;
			top_adjust = Math.random() * this.defaults.height;
		}
	};
		
	/**
	 * @method setSource
	 * 数据源加载函数
	 * <a href="index.html#!/guide/Chapter5" style="color:red">请参考用户手册第五章</a>
	 * @param {JSON | CSV} source
	 * @ignore
	 */
	TagcloudChart.prototype.setSource = function(source) {
		var conf = this.defaults;
		this.source = source.source;
		this.dimensions = source.dimensions;
		this.dimensionType = source.dimensionType;
		this.dimensionDomain = source.dimensionDomain;
			
		this.dimension.text = source.dimensions[0];
		this.dimension.weight = source.dimensions[1];
		this.dimension.info = source.dimensions[2];
		
		var weight = this.dimension.weight;
		this.weightDomain = this.dimensionDomain[weight][1] - this.dimensionDomain[weight][0];
		this.source.sort(function(a, b) { if (a[weight] < b[weight]) {return 1;} else if (a[weight] > b[weight]) {return -1;} else {return 0;} });
	};

	/**
	 * @method render
	 * 渲染函数
	 * @ignore
	 */
	TagcloudChart.prototype.render = function() {
		this._layout();
	};
	
	/**
	 * 获取颜色
	 * @param num
	 * @returns
	 * @ignore
	 */
	TagcloudChart.prototype._getColor = function (obj) {
		var conf = this.defaults;
		var specialColor = Color.getSpecialColor(conf.onSpecialColor, obj);
		return specialColor || Color.getColor(obj[this.dimension.text], this.owner.colorDict, this.owner.colorArray);
	};
	
	/**
	 * 计算权重值
	 * @param num
	 * @returns {Number}
	 * @ignore
	 */
	TagcloudChart.prototype._getWeight = function(num){
//		return this.source[num][this.dimension.weight] / this.weightDomain * (this.rad *DataViz.fontRatio / 5 )  + 5;
		return this.source[num][this.dimension.weight] / this.weightDomain * (this.rad / 5 )  + 5;
	};
	
	/**
	 * 计算透明度
	 * @param num
	 * @returns {Number}
	 * @ignore
	 */
	TagcloudChart.prototype._getOpacity = function(num){
		return this.source[num][this.dimension.weight] / this.weightDomain * 1 + 0.5;
	};
	
	/**
	 * 设置显示区域半径
	 * @ignore
	 */
	TagcloudChart.prototype._setRad = function(){
		this.rad = Math.min(this.defaults.width,this.defaults.height)/2;
	};
	
	/**
	 * 设置isChoosed状态
	 * @param is
	 * @ignore
	 */
	TagcloudChart.prototype._setIsChoosed = function(is){
		this.isChoosed = is;
	};
	
	/**
	 * @method chooseText
	 * 以text形式选择标签
	 * @param {Array} array
	 * 待选文本，需与数据源中的text对应
	 * @returns {Boolean}
	 * 若标签云中存在待选文本，返回true，否则返回false
	 */
	TagcloudChart.prototype.chooseText = function(array){
		_.each(this.textSet, function (d) {
			d.attr({"opacity" : 1});
		});
		
		function hideUnchooseNodes (list, texts) {
			var hasText = false;
			_.each(list, function (d) {
				if (!_.contains(texts, d.text)) {
					d.attr({"opacity" : 0.1});
				} else {
					fasText = true;
				}
			});
			that._setIsChoosed(fasText);
			return fasText;
		}
		
		var that = this,
			nodes = [];

		if (_.isArray(array)) {
			nodes = array;
		} else {
			throw new Error("DataViz Error # Type Error : The parameter should be 'Array' type!");
		}
		
		return hideUnchooseNodes(that.textSet, nodes);
	};
	
	/**
	 * @method chooseWeight
	 * 以weight形式选择标签
	 * @param {Array} array
	 * 待选权重值或者权重范围，当参数数组中只有一个值时，即完全与该权重值匹配；当参数数组中为两个值，即筛选这两个值的值域范围内的标签；当参数数组中为多个值时，只取前两个值；
	 * @returns {Boolean}
	 * 若标签云中存在待选权重范围，返回true，否则返回false
	 */
	TagcloudChart.prototype.chooseWeight = function(array){
		_.each(this.textSet, function (d) {
			d.attr({"opacity" : 1});
		});
		
		function hideUnchooseNodes (list, weights, condition) {
			var hasText = false;
			_.each(list, function (d) {
				if (condition(weights, d.weight)) {
					d.attr({"opacity" : 0.1});
				} else {
					fasText = true;
				}
			});
			that._setIsChoosed(fasText);
			return fasText;
		}
		
		var that = this,
			condition,
			nodes = [];
		
		if (_.isArray(array)) {
			switch(array.length) {
			case 0: 
				throw new Error("DataViz Error # Length Error : The parameter's length is 0!");
				break;
			case 1: 
				condition = function (list, target) {
					return !_.contains(list, target);
				};
				break;
			case 2:
			default:
				nodes = _.sortBy(array.slice(0,2), function (num) {
					return Math.max(num);
				});
				condition = function (list, target) {
					return !((target >= list[0]) && (target <= list[1]));
				};
				break;
			}
		} else {
			throw new Error("DataViz Error # Type Error : The parameter should be 'Array' type!");
		}
		
		return hideUnchooseNodes(that.textSet, nodes, condition);
	};
	
	/**
	 * @method restore
	 * 恢复初始状态，即恢复chooseText及chooseWeight的选中状态
	 */
	TagcloudChart.prototype.restore = function(){
		_.each(this.textSet, function (d) {
			d.attr({"opacity" : 1});
		});
		this._setIsChoosed(false);
	};
	
	
	
	return TagcloudChart;
});
