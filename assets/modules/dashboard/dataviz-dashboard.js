/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
!function () {
    "use strict";
    var module = angular.module("dataviz.dashboard", ["common.utils.directive"]), e = "horizontal", t = "left", i = {
        top: "left",
        left: "left",
        bottom: "right",
        right: "right"
    }, n = {top: "vertical", left: "horizontal", bottom: "vertical", right: "horizontal"}, r = function () {
        var e = "100%", i = function (e, t) {
            this.copySize(e), this.parent = t
        };
        return i.prototype.copySize = function (t) {
            this.size = t || e
        }, i.prototype.resetSize = function () {
            this.size = e
        }, i.prototype.addBrother = function (e, i, n) {
            if (this.parent) {
                var r = this.parent;
                if (!r.parent && r.children.length < 2)e.resetSize(), r.append(e), i === t && r.children.reverse(), r.direction = n, r.updateChildrenSize(); else {
                    var o = new a;
                    o.copySize(this.size), o.direction = n, this.resetSize(), e.resetSize(), o.append(this), o.append(e), i === t && o.children.reverse(), o.updateChildrenSize(), r.swap(this, o)
                }
            }
        }, i.prototype.removeSelf = function () {
            this.parent && this.parent.removeChild(this)
        }, i
    }(), o = function () {
        var e = function (e, t, i, n) {
            _.bind(r, this)(e, t), this.type = i, this.resource = n
        };
        return e.prototype = new r, e.prototype.constructor = e, e
    }(), a = function () {
        var e = function (e, t) {
            _.bind(r, this)(e, t), this.children = []
        };
        return e.prototype = new r, e.prototype.updateChildrenSize = function () {
            var e = 0;
            this.children.forEach(function (t) {
                e += parseFloat(t.size)
            }), this.children.forEach(function (t) {
                t.size = 100 * parseFloat(t.size) / e + "%"
            })
        }, e.prototype.removeChild = function (e) {
            if (this.children.splice(_.indexOf(this.children, e), 1), !this.parent) {
                if (!this.children.length) {
                    var t = new o;
                    this.append(t)
                }
                return void this.updateChildrenSize()
            }
            if (this.children.length) {
                var e = this.children[0];
                e.copySize(this.size), this.parent.swap(this, e)
            }
        }, e.prototype.insertBefore = function (e, t) {
            this.children.splice(_.indexOf(this.children, e), 0, t), t.parent = this
        }, e.prototype.insertAfter = function (e, t) {
            this.children.splice(_.indexOf(this.children, e) + 1, 0, t), t.parent = this
        }, e.prototype.swap = function (e, t) {
            this.children.splice(_.indexOf(this.children, e), 1, t), t.parent = this
        }, e.prototype.append = function (e) {
            this.children.push(e), e.parent = this
        }, e.prototype.empty = function () {
            this.children = []
        }, e
    }();
    module.directive("datavizDashboard", ["$compile", "$rootScope", "dashboardService", function (e, t, i) {
        var n = null;
        return {
            restrict: "AE",
            template: '<div class="dv-dashboard"></div>',
            replace: !0,
            scope: {model: "=", selectedWidget: "=", editable: "="},
            link: function (i, r, o) {
                function a() {
                    return i.editable ? '<div dashboard-container widget-container="model"></div>' : '<div dashboard-container-ro widget-container="model"></div>'
                }

                i.$watch("model", function (e, t) {
                    e && i.refresh()
                }), i.$on("element-selected", function (e, t, r) {
                    n != t ? (n && n.removeClass("dv-dashboard-element-selected"), t.addClass("dv-dashboard-element-selected"), n = t, i.selectedWidget = r) : (n.removeClass("dv-dashboard-element-selected"), n = null, i.selectedWidget = null)
                }), i.$on("element-removed", function (e, r, o) {
                    t.$broadcast("dashboard-element-removed", o), r == n && (n = null, i.selectedWidget = null)
                });
                i.refresh = function () {
                    var t = e(a())(i);
                    r.empty().append(t)
                }, i.$on("$destroy", function () {
                })
            }
        }
    }]), module.directive("dashboardContainer", ["$compile", "$rootScope", "dashboardService", function (e, t, i) {
        var n = 0;
        return {
            restrict: "AE",
            template: '<div class="dv-dashboard-container" dashboard-position-size-element><div class="dv-dashboard-container-content" /></div>',
            replace: !0,
            scope: {widgetContainer: "="},
            link: function (i, r, a) {
                function s(e) {
                    var t = "";
                    return e.forEach(function (e) {
                        t += c(e)
                    }), t
                }

                function c(e) {
                    var t = "";
                    return t += l(e), t += p(e)
                }

                function l(e) {
                    return "<div dashboard-separator widget-container='widgetContainer' next-widget='" + e.getSerialNumber() + "' move-end='separatorMoveEnd(percent,next,prev)'/>\n"
                }

                function p(e) {
                    return e instanceof o ? "<div dashboard-element widget='" + e.getSerialNumber() + "'/>\n" : "<div dashboard-container widget-container='" + e.getSerialNumber() + "'/>\n"
                }

                function h(e, t, i) {
                    var n = e[i];
                    z(n), v(n, i);
                    var r = t[i];
                    g(i + 1), S(r)
                }

                function u(e, t) {
                    var i = D(t, e);
                    if (-1 != i) {
                        var n = t[i];
                        g(i), S(n)
                    }
                }

                function f(e, t) {
                    var i = D(e, t);
                    if (-1 != i) {
                        var n = e[i];
                        z(n), v(n, i)
                    }
                }

                function v(t, n) {
                    var r = $(c(t));
                    m(r, n), e(r)(i)
                }

                function g(e) {
                    x[0].removeChild(x.children()[2 * e]), x[0].removeChild(x.children()[2 * e])
                }

                function m(e, t) {
                    0 == t ? x.prepend(e) : $(x.children()[2 * t - 1]).after(e)
                }

                function b(e) {
                    e.forEach(function (e) {
                        z(e)
                    })
                }

                function w(e) {
                    e.forEach(function (e) {
                        S(e)
                    })
                }

                function z(e) {
                    e.getSerialNumber = function (e) {
                        return function () {
                            return "Widget_" + e
                        }
                    }(n++), i[e.getSerialNumber()] = e
                }

                function S(e) {
                    delete i[e.getSerialNumber()]
                }

                function y(e, t) {
                    if (e.length !== t.length)return -1;
                    for (var i = 0; i < e.length; i++)if (e[i] == t[i])return i;
                    return -1
                }

                function D(e, t) {
                    for (var i = 0; i < e.length; i++)if (-1 == _.indexOf(t, e[i]))return i;
                    return -1
                }

                var x = r.find(".dv-dashboard-container-content");
                i.positionSizeWidget = i.widgetContainer, i.unwatch = i.$watchCollection("widgetContainer.children", function (e, t, i) {
                    if (e) {
                        if (!d.isInDocument(r))return void setTimeout(function () {
                            i.$destroy()
                        }, 200);
                        if (e == t)i.refresh(); else {
                            if (!e.length)return;
                            if (e.length > t.length)f(e, t); else if (e.length < t.length)u(e, t); else {
                                var n = D(e, t), o = y(e, t);
                                -1 != n && -1 != o ? h(e, t, n) : (w(t), i.refresh())
                            }
                        }
                    }
                }), i.refresh = function () {
                    x.empty();
                    var t = i.widgetContainer.children;
                    b(t);
                    var n = $(s(t));
                    e(n)(i), x.append(n)
                }, i.separatorMoveEnd = function (e, n, r) {
                    var o = i.widgetContainer.children;
                    i.$apply(function () {
                        o[r].size = parseFloat(o[r].size) + parseFloat(e) + "%", o[n].size = parseFloat(o[n].size) - parseFloat(e) + "%"
                    }), t.$broadcast("dashboard-element-resized")
                }
            }
        }
    }]), module.directive("dashboardElement", ["$compile", "$rootScope", "$templateRequest", "dashboardService", function (e, t, r, a) {
        var s = 0;
        return {
            restrict: "AE",
            template: '<div class="dv-dashboard-element" dashboard-position-size-element ng-click="clickElement();" ng-dblclick="dblClickElement($event);"><dashboard-droppable-element widget="widget" accept="{{accept}}" not-accept=".widget-{{number}}" drop="drop(event,position)" class-prefix="{{classPrefix}}"><div class="dataviz-draggable widget-{{number}}" dataviz-draggable dataviz-dragstart="dragStart($event)"><div class="dv-dashboard-element-content"></div></div></dashboard-droppable-element><span class="dv-dashboard-element-remover" ng-if="widget.type" ng-click="deleteElement($event)">&times;</span></div>',
            replace: !0,
            scope: {widget: "="},
            link: function (c, l, p) {
                function h(t) {
                    var i = $(t), n = c.$new();
                    e(i)(n), g.append(i)
                }

                function u(e, r) {
                    "center" === r ? (c.widget.type && t.$broadcast("dashboard-element-removed", c.widget), c.widget.type = e.type, c.widget.resource = e.resource) : c.widget.addBrother(e, i[r], n[r]), t.$broadcast("dashboard-element-added", e)
                }

                function f(e, t) {
                    var i = new o;
                    i.type = e.type, e.resourceFunc ? e.resourceFunc().then(function (e) {
                        i.resource = e, u(i, t)
                    }, function () {
                    }) : (i.resource = e.resource, u(i, t))
                }

                function v(e, t) {
                    var i = e.widget;
                    i.removeSelf(), u(i, t)
                }

                c.accept = a.supportDrop(c.widget.type) ? ".dataviz-draggable" : ".nothing", c.classPrefix = "draggable-drophint-", c.number = s++, c.positionSizeWidget = c.widget, c.editable = !0;
                var g = l.find(".dv-dashboard-element-content");
                c.clickElement = function () {
                    c.$emit("element-selected", l, c.widget)
                }, c.dblClickElement = function (e) {
                    e.stopPropagation(), t.$broadcast("dashboard-element-doubleclicked", c.widget)
                }, c.dragStart = function (e) {
                    e.setData("widget", c.widget), e.setData("isInner", !0)
                }, c.deleteElement = function (e) {
                    e && e.stopPropagation(), c.widget.type && (c.widget.removeSelf(), c.$emit("element-removed", l, c.widget))
                };
                c.$watch("widget.resource", function (e, t) {
                    if (!d.isInDocument(l))return void setTimeout(function () {
                        c.$destroy()
                    }, 200);
                    var i = g.children();
                    if (i.length && (i.scope().$destroy(), i.remove()), e) {
                        var n = a.getTemplateUrl(c.widget.type);
                        r(n, !0).then(function (e) {
                            h(e)
                        })
                    }
                });
                c.drop = function (e, t) {
                    var i = e.getData();
                    i && (i.isInner ? v(i, t) : f(i, t))
                }
            }
        }
    }]), module.directive("datavizDashboardContainer", ["$rootScope", "dashboardService", function (e, r) {
        return {
            restrict: "AE",
            replace: !0,
            transclude: !0,
            template: '<div class="w-full h-full pos-rlt"><dashboard-droppable-element accept="{{accept}}" drop="drop(event,position)" class-prefix="{{classPrefix}}"><div class="w-full h-full" ng-transclude></div></dashboard-droppable-element></div>',
            scope: {pageModel: "="},
            link: function (d, s, c) {
                function l(r, o) {
                    var s = n[o];
                    if (r.size = "10%", d.pageModel.children.length < 2)d.pageModel.append(r); else {
                        var c = new a;
                        c.direction = d.pageModel.direction, d.pageModel.children.forEach(function (e) {
                            c.append(e)
                        }), d.pageModel.empty(), d.pageModel.append(c), d.pageModel.append(r)
                    }
                    d.pageModel.direction = s, i[o] === t && d.pageModel.children.reverse(), d.pageModel.updateChildrenSize(), e.$broadcast("dashboard-element-added", r)
                }

                function p(e, t) {
                    if (h())return void alert("已经有一个标题了！");
                    var i = new o;
                    i.type = e.type, e.resourceFunc ? e.resourceFunc().then(function (e) {
                        i.resource = e, l(i, t)
                    }, function () {
                    }) : (i.resource = e.resource, l(i, t))
                }

                function h() {
                    return d.pageModel.children[0].type === r.resourceTypes.TITLE
                }

                function u(e, t) {
                    var i = e.widget;
                    i.removeSelf(), l(i, t)
                }

                d.accept = ".dataviz-title", d.classPrefix = "title-drophint-", d.drop = function (e, t) {
                    if ("center" != t) {
                        var i = e.getData();
                        i.isInner ? u(i, t) : p(i, t)
                    }
                }
            }
        }
    }]), module.directive("dashboardDroppableElement", ["$rootScope", function (e) {
        return {
            restrict: "AE",
            template: '<div style="width:100%;height:100%"><div style="width:100%;height:100%" class="dataviz-droppable" dataviz-droppable dataviz-accept="{{accept}}" dataviz-not-accept="{{notAccept}}"dataviz-dragover="dragOver($event)" dataviz-drop="doDrop($event)" dataviz-dragleave="dragLeave($event)"><div style="width:100%;height:100%" ng-transclude></div><div class="dv-dashboard-drophint"><div></div></div></div>',
            scope: {widget: "=", accept: "@", notAccept: "@", drop: "&", classPrefix: "@"},
            replace: !0,
            transclude: !0,
            link: function (e, t, i) {
                function n() {
                    var t = e.classPrefix + o;
                    a.removeClass().addClass(t + " dv-dashboard-drophint").show()
                }

                function r() {
                    a.hide()
                }

                var o = null, a = t.find(".dv-dashboard-drophint");
                e.dragOver = function (i) {
                    o = !e.widget || e.widget.type ? d.getMousePosition(t[0], i) : "center", n()
                }, e.doDrop = function (t) {
                    r(), e.drop({event: t, position: o}), o = null
                }, e.dragLeave = function (e) {
                    r()
                }
            }
        }
    }]), module.directive("dashboardPositionSizeElement", [function () {
        return {
            restrict: "AE", scope: !1, link: function (t, i, n) {
                function r() {
                    var i = t.positionSizeWidget;
                    if (i && i.parent) {
                        var n = i.parent.children.length;
                        if (n > 1) {
                            var r = 6 * (n - 1) / n;
                            r = Math.ceil(r), i.parent.direction === e ? (t.widthDelta = r + "px", t.heightDelta = "0px") : (t.widthDelta = "0px", t.heightDelta = r + "px")
                        } else t.widthDelta = "0px", t.heightDelta = "0px"
                    } else t.widthDelta = "0px", t.heightDelta = "0px"
                }

                function o(e) {
                    if (e.children.length < 2)return null;
                    for (var i = 0; i < e.children.length; i++)if (e.children[i] != t.positionSizeWidget)return e.children[i];
                    return null
                }

                t.widthDelta = "3px", t.heightDelta = "3px", t.$watch("positionSizeWidget.size + positionSizeWidget.parent.direction", function (n, o) {
                    if (t.positionSizeWidget) {
                        if (!d.isInDocument(i))return void setTimeout(function () {
                            t.$destroy()
                        }, 200);
                        r(), t.positionSizeWidget.parent && t.positionSizeWidget.parent.direction ? t.positionSizeWidget.parent.direction === e ? (i.css("width", "calc(" + t.positionSizeWidget.size + " - " + t.widthDelta + ")"), i.css("height", "calc(100% - " + t.heightDelta + ")")) : (i.css("width", "calc(100% - " + t.widthDelta + ")"), i.css("height", "calc(" + t.positionSizeWidget.size + " - " + t.heightDelta + ")")) : (i.css("width", "calc(100% - " + t.widthDelta + ")"), i.css("height", "calc(100% - " + t.heightDelta + ")"))
                    }
                }), t.$watch("positionSizeWidget", function (n, r) {
                    if (!d.isInDocument(i))return void setTimeout(function () {
                        t.$destroy()
                    }, 200);
                    if (t.positionSizeWidget) {
                        var a = t.positionSizeWidget, s = a.parent;
                        if (s && n != r) {
                            var c = o(s);
                            s.direction === e ? a.size = 100 * parseFloat(a.size) / parseFloat(i.parent().width()) + "%" : a.size = 100 * parseFloat(a.size) / parseFloat(i.parent().height()) + "%", c && (c.size = 100 - parseFloat(a.size) + "%")
                        }
                    }
                })
            }
        }
    }]), module.directive("dashboardSeparator", ["dashboardService", function (t) {
        return {
            restrict: "AE",
            template: '<div class="dv-dashboard-separator dv-dashboard-separator-{{getDirection()}}"></div>',
            replace: !0,
            scope: {widgetContainer: "=", nextWidget: "=", moveEnd: "&"},
            link: function (i, n, r) {
                i.$on("$destroy", function () {
                    n.off("mousedown")
                });
                var o, a = null;
                n.on("mousedown", function (r) {
                    function s(e) {
                        if ($(a).removeClass("active"), "horizontal" == i.direction) {
                            var t = (e.pageX - h) / o;
                            a = l("left"), p("width", t)
                        } else {
                            var n = (e.pageY - u) / o;
                            a = l("top"), p("height", n)
                        }
                        a && $(a).addClass("active")
                    }

                    function c(t) {
                        d.enableDrag(".dv-dashboard"), $(document).off("mousemove.dashboard"), $(document).off("mouseup.dashboard");
                        var r, s;
                        if (i.direction == e) {
                            if (a) {
                                var c = $(a).offset();
                                r = (c.left - g.left) / o, p("width", r)
                            } else r = (n.offset().left - g.left) / o;
                            s = 100 * r / f
                        } else {
                            if (a) {
                                var c = $(a).offset();
                                r = (c.top - g.top) / o, p("height", r)
                            } else r = (n.offset().top - g.top) / o;
                            s = 100 * r / v
                        }
                        i.moveEnd && i.moveEnd({
                            percent: s,
                            next: i.nextWidgetIndex,
                            prev: i.nextWidgetIndex - 1
                        }), n.removeClass("active"), $(a).removeClass("active")
                    }

                    function l(e) {
                        for (var t, r = $(".dv-dashboard-separator-" + i.direction), a = n.offset(), d = null, s = 0; s < r.length; s++)if (r[s] != n[0]) {
                            var c = $(r[s]).offset(), l = parseFloat(c[e]) - parseFloat(a[e]);
                            if (Math.abs(l) <= 20 / o) {
                                if (!d && Math.abs(l) > Math.abs(t))continue;
                                d = r[s], t = l
                            }
                        }
                        return d
                    }

                    function p(e, t) {
                        var i = n.prev(), r = parseFloat(m[e]) + parseFloat(t) - .5, a = n.next(), d = parseFloat(b[e]) - parseFloat(t) - .5;
                        15 / o > r || 15 / o > d || (i.css(e, r + "px"), a.css(e, d + "px"))
                    }

                    d.disableDrag(".dv-dashboard"), o = t.getDashboardScale(), $(document).on("mousemove.dashboard", s), $(document).on("mouseup.dashboard", c), n.addClass("active");
                    var h = r.pageX, u = r.pageY, f = n.parent().width(), v = n.parent().height(), g = n.offset(), m = {};
                    m.width = n.prev().css("width"), m.height = n.prev().css("height");
                    var b = {};
                    b.width = n.next().css("width"), b.height = n.next().css("height")
                }), i.getDirection = function () {
                    return i.nextWidgetIndex = i.widgetContainer ? _.indexOf(i.widgetContainer.children, i.nextWidget) : -1, 0 == i.nextWidgetIndex || -1 == i.nextWidgetIndex ? "" : i.direction = i.widgetContainer.direction
                }
            }
        }
    }]), module.directive("dashboardContainerRo", ["$compile", function (e) {
        var t = 0;
        return {
            restrict: "AE",
            template: '<div class="dv-dashboard-container" dashboard-position-size-element-ro><div class="dv-dashboard-container-content" /></div>',
            scope: {widgetContainer: "="},
            replace: !0,
            link: function (i, n, r) {
                function a(e) {
                    e.forEach(function (e) {
                        e.getSerialNumber = function (e) {
                            return function () {
                                return "Widget_" + e
                            }
                        }(t++), i[e.getSerialNumber()] = e
                    })
                }

                function d(e) {
                    var t = "";
                    return e.forEach(function (e) {
                        t += s(e)
                    }), t
                }

                function s(e) {
                    return e instanceof o ? "<div dashboard-element-ro widget='" + e.getSerialNumber() + "'/>\n" : "<div dashboard-container-ro widget-container='" + e.getSerialNumber() + "'/>\n"
                }

                var c = n.find(".dv-dashboard-container-content"), l = i.widgetContainer.children;
                a(l);
                var p = $(d(l));
                e(p)(i), c.append(p)
            }
        }
    }]), module.directive("dashboardElementRo", ["$compile", "$templateRequest", "dashboardService", function (e, t, i) {
        return {
            restrict: "AE",
            template: '<div class="dv-dashboard-element-ro" dashboard-position-size-element-ro position-size-widget="widget"><div class="dv-dashboard-element-content"/></div>',
            replace: !0,
            scope: {widget: "="},
            transclude: !0,
            link: function (n, r, o) {
                function a(t) {
                    var i = $(t);
                    e(i)(n), d.append(i)
                }

                n.editable = !1;
                var d = r.find(".dv-dashboard-element-content");
                if (n.widget.resource) {
                    var s = i.getTemplateUrl(n.widget.type);
                    t(s, !0).then(function (e) {
                        a(e)
                    })
                }
            }
        }
    }]), module.directive("dashboardPositionSizeElementRo", [function () {
        return {
            restrict: "AE", link: function (t, i, n) {
                t.widthDelta = "0px", t.heightDelta = "0px", t.positionSizeWidget = t.widgetContainer || t.widget, t.positionSizeWidget.parent && t.positionSizeWidget.parent.direction ? t.positionSizeWidget.parent.direction === e ? (i.css("width", "calc(" + t.positionSizeWidget.size + " - " + t.widthDelta + ")"), i.css("height", "calc(100% - " + t.heightDelta + ")")) : (i.css("width", "calc(100% - " + t.widthDelta + ")"), i.css("height", "calc(" + t.positionSizeWidget.size + " - " + t.heightDelta + ")")) : (i.css("width", "calc(100% - " + t.widthDelta + ")"), i.css("height", "calc(100% - " + t.heightDelta + ")"))
            }
        }
    }]), module.factory("dashboardService", function () {
        function e(e) {
            return Math.floor((e - 1) / 2)
        }

        var t = {
            CHART: "chart",
            IMAGE: "image",
            PAGE: "page",
            BLANK: "blank",
            TEXT: "text",
            TITLE: "title"
        }, i = {templateDir: "", prefix: "", suffix: ""}, n = 1;
        return {
            getInitWidgetTree: function () {
                var e = new a;
                return e.append(new o), e
            }, getInitWidgetArray: function () {
                return this.treeToArray(this.getInitWidgetTree())
            }, resourceTypes: t, setTemplateConfig: function (e) {
                i = e
            }, getTemplateUrl: function (e) {
                return e === t.TITLE && (e = t.TEXT), i.templateDir + i.prefix + e + i.suffix + ".html"
            }, supportDrop: function (e) {
                return e !== t.TITLE
            }, traverseTree: function (e, t) {
                var i = [];
                for (i.push(e); i.length;) {
                    var n = i.shift();
                    if (n instanceof a) {
                        var r = n.children;
                        i.push(r[0]), r[1] && i.push(r[1])
                    } else t(n)
                }
            }, treeToArray: function (e) {
                var t = ((new Date).getTime(), []), i = [];
                for (t.push([0, e]); t.length;) {
                    var n = {}, r = t.shift();
                    if (r[1] instanceof a) {
                        r[1].direction && (n.direction = r[1].direction), n.id = r[0], n.size = r[1].size;
                        var o = r[1].children;
                        t.push([2 * r[0] + 1, o[0]]), o[1] && t.push([2 * r[0] + 2, o[1]])
                    } else n.id = r[0], r[1].props && (n.props = r[1].props), r[1].resource && (n.resource = r[1].resource), n.size = r[1].size, r[1].type && (n.type = r[1].type);
                    i.push(n)
                }
                return i
            }, arrayToTree: function (t) {
                var i = ((new Date).getTime(), []), n = new a(t[0].size, null);
                n.direction = t[0].direction, i[0] = n;
                for (var r = 1; r < t.length; r++) {
                    if (t[r].direction) {
                        var d = new a(t[r].size);
                        d.direction = t[r].direction
                    } else {
                        var d = new o(t[r].size);
                        d.type = t[r].type, d.resource = t[r].resource, d.props = t[r].props
                    }
                    i[t[r].id] = d;
                    var s = i[e(t[r].id)];
                    s.append(d)
                }
                return n
            }, setDashboardScale: function (e) {
                n = e
            }, getDashboardScale: function () {
                return n
            }
        }
    });
    var d = {
        getMousePosition: function (e, t) {
            var i = e.getBoundingClientRect(), n = (t.pageX - i.left) / i.width, r = (t.pageY - i.top) / i.height;
            if (n >= r) {
                if (.2 >= r)return "top";
                if (n >= .8)return "right"
            } else {
                if (.2 >= n)return "left";
                if (r >= .8)return "bottom"
            }
            return "center"
        }, isInDocument: function (e) {
            return $(document).find(e).length > 0
        }, disableDrag: function (e) {
            var t = $(e).find("[dataviz-draggable]");
            console.log("disable: " + t.length), t.draggable("disable")
        }, enableDrag: function (e) {
            var t = $(e).find("[dataviz-draggable]");
            console.log("enable: " + t.length), t.draggable("enable")
        }
    }
}();