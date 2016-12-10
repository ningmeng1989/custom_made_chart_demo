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
})('Utils',function (require) {
	
	
	var Utils = function () {};
	
    /**
     * 侦测数据，检测是二维表（带表头否），还是JSON对象数组
     * @param {Array} input 输入的数组对象，元素可能为数组，也可能是对象
     */
	function detect (input) {
        var first = input[0];
        if (_.isArray(first)) {
            var withHead = _.all(first, function (item) {
                return !_.isNumber(item);
            });
            return withHead ? "Table_WITH_HEAD" : "Table";
        } else if (_.isObject(first)) {
            return "List";
        } else {
            return "Unknown";
        }
    };
    /**
     * @method tablify
     * 将一个对象集合转化为二维表格，第一行为key，后续为每个对象的数据
     * Examples:
     *
     * 	 	[
     *    		{"username": "JacksonTian", "nick": "朴灵", "hometown": "Chongqing"},
     *    		{"username": "Fengmk2", "nick": "苏千", "hometown": "Guangzhou"}
     *  		];
     * 		=>
     *  		[
     *    		["username", "nick", "hometown"],
     *   	 	["JacksonTian", "朴灵", "Chongqing"],
     *    		["Fengmk2", "苏千", "Guangzhou"]
     *  	]
     *
     * @param {Array} list 待转化的二维表集合
     */
    function tablify (list) {
    	if (!list.length) {
    		return [];
    	}
    	var keys = _.keys(list[0]);
    	var keysLength = keys.length;
    	var ret = [keys];
    	
    	var propLength = 0;
    	
    	_.each(list, function (obj) {
    		var value = _.values(obj);
    		propLength = value.length;
    		if(propLength > keysLength) {
    			keys = _.keys(obj);
    		}
    		ret.push(value);
    	});
    	ret.shift();
    	ret.unshift(keys);
    	return ret;
    };

    /**
     * @method collectionify
     * tablify的反向工程，如果不传入head，那么第一行取出作为key，后续当作数组
     * Examples:
     * 
     *  		[
     *    			["username", "nick", "hometown"],
     *    			["JacksonTian", "朴灵", "Chongqing"],
     *    			["Fengmk2", "苏千", "Guangzhou"]
     * 			]
     *		 =>
     *  		[
     *    			{"username": "JacksonTian", "nick": "朴灵", "hometown": "Chongqing"},
     *    			{"username": "Fengmk2", "nick": "苏千", "hometown": "Guangzhou"}
     *  		];
     * 
     * @param {Array} table 二维表数组
     * @param {Array} head 可选的表头数组，如果不指定，将取出二维表数据第一行作为表头
     */
    function collectionify (table, head) {
    	var ret = [];
    	if (table.length < 2) {
    		return ret;
    	}
    	var keys = head || table[0];
    	_.each(table.slice(1), function (row) {
			var obj = {};
	        _.each(keys, function (key, index) {
	        	obj[key] = row[index];
	        });
	        ret.push(obj);
    	});
    	return ret;
    };
    
    /**
     * 添加数值边缘检测
     * @param {Number} number 数字
     * @param {Number} min 下边缘
     * @param {Number} max 上边缘
     * @return {Boolean} 返回边缘检测后
     * @ignore
     */
    function limit (number, min, max) {
        var ret;
        if (typeof min !== 'undefined') {
            ret = number < min ? min : number;
        }
        if (typeof max !== 'undefined') {
            if (max < min) {
                throw new Error('DataViz Error # The max value should bigger than min value');
            }
            ret = number > max ? max: number;
        }
        return ret;
    };
    
    function sum (list, iterator) {
        var count = 0;
        var i, l;
        if (typeof iterator === 'undefined') {
            for (i = 0, l = list.length; i < l; i++) {
                count += list[i];
            }
        } else if (typeof iterator === "function") {
            for (i = 0, l = list.length; i < l; i++) {
                count += iterator(list[i]);
            }
        } else if (typeof iterator === "string" || typeof iterator === 'number') {
            for (i = 0, l = list.length; i < l; i++) {
            	if(list[i]) {
            		count += list[i][iterator];
            	}
            }
        } else {
            throw new Error("DataViz Error # iterator error");
        }
        return count;
    };
    
    /**
     * 用于绘制坐标轴时，按照最佳方式，计算出坐标点
     * @param {Number} minValue 坐标轴上的最小值
     * @param {Number} maxValue 坐标轴上的最大值
     * @param {Number} tickCount 坐标轴上标记点的个数（在无最佳标记方式时，会不等于该值）
     * @return {Array} 最佳方式的刻度数组
     * @ignore
     */
	function tickRange (minValue, maxValue, tickCount) {
		function scale_range(start, stop, step) {
			if (arguments.length < 3) {
				step = 1;
				if (arguments.length < 2) {
					stop = start;
					start = 0;
				}
			}
			if ((stop - start) / step === Infinity)
				throw new Error("DataViz Error # Infinite range");
			var range = [], k = range_integerScale(Math.abs(step)), i = -1, j;
			start *= k, stop *= k, step *= k;
			if (step < 0)
				while ((j = start + step * ++i) > stop)
					range.push(j / k);
			else
				while ((j = start + step * ++i) < stop)
					range.push(j / k);
			return range;
		}
		function range_integerScale(x) {
			var k = 1;
			while (x * k % 1)
				k *= 10;
			return k;
		}
		function scaleExtent(domain) {
			var start = domain[0], stop = domain[domain.length - 1];
			return start < stop ? [ start, stop ] : [ stop, start ];
		}
		function scale_linearTickRange(domain, m) {
			var extent = scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(
					10, Math.floor(Math.log(span / m) / Math.LN10)), err = m
					/ span * step;
			if (err <= .15)
				step *= 10;
			else if (err <= .35)
				step *= 5;
			else if (err <= .75)
				step *= 2;
			extent[0] = Math.ceil(extent[0] / step) * step;
			extent[1] = Math.floor(extent[1] / step) * step + step * .5;
			extent[2] = step;
			var range = scale_range(extent[0], extent[1], extent[2]);
			return range;
		}
		return scale_linearTickRange([ minValue, maxValue ], tickCount);
	};
	
	/**
	 * 坐标轴数据处理，格式变换
	 * @ignore
	 */
	function tickFormat (d){
		if(!isNaN(d)){
			if(d >= 1000000000)
				d = d / 1000000000 + "B";
			else if(d >= 1000000)
				d = d / 1000000 + "M";
			else if(d >= 1000)
				d = d / 1000 + "K";
		}
		return d;
	};
	
    /**
     * 为字符串对象增加trim函数
     * @returns
     * @ignore
     */
    String.prototype.trim = function () {
    	return this.replace(/(^\s*)|(\s*$)/g, "");
    };
    
    /**
     * 数据格式转换为千分位格式
     * @ignore
     */
    function commafy (num) {
    	
    	if((num+"").trim()==""){
    		return"";
    	}
    	if(isNaN(num)){
    		return"";
    	}
    	num = num+"";
    	if(/^.*\..*$/.test(num)){
    		var pointIndex =num.lastIndexOf(".");
    		var intPart = num.substring(0,pointIndex);
    		var pointPart =num.substring(pointIndex+1,num.length);
    		intPart = intPart +"";
    		var re =/(-?\d+)(\d{3})/;
    		
    		while(re.test(intPart)){
    			intPart =intPart.replace(re,"$1,$2");
    		}
    		num = intPart+"."+pointPart;
    	}else{
    		num = num +"";
    		var re =/(-?\d+)(\d{3})/;
    			while(re.test(num)){
    				num =num.replace(re,"$1,$2");
    			}
    	}
    	return num;
    };
    
    /**
     * 去除千分位
     * @ignore
     */
    function delcommafy (num) {
    	if((num+"").trim()==""){
    		return"";
    	}
    	num=num.replace(/,/gi,'');
    	return num;
    };
    
	function getIndexOfValueRange (dataArr, num) {
		for(var i = 0 ;i < dataArr.length; i++){
			if(num >= dataArr[i][0] && num <= dataArr[i][1]){
				return i;
			}
		}
		//alert("您设置的图例区间与您的数据不符，请重新设置");
		if(num != undefined) {
			throw new Error("DataViz Error # Legend Error :Legend failed to satisfy the requirements.");
		}
	};
	
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
	function getData (source, arr, cond){
		 var data = collectionify(source);
		 //按照传入条件过滤数据
	   	 var tempData = [] ;
	   	 if(cond){
	   		tempData = _.where(data, cond);
	   	 }else{
	   		tempData = data;
	   	 }
	   	 //取需要显示的列
	   	 return _.map(tempData,function(d){
	   		return _.pick(d, arr);
	   	 });
	};
	
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
	function dataFilter (source, arr, cond){
		 var data = collectionify(source);
		 var lineData = _.groupBy(data,cond);
		 var tempData = [] ;
		 _.each(lineData,function(item,index){
			 var total = [];
			 total[0] = index;
			 for(var i = 0; i< arr.length; i++){
				 total[i+1] =0;
			 }
			 _.each(item,function(row,num){
				 for(var i = 0; i< arr.length; i++){
					 total[i+1] += parseInt(row[arr[i]]);
				 }
			 });
			 tempData.push(total);
		 });
		 return tempData;
	};
	
    /**
     * @method uniq
     * 去除重复列
     * @param {JSON | CSV} source
     * 数据源
     * @param {Array} cond 
     * 需要对比的属性
     */
	function uniq (source,cond){
	   	 return _.uniq(source,function(item) {
	   		 return item[cond];
	   	 });
	};
	
	function isMobile () {
		return !!navigator.userAgent.match(/IEMobile|BlackBerry|Android|iPod|iPhone|iPad/i);
	}

	/**
	 * @method setAnimation
	 * 动画设置
	 * @param animation 动画开关
	 * @param obj 动画作用对象
	 * @param attrs 动画属性效果
	 * @param time 动画时间
	 * 
	 */
	function setAnimation (animation, obj, attrs, time) {
		if (animation) {
			obj.animate(attrs, time);
		} else {
			obj.attr(attrs);
		}
	}
	
	Utils.detect = detect;
	Utils.tablify = tablify;
	Utils.collectionify = collectionify;
	Utils.limit = limit;
	Utils.sum = sum;
	Utils.tickRange = tickRange;
	Utils.tickFormat = tickFormat;
	Utils.commafy = commafy;
	Utils.delcommafy = delcommafy;
	Utils.getIndexOfValueRange = getIndexOfValueRange;
	Utils.getData = getData;
	Utils.dataFilter = dataFilter;
	Utils.uniq = uniq;
	Utils.isMobile = isMobile;
	Utils.setAnimation = setAnimation;
	
	return Utils;
});