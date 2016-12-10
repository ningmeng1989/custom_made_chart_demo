/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
dojo.require("dojox.gfx.move"),dojo.declare("semantics.diagram.dojox.gfx.MoveSet",dojox.gfx.Moveable,{setParent:function(t){this.parentShape=t},setMyself:function(t){this.setMyself=t},onMove:function(t,e){this.onMoving(t,e);var d=this.shape.getTransform();d.dx+e.dx>=8||(e.dx=-d.dx+8),d.dy+e.dy>=3||(e.dy=-d.dy+3),e.dx>0&&this.setMyself.getWidth()+d.dx+e.dx+8>this.parentShape.parent.rawNode.getAttribute("width")&&this.parentShape.parent.rawNode.setAttribute("width",this.setMyself.getWidth()+d.dx+e.dx+8),e.dy>0&&this.setMyself.getHeight()+d.dy+e.dy+3>this.parentShape.parent.rawNode.getAttribute("height")&&this.parentShape.parent.rawNode.setAttribute("height",this.setMyself.getHeight()+d.dy+e.dy+3),this.shape.applyLeftTransform({dx:e.dx,dy:e.dy}),this.onMoved(t,e)}});