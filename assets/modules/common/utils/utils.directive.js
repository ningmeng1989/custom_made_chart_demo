/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("common.utils.directive", []).directive("showonce", function () {
    return {
        restrict: "AE", scope: {showValue: "=showValue", showArray: "=showArray"}, link: function (e, t, r) {
            _.contains(e.showArray, e.showValue) ? t.hide() : (t.show(), e.showArray.push(e.showValue))
        }
    }
}).directive("colorpicker", function () {
    return {
        restrict: "A", link: function (e, t, r) {
            e["default"] || (e["default"] = e.subValue["default"]), e.$watch("default", function (e) {
                e && t.spectrum({
                    color: e,
                    preferredFormat: "hex",
                    chooseText: "确定",
                    cancelText: "取消",
                    showInitial: !0,
                    showInput: !0,
                    showPalette: !0,
                    palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]],
                    showSelectionPalette: !0
                })
            })
        }
    }
}).directive("outOfRange", ["toaster", function (e) {
    return {
        restrict: "A", link: function (t, r, a) {
            t.$watch("prop.value", function () {
                var t, o = parseInt(r.val()), n = parseInt(a.min), i = a.max;
                i = "Infinity" == i ? 1 / 0 : parseInt(i), (n > o || o > i) && (t = i == 1 / 0 ? "请输入不小于" + n + "的数字！" : "请输入位于" + n + "~" + i + "之间的数字！", e.pop("info", t))
            })
        }
    }
}]).directive("chartscroll", ["$rootScope", function (e) {
    return {
        restrict: "A", scope: {scrollheight: "=scrollheight"}, link: function (e, t) {
            t.slimScroll({destroy: !0}), t.slimscroll(e.scrollheight);
            var r = e.$watch("scrollheight", function (r, a) {
                r && r != a && (t.slimScroll({destroy: !0}), $(t).css("height", e.scrollheight.height), t.slimscroll(e.scrollheight))
            });
            e.$on("$destroy", function () {
                r()
            })
        }
    }
}]).directive("ckeditor", function () {
    return {
        require: "?ngModel", link: function (e, t, r, a) {
            var o = CKEDITOR.replace(t[0], {
                toolbar: [["Undo", "Redo"], ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord"], ["Bold", "Italic", "Underline", "Strike"], ["NumberedList", "BulletedList", "-", "Outdent", "Indent"], ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"], ["Font", "FontSize"], ["TextColor", "BGColor"], ["Maximize", "-"]],
                height: 240,
                startupFocus: !0
            });
            a && (o.on("instanceReady", function () {
                o.setData(a.$viewValue), o.focus()
            }), o.on("pasteState", function () {
                e.$apply(function () {
                    a.$setViewValue(o.getData())
                })
            }), a.$render = function (e) {
                o.setData(a.$viewValue)
            })
        }
    }
}).directive("setFocus", function () {
    return function (e, t) {
        t[0].focus()
    }
}).directive("breadcrumbs", ["$state", function (e) {
    return {
        restrict: "AE",
        scope: {project: "=", resource: "="},
        templateUrl: "modules/common/utils/breadcrumbs.html",
        link: function (t) {
            t.goProjectItems = function () {
                e.go("app.projectitems", {projectId: t.project.id, projectName: t.project.name})
            }
        }
    }
}]), function (module) {
    "use strict";
    var e = null;
    $.ui && ($.ui.ddmanager.prepareOffsets = function (e, t) {
        var r, a, o = $.ui.ddmanager.droppables[e.options.scope] || [], n = t ? t.type : null, i = (e.currentItem || e.element).find(":data(ui-droppable)").addBack();
        e:for (r = 0; r < o.length; r++)if (!(o[r].options.disabled || e && !o[r].accept.call(o[r].element[0], e.currentItem || e.element))) {
            for (a = 0; a < i.length; a++)if (i[a] === o[r].element[0]) {
                o[r].proportions().height = 0;
                continue e
            }
            if (o[r].visible = "none" !== o[r].element.css("display"), o[r].visible) {
                "mousedown" === n && o[r]._activate.call(o[r], t), o[r].offset = o[r].element.offset();
                var c = o[r].element[0].getBoundingClientRect();
                o[r].proportions({width: c.width || c.right - c.left, height: c.height || c.bottom - c.top})
            }
        }
    }), module.directive("datavizDraggable", function () {
        var t = {
            "z-index": 999999,
            border: "1px solid gray",
            "border-radius": "2px",
            cursor: "move",
            "max-width": "170px",
            "max-height": "100px",
            opacity: .5,
            overflow: "hidden"
        };
        return {
            restrict: "A",
            scope: {datavizDragstart: "&", datavizDrag: "&", datavizDragend: "&", dragOptions: "@"},
            link: function (r, a, o) {
                var n = {
                    appendTo: "body",
                    delay: 200,
                    distance: 10,
                    scroll: !1,
                    cursor: "move",
                    revert: "invalid",
                    helper: function () {
                        return a.clone().css(t)
                    },
                    start: function (t, a) {
                        try {
                            if (t.setData = function (t, r) {
                                    e || (e = {}), e[t] = r
                                }, !r.datavizDragstart)return;
                            r.$apply(function () {
                                r.datavizDragstart({$event: t})
                            })
                        } catch (o) {
                            console.error(o)
                        }
                    },
                    drag: function (e, t) {
                        try {
                            if (!r.datavizDrag)return;
                            r.datavizDrag({$event: e})
                        } catch (a) {
                            console.error(a)
                        }
                    },
                    stop: function (t, a) {
                        e = null;
                        try {
                            if (!r.datavizDragend)return;
                            r.$apply(function () {
                                r.datavizDragend({$event: t})
                            })
                        } catch (o) {
                            console.error(o)
                        }
                    }
                };
                if (r.dragOptions)var i = angular.extend(n, r.$eval(r.dragOptions)); else var i = n;
                $(a).draggable(i)
            }
        }
    }).directive("datavizDroppable", function () {
        return {
            restrict: "AE",
            scope: {
                datavizAccept: "@",
                datavizNotAccept: "@",
                datavizDragenter: "&",
                datavizDragover: "&",
                datavizDrop: "&",
                datavizDragleave: "&"
            },
            link: function (t, r, a) {
                function o(e, r) {
                    if (!t.datavizAccept)return !1;
                    var a = !1;
                    if (t.datavizNotAccept) {
                        var o = $(t.datavizNotAccept);
                        a = -1 != _.indexOf(o, r.draggable[0])
                    }
                    if (a)return !1;
                    var n = $(t.datavizAccept), i = -1 != _.indexOf(n, r.draggable[0]);
                    return i
                }

                function n(e, r) {
                    try {
                        if (!t.datavizDragover)return;
                        e.source = r[0], t.datavizDragover({$event: e})
                    } catch (a) {
                        console.error(a)
                    }
                }

                var i, c = !1, d = {
                    tolerance: "pointer", over: function (e, r) {
                        if (c = o(e, r)) {
                            try {
                                if (!t.datavizDragenter)return;
                                e.source = r.draggable[0], t.datavizDragenter({$event: e})
                            } catch (a) {
                                console.error(a)
                            }
                            i = (new Date).getTime(), r.draggable.on("drag." + i, function (e) {
                                n(e, r.draggable)
                            })
                        }
                    }, drop: function (r, a) {
                        if (c) {
                            a.draggable.off("drag." + i);
                            try {
                                if (!t.datavizDrop)return;
                                var o = e;
                                r.getData = function () {
                                    return o
                                }, r.source = a.draggable[0], t.datavizDrop({$event: r})
                            } catch (n) {
                                console.error(n)
                            }
                        }
                    }, out: function (e, r) {
                        if (c) {
                            r.draggable.off("drag." + i);
                            try {
                                if (!t.datavizDragleave)return;
                                e.source = r.draggable[0], t.datavizDragleave({$event: e})
                            } catch (a) {
                                console.error(a)
                            }
                        }
                    }
                };
                $(r).droppable(d)
            }
        }
    })
}(angular.module("common.utils.directive"));