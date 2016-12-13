/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
var _semantics_diagram_relationViewer_cls = {
    _fkId: null,
    _viewer1: null,
    _viewer2: null,
    _arrow: null,
    _events: null,
    _topics: null,
    _selected: null,
    _joinType: null,
    _surface: null,
    _relation: null,
    constructor: function (e, t, y, s, i) {
        this._fkId = e, this._viewer1 = t, this._viewer2 = y, this._selected = !1, this._joinType = s.type, this._surface = i.createGroup(), this._relation = s, this._initView(), this._initEvent(), this._adjustArrow()
    },
    destroy: function () {
        this._surface.removeShape(), dojo.forEach(this._events, dojo.disconnect), dojo.forEach(this._topics, dojo.unsubscribe)
    },
    _initView: function () {
        this._arrow = new semantics.diagram.PlainArrow, this._arrow.setGraphicContext({surface: this._surface})
    },
    refresh: function (e) {
        this._joinType = e.type, this._relation = e, this._arrow.changeArrowDirection(this._joinType)
    },
    _initEvent: function () {
        this._events = [], this._events.push(dojo.connect(this._viewer1, "onMoved", this, this._viewerMoved)), this._events.push(dojo.connect(this._viewer2, "onMoved", this, this._viewerMoved)), this._events.push(dojo.connect(document, "keydown", this, this._relationKeydown)), this._arrow.connectselect(this, this.relationSelected), this._arrow.connectedit(this, this._relationEdit), this._topics = [], this._topics.push(dojo.subscribe("/semantics/clickCancel", this, this.relationDeselected))
    },
    _adjustArrow: function () {
        var e = this._arrow, t = this._viewer1.getAnchorPair(this._viewer2);
        if (t[0].parent = {}, t[0].parent.x = this._viewer1.getLocation().dx, t[0].parent.y = this._viewer1.getLocation().dy, t[0].parent.height = this._viewer1.getHeight(), t[0].parent.width = this._viewer1.getWidth(), t[1].parent = {}, t[1].parent.x = this._viewer2.getLocation().dx, t[1].parent.y = this._viewer2.getLocation().dy, t[1].parent.height = this._viewer2.getHeight(), t[1].parent.width = this._viewer2.getWidth(), t[0].lx < t[1].lx) {
            var y = this._computePath(t[0], t[1]), s = y.pop();
            e.setPath(y, this._joinType, s)
        } else {
            var y = this._computePath(t[1], t[0]), s = y.pop();
            "left" == this._joinType ? e.setPath(y, "right", s) : "right" == this._joinType ? e.setPath(y, "left", s) : e.setPath(y, this._joinType, s)
        }
    },
    _computePath: function (e, t) {
        var y = 40, s = 90, i = 50, r = [];
        if (e.rx < t.lx)if (t.lx - e.rx >= s)if (e.y == t.y)r.push({x: e.rx, y: e.y}), r.push({
            x: t.lx,
            y: t.y
        }), r.push({x: (e.rx + t.lx) / 2, y: t.y}); else if (Math.abs(e.y - t.y) >= i) {
            var h = t.lx - e.rx;
            r.push({x: e.rx, y: e.y}), r.push({x: e.rx + h / 2, y: e.y}), r.push({
                x: e.rx + h / 2,
                y: t.y
            }), r.push({x: t.lx, y: t.y}), r.push({x: e.rx + h / 2, y: (e.y + t.y) / 2})
        } else {
            var h = t.lx - e.rx, x = t.y - e.y;
            r.push({x: e.rx, y: e.y}), r.push({x: e.rx + h / 4, y: e.y}), r.push({
                x: e.rx + h / 4,
                y: e.y + x / 2
            }), r.push({x: t.lx - h / 4, y: t.y - x / 2}), r.push({x: t.lx - h / 4, y: t.y}), r.push({
                x: t.lx,
                y: t.y
            }), r.push({x: (e.rx + t.lx) / 2, y: (e.y + t.y) / 2})
        } else if (Math.abs(e.y - t.y) >= i)e.y > t.y && e.lx > y ? (r.push({x: e.lx, y: e.y}), r.push({
            x: e.lx - y,
            y: e.y
        }), r.push({x: e.lx - y, y: t.y}), r.push({
            x: t.lx,
            y: t.y
        }), t.lx - e.lx + y > 2 * (e.y - t.y) ? r.push({x: (e.lx + t.lx - y) / 2, y: t.y}) : r.push({
            x: e.lx - y,
            y: (e.y + t.y) / 2
        })) : e.y < t.y && (r.push({x: e.rx, y: e.y}), r.push({x: t.rx + y, y: e.y}), r.push({
            x: t.rx + y,
            y: t.y
        }), r.push({x: t.rx, y: t.y}), t.rx + y - e.rx > 2 * (t.y - e.y) ? r.push({
            x: (e.rx + t.rx + y) / 2,
            y: e.y
        }) : r.push({x: t.rx + y, y: (e.y + t.y) / 2})); else {
            var n = e.parent.y > t.parent.y ? t.parent.y : e.parent.y, p = e.parent.y + e.parent.height > t.parent.y + t.parent.height ? e.parent.y + e.parent.height : t.parent.y + t.parent.height, a = e.y - n < p - e.y && n > y ? n - y : p + y;
            r.push({x: e.lx, y: e.y});
            var o = e.lx - y > 0 ? e.lx - y : 0;
            r.push({x: o, y: e.y}), r.push({x: o, y: a}), r.push({x: t.rx + y, y: a}), r.push({
                x: t.rx + y,
                y: t.y
            }), r.push({x: t.rx, y: t.y}), r.push({x: (o + t.rx + y) / 2, y: a})
        } else if (this._containPoint(e.parent, {x: t.lx, y: t.y}))if (!this._containPoint(t.parent, {
                x: e.rx,
                y: e.y
            }) && Math.abs(e.y - t.y) >= i)e.y > t.y && e.lx > y ? (r.push({x: e.lx, y: e.y}), r.push({
            x: e.lx - y,
            y: e.y
        }), r.push({x: e.lx - y, y: t.y}), r.push({
            x: t.lx,
            y: t.y
        }), t.lx - e.lx + y > 2 * (e.y - t.y) ? r.push({x: (e.lx + t.lx - y) / 2, y: t.y}) : r.push({
            x: e.lx - y,
            y: (e.y + t.y) / 2
        })) : (r.push({x: e.rx, y: e.y}), r.push({x: t.rx + y, y: e.y}), r.push({x: t.rx + y, y: t.y}), r.push({
            x: t.rx,
            y: t.y
        }), t.rx + y - e.rx > 2 * (t.y - e.y) ? r.push({x: (e.rx + t.rx + y) / 2, y: e.y}) : r.push({
            x: t.rx + y,
            y: (e.y + t.y) / 2
        })); else {
            var n = e.parent.y > t.parent.y ? t.parent.y : e.parent.y, p = e.parent.y + e.parent.height > t.parent.y + t.parent.height ? e.parent.y + e.parent.height : t.parent.y + t.parent.height, a = e.y - n < p - e.y && n > y ? n - y : p + y;
            r.push({x: e.lx, y: e.y});
            var o = e.lx - y > 0 ? e.lx - y : 0;
            r.push({x: o, y: e.y}), r.push({x: o, y: a}), r.push({x: t.rx + y, y: a}), r.push({
                x: t.rx + y,
                y: t.y
            }), r.push({x: t.rx, y: t.y}), r.push({x: (o + t.rx + y) / 2, y: a})
        } else if (Math.abs(e.y - t.y) >= i)e.y > t.y && e.lx > y ? (r.push({x: e.lx, y: e.y}), r.push({
            x: e.lx - y,
            y: e.y
        }), r.push({x: e.lx - y, y: t.y}), r.push({
            x: t.lx,
            y: t.y
        }), t.lx - e.lx + y > 2 * (e.y - t.y) ? r.push({x: (e.lx + t.lx - y) / 2, y: t.y}) : r.push({
            x: e.lx - y,
            y: (e.y + t.y) / 2
        })) : (r.push({x: e.rx, y: e.y}), r.push({x: t.rx + y, y: e.y}), r.push({x: t.rx + y, y: t.y}), r.push({
            x: t.rx,
            y: t.y
        }), t.rx + y - e.rx > 2 * (t.y - e.y) ? r.push({x: (e.rx + t.rx + y) / 2, y: e.y}) : r.push({
            x: t.rx + y,
            y: (e.y + t.y) / 2
        })); else {
            var n = e.parent.y > t.parent.y ? t.parent.y : e.parent.y, p = e.parent.y + e.parent.height > t.parent.y + t.parent.height ? e.parent.y + e.parent.height : t.parent.y + t.parent.height, a = e.y - n < p - e.y && n > y ? n - y : p + y;
            r.push({x: e.lx, y: e.y});
            var o = e.lx - y > 0 ? e.lx - y : 0;
            r.push({x: o, y: e.y}), r.push({x: o, y: a}), r.push({x: t.rx + y, y: a}), r.push({
                x: t.rx + y,
                y: t.y
            }), r.push({x: t.rx, y: t.y}), r.push({x: (o + t.rx + y) / 2, y: a})
        }
        return r
    },
    _containPoint: function (e, t) {
        return t.x > e.x && t.x - e.x < e.width && t.y > e.y && t.y - e.y < e.height
    },
    _viewerMoved: function (e, t) {
        this._adjustArrow()
    },
    _relationEdit: function (e) {
        dojo.publish("/semantics/editRelation", [this._viewer1.infoSet, this._viewer2.infoSet, this._relation]), dojo.stopEvent(e)
    },
    relationSelected: function (e) {
        dojo.publish("/semantics/clickCancel", []), this._selected = !0, this._arrow.selected(this._selected), e && dojo.stopEvent(e)
    },
    relationDeselected: function () {
        this._selected = !1, this._arrow.selected(this._selected)
    },
    _relationKeydown: function (e) {
        this._selected && e.keyCode == dojo.keys.DELETE && (dojo.publish("/semantics/deleteRelation", [this._viewer1.infoSet.id, this._viewer2.infoSet.id, this._fkId]), dojo.stopEvent(e))
    }
};
dojo.declare("semantics.diagram.RelationViewer", null, _semantics_diagram_relationViewer_cls);