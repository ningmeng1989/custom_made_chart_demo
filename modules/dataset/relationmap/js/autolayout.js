/*!***********************************************
 Copyright (c) 2016, Neusoft Inc.
 All rights reserved
 SaCa DataViz Version 3.1.0
 ************************************************/
var SimpleLayout=function(t,e,g,i){var h=0,r=0,a=0,d=0,v=0,W=0,H=0,n=0,f=0;for(var o in g){var u=g[o];n+=u.getHeight(),f+=u.getWidth(),a<u.getHeight()&&(a=u.getHeight()),W<u.getWidth()&&(W=u.getWidth()),(0==d||d>u.getHeight())&&(d=u.getHeight()),(0==H||H>u.getWidth())&&(H=u.getWidth()),h++}r=n/h,v=f/h;var l=t/e,y=50,c=y*l,m=15,p=m*l,s={};if(i);else{var w=p,x=m;for(var o in g){var u=g[o];w+u.getWidth()+c>t&&(w=p,x=x+y+r),s[o]={x:w,y:x,width:u.getWidth(),height:u.getHeight()},w+=u.getWidth()+c}}return s};