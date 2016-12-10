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
})('Color',function (require) {
	
	var DataViz = require("DataViz");
	
	var Color = function () {};
	
	var htmlColorArr = ["aqua", "black", "blue", "fuchsia",
	                    "gray", "green", "lime", "maroon", 
	                    "navy", "olive", "purple", "red", 
	                    "silver", "teal", "white", "yellow"];
	
    /**
     * 十六进制颜色值的正则表达式
     * @ignore
     */
    DataViz.colorReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    
    /**
     * 检测当前颜色字符串
     */
    function colorDetect (colorStr) {
    	if(colorStr) {
    		if(colorStr.indexOf('#') === 0) {
        		return "hex";
        	} else if (colorStr.indexOf('rgba') === 0) {
        		return "rgba";
        	} else if (colorStr.indexOf('rgb') === 0) {
        		return "rgb";
        	} else if (colorStr.indexOf('hsb') === 0) {
        		return "hsb";
        	} else if (colorStr.indexOf('hsl') === 0) {
        		return "hsl";
        	} else if (_.indexOf(htmlColorArr, colorStr) != -1) {
        		return "htmlColor";
        	} 
    	}
    	return undefined;
    };
    /**
     * RGB颜色转换为16进制
     * {String} rgb RGB颜色
     */
    function rgbToHex (rgb) {
        if(/^(rgb|RGB)/.test(rgb)){
            var aColor = rgb.replace(/(?:\(|\)|rgba|rgb|RGB)*/g,"").split(",");
            var strHex = "#";
            for(var i=0; i < 3; i++){
                var hex = Number(aColor[i]).toString(16);
                if(hex === "0"){
                    hex += hex;       
                }
                strHex += hex;
            }
            if(strHex.length !== 7){
                strHex = rgb;       
            }
            return strHex;
        }else if(DataViz.colorReg.test(rgb)){
            var aNum = rgb.replace(/#/,"").split("");
            if(aNum.length === 6){
                return rgb;       
            }else if(aNum.length === 3){
                var numHex = "#";
                for(var i=0; i<aNum.length; i+=1){
                    numHex += (aNum+aNum);
                }
                return numHex;
            }
        }else{
            return rgb;       
        }
     };
     
    /**
     * 16进制颜色转为RGB格式
     * @param {String} hex 16进制颜色
     * @ignore
     */
     function hexToRgb (hex) {
        var sColor = hex.toLowerCase();
        if(sColor && DataViz.colorReg.test(sColor)){
            if(sColor.length === 4){
                var sColorNew = "#";
                    for(var i=1; i<4; i+=1){
                        sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));       
                    }
                    sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for(var i=1; i<7; i+=2){
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));       
            }
            return "RGB(" + sColorChange.join(",") + ")";
        }else{
            return sColor;       
        }
     };
	
    /**
     * 获取当前主题的颜色配置
     * @return {Array} 颜色参数列表
     */
    function getThemeColor (customTheme) {
        var theme = DataViz.Theme;
        var color = undefined;
        if(DataViz.instances[0]) {
        	color = theme.get("COLOR_ARGS", DataViz.instances[0].node, DataViz.code, customTheme);
        } else {
        	color = theme.get("COLOR_ARGS", undefined, DataViz.code, customTheme);
        }
        
        return color;
    };
    
    /**
     * @method setColor
	 * 根据colorMode设置颜色模式
	 * @param {Number} index 颜色序列
	 * @returns
	 */
    function setColor (colorMode, colorDicArr, count, customTheme) {  
		switch(colorMode){
		case "random":
			return this.getThemeColor(customTheme);
			break;
		case "discrete":
			var targetColorArr = [];
			for ( var i = 0; i < count; i++) {
				var colorFunc = this.getDiscreteColor();
				targetColorArr.push(colorFunc(i));
			}
			return targetColorArr;
			break;
		case "custom":
			if (colorDicArr) {
				var newColorArr = [],
					tempArr = [];
				
				_.each(colorDicArr, function(d, i){
					tempArr.push(d);
					if (i % 2 === 1) {
						newColorArr.push(tempArr); tempArr = [];
					} 
				});
				return newColorArr;
			} else {
				throw new Error("DataViz Error # Color Error : Please specify the legendColor.");
			}
			break;
		case "gradient":
			if (colorDicArr) {
				var customColorArray = [];
		    	_.each(colorDicArr, function(obj) {
		    		customColorArray.push(obj.color);
				});
				var gradientColor = this.gradientColor(customColorArray,
					"special");
				var percent = 1 / count;
				var gotColors = [];
				for ( var i = 0; i < count; i++) {
					gotColors.push(gradientColor(i * percent));
				}
				var midderNum = Math.floor(count / 2);
				var colorFunc = function(num) {
					return num % 2 === 0 ? gotColors[midderNum
							+ num / 2] : gotColors[midderNum
							- (num + 1) / 2];
				};
				var targetColorArr = [];
				for ( var i = 0; i < gotColors.length; i++) {
					targetColorArr.push(colorFunc(i));
				}
				return targetColorArr;
			} else {
				throw new Error("DataViz Error # Color Error : Please specify the legendColor.");
			}
			break;
		default:
			return this.getThemeColor(customTheme);
		}
	};
	
    /**
	 * 根据颜色序列获取单个颜色
	 * @param {Number} index 颜色序列
	 * @returns
	 */
    function _getColor (index, colorArray) {
		var color = colorArray;
		var length = color.length;
		var t = index % ( 2 *length);
		var i = (t % 2 == 0) ? t / 2 :(t - 1) / 2;
		var k = (index) % 2;
		return (!color[i][k] || color[i][k].length == 1) ? colorArray[index] : color[i][k];
	};
	
    /**
	 * 根据颜色序列获取单个颜色
	 * @param {Number} index 颜色序列
	 * @returns
	 */
    function getColor (name, colorDic, colorArr, isInterval, intervalDefaultColor) { 
    	if (isInterval && _.isNumber(name)) {
    		var ranges = _.pluck(colorDic, "name");
    		for (var i = 0, l = ranges.length; i < l; i++) {
    			var d = ranges[i];
    			var tempStrArr = d.split("-"),
    				startTemp = tempStrArr[0],
    				endTemp = tempStrArr[1];
    			var start = Number(startTemp.substring(startTemp.indexOf("[") + 1, startTemp.length));
    			var end = Number(endTemp.substring(0, endTemp.indexOf("]")));
    			if (name >= start && name <= end) {
    				return colorDic[i].color;
    			}
    		}
    		return intervalDefaultColor || "black";
    	}
		var color;
		var temp = _.where(colorDic, {name : name});
		if (temp.length && Color.colorDetect(temp[0].color)) {
			color = temp[0].color;
		} else {
			//针对legendColor不全，isInterval用来保存主题颜色
			if ( intervalDefaultColor == "custom"){
				color = _getColor(colorDic.length, isInterval);
			} else {
				color = _getColor(colorDic.length, colorArr);
			}
			colorDic.push({name : name, color : color});
		}
		return color;
	};
	
	/**
	 * 如果用户定义了onSpecialColor，获取颜色
	 */
    function getSpecialColor (onSpecialColor, obj) {
    	var c = undefined;
    	if(onSpecialColor) {
    		var tempC = onSpecialColor(obj);
        	var rst = Color.colorDetect(tempC);
        	if(rst) {
        		c = tempC;
        	}
    	}
    	return c;
	};
	
    /**
     * 根据当前主题的颜色配置方案，获取生成离散颜色的函数
     * @return {Function} 离散函数
     * @ignore
     */
    function getDiscreteColor () {
        var color = this.getThemeColor();
        if (!_.isArray(color)) {
        	throw new Error("DataViz Error # Color Error : The color should be Array.");
        }
        var colorCount = color.length;
        var gotColor = [];

        if (_.isArray(color[0])) {
            for (var i = 0, l = color[i].length; i < l; i++) {
                gotColor.push(color[i][0]);
            }
        } else {
            gotColor = color;
        }

        return function (num) {
            return gotColor[num % colorCount];
        };
    };
    
    /**
     * 获取渐变颜色，用于生成渐变效果
     * @param {Array | Number} color 颜色数组或主题序列
     * @param {String} method 生成渐变色的方法，默认值为normal。如果为normal将采用D3的interpolateRgb算法，如果为special，则用Rapheal的HSB算法
     */
    function gradientColor (color, method) {
    	var colorArray = [];
    	if (_.isNumber(color)) {
    		var colors = this.getThemeColor();
    		colorArray.push(_getColor(color * 2, colors));
    		colorArray.push(_getColor(color * 2 + 1, colors));
    	} else if (_.isArray(color)){
    		colorArray = color;
    	}

        var startColor = colorArray[0];
        var endColor;
        var colorCount = colorArray.length;

        var hsb;
        if (colorCount === 1) {
            hsb = Raphael.color(colorArray[0]);
            endColor = Raphael.hsb(hsb.h / 360, (hsb.s -30) / 100, 1);
        } else {
            endColor = colorArray[colorCount - 1];
        }

        method = method || "normal ";

        if (method === "special") {
            return function (num) {
                var startHSB = Raphael.color(startColor);
                var endHSB = Raphael.color(endColor);
                var startH = startHSB.h * 360;
                var endH = endHSB.h * 360;
                var startNum = startHSB.h * 20;
                var endNum = endHSB.h * 20;

                var dH;
                var dNum;
                if (startNum >= endNum) {
                    dH = 360 - startH + endH;
                    dNum = colorCount - startNum + endNum;
                } else {
                    dH = endH - startH;
                    dNum = endNum - startNum;
                }

                var h = (startH + dH * num) / 360;
                var s = (70 + Math.abs(4 - (startNum + dNum * num) % 8) * 5) / 100;
                var b = (100 - Math.abs(4 - (startNum + dNum * num) % 8) * 5) / 100;

                return Raphael.hsb(h, s, b);
            };
        } else {
            return d3.interpolateRgb.apply(null, [startColor, endColor]);
        }
    };
    
	Color.getThemeColor = getThemeColor;
	Color.getColor = getColor;
	Color.getSpecialColor = getSpecialColor;
	Color.getDiscreteColor = getDiscreteColor;
	Color.gradientColor = gradientColor;
	Color.colorDetect = colorDetect;
	Color.rgbToHex = rgbToHex;
	Color.hexToRgb = hexToRgb;
	Color.setColor = setColor;
	
	return Color;
});