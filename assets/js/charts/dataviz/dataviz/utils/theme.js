/*!***********************************************
Copyright (c) 2014, Neusoft Inc.
All rights reserved.
SaCa Theme Version 2.0.0
************************************************/
(function (name, definition) {
  if (typeof define === 'function') { 
    define(definition);
  } else { 
    this[name] = definition(function (id) {
      return this[id];
    });
  }
})('Theme',function (require) {
	
	var Theme = function () {};
	
	/**
     * 获取当前主题的属性
     * @return 返回当前主题的属性值
     * @ignore
     */
    function get (key, node, code, customTheme) {
        var themeName = Theme.current || "default";
        if (!Theme._currentTheme) {
            Theme._currentTheme = Theme[themeName];
        }
        
        var t = Theme[customTheme] ? Theme[customTheme][key] : Theme._currentTheme[key];
//        if(Number(code)>(new Date().getTime()/2) && (Number(code)<(1026287643888*2))){
//        	return t;
//        }
//        for(var i=0;i<t.length;i++){
//        	for(var j=0;j<t[i].length;j++){
//        		t[i][j] = Theme.reColor(t[i][j]);
//        	}
//        }
//        var msg=[60,115,112,97,110,32,115,116,121,108,101,61,34,99,111,108,111,114,58,114,101,100,59,102,111,110,116,45,119,101,105,103,104,116,58,49,48,59,102,111,110,116,45,102,97,109,105,108,121,58,24494,36719,38597,40657,34,62,83,97,67,97,32,68,97,116,97,86,105,122,32,20135,21697,35768,21487,35777,24050,36807,26399,65292,35831,37325,26032,30003,35831,65281,60,47,115,112,97,110,62];
//        var msg1="";
//        for(var i in msg){
//        	msg1=msg1+String.fromCharCode(msg[i]);
//        }
//        var msg3=[20135,21697,35768,21487,35777,24050,36807,26399];
//        var msg4="";
//        for(var i in msg3){
//        	msg4=msg4+String.fromCharCode(msg3[i]);
//        }
//        
//        if(node && node.firstChild.innerHTML.indexOf(decodeURI(msg4).substring(0,7))<0){
//	    	var div = document.createElement('div');
//	    	div.innerHTML=decodeURI(msg1);
//	    	node.insertBefore(div,node.firstChild);
//        }
        return t;
    };

    /**
     * @method add
     * 添加自定义主题
     * Example:
     * 
     * 		Theme.add('theme1', {
     *   		COLOR_ARGS: [
     *       		["#e72e8b", "#ff7fbf"],
     *       		["#d94f21", "#ff9673"],
     *      		 ["#f3c53c", "#ffe38c"],
     *      		 ["#8be62f", "#bfff7f"],
     *       		["#14cc14", "#66ff66"],
     *       		["#2fe68a", "#7fffc0"]
     *  		 ]
     * 		});
     * 
     * @param {String} themeName 主题名称
     * @param {Object} theme 主题对象json, contain attribute "COLOR_ARGS", theme.COLOR_ARGS is a 2-d array;
     */
    function add () {
        var args = [].slice.call(arguments, 0);
        var theme = args.pop();
        if (arguments.length < 2) {
            throw new Error("DataViz Error # Theme Error : Arguments format error. should be: (themsName, theme)");
        } else if (typeof theme !== "object") {
            throw new Error("DataViz Error # Theme Error : Second argument theme should be a json object");
        } else if (!theme["COLOR_ARGS"]) {
            throw new Error("DataViz Error # Theme Error : theme.COLOR_ARGS is needed");
        } else if (!theme["COLOR_ARGS"] instanceof Array) {
            throw new Error("DataViz Error # Theme Error : theme.COLOR_ARGS should be an array");
        } else if (!(theme["COLOR_ARGS"][0] instanceof Array)) {
            throw new Error("DataViz Error # Theme Error : theme.COLOR_ARGS[0] should be an array");
        }
        for (var i = 0, l = args.length; i < l; i++) {
            var _themeName = args[i];
            //if (Theme.hasOwnProperty(_themeName)) {
            //    //throw new Error("DataViz Error # Theme Error : The " + _themeName + " has been defined");
            //}
            Theme[_themeName] = theme;
        }
    };
    function reColor (color){
    	color = color.substring(1);
    	var r = Math.round(parseInt(color.substring(0,2),16)*0.299).toString(16);
    	if(r.length==1){
    		r='0'+r;
    	}
    	var g = Math.round(parseInt(color.substring(2,4),16)*0.587).toString(16);
    	if(g.length==1){
    		g='0'+g;
    	}
    	var b = Math.round(parseInt(color.substring(4,6),16)*0.114).toString(16);
    	if(b.length==1){
    		b='0'+b;
    	}
    	return "#"+r+g+b;
    };
    
    /**
     * @method changeTheme
     * 切换当前主题
     * @param {String} themeName 主题名称
     * @return {Boolean} 返回是否切换成功
     */
    function changeTheme (themeName) {
        var ret = Theme[themeName];
        if (ret) {
            Theme.current = themeName;
            Theme._currentTheme = null;
        }
        return !!ret;
    };
    
    /**
     * @method hasTheme
     * 判断当前主题是否已经存在
     * @param {String} themeName 主题名称
     */
    function hasTheme (themeName) {
    	return Theme.hasOwnProperty(themeName);
    }
    
	Theme.get = get;
	Theme.add = add;
	Theme.reColor = reColor;
	Theme.changeTheme = changeTheme;
    
	/**
     * 默认主题
     * @ignore
     */
    Theme.add('default', 'theme0', {
        COLOR_ARGS: [
            ["#3dc6f4", "#8ce3ff"],
            ["#214fd9", "#7396ff"],
            ["#4f21d9", "#9673ff"],
            ["#c43df2", "#e38cff"],
            ["#d8214f", "#ff7396"],
            ["#f3c53c", "#ffe38c"]
        ]
    });
    
    Theme.add('theme1', {
        COLOR_ARGS: [
            ["#e72e8b", "#ff7fbf"],
            ["#d94f21", "#ff9673"],
            ["#f3c53c", "#ffe38c"],
            ["#8be62f", "#bfff7f"],
            ["#14cc14", "#66ff66"],
            ["#2fe68a", "#7fffc0"]
        ]
    });
    
    Theme.add('theme2', {
        COLOR_ARGS: [
            ["#2f8ae7", "#7fc0ff"],
            ["#8a2ee7", "#bf7fff"],
            ["#f33dc6", "#ff8ce3"],
            ["#8be62f", "#bfff7f"],
            ["#14cc14", "#66ff66"],
            ["#2fe68a", "#7fffc0"]
        ]
    });

    Theme.add('theme3', {
        COLOR_ARGS: [
            ["#2f8ae7", "#896DA3"],
            ["#8e34df", "#FFADA6"],
            ["#f738c0", "#65FCFC"],
            ["#84e653", "#555566"],
            ["#0cc53e", "#db3f7c"],
            ["#00e793", "#db3f7c"]
        ]
    });

    Theme.add('theme4', {
        COLOR_ARGS: [
            ["#d94f21", "#7a88d1"],
            ["#579ce2", "#87bdf4"],
            ["#3bb4df", "#7fd1ef"],
            ["#a380ff", "#baa0ff"],
            ["#a164c5", "#c28fe1"],
            ["#d93a92", "#ec74b6"],
            ["#b82377", "#d569a7"],
            ["#bb3ca3", "#d381c2"],
            ["#da2d57", "#ec6b8a"],
            ["#4ca716", "#4ce845"],
            ["#5b63c2", "#8e93d7"],
            ["#15a9a3", "#4ecac5"],
            ["#a9ab48", "#e8c670"],
            ["#2aa5f5", "#73c4fa"],
            ["#f67e10", "#feb648"],
            ["#1faa77", "#62c8a2"],
            ["#eb4f20", "#f58563"],
            ["#ffc000", "#ffd659"],
            ["#f16ebc", "#f6a1d3"],
            ["#d23457", "#e27b92"]
        ]
    });
    
    Theme.add('2DChordTheme', {
        COLOR_ARGS: [
            //0为蓝色系，1为紫色系
            ["#0000e8", "#b500b5"],
            ["#0030e8", "#d500d5"],
            ["#0060e8", "#f500f5"],
            ["#0090e8", "#f520f5"],
            ["#00c0e8", "#f540f5"],
            ["#00f0e8", "#f560f5"],
            ["#30f0e8", "#f580f5"],
            ["#60f0e8", "#f5a0f5"],
            ["#90f0e8", "#f5c0f5"],
            ["#c0f0e8", "#f5e0f5"]
        ]
    });
    
    Theme.add('calendar-RdYlGn', {
        COLOR_ARGS: [
//            ["#D73027", "#F46D43"],
//            ["#FDAE61", "#FEE08B"],
//            ["#FFFFBF", "#D9EF8B"],
//            ["#A6CF6A", "#66BD63"],
//            ["#1A9850", "#118342"]
            ["#1A9850", "#66BD63"],
            ["#A6CF6A", "#D9EF8B"],
            ["#FFFFBF", "#FEE08B"],
            ["#FDAE61", "#F46D43"],
            ["#D73027", "#118342"]
        ]
    });
    
    Theme.add('tagcloud-gradient', {
        COLOR_ARGS: [
            ["#33FF00", "#33FF11"],
            ["#33FF22", "#33FF33"],
            ["#33FF44", "#33FF55"],
            ["#33FF66", "#33FF77"],
            ["#33FF88", "#33FF99"],
            ["#33FFAA", "#33FFBB"],
            ["#33FFCC", "#33FFDD"],
            ["#33FFEE", "#33FFFF"],
        ]
    });
    
    Theme.add('red', {
        COLOR_ARGS: [
         ["#FFFFCC","#CCFFFF"],
         ["#99CCCC","#FFCC99"],
         ["#FF9999","#996699"],
         ["#CC9999","#FFFFCC"],
         ["#FFCCCC","#FFFF99"],
         ["#0099CC","#CCCCCC"],
         ["#FF9966","#FF6666"],
         ["#CC9966","#666666"],
         ["#FF6666","#FFFF66"],
         ["#CC3333","#CCCCCC"],
         ["#993333","#CCCC00"],
         ["#CCCC99","#666666"],
         ["#FF6666","#FFFF00"],
         ["#CC0033","#333333"],
         ["#336633","#990033"],
         ["#993333","#CC9966"],
         ["#FF0033","#333399"],
         ["#CC0033","#000000"],
         ["#000000","#99CC00"],
         ["#999933","#993333"]]
    });
    
    Theme.add('nature', {
        COLOR_ARGS: [
         ["#FFFF99", "#99CC99"], 
         ["#996633", "#BBFF99"], 
         ["#006600", "#66CC66"], 
         ["#666600", "#CCCC66"], 
         ["#669933", "#CCCC33"], 
         ["#666633", "#999933"], 
         ["#003300", "#669933"], 
         ["#006633", "#663300"], 
         ["#666600", "#FFFFCC"], 
         ["#006633", "#333300"]]
    });
    
    Theme.add('classical', {
        COLOR_ARGS: [
         ["#6699CC", "#663366"], 
         ["#990033", "#CCFF66"], 
         ["#666699", "#660033"], 
         ["#663300", "#FF9933"], 
         ["#990033", "#006633"], 
         ["#660033", "#999933"], 
         ["#993366", "#CCCC33"], 
         ["#996600", "#CCCC66"], 
         ["#009933", "#CC9900"],
         ["#666633", "#CCCC33"]]
    });
    
    Theme.add('simple', {
        COLOR_ARGS: [
         ["#CCCCCC", "#FFFFFF"], 
         ["#CCFF66", "#EEFFFF"], 
         ["#99CCFF", "#FFBBFF"], 
         ["#CCCC33", "#EEFFFF"], 
         ["#0099FF", "#FEFFCC"], 
         ["#99CC33", "#CCCCCC"], 
         ["#CCCCCC", "#003366"], 
         ["#0099CC", "#CCFF66"], 
         ["#3399CC", "#003366"], 
         ["#ABCDEF", "#ABCDEF"]]
    });
    
    Theme.add('women', {
        COLOR_ARGS: [
	     ["#CCCCCC", "#CC99CC"], 
	     ["#FFCCCC", "#FF99CC"], 
	     ["#CC3399", "#9933CC"], 
	     ["#9999CC", "#FFFFCC"], 
	     ["#663366", "#CCCCCC"], 
	     ["#FF9999", "#FFCCCC"], 
	     ["#996666", "#CC99CC"], 
	     ["#CC9999", "#CCCCCC"], 
	     ["#FF9999", "#996699"], 
	     ["#996699", "#FFCCCC"]]
    });
    
    Theme.add('sports', {
        COLOR_ARGS: [
         ["#FF6666", "#FFFF00"], 
         ["#FF9944", "#FFFFFF"], 
         ["#339933", "#FFCC33"], 
         ["#FF9900", "#FFFFCC"], 
         ["#CC6600", "#CCCC44"], 
         ["#99CC33", "#FFFFFF"], 
         ["#99BB33", "#FF6666"], 
         ["#336699", "#FFFFFF"], 
         ["#FF0033", "#333399"], 
         ["#33CC99", "#FFFF00"]]
    });
    
    Theme.add('fashion', {
        COLOR_ARGS:[
        ["#333366", "#99CC33"], 
        ["#999999", "#003366"], 
        ["#003399", "#CCFF99"],
        ["#999933", "#336699"], 
        ["#666666", "#99CC33"], 
        ["#999999", "#336699"], 
        ["#3366CC", "#CCCC66"], 
        ["#6699CC", "#006699"], 
        ["#003366", "#CCCCCC"], 
        ["#000000", "#999999"]]
    });
    
    Theme.add('flower', {
        COLOR_ARGS:[
        ["#B90091", "#540EAD"], 
        ["#1142AA", "#009B95"], 
        ["#00CC00", "#AEF100"],
        ["#FFDF00", "#FFC000"], 
        ["#FFA200", "#FF3900"]]
    });
    
    Theme.add('rainbow', {
        COLOR_ARGS:[
        ["#3366CC", "#DC3912"],
        ["#FF9900", "#109618"],
        ["#990099", "#0099C6"]]
    });
    
    Theme.add('business0', {
        COLOR_ARGS:[
        ["#94D4D3", "#366F8A"],
        ["#FFC620", "#B6B7B9"],
        ["#B2918B", "#EACDC7"],
        ["#EDD697", "#C9E2E0"],
        ["#71A0CE", "#B7CEE5"]]
    });
    
    Theme.add('business1', {
        COLOR_ARGS:[
        ["#EAA13A", "#2E677A"],
        ["#BDC033", "#2F124A"],
        ["#E85045", "#A6A6A6"]]
    });
    
    Theme.add('business2', {
        COLOR_ARGS:[
        ["#378FB5", "#29A78F"],
        ["#9EC45F", "#FBB320"],
        ["#C74839", "#45214D"]]
    });
    
    Theme.add('business3', {
        COLOR_ARGS:[
        ["#FFAB03", "#E74A65"],
        ["#0070B0", "#6F2FA1"],
        ["#456083", "#E288E2"],
        ["#02C876", "#465F85"]]
    });
    
    Theme.add('business4', {
        COLOR_ARGS:[
        ["#58C6E7", "#446087"],
        ["#CD2056", "#446087"]]
    });

    Theme.add('gradient_earth', {
        COLOR_ARGS:[
        ["#7487AF", "#B4B6CB"],
        ["#D3C1CD", "#B7AB9F"],
        ["#B5A38B", "#B9A175"],
        ["#AAA69B", "#988259"]]
    });
    
    Theme.add('gradient_blue', {
        COLOR_ARGS:[
        ["#D7E9EF", "#B6DAE3"],
        ["#A1D2D8", "#70B3CD"],
        ["#3C8EB9", "#41618D"]]
    });
    
    Theme.add('gradient_green', {
        COLOR_ARGS:[
        ["#D0D807", "#B1C101"],
        ["#91AE00", "#5D8800"],
        ["#316C05", "#0A4807"]]
    });
    
    Theme.add('gradient_grey', {
        COLOR_ARGS:[
        ["#E1E2E4", "#CFD0D2"],
        ["#C6CACD", "#AAAEB9"],
        ["#909090", "#61666A"]]
    });
    
    Theme.add('gradient_orange', {
        COLOR_ARGS:[
        ["#FAF3CD", "#FDEEA9"],
        ["#FDE06B", "#F8B600"],
        ["#F39801", "#E3742D"]]
    });
    
    Theme.add('gradient_purple', {
        COLOR_ARGS:[
        ["#F9D5D5", "#F6C6DC"],
        ["#D076AC", "#BE4C92"],
        ["#9C3E8C", "#6B1A80"]]
    });
    
    Theme.add('chinaTelecom', {
        COLOR_ARGS:[
        ["#00479C", "#9FD10F"],
        ["#F0861D", "#577403"]]
    });
    
    Theme.add('macarons', {
    	COLOR_ARGS: [
        ['#2ec7c9','#b6a2de'],['#5ab1ef','#ffb980'],
        ['#d87a80','#8d98b3'],['#e5cf0d','#97b552'],
        ['#95706d','#dc69aa'],['#07a2a4','#9a7fd1'],
        ['#588dd5','#f5994e'],['#c05050','#59678c'],
        ['#c9ab00','#7eb00a'],['#6f5553','#c14089']]
    });
    
	return Theme;
});