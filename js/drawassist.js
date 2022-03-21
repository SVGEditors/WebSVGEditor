/**
 *
 * @license MIT
 *
 * @copyright: 2022 LinJi
 *
 * @technical support: www.svgsvg.cn
 *
 * @email: 93681992@qq.com
 *
 * @module: SVGEditor
 * 
 * 版权申明: 源码基于MIT开源协议，您可以自由复制、修改、变更、发行，但需要保留以上申明。
 * 
 */
 
function DrawAssist()
{
	
};

DrawAssist.prototype.clearPointFocus = function()
{
	var focusobj = document.getElementById("svgfocus");
	while(focusobj.firstChild) 
	{
        focusobj.removeChild(focusobj.firstChild);
	}
};

DrawAssist.prototype.clearHintFocus = function()
{
	var focusobj = document.getElementById("hinttext");
	while(focusobj.firstChild) 
	{
        focusobj.removeChild(focusobj.firstChild);
	}
};

DrawAssist.prototype.removeGChild = function(gnode)
{
	if(gnode != undefined && gnode.nodeType == 1)
	{
		while(gnode.firstChild) 
		{
			gnode.removeChild(gnode.firstChild);
		}
	}
};

DrawAssist.prototype.removeSelf = function(node)
{
	if(node != undefined)
	{
	    var parentNode = node.parentNode;
        parentNode.removeChild(node);
	}
};

DrawAssist.prototype.ShowCorsorPoint = function(event,textobj,hittext,bshow)
{
	 if(!bshow)
	 {
		textobj.setAttribute("visibility","hidden");
	 }
	 else
	 {
	   	var svgnode = document.getElementById("svgnode");
	    var clientrc = svgnode.getBoundingClientRect();
		var gcanvas = document.getElementById("svgcanvas");
		var matstr  = gcanvas.getAttribute("transform");
		var mat = new Matrix;
		var rmat = mat.Inverse(matstr);
		var xpos = event.clientX - clientrc.left+5;
		var ypos = event.clientY - clientrc.top+15;
		var ptArr = [];
		ptArr.push(xpos);
		ptArr.push(ypos);
		ptArr = mat.caclPoint(rmat,ptArr);
		
		
		var xpos = Math.round(parseFloat(ptArr[0]));
		var ypos = Math.round(parseFloat(ptArr[1]));

		textobj.setAttribute("visibility","visible");
		textobj.setAttribute("x",ptArr[0]);
		textobj.setAttribute("y",ptArr[1]);
		var txtout = "["+xpos+","+ypos+"]";
		textobj.textContent = txtout + hittext;
	}	 
};

DrawAssist.prototype.createFocusText = function(ptx,pty,group)
{
	var textobj =  document.createElementNS("http://www.w3.org/2000/svg", "text");
	textobj.setAttribute("fill","#000000");
	textobj.setAttribute("fill-opacity","1");	
	textobj.setAttribute("stroke","#000000");
	textobj.setAttribute("stroke-opacity","1");
		
	textobj.setAttribute("x",ptx);
	textobj.setAttribute("y",pty);
	textobj.textContent = "";
	
	 if(group == undefined)
	{
		var svgfocusobj = document.getElementById("svgfocus");
		svgfocusobj.appendChild(textobj);	
	}
	else
	{
		group.appendChild(textobj);
	}
	return textobj;	
};

DrawAssist.prototype.createHintText = function(ptx,pty)
{
	var textobj =  document.createElementNS("http://www.w3.org/2000/svg", "text");
	textobj.setAttribute("fill","#000000");
	textobj.setAttribute("fill-opacity","1");	
	textobj.setAttribute("stroke","#000000");
	textobj.setAttribute("stroke-opacity","1");
		
	textobj.setAttribute("x",ptx);
	textobj.setAttribute("y",pty);
	textobj.textContent = "";
	
	var svghitobj = document.getElementById("hinttext");
	svghitobj.appendChild(textobj);		
		
	return textobj;	
};

DrawAssist.prototype.createFocusLine = function(ptx1,pty1,ptx2,pty2)
{
	var lineobj =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj.setAttribute("x1",ptx1);
	lineobj.setAttribute("y1",pty1);
	lineobj.setAttribute("x2",ptx2);
	lineobj.setAttribute("y2",pty2);	
	lineobj.setAttribute("stroke","#000000");
	lineobj.setAttribute("stroke-opacity","0.5");
	lineobj.setAttribute("stroke-dasharray","4 4");
	
	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(lineobj);	
	
	return lineobj;
};

DrawAssist.prototype.createFocusImage = function(ptx,pty,width,height,href)
{
	var imageobj =  document.createElementNS("http://www.w3.org/2000/svg", "image");
	imageobj.setAttribute("x",ptx);
	imageobj.setAttribute("y",pty);
	imageobj.setAttribute("width",width);
	imageobj.setAttribute("height",height);	
	imageobj.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",href);

	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(imageobj);	
	return imageobj;
};

DrawAssist.prototype.createFocusInputLine = function(ptx1,pty1,ptx2,pty2)
{
	var lineobj =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj.setAttribute("x1",ptx1);
	lineobj.setAttribute("y1",pty1);
	lineobj.setAttribute("x2",ptx2);
	lineobj.setAttribute("y2",pty2);	
	lineobj.setAttribute("stroke","#000000");
	lineobj.setAttribute("stroke-opacity","1");

	
	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(lineobj);	
	
	return lineobj;
};

DrawAssist.prototype.createFocusInputRect = function(x,y,width,height)
{
	var rectobj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectobj.setAttribute("x",x);
	rectobj.setAttribute("y",y);
	rectobj.setAttribute("width",width);
	rectobj.setAttribute("height",height);	
	rectobj.setAttribute("stroke","#0000FF");
	rectobj.setAttribute("stroke-opacity","1");
	rectobj.setAttribute("fill-opacity","0");
	
	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(rectobj);	
	
	return rectobj;
};

DrawAssist.prototype.createTextBoxFocus = function(pt1,pt2,pt3,pt4,clr)
{
	if(clr == undefined)
	{
		clr = "#0000FF";
	}
	var lineobj1 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj1.setAttribute("x1",pt1.x);
	lineobj1.setAttribute("y1",pt1.y);
	lineobj1.setAttribute("x2",pt2.x);
	lineobj1.setAttribute("y2",pt2.y);
	lineobj1.setAttribute("stroke",clr);
	lineobj1.setAttribute("stroke-dasharray","4 2");
	lineobj1.setAttribute("stroke-opacity","1");
	lineobj1.setAttribute("stroke-width","1");
	
	var lineobj2 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj2.setAttribute("x1",pt2.x);
	lineobj2.setAttribute("y1",pt2.y);
	lineobj2.setAttribute("x2",pt3.x);
	lineobj2.setAttribute("y2",pt3.y);
	lineobj2.setAttribute("stroke",clr);
	lineobj2.setAttribute("stroke-dasharray","4 2");
	lineobj2.setAttribute("stroke-opacity","1");
	lineobj2.setAttribute("stroke-width","1");
	
	var lineobj3 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj3.setAttribute("x1",pt3.x);
	lineobj3.setAttribute("y1",pt3.y);
	lineobj3.setAttribute("x2",pt4.x);
	lineobj3.setAttribute("y2",pt4.y);
	lineobj3.setAttribute("stroke",clr);
	lineobj3.setAttribute("stroke-dasharray","4 2");
	lineobj3.setAttribute("stroke-opacity","1");
	lineobj3.setAttribute("stroke-width","1");
	
	var lineobj4 =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj4.setAttribute("x1",pt4.x);
	lineobj4.setAttribute("y1",pt4.y);
	lineobj4.setAttribute("x2",pt1.x);
	lineobj4.setAttribute("y2",pt1.y);
	lineobj4.setAttribute("stroke",clr);
	lineobj4.setAttribute("stroke-dasharray","4 2");
	lineobj4.setAttribute("stroke-opacity","1");
	lineobj4.setAttribute("stroke-width","1");
	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(lineobj1);
	svgfocusobj.appendChild(lineobj2);
	svgfocusobj.appendChild(lineobj3);
	svgfocusobj.appendChild(lineobj4);
};

DrawAssist.prototype.createTempFocusRect = function(x,y,width,height)
{
	var svgfocusobj = document.getElementById("svgfocus");
	var svgtempfocus = document.getElementById("svgtempfocus");
	if(svgtempfocus == undefined)
	{
		svgtempfocus = document.createElementNS("http://www.w3.org/2000/svg", "g");
		svgtempfocus.setAttribute("id","svgtempfocus");
		svgfocusobj.appendChild(svgtempfocus);	
	}
	var rectobj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectobj.setAttribute("x",x);
	rectobj.setAttribute("y",y);
	rectobj.setAttribute("width",width);
	rectobj.setAttribute("height",height);	
	rectobj.setAttribute("stroke","#0000FF");
	rectobj.setAttribute("stroke-dasharray","4 2");
	rectobj.setAttribute("stroke-opacity","1");
	rectobj.setAttribute("fill-opacity","0");
	svgtempfocus.appendChild(rectobj);	
	return rectobj;
};

DrawAssist.prototype.createTempFocusTriangle = function(x1,y1,x2,y2,x3,y3)
{
	var svgfocusobj = document.getElementById("svgfocus");
	var svgtempfocus = document.getElementById("svgtempfocus");
	if(svgtempfocus == undefined)
	{
		svgtempfocus = document.createElementNS("http://www.w3.org/2000/svg", "g");
		svgtempfocus.setAttribute("id","svgtempfocus");
		svgfocusobj.appendChild(svgtempfocus);	
	}
	var triangleobj =  document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	triangleobj.setAttribute("points",x1+" "+y1+" "+x2+" "+y2+" "+x3+" "+y3);
	triangleobj.setAttribute("stroke","#0000FF");
	triangleobj.setAttribute("stroke-dasharray","4 2");
	triangleobj.setAttribute("stroke-opacity","1");
	triangleobj.setAttribute("fill-opacity","0");
	svgtempfocus.appendChild(triangleobj);	
	return triangleobj;
};

DrawAssist.prototype.ClearTempFocus = function()
{
	var svgtempfocus = document.getElementById("svgtempfocus");
	while(svgtempfocus != undefined && svgtempfocus.firstChild) 
	{
        svgtempfocus.removeChild(svgtempfocus.firstChild);
	}
};

DrawAssist.prototype.createFocusPolyLine = function(points)
{
   var polylineobj =  document.createElementNS("http://www.w3.org/2000/svg", "polyline");
   polylineobj.setAttribute("points",points);
   polylineobj.setAttribute("stroke","#F0B41E");
   polylineobj.setAttribute("stroke-opacity",1);
   polylineobj.setAttribute("stroke-dasharray","12 2");
   polylineobj.setAttribute("fill","none");
   var svgfocusobj = document.getElementById("svgfocus");
   svgfocusobj.appendChild(polylineobj);	
   return polylineobj;
};

DrawAssist.prototype.createFocusPath = function()
{
	var pathobj = document.createElementNS("http://www.w3.org/2000/svg", "path");
	pathobj.setAttribute("stroke","#000000");
	pathobj.setAttribute("stroke-opacity","0.5");
	pathobj.setAttribute("stroke-dasharray","4 4");
	pathobj.setAttribute("fill","none");
	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(pathobj);	
	return pathobj;
};

DrawAssist.prototype.createFocusPoint = function(strmat,ptx,pty,clr,group)
{
	if(strmat != undefined)
	{
		var mat = new Matrix();
		var ptOrg1 = [];
		ptOrg1.push(ptx);
		ptOrg1.push(pty);
		var retData = mat.caclPoint(strmat,ptOrg1);
		ptx = parseFloat(retData[0]);
		pty = parseFloat(retData[1]);
	}
	if(clr == undefined)
	{
		clr = "#0000FF";
	}
    var rectobj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectobj.setAttribute("x",ptx-5);
    rectobj.setAttribute("y",pty-5);
    rectobj.setAttribute("width",10);
    rectobj.setAttribute("height",10);
    rectobj.setAttribute("stroke","#000000");
    rectobj.setAttribute("stroke-opacity",1);
    rectobj.setAttribute("fill",clr);
    rectobj.setAttribute("fill-opacity","1");
    rectobj.setAttribute("hintable","yes");
    if(group == undefined)
	{
		var svgfocusobj = document.getElementById("svgfocus");
		svgfocusobj.appendChild(rectobj);	
	}
	else
	{
		group.appendChild(rectobj);
	}
   return rectobj;
};

DrawAssist.prototype.createBindTextFocusCircle = function(ptx,pty,r)
{
   var circleobj =  document.createElementNS("http://www.w3.org/2000/svg", "circle");
   circleobj.setAttribute("cx",ptx);
   circleobj.setAttribute("cy",pty);
   circleobj.setAttribute("r",r);
   circleobj.setAttribute("stroke","#000000");
   circleobj.setAttribute("stroke-opacity",1);
   circleobj.setAttribute("stroke-dasharray","4 4");
   circleobj.setAttribute("fill-opacity","0");
   var svgfocusobj = document.getElementById("svgfocus");
   svgfocusobj.appendChild(circleobj);	
};

DrawAssist.prototype.createBindTextFocusRect = function(ptx,pty)
{
    var rectobj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectobj.setAttribute("x",ptx-5);
	rectobj.setAttribute("y",pty-8);
	rectobj.setAttribute("width",10);
	rectobj.setAttribute("height",16);	
	rectobj.setAttribute("stroke","#0000FF");
	rectobj.setAttribute("stroke-opacity","1");
	rectobj.setAttribute("fill-opacity","0");
	
	var svgfocusobj = document.getElementById("svgfocus");
	svgfocusobj.appendChild(rectobj);	
	return rectobj;
};

DrawAssist.prototype.createAngular = function(ptx,pty)
{
	var circleobj =  document.createElementNS("http://www.w3.org/2000/svg", "circle");
   circleobj.setAttribute("cx",ptx);
   circleobj.setAttribute("cy",pty);
   circleobj.setAttribute("r",2);
   circleobj.setAttribute("stroke","#000000");
   circleobj.setAttribute("stroke-opacity",1);
   circleobj.setAttribute("fill","#00FF00");
   circleobj.setAttribute("fill-opacity","0");
   var svgfocusobj = document.getElementById("svgfocus");
   svgfocusobj.appendChild(circleobj);
   return circleobj;
};

DrawAssist.prototype.IsValidPolyLine = function(polylineobj)
{
	if(polylineobj)
	{
		var points = polylineobj.getAttribute("points");
		var str = points.replace(/ /g, ',');
		var strs= new Array();
		strs=str.split(",");
		if(strs.length >= 4)
		{
			var lstx = parseFloat(strs[0]);
			var lsty = parseFloat(strs[1]);
			for(var i = 2; i < strs.length; i+=2)
			{
				var x = parseFloat(strs[i]);
				var y = parseFloat(strs[i+1]);
				if(Math.abs(x-lstx)>0.001||Math.abs(y-lsty)>0.001)
				{
					return true;
				}
				lstx = x;
				lsty = y;			    
			}
		}
	}
	return false;
};

DrawAssist.prototype.createAnimatePopMenu = function(svgobj)
{
	return;
	var popmenuObj = document.getElementById("popupmenu");
	this.removeGChild(popmenuObj);
	if(svgobj != undefined)
	{
		var topNode = svgobj;
		while(topNode)
		{
		   if(topNode.parentNode != undefined)
		   {
			   var strtopid = topNode.parentNode.getAttribute("id");
			   if(strtopid == "svgcanvas")
			   {
				   break;
			   }
			   topNode = topNode.parentNode;
		   }
		}
		var bbox = topNode.getBBox();
		var rectobj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
		popmenuObj.appendChild(rectobj);
		rectobj.setAttribute("x",bbox.x+bbox.width+5);
		rectobj.setAttribute("y",bbox.y);
		rectobj.setAttribute("width","100");
		rectobj.setAttribute("height","20");	
		rectobj.setAttribute("stroke","#FF0000");
		rectobj.setAttribute("stroke-opacity","1");
	}
};

DrawAssist.prototype.createEightFocus = function(svgobj,clr)
{
	var pt1 = {};
	var pt2 = {};
	var pt3 = {};
	var pt4 = {};
	var pt5 = {};
	var pt6 = {};
	var pt7 = {};
	var pt8 = {};
	var bbox = svgobj.getBBox();
	pt1.x = bbox.x;
	pt1.y = bbox.y;
	pt2.x = bbox.x + bbox.width/2;
	pt2.y = bbox.y;
	pt3.x = bbox.x + bbox.width;
	pt3.y = bbox.y;
	pt4.x = bbox.x+bbox.width;
	pt4.y = bbox.y + bbox.height/2;
	pt5.x = bbox.x +bbox.width;
	pt5.y = bbox.y + bbox.height;
	pt6.x = bbox.x + bbox.width/2;
	pt6.y = bbox.y + bbox.height;
	pt7.x = bbox.x;
	pt7.y = bbox.y + bbox.height;
	pt8.x = bbox.x;
	pt8.y = bbox.y + bbox.height/2;
	
	var objid = svgobj.getAttribute("id");
	if(objid == undefined || objid == "")
	{
		var myDate =  new Date();
		objid = myDate.getTime();
		svgobj.setAttribute("id",objid);
	}
	var strmat = clsglobal.getNodeAllMatrix(svgobj);
	var objpt1 = this.createFocusPoint(strmat,pt1.x,pt1.y,clr);
	objpt1.setAttribute("belongid",objid);
	objpt1.setAttribute("belong",svgobj.tagName);
	objpt1.setAttribute("dragname","1");
	objpt1.setAttribute("cursortype","movepoint");
	
	var objpt2 = this.createFocusPoint(strmat,pt2.x,pt2.y,clr);
	objpt2.setAttribute("belongid",objid);
	objpt2.setAttribute("belong",svgobj.tagName);
	objpt2.setAttribute("dragname","2");
	objpt2.setAttribute("cursortype","movepoint");
	
	var objpt3 = this.createFocusPoint(strmat,pt3.x,pt3.y,clr);
	objpt3.setAttribute("belongid",objid);
	objpt3.setAttribute("belong",svgobj.tagName);
	objpt3.setAttribute("dragname","3");
	objpt3.setAttribute("cursortype","movepoint");
	
	var objpt4 = this.createFocusPoint(strmat,pt4.x,pt4.y,clr);
	objpt4.setAttribute("belongid",objid);
	objpt4.setAttribute("belong",svgobj.tagName);
	objpt4.setAttribute("dragname","4");
	objpt4.setAttribute("cursortype","movepoint");
	
	var objpt5 = this.createFocusPoint(strmat,pt5.x,pt5.y,clr);
	objpt5.setAttribute("belongid",objid);
	objpt5.setAttribute("belong",svgobj.tagName);
	objpt5.setAttribute("dragname","5");
	objpt5.setAttribute("cursortype","movepoint");
	
	var objpt6 = this.createFocusPoint(strmat,pt6.x,pt6.y,clr);
	objpt6.setAttribute("belongid",objid);
	objpt6.setAttribute("belong",svgobj.tagName);
	objpt6.setAttribute("dragname","6");
	objpt6.setAttribute("cursortype","movepoint");
	
	var objpt7 = this.createFocusPoint(strmat,pt7.x,pt7.y,clr);
	objpt7.setAttribute("belongid",objid);
	objpt7.setAttribute("belong",svgobj.tagName);
	objpt7.setAttribute("dragname","7");
	objpt7.setAttribute("cursortype","movepoint");
		
	var objpt8 = this.createFocusPoint(strmat,pt8.x,pt8.y,clr);
	objpt8.setAttribute("belongid",objid);
	objpt8.setAttribute("belong",svgobj.tagName);
	objpt8.setAttribute("dragname","8");
	objpt8.setAttribute("cursortype","movepoint");
};

DrawAssist.prototype.createLineFocus = function(svgobj)
{
	var x1 = svgobj.getAttribute("x1");
	var y1 = svgobj.getAttribute("y1");
	var x2  = svgobj.getAttribute("x2");
	var y2  = svgobj.getAttribute("y2");
	x1  = parseFloat(x1);
	y1  = parseFloat(y1);
	x2  = parseFloat(x2);
	y2  = parseFloat(y2);
	
	var objid = svgobj.getAttribute("id");
	if(objid == undefined || objid == "")
	{
		var myDate =  new Date();
		objid = myDate.getTime();
		svgobj.setAttribute("id",objid);
	}
	var strmat = clsglobal.getNodeAllMatrix(svgobj);
	var fristpt = this.createFocusPoint(strmat,x1,y1);
	fristpt.setAttribute("belong","line");
	fristpt.setAttribute("dragname","firstpoint");
	fristpt.setAttribute("cursortype","movepoint");
	fristpt.setAttribute("belongid",objid);
		
	var lastpt = this.createFocusPoint(strmat,x2,y2);
	lastpt.setAttribute("belong","line");
	lastpt.setAttribute("dragname","lastpoint");
	lastpt.setAttribute("cursortype","movepoint");
	lastpt.setAttribute("belongid",objid);
};

DrawAssist.prototype.createTextFocus = function(textobj,clr)
{
	var strmat = clsglobal.getNodeAllMatrix(textobj);
	var bbox = textobj.getBBox();
	var pt1 = {};
	pt1.x = bbox.x;
	pt1.y = bbox.y;
	var pt2 = {};
	pt2.x = bbox.x + bbox.width;
	pt2.y = bbox.y;
	var pt3 = {};
	pt3.x = bbox.x + bbox.width;
	pt3.y = bbox.y + bbox.height;
	var pt4 = {};
	pt4.x = bbox.x;
	pt4.y = bbox.y + bbox.height;
	
	var matobj = new Matrix();
	pt1 = matobj.NewcaclPoint(strmat,pt1);
	pt2 = matobj.NewcaclPoint(strmat,pt2);
	pt3 = matobj.NewcaclPoint(strmat,pt3);
	pt4 = matobj.NewcaclPoint(strmat,pt4);
	
	this.createTextBoxFocus(pt1,pt2,pt3,pt4,clr);
};

DrawAssist.prototype.createPolylineFocus = function(svgobj)
{	
    var objid = svgobj.getAttribute("id");
	if(objid == undefined || objid == "")
	{
		var myDate =  new Date();
		objid = myDate.getTime();
		svgobj.setAttribute("id",objid);
	}
	var strmat = clsglobal.getNodeAllMatrix(svgobj);
	var points = svgobj.getAttribute("points");
	var str = points.replace(/ /g, ',');
	var strs= new Array();
	strs=str.split(",");
	if(strs.length >= 2)
	{
		var index = 0;
		for(var i = 0; i < strs.length; i+=2)
		{
			var x = parseFloat(strs[i]);
			var y = parseFloat(strs[i+1]);
			var circlept = this.createFocusPoint(strmat,x,y);		
			circlept.setAttribute("belong","polyline");
			circlept.setAttribute("dragname",index);
			circlept.setAttribute("belongid",objid);
			circlept.setAttribute("cursortype","movepoint");
			index++;
		}
	}		
};

DrawAssist.prototype.getTextBox = function(txtnode,txtcontent)
{
   var oldtextContent = txtnode.textContent;
   txtnode.textContent = txtcontent;
   var bbox = txtnode.getBBox();
   txtnode.textContent = oldtextContent;
   return bbox;
};

DrawAssist.prototype.PointGetTextPos = function(txtnode,px,py)
{
	var pos = 0;
	var txtcontent = txtnode.textContent;
	if(txtcontent == null || txtcontent == undefined)
		return pos;
	var lstwidth = 0;
	for(var i = 0; i <= txtcontent.length; ++i)
	{
		var sustring = txtcontent.substring(0,i);
		var bbox =  this.getTextBox(txtnode,sustring);
		var fwidth = (bbox.width+lstwidth)*1.0/2;
			
		if(parseFloat(px) <= (bbox.x+fwidth))
		{
			pos = i-1;
			break;
		}
		else if(parseFloat(px) >= (bbox.x+fwidth))
		{
			pos = i;
		}
	
		lstwidth = bbox.width;
	}	
	return pos;	
};

DrawAssist.prototype.IsPointInCircle2 = function(cx,cy,r,ptx,pty)
{
	var dis = Math.sqrt(Math.pow(parseFloat(ptx)-parseFloat(cx),2)+Math.pow(parseFloat(pty)-parseFloat(cy),2));
	if(dis <= r)
	{
		return true;
	}
	return false;
};

DrawAssist.prototype.getEventPoint = function(eventx,eventy)
{
  var svgnode = document.getElementById("svgnode");
  var clientrc = svgnode.getBoundingClientRect();
  var gcanvas = document.getElementById("svgcanvas");
  var matstr  = gcanvas.getAttribute("transform");
  var mat = new Matrix;
  var rmat = mat.Inverse(matstr);
  var xpos = eventx - clientrc.left;
  var ypos = eventy - clientrc.top;
  var ptArr = [];
  ptArr.push(xpos);
  ptArr.push(ypos);
  ptArr = mat.caclPoint(rmat,ptArr);
  return ptArr;
};


DrawAssist.prototype.createSVGNodeFocus = function(svgobj,clr)
{
	if(svgobj != undefined && svgobj.nodeType == 1)
	{
		if(svgobj.tagName == "polyline" || svgobj.tagName == "polygon")
		{
			drawAssist.createPolylineFocus(svgobj,clr);
		}
		else if(svgobj.tagName == "line")
		{
			drawAssist.createLineFocus(svgobj,clr);
		}
		else if(svgobj.tagName == "rect" || svgobj.tagName == "image" || svgobj.tagName == "circle" || svgobj.tagName == "ellipse" )
		{
			drawAssist.createEightFocus(svgobj,clr);
		}
		else if(svgobj.tagName == "text")
		{
			drawAssist.createTextFocus(svgobj,clr);
		}		
	}
};











