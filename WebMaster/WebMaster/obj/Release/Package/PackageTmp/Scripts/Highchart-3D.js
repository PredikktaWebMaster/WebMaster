﻿/*
 Highcharts JS v5.0.6 (2016-12-07)

 3D features for Highcharts JS

 @license: www.highcharts.com/license
*/
(function (D) { "object" === typeof module && module.exports ? module.exports = D : D(Highcharts) })(function (D) {
    (function (a) {
        var q = a.deg2rad, k = a.pick; a.perspective = function (p, n, u) {
            var m = n.options.chart.options3d, f = u ? n.inverted : !1, g = n.plotWidth / 2, r = n.plotHeight / 2, d = m.depth / 2, e = k(m.depth, 1) * k(m.viewDistance, 0), c = n.scale3d || 1, b = q * m.beta * (f ? -1 : 1), m = q * m.alpha * (f ? -1 : 1), h = Math.cos(m), v = Math.cos(-b), x = Math.sin(m), y = Math.sin(-b); u || (g += n.plotLeft, r += n.plotTop); return a.map(p, function (b) {
                var a, m; m = (f ? b.y : b.x) - g; var n = (f ?
                b.x : b.y) - r, k = (b.z || 0) - d; a = v * m - y * k; b = -x * y * m + h * n - v * x * k; m = h * y * m + x * n + h * v * k; n = 0 < e && e < Number.POSITIVE_INFINITY ? e / (m + d + e) : 1; a = a * n * c + g; b = b * n * c + r; return { x: f ? b : a, y: f ? a : b, z: m * c + d }
            })
        }; a.pointCameraDistance = function (a, n) { var p = n.options.chart.options3d, m = n.plotWidth / 2; n = n.plotHeight / 2; p = k(p.depth, 1) * k(p.viewDistance, 0) + p.depth; return Math.sqrt(Math.pow(m - a.plotX, 2) + Math.pow(n - a.plotY, 2) + Math.pow(p - a.plotZ, 2)) }
    })(D); (function (a) {
        function q(b) {
            var a = 0, l, c; for (l = 0; l < b.length; l++) c = (l + 1) % b.length, a += b[l].x * b[c].y -
            b[c].x * b[l].y; return a / 2
        } function k(b) { var c = 0, l; for (l = 0; l < b.length; l++) c += b[l].z; return b.length ? c / b.length : 0 } function p(b, c, l, a, h, d, F, e) {
            var f = [], H = d - h; return d > h && d - h > Math.PI / 2 + .0001 ? (f = f.concat(p(b, c, l, a, h, h + Math.PI / 2, F, e)), f = f.concat(p(b, c, l, a, h + Math.PI / 2, d, F, e))) : d < h && h - d > Math.PI / 2 + .0001 ? (f = f.concat(p(b, c, l, a, h, h - Math.PI / 2, F, e)), f = f.concat(p(b, c, l, a, h - Math.PI / 2, d, F, e))) : ["C", b + l * Math.cos(h) - l * t * H * Math.sin(h) + F, c + a * Math.sin(h) + a * t * H * Math.cos(h) + e, b + l * Math.cos(d) + l * t * H * Math.sin(d) + F, c + a * Math.sin(d) -
            a * t * H * Math.cos(d) + e, b + l * Math.cos(d) + F, c + a * Math.sin(d) + e]
        } var n = Math.cos, u = Math.PI, m = Math.sin, f = a.animObject, g = a.charts, r = a.color, d = a.defined, e = a.deg2rad, c = a.each, b = a.extend, h = a.inArray, v = a.map, x = a.merge, y = a.perspective, E = a.pick, A = a.SVGElement, G = a.SVGRenderer, B = a.wrap, t = 4 * (Math.sqrt(2) - 1) / 3 / (u / 2); G.prototype.toLinePath = function (b, a) { var l = []; c(b, function (b) { l.push("L", b.x, b.y) }); b.length && (l[0] = "M", a && l.push("Z")); return l }; G.prototype.cuboid = function (b) {
            var c = this.g(); b = this.cuboidPath(b); c.attr({ "stroke-linejoin": "round" });
            c.front = this.path(b[0]).attr({ "class": "highcharts-3d-front", zIndex: b[3] }).add(c); c.top = this.path(b[1]).attr({ "class": "highcharts-3d-top", zIndex: b[4] }).add(c); c.side = this.path(b[2]).attr({ "class": "highcharts-3d-side", zIndex: b[5] }).add(c); c.fillSetter = function (b) { this.front.attr({ fill: b }); this.top.attr({ fill: r(b).brighten(.1).get() }); this.side.attr({ fill: r(b).brighten(-.1).get() }); this.color = b; return this }; c.opacitySetter = function (b) {
                this.front.attr({ opacity: b }); this.top.attr({ opacity: b }); this.side.attr({ opacity: b });
                return this
            }; c.attr = function (b) { if (b.shapeArgs || d(b.x)) b = this.renderer.cuboidPath(b.shapeArgs || b), this.front.attr({ d: b[0], zIndex: b[3] }), this.top.attr({ d: b[1], zIndex: b[4] }), this.side.attr({ d: b[2], zIndex: b[5] }); else return a.SVGElement.prototype.attr.call(this, b); return this }; c.animate = function (b, c, a) {
                d(b.x) && d(b.y) ? (b = this.renderer.cuboidPath(b), this.front.attr({ zIndex: b[3] }).animate({ d: b[0] }, c, a), this.top.attr({ zIndex: b[4] }).animate({ d: b[1] }, c, a), this.side.attr({ zIndex: b[5] }).animate({ d: b[2] }, c, a),
                this.attr({ zIndex: -b[6] })) : b.opacity ? (this.front.animate(b, c, a), this.top.animate(b, c, a), this.side.animate(b, c, a)) : A.prototype.animate.call(this, b, c, a); return this
            }; c.destroy = function () { this.front.destroy(); this.top.destroy(); this.side.destroy(); return null }; c.attr({ zIndex: -b[6] }); return c
        }; G.prototype.cuboidPath = function (b) {
            function c(b) { return m[b] } var a = b.x, h = b.y, d = b.z, e = b.height, f = b.width, r = b.depth, m = [{ x: a, y: h, z: d }, { x: a + f, y: h, z: d }, { x: a + f, y: h + e, z: d }, { x: a, y: h + e, z: d }, { x: a, y: h + e, z: d + r }, {
                x: a + f, y: h +
                e, z: d + r
            }, { x: a + f, y: h, z: d + r }, { x: a, y: h, z: d + r }], m = y(m, g[this.chartIndex], b.insidePlotArea), d = function (b, a) { var h = []; b = v(b, c); a = v(a, c); 0 > q(b) ? h = b : 0 > q(a) && (h = a); return h }; b = d([3, 2, 1, 0], [7, 6, 5, 4]); a = [4, 5, 2, 3]; h = d([1, 6, 7, 0], a); d = d([1, 2, 5, 6], [0, 7, 4, 3]); return [this.toLinePath(b, !0), this.toLinePath(h, !0), this.toLinePath(d, !0), k(b), k(h), k(d), 9E9 * k(v(a, c))]
        }; a.SVGRenderer.prototype.arc3d = function (a) {
            function d(b) { var a = !1, c = {}, d; for (d in b) -1 !== h(d, v) && (c[d] = b[d], delete b[d], a = !0); return a ? c : !1 } var l = this.g(),
            m = l.renderer, v = "x y r innerR start end".split(" "); a = x(a); a.alpha *= e; a.beta *= e; l.top = m.path(); l.side1 = m.path(); l.side2 = m.path(); l.inn = m.path(); l.out = m.path(); l.onAdd = function () { var b = l.parentGroup, a = l.attr("class"); l.top.add(l); c(["out", "inn", "side1", "side2"], function (c) { l[c].addClass(a + " highcharts-3d-side").add(b) }) }; l.setPaths = function (b) {
                var a = l.renderer.arc3dPath(b), c = 100 * a.zTop; l.attribs = b; l.top.attr({ d: a.top, zIndex: a.zTop }); l.inn.attr({ d: a.inn, zIndex: a.zInn }); l.out.attr({ d: a.out, zIndex: a.zOut });
                l.side1.attr({ d: a.side1, zIndex: a.zSide1 }); l.side2.attr({ d: a.side2, zIndex: a.zSide2 }); l.zIndex = c; l.attr({ zIndex: c }); b.center && (l.top.setRadialReference(b.center), delete b.center)
            }; l.setPaths(a); l.fillSetter = function (b) { var a = r(b).brighten(-.1).get(); this.fill = b; this.side1.attr({ fill: a }); this.side2.attr({ fill: a }); this.inn.attr({ fill: a }); this.out.attr({ fill: a }); this.top.attr({ fill: b }); return this }; c(["opacity", "translateX", "translateY", "visibility"], function (b) {
                l[b + "Setter"] = function (b, a) {
                    l[a] = b; c(["out",
                    "inn", "side1", "side2", "top"], function (c) { l[c].attr(a, b) })
                }
            }); B(l, "attr", function (a, c) { var h; "object" === typeof c && (h = d(c)) && (b(l.attribs, h), l.setPaths(l.attribs)); return a.apply(this, [].slice.call(arguments, 1)) }); B(l, "animate", function (b, a, c, h) {
                var l, e = this.attribs, m; delete a.center; delete a.z; delete a.depth; delete a.alpha; delete a.beta; m = f(E(c, this.renderer.globalAnimation)); m.duration && (a = x(a), l = d(a), a.dummy = 1, l && (m.step = function (b, a) {
                    function c(b) { return e[b] + (E(l[b], e[b]) - e[b]) * a.pos } "dummy" ===
                    a.prop && a.elem.setPaths(x(e, { x: c("x"), y: c("y"), r: c("r"), innerR: c("innerR"), start: c("start"), end: c("end") }))
                }), c = m); return b.call(this, a, c, h)
            }); l.destroy = function () { this.top.destroy(); this.out.destroy(); this.inn.destroy(); this.side1.destroy(); this.side2.destroy(); A.prototype.destroy.call(this) }; l.hide = function () { this.top.hide(); this.out.hide(); this.inn.hide(); this.side1.hide(); this.side2.hide() }; l.show = function () { this.top.show(); this.out.show(); this.inn.show(); this.side1.show(); this.side2.show() };
            return l
        }; G.prototype.arc3dPath = function (b) {
            function a(b) { b %= 2 * Math.PI; b > Math.PI && (b = 2 * Math.PI - b); return b } var c = b.x, h = b.y, d = b.start, e = b.end - .00001, f = b.r, r = b.innerR, v = b.depth, g = b.alpha, k = b.beta, x = Math.cos(d), q = Math.sin(d); b = Math.cos(e); var y = Math.sin(e), w = f * Math.cos(k), f = f * Math.cos(g), t = r * Math.cos(k), B = r * Math.cos(g), r = v * Math.sin(k), z = v * Math.sin(g), v = ["M", c + w * x, h + f * q], v = v.concat(p(c, h, w, f, d, e, 0, 0)), v = v.concat(["L", c + t * b, h + B * y]), v = v.concat(p(c, h, t, B, e, d, 0, 0)), v = v.concat(["Z"]), E = 0 < k ? Math.PI / 2 : 0, k = 0 <
            g ? 0 : Math.PI / 2, E = d > -E ? d : e > -E ? -E : d, C = e < u - k ? e : d < u - k ? u - k : e, A = 2 * u - k, g = ["M", c + w * n(E), h + f * m(E)], g = g.concat(p(c, h, w, f, E, C, 0, 0)); e > A && d < A ? (g = g.concat(["L", c + w * n(C) + r, h + f * m(C) + z]), g = g.concat(p(c, h, w, f, C, A, r, z)), g = g.concat(["L", c + w * n(A), h + f * m(A)]), g = g.concat(p(c, h, w, f, A, e, 0, 0)), g = g.concat(["L", c + w * n(e) + r, h + f * m(e) + z]), g = g.concat(p(c, h, w, f, e, A, r, z)), g = g.concat(["L", c + w * n(A), h + f * m(A)]), g = g.concat(p(c, h, w, f, A, C, 0, 0))) : e > u - k && d < u - k && (g = g.concat(["L", c + w * Math.cos(C) + r, h + f * Math.sin(C) + z]), g = g.concat(p(c, h, w, f, C, e,
            r, z)), g = g.concat(["L", c + w * Math.cos(e), h + f * Math.sin(e)]), g = g.concat(p(c, h, w, f, e, C, 0, 0))); g = g.concat(["L", c + w * Math.cos(C) + r, h + f * Math.sin(C) + z]); g = g.concat(p(c, h, w, f, C, E, r, z)); g = g.concat(["Z"]); k = ["M", c + t * x, h + B * q]; k = k.concat(p(c, h, t, B, d, e, 0, 0)); k = k.concat(["L", c + t * Math.cos(e) + r, h + B * Math.sin(e) + z]); k = k.concat(p(c, h, t, B, e, d, r, z)); k = k.concat(["Z"]); x = ["M", c + w * x, h + f * q, "L", c + w * x + r, h + f * q + z, "L", c + t * x + r, h + B * q + z, "L", c + t * x, h + B * q, "Z"]; c = ["M", c + w * b, h + f * y, "L", c + w * b + r, h + f * y + z, "L", c + t * b + r, h + B * y + z, "L", c + t * b, h + B * y, "Z"];
            y = Math.atan2(z, -r); h = Math.abs(e + y); b = Math.abs(d + y); d = Math.abs((d + e) / 2 + y); h = a(h); b = a(b); d = a(d); d *= 1E5; e = 1E5 * b; h *= 1E5; return { top: v, zTop: 1E5 * Math.PI + 1, out: g, zOut: Math.max(d, e, h), inn: k, zInn: Math.max(d, e, h), side1: x, zSide1: .99 * h, side2: c, zSide2: .99 * e }
        }
    })(D); (function (a) {
        function q(a, d) {
            var e = a.plotLeft, c = a.plotWidth + e, b = a.plotTop, h = a.plotHeight + b, f = e + a.plotWidth / 2, g = b + a.plotHeight / 2, r = Number.MAX_VALUE, m = -Number.MAX_VALUE, k = Number.MAX_VALUE, n = -Number.MAX_VALUE, q, t = 1; q = [{ x: e, y: b, z: 0 }, { x: e, y: b, z: d }]; p([0, 1],
            function (b) { q.push({ x: c, y: q[b].y, z: q[b].z }) }); p([0, 1, 2, 3], function (b) { q.push({ x: q[b].x, y: h, z: q[b].z }) }); q = u(q, a, !1); p(q, function (b) { r = Math.min(r, b.x); m = Math.max(m, b.x); k = Math.min(k, b.y); n = Math.max(n, b.y) }); e > r && (t = Math.min(t, 1 - Math.abs((e + f) / (r + f)) % 1)); c < m && (t = Math.min(t, (c - f) / (m - f))); b > k && (t = 0 > k ? Math.min(t, (b + g) / (-k + b + g)) : Math.min(t, 1 - (b + g) / (k + g) % 1)); h < n && (t = Math.min(t, Math.abs((h - g) / (n - g)))); return t
        } var k = a.Chart, p = a.each, n = a.merge, u = a.perspective, m = a.pick, f = a.wrap; k.prototype.is3d = function () {
            return this.options.chart.options3d &&
            this.options.chart.options3d.enabled
        }; k.prototype.propsRequireDirtyBox.push("chart.options3d"); k.prototype.propsRequireUpdateSeries.push("chart.options3d"); a.wrap(a.Chart.prototype, "isInsidePlot", function (a) { return this.is3d() || a.apply(this, [].slice.call(arguments, 1)) }); var g = a.getOptions(); n(!0, g, { chart: { options3d: { enabled: !1, alpha: 0, beta: 0, depth: 100, fitToPlot: !0, viewDistance: 25, frame: { bottom: { size: 1 }, side: { size: 1 }, back: { size: 1 } } } } }); f(k.prototype, "setClassName", function (a) {
            a.apply(this, [].slice.call(arguments,
            1)); this.is3d() && (this.container.className += " highcharts-3d-chart")
        }); a.wrap(a.Chart.prototype, "setChartSize", function (a) { var d = this.options.chart.options3d; a.apply(this, [].slice.call(arguments, 1)); if (this.is3d()) { var e = this.inverted, c = this.clipBox, b = this.margin; c[e ? "y" : "x"] = -(b[3] || 0); c[e ? "x" : "y"] = -(b[0] || 0); c[e ? "height" : "width"] = this.chartWidth + (b[3] || 0) + (b[1] || 0); c[e ? "width" : "height"] = this.chartHeight + (b[0] || 0) + (b[2] || 0); this.scale3d = 1; !0 === d.fitToPlot && (this.scale3d = q(this, d.depth)) } }); f(k.prototype,
        "redraw", function (a) { this.is3d() && (this.isDirtyBox = !0); a.apply(this, [].slice.call(arguments, 1)) }); f(k.prototype, "renderSeries", function (a) { var d = this.series.length; if (this.is3d()) for (; d--;) a = this.series[d], a.translate(), a.render(); else a.call(this) }); k.prototype.retrieveStacks = function (a) { var d = this.series, e = {}, c, b = 1; p(this.series, function (h) { c = m(h.options.stack, a ? 0 : d.length - 1 - h.index); e[c] ? e[c].series.push(h) : (e[c] = { series: [h], position: b }, b++) }); e.totalStacks = b + 1; return e }
    })(D); (function (a) {
        var q,
        k = a.Axis, p = a.Chart, n = a.each, u = a.extend, m = a.merge, f = a.perspective, g = a.pick, r = a.splat, d = a.Tick, e = a.wrap; e(k.prototype, "setOptions", function (a, b) { a.call(this, b); this.chart.is3d() && (a = this.options, a.tickWidth = g(a.tickWidth, 0), a.gridLineWidth = g(a.gridLineWidth, 1)) }); e(k.prototype, "render", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var b = this.chart, c = b.renderer, d = b.options.chart.options3d, e = d.frame, f = e.bottom, g = e.back, e = e.side, k = d.depth, m = this.height, r = this.width, n = this.left,
                p = this.top; this.isZAxis || (this.horiz ? (g = { x: n, y: p + (b.xAxis[0].opposite ? -f.size : m), z: 0, width: r, height: f.size, depth: k, insidePlotArea: !1 }, this.bottomFrame ? this.bottomFrame.animate(g) : (this.bottomFrame = c.cuboid(g).attr({ "class": "highcharts-3d-frame highcharts-3d-frame-bottom", zIndex: b.yAxis[0].reversed && 0 < d.alpha ? 4 : -1 }).add(), this.bottomFrame.attr({ fill: f.color || "none", stroke: f.color || "none" }))) : (d = {
                    x: n + (b.yAxis[0].opposite ? 0 : -e.size), y: p + (b.xAxis[0].opposite ? -f.size : 0), z: k, width: r + e.size, height: m + f.size,
                    depth: g.size, insidePlotArea: !1
                }, this.backFrame ? this.backFrame.animate(d) : (this.backFrame = c.cuboid(d).attr({ "class": "highcharts-3d-frame highcharts-3d-frame-back", zIndex: -3 }).add(), this.backFrame.attr({ fill: g.color || "none", stroke: g.color || "none" })), b = { x: n + (b.yAxis[0].opposite ? r : -e.size), y: p + (b.xAxis[0].opposite ? -f.size : 0), z: 0, width: e.size, height: m + f.size, depth: k, insidePlotArea: !1 }, this.sideFrame ? this.sideFrame.animate(b) : (this.sideFrame = c.cuboid(b).attr({
                    "class": "highcharts-3d-frame highcharts-3d-frame-side",
                    zIndex: -2
                }).add(), this.sideFrame.attr({ fill: e.color || "none", stroke: e.color || "none" }))))
            }
        }); e(k.prototype, "getPlotLinePath", function (a) {
            var b = a.apply(this, [].slice.call(arguments, 1)); if (!this.chart.is3d() || null === b) return b; var c = this.chart, d = c.options.chart.options3d, c = this.isZAxis ? c.plotWidth : d.depth, d = this.opposite; this.horiz && (d = !d); b = [this.swapZ({ x: b[1], y: b[2], z: d ? c : 0 }), this.swapZ({ x: b[1], y: b[2], z: c }), this.swapZ({ x: b[4], y: b[5], z: c }), this.swapZ({ x: b[4], y: b[5], z: d ? 0 : c })]; b = f(b, this.chart, !1); return b =
            this.chart.renderer.toLinePath(b, !1)
        }); e(k.prototype, "getLinePath", function (a) { return this.chart.is3d() ? [] : a.apply(this, [].slice.call(arguments, 1)) }); e(k.prototype, "getPlotBandPath", function (a) { if (!this.chart.is3d()) return a.apply(this, [].slice.call(arguments, 1)); var b = arguments, c = b[1], b = this.getPlotLinePath(b[2]); (c = this.getPlotLinePath(c)) && b ? c.push("L", b[10], b[11], "L", b[7], b[8], "L", b[4], b[5], "L", b[1], b[2]) : c = null; return c }); e(d.prototype, "getMarkPath", function (a) {
            var b = a.apply(this, [].slice.call(arguments,
            1)); if (!this.axis.chart.is3d()) return b; b = [this.axis.swapZ({ x: b[1], y: b[2], z: 0 }), this.axis.swapZ({ x: b[4], y: b[5], z: 0 })]; b = f(b, this.axis.chart, !1); return b = ["M", b[0].x, b[0].y, "L", b[1].x, b[1].y]
        }); e(d.prototype, "getLabelPosition", function (a) { var b = a.apply(this, [].slice.call(arguments, 1)); this.axis.chart.is3d() && (b = f([this.axis.swapZ({ x: b.x, y: b.y, z: 0 })], this.axis.chart, !1)[0]); return b }); a.wrap(k.prototype, "getTitlePosition", function (a) {
            var b = this.chart.is3d(), c, d; b && (d = this.axisTitleMargin, this.axisTitleMargin =
            0); c = a.apply(this, [].slice.call(arguments, 1)); b && (c = f([this.swapZ({ x: c.x, y: c.y, z: 0 })], this.chart, !1)[0], c[this.horiz ? "y" : "x"] += (this.horiz ? 1 : -1) * (this.opposite ? -1 : 1) * d, this.axisTitleMargin = d); return c
        }); e(k.prototype, "drawCrosshair", function (a) { var b = arguments; this.chart.is3d() && b[2] && (b[2] = { plotX: b[2].plotXold || b[2].plotX, plotY: b[2].plotYold || b[2].plotY }); a.apply(this, [].slice.call(b, 1)) }); k.prototype.swapZ = function (a, b) {
            if (this.isZAxis) {
                b = b ? 0 : this.chart.plotLeft; var c = this.chart; return {
                    x: b + (c.yAxis[0].opposite ?
                    a.z : c.xAxis[0].width - a.z), y: a.y, z: a.x - b
                }
            } return a
        }; q = a.ZAxis = function () { this.isZAxis = !0; this.init.apply(this, arguments) }; u(q.prototype, k.prototype); u(q.prototype, {
            setOptions: function (a) { a = m({ offset: 0, lineWidth: 0 }, a); k.prototype.setOptions.call(this, a); this.coll = "zAxis" }, setAxisSize: function () { k.prototype.setAxisSize.call(this); this.width = this.len = this.chart.options.chart.options3d.depth; this.right = this.chart.chartWidth - this.width - this.left }, getSeriesExtremes: function () {
                var a = this, b = a.chart; a.hasVisibleSeries =
                !1; a.dataMin = a.dataMax = a.ignoreMinPadding = a.ignoreMaxPadding = null; a.buildStacks && a.buildStacks(); n(a.series, function (c) { if (c.visible || !b.options.chart.ignoreHiddenSeries) a.hasVisibleSeries = !0, c = c.zData, c.length && (a.dataMin = Math.min(g(a.dataMin, c[0]), Math.min.apply(null, c)), a.dataMax = Math.max(g(a.dataMax, c[0]), Math.max.apply(null, c))) })
            }
        }); e(p.prototype, "getAxes", function (a) {
            var b = this, c = this.options, c = c.zAxis = r(c.zAxis || {}); a.call(this); b.is3d() && (this.zAxis = [], n(c, function (a, c) {
                a.index = c; a.isX = !0;
                (new q(b, a)).setScale()
            }))
        })
    })(D); (function (a) {
        function q(a) { var d = a.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && (d.stroke = this.options.edgeColor || d.fill, d["stroke-width"] = u(this.options.edgeWidth, 1)); return d } function k(a) { if (this.chart.is3d()) { var d = this.chart.options.plotOptions.column.grouping; void 0 === d || d || void 0 === this.group.zIndex || this.zIndexSet || (this.group.attr({ zIndex: 10 * this.group.zIndex }), this.zIndexSet = !0) } a.apply(this, [].slice.call(arguments, 1)) } var p = a.each, n = a.perspective,
        u = a.pick, m = a.Series, f = a.seriesTypes, g = a.svg; a = a.wrap; a(f.column.prototype, "translate", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var d = this.chart, e = this.options, c = e.depth || 25, b = (e.stacking ? e.stack || 0 : this._i) * (c + (e.groupZPadding || 1)); !1 !== e.grouping && (b = 0); b += e.groupZPadding || 1; p(this.data, function (a) { if (null !== a.y) { var e = a.shapeArgs, h = a.tooltipPos; a.shapeType = "cuboid"; e.z = b; e.depth = c; e.insidePlotArea = !0; h = n([{ x: h[0], y: h[1], z: b }], d, !0)[0]; a.tooltipPos = [h.x, h.y] } });
                this.z = b
            }
        }); a(f.column.prototype, "animate", function (a) {
            if (this.chart.is3d()) {
                var d = arguments[1], e = this.yAxis, c = this, b = this.yAxis.reversed; g && (d ? p(c.data, function (a) { null !== a.y && (a.height = a.shapeArgs.height, a.shapey = a.shapeArgs.y, a.shapeArgs.height = 1, b || (a.shapeArgs.y = a.stackY ? a.plotY + e.translate(a.stackY) : a.plotY + (a.negative ? -a.height : a.height))) }) : (p(c.data, function (a) { null !== a.y && (a.shapeArgs.height = a.height, a.shapeArgs.y = a.shapey, a.graphic && a.graphic.animate(a.shapeArgs, c.options.animation)) }),
                this.drawDataLabels(), c.animate = null))
            } else a.apply(this, [].slice.call(arguments, 1))
        }); a(f.column.prototype, "init", function (a) { a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) { var d = this.options, e = d.grouping, c = d.stacking, b = u(this.yAxis.options.reversedStacks, !0), f = 0; if (void 0 === e || e) { e = this.chart.retrieveStacks(c); f = d.stack || 0; for (c = 0; c < e[f].series.length && e[f].series[c] !== this; c++); f = 10 * (e.totalStacks - e[f].position) + (b ? c : -c); this.xAxis.reversed || (f = 10 * e.totalStacks - f) } d.zIndex = f } });
        a(f.column.prototype, "pointAttribs", q); f.columnrange && a(f.columnrange.prototype, "pointAttribs", q); a(m.prototype, "alignDataLabel", function (a) { if (this.chart.is3d() && ("column" === this.type || "columnrange" === this.type)) { var d = arguments[4], e = { x: d.x, y: d.y, z: this.z }, e = n([e], this.chart, !0)[0]; d.x = e.x; d.y = e.y } a.apply(this, [].slice.call(arguments, 1)) }); f.columnrange && a(f.columnrange.prototype, "drawPoints", k); a(f.column.prototype, "drawPoints", k)
    })(D); (function (a) {
        var q = a.deg2rad, k = a.each, p = a.pick, n = a.seriesTypes,
        u = a.svg; a = a.wrap; a(n.pie.prototype, "translate", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var f = this, g = f.options, m = g.depth || 0, d = f.chart.options.chart.options3d, e = d.alpha, c = d.beta, b = g.stacking ? (g.stack || 0) * m : f._i * m, b = b + m / 2; !1 !== g.grouping && (b = 0); k(f.data, function (a) {
                    var d = a.shapeArgs; a.shapeType = "arc3d"; d.z = b; d.depth = .75 * m; d.alpha = e; d.beta = c; d.center = f.center; d = (d.end + d.start) / 2; a.slicedTranslation = {
                        translateX: Math.round(Math.cos(d) * g.slicedOffset * Math.cos(e * q)), translateY: Math.round(Math.sin(d) *
                        g.slicedOffset * Math.cos(e * q))
                    }
                })
            }
        }); a(n.pie.prototype.pointClass.prototype, "haloPath", function (a) { var f = arguments; return this.series.chart.is3d() ? [] : a.call(this, f[1]) }); a(n.pie.prototype, "pointAttribs", function (a, f, g) { a = a.call(this, f, g); g = this.options; this.chart.is3d() && (a.stroke = g.edgeColor || f.color || this.color, a["stroke-width"] = p(g.edgeWidth, 1)); return a }); a(n.pie.prototype, "drawPoints", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && k(this.points, function (a) {
                var f = a.graphic;
                if (f) f[a.y && a.visible ? "show" : "hide"]()
            })
        }); a(n.pie.prototype, "drawDataLabels", function (a) { if (this.chart.is3d()) { var f = this.chart.options.chart.options3d; k(this.data, function (a) { var g = a.shapeArgs, d = g.r, e = (g.start + g.end) / 2, c = a.labelPos, b = -d * (1 - Math.cos((g.alpha || f.alpha) * q)) * Math.sin(e), h = d * (Math.cos((g.beta || f.beta) * q) - 1) * Math.cos(e); k([0, 2, 4], function (a) { c[a] += h; c[a + 1] += b }) }) } a.apply(this, [].slice.call(arguments, 1)) }); a(n.pie.prototype, "addPoint", function (a) {
            a.apply(this, [].slice.call(arguments, 1));
            this.chart.is3d() && this.update(this.userOptions, !0)
        }); a(n.pie.prototype, "animate", function (a) {
            if (this.chart.is3d()) {
                var f = arguments[1], g = this.options.animation, k = this.center, d = this.group, e = this.markerGroup; u && (!0 === g && (g = {}), f ? (d.oldtranslateX = d.translateX, d.oldtranslateY = d.translateY, f = { translateX: k[0], translateY: k[1], scaleX: .001, scaleY: .001 }, d.attr(f), e && (e.attrSetters = d.attrSetters, e.attr(f))) : (f = { translateX: d.oldtranslateX, translateY: d.oldtranslateY, scaleX: 1, scaleY: 1 }, d.animate(f, g), e && e.animate(f,
                g), this.animate = null))
            } else a.apply(this, [].slice.call(arguments, 1))
        })
    })(D); (function (a) {
        var q = a.perspective, k = a.pick, p = a.Point, n = a.seriesTypes, u = a.wrap; u(n.scatter.prototype, "translate", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); if (this.chart.is3d()) {
                var f = this.chart, g = k(this.zAxis, f.options.zAxis[0]), m = [], d, e, c; for (c = 0; c < this.data.length; c++) d = this.data[c], e = g.isLog && g.val2lin ? g.val2lin(d.z) : d.z, d.plotZ = g.translate(e), d.isInside = d.isInside ? e >= g.min && e <= g.max : !1, m.push({
                    x: d.plotX, y: d.plotY,
                    z: d.plotZ
                }); f = q(m, f, !0); for (c = 0; c < this.data.length; c++) d = this.data[c], g = f[c], d.plotXold = d.plotX, d.plotYold = d.plotY, d.plotZold = d.plotZ, d.plotX = g.x, d.plotY = g.y, d.plotZ = g.z
            }
        }); u(n.scatter.prototype, "init", function (a, f, g) {
            f.is3d() && (this.axisTypes = ["xAxis", "yAxis", "zAxis"], this.pointArrayMap = ["x", "y", "z"], this.parallelArrays = ["x", "y", "z"], this.directTouch = !0); a = a.apply(this, [f, g]); this.chart.is3d() && (this.tooltipOptions.pointFormat = this.userOptions.tooltip ? this.userOptions.tooltip.pointFormat || "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e" :
            "x: \x3cb\x3e{point.x}\x3c/b\x3e\x3cbr/\x3ey: \x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3ez: \x3cb\x3e{point.z}\x3c/b\x3e\x3cbr/\x3e"); return a
        }); u(n.scatter.prototype, "pointAttribs", function (k, f) { var g = k.apply(this, [].slice.call(arguments, 1)); this.chart.is3d() && f && (g.zIndex = a.pointCameraDistance(f, this.chart)); return g }); u(p.prototype, "applyOptions", function (a) { var f = a.apply(this, [].slice.call(arguments, 1)); this.series.chart.is3d() && void 0 === f.z && (f.z = 0); return f })
    })(D); (function (a) {
        var q = a.Axis, k = a.SVGRenderer,
        p = a.VMLRenderer; p && (a.setOptions({ animate: !1 }), p.prototype.cuboid = k.prototype.cuboid, p.prototype.cuboidPath = k.prototype.cuboidPath, p.prototype.toLinePath = k.prototype.toLinePath, p.prototype.createElement3D = k.prototype.createElement3D, p.prototype.arc3d = function (a) { a = k.prototype.arc3d.call(this, a); a.css({ zIndex: a.zIndex }); return a }, a.VMLRenderer.prototype.arc3dPath = a.SVGRenderer.prototype.arc3dPath, a.wrap(q.prototype, "render", function (a) {
            a.apply(this, [].slice.call(arguments, 1)); this.sideFrame && (this.sideFrame.css({ zIndex: 0 }),
            this.sideFrame.front.attr({ fill: this.sideFrame.color })); this.bottomFrame && (this.bottomFrame.css({ zIndex: 1 }), this.bottomFrame.front.attr({ fill: this.bottomFrame.color })); this.backFrame && (this.backFrame.css({ zIndex: 0 }), this.backFrame.front.attr({ fill: this.backFrame.color }))
        }))
    })(D)
});