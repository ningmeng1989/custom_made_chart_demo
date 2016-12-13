/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("common.dvAccordion", ["ui.bootstrap.transition"]).constant("dvAccordionConfig", {closeOthers: !0}).run(["$templateCache", function (n) {
    n.put("dv-accordion.html", '<div class="dv-accordion-group" ng-transclude></div>'), n.put("dv-accordion-group.html", '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <div class="accordion-toggle" ng-click="toggleOpen()" dv-accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></div>\n    </h4>\n  </div>\n  <div class="panel-collapse" dv-collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')
}]).controller("dvAccordionController", ["$scope", "$attrs", "dvAccordionConfig", function (n, e, o) {
    this.groups = [], this.closeOthers = function (o) {
        var i = angular.isDefined(e.closeOthers) ? n.$eval(e.closeOthers) : accordionConfig.closeOthers;
        i && angular.forEach(this.groups, function (n) {
            n !== o && (n.isOpen = !1)
        })
    }, this.afterClose = function (o) {
        var i = angular.isDefined(e.closeOthers) ? n.$eval(e.closeOthers) : accordionConfig.closeOthers;
        i && (angular.forEach(this.groups, function (n) {
            return n === o || n.isDisabled ? void 0 : void(n.isOpen = !0)
        }), o.isOpen = !0)
    }, this.addGroup = function (n) {
        var e = this;
        this.groups.push(n), n.$on("$destroy", function (o) {
            e.removeGroup(n)
        })
    }, this.removeGroup = function (n) {
        var e = this.groups.indexOf(n);
        -1 !== e && this.groups.splice(e, 1)
    }, this.getGroupCount = function () {
        return this.groups.length
    }
}]).directive("dvAccordion", function () {
    return {
        restrict: "EA",
        controller: "dvAccordionController",
        controllerAs: "accordion",
        transclude: !0,
        replace: !1,
        templateUrl: "dv-accordion.html",
        link: function (n, e, o, i) {
            function t() {
                var n = e.parent().height();
                i.panelBodyHeight = n - i.panelHeadingHeight * i.getGroupCount()
            }

            n.$on("$destroy", function () {
                $(window).off("resize", t)
            }), i.panelHeadingHeight = e.find(".panel-heading").first().outerHeight(!0), t(), $(window).on("resize", t)
        }
    }
}).directive("dvAccordionGroup", function () {
    return {
        require: "^dvAccordion",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "dv-accordion-group.html",
        scope: {heading: "@", isOpen: "=?", isDisabled: "=?"},
        controller: function () {
            this.setHeading = function (n) {
                this.heading = n
            }
        },
        link: function (n, e, o, i) {
            i.addGroup(n);
            e.find(".panel-heading").outerHeight(!0);
            n.$watch("isOpen", function (e) {
                e && i.closeOthers(n)
            }), n.toggleOpen = function () {
                n.isDisabled || (n.isOpen = !n.isOpen, n.isOpen || i.afterClose(n))
            }
        }
    }
}).directive("dvAccordionHeading", function () {
    return {
        restrict: "EA",
        transclude: !0,
        template: "",
        replace: !0,
        require: "^dvAccordionGroup",
        link: function (n, e, o, i, t) {
            i.setHeading(t(n, function () {
            }))
        }
    }
}).directive("dvAccordionTransclude", function () {
    return {
        require: "^dvAccordionGroup", link: function (n, e, o, i) {
            n.$watch(function () {
                return i[o.dvAccordionTransclude]
            }, function (n) {
                n && (e.html(""), e.append(n))
            })
        }
    }
}).directive("dvCollapse", ["$transition", function (n) {
    return {
        require: "^dvAccordion", link: function (e, o, i, t) {
            function c(e) {
                function i() {
                    d === t && (d = void 0)
                }

                var t = n(o, e);
                return d && d.cancel(), d = t, t.then(i, i), t
            }

            function r() {
                u ? (u = !1, s()) : (o.children(".panel-body").css({overflowY: "hidden"}), o.removeClass("collapse").addClass("collapsing"), c({height: t.panelBodyHeight + "px"}).then(s))
            }

            function s() {
                o.children(".panel-body").css({overflowY: "auto"}), o.removeClass("collapsing"), o.addClass("collapse in"), o.parent().css({height: "calc(100% - " + t.panelHeadingHeight * (t.getGroupCount() - 1) + "px)"}), o.css({height: "calc(100% - " + t.panelHeadingHeight + "px)"}), e.$broadcast("accordion-expand-done")
            }

            function a() {
                u ? (u = !1, l(), o.css({height: 0})) : (o.parent().css({height: "auto"}), o.css({height: t.panelBodyHeight + "px"}), setTimeout(function () {
                    o[0].offsetWidth;
                    o.children(".panel-body").css({overflowY: "hidden"}), o.removeClass("collapse in").addClass("collapsing"), c({height: 0}).then(l)
                }, 0))
            }

            function l() {
                o.children(".panel-body").css({overflowY: "auto"}), o.removeClass("collapsing"), o.addClass("collapse")
            }

            var d, u = !0;
            e.$watch(i.dvCollapse, function (n) {
                n ? a() : r()
            })
        }
    }
}]);