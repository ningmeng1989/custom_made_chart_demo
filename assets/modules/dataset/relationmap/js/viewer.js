/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
dojo.require("dojox.gfx"), dojo.require("dojox.gfx.move"), dojo.require("dojox.gfx.matrix");
var _infosetStyle = {
    nameFont: {
        style: "normal",
        variant: "normal",
        weight: "normal",
        size: "14px",
        family: "Microsoft Yahei, Arial, sans-serif"
    },
    itemFont: {
        style: "normal",
        variant: "normal",
        weight: "normal",
        size: "8pt",
        family: "Microsoft Yahei, Arial, sans-serif"
    },
    nameAlign: "left",
    itemAlign: "left",
    headerFill: "#9AB0C5",
    headerFillSelect: "#426B7EE",
    nameTextFill: "#FFF",
    itemFill1: "#EDF2F6",
    itemFill2: "#DFE6EC",
    itemTextFill: "black",
    pointFill: "#0CE3C4",
    pointFillHighlight: "#A08BF0",
    setBorderStroke: {color: "#FFF", width: 1},
    setPointStroke: {color: "#FFF", width: 2},
    setBorderStrokeSelect: {color: "#426B7EE", width: 2},
    lineColor: "#0CE3C4",
    lineColorSelect: "#A08BF0",
    lineWidth: 1,
    checkIcons: {
        unchecked: "img/unchecked.png",
        checked: "img/checked.png",
        uncheckedAll: "img/unchecked_all.png",
        checkedAll: "img/checked_all.png"
    },
    deleteIcon: "img/delete.png",
    stretchIcons: {opened: "img/up.png", folded: "img/down.png"},
    leftIcon: "img/join_left.png",
    rightIcon: "img/join_right.png",
    innerIcon: "img/join_inner.png",
    outerIcon: "img/join_outer.png",
    leftSelectIcon: "img/join_left_select.png",
    rightSelectIcon: "img/join_right_select.png",
    innerSelectIcon: "img/join_inner_select.png",
    outerSelectIcon: "img/join_outer_select.png"
};