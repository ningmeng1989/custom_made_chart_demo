(function(name, definition) {
	if (typeof define === 'function') { // Module
		define(definition);
	} else { // Assign to common namespaces or simply the global object (window)
		this[name] = definition(function(id) {
			return this[id];
		});
	}
})('Title', function(require) {

	var DataViz = require('DataViz');
	
	/**
     * @class Title
     * Title模块,用来设置图表的标题信息
	 *
     * example:
	 * 
	 *		title	:	{
	 *				marginTop:	5,
	 *				marginLeft:"45%",
	 *				text 	:	"主标题",
	 *				fontFamily : "Microsoft YaHei",
	 *				fontSize : "16px",
	 *				fontWeight : "bold",
	 *				color	:	"#333",
	 *				subTitle: {
	 *					marginTop	:	5,
	 *					marginLeft	:	"60%",
	 *					text 		:	"子标题",
	 *					fontFamily : "Microsoft YaHei",
	 *					fontSize : "14px",
	 *					fontWeight : "normal"
	 *				}
	 *			}
	 */
	var Title = DataViz.extend(DataViz.Chart, {
		initialize : function(node, options) {
		  	this.type = "Title";
			// title default styles
		  	/**
		     * @cfg {String} [position = "top"]
		     * 标题相对于图标的位置
		     * 
		     * - 'top'	上方
		     * - 'bottom'	下方
		     * 
		     * 值为top时标题在图表的上方，为bottom时在图表的下方
		     */
			this.defaults.position = "top";
	        /**
		     * @cfg {Number} [marginTop=0]
		     * 标题与页面顶端的距离，支持百分比形式
		     */
			this.defaults.marginTop = 0;
			/**
		     * @cfg {Number} [marginLeft=undefined]
		     * 标题与页面左端的距离，支持百分比形式，默认undefined时居中
		     */
			this.defaults.marginLeft = undefined;
			/**
		     * @cfg {Number} [marginBottom = 0]
		     * 标题与图表间的距离
		     */
			this.defaults.marginBottom = 0;
			/**
		     * @cfg {String} [text="主标题"]
		     * 标题文本内容
		     */
			this.defaults.text = options.caption || "主标题";
			/**
		     * @cfg {String} [fontFamily="Microsoft YaHei"]
		     * 标题字体
		     */
			this.defaults.fontFamily = "Microsoft YaHei";
			/**
		     * @cfg {String} [fontSize="16px"]
		     * 标题字号
		     */
			this.defaults.fontSize = "16px";
			/**
		     * @cfg {String} [fontWeight="normal"]
		     * 标题weight
		     */
			this.defaults.fontWeight = "normal";
			/**
		     * @cfg {String} [color="#333"]
		     * 标题文本颜色
		     */
			this.defaults.color = "#333";
			/**
		     * @cfg {Object} subTitle
		     * 子标题设置，包含但不仅限于如下属性
		     * @cfg {Number} [subTitle.marginTop = 5]
		     * 子标题与主标题距离，支持百分比
		     * @cfg {Number} [subTitle.marginLeft]
		     * 子标题与页面左端距离，支持百分比，默认居中
		     * @cfg {String} [subTitle.text="副标题"]
		     * 子标题文本内容
		     * @cfg {String} [subTitle.fontFamily = "Microsoft YaHei"]
		     * 子标题字体
		     * @cfg {String} [subTitle.fontSize = "14px"]
		     * 子标题字号
		     * @cfg {String} [subTitle.fontWeight = "normal"]
		     * 子标题weight
		     * @cfg {String} [subTitle.color="#999"]
		     * 子标题文本颜色
		     */
			this.defaults.subTitle = undefined;
			this.setOptions(options);
		}
	});

	
	// 绘制
	Title.prototype.render = function() {

		this.defaults.width = this.canvas.width;
		this.defaults.height = this.canvas.height;
		// config subTitle
		if(this.defaults.subTitle) {
			this.defaults.subTitle.percentageW = this.defaults.subTitle.percentageW; 
			this.defaults.subTitle.percentageH = this.defaults.subTitle.percentageH; 
			
			this.defaults.subTitle.marginTop = this.defaults.subTitle.marginTop || 5;
			this.defaults.subTitle.text = this.defaults.subTitle.text || "副标题";
			this.defaults.subTitle.fontFamily = this.defaults.subTitle.fontFamily || "Microsoft YaHei";
			this.defaults.subTitle.fontSize = this.defaults.subTitle.fontSize || "14px";
			this.defaults.subTitle.fontWeight = this.defaults.subTitle.fontWeight || "normal";
			this.defaults.subTitle.color = this.defaults.subTitle.color || "#999";
			// 支持百分比
			if((this.defaults.subTitle.marginLeft + "").indexOf("%") > -1 || this.defaults.subTitle.percentageW) {
				this.defaults.subTitle.percentageW = this.defaults.subTitle.percentageW ||  this.defaults.subTitle.marginLeft;
				this.defaults.subTitle.marginLeft = this.defaults.subTitle.percentageW.replace("%","") / 100 * this.defaults.width;
			}
			if((this.defaults.subTitle.marginTop + "").indexOf("%") > -1 || this.defaults.subTitle.percentageH) {
				this.defaults.subTitle.percentageH = this.defaults.subTitle.percentageH ||  this.defaults.subTitle.marginTop;
				this.defaults.subTitle.marginTop = this.defaults.subTitle.percentageH.replace("%","") / 100 * this.defaults.height;
			}
		}
		
		var conf = this.defaults;
		var textAnchor;
		switch(conf.marginLeft) {		
	    	case "0%": textAnchor = "start";break;
		    case "50%": textAnchor = "middle";break;
		    case "100%": textAnchor = "end";break;
		}
		// 支持百分比
		conf.marginTop = (conf.marginTop + "").indexOf("%") > -1 ? conf.marginTop.replace("%","") / 100 * conf.height :  conf.marginTop;//对于固定值根据比例修改top值*ratio[0]
		conf.marginLeft = (conf.marginLeft + "").indexOf("%") > -1 ? conf.marginLeft.replace("%","") / 100 * conf.width :  conf.marginLeft;
		// 绘制main title 
		var mainTitleX = conf.marginLeft || 0; // mainTitle'X
		var mainTitleY = conf.marginTop + 3;// mainTitle'Y
		var mainTitle = this.canvas.text(mainTitleX,mainTitleY,conf.text);

		var mainTitleAttr = {
			"text-anchor":textAnchor,
			"y" : mainTitleY,
			"font-family" : conf.fontFamily,
			"font-size" : conf.fontSize,
			"font-weight" : conf.fontWeight,
			"fill": conf.color
		};
		mainTitle.attr(mainTitleAttr);
		var baseHeightMainTitle = mainTitle.getBBox().height; 
		mainTitleY += baseHeightMainTitle / 2;
		mainTitle.attr({"y" : mainTitleY});
		

		// 设置 main title textAlign 如果marginLeft = undefined, 则默认居中
		if(conf.marginLeft == undefined) {
			//mainTitleX = (conf.width - mainTitle.getBBox().width) / 2;
			mainTitleX = (conf.width) / 2;
			mainTitle.attr({ "x": mainTitleX});
		} 
		// 绘制sub title
		if(conf.subTitle) {
			var subConf = conf.subTitle;
			var subTitleX = subConf.marginLeft || 0;
			var subTitleY = subConf.marginTop + conf.marginTop + 3 + baseHeightMainTitle;
			var subTitle = this.canvas.text(subTitleX,subTitleY,subConf.text);
			
			var subTitleAttr = {
				"text-anchor":"middle",
				"y" : subTitleY,
				"font-family" : subConf.fontFamily,
				"font-size" : subConf.fontSize,
				"font-weight" : subConf.fontWeight,
				"fill": subConf.color
			};
			subTitle.attr(subTitleAttr);
			var baseHeightSubTitle = subTitle.getBBox().height;  
			subTitle.attr({"y" : subTitleY + baseHeightSubTitle/2 });
			
			// 设置 sub title textAlign 
			if(subConf.marginLeft == undefined) {
				//subTitleX = (conf.width - subTitle.getBBox().width) / 2; 
				subTitleX = (conf.width) / 2; 
				subTitle.attr({ "x" : subTitleX});
			}
			this.canvas.rect(0,subTitleY + baseHeightSubTitle ,conf.width,conf.marginBottom)
			.attr({"stroke-opacity" : 0});
		} else {
			this.canvas.rect(0,conf.marginTop + 3 + baseHeightMainTitle,conf.width,conf.marginBottom)
			.attr({"stroke-opacity" : 0});
		}
	};

	return Title;
});