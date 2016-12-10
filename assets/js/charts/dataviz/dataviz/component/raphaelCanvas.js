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
})('Canvas', function (require) {
	
    var checkContainer = function (node) {
        var ret = null;

        if (typeof node === "string") {
            ret = document.getElementById(node);
        } else if (node.nodeName) { //DOM-element
            ret = node;
        } else if (node.size() > 0) {
            ret = node[0];
        }
        if (!ret) {
            throw new Error("DataViz Error # DOM Error : Please specify a correct node to render.");
        }
        return ret;
    };
    
	var Canvas = function (node, option) {
		var node = checkContainer(node);
		var width = option.width || 600;
		var height = option.height || 600;
		this.canvas = new Raphael(node, width, height);
		canvasStyle = node.style;
		canvasStyle.position = "relative";
	};
		
	return Canvas;
});