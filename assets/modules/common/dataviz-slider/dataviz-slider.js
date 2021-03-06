/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
window.AngularSlider = function (e, n, t) {
    function i(e) {
        p.cssText = e
    }

    function r(e, n) {
        return typeof e === n
    }

    function a() {
        u.inputtypes = function (e) {
            for (var i, r, a, l = 0, s = e.length; s > l; l++)b.setAttribute("type", r = e[l]), i = "text" !== b.type, i && (b.value = h, b.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(r) && b.style.WebkitAppearance !== t ? (c.appendChild(b), a = n.defaultView, i = a.getComputedStyle && "textfield" !== a.getComputedStyle(b, null).WebkitAppearance && 0 !== b.offsetHeight, c.removeChild(b)) : /^(search|tel)$/.test(r) || (i = /^(url|email)$/.test(r) ? b.checkValidity && b.checkValidity() === !1 : b.value != h)), g[e[l]] = !!i;
            return g
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    var l, s, o = "2.7.1", u = {}, c = n.documentElement, f = "modernizr", d = n.createElement(f), p = d.style, b = n.createElement("input"), h = ":)", m = ({}.toString, {}), g = {}, v = [], B = v.slice, y = {}.hasOwnProperty;
    s = r(y, "undefined") || r(y.call, "undefined") ? function (e, n) {
        return n in e && r(e.constructor.prototype[n], "undefined")
    } : function (e, n) {
        return y.call(e, n)
    }, Function.prototype.bind || (Function.prototype.bind = function (e) {
        var n = this;
        if ("function" != typeof n)throw new TypeError;
        var t = B.call(arguments, 1), i = function () {
            if (this instanceof i) {
                var r = function () {
                };
                r.prototype = n.prototype;
                var a = new r, l = n.apply(a, t.concat(B.call(arguments)));
                return Object(l) === l ? l : a
            }
            return n.apply(e, t.concat(B.call(arguments)))
        };
        return i
    });
    for (var w in m)s(m, w) && (l = w.toLowerCase(), u[l] = m[w](), v.push((u[l] ? "" : "no-") + l));
    return u.input || a(), u.addTest = function (e, n) {
        if ("object" == typeof e)for (var i in e)s(e, i) && u.addTest(i, e[i]); else {
            if (e = e.toLowerCase(), u[e] !== t)return u;
            n = "function" == typeof n ? n() : n, "undefined" != typeof enableClasses && enableClasses && (c.className += " " + (n ? "" : "no-") + e), u[e] = n
        }
        return u
    }, i(""), d = b = null, u._version = o, u
}(this, this.document), function (e, n, t) {
    function i(e) {
        return "[object Function]" == m.call(e)
    }

    function r(e) {
        return "string" == typeof e
    }

    function a() {
    }

    function l(e) {
        return !e || "loaded" == e || "complete" == e || "uninitialized" == e
    }

    function s() {
        var e = g.shift();
        v = 1, e ? e.t ? b(function () {
            ("c" == e.t ? d.injectCss : d.injectJs)(e.s, 0, e.a, e.x, e.e, 1)
        }, 0) : (e(), s()) : v = 0
    }

    function o(e, t, i, r, a, o, u) {
        function c(n) {
            if (!p && l(f.readyState) && (B.r = p = 1, !v && s(), f.onload = f.onreadystatechange = null, n)) {
                "img" != e && b(function () {
                    w.removeChild(f)
                }, 50);
                for (var i in C[t])C[t].hasOwnProperty(i) && C[t][i].onload()
            }
        }

        var u = u || d.errorTimeout, f = n.createElement(e), p = 0, m = 0, B = {t: i, s: t, e: a, a: o, x: u};
        1 === C[t] && (m = 1, C[t] = []), "object" == e ? f.data = t : (f.src = t, f.type = e), f.width = f.height = "0", f.onerror = f.onload = f.onreadystatechange = function () {
            c.call(this, m)
        }, g.splice(r, 0, B), "img" != e && (m || 2 === C[t] ? (w.insertBefore(f, y ? null : h), b(c, u)) : C[t].push(f))
    }

    function u(e, n, t, i, a) {
        return v = 0, n = n || "j", r(e) ? o("c" == n ? F : x, e, n, this.i++, t, i, a) : (g.splice(this.i++, 0, e), 1 == g.length && s()), this
    }

    function c() {
        var e = d;
        return e.loader = {load: u, i: 0}, e
    }

    var f, d, p = n.documentElement, b = e.setTimeout, h = n.getElementsByTagName("script")[0], m = {}.toString, g = [], v = 0, B = "MozAppearance" in p.style, y = B && !!n.createRange().compareNode, w = y ? p : h.parentNode, p = e.opera && "[object Opera]" == m.call(e.opera), p = !!n.attachEvent && !p, x = B ? "object" : p ? "script" : "img", F = p ? "script" : x, S = Array.isArray || function (e) {
            return "[object Array]" == m.call(e)
        }, P = [], C = {}, M = {
        timeout: function (e, n) {
            return n.length && (e.timeout = n[0]), e
        }
    };
    d = function (e) {
        function n(e) {
            var n, t, i, e = e.split("!"), r = P.length, a = e.pop(), l = e.length, a = {
                url: a,
                origUrl: a,
                prefixes: e
            };
            for (t = 0; l > t; t++)i = e[t].split("="), (n = M[i.shift()]) && (a = n(a, i));
            for (t = 0; r > t; t++)a = P[t](a);
            return a
        }

        function l(e, r, a, l, s) {
            var o = n(e), u = o.autoCallback;
            o.url.split(".").pop().split("?").shift(), o.bypass || (r && (r = i(r) ? r : r[e] || r[l] || r[e.split("/").pop().split("?")[0]]), o.instead ? o.instead(e, r, a, l, s) : (C[o.url] ? o.noexec = !0 : C[o.url] = 1, a.load(o.url, o.forceCSS || !o.forceJS && "css" == o.url.split(".").pop().split("?").shift() ? "c" : t, o.noexec, o.attrs, o.timeout), (i(r) || i(u)) && a.load(function () {
                c(), r && r(o.origUrl, s, l), u && u(o.origUrl, s, l), C[o.url] = 2
            })))
        }

        function s(e, n) {
            function t(e, t) {
                if (e) {
                    if (r(e))t || (f = function () {
                        var e = [].slice.call(arguments);
                        d.apply(this, e), p()
                    }), l(e, f, n, 0, u); else if (Object(e) === e)for (o in s = function () {
                        var n, t = 0;
                        for (n in e)e.hasOwnProperty(n) && t++;
                        return t
                    }(), e)e.hasOwnProperty(o) && (!t && !--s && (i(f) ? f = function () {
                        var e = [].slice.call(arguments);
                        d.apply(this, e), p()
                    } : f[o] = function (e) {
                        return function () {
                            var n = [].slice.call(arguments);
                            e && e.apply(this, n), p()
                        }
                    }(d[o])), l(e[o], f, n, o, u))
                } else!t && p()
            }

            var s, o, u = !!e.test, c = e.load || e.both, f = e.callback || a, d = f, p = e.complete || a;
            t(u ? e.yep : e.nope, !!c), c && t(c)
        }

        var o, u, f = this.yepnope.loader;
        if (r(e))l(e, 0, f, 0); else if (S(e))for (o = 0; o < e.length; o++)u = e[o], r(u) ? l(u, 0, f, 0) : S(u) ? d(u) : Object(u) === u && s(u, f); else Object(e) === e && s(e, f)
    }, d.addPrefix = function (e, n) {
        M[e] = n
    }, d.addFilter = function (e) {
        P.push(e)
    }, d.errorTimeout = 1e4, null == n.readyState && n.addEventListener && (n.readyState = "loading", n.addEventListener("DOMContentLoaded", f = function () {
        n.removeEventListener("DOMContentLoaded", f, 0), n.readyState = "complete"
    }, 0)), e.yepnope = c(), e.yepnope.executeStack = s, e.yepnope.injectJs = function (e, t, i, r, o, u) {
        var c, f, p = n.createElement("script"), r = r || d.errorTimeout;
        p.src = e;
        for (f in i)p.setAttribute(f, i[f]);
        t = u ? s : t || a, p.onreadystatechange = p.onload = function () {
            !c && l(p.readyState) && (c = 1, t(), p.onload = p.onreadystatechange = null)
        }, b(function () {
            c || (c = 1, t(1))
        }, r), o ? p.onload() : h.parentNode.insertBefore(p, h)
    }, e.yepnope.injectCss = function (e, t, i, r, l, o) {
        var u, r = n.createElement("link"), t = o ? s : t || a;
        r.href = e, r.rel = "stylesheet", r.type = "text/css";
        for (u in i)r.setAttribute(u, i[u]);
        l || (h.parentNode.insertBefore(r, h), b(t, 0))
    }
}(this, document), AngularSlider.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0))
}, angular.module("dataviz.slider", ["ngTouch"]).directive("dvslider", ["$timeout", "$document", "$interpolate", "$swipe", function (e, n, t, i) {
    function r(e) {
        return angular.element(e)
    }

    function a(e) {
        return "" + e + "px"
    }

    function l(e, n) {
        return e.css({opacity: n})
    }

    function s(e) {
        return l(e, 0)
    }

    function o(e, n) {
        return e.css({left: n})
    }

    function u(e) {
        var n = parseFloat(e.css("width"));
        return isNaN(n) ? e[0].offsetWidth : n
    }

    function c(e) {
        return u(e) / 2
    }

    function f(e) {
        try {
            return e.offset().left
        } catch (n) {
        }
        return e[0].getBoundingClientRect().left
    }

    function d(e, n) {
        return e.attr("ng-bind-template", n)
    }

    function p(e, n, t, i, r) {
        !angular.isUndefined(n) && n || (n = 0), !angular.isUndefined(t) && t && 0 != t || (t = 1 / Math.pow(10, n)), !angular.isUndefined(i) && i || (i = 0), !angular.isUndefined(e) && e || (e = 0);
        var a = (e - i) % t, l = a > t / 2 ? e + t - a : e - a;
        return !angular.isUndefined(r) && r || (r = l), l = Math.min(Math.max(l, i), r), parseFloat(l.toFixed(n))
    }

    function b(e, n) {
        return Math.floor(e / n + .5) * n
    }

    function h(e, n) {
        return e > 0 && !isNaN(n) ? Math.ceil(n / e) * e : n
    }

    function m(e) {
        return v + " " + e + " " + B
    }

    var g = 3, v = t.startSymbol(), B = t.endSymbol();
    return {
        restrict: "EA",
        require: "ngModel",
        scope: {
            floor: "@",
            ceiling: "@",
            step: "@",
            stepWidth: "@",
            precision: "@",
            buffer: "@",
            stickiness: "@",
            showSteps: "@",
            ngModel: "=",
            ngModelRange: "=",
            ngDisabled: "=",
            ngChange: "&",
            translateFn: "&",
            translateRangeFn: "&",
            translateCombinedFn: "&",
            scaleFn: "&",
            inverseScaleFn: "&"
        },
        template: "<span class='bar full'></span><span class='bar steps'><span class='bubble step' ng-repeat='step in stepBubbles()'></span></span><span class='bar selection'></span><span class='bar unselected low'></span><span class='bar unselected high'></span><span class='pointer low'></span><span class='pointer high'></span><span class='bubble low'></span><span class='bubble high'></span><span class='bubble middle'></span><span class='bubble selection'></span><span class='bubble limit floor'></span><span class='bubble limit ceiling'></span><input type='range' class='input low' /><input type='range' class='input high' /><input type='range' class='input selection' />",
        compile: function (t, l) {
            function v(e) {
                e || (e = t);
                var n = [];
                return angular.forEach(e.children(), function (e) {
                    n.push(r(e))
                }), n
            }

            function B(e, n, t) {
                return {
                    fullBar: e[0],
                    stepBubs: e[1],
                    selBar: n ? e[2] : null,
                    unSelBarLow: n ? e[3] : null,
                    unSelBarHigh: n ? e[4] : null,
                    minPtr: n ? e[5] : e[2],
                    maxPtr: n ? e[6] : null,
                    lowBub: n ? e[7] : e[3],
                    highBub: n ? e[8] : null,
                    cmbBub: n ? e[9] : null,
                    selBub: n ? e[10] : null,
                    flrBub: n ? e[11] : e[4],
                    ceilBub: n ? e[12] : e[5],
                    minInput: t ? n ? e[13] : e[6] : null,
                    maxInput: t && n ? e[14] : null,
                    selInput: t && n ? e[15] : null
                }
            }

            var y = l.showSteps, w = l.stepWidth ? "stepWidth" : "step", x = null != l.ngModelRange, F = {}, S = "ngModel", P = "ngModelRange", C = "selectBar", M = ["floor", "ceiling", "stickiness", S];
            if (F = function () {
                    for (var e = v(), n = [], t = 0, i = e.length; i > t; t++) {
                        var a = e[t];
                        a = r(a), a.css({
                            "white-space": "nowrap",
                            position: "absolute",
                            display: "block",
                            "z-index": 1
                        }), n.push(a)
                    }
                    return n
                }(), F = B(F, !0, !0), l.translateFn && l.$set("translateFn", "" + l.translateFn + "(value)"), l.translateRangeFn && l.$set("translateRangeFnFn", "" + l.translateRangeFn + "(low,high)"), l.translateCombinedFn && l.$set("translateCombinedFnFn", "" + l.translateCombinedFn + "(low,high)"), l.scaleFn && l.$set("scaleFn", "" + l.scaleFn + "(value)"), l.inverseScaleFn && l.$set("inverseScaleFn", "" + l.inverseScaleFn + "(value)"), F.fullBar.css({
                    left: 0,
                    right: 0
                }), AngularSlider.inputtypes.range) {
                var I = {position: "absolute", margin: 0, padding: 0, opacity: 0, height: "100%"};
                F.minInput.attr("step", m("inputSteps()")), F.minInput.attr("min", m("floor")), F.minInput.css(I), F.minInput.css("left", 0), x ? (F.minInput.attr("max", m("ngModelRange - (buffer / 2)")), F.maxInput.attr("step", m("inputSteps()")), F.maxInput.attr("min", m("ngModel + (buffer / 2)")), F.maxInput.attr("max", m("ceiling")), F.maxInput.css(I), F.selInput.attr("step", m("inputSteps()")), F.selInput.attr("min", m("ngModel")), F.selInput.attr("max", m("ngModelRange")), F.selInput.css(I)) : (F.minInput.attr("max", m("ceiling")), F.minInput.css({width: "100%"}), F.maxInput.remove(), F.selInput.remove())
            } else F.minInput.remove(), F.maxInput.remove(), F.selInput.remove();
            if (d(F.stepBubs.children().eq(0), m("translation(step)")), d(F.ceilBub, m("translation(ceiling)")), d(F.flrBub, m("translation(floor)")), d(F.selBub, m("rangeTranslation(" + S + "," + P + ")")), d(F.lowBub, m("translation(" + S + ")")), d(F.highBub, m("translation(" + P + ")")), d(F.cmbBub, m("combinedTranslation(" + S + "," + P + ")")), x)M.push(P), M.unshift("buffer"); else for (var k = [F.selBar, F.unSelBarLow, F.unSelBarHigh, F.maxPtr, F.selBub, F.highBub, F.cmbBub], R = 0, N = k.length; N > R; R++)t = k[R], t.remove();
            return M.unshift("precision", w), y || F.stepBubs.children().remove(), {
                post: function (t, l, d, m) {
                    function y() {
                        if (angular.forEach(M, function (e) {
                                t[e] = parseFloat(t[e]), e == S || e == P ? t[e] = p(t[e], t.precision, t[w], t.floor, t.ceiling) : "buffer" == e ? !t.buffer || isNaN(t.buffer) || t.buffer < 0 ? t.buffer = 0 : t.buffer = h(t[w], t.buffer) : "precision" == e ? !t.precision || isNaN(t.precision) ? t.precision = 0 : t.precision = parseInt(t.precision) : e == w ? !t[w] || isNaN(t[w]) ? t[w] = 1 / Math.pow(10, t.precision) : t[w] = parseFloat(t[w].toFixed(t.precision)) : "stickiness" == e && (isNaN(t.stickiness) ? t.stickiness = g : t.stickiness < 1 && (t.stickiness = 1)), t.decodedValues[e] = t.decodeRef(e)
                            }), x) {
                            if (t[P] < t[S]) {
                                var e = t[P];
                                t[P] = t[S], t[S] = e
                            }
                            var n = p(t[P] - t[S], t.precision, t[w]);
                            if (t.buffer > 0 && n < t.buffer) {
                                var i = t.encode((t.decodedValues[S] + t.decodedValues[P]) / 2);
                                t[S] = p(i - t.buffer / 2, t.precision, t[w], t.floor, t.ceiling), t[P] = t[S] + t.buffer, t[P] > t.ceiling && (t[P] = t.ceiling, t[S] = t.ceiling - t.buffer)
                            }
                        }
                        k = u(I.fullBar), R = c(I.minPtr), N = f(I.fullBar), V = N + k - u(I.minPtr), A = V - N, E = t.floor, T = t.decodedValues.floor, j = t.ceiling, U = t.decodedValues.ceiling, L = j - E, O = U - T, W = b(O, t.decodedValues[w])
                    }

                    function F() {
                        function e(e) {
                            return (e - N) / A * 100
                        }

                        function d(n) {
                            return e(n) / 100 * O + T
                        }

                        function h(e) {
                            return t.encode(d(e))
                        }

                        function g(e) {
                            var n = e - T;
                            return L == O ? n = b(n, t.decodedValues[w]) / W : n /= O, 100 * n
                        }

                        function v(e) {
                            return g(t.decode(e))
                        }

                        function B(e) {
                            return a(e * A / 100)
                        }

                        function F(e) {
                            return Math.min(Math.max(e, N), V)
                        }

                        function M(e, n, i) {
                            var r = e > 0 ? 1 : -1;
                            return n = n ? n : 100, i ? (Math.sin(Math.min(Math.abs(e / n), 1) * Math.PI - Math.PI / 2) + 1) * r * n / 6 : r * Math.pow(Math.min(Math.abs(e / n * 2), 1), t.stickiness) * n / 2
                        }

                        function U() {
                            var n = g(t.decodedValues[S]), i = v(t[S] + t[w]) - n, r = n - v(t[S] - t[w]), a = v(t[S] + t.buffer) - n, l = e(R + N), s = n + M(z, z > 0 ? i : r);
                            if (o(I.minPtr, B(s)), o(I.lowBub, B(e(f(I.minPtr) - c(I.lowBub) + R))), x) {
                                var u = g(t.decodedValues[P]), d = v(t[P] + t[w]) - u, p = u - v(t[P] - t[w]), b = u - v(t[P] - t.buffer), h = u + M(H, H > 0 ? d : p);
                                if (s > u - b && (s = n + M(z, a, !0), o(I.minPtr, B(s)), o(I.lowBub, B(e(f(I.minPtr) - c(I.lowBub) + R)))), n + a > h && (h = u + M(H, b, !0)), o(I.maxPtr, B(h)), o(I.highBub, B(e(f(I.maxPtr) - c(I.highBub) + R))), o(I.selBar, B(s + l)), I.selBar.css({width: B(h - s)}), o(I.selBub, B((s + h) / 2 - e(c(I.selBub) + N) + l)), o(I.cmbBub, B((s + h) / 2 - e(c(I.cmbBub) + N) + l)), I.unSelBarLow.css({
                                        left: 0,
                                        width: B(s + l)
                                    }), o(I.unSelBarHigh, B(h + l)), I.unSelBarHigh.css({right: 0}), AngularSlider.inputtypes.range) {
                                    var m = 2 * l, y = s + a / 2, F = 100 - y;
                                    y += m;
                                    var C = h - b / 2, k = s + m, V = h - s - m;
                                    s + m >= h && (k = s, V = h + m - s), I.minInput.css({width: B(C)}), I.maxInput.css({
                                        left: B(y),
                                        width: B(F)
                                    }), I.selInput.css({left: B(k), width: B(V)})
                                }
                            }
                        }

                        function J() {
                            I.lowBub && s(I.lowBub), I.highBub && s(I.highBub), I.cmbBub && s(I.cmbBub), I.selBub && s(I.selBub), I.flrBub && s(I.flrBub), I.ceilBub && s(I.ceilBub)
                        }

                        function q() {
                            z = 0, H = 0, Z && (U(), J(), Z.removeClass("active")), Z = null, ee = null, K = !1
                        }

                        function X(n) {
                            Z && t.$apply(function () {
                                var i = n.clientX || n.x;
                                if (K) {
                                    var r = h(i) - Q, a = h(i) + Y;
                                    E > r ? (a += E - r, r = E) : a > j && (r -= a - j, a = j);
                                    var s = v(r), o = v(a);
                                    z = s, H = o, t[S] = r = p(r, t.precision, t[w], t.floor, t.ceiling), t[P] = a = p(a, t.precision, t[w], t.floor, t.ceiling), z -= v(r), H -= v(a)
                                } else {
                                    var u = F(i + N - f(l) - c(Z)), d = e(u), b = t.encode(T + O * d / 100);
                                    if (z = d, x)if (t.buffer > 0)ee === S ? b > t[P] - t.buffer && (b = t[P] - t.buffer) : b < t[S] + t.buffer && (b = t[S] + t.buffer); else if (ee === S) {
                                        if (b > t[P]) {
                                            t[S] = t[P], t.decodedValues[S] = t.decodeRef(S), ee = P;
                                            var g = I.minPtr;
                                            I.minPtr = I.maxPtr, I.maxPtr = g, I.maxPtr.removeClass("active").removeClass("high").addClass("low"), I.minPtr.addClass("active").removeClass("low").addClass("high")
                                        }
                                    } else if (b < t[S]) {
                                        t[P] = t[S], t.decodedValues[P] = t.decodeRef(P), ee = S;
                                        var g = I.minPtr;
                                        I.minPtr = I.maxPtr, I.maxPtr = g, I.minPtr.removeClass("active").removeClass("low").addClass("high"), I.maxPtr.addClass("active").removeClass("high").addClass("low")
                                    }
                                    t[ee] = b = p(b, t.precision, t[w], t.floor, t.ceiling), t.decodedValues[ee] = t.decodeRef(ee), ee === S ? (z -= v(b), H = 0) : (H = z - v(b), z = 0)
                                }
                                t.ngChange && t.ngChange(), m.$setViewValue(t[S]), U(), J()
                            })
                        }

                        function _(e, n, i) {
                            if (!t.ngDisabled || 1 != t.ngDisabled) {
                                var r = e.clientX || e.x;
                                if (Z = n, ee = i, Z.addClass("active"), ee == C) {
                                    K = !0;
                                    var a = h(r);
                                    Q = a - t[S], Y = t[P] - a
                                }
                                X(e)
                            }
                        }

                        function G() {
                            function e(e, n, t) {
                                function a(e) {
                                    _(e, n, t)
                                }

                                function l(e) {
                                    X(e), q()
                                }

                                e = r(e), i.bind(e, {start: a, move: X, end: l, cancel: q})
                            }

                            function t(e, n, t) {
                                e = r(e), t = angular.isUndefined(t) ? e : r(t), i.bind(e, {
                                    start: function (e) {
                                        _(e, t, n)
                                    }
                                })
                            }

                            function a(e) {
                                e = r(e), i.bind(e, {
                                    move: X, end: function (e) {
                                        X(e), q()
                                    }, cancel: q
                                })
                            }

                            AngularSlider.inputtypes.range ? (e(I.minInput, I.minPtr, S), x && (e(I.maxInput, I.maxPtr, P), e(I.selInput, I.selBar, C))) : (a(n), t(I.minPtr, S), t(I.lowBub, S), t(I.flrBub, S, I.minPtr), x ? (t(I.maxPtr, P), t(I.highBub, P), t(I.ceilBub, P, I.maxPtr), t(I.selBar, C), t(I.selBub, C, I.selBar), t(I.unSelBarLow, S, I.minPtr), t(I.unSelBarHigh, P, I.maxPtr)) : (t(I.ceilBub, S, I.minPtr), t(I.fullBar, S, I.minPtr)))
                        }

                        var K, Q, Y, Z, ee;
                        y(), o(I.flrBub, 0), o(I.ceilBub, a(k - u(I.ceilBub))), U(), J(), D || (G(), D = !0)
                    }

                    var I = B(v(l), x, AngularSlider.inputtypes.range);
                    t.decodedValues = {
                        floor: 0,
                        ceiling: 0,
                        step: 0,
                        stepWidth: 0,
                        precision: 0,
                        buffer: 0,
                        stickiness: 0,
                        ngModel: 0,
                        ngModelRange: 0
                    }, t.translation = function (e) {
                        return e = parseFloat(e).toFixed(t.precision), angular.isUndefined(d.translateFn) ? "" + e : t.translateFn({value: e})
                    }, t.rangeTranslation = function (e, n) {
                        return angular.isUndefined(d.translateRangeFn) ? "" : t.translateRangeFn({low: e, high: n})
                    }, t.combinedTranslation = function (e, n) {
                        return angular.isUndefined(d.translateCombinedFn) ? t.translation(e) + " - " + t.translation(n) : t.translateCombinedFn({
                            low: e,
                            high: n
                        })
                    }, t.encode = function (e) {
                        return angular.isUndefined(d.scaleFn) || "" == d.scaleFn ? e : t.scaleFn({value: e})
                    }, t.decode = function (e) {
                        return angular.isUndefined(d.inverseScaleFn) || "" == d.inverseScaleFn ? e : t.inverseScaleFn({value: e})
                    }, 1 == Math.round(t.encode(t.decode(1))) && 100 == Math.round(t.encode(t.decode(100))) || console.warn("The scale and inverseScale functions are not perfect inverses: 1 = " + t.encode(t.decode(1)) + "  100 = " + t.encode(t.decode(100))), t.decodeRef = function (e) {
                        return t.decode(t[e])
                    }, t.inputSteps = function () {
                        return Math.pow(10, -1 * t.precision)
                    };
                    for (var k = 0, R = 0, N = 0, V = 0, A = 0, E = 0, T = 0, j = 0, U = 0, L = 0, O = 0, W = 1, z = 0, H = 0, D = !1, J = 0; J < M.length; J++)t.$watch(M[J], function () {
                        F()
                    });
                    r(window).bind("resize", function () {
                        F()
                    }), t.$on("refreshSlider", function () {
                        e(function () {
                            F()
                        })
                    }), e(function () {
                        F()
                    })
                }
            }
        }
    }
}]);