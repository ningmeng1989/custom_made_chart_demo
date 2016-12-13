/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").factory("storyPageshotService", [function () {
    function e(e, n) {
        t = new Date;
        var a = e.find("iframe");
        a.each(function (e, t) {
            var n = $(t), a = n.parents(".dv-dashboard-element-content"), r = a.width(), i = a.height(), o = $("<div></div>").text("URL");
            o.css({
                width: r,
                height: i,
                lineHeight: i + "px",
                textAlign: "center",
                fontSize: r / 3 > i ? i : r / 3 + "px"
            }), n.parent().empty().append(o)
        });
        var r = e.find(".orb-container");
        r.each(function (e, t) {
            var n = document.createElement("img");
            n.src = "img/pivot.png", n.style.height = "100%", n.style.width = "100%", $(t).parent().empty().append(n)
        }), e.find(".dv-dashboard-element-remover,.dv-dashboard-drophint,.resize-triggers").remove(), e.find(".dv-dashboard-element-selected > div").css("border-color", "transparent");
        var o = e.find(".chart").map(function (e, t) {
            var n = $(t);
            return n.children("svg").length || n.attr("_echarts_instance_") ? t : void 0
        }), c = o.clone();
        o.empty();
        var s = c.children("svg").length, d = _.after(s + 1, i);
        c.each(function (t, a) {
            var r;
            if (s && (r = $(a).find("> svg")).length)r.each(function (a, r) {
                var i = (new XMLSerializer).serializeToString(r);
                i = i.replace(/[^\s<]*xmlns[^\s>]+/g, "");
                var c = document.createElement("canvas");
                c.style.position = "absolute", c.style.left = r.style.left, c.style.top = r.style.top, o[t].appendChild(c), canvg(c, i, {renderCallback: d(e, n)})
            }); else if ($(a).attr("_echarts_instance_")) {
                var i = echarts.getInstanceById($(a).attr("_echarts_instance_"));
                i.setOption({backgroundColor: e.css("backgroundColor")});
                var c = document.createElement("img");
                c.src = i.getDataURL("png"), i.setOption({backgroundColor: "rgba(0, 0, 0, 0)"}), c.style.width = "100%", c.style.height = "100%", o[t].appendChild(c)
            }
        }), d(e, n)
    }

    var t, n = {useCORS: !0, removeContainer: !1, cloneDocument: !1}, a = 90, r = 160, i = function (e, i) {
        html2canvas(e, n).then(function (e) {
            var n = $(e).attr("width"), o = $(e).attr("height"), c = document.createElement("canvas");
            c.width = r, c.height = a;
            var s = c.getContext("2d");
            s.drawImage(e, 0, 0, n, o, 0, 0, r, a);
            var d = c.toDataURL("image/png");
            i && i(d), console.log("pageshot time used: " + (new Date - t))
        }, function (e) {
            toaster.pop("error", "", "保存图册截图失败"), i && i()
        })
    };
    return {pageShot: e}
}]);