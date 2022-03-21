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
 
function TMessageListener()
{
	this.bmousedown     =  false;
	this.bcanmove       =  false;
	this.ptmousedownX   =  0;
	this.ptmousedownY   =  0;
	this.ptmousemove    =  0;
	this.lstcommand     =  "";
	this.bmidbuttondown =  false;
	this.currdrawobj    =  undefined;
	this.focuspolyline  =  undefined;
	this.circlecount    =  0;
	this.buttontype     =  0;/*0:left,1:middle,2:right*/
	this.lstcursor      =  lstcurtype;
	this.areatype       =  "";
};
	
TMessageListener.prototype.Init = function()
{
	document.onmousedown  = TMessageListener.OnMouseDown;
	document.onmouseup    = TMessageListener.OnMouseUp;
	document.onmousemove  = TMessageListener.OnMouseMove;
	document.onmousewheel = TMessageListener.OnMouseWheel;
	document.onkeydown    = TMessageListener.OnKeyDown;
	document.onkeyup     = TMessageListener.OnKeyUp;
	
	EditToolObj = new SelectTool();
	nowcommand = "select";
	clsglobal.createArrowCursor();		
};

TMessageListener.OnMouseDown  = function(event)
{
	this.bmousedown = true;
	this.ptmousedownX   =  event.clientX;
	this.ptmousedownY   =  event.clientY;
	this.areatype = "";

	if(!clsmainframe.IsInSVGArea(event,"svgnode"))
		return;
	event.preventDefault && event.preventDefault();
	event.returnValue = false;
	event.stopPropagation && event.stopPropagation();
		
	this.buttontype = event.button;
	if(this.buttontype==1 || nowcommand=="move")
	{
		clsglobal.createCloseHandCursor();
		movetool.OnMouseDown(event);
	}
	if(EditToolObj)
	{
		var ret = EditToolObj.OnMouseDown(event);
		if(ret == true)
		{
			EditToolObj = new SelectTool();
			nowcommand = "select";
			clsglobal.createArrowCursor();
		}
	}
};

TMessageListener.OnMouseUp    = function(event)
{
	this.bmousedown = false;
	this.areatype = "";
	if(!clsmainframe.IsInSVGArea(event,"svgnode"))
		return;
	if(clsmainframe.IsInSVGArea(event,"normalInputobj"))
	{
		return;
	}
	event.preventDefault && event.preventDefault();
	event.returnValue = false;
	event.stopPropagation && event.stopPropagation();
	if(this.buttontype==1 || nowcommand=="move")
	{			
		var svgnode = document.getElementById("svgnode");
		if(nowcommand == "move")
		{
			clsglobal.createOpenHandCursor();
		}
		else
		{
			clsglobal.createCursor(this.lstcursor);
		}
		movetool.OnMouseUp(event);
	}
	if(EditToolObj)
	{
		var bret = EditToolObj.OnMouseUp(event);
		if(event.button == 2 && bret)
		{
			EditToolObj = undefined;
		}
	}
	if(EditToolObj == undefined)
	{
		EditToolObj = new SelectTool();
		nowcommand = "select";
		clsglobal.createArrowCursor();
		drawAssist.clearHintFocus();
	}
	this.buttontype = -1;
};

TMessageListener.OnMouseMove  = function(event)
{
	if(!clsmainframe.IsInSVGArea(event,"svgnode"))
		return;
		
	event.preventDefault && event.preventDefault();
	event.returnValue = false;
	event.stopPropagation && event.stopPropagation();
	if(this.buttontype==1 || nowcommand=="move")
	{
		movetool.OnMouseMove(event);
	}
	if(EditToolObj)
	{
		EditToolObj.OnMouseMove(event);
	}
	clsglobal.setCursorPos(event);
};

TMessageListener.OnMouseWheel = function(event)
{
	if(!clsmainframe.IsInSVGArea(event,"svgnode"))
		return;

	if(this.buttontype != 1)
	{
		zoomtool.OnMouseWheel(event);
	}	
		
};
TMessageListener.OnKeyDown = function(event)
{
	var backcoverobj = document.getElementById("idbackcover");
	if(backcoverobj.style.display == "block")
		return;
	var backcoverobj2 = document.getElementById("idbackcover2");
	if(backcoverobj2.style.display == "block")
		return;


	var keyVal = "";
	var keyNum = window.event ? event.keyCode :event.which;
	
	if(nowcommand == "text")
	{
		event.returnValue = true;
		if(keyNum == 27)
	   {/*ESC*/
		 event.returnValue = false;
		 if(EditToolObj != undefined)
		 {
			var bret = EditToolObj.OnEndDraw();
			if(bret)
			{
				EditToolObj = new SelectTool();
				nowcommand = "select";
				clsglobal.createArrowCursor();
			}
		 }			 
	   }
		return ;
	}
	
	   var oEvent = window.event;
	   if(oEvent == undefined)
	   {
			oEvent = event;
	   }	   
	   if (oEvent.keyCode == 65 && oEvent.ctrlKey)
	   {/*Ctrl+A*/
		   oEvent.returnValue=false;  
		   SelectAll();			   
		   return;
	   }
	   if (oEvent.keyCode == 67 && oEvent.ctrlKey)
	   {/*Ctrl+C*/
		   oEvent.returnValue=false;
		   var xml = "";
		   for(var i = 0; i < gselectNodes.length;++i)
		   {
			  xml += gselectNodes[i].outerHTML;
		   }
		   clsglobal.copyText(xml);
		   return;
	   }
	   if (oEvent.keyCode == 86 && oEvent.ctrlKey)
	   {/*Ctrl+V*/
		   oEvent.returnValue=true;   
		   return;
	   }
	   if (oEvent.keyCode == 89 && oEvent.ctrlKey)
	   {/*Ctrl+Y*/
		   gActionHistory.Redo();
		   oEvent.returnValue=false;   
		   return;
	   }
	   if (oEvent.keyCode == 90 && oEvent.ctrlKey)
	   {/*Ctrl+Z*/
		   gActionHistory.Undo();
		   oEvent.returnValue=false;   
		   return;
	   }
	   
	   if(keyNum >= 65 && keyNum <= 90)
	   {/*A to Z*/
		   keyVal = String.fromCharCode(keyNum);
	   }
	   else if(keyNum >= 48 && keyNum <= 57)
	   {/*0-9*/
		  keyVal = parseInt(keyNum-48);
	   }
	   else if(keyNum >= 96 && keyNum <= 105)
	   {/*0-9*/
		  keyVal = parseInt(keyNum-96);
	   }
	   else if(keyNum == 110)
	   {
		  keyVal = '.';
	   }
	   else if(keyNum == 32)
	   {/*space*/
		   keyVal = " ";
	   }
	   else if(keyNum == 46)
	   {
		   clsmainframe.docommand('delete',true,true,true);
	   }
	   else if(keyNum == 188)
	   {
		   keyVal = ",";
	   }
	   else if(keyNum == 37)
	   {/*left arrow*/
		   for(var i = 0; i <gselectNodes.length;++i)
		   {
			   clsglobal.MoveShape(gselectNodes[i],-1,0);
		   }
		   clsmainframe.ResetAllFocus();
	   }
		else if(keyNum == 38)
	   {/*up arrow*/
			for(var i = 0; i <gselectNodes.length;++i)
		   {
			   clsglobal.MoveShape(gselectNodes[i],0,-1);
		   }
		   clsmainframe.ResetAllFocus();
	   }
		else if(keyNum == 39)
	   {/*right arrow*/
		   for(var i = 0; i <gselectNodes.length;++i)
		   {
			   clsglobal.MoveShape(gselectNodes[i],1,0);
		   }
		   clsmainframe.ResetAllFocus();
	   }
		else if(keyNum == 40)
	   {/*down arrow*/
			for(var i = 0; i <gselectNodes.length;++i)
		   {
			   clsglobal.MoveShape(gselectNodes[i],0,1);
		   }
		  clsmainframe.ResetAllFocus();
	   }
	   else if(keyNum == 27)
	   {/*ESC*/
		 if(EditToolObj != undefined)
		 {
			var bret = EditToolObj.OnEndDraw();
			if(bret)
			{
				EditToolObj = new SelectTool();
				clsglobal.createArrowCursor();
				drawAssist.clearHintFocus();
			}
		 }			 
	   }
	   else if(keyNum == 13)
	   {/*Enter*/
	   }
};
TMessageListener.OnKeyUp= function(event)
{
};
