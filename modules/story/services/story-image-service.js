/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
angular.module("dataviz.story").factory("storyImageService",["$http","$q","storyConfig",function(e,r,t){return{getImages:function(a,o,n,c){var i=t.imageUrl+a+"/"+o,d=r.defer(),u={projectId:n};return c&&(u.search=c),e.get(i,{params:u}).then(function(e){e.data.error?d.reject(e.data.error):d.resolve(e.data.object)},function(e){d.reject(e)}),d.promise},removeImage:function(a){var o=t.imageUrl+a,n=r.defer();return e["delete"](o).then(function(e){e.data.error?n.reject(e.data.error):n.resolve(e.data.object)},function(e){n.reject(e)}),n.promise}}}]);