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
 
/*drawLinetool*/
function DrawLineTool()
{
	this.tooltype        = "line";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
		
	this.lsptx = 0;
	this.lspty = 0;
};

DrawLineTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
	  drawAssist.ShowCorsorPoint(event,this.cursortext,"",false);

	  var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	
	  this.lsptx = ptArr[0];
	  this.lspty = ptArr[1];  
	  if(this.currdrawobj == undefined)
	  {	
	    drawAssist.clearPointFocus();
		this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "line");
		this.currdrawobj.setAttribute("x1",ptArr[0]);
		this.currdrawobj.setAttribute("y1",ptArr[1]);
		this.currdrawobj.setAttribute("x2",ptArr[0]);
		this.currdrawobj.setAttribute("y2",ptArr[1]);	
		this.currdrawobj.setAttribute("stroke",strokeclr);
		this.currdrawobj.setAttribute("stroke-width",gstrokewidth);
		this.currdrawobj.setAttribute("stroke-dasharray",gstroketype);
		this.currdrawobj.setAttribute("stroke-opacity",fstrokepacity);
		var svgcontentobj = document.getElementById("svgcontent");
		svgcontentobj.appendChild(this.currdrawobj);	
		
		var focuspt = drawAssist.createFocusPoint("",ptArr[0],ptArr[1]);
		
	  }
	  else
	  {
		 this.currdrawobj.setAttribute("x2",ptArr[0]);
		 this.currdrawobj.setAttribute("y2",ptArr[1]);
		 this.OnEndDraw();
		 return true;
	  }
	}
	return false;
};

DrawLineTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	if(event.button == 2)
	{
		if(this.currdrawobj)
			bret = false;
		else 
			bret = true;
		this.OnEndDraw();
	}
	return bret;
};

DrawLineTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj)
	{
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		
		this.lsmptx = ptArr[0];
		this.lsmpty = ptArr[1];
		

		this.currdrawobj.setAttribute("x2",ptArr[0]);
		this.currdrawobj.setAttribute("y2",ptArr[1]);	
		
	}
	drawAssist.ShowCorsorPoint(event,this.cursortext,"",true);
};

DrawLineTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawLineTool.prototype.MoveTo = function(event,lineobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	if(lineobj != undefined)
	{
		var strmat = lineobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
	}
	var dragname = focusshape.getAttribute("dragname");
	if(dragname == "firstpoint")
	{		
	    if(lineobj != undefined)
		{
			lineobj.setAttribute("x1",ptArr[0]);
			lineobj.setAttribute("y1",ptArr[1]);
			drawAssist.clearPointFocus();
			drawAssist.createLineFocus(lineobj);
		}	  
	}
	else if(dragname == "lastpoint")
	{
		if(lineobj != undefined)
		{
			lineobj.setAttribute("x2",ptArr[0]);
			lineobj.setAttribute("y2",ptArr[1]);
			drawAssist.clearPointFocus();
			drawAssist.createLineFocus(lineobj);
		}
	}
};

DrawLineTool.prototype.OnEndDraw = function()
{
	var bret = true;
	if(this.currdrawobj)
	{
		bret = false;
		drawAssist.createFocusPoint("",this.lsmptx,this.lsmpty);
		var x1 = parseFloat(this.currdrawobj.getAttribute("x1"));
		var y1 = parseFloat(this.currdrawobj.getAttribute("y1"));
		var x2 = parseFloat(this.currdrawobj.getAttribute("x2"));
		var y2 = parseFloat(this.currdrawobj.getAttribute("y2"));
		drawAssist.clearPointFocus();	
		if(Math.abs(x1-x2)<= 0.001 && Math.abs(y1-y2) <= 0.001)
		{
			removeChild(this.currdrawobj);			
		}
		else
		{
			gselectNode = this.currdrawobj;
			drawAssist.createLineFocus(this.currdrawobj);
			var actadd = new ActionAdd(this.currdrawobj);
			gActionHistory.Add(actadd);
		}
	}
	this.currdrawobj = undefined;
	return bret;
};

/*drawpolylinetool*/
function DrawPolylineTool()
{
	this.tooltype        = "polyline";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx           = 0;
	this.lspty           = 0;
};

DrawPolylineTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
		drawAssist.ShowCorsorPoint(event,this.cursortext,"提示:左键双击或按ESC结束绘制",false);
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		this.lsptx = ptArr[0];
		this.lspty = ptArr[1];
		
		var points = ptArr[0]+","+ptArr[1];
		if(this.currdrawobj == undefined)
		{			
			drawAssist.clearPointFocus();
			this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "polyline");
			this.currdrawobj.setAttribute("points",points);
			this.currdrawobj.setAttribute("stroke",strokeclr);
		    this.currdrawobj.setAttribute("stroke-opacity",fstrokepacity);
			this.currdrawobj.setAttribute("stroke-width",gstrokewidth);
			this.currdrawobj.setAttribute("stroke-dasharray",gstroketype);
			this.currdrawobj.setAttribute("fill","none");
			var svgcontentobj = document.getElementById("svgcontent");
			svgcontentobj.appendChild(this.currdrawobj);	
			drawAssist.createFocusPoint("",this.lsptx,this.lspty);
		}
		else
		{
		    var lstpoints = this.currdrawobj.getAttribute("points");
		    lstpoints += ",";
		    lstpoints += points;
		    this.currdrawobj.setAttribute("points",lstpoints);
			drawAssist.createFocusPoint("",this.lsptx,this.lspty);
		    if(event.detail >= 2)
		    {
			   this.OnEndDraw();
			   return true;
		    }
		}
	}
	return  false;
};

DrawPolylineTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	if(event.button == 2)
	{
		var svgnode = document.getElementById("svgnode");
		var clientrc = svgnode.getBoundingClientRect();
		var gcanvas = document.getElementById("svgcanvas");
		var matstr  = gcanvas.getAttribute("transform");
		var mat = new Matrix;
		var rmat = mat.Inverse(matstr);
		var xpos = event.clientX - clientrc.left;
		var ypos = event.clientY - clientrc.top;
		var ptArr = [];
		ptArr.push(xpos);
		ptArr.push(ypos);
		ptArr = mat.caclPoint(rmat,ptArr);
		this.lsptx = ptArr[0];
		this.lspty = ptArr[1];
		
		if(this.currdrawobj)
			bret = false;
		else 
			bret = true;
		this.OnEndDraw();
	}
	return bret;
};

DrawPolylineTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj)
	{
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		var points = this.currdrawobj.getAttribute("points");
		var subpoints = clsglobal.subLstPoint(points);
		subpoints += ","+ptArr[0]+","+ptArr[1];

		this.currdrawobj.setAttribute("points",subpoints);
	}
	drawAssist.ShowCorsorPoint(event,this.cursortext,"提示:左键双击或按ESC结束绘制",true);
};

DrawPolylineTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawPolylineTool.prototype.MoveTo = function(event,polylineobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(polylineobj!= undefined)
	{
		var strmat = polylineobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
	
		var pointsArr = clsglobal.GetPolylinePoints(polylineobj);
		var curpt = parseInt(dragname);
		if(pointsArr.length/2 > curpt)
		{
			pointsArr[curpt*2] = ptArr[0];
			pointsArr[curpt*2+1] = ptArr[1];
		}
		var newpoints = "";
		for(var i = 0; i < pointsArr.length; ++i)
		{
			if(i != 0)
				newpoints += ",";
			newpoints += pointsArr[i];
		}
		polylineobj.setAttribute("points",newpoints);
		drawAssist.clearPointFocus();
		drawAssist.createPolylineFocus(polylineobj);		
	}
};

DrawPolylineTool.prototype.OnEndDraw = function()
{
	if(this.currdrawobj)
	{
	  var points = this.currdrawobj.getAttribute("points");
	  var ptArr = clsglobal.getLstPoint(points);
	  drawAssist.createFocusPoint("",ptArr[0],ptArr[1]);
	  drawAssist.clearPointFocus();	
	  if(!drawAssist.IsValidPolyLine(this.currdrawobj))
	  {
		  removeChild(this.currdrawobj);
	  }
	  else
	  {
		  gselectNode = this.currdrawobj;
		  drawAssist.createPolylineFocus(this.currdrawobj);
		  var actadd = new ActionAdd(this.currdrawobj);
		  gActionHistory.Add(actadd);
	  }
	  this.currdrawobj = undefined;
	}
	 return true;
};


/*drawpolygontool*/
function DrawPolygonTool()
{
	this.tooltype        = "polygon";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx           = 0;
	this.lspty           = 0;
};

DrawPolygonTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
		drawAssist.ShowCorsorPoint(event,this.cursortext,"提示:左键双击或按ESC结束绘制",false);
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		this.lsptx = ptArr[0];
		this.lspty = ptArr[1];
		
		var points = ptArr[0]+","+ptArr[1];
		if(this.currdrawobj == undefined)
		{			
			drawAssist.clearPointFocus();
			this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			this.currdrawobj.setAttribute("points",points);
			this.currdrawobj.setAttribute("stroke",strokeclr);
			this.currdrawobj.setAttribute("stroke-opacity",fstrokepacity);
			this.currdrawobj.setAttribute("stroke-width",gstrokewidth);
		    this.currdrawobj.setAttribute("stroke-dasharray",gstroketype);
			this.currdrawobj.setAttribute("fill",fillclr);
			this.currdrawobj.setAttribute("fill-opacity",ffillopacity);
			var svgcontentobj = document.getElementById("svgcontent");
			svgcontentobj.appendChild(this.currdrawobj);	
			drawAssist.createFocusPoint("",this.lsptx,this.lspty);
		}
		else
		{
		    var lstpoints = this.currdrawobj.getAttribute("points");
		    lstpoints += ",";
		    lstpoints += points;
		    this.currdrawobj.setAttribute("points",lstpoints);
			drawAssist.createFocusPoint("",this.lsptx,this.lspty);
		    if(event.detail >= 2)
		    {
			   this.OnEndDraw();
			   return true;
		    }
		}
		return false;
	}
};

DrawPolygonTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	if(event.button == 2)
	{
		var svgnode = document.getElementById("svgnode");
		var clientrc = svgnode.getBoundingClientRect();
		var gcanvas = document.getElementById("svgcanvas");
		var matstr  = gcanvas.getAttribute("transform");
		var mat = new Matrix;
		var rmat = mat.Inverse(matstr);
		var xpos = event.clientX - clientrc.left;
		var ypos = event.clientY - clientrc.top;
		var ptArr = [];
		ptArr.push(xpos);
		ptArr.push(ypos);
		ptArr = mat.caclPoint(rmat,ptArr);
		this.lsptx = ptArr[0];
		this.lspty = ptArr[1];
		
		if(this.currdrawobj)
			bret = false;
		else 
			bret = true;
		this.OnEndDraw();
	}
	return bret;
};

DrawPolygonTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj)
	{
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		var points = this.currdrawobj.getAttribute("points");
		var subpoints = clsglobal.subLstPoint(points);
		subpoints += ","+ptArr[0]+","+ptArr[1];

		this.currdrawobj.setAttribute("points",subpoints);
	}
	drawAssist.ShowCorsorPoint(event,this.cursortext,"提示:左键双击或按ESC结束绘制",true);
};

DrawPolygonTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawPolygonTool.prototype.MoveTo = function(event,polylineobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(polylineobj!= undefined)
	{		
		var strmat = polylineobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
		
		var pointsArr = clsglobal.GetPolylinePoints(polylineobj);
		var curpt = parseInt(dragname);
		if(pointsArr.length/2 > curpt)
		{
			pointsArr[curpt*2] = ptArr[0];
			pointsArr[curpt*2+1] = ptArr[1];
		}
		var newpoints = "";
		for(var i = 0; i < pointsArr.length; ++i)
		{
			if(i != 0)
				newpoints += ",";
			newpoints += pointsArr[i];
		}
		polylineobj.setAttribute("points",newpoints);
		drawAssist.clearPointFocus();
		drawAssist.createPolylineFocus(polylineobj);		
	}
};

DrawPolygonTool.prototype.OnEndDraw = function()
{
	if(this.currdrawobj)
	{
	  var points = this.currdrawobj.getAttribute("points");
	  var ptArr = clsglobal.getLstPoint(points);
	  drawAssist.createFocusPoint("",ptArr[0],ptArr[1]);
	  drawAssist.clearPointFocus();	
	  if(!drawAssist.IsValidPolyLine(this.currdrawobj))
	  {
		  removeChild(this.currdrawobj);
	  }
	  else
	  {
		  gselectNode = this.currdrawobj;
		  drawAssist.createPolylineFocus(this.currdrawobj);
		  	var actadd = new ActionAdd(this.currdrawobj);
			gActionHistory.Add(actadd);
	  }
	  this.currdrawobj = undefined;
	}
	 return true;
};

/*DrawCircleTool*/
function DrawCircleTool()
{
	this.tooltype        = "circle";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx = 0;
	this.lspty = 0;
};

DrawCircleTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
		drawAssist.ShowCorsorPoint(event,this.cursortext,"",false);
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		var points = ptArr[0]+","+ptArr[1];
		if(this.currdrawobj == undefined)
		{
			drawAssist.clearPointFocus();
		    this.lsptx = ptArr[0];
		    this.lspty = ptArr[1];
		   
		    this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "circle");
			this.currdrawobj.setAttribute("cx",ptArr[0]);
			this.currdrawobj.setAttribute("cy",ptArr[1]);
			this.currdrawobj.setAttribute("r",0);
			this.currdrawobj.setAttribute("stroke",strokeclr);
			this.currdrawobj.setAttribute("stroke-opacity",fstrokepacity);
			this.currdrawobj.setAttribute("fill",fillclr);
			this.currdrawobj.setAttribute("fill-opacity",ffillopacity);
			this.currdrawobj.setAttribute("stroke-width",gstrokewidth);
		    this.currdrawobj.setAttribute("stroke-dasharray",gstroketype);
						
			var svgcontentobj = document.getElementById("svgcontent");
			svgcontentobj.appendChild(this.currdrawobj);		
			
			drawAssist.createFocusPoint("",ptArr[0],ptArr[1]);
		}
		else
		{		  
		   this.OnEndDraw();
		   return true;
		}
	}
	return false;
};

DrawCircleTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	if(event.button == 2)
	{
		if(this.currdrawobj)
			bret = false;
		else 
			bret = true;
		this.OnEndDraw();
	}
	return bret;
};

DrawCircleTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj)
	{
		 var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	    var cx = this.currdrawobj.getAttribute("cx");
	    var cy = this.currdrawobj.getAttribute("cy");
	    var x1 = parseFloat(ptArr[0]);
	    var y1 = parseFloat(ptArr[1]);
		
		
		this.currdrawobj.setAttribute("drawparam",x1+","+y1);
		
	    var distance=Math.sqrt((cx-x1)*(cx-x1)+(cy-y1)*(cy-y1));
	 
		this.currdrawobj.setAttribute("r",distance);
		
		drawAssist.clearPointFocus();
		drawAssist.createEightFocus(this.currdrawobj);
	}
	drawAssist.ShowCorsorPoint(event,this.cursortext,"",true);
};
DrawCircleTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawCircleTool.prototype.MoveTo = function(event,svgobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(svgobj != undefined)
	{
		var strmat = svgobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
		
		if(dragname == "1" || dragname == "2" || dragname == "3"|| dragname == "4"|| dragname == "5"|| dragname == "6"|| dragname == "7"|| dragname == "8")
		{
			  var cx = svgobj.getAttribute("cx");
			  var cy = svgobj.getAttribute("cy");
			  var newr1 = Math.abs(ptArr[0] - cx);
			  var newr2 = Math.abs(ptArr[1] - cy);
			  if(newr1 < newr2)
			  {
				   newr1 = newr2;
			  }
			svgobj.setAttribute("r",newr1);			
			drawAssist.clearPointFocus();
			drawAssist.createEightFocus(svgobj);
		}
	}
};

DrawCircleTool.prototype.OnEndDraw = function()
{
	var bret = true;
	if(this.currdrawobj)
	{
		var r = this.currdrawobj.getAttribute("r");
		drawAssist.clearPointFocus();
		if(parseFloat(r) <= 0.001)
		{
			drawAssist.removeChild(this.currdrawobj);
		}
		else
		{
			drawAssist.createEightFocus(this.currdrawobj);
			var actadd = new ActionAdd(this.currdrawobj);
			gActionHistory.Add(actadd);
		}
		bret = false;
		this.currdrawobj   = undefined;
	}
	 return bret;
};

/*DrawEllipseTool*/
function DrawEllipseTool()
{
	this.tooltype        = "ellipse";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx = 0;
	this.lspty = 0;
};

DrawEllipseTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
		drawAssist.ShowCorsorPoint(event,this.cursortext,"",false);
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		var points = ptArr[0]+","+ptArr[1];
		if(this.currdrawobj == undefined)
		{
			drawAssist.clearPointFocus();
		    this.lsptx = ptArr[0];
		    this.lspty = ptArr[1];
		   
		    this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
			this.currdrawobj.setAttribute("cx",ptArr[0]);
			this.currdrawobj.setAttribute("cy",ptArr[1]);
			this.currdrawobj.setAttribute("rx",0);
			this.currdrawobj.setAttribute("ry",0);
			this.currdrawobj.setAttribute("stroke",strokeclr);
			this.currdrawobj.setAttribute("stroke-opacity",fstrokepacity);
			this.currdrawobj.setAttribute("fill",fillclr);
			this.currdrawobj.setAttribute("fill-opacity",ffillopacity);
			this.currdrawobj.setAttribute("stroke-width",gstrokewidth);
		    this.currdrawobj.setAttribute("stroke-dasharray",gstroketype);
			
			var svgcontentobj = document.getElementById("svgcontent");
			svgcontentobj.appendChild(this.currdrawobj);		
			
			drawAssist.createFocusPoint("",ptArr[0],ptArr[1]);
		}
		else
		{		  
		   this.OnEndDraw();
		   return true;
		}
	}
	return false;
};

DrawEllipseTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	if(event.button == 2)
	{
		if(this.currdrawobj)
			bret = false;
		else 
			bret = true;
		this.OnEndDraw();
	}
	return bret;
};

DrawEllipseTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj)
	{
		 var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	    var cx = this.currdrawobj.getAttribute("cx");
	    var cy = this.currdrawobj.getAttribute("cy");
	    var x1 = parseFloat(ptArr[0]);
	    var y1 = parseFloat(ptArr[1]);
		
		var rxvalue = Math.abs(x1 - cx);
		var ryvalue = Math.abs(y1 - cy);
	  	 
		this.currdrawobj.setAttribute("rx",rxvalue); 
		this.currdrawobj.setAttribute("ry",ryvalue);
		
		drawAssist.clearPointFocus();
		drawAssist.createEightFocus(this.currdrawobj);

	}
	drawAssist.ShowCorsorPoint(event,this.cursortext,"",true);
};
DrawEllipseTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawEllipseTool.prototype.MoveTo = function(event,svgobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(svgobj != undefined)
	{
		var strmat = svgobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
		
		 var newrx = svgobj.getAttribute("rx");
		 var newry = svgobj.getAttribute("ry");
		if(dragname == "1" || dragname == "3" || dragname == "5" || dragname == "7")
		{
			var cx = svgobj.getAttribute("cx");
			var cy = svgobj.getAttribute("cy");
			newrx = Math.abs(ptArr[0] - cx);
			newry = Math.abs(ptArr[1] - cy);
		}
		else if(dragname == "2" || dragname == "6")
		{
			var cy = svgobj.getAttribute("cy");
			newry = Math.abs(ptArr[1] - cy);
		}
		else if(dragname == "4" || dragname == "8")
		{
			var cx = svgobj.getAttribute("cx");
			newrx = Math.abs(ptArr[0] - cx);
		}
		svgobj.setAttribute("rx",newrx);
		svgobj.setAttribute("ry",newry);			
		drawAssist.clearPointFocus();
		drawAssist.createEightFocus(svgobj);
	}
};
DrawEllipseTool.prototype.OnEndDraw = function()
{
	var bret = true;
	if(this.currdrawobj)
	{
		var r = this.currdrawobj.getAttribute("r");
		drawAssist.clearPointFocus();
		if(parseFloat(r) <= 0.001)
		{
			drawAssist.removeChild(this.currdrawobj);
		}
		else
		{
			drawAssist.createEightFocus(this.currdrawobj);
			var actadd = new ActionAdd(this.currdrawobj);
			gActionHistory.Add(actadd);
		}
		bret = false;
		this.currdrawobj   = undefined;
	}
    return bret;
};

/*drawrect*/
function DrawRectTool()
{
	this.tooltype        = "rect";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx = 0;
	this.lspty = 0;
};

DrawRectTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
		drawAssist.ShowCorsorPoint(event,this.cursortext,"",false);
		var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
		var points = ptArr[0]+","+ptArr[1];
		if(this.currdrawobj == undefined)
		{
			drawAssist.clearPointFocus();
		    this.lsptx = ptArr[0];
		    this.lspty = ptArr[1];
		   
		    this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
			this.currdrawobj.setAttribute("x",ptArr[0]);
			this.currdrawobj.setAttribute("y",ptArr[1]);
			this.currdrawobj.setAttribute("width","0");
			this.currdrawobj.setAttribute("height","0");
		    this.currdrawobj.setAttribute("stroke",strokeclr);
			this.currdrawobj.setAttribute("stroke-opacity",fstrokepacity);
			this.currdrawobj.setAttribute("fill",fillclr);
			this.currdrawobj.setAttribute("fill-opacity",ffillopacity);
			this.currdrawobj.setAttribute("stroke-width",gstrokewidth);
		    this.currdrawobj.setAttribute("stroke-dasharray",gstroketype);
			var svgcontentobj = document.getElementById("svgcontent");
			svgcontentobj.appendChild(this.currdrawobj);		
			
			drawAssist.createFocusPoint("",ptArr[0],ptArr[1]);
		}
		else
		{		  
		   this.OnEndDraw();
		   return true;
		}
	}
	return false;
};

DrawRectTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	if(event.button == 2)
	{
		if(this.currdrawobj)
			bret = false;
		else 
			bret = true;
		this.OnEndDraw();
	}
	return bret;
};

DrawRectTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj)
	{
		 var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	    var fx = this.currdrawobj.getAttribute("x");
	    var fy = this.currdrawobj.getAttribute("y");
	    var px = parseFloat(ptArr[0]);
	    var py = parseFloat(ptArr[1]);
		
		var fwidth = Math.abs(fx - px);
		var fheight = Math.abs(fy-py);
	 
		this.currdrawobj.setAttribute("width",fwidth);
		this.currdrawobj.setAttribute("height",fheight);
		
		drawAssist.clearPointFocus();
		drawAssist.createEightFocus(this.currdrawobj);

	}
	drawAssist.ShowCorsorPoint(event,this.cursortext,"",true);
};
DrawRectTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawRectTool.prototype.MoveTo = function(event,svgobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(svgobj != undefined)
	{
		var strmat = svgobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
		
		 var ptx = parseFloat(ptArr[0]);
		 var pty = parseFloat(ptArr[1]);
		 var fx = parseFloat(svgobj.getAttribute("x"));
		 var fy = parseFloat(svgobj.getAttribute("y"));
		 var fwidth = parseFloat(svgobj.getAttribute("width"));
		 var fheight = parseFloat(svgobj.getAttribute("height"));
		 var fnewx = fx;
		 var fnewy = fy;
		 var fnewwidth = fwidth;
		 var fnewheight = fheight;
		if(dragname == "1")
		{
			fnewx = ptx;
			fnewy = pty;
			fnewwidth = fx+fwidth - fnewx;
			fnewheight = fy + fheight - fnewy;
			if(fnewheight < 1)
			{
				fnewheight = 1;
				fnewy = fy;
			}
			if(fnewwidth < 1)
			{
				fnewwidth = 1;
				fnewx = fx;
			}
		}
		else if(dragname == "2")
		{
			fnewy = pty;
			fnewheight = fy + fheight - fnewy;
			if(fnewheight < 1)
			{
				fnewheight = 1;
				fnewy = fy;
			}			
		}
		else if(dragname == "3")
		{
			fnewy = pty;
			fnewwidth = ptx - fx;
			fnewheight = fy + fheight - fnewy;
			if(fnewheight < 1)
			{
				fnewheight = 1;
				fnewy = fy;
			}
			if(fnewwidth < 1)
			{
				fnewwidth = 1;
			}
		}
		else if(dragname == "4")
		{
			fnewwidth = ptx - fx;
			if(fnewwidth < 1)
			{
				fnewwidth = 1;
			}			
		}
		else if(dragname == "5")
		{
			fnewwidth = ptx - fx;
			fnewheight = pty - fy;
			if(fnewwidth < 1)
			{
				fnewwidth = 1;
			}
			if(fnewheight < 1)
			{
				fnewheight = 1;
			}	
		}
		else if(dragname == "6")
		{
			fnewheight = pty - fy;
			if(fnewheight < 1)
			{
				fnewheight = 1;
			}			
		}
		else if(dragname == "7")
		{
			fnewx = ptx;
			fnewheight = pty - fy;
			if(fnewheight < 1)
			{
				fnewheight = 1;
			}
			fnewwidth = fx+fwidth-ptx;
			if(fnewwidth < 1)
			{
				fnewwidth = 1;
				fnewx = fx;
			}
		}
		else if(dragname == "8")
		{
			fnewx = ptx;
			fnewwidth = fx+fwidth-ptx;
			if(fnewwidth < 1)
			{
				fnewwidth = 1;
				fnewx = fx;
			}		
		}
		svgobj.setAttribute("x",fnewx);
		svgobj.setAttribute("y",fnewy);			
		svgobj.setAttribute("width",fnewwidth);		
		svgobj.setAttribute("height",fnewheight);		
		drawAssist.clearPointFocus();
		drawAssist.createEightFocus(svgobj);
	}
};

DrawRectTool.prototype.OnEndDraw = function()
{
	var bret = true;
	if(this.currdrawobj)
	{
		var fwidth = this.currdrawobj.getAttribute("width");
		drawAssist.clearPointFocus();
		if(parseFloat(fwidth) <= 0.001)
		{
			drawAssist.removeChild(this.currdrawobj);
		}
		else
		{
			drawAssist.createEightFocus(this.currdrawobj);
			var actadd = new ActionAdd(this.currdrawobj);
			gActionHistory.Add(actadd);
		}
		bret = false;
		this.currdrawobj   = undefined;
	}
	 return bret;
};

/*drawimage*/
function DrawImageTool()
{
	this.tooltype        = "image";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx = 0;
	this.lspty = 0;
};

DrawImageTool.prototype.OnMouseDown = function(event)
{
	return false;
};

DrawImageTool.prototype.OnMouseUp = function(event)
{
	return false;
};

DrawImageTool.prototype.OnMouseMove = function(event)
{
	return false;
};
DrawImageTool.prototype.OnMouseWheel = function(event)
{
	return false;
};

DrawImageTool.prototype.MoveTo = function(event,svgobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(svgobj != undefined)
	{
		var strmat = svgobj.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptArr = mat.caclPoint(strmat,ptArr);
		}
		
		 var ptx = parseFloat(ptArr[0]);
		 var pty = parseFloat(ptArr[1]);
		 var fx = parseFloat(svgobj.getAttribute("x"));
		 var fy = parseFloat(svgobj.getAttribute("y"));
		 var fwidth = parseFloat(svgobj.getAttribute("width"));
		 var fheight = parseFloat(svgobj.getAttribute("height"));
		 var fnewx = fx;
		 var fnewy = fy;
		 var fnewwidth = fwidth;
		 var fnewheight = fheight;
		 var fcenterx = fx + fwidth/2;
		 var fcentery = fy + fheight/2;
		 
		 var fhalfwidth = Math.abs(parseFloat(ptx - fcenterx));
		 var fhalfheight = Math.abs(parseFloat(pty - fcentery));
		 var frate = (fhalfwidth*2) / fwidth;
		 var fratey = (fhalfheight*2)/ fheight;
		 if(frate < fratey)
		 {
			 frate = fratey;
		 }
		 fnewwidth = frate * fwidth;
		 fnewheight = frate * fheight;
		 fnewx = fcenterx - fnewwidth/2;
		 fnewy = fcentery - fnewheight/2;
		
		 svgobj.setAttribute("x",fnewx);
		 svgobj.setAttribute("y",fnewy);			
		 svgobj.setAttribute("width",fnewwidth);		
		 svgobj.setAttribute("height",fnewheight);		
		 drawAssist.clearPointFocus();
		 drawAssist.createEightFocus(svgobj);
	}
};

DrawImageTool.prototype.OnEndDraw = function()
{
	if(this.currdrawobj != undefined)
	{
		var actadd = new ActionAdd(this.currdrawobj);
		gActionHistory.Add(actadd);
	}
	return true;
};

/*drawG*/
function DrawGTool()
{
	this.tooltype        = "g";
    this.currdrawobj     = undefined;
	this.cursortext      = drawAssist.createHintText(0,0);
	this.lsptx = 0;
	this.lspty = 0;
};

DrawGTool.prototype.OnMouseDown = function(event)
{
	return false;
};

DrawGTool.prototype.OnMouseUp = function(event)
{
	return false;
};

DrawGTool.prototype.OnMouseMove = function(event)
{
	return false;
};
DrawGTool.prototype.OnMouseWheel = function(event)
{
	return false;
};

DrawGTool.prototype.MoveTo = function(event,svgobj,focusshape)
{
	var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	var dragname = focusshape.getAttribute("dragname");
	if(svgobj != undefined)
	{
		var strmatold = svgobj.getAttribute("transform");
		var mat = new Matrix();
		var strmatr = strmatold;
		if(strmatold != undefined)
		{
			strmatr = mat.Inverse(strmatold);
			ptArr = mat.caclPoint(strmatr,ptArr);
		}
		if(strmatold == undefined)
		{
			strmatold = "";
			strmatr = "";
		}		
		var ptx = parseFloat(ptArr[0]);
		var pty = parseFloat(ptArr[1]);
		var bbox = svgobj.getBBox();
			 
		var fx = parseFloat(bbox.x);
		var fy = parseFloat(bbox.y);
		var fwidth = parseFloat(bbox.width);
		var fheight = parseFloat(bbox.height);
		 
		var widgettype = svgobj.getAttribute("tywidgettype");
		if(widgettype != undefined && widgettype.length > 0)
		{
			var ftyx1 = fx;
			var ftyy1 = fy;
			var ftyx2 = fx + fwidth;
			var ftyy2 = fy + fheight;
			if(dragname == "1")
			{
				ftyx1 = ptx;
				ftyy1 = pty;
			}
			else if(dragname == "2")
			{
				ftyy1 = pty;
			}
			else if(dragname == "3")
			{
				ftyy1 = pty;
				ftyx2 = ptx;
			}
			else if(dragname == "4")
			{
				ftyx2 = ptx;
			}
			else if(dragname == "5")
			{
				ftyx2 = ptx;
				ftyy2 = pty;
			}
			else if(dragname == "6")
			{
				ftyy2 = pty;
			}
			else if(dragname == "7")
			{
				ftyx1 = ptx;
				ftyy2 = pty;
			}
			else if(dragname == "8")
			{
				ftyx1 = ptx;
			}
			svgobj.setAttribute("tyx",0);
			svgobj.setAttribute("tyy",0);
			svgobj.setAttribute("tywidth",ftyx2-ftyx1);
			svgobj.setAttribute("tyheight",ftyy2-ftyy1);
			mat.Translate(svgobj,ftyx1,ftyy1);
			ResetAnimateG(svgobj);
		}
		else
		{
			 var fnewx = fx;
			 var fnewy = fy;
			 var fnewwidth = fwidth;
			 var fnewheight = fheight;
			 var fcenterx = fx + fwidth/2;
			 var fcentery = fy + fheight/2;
			 
			 var fhalfwidth = Math.abs(parseFloat(ptx - fcenterx));
			 var fhalfheight = Math.abs(parseFloat(pty - fcentery));
			 var frate = (fhalfwidth*2) / fwidth;
			 var fratey = (fhalfheight*2)/ fheight;
			 if(frate < fratey)
			 {
				 frate = fratey;
			 }
			 frate = frate.toFixed(2);
			 var strmat = strmatold+"translate("+fcenterx + ","+fcentery+")scale("+frate+")translate(-"+fcenterx+",-"+fcentery+")";
			 var mat = new Matrix();
			 strmat = mat.getTransform(strmat);
			 strmat = mat.getAsString(strmat);
			 svgobj.setAttribute("transform",strmat);
		}		 
		 drawAssist.clearPointFocus();
		 drawAssist.createEightFocus(svgobj);
	}
};

DrawGTool.prototype.OnEndDraw = function()
{
	return true;
};

/*drawtextool*/
function DrawTextTool()
{
    this.currdrawobj   = undefined;
	this.inputline     = undefined;
	this.focusrect     = undefined;
	this.selectfocus   = undefined;
	this.selecttext    = undefined;
	this.cursortext    = drawAssist.createHintText(0,0);
	this.lsptx = 0;
	this.lspty = 0;
	this.bmousedown    = false;
	this.lstcurpos     = -1;
	this.isnewtext     = true;
	this.bindpt        = undefined;
};

DrawTextTool.prototype.OnMouseDown = function(event)
{
	if(event.button == 0)
	{
	  this.bmousedown = true;
	  drawAssist.ShowCorsorPoint(event,this.cursortext,"",false);
      var svgnode = document.getElementById("svgnode");
	  var clientrc = svgnode.getBoundingClientRect();	
	  var matstr  = "";
	  if(this.currdrawobj != undefined)
	  {
		  matstr  = clsglobal.getNodeAllMatrix(this.currdrawobj);
	  }
	  var mat  = new Matrix;
	  var rmat = mat.Inverse(matstr);
	  var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
	   ptArr = mat.caclPoint(rmat,ptArr);
			
	  this.lsptx = ptArr[0];
	  this.lspty = ptArr[1];
	  
	  var inputobj = document.getElementById("inputobject");
	  inputobj.setAttribute("x",this.lsptx);
	  inputobj.setAttribute("y",this.lspty);
	  
	  if(this.currdrawobj)
	  {
		 var  px = ptArr[0];
		 var  py = ptArr[1];
		 var  bbox = clsglobal.GetTextBoundBox(this.currdrawobj);
		 if(px >= bbox.x && px <= (bbox.x+bbox.width) && py >= bbox.y && py <= (bbox.y+bbox.height))
		 {
			this.lstcurpos = drawAssist.PointGetTextPos(this.currdrawobj,px,py);
			var txtinput = document.getElementById("textinput");
			txtinput.value = this.currdrawobj.textContent;
			if(event.detail >= 2)
			{
			   if(txtinput.value != undefined)
			   {
				 txtinput.setSelectionRange(0,txtinput.value.length);
			   }
			}
			else
			{
			  txtinput.setSelectionRange(this.lstcurpos, this.lstcurpos);
			}
			txtinput.focus();	
			this.SetContent();
		 }
		 else
		 {
			this.OnEndDraw();
			return true;
		 }		
	  }
	   
	  if(this.currdrawobj == undefined)
	  {		  
		this.createDrawText(ptArr[0],ptArr[1]);
		this.createEditFocus();
	  } 
	}
	return false;
};

DrawTextTool.prototype.OnMouseUp = function(event)
{
	var bret = true;
	this.bmousedown = false;
	if(event.button == 2)
	{
		bret = true;
		this.OnEndDraw();
	}
	else if(event.button == 0)
	{
		
	}
	return bret;
};

DrawTextTool.prototype.OnMouseMove = function(event)
{
	if(this.currdrawobj == undefined)
	{
	   
	}
	else
	{
		if(this.bmousedown)
		{
		    var svgnode = document.getElementById("svgnode");
		    var clientrc = svgnode.getBoundingClientRect();
		    var gcanvas = document.getElementById("svgcanvas");
		    var matstr  = clsglobal.getNodeAllMatrix(this.currdrawobj);
		    var mat  = new Matrix;
		    var rmat = mat.Inverse(matstr);
			var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
			ptArr = mat.caclPoint(rmat,ptArr);
	  
		    var nowpos = drawAssist.PointGetTextPos(this.currdrawobj,ptArr[0],ptArr[1]);
			var txtinput = document.getElementById("textinput");
			txtinput.value = this.currdrawobj.textContent;
			var nbegin = Math.min(this.lstcurpos,nowpos);
			var nend = Math.max(this.lstcurpos,nowpos);
			txtinput.setSelectionRange(nbegin, nend);
			txtinput.focus();	
			this.SetContent();
		}		
	}
};

DrawTextTool.prototype.OnMouseWheel = function(event)
{
	
};

DrawTextTool.prototype.OnEndDraw = function()
{
	var bret = true;
	this.bmousedown = false;
	drawAssist.clearPointFocus();
	this.cursortext  = drawAssist.createHintText(0,0);
	if(this.currdrawobj)
	{
		var txtcnt = this.currdrawobj.textContent;
		if(txtcnt == undefined || txtcnt.length == 0)
		{
			removeChild(this.currdrawobj);
		}
		else
		{
			drawAssist.createTextFocus(this.currdrawobj,"#0000FF");
			var actadd = new ActionAdd(this.currdrawobj);
			gActionHistory.Add(actadd);
		}
	}	
	this.currdrawobj = undefined;
	var txtinput = document.getElementById("textinput");
	txtinput.value = "";
	return bret;
};

DrawTextTool.prototype.SetContent = function()
{
	if(this.currdrawobj)
	{
		var txtinput = document.getElementById("textinput");
		this.currdrawobj.textContent = txtinput.value;
		
		if(this.bindpt != undefined)
		{
			var bNullTxt = false;
			if(this.currdrawobj.textContent == undefined || this.currdrawobj.textContent.length == 0)
			{
				bNullTxt = true;
				this.currdrawobj.textContent = "A";
			}
			var txtbox = this.currdrawobj.getBBox();
			var x = this.currdrawobj.getAttribute("x");
			var y = this.currdrawobj.getAttribute("y");
			var newx = this.bindpt[0]-(txtbox.x-parseFloat(x))-txtbox.width*1.0/2;
			var newy = this.bindpt[1]-(txtbox.y-parseFloat(y))-txtbox.height*1.0/2;	
			this.currdrawobj.setAttribute("x",newx);
			this.currdrawobj.setAttribute("y",newy);
			if(bNullTxt)
			{
				this.currdrawobj.textContent = "";
			}
		}
		var  box = clsglobal.GetTextBoundBox(this.currdrawobj);
		this.focusrect.setAttribute("x",box.x-2);
		this.focusrect.setAttribute("y",box.y-2);
		this.focusrect.setAttribute("width",box.width+4);
		this.focusrect.setAttribute("height",box.height+4);
		
		var nstart = txtinput.selectionStart;
		var nend = txtinput.selectionEnd;
		
		this.selectfocus.setAttribute("width",0);
		this.selecttext.textContent = "";
		if(nend > 0 && nend != nstart)
		{
			this.inputline.setAttribute("x1",0);
			this.inputline.setAttribute("y1",0);
			this.inputline.setAttribute("x2",0);
			this.inputline.setAttribute("y2",0);			
			
			var strtxt = txtinput.value;
			var str1 = strtxt.substring(0,nstart);
			var str2 = strtxt.substring(0,nend);
		    var selstr = strtxt.substring(nstart,nend);
			var bbox1 = drawAssist.getTextBox(this.currdrawobj,str1);
			var bbox2 = drawAssist.getTextBox(this.currdrawobj,str2);
			
			var xpos = bbox2.x - bbox1.x;
			var widthpos = bbox2.width - bbox1.width;
			this.selectfocus.setAttribute("x",box.x+bbox1.width);
			this.selectfocus.setAttribute("y",box.y);
			this.selectfocus.setAttribute("height",bbox2.height);			
			this.selectfocus.setAttribute("width",widthpos);
			
			var x = this.currdrawobj.getAttribute("x");
			var y = this.currdrawobj.getAttribute("y");
			
			this.selecttext.textContent = selstr;
			this.selecttext.setAttribute("x",parseFloat(x)+bbox1.width);
			this.selecttext.setAttribute("y",parseFloat(y));
		}
		else
		{
			var strtxt = txtinput.value;
			var str2 = strtxt.substring(0,nend);
			var bbox2 = drawAssist.getTextBox(this.currdrawobj,str2);
			this.inputline.setAttribute("x1",box.x+bbox2.width);
			this.inputline.setAttribute("y1",box.y);
			this.inputline.setAttribute("x2",box.x+bbox2.width);
			this.inputline.setAttribute("y2",box.y+box.height);
		}
	}
};

DrawTextTool.prototype.FlashInputLine = function()
{
	if(this.inputline != undefined)
	{
		var propval = this.inputline.getAttribute("visibility");
		if(propval == undefined || propval == "hidden")
		{
			this.inputline.setAttribute("visibility","visible");
		}
		else
		{
			this.inputline.setAttribute("visibility","hidden");
		}
		this.SetContent();
	}
};

DrawTextTool.prototype.createDrawText = function(ptx,pty)
{
	this.currdrawobj =  document.createElementNS("http://www.w3.org/2000/svg", "text");
	
	this.currdrawobj.setAttribute("stroke-opacity","0");
	this.currdrawobj.setAttribute("fill",strokeclr);
	this.currdrawobj.setAttribute("fill-opacity",fstrokepacity);
			
	this.currdrawobj.setAttribute("stroke-opacity","0");
	this.currdrawobj.setAttribute("xml:space","preserve");
	this.currdrawobj.setAttribute("font-size",gfontsize);
	this.currdrawobj.setAttribute("font-family",gfontname);
	this.currdrawobj.textContent = "";
	this.currdrawobj.setAttribute("x",ptx);
	this.currdrawobj.setAttribute("y",pty);
	this.currdrawobj.setAttribute("id",clsglobal.MakeIdString());
	var svgcontentobj = document.getElementById("svgcontent");
	svgcontentobj.appendChild(this.currdrawobj);
};

DrawTextTool.prototype.createEditFocus = function()
{
	var fontsz = "16";
	var strmat = "";
	if(this.currdrawobj != undefined)
	{
		fontsz = this.currdrawobj.getAttribute("font-size");
		strmat = clsglobal.getNodeAllMatrix(this.currdrawobj);
	}	

	this.focusrect = drawAssist.createFocusInputRect(0,0,0,0);
	this.focusrect.setAttribute("transform",strmat);
	
	this.selectfocus = drawAssist.createFocusInputRect(0,0,0,0);
	this.selectfocus.setAttribute("transform",strmat);
	this.selectfocus.setAttribute("fill","#338FFF");
	this.selectfocus.setAttribute("stroke-opacity","0");
	this.selectfocus.setAttribute("fill-opacity","1");
	
	
	this.selecttext = drawAssist.createFocusText(0,0);
	this.selecttext.setAttribute("transform",strmat);
	this.selecttext.setAttribute("fill","#FFFFFF");
	this.selecttext.setAttribute("fill-opacity","1");	
	this.selecttext.setAttribute("stroke","#000000");
	this.selecttext.setAttribute("stroke-opacity","0");
	this.selecttext.setAttribute("xml:space","preserve");
	this.selecttext.setAttribute("font-size",fontsz);

	this.inputline = drawAssist.createFocusInputLine(0,0,0,0);
	this.inputline.setAttribute("transform",strmat);
	
	var txtinput = document.getElementById("textinput");
	txtinput.value = "";
	if(this.currdrawobj != undefined && this.currdrawobj.textContent != undefined)
	{
		txtinput.value = this.currdrawobj.textContent;
	}	
	txtinput.focus();		
	this.SetContent();
};

DrawTextTool.prototype.EditText = function(event)
{
	var node = gselectNodeInner;
	if(node == undefined)
	{
		node = gselectNode;
	}
	if(node != undefined && node.tagName == "text")
	{
		this.isnewtext = false;
		this.currdrawobj = node;
		
		var bindpoint = this.currdrawobj.getAttribute("bindpoint");
		if(bindpoint != undefined)
		{
			 var strs= new Array();
			 strs = bindpoint.split(",");
			 if(strs.length == 2)
			 {
				 this.bindpt = new Array();
				 this.bindpt.push(parseFloat(strs[0]));
				 this.bindpt.push(parseFloat(strs[1]));
			 }
		}
		this.createEditFocus();
	}
};




