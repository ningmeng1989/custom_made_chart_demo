/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("common.dvDropdown", []).constant("datavizDropdownConfig", {openClass: "open"}).service("datavizDropdownService", ["$document", function (n) {
    var e = null;
    this.open = function (n) {
        e && e !== n && (e.isOpen = !1), e = n
    }, this.close = function (n) {
        e === n && (e = null)
    }
}]).controller("datavizDropdownController", ["$scope", "$attrs", "$parse", "datavizDropdownConfig", "datavizDropdownService", "$animate", function (n, e, o, t, i, a) {
    var l, r = this, s = n.$new(), c = t.openClass, u = angular.noop, d = e.onToggle ? o(e.onToggle) : angular.noop;
    this.init = function (t) {
        r.$element = t, e.isOpen && (l = o(e.isOpen), u = l.assign, n.$watch(l, function (n) {
            s.isOpen = !!n
        }))
    }, this.toggle = function (n) {
        return s.isOpen = arguments.length ? !!n : !s.isOpen
    }, this.isOpen = function () {
        return s.isOpen
    }, s.getToggleElement = function () {
        return r.toggleElement
    }, s.focusToggleElement = function () {
        r.toggleElement && r.toggleElement[0].focus()
    }, s.$watch("isOpen", function (e, o) {
        a[e ? "addClass" : "removeClass"](r.$element, c), e ? (s.focusToggleElement(), i.open(s)) : i.close(s), u(n, e), angular.isDefined(e) && e !== o && d(n, {open: !!e})
    }), n.$on("$locationChangeSuccess", function () {
        s.isOpen = !1
    }), n.$on("$destroy", function () {
        s.$destroy()
    })
}]).directive("datavizDropdown", function () {
    return {
        controller: "datavizDropdownController", link: function (n, e, o, t) {
            t.init(e)
        }
    }
}).directive("datavizDropdownToggle", function () {
    return {
        require: "?^datavizDropdown", link: function (n, e, o, t) {
            if (t) {
                t.toggleElement = e;
                var i = function (i) {
                    i.preventDefault(), e.hasClass("disabled") || o.disabled || n.$apply(function () {
                        t.toggle()
                    })
                };
                e.bind("click", i), e.attr({
                    "aria-haspopup": !0,
                    "aria-expanded": !1
                }), n.$watch(t.isOpen, function (n) {
                    e.attr("aria-expanded", !!n)
                }), n.$on("$destroy", function () {
                    e.unbind("click", i)
                })
            }
        }
    }
});