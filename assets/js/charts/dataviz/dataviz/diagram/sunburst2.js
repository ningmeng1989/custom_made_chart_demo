(function (name, definition) {
  if (typeof define === 'function') { 
    define(definition);
  } else { 
    this[name] = definition(function (id) {
      return this[id];
    });
  }
})('SunBurst2Chart', function (require) {
	
	var DataViz = require('DataViz');
	var Color = require('Color');
	
	  var SunBurst2Chart = DataViz.extend(DataViz.Chart, {
		    initialize: function (node, options) {
			  	this.type = "SunBurst2Chart";
			  	this.node = this.checkContainer(node);
			  	
			    this.defaults.width = 800;
			    this.defaults.height = 800;
			    this.defaults.textShowMode = 0;
			    this.defaults.isSorted = false;
			    this.defaults.colorMode = "random2";
			    this.defaults.arcColor = [ '#FFD700', '#FA8072', '#9ACD32', '#6495ED' ];
			    this.defaults.showPercentage = false;
			    this.defaults.decimalFormat = 0;
			    this.defaults.target;
			    
			    this.defaults.arcStyle = {
						'stroke':'#fff',
						'fill-opacity':0.5
		        	};
	        	this.defaults.textStyle = {
	            	'fill':'black',
					'fill-opacity':1,
					'font-size': '16px' 
	        	};
			  	
	            this.formatter.tipFormat = function (obj) {
	                var tpl = '<b>' + 'name' + ':{name}</b><br/>' + 
	                '<b>' + 'size' + ':{size}</b>';
	        	    var tip = tpl.replace('{name}', obj.name);
	        	    tip = tip.replace('{size}', obj.value.toFixed(this.defaults.decimalFormat));
	        	    return tip;
	            };
	            
				this.defaults.tipStyle = {
				        "textAlign": "left",
				        "margin": "auto",
				        "color": "#ffffff",
				        "font-family": "Microsoft Yahei"
				};
				
				this.defaults.onLeafClick = function() {};
				this.defaults.onClick = function() {};
				this.defaults.onDblClick = function() {};
				/**
				 * @event onSpecialColor
				 * 用户自定义特殊扇形区域
				 * @param {Object} e
				 * 
				 * 例如将设置特定名称的扇形颜色
				 * example：  
				 * 		
				 * 		...
				 * 		var title = [{'name':'china','color':'#000'},{'name':'EMM','color':'#FFF'}];
	       		 *		...
	    		 *		onSpecialColor : function (d) {
				 *			for(var i = 0; i < title.length; i++){
	    		 *				if(title[i].name == d.name){
	    		 *					return title[i].color;
	    		 *				}
				 *			}
	    		 *		};
	    		 *		...
				 */
				this.defaults.onSpecialColor = undefined;
			  	
				this.setOptions(options);
				
			  	this.source;
			  	this.colorCount;
			  	this.dimension = {};
			  	this.canvas;
			  	this.drillTag;				//全局记录当前绘制节点，方便后续重绘或者自适应回到当前页面
	  		}
	  });
	  
	/**
	 * 设置颜色数组
	 */
	  SunBurst2Chart.prototype._setColor = function () {
		  var customTheme = this.owner.theme;
		  this.owner.colorArray = this.owner.colorArray.length == 0 ? 
				  Color.getThemeColor(customTheme) : this.owner.colorArray;
	  };
	  
	  /**
	   * 绘制
	   */  
	SunBurst2Chart.prototype._layout = function () {
		  this._setColor();
		  var that = this,
		  	  conf = that.defaults;
		  	  floatTag = this.floatTag,
		  	  width = conf.width,
		      height = conf.height,
		      radius = Math.min(width, height) / 2,
		      x = d3.scale.linear().range([0, 2 * Math.PI]),
		      y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]);
		  
		  that.colorCount = 0;
		  var textStyle = _.clone(conf.textStyle);
		  textStyle['font-size'] = textStyle['font-size']?parseInt(textStyle['font-size']):20;
//		  textStyle['font-size'] = textStyle['font-size']*DataViz.fontRatio;
		  textStyle['font-size'] = textStyle['font-size'];
		  var duration = 1000;
		  var count = 0;
		  
		  function comparator(a, b) {
			  return b.value - a.value;
		  }
		  
		  var sorted = conf.isSorted ? comparator : null;
		
		  var partition = d3.layout.partition()
		    .sort(sorted)
		    .value(function(d) { return d[that.dimension.size]; });
		  
		var arc = d3.svg.arc()
			.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
			.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
			.innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
			.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

		
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
		
		var _color = function(d,i){
			var gradientColor = function(d,i) {
		    	var color;
		    	if(d.depth==1){
		    		color = that._getColor(that.colorCount++);
		    		d.color = color;
		    	}else{
		    		color = findColor(d);
		    		if(!color){
		    			color = 'red';
		    		}
		    		color = d3.rgb(color).darker(d.depth/7);
		    	}
		    	return color.toString(); 
		    	};
		   var randomColor = function(d,i){
		    	return that._getColor(i);
		    };
		   var randomColor2 = function(d,i){
		    	var color = that._getColor(i);
		    	d.color = color;
		    	return d.children?color:d.parent?d3.rgb(d.parent.color).brighter(0.4):color;
		    };
			var customColor = function(d,i){
				var color;
				if(conf.onSpecialColor){
					color = conf.onSpecialColor(d);
					if(color){
						return color;
					}
				}
				if(d.depth==1){
					color = conf.arcColor[count];
					if (typeof color == 'undefined') {
						count = 0;
						color = conf.arcColor[count];
					}
					d.color = color;
					count++;
				}else{
					color = findColor(d);
					if(!color){
						color = conf.arcColor[count];
						count++;
					}
					color = d3.rgb(color).darker(d.depth/7);
				}
			    	
				return color; 
			};
			var ret;
    		switch(conf.colorMode){
    		case 'random':
    			ret = randomColor(d,i);
    			break;
    		case 'default':
    		case 'random2':
    			ret = randomColor2(d,i);
    			break;
    		case 'gradient':
    			ret = gradientColor(d,i);
    			break;
    		case 'custom':
    			ret = customColor(d,i);
    			break;
    			default:
    				ret = randomColor2(d,i);
    		}
    		
			return ret;
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
				color = d3.rgb(color).darker(d.depth / 7);
			}
			return color;
		};
		
		var nodes = partition.nodes(this.source);
		var c,arcEle,name,ro,a,b,nameStr,textLabel;
		for(var i = 0;i<nodes.length;i++){
			var colorIndex = that.colorIndex;
			if(colorIndex){
				colorIndex = colorIndex + i;
			}else{
				colorIndex = i;
			}
			
			c = arc(nodes[i]);
			arcEle = that.canvas.path(c).
			translate(conf.width / 2 , conf.height / 2)
			//.animate({path : c}, 300)
			.attr({
		        "fill": gradientColor(nodes[i], colorIndex),
		        "fill-opacity": 0.5,
		        "stroke": "#fff",
		        "stroke-opacity": 1
			});
			
			arcEle.data('subTree',nodes[i]).data('colorIndex',i).click(
				function(){
					if (DataViz.isMobile) return null;
					if (conf.onClick) {
						conf.onClick(this.data('subTree'));
						this.drillTag = this.data('subTree')[that.dimension.name];
					}
					if (this.data("subTree").children) {
						var data = this.data("subTree");
						that.colorIndex = this.data('colorIndex');
						if(data.y==0){
							if(data.parent){
								that.setSourceUpdate(data.parent);
							}else{
								return;
							}
						}else{
							that.setSourceUpdate(data);
						}
						that.render();
					} else {
						conf.onLeafClick(this.data('subTree'));
					}
			}).touchstart(
					function(){
						if (conf.onClick) {
							conf.onClick(this.data('subTree'));
							this.drillTag = this.data('subTree')[that.dimension.name];
						}
						if (this.data("subTree").children) {
							var data = this.data("subTree");
							that.colorIndex = this.data('colorIndex');
							if(data.y==0){
								if(data.parent){
									that.setSourceUpdate(data.parent);
								}else{
									return;
								}
							}else{
								that.setSourceUpdate(data);
							}
							that.render();
						} else {
							conf.onLeafClick(this.data('subTree'));
						}
				}).dblclick(function () {
				if (conf.onDblClick) {
					conf.onDblClick(this.data('subTree'));
				}
			}).mouseover(function(d) {
				floatTag && floatTag.show(this.data('subTree'), {x : d.x, y : d.y});
			}).mouseout(function() {
				floatTag && floatTag.hide();
			});
			arcEle.attr(conf.arcStyle);
			if (x(nodes[i].dx) * 180 / Math.PI > 4) {
				textEle = that.canvas.text();
				if (nodes[i][that.dimension.name] == "") {
					nodes[i][that.dimension.name] = " ";
				}
				switch (conf.showPercentage) {
				case false:
					switch (conf.textShowMode) {
					case 0:
						textLabel = nodes[i][that.dimension.name].length>5 
						? nodes[i][that.dimension.name].substring(0,5)+".."
						: nodes[i][that.dimension.name];
						break;
					case 1:
						textLabel =  nodes[i][that.dimension.name];
						break;
					}
					break;
				case true:
					switch (conf.textShowMode) {
					case 0:
						textLabel = nodes[i][that.dimension.name].length>5 
						? nodes[i][that.dimension.name].substring(0,5)+".."+" "+(nodes[i].dx*100).toFixed(conf.decimalFormat)+"%"
						: nodes[i][that.dimension.name]+" "+(nodes[i].dx*100).toFixed(conf.decimalFormat)+"%";
						break;
					case 1:
						textLabel = nodes[i][that.dimension.name]+" "+(nodes[i].dx*100).toFixed(conf.decimalFormat)+"%";
						break;
					}
					break;
				}
			      name = textEle.attr("text", textLabel).attr(textStyle);
			    
			      ro = x(nodes[i].x+ nodes[i].dx/2)* 180 / Math.PI - 90;
			      a = ro;
			      if(ro+90>180){
			    	  a = ro-180;
			      }
			      b =y(nodes[i].y)+y(nodes[i].dy)/2+textEle.getBBox().width/2;
			      nameX = b * Math.cos(ro* Math.PI / 180);
			      nameY = b * Math.sin(ro* Math.PI / 180);
			      //中心的文字需要居中显示
			      if(nodes[i].y==0){
			    	  nameStr = "T" + conf.width  / 2 + "," + conf.height / 2;
			      }else{
			    	  nameStr = "T" + conf.width  / 2 + "," + conf.height / 2 + "R" + a + "T" + nameX + "," + nameY;
			      }
			      
			      name.transform(nameStr).data('subTree',nodes[i]).data('colorIndex',i).click(
						function(){
							if (DataViz.isMobile) return null;
							if (conf.onClick) {
								conf.onClick(this.data('subTree'));
							}
							if (this.data("subTree").children) {
								var data = this.data("subTree");
								that.colorIndex = this.data('colorIndex');
								if(data.y==0){
									if(data.parent){
										that.setSourceUpdate(data.parent);
									}else{
										return;
									}
								}else{
									that.setSourceUpdate(data);
								}
								that.render();
							} else {
								conf.onLeafClick(this.data('subTree'));
							}
						})
						.touchstart(
						function(){
							if (conf.onClick) {
								conf.onClick(this.data('subTree'));
							}
							if (this.data("subTree").children) {
								var data = this.data("subTree");
								that.colorIndex = this.data('colorIndex');
								if(data.y==0){
									if(data.parent){
										that.setSourceUpdate(data.parent);
									}else{
										return;
									}
								}else{
									that.setSourceUpdate(data);
								}
								that.render();
							} else {
								conf.onLeafClick(this.data('subTree'));
							}
						}).dblclick(function () {
							if (conf.onDblClick) {
								conf.onDblClick(this.data('subTree'));
							}
						}).mouseover(function (d) {
							floatTag && floatTag.show(this.data('subTree'), {x : d.x, y : d.y});
						}).mouseout(function () {
							floatTag && floatTag.hide();
						});
			 }
		}
		if (typeof conf.target == 'string' && !this.isRendered) {
			this.isRendered = true;
			this.drill(conf.target);
		}
	  };
	  /**
	   * 模拟鼠标点击API，产生钻取效果
	   */
	  SunBurst2Chart.prototype.drill = function(msg){
		  var index =[];
		  	  id = ".rvml";
		  l= $(id).length;
		  var temp= $(id);
		  for (var i = 0; i < l; i++){
			  if(temp[i].string == msg){
				  index.push(temp[i]);
			  }
		  }
		  if (index.length == 1) {
			  index[0].click();
			  this.drillTag = msg;
		  }else{
			  alert("注意：数据中包含多个或没有("+msg+")标签节点");
		  }
		  
	  };  
	  
	  SunBurst2Chart.prototype.setSource = function (source) {
		this.source = source.source;
		this.dimensions = source.dimensions;
		this.dimension = {};	
		this.dimension.ID = this.dimensions[0];
		this.dimension.name = this.dimensions[1];
		this.dimension.size = this.dimensions[2];
		this.dimension.parentID = this.dimensions[3];
		this.dimension.info = this.dimensions[4];
	};
	
	SunBurst2Chart.prototype.setSourceUpdate = function (source) {
		this.source = source;
	};
	
	SunBurst2Chart.prototype.render = function () {
		this.canvas.clear();
		this._layout();
	};
	  
	return SunBurst2Chart;
});