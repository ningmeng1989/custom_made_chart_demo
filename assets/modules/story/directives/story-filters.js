/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").directive("storyFilters",[function(){return{restrict:"AE",replace:!0,templateUrl:"modules/story/views/story-filters.html",link:function(e,r,t){e.filters=[],e.filterDragEnter=function(e){r.css({border:"2px solid #ffa500"})},e.filterDrop=function(t){r.css({border:"none"});var i=t.getData(),l=i.filter;e.filters.push({id:e.filters.length,text:l})},e.filterDragLeave=function(e){r.css({border:"none"})},e.removeFilter=function(r){e.filters.splice(r,1)}}}}]);