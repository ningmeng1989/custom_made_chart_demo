if (!Array.prototype.map) {
    Array.prototype.map = function (J, G) {
        var D, E, B;
        if (this == null) {
            throw new TypeError(" this is null or not defined")
        }
        var I = Object(this);
        var H = I.length >>> 0;
        if ({}.toString.call(J) != "[object Function]") {
            throw new TypeError(J + " is not a function")
        }
        if (G) {
            D = G
        }
        E = new Array(H);
        B = 0;
        while (B < H) {
            var C, F;
            if (B in I) {
                C = I[B];
                F = J.call(D, C, B, I);
                E[B] = F
            }
            B++
        }
        return E
    }
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(B) {
        var C = 0, D = this.length >> 0, A;
        if (typeof B !== "function") {
            throw new TypeError("First argument is not callable")
        }
        if (arguments.length < 2) {
            if (D === 0) {
                throw new TypeError("Array length is 0 and no second argument")
            }
            A = this[0];
            C = 1
        } else {
            A = arguments[1]
        }
        while (C < D) {
            if (C in this) {
                A = B.call(undefined, A, this[C], C, this)
            }
            ++C
        }
        return A
    }
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (G, E) {
        var C, F;
        if (this == null) {
            throw new TypeError(" this is null or not defined")
        }
        var D = Object(this);
        var A = D.length >>> 0;
        if ({}.toString.call(G) != "[object Function]") {
            throw new TypeError(G + " is not a function")
        }
        if (E) {
            C = E
        }
        F = 0;
        while (F < A) {
            var B;
            if (F in D) {
                B = D[F];
                G.call(C, B, F, D)
            }
            F++
        }
    }
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (G) {
        if (this == null) {
            throw new TypeError()
        }
        var B = Object(this);
        var A = B.length >>> 0;
        if (typeof G != "function") {
            throw new TypeError()
        }
        var D = [];
        var F = arguments[1];
        for (var E = 0; E < A; E++) {
            if (E in B) {
                var C = B[E];
                if (G.call(F, C, E, B)) {
                    D.push(C)
                }
            }
        }
        return D
    }
}
if (!Array.prototype.every) {
    Array.prototype.every = function (E) {
        if (this == null) {
            throw new TypeError()
        }
        var B = Object(this);
        var A = B.length >>> 0;
        if (typeof E != "function") {
            throw new TypeError()
        }
        var D = arguments[1];
        for (var C = 0; C < A; C++) {
            if (C in B && !E.call(D, B[C], C, B)) {
                return false
            }
        }
        return true
    }
}
;