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

function MoveTool()
{
    this.bcanmove     = false;
	this.ptmousedownX = 0;
	this.ptmousedownY = 0;
	this.bmousedown   = false;
};

MoveTool.prototype.OnMouseDown = function(event)
{
	this.bcanmove = false;
	this.ptmousedownX = event.clientX;
	this.ptmousedownY = event.clientY;
	this.bmousedown = true;

};

MoveTool.prototype.OnMouseUp = function(event)
{
	this.bcanmove = false;
	this.bmousedown = false;	
};

MoveTool.prototype.OnMouseMove = function(event)
{
	var xdis = event.clientX - this.ptmousedownX;
	var ydis = event.clientY - this.ptmousedownY;
	if (this.bmousedown)
	{
		if (xdis > 5 || xdis < -5 || ydis > 5 || ydis < -5)
		{
			this.bcanmove = true;
		}
		if (this.bcanmove)
		{
			var xpos = event.clientX - this.ptmousedownX;
			var ypos = event.clientY - this.ptmousedownY;
			var gcanvas = document.getElementById("svgcanvas");
			var matstr = gcanvas.getAttribute("transform");

			var newmatstr = "translate("+xpos+","+ypos+")"+matstr;
			gcanvas.setAttribute("transform",newmatstr);
			clscanvas.resetClip();
			clscanvas.resetRule();
			clscanvas.resetGrid();
			this.ptmousedownX = event.clientX;
			this.ptmousedownY = event.clientY;
		}
	}	
};

MoveTool.prototype.OnMouseWheel = function(event)
{

};

MoveTool.prototype.OnEndDraw = function()
{
	return true;
};

/*zoom tool*/
function ZoomTool()
{
    
};

ZoomTool.prototype.OnMouseDown = function(event)
{
	
};

ZoomTool.prototype.OnMouseUp = function(event)
{
	
};

ZoomTool.prototype.OnMouseMove = function(event)
{
	
};

ZoomTool.prototype.OnMouseWheel = function(event)
{
	var svgnode = document.getElementById("svgnode");
	var clientrc = svgnode.getBoundingClientRect();

	var svgLeftx = clientrc.left;
	var svgTopy = clientrc.top;

	
	var gcanvas = document.getElementById("svgcanvas");
				
	var lstmatstr = gcanvas.getAttribute("transform");
					
	var Delta = -1 * event.wheelDelta / 120;
	
	var rate = 1 - 0.2 * Delta;

	var xpos = event.clientX;
	var ypos = event.clientY-svgTopy;
	var matnewstr = "";
	matnewstr += "translate("+xpos+","+ypos+")";
	matnewstr += "scale("+rate+")";
	matnewstr += "translate(-"+xpos+",-"+ypos+")";

	matnewstr += lstmatstr;
	
	var  mat = new Matrix;
	var matval = mat.getTransform(matnewstr);
	matnewstr = mat.getAsString(matval);
	
   var ptArr = [];
   ptArr.push(0);
   ptArr.push(0);
   ptArr = mat.caclPoint(matnewstr,ptArr);

   var ptArr100 = [];
   ptArr100.push(100);
   ptArr100.push(100);
   ptArr100 = mat.caclPoint(matnewstr,ptArr100);
   var fscale = (ptArr100[0]-ptArr[0])*1.0/100;
   if(fscale <= 0.01 || fscale >= 100)
   {
	   return;
   }
	
	gcanvas.setAttribute("transform", matnewstr);
	
	clscanvas.resetClip();
	clscanvas.resetRule();
	clscanvas.resetGrid();
};
ZoomTool.prototype.OnEndDraw = function()
{
	return true;
};

/*select tool*/
function SelectTool()
{
    this.bcanmove     = false;
	this.ptmousedownX = 0;
	this.ptmousedownY = 0;
	this.bmousedown   = false;
	this.drawtool     = undefined;
	this.actattrs     = [];
	this.rangeFocusRect = undefined;
};

SelectTool.prototype.OnMouseDown = function(event)
{
	this.bmousedown   = true;
	this.bcanmove     = false;
	this.ptmousedownX = event.clientX;
	this.ptmousedownY = event.clientY;
	
	drawAssist.clearHintFocus();
	gselectNodeInner = undefined;
	gselectOneNode = undefined;
	var selNode = clsglobal.IsPointInShape(event);
	gselectFocusHintShape = clsglobal.IsPointInFoucsHintShape(event);
	if(selNode == undefined && gselectFocusHintShape == undefined)
	{
		gselectNode = undefined;
		gselectNodes = [];
		drawAssist.clearPointFocus();
	}
	else if(selNode == undefined && gselectFocusHintShape != undefined)
	{
		var objid = gselectFocusHintShape.getAttribute("belongid");
		if(objid != undefined)
		{
		   for(var i = 0; i < gselectNodes.length; ++i)
		   {
			   if(gselectNodes[i].getAttribute("id") == objid)
			   {
				    gselectNode = gselectNodes[i];
					gselectOneNode = gselectNode;
					break;
			   }
		   }
		   gselectNodes = [];
		   gselectNodes.push(gselectNode);
		}
	}
	else if(selNode != undefined && gselectFocusHintShape == undefined)
	{
		gselectNode = selNode;		
		gselectOneNode = gselectNode;
		drawAssist.clearPointFocus();
		var pNode = gselectNode;
		while(pNode && pNode.tagName != "svg")
		{
			if(pNode.getAttribute("id") == "svgcontent")
				break;
			gselectNode = pNode;
			gselectOneNode = gselectNode;
			pNode = pNode.parentNode;
		}
		
	    var bExist = false;
		for(var k = 0; k < gselectNodes.length;++k)
		{
			if(gselectNodes[k] == selNode)
			{
				bExist = true;
				break;
			}
		}
	
		if(!bExist)
		{
			if (event.ctrlKey != 1)
			{
				gselectNodes = [];
			}
		    gselectNodes.push(selNode);
		}
		else
		{
			if (event.ctrlKey == 1)
			{
				var newNodeList = [];
				for(var k = 0; k < gselectNodes.length;++k)
				{
					if(gselectNodes[k] != selNode)
					{
						newNodeList.push(gselectNodes[k]);
					}
				}
				gselectNodes = newNodeList;
				gselectOneNode = gselectNode;
				gselectNode = undefined;
			}			
		}
		for(var i = 0; i < gselectNodes.length;++i)
		{
		    var objNode = gselectNodes[i];
			if(objNode.tagName == "polyline" || objNode.tagName == "polygon")
			{
				drawAssist.createPolylineFocus(objNode);
			}
			else if(objNode.tagName == "line")
			{
				drawAssist.createLineFocus(objNode);
			}
			else if(objNode.tagName == "rect" || objNode.tagName == "image" || objNode.tagName == "circle" || objNode.tagName == "ellipse" )
			{
				drawAssist.createEightFocus(objNode);
			}
			else if(objNode.tagName == "text")
			{
				drawAssist.createTextFocus(objNode);
			}
			else if(objNode.tagName == "g")
			{
				drawAssist.createEightFocus(selNode);
			}
		}
	}
	if(event.detail >= 2)
	{
		if(gselectNodeInner && gselectNodeInner.tagName == "text")
		{
			EditToolObj = new DrawTextTool();
			clsglobal.createTextCursor();
			EditToolObj.EditText(event);
			nowcommand = "text";
		}
		else if(gselectNode && gselectNode.tagName == "text")
		{
			EditToolObj = new DrawTextTool();
			clsglobal.createTextCursor();
			EditToolObj.EditText(event);
			nowcommand = "text";
		}
		else if(gselectNode && gselectNode.tagName == "g")
		{
			gselectNodeInner = clsglobal.IsPointInInnerShape(event,gselectNode);
			drawAssist.createSVGNodeFocus(gselectNodeInner,"#FF0000");
			if(gselectNodeInner != undefined && gselectNodeInner.tagName == "text")
			{
				EditToolObj = new DrawTextTool();
				clsglobal.createTextCursor();
				EditToolObj.EditText(event);
				nowcommand = "text";
			}
			if(gselectNodeInner != undefined)
			{
				gselectOneNode = gselectNodeInner;
			}
		}		
	}
	else if(selNode == undefined && gselectFocusHintShape == undefined)
	{
		var svgObj =  document.createElementNS("http://www.w3.org/2000/svg", "rect");
		svgObj.setAttribute("x",this.ptmousedownX);
		svgObj.setAttribute("y",this.ptmousedownY);
		svgObj.setAttribute("width","0");
		svgObj.setAttribute("height","0");
		svgObj.setAttribute("stroke","#0000FF");
		svgObj.setAttribute("stroke-opacity","1");
		svgObj.setAttribute("fill","#0000FF");
		svgObj.setAttribute("fill-opacity","0.3");
		svgObj.setAttribute("stroke-width","1");
		svgObj.setAttribute("stroke-dasharray","4 4");
		var gHittext = document.getElementById("hinttext");
		if(gHittext)
		{
			gHittext.appendChild(svgObj);
			this.rangeFocusRect = svgObj;				
		}
	}
	drawAssist.createAnimatePopMenu(gselectNode);
};

SelectTool.prototype.selectRange = function()
{
	if(this.rangeFocusRect != undefined)
	{
		gselectNode = undefined;
		gselectNodes = [];
		var bbox = this.rangeFocusRect.getBBox();
		var svgContent = document.getElementById("svgcontent");
		if(svgContent != undefined)
		{
			for(var i = 0; i < svgContent.childNodes.length;++i)
			{
                var childNode = svgContent.childNodes[i];
				if(childNode.nodeType == 1 && (
				childNode.tagName == "line"
				||childNode.tagName == "rect"
				||childNode.tagName == "circle"
				||childNode.tagName == "ellipse"
				||childNode.tagName == "image"
				||childNode.tagName == "polygon"
				||childNode.tagName == "polyline"
				||childNode.tagName == "rect"
				||childNode.tagName == "path"
				||childNode.tagName == "text"
				||childNode.tagName == "g"
				)
				)
				{

					var childbbox = svgContent.childNodes[i].getBBox();
					var pt1x = childbbox.x;
					var pt1y = childbbox.y;
					var pt2x = childbbox.x+childbbox.width;
					var pt2y = childbbox.y+childbbox.height;
					
					var strmat = svgContent.childNodes[i].getAttribute("transform");
					if(strmat != undefined)
					{
						var mat = new Matrix();
						var ptArr1 = [];
						ptArr1.push(pt1x);
						ptArr1.push(pt1y);
						ptArr1 = mat.caclPoint(strmat,ptArr1);
						pt1x = ptArr1[0];
						pt1y = ptArr1[1];
						var ptArr2 = [];
						ptArr2.push(pt2x);
						ptArr2.push(pt2y);
						ptArr2 = mat.caclPoint(strmat,ptArr2);
						pt2x = ptArr2[0];
						pt2y = ptArr2[1];			
					}					
					if(clsglobal.IsPointInBBox(this.rangeFocusRect,pt1x,pt1y)
						|| clsglobal.IsPointInBBox(this.rangeFocusRect,pt2x,pt1y)
						|| clsglobal.IsPointInBBox(this.rangeFocusRect,pt2x,pt2y)
						|| clsglobal.IsPointInBBox(this.rangeFocusRect,pt1x,pt2y))
					{
						gselectNodes.push(svgContent.childNodes[i]);
					}
				}				
			}	
		}
		clsmainframe.ResetAllFocus();
	}
};

SelectTool.prototype.OnMouseUp = function(event)
{
	this.bcanmove = false;
	this.bmousedown = false;
	this.drawtool = undefined;
	for(var i = 0; i < this.actattrs.length;++i)
	{
	    this.actattrs[i].EndValue();
	}			
	this.actattrs = [];
	gselectFocusHintShape = undefined;
	if(this.rangeFocusRect != undefined)
	{
		this.selectRange();
		this.rangeFocusRect.parentNode.removeChild(this.rangeFocusRect);
		this.rangeFocusRect = undefined;	
	}	
	return true;
};

SelectTool.prototype.CreateActionAttr = function(svgObj)
{
	if(svgObj == undefined)
		return;
	var svgTagName = svgObj.tagName;
	if(svgTagName == "line")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("x1");
		 actattr.AddAttr("x2");
		 actattr.AddAttr("y1");
		 actattr.AddAttr("y2");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "polyline")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("points");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "polygon")
	{
		var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("points");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "circle")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("r");
		 actattr.AddAttr("cx");
		 actattr.AddAttr("cy");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "ellipse")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("rx");
		 actattr.AddAttr("ry");
		 actattr.AddAttr("cx");
		 actattr.AddAttr("cy");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "rect")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("x");
		 actattr.AddAttr("y");
		 actattr.AddAttr("width");
		 actattr.AddAttr("height");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "image")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("x");
		 actattr.AddAttr("y");
		 actattr.AddAttr("width");
		 actattr.AddAttr("height");
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
	else if(svgTagName == "g")
	{
		 var actattr  = new ActionAttr(svgObj);
		 actattr.AddAttr("transform");
		 this.actattrs.push(actattr);
		 gActionHistory.Add(actattr);
	}
};

SelectTool.prototype.OnMouseMove = function(event)
{
	if(this.rangeFocusRect != undefined && this.bmousedown)
	{
		var ptArrlst = drawAssist.getEventPoint(this.ptmousedownX,this.ptmousedownY);
		var ptArrnow = drawAssist.getEventPoint(event.clientX,event.clientY);
		var xpos = Math.min(ptArrnow[0],ptArrlst[0])
		var ypos = Math.min(ptArrnow[1],ptArrlst[1])
		var width = Math.abs(ptArrnow[0] - ptArrlst[0]);
		var height = Math.abs(ptArrnow[1] - ptArrlst[1]);
		this.rangeFocusRect.setAttribute("x",xpos);
		this.rangeFocusRect.setAttribute("y",ypos);
		this.rangeFocusRect.setAttribute("width",width);
		this.rangeFocusRect.setAttribute("height",height);
		this.selectRange();
		return;
	}
	drawAssist.clearHintFocus();
	if(gselectFocusHintShape != undefined && this.bmousedown)
	{
		var ptArrlst = drawAssist.getEventPoint(this.ptmousedownX,this.ptmousedownY);
		var ptArrnow = drawAssist.getEventPoint(event.clientX,event.clientY);
			
		var xpos = ptArrnow[0] - ptArrlst[0];
		var ypos = ptArrnow[1] - ptArrlst[1];
		var bCanUndo = false;
		if (xpos > 1 || xpos < -1 || ypos > 1 || ypos < -1)
		{
			bCanUndo = true;			
		}			
		var svgTagName = gselectFocusHintShape.getAttribute("belong");
		if(bCanUndo && this.actattrs.length == 0)
		{
			this.CreateActionAttr(gselectNode);
		}		
		if(svgTagName == "line")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawLineTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "polyline")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawPolylineTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "polygon")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawPolygonTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "circle")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawCircleTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "ellipse")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawEllipseTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "rect")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawRectTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "image")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawImageTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		else if(svgTagName == "g")
		{
			if(this.drawtool == undefined)
			{
				this.drawtool = new DrawGTool();
			}
			this.drawtool.MoveTo(event,gselectNode,gselectFocusHintShape);
		}
		this.ptmousedownX = event.clientX;
        this.ptmousedownY = event.clientY;
	}
	else if(gselectNode != undefined)
	{
		if (this.bmousedown)
		{
			var ptArrlst = drawAssist.getEventPoint(this.ptmousedownX,this.ptmousedownY);
			var ptArrnow = drawAssist.getEventPoint(event.clientX,event.clientY);
				
			var xpos = ptArrnow[0] - ptArrlst[0];
			var ypos = ptArrnow[1] - ptArrlst[1];
			if (xpos > 5 || xpos < -5 || ypos > 5 || ypos < -5)
			{
				this.bcanmove = true;
			}
			if (this.bcanmove)
			{
				if(this.actattrs.length == 0)
				{
					for(var k = 0; k < gselectNodes.length; ++k)
					{
						this.CreateActionAttr(gselectNodes[k]);
					}
				}		
				for(var k = 0; k < gselectNodes.length; ++k)
				{
					var objNode = gselectNodes[k];
					if(objNode.tagName=="circle" || objNode.tagName== "ellipse" || objNode.tagName=="image" ||objNode.tagName=="rect")
					{
						clsglobal.MoveShape(objNode,xpos,ypos);
						
					}
					else if(objNode.tagName == "polyline" || objNode.tagName == "polygon")
					{
						clsglobal.MoveShape(objNode,xpos,ypos);
					}
					else if(objNode.tagName == "line")
					{
						clsglobal.MoveShape(objNode,xpos,ypos);
					}
					else if(objNode.tagName == "text")
					{
						var bindpoints = objNode.getAttribute("bindpoint");
						if(bindpoints == undefined)
						{						
							clsglobal.MoveShape(objNode,xpos,ypos);
						}
					}
					else if(objNode.tagName == "g")
					{
						clsglobal.MoveShape(objNode,xpos,ypos);
					}	
				}	
				clsmainframe.ResetAllFocus();
				this.ptmousedownX = event.clientX;
				this.ptmousedownY = event.clientY;
			}
		}
	}

	var focuscircle = clsglobal.IsPointInFoucsHintShape(event);
	if(gselectFocusHintShape != undefined || focuscircle != undefined)
	{
		drawAssist.ClearTempFocus();
		var currobj = focuscircle;
		if(currobj == undefined)
			currobj = gselectFocusHintShape;
		if(currobj != undefined)
		{
			var type = currobj.getAttribute("cursortype");
			if(type != undefined)
			{
				clsglobal.createCursor(type);
				var ptArr = drawAssist.getEventPoint(event.clientX,event.clientY);
				var txt = drawAssist.createHintText(ptArr[0],ptArr[1]-5);
				txt.setAttribute("stroke","#0000FF");
				txt.textContent = currobj.getAttribute("hinttext");
			}
		}
	}
	else
	{
		drawAssist.ClearTempFocus();
		clsglobal.createArrowCursor();
	}
};

SelectTool.prototype.OnMouseWheel = function(event)
{
	
};

SelectTool.prototype.OnEndDraw = function()
{
	return true;
};


