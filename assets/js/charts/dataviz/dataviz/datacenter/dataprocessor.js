;(function (name, definition) {
  if (typeof define === 'function') {
    define(definition);
  } else { 
    this[name] = definition(function (id) { return this[id];});
  }
})('DataProcessor', function (require) {
	
	var Utils = require("Utils");
	/**
	 * @method process
	 * 处理数据
	 * @param source
	 * @returns
	 */
	function process (source) {
		var keys = _.keys(retSource[0]);
		_.each(retSource, function(obj) {
			for (var prop in obj) {
				var result = parseFloat(obj[prop]);
				if (!isNaN(result)) {
					obj[prop] = result;
				}
			}
		});
		//...继续写
	}
	
    /**
     * 数据转换
     */
    function csvRemap (source){
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
	 * @method buildStandJson
	 * 构建标准JSON对象
	 * @param source
	 * @returns
	 */
	function _buildStandJson (source) {
		//将String型键值转变为Number型键值
		_.each(source, function(obj) {
			string2Number(obj);
		});
	}
	
	/**
	 * @method string2Number
	 * 将对象中string值转换成int值
	 * @param source
	 * @returns
	 */
	function string2Number (obj) {
		//将String型键值转变为Number型键值
		for (var prop in obj) {
			// 正则判断是否是数字
			var re = /^(-?\d+)(\.\d+)?$/;
			if (re.test(obj[prop]))
		    {
				var result = parseFloat(obj[prop]);
				if (!isNaN(result)) {
					obj[prop] = result;
				}
		    }
		}
	}
	
	function getSource (source, compo) {
		if (!source) {
			throw new Error("DataViz Error # Source Error : No valid source specified.");
		}
		if (compo) {
			switch (compo.type) {
			case "chart" :
				return _getChartSource(source);
				break;
			case "legend" :
				return _getLegendSource(source, compo);
				break;
			}
		}
	}
	
	/**
	 * @method getDimensions
	 * 数据源映射函数
	 * @param map
	 * 用户jsp中setSource的第二个入参
	 * @returns 映射结果
	 */
	function getDimensions (map) {
        var ret = [];
        
        for(var p in map) {
    		ret.splice(map[p], 0, p);
        }
        
        if(!ret.length){
        	throw new Error("DataViz Error # Mapping Error : please specify the mapping object!");
        }
        
        return ret;
	}
	
	/**
	 * @method setSource
	 * 判断数据类型并返回处理结果
	 * @param source
	 * @returns
	 */
	function toList (source, map) {
		var retSource;
		var dimensions;
		
		source = clone(source);
		
		dimensions = getDimensions(map);
		
		if(!map){
			throw new Error("DataViz Error # Mapping Error : please specify the mapping object!");
		}
		
		if(!source || (source.length == 0)){
			return {source : source, dimensions : dimensions};
		}
		
		switch (Utils.detect(source)) {
		case 'Table_WITH_HEAD':
			retSource = Utils.collectionify(source);
			break;
		case 'Table':
			var head = [];
			for (var i = 0, len = source[0].length; i < len; i++) {
				head.push(i);
			}
			retSource = Utils.collectionify(source, head);
			break;
		case 'List':
			retSource = source;
			break;
		case 'Unknown':
			throw new Error("DataViz Error # Source Error : No valid source specified.");
			break;
		  	default:
		}
		
		_buildStandJson(retSource);
		
		return {source : retSource, dimensions : dimensions};
	}
	
	/**
	 * @method _getChartSource
	 * 获取数据源维度信息
	 * @param source
	 * @returns
	 */
	function _getChartSource () {

		var source = arguments[0].source;
		var realDimensions = arguments[0].dimensions;
        var dimensionType = arguments[0].dimensionType;
        var dimensionDomain = {};

		var retSource = Utils.tablify(source);
		var dimensions = retSource[0];
		
		if(!dimensions){
			return {source: null, 
			dimensions: null,
			dimensionType: null,
			dimensionDomain: null
			};
		}

        if (typeof dimensionType == "undefined") {
            dimensionType = {};
            for (var i = 0, l = dimensions.length; i < l; i++){
                var type = "quantitative";
                for (var j = 1, ll = retSource.length; j < ll; j++){
                    var d = retSource[j][i];
                    if(d && (!_.isNumber(d))){
                        type = "ordinal";
                        break;
                    }
                }
                dimensionType[dimensions[i]] = type;
            }
        }

        for (var i = 0, l = dimensions.length; i < l; i++){
            var dimen = dimensions[i];
            if (dimensionType[dimen] === "quantitative") {
            	dimensionDomain[dimen] = d3.extent(source, function (p) {
                    return Math.abs(p[dimen]);
                });
            } else {
            	dimensionDomain[dimen] = source.map(function(p){
                    return p[dimen];
                });
            }
        }

		return {source: source, 
			dimensions: realDimensions,
			dimensionType: dimensionType,
			dimensionDomain: dimensionDomain
			};
	}
	
	/**
	 * @method _getLegendSource
	 * 获取数据源维度信息
	 * @param source
	 * @returns
	 */
	function _getLegendSource (source, compo) {
		if(_.isString(compo.data)) {
			return _.uniq(_.pluck(source, compo.data));
		} else if(_.isArray(compo.data)) {
			var tempArr = [];
			_.each(compo.data, function(obj, k) {
				if(_.isString(obj)) {
					tempArr.push(obj);
				} else if(_.isArray(obj)) {
					var tempStr = "";
					_.each(obj, function(arrEle) {
						tempStr += arrEle + "-";
					});
					
					if (compo.showStatistics) {
						var legendArray = [];
						if (!legendArray.length) {
							for (var i = 0;i < source.length ;i++){
								var value = Utils.getIndexOfValueRange(compo.data, source[i].value);
								if(legendArray[value]){
									legendArray[value] += 1;
								}else{
									legendArray[value] = 1;
								}
							}
						}
						var len = source.length;
						var sum = legendArray[k];
						
						var str = "[" + tempStr.substring(0,tempStr.length - 1) + "]" + " " +((sum/len)*100).toFixed(1) + "%";
						tempArr.push(str);
					} else {
						tempArr.push("[" + tempStr.substring(0,tempStr.length - 1) + "]");
					}
				}
			});
			return tempArr;
		}
	}
	
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
    function delcommafy (num){
    	if((num+"").trim()==""){
    		return"";
    	}
    	num=num.replace(/,/gi,'');
    	return num;
    };
    
    function arrayToTreeJson (array, map) {
    	if (!_.isArray(array)) {
			  return array;
		}
 
	    var column = [array[0][0], array[0][1], array[0][2], array[0][3], array[0][4]];
	    if(map[column[0]] == 0 && map[column[1]] == 1 && map[column[2]] == 2 && map[column[3]] == 3) {
	    	var table = [];
		    for (i = 1, l = array.length; i < l; i++) {
		      var line = array[i];
		      var tableLine = table[i - 1] = [];
		      var j, columnL;
		      for (j = 0, columnL = column.length; j < columnL; j++) {
		        tableLine.push(line[map[column[j]]]);
		      }
		    }

		    var rootID;
		    var h = {};
		    table.forEach(function (d, i) {
		      if (d[0] === "") {
		        throw new Error("DataViz Error # Source Error : ID can not be empty(line:" + (i + 1) + ").");
		      }
		      if (d[3] === null || d[3] === undefined || d[3] === "") {
		        if (rootID) {
		          throw new Error("DataViz Error # Source Error : 2 or more lines have an empty parentID(line:" + (i + 1) + ").");
		        } else {
		          rootID = d[0];
		        }
		      }
		      if (h[d[0]]) {
		        throw new Error("DataViz Error # Source Error : 2 or more lines have same ID: " + d[0] + "(line:" + (i + 1) + ").");
		      }
		      //h[d[0]] = {id: d[0], name: d[1], size: d[2], info: d[4], child: []};
                h[d[0]] = {};
                h[d[0]][column[0]] = d[0];
                h[d[0]][column[1]] = d[1];
                h[d[0]][column[2]] = d[2];
                h[d[0]]['child'] = [];
                if (typeof column[4] != 'undefined') {
                    h[d[0]][column[4]] = d[4];
                }
		    });
		    if (!rootID && rootID != 0) {
		      throw new Error("DataViz Error # Source Error : No root node defined.");
		    }
		    table.forEach(function (d, i) {
		      if (d[3] !== null && d[3] !== undefined && d[3] !== "") {
		        var record = h[d[3]];
		        if (!record) {
		          throw new Error("DataViz Error # Source Error : Can not find parent with ID " + d[3] + "(line:" + (i + 1) + ").");
		        }
		        record.child.push(d[0]);
		      }
		    });
		    var recurse = function (parentID) {
		      var record = h[parentID];
		      if (record.child.length === 0) {
		        if (isNaN(parseFloat(record[column[2]]))) {
		          throw new Error("DataViz Error # Source Error : Leaf node's size is not a number(name:" + record.name + ").");
		        } else {
                    //return {id: record.id, name: record.name, size: record.size, info: record.info};
                    var obj = {}
                    obj[column[0]] = record[column[0]];
                    obj[column[1]] = record[column[1]];
                    obj[column[2]] = record[column[2]];
                    if (typeof column[4] != 'undefined') {
                        obj[column[4]] = record[column[4]];
                    }

                    return obj;
		        }
		      } else {
		        var childNode = [];
		        record.child.forEach(function (d) {
		          childNode.push(recurse(d));
		        });
		        //return {id: record.id, name: record.name, children: childNode, info: record.info};
                  var obj = {}
                  obj[column[0]] = record[column[0]];
                  obj[column[1]] = record[column[1]];
                  obj['children'] = childNode;
                  if (typeof column[4] != 'undefined') {
                      obj[column[4]] = record[column[4]];
                  }

                  return obj;
		      }
		    };
		    return recurse(rootID);
	    } else {
	    	throw new Error("DataViz Error # Source Error : please specify correct map.");
	    }
    }
    
    function clone () {
        /**
         * 对象深复制
         */
        function objectDeepCopy (source) { 
            var ret={};
            for (var key in source) {
            	if(source[key] == null) {
            		source[key] = "";
            	}
                ret[key] = (typeof source[key]==='object' && !_.isArray(source[key])) ? objectDeepCopy(source[key]): source[key];
             } 
            return ret; 
        }
        
        /**
         * 数组深复制
         */
        function arrayDeepCopy (source) { 
            var ret=[];
            var length = source.length;
            for (var i = 0; i < length; i++) {
            	ret[i] = source[i];
             } 
            return ret; 
        }
        
    	var source = arguments[0];
    	var ret = [];
    	var length = source.length;
    	
    	if(_.isArray(source[0])) {
    		ret = arrayDeepCopy(source);
    	} else if(_.isObject(source[0])){
    		for(var i = 0; i < length; i++) {
    			ret[i] = objectDeepCopy(source[i]);
    		}
    	}
    	
    	return ret;
    }
    
	var DataProcessor = function () {};
	
	DataProcessor.toList = toList;
	DataProcessor.process = process;
	DataProcessor.getSource = getSource;
	DataProcessor.csvRemap = csvRemap;
	DataProcessor.commafy = commafy;
	DataProcessor.delcommafy = delcommafy;
	DataProcessor.arrayToTreeJson = arrayToTreeJson;
	DataProcessor.getDimensions = getDimensions;
	DataProcessor.clone = clone;
	DataProcessor.string2Number = string2Number;
	
	return DataProcessor;
});