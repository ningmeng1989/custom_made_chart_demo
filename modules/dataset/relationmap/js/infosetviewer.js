/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
var _semantics_diagram_infoset_viewer_cls={surface:null,headerSurface:null,dimension:null,movable:null,header:null,itemsViewer:null,rectBorder:null,events:null,topics:null,_selected:null,infoSet:null,parent:null,deleteIcon:null,openIcon:null,foldIcon:null,uncheckedIcon:null,checkedIcon:null,leftPoint:null,rightPoint:null,anchors:null,nameText:null,constructor:function(e,t){this.parent=t,this.infoSet=e,this.itemsViewer=new semantics.diagram.InfoItemsViewer(e.getItems(),this),this.events=[],this.topics=[],this._initDimension(),this.leftPoint=new semantics.diagram.Point(this,"left"),this.rightPoint=new semantics.diagram.Point(this,"right")},destroy:function(){this.rectBorder.removeShape(),this.header.removeShape(),this.itemsViewer.destroy(),this.surface.removeShape(),dojo.forEach(this.events,dojo.disconnect),dojo.forEach(this.topics,dojo.unsubscribe),this.movable.destroy()},setGraphicContext:function(e){this.surface=e.surface,this._initView(),this.anchors=[],this.anchors.push({x:0,y:this.dimension.headerHeight/2}),this.anchors.push({x:this.dimension.width,y:this.dimension.headerHeight/2}),this.leftPoint.setGraphicContext({surface:this.surface.createGroup(),x:this.anchors[0].x,y:this.anchors[0].y}),this.rightPoint.setGraphicContext({surface:this.surface.createGroup(),x:this.anchors[1].x,y:this.anchors[1].y}),null!=e.x&&null!=e.y&&this.relocate(e.x,e.y),this._resetSVG()},_resetSVG:function(){this.getWidth()+this.getLocation().dx+2>this.surface.parent.parent.rawNode.getAttribute("width")&&this.surface.parent.parent.rawNode.setAttribute("width",this.getWidth()+this.getLocation().dx+2),this.getHeight()+this.getLocation().dy+2>this.surface.parent.parent.rawNode.getAttribute("height")&&this.surface.parent.parent.rawNode.setAttribute("height",this.getHeight()+this.getLocation().dy+2)},_initDimension:function(){var e=320,t=49,i=12,s=15,n=5,h=7;this.dimension={width:e,headerHeight:t,height:t+this.itemsViewer.getHeight(),nameX:s,nameY:t/4+6,idX:s,idY:t/4*3+4,deleteWidth:i-2,deleteHeight:i-2,stretchWidth:i,stretchHeight:i,checkboxWidth:i,checkboxHeight:i,padding:s,margin:n,pointRadius:h}},onMoved:function(e,t){this._gridLocMatrix=this.surface._getRealMatrix()},relocate:function(e,t){this.surface.applyLeftTransform({dx:e,dy:t}),this.onMoved(null,{dx:e,dy:t})},setLocation:function(e,t){var i=this.surface.getTransform();this.relocate(e-i.dx,t-i.dy)},getWidth:function(){return this.dimension.width},getHeight:function(){return this.dimension.headerHeight+this.itemsViewer.getHeight()},getLocation:function(){return this.surface.getTransform()},_initView:function(){var e=this.headerSurface=this.surface.createGroup(),t=this.header=e.createRect({x:0,y:0,width:this.dimension.width,height:this.dimension.headerHeight});t.setFill(_infosetStyle.headerFill),t.rawNode.style&&(t.rawNode.style.cursor="move");var i=this.nameText=e.createText({x:this.dimension.nameX,y:this.dimension.nameY,text:this.infoSet.name,align:_infosetStyle.nameAlign});i.setFont(_infosetStyle.nameFont),i.setFill(_infosetStyle.nameTextFill),i.rawNode.style&&(i.rawNode.style.cursor="pointer");var s=e.createText({x:this.dimension.idX,y:this.dimension.idY,text:"ID:"+this.infoSet.id,align:_infosetStyle.nameAlign});s.setFont(_infosetStyle.nameFont),s.setFill(_infosetStyle.nameTextFill),s.rawNode.style&&(s.rawNode.style.cursor="move"),this.deleteIcon=e.createImage({x:this.dimension.width-this.dimension.deleteWidth-6-this.dimension.stretchWidth-6-this.dimension.checkboxWidth-2*this.dimension.margin-this.dimension.padding,y:(this.dimension.headerHeight-this.dimension.deleteWidth+1)/2,width:this.dimension.deleteWidth,height:this.dimension.deleteHeight,src:_infosetStyle.deleteIcon}),this.deleteIcon.rawNode.style&&(this.deleteIcon.rawNode.style.cursor="pointer");var n=this.openIcon=e.createImage({x:this.dimension.width-this.dimension.stretchWidth-6-this.dimension.checkboxWidth-this.dimension.margin-this.dimension.padding,y:(this.dimension.headerHeight-this.dimension.stretchWidth)/2,width:this.dimension.stretchWidth,height:this.dimension.stretchHeight,src:_infosetStyle.stretchIcons.opened});n.rawNode.style&&(n.rawNode.style.cursor="pointer");var h=this.foldIcon=e.createImage({x:this.dimension.width-this.dimension.stretchWidth-6-this.dimension.checkboxWidth-this.dimension.margin-this.dimension.padding,y:(this.dimension.headerHeight-this.dimension.stretchWidth)/2,width:this.dimension.stretchWidth,height:this.dimension.stretchHeight,src:_infosetStyle.stretchIcons.folded});h.rawNode.style&&(h.rawNode.style.cursor="pointer");var o=this.checkedIcon=e.createImage({x:this.dimension.width-this.dimension.checkboxWidth-this.dimension.padding,y:(this.dimension.headerHeight-this.dimension.checkboxHeight+1)/2,width:this.dimension.checkboxWidth,height:this.dimension.checkboxHeight,src:_infosetStyle.checkIcons.checkedAll});o.rawNode.style&&(o.rawNode.style.cursor="pointer");var r=this.uncheckedIcon=e.createImage({x:this.dimension.width-this.dimension.checkboxWidth-this.dimension.padding,y:(this.dimension.headerHeight-this.dimension.checkboxHeight+1)/2,width:this.dimension.checkboxWidth,height:this.dimension.checkboxHeight,src:_infosetStyle.checkIcons.uncheckedAll});r.rawNode.style&&(r.rawNode.style.cursor="pointer"),this._isItemsAllComputed()?e.remove(r):e.remove(o),this.itemsViewer.setGraphicContext({surface:this.surface.createGroup(),width:this.dimension.width,height:this.dimension.height-this.dimension.headerHeight,x:0,y:this.dimension.headerHeight}),this.rectBorder=this.surface.createRect({x:0,y:0,width:this.dimension.width,height:this.infoSet.showItems?this.dimension.height:this.dimension.headerHeight}).setStroke(_infosetStyle.setBorderStroke),this.infoSet.showItems?this.changeOpenIcon(!0):(this.itemsViewer.show(!1),this.changeOpenIcon(!1)),this._initEvent()},updateName:function(e){this.infoSet.name=e,this.nameText&&this.headerSurface.remove(this.nameText);var t=this.nameText=this.headerSurface.createText({x:this.dimension.nameX,y:this.dimension.nameY,text:this.infoSet.name,align:_infosetStyle.nameAlign});t.setFont(_infosetStyle.nameFont),t.setFill(_infosetStyle.nameTextFill),t.rawNode.style&&(t.rawNode.style.cursor="move")},_isItemsAllComputed:function(){for(var e in this.infoSet.items)if(!this.infoSet.items[e].checked)return!1;return!0},getAnchorPair:function(e){if(this.anchors){var t=this._getRealAnchors(),i=e._getRealAnchors();return[{lx:t[0].x-this.dimension.pointRadius,rx:t[1].x+this.dimension.pointRadius,y:t[0].y},{lx:i[0].x-this.dimension.pointRadius,rx:i[1].x+this.dimension.pointRadius,y:i[0].y}]}},getGridTransform:function(e){return this._gridLocMatrix},_getRealAnchors:function(){var e=this._gridLocMatrix,t=e.dx,i=e.dy;return[{x:this.anchors[0].x+t,y:this.anchors[0].y+i},{x:this.anchors[1].x+t,y:this.anchors[1].y+i}]},_initEvent:function(){this.movable=new semantics.diagram.dojox.gfx.MoveSet(this.surface),this.movable.setParent(this.surface.parent),this.movable.setMyself(this),this.events.push(dojo.connect(this.movable,"onMoved",this,"onMoved")),this.events.push(dojo.connect(document,"keydown",this,this._infoSetKeydown)),this._topics=[],this._topics.push(dojo.subscribe("/semantics/clickCancel",this,this.infoSetDeselected)),this.surface.connect("onclick",this,this.infoSetSelected),this.checkedIcon.connect("onclick",this,function(e){for(var t in this.infoSet.getItems())dojo.publish("/semantics/removeComputeItem",[this.infoSet.getItems()[t]]);this.changeChecked(!1)}),this.uncheckedIcon.connect("onclick",this,function(e){dojo.publish("/semantics/addTableItems",[this.infoSet.getItems()]),this.changeChecked(!0)}),this.deleteIcon.connect("onclick",this,function(e){dojo.publish("/semantics/deleteInfoSet",[this.infoSet.id])}),this.nameText.connect("ondblclick",this,function(e){dojo.publish("/semantics/tablerename",[{id:this.infoSet.id,name:this.infoSet.name}])}),this.openIcon.connect("onclick",this,"hideItemsViewer"),this.foldIcon.connect("onclick",this,"showItemsViewer")},showItemsViewer:function(){this.infoSet.showItems=!0,this.itemsViewer.show(!0),this.changeOpenIcon(!0);var e=this.rectBorder.getShape(),t=this.itemsViewer._autoHeight(!0);this.rectBorder.setShape({x:e.x,y:e.y,width:e.width,height:e.height+t,r:e.r}),this._resetSVG()},hideItemsViewer:function(){this.infoSet.showItems=!1,this.itemsViewer.show(!1),this.changeOpenIcon(!1);var e=this.rectBorder.getShape(),t=this.itemsViewer._autoHeight(!0);this.rectBorder.setShape({x:e.x,y:e.y,width:e.width,height:e.height-t,r:e.r})},changeOpenIcon:function(e){e?(this.headerSurface.add(this.openIcon),this.headerSurface.remove(this.foldIcon)):(this.headerSurface.remove(this.openIcon),this.headerSurface.add(this.foldIcon))},changeChecked:function(e){this.changeHeaderChecked(e),this.itemsViewer.changeChecked(e)},changeHeaderChecked:function(e){e?(this.headerSurface.remove(this.uncheckedIcon),this.headerSurface.add(this.checkedIcon)):(this.headerSurface.remove(this.checkedIcon),this.headerSurface.add(this.uncheckedIcon))},infoSetSelected:function(e){dojo.publish("/semantics/clickCancel",[]),this._selected=!0,this._changeBorder(),e&&dojo.stopEvent(e)},infoSetDeselected:function(){this._selected=!1,this._changeBorder()},_infoSetKeydown:function(e){this._selected&&e.keyCode==dojo.keys.DELETE&&(dojo.publish("/semantics/deleteInfoSet",[this.infoSet.id]),dojo.stopEvent(e))},_changeBorder:function(){this._selected?(this.header.setFill(_infosetStyle.headerFillSelect),this.rectBorder.setStroke(_infosetStyle.setBorderStrokeSelect)):(this.header.setFill(_infosetStyle.headerFill),this.rectBorder.setStroke(_infosetStyle.setBorderStroke))}};dojo.declare("semantics.diagram.InfoSetViewer",null,_semantics_diagram_infoset_viewer_cls);