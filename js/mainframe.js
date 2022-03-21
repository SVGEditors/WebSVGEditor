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
 
function TMainframe()
{
};

TMainframe.prototype.OnTimer = function()
{
  if(nowcommand == "text" && EditToolObj!=undefined)
  {
	  EditToolObj.FlashInputLine();
  }
};

TMainframe.prototype.allowDrop = function(evt) 
{ 
	evt.preventDefault(); 
};
  
TMainframe.prototype.drag = function(evt) 
{ 
	var strtext = evt.target.getAttribute("svgurl");
    evt.dataTransfer.setData("Text",strtext); 
};
  
TMainframe.prototype.drop = function(evt) 
{ 
	evt.preventDefault(); 
	var data=evt.dataTransfer.getData("Text"); 
	alert(data);
};

TMainframe.prototype.InitLeftTable = function()
{
	var divLeftObj = document.getElementById("divLeft");
	if(divLeftObj)
	{
		var bounddiv = document.createElement('div');
		bounddiv.setAttribute("style","margin-left:10px;overflow-x: auto; overflow-y: auto; height:100%; width:190px;");
		divLeftObj.appendChild(bounddiv);
		var newtable = document.createElement('table');
		newtable.setAttribute("id","filelisttable");
		bounddiv.appendChild(newtable);
		newtable.cellspacing = "1";
		newtable.cellpadding = "0";
		newtable.setAttribute("style","font-size:15px; font-weight:bold;margin:5px;border-collapse:collapse;border:0px solid #D3D3D3");
		newtable.width = "170px";
	}
};

TMainframe.prototype.OnResetFileTitle = function()
{
   for(var i = 0; i < svgFileArr.length; ++i)
   {
	   var strtextid = "idsvgtext"+i;
	   var textObj = document.getElementById(strtextid);
	   if(textObj != undefined)
	   {
	       if(i == currentFileIndex)
		   {
			   textObj.setAttribute("style","color:#FFFFFF;font-size:20px;text-decoration:none");
		   }
		   else
		   {
			   textObj.setAttribute("style","color:#0000FF;font-size:18px;text-decoration:none");
		   }		 
		   textObj.innerHTML = svgFileArr[i];
	   }
   }
};

TMainframe.prototype.OnLoadFile = function(fileIndex)
{
	currentFileIndex = fileIndex;
	
	clsmainframe.OnResetFileTitle();
};

TMainframe.prototype.OnModifyFile = function()
{
   clsneworcopy.InitDlg();
};

TMainframe.prototype.filechange = function(obj)
{
	var file = obj.files[0];
    var reader = new FileReader();
	var image = new Image();
    reader.onload = function (e)
	{
		var data = e.target.result;
        var image = new Image();
          image.onload=function()
		  {
			 var width = image.width;
             var height = image.height;
            
			var contentObj = document.getElementById("svgcontent");
			var imageobj =  document.createElementNS("http://www.w3.org/2000/svg", "image");
			imageobj.setAttribute("x",0);
			imageobj.setAttribute("y",0);
			imageobj.setAttribute("width",width);
			imageobj.setAttribute("height",height);
			imageobj.href.baseVal  = data;
			contentObj.appendChild(imageobj)
		  };
		 image.src= data;
	};
	reader.readAsDataURL(file);
	obj.value = "";
};

TMainframe.prototype.PasteText = function(strsvgdata)
{
	var contentObj = document.getElementById("svgcontent");
	var parser = new DOMParser(); 
	var xmlDoc = parser.parseFromString(strsvgdata,"text/xml");
	if(xmlDoc != undefined && xmlDoc.documentElement)
	  {
		  if(xmlDoc.documentElement.tagName != "svg")
		  {
			 var svghead = "<svg width=\"640\" height=\"480\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";
			  strsvgdata = svghead + strsvgdata + "</svg>";
			  xmlDoc = parser.parseFromString(strsvgdata,"text/xml");
		  }		  
		  var svgChildNodes = [];
		  for(var k = 0; k < xmlDoc.documentElement.childNodes.length;++k)
		  {
			 svgChildNodes.push(xmlDoc.documentElement.childNodes[k]);
		  }
		  gselectNodes = [];
		  for(var k = 0; k < svgChildNodes.length;++k)
		  {
			  var childNode = svgChildNodes[k];
			  if(childNode.tagName == "script" && childNode.getAttribute("tyname") == "tuyescript")
			  {
				 continue;
			  }
			  contentObj.appendChild(svgChildNodes[k]);
			  if(svgChildNodes[k].tagName == "g"
			  || svgChildNodes[k].tagName == "rect"
			  || svgChildNodes[k].tagName == "image"
			  ||svgChildNodes[k].tagName == "text"
			  ||svgChildNodes[k].tagName == "line"
			  ||svgChildNodes[k].tagName == "circle"
			  ||svgChildNodes[k].tagName == "ellipse"
			  ||svgChildNodes[k].tagName == "polyline"
			  ||svgChildNodes[k].tagName == "polygon"
			  ||svgChildNodes[k].tagName == "path")
			{
			  gselectNodes.push(svgChildNodes[k]);
			}
		  }
		  if(gselectNodes.length == 1 && gselectNodes[0].tagName == "g")
		  {
			  gselectNode = gselectNodes[0];
			  ResetAnimateG(gselectNodes[0]);			  
		  }
		  this.ResetAllFocus();
	  }
	  else
	  {
		  return;
	  }
};

TMainframe.prototype.inputsvgfile = function(obj)
{
	var file = obj.files[0];
    var reader=new FileReader();
    reader.onload = function (e)
	{
		var data = e.target.result;
		clsmainframe.PasteText(data);
	};
	reader.readAsText(file);
	obj.value = "";
};

TMainframe.prototype.docommand = function(cmdtype,bclear,bneedundo,bshowhint)
{
  nowcommand = "";
  EditToolObj = undefined;
  clsglobal.createArrowCursor();

 if(cmdtype == undefined)
     cmdtype = "select";

  if(bneedundo == true)
  {
	
  }
  if(bclear == true)
  {
	
  }
  var hintstr = "";

  if(cmdtype == "select")
  {
	 EditToolObj = new SelectTool();
	 clsglobal.createArrowCursor();
  }
  else if(cmdtype == "line")
  {
	 nowcommand = "line";
	 EditToolObj = new DrawLineTool();
	 clsglobal.createCrossCursor();
  }
  else if(cmdtype == "rect")
  {
	 nowcommand = "rect";
	 EditToolObj = new DrawRectTool();
	 clsglobal.createCrossCursor();
  }
  else if(cmdtype == "polyline")
  {
     nowcommand = "polyline";
	 EditToolObj = new DrawPolylineTool();
	 clsglobal.createCrossCursor();
   }
   else if(cmdtype == "polygon")
  {
     nowcommand = "polyline";
	 EditToolObj = new DrawPolygonTool();
	 clsglobal.createCrossCursor();
   }
  else if(cmdtype == "circle")
  {
     nowcommand = "circle";
	 EditToolObj = new DrawCircleTool();
	 clsglobal.createCrossCursor();    
  }
   else if(cmdtype == "ellipse")
  {
     nowcommand = "ellipse";
	 EditToolObj = new DrawEllipseTool();
	 clsglobal.createCrossCursor();    
  }
  else if(cmdtype == "text")
  {
	  nowcommand = "text";
	  EditToolObj = new DrawTextTool();
	  clsglobal.createTextCursor();
  }
  else if(cmdtype == "image")
  {
	    document.getElementById('fileInput').click();

  }
  else if(cmdtype == "addsvg")
  {
	 document.getElementById('svgfileInput').click();
  }
  else if(cmdtype == "rule")
  {
     bshowrule = !bshowrule;
	 var objruleg = document.getElementById("svgrule");
	 if(bshowrule)
	 {	 
	    objruleg.setAttribute("visibility","visible");
	 }
	 else
	 {
	    objruleg.setAttribute("visibility","hidden");
	 }
	 clscanvas.resetClip();
	 clscanvas.resetRule();	
	 clscanvas.resetGrid();
  }
  else if(cmdtype == "grid")
  {
	 bshowgrid = !bshowgrid;
	 var objgridg = document.getElementById("svggrid");
	 if(bshowgrid)
	 {	 
	     objgridg.setAttribute("visibility","visible");
	 }
	 else
	 {
	     objgridg.setAttribute("visibility","hidden");
	 }
	 clscanvas.resetClip();
	 clscanvas.resetRule();
	 clscanvas.resetGrid();
  }
  else if(cmdtype == "zoomrestore")
  {
	var gcanvas = document.getElementById("svgcanvas");
	gcanvas.setAttribute("transform","matrix(1,0,0,1,50,50)");
	clscanvas.resetClip();
	clscanvas.resetRule();
	clscanvas.resetGrid();
  }
  else if(cmdtype == "move")
  {
	 nowcommand = "move";
     clsglobal.createOpenHandCursor();
  }
  else if(cmdtype == "block")
  {
     var backcoverobj = document.getElementById("idbackcover");
	 backcoverobj.style.display = "block";
	 var blocksettingobj = document.getElementById("idblocksetting");
	 blocksettingobj.style.display = "block";
  }
  else if(cmdtype == "closeblock")
  {
     var backcoverobj = document.getElementById("idbackcover");
	 backcoverobj.style.display = "none";
	 var blocksettingobj = document.getElementById("idblocksetting");
	 blocksettingobj.style.display = "none";
  }
  else if(cmdtype == "group")
  {
	 if(gselectNodes.length < 2)
	 {
		 return;
	 }
	var contentObj = document.getElementById("svgcontent");
	var svgnodelist = [];
	for(var i = 0; i < contentObj.childNodes.length; ++i)
	{
		if(contentObj.childNodes[i].nodeType == 1)
		{
			svgnodelist.push(contentObj.childNodes[i]);
		}
	}
	var sortSelectNodes = [];
	for(var i = 0; i < svgnodelist.length;++i)
		{
			for(var j = 0; j < gselectNodes.length;++j)
			{
				if(svgnodelist[i] == gselectNodes[j])
				{
					sortSelectNodes.push(gselectNodes[j]);
					break;
				}		   
			}
		}
		
		
	if(sortSelectNodes.length > 0)
	{
		var ActionG = new ActionGroup(contentObj);
		gActionHistory.Add(ActionG);
		for(var i = 0; i < sortSelectNodes.length;++i)
		{
			ActionG.AddChild(sortSelectNodes[i]);
		}		
		var gObj =  document.createElementNS("http://www.w3.org/2000/svg", "g");
		contentObj.appendChild(gObj);
		ActionG.AddG(gObj);
		for(var i = 0; i < sortSelectNodes.length;++i)
		{
			gObj.appendChild(sortSelectNodes[i]);
		}	
		gselectNodes = [];
		gselectNodes.push(gObj);
		gselectNode = gObj;
		this.ResetAllFocus();
	}
  }
  else if(cmdtype == "ungroup")
  {
	  if(gselectNode != undefined && gselectNode.tagName == "g")
	  {
		  var ActionUG = new ActionUnGroup(gselectNode);
		  gActionHistory.Add(ActionUG);
		  gselectNodes = [];
		  var gstrmat = gselectNode.getAttribute("transform");
		  if(gstrmat == undefined)
		  {
			  gstrmat = "";
		  }
		  var nodelist = [];
		  for(var i = 0; i < gselectNode.childNodes.length;++i)
		  {
			    if(gselectNode.childNodes[i].nodeType == 1)
				 {
					 var strnewmat = gstrmat;
					 var strchildmat = gselectNode.childNodes[i].getAttribute("transform");
					 if(strchildmat != undefined)
					 {
						 strnewmat += strchildmat;
					 }
					 gselectNode.childNodes[i].setAttribute("transform",strnewmat);
					 nodelist.push(gselectNode.childNodes[i]);
				 }
		  }
		  var contentObj = document.getElementById("svgcontent");
		  for(var i = 0; i < nodelist.length;++i)
		  {
			 contentObj.appendChild(nodelist[i]);
			 gselectNodes.push(nodelist[i]);
		  }
		  contentObj.removeChild(gselectNode);
		  gselectNode = undefined;
		  this.ResetAllFocus();
	  }
  }
  else if(cmdtype == "delete")
  {
	  var contentObj = document.getElementById("svgcontent");
	   var svgnodelist = [];
		for(var i = 0; i < contentObj.childNodes.length; ++i)
		{
			if(contentObj.childNodes[i].nodeType == 1)
			{
				svgnodelist.push(contentObj.childNodes[i]);
			}
		}
		if(svgnodelist.length > 0)
		{
			var actcompose = new ActionCompose();
			gActionHistory.Add(actcompose);
			for(var i = 0; i < svgnodelist.length;++i)
			{
				for(var j = 0; j < gselectNodes.length;++j)
				{
					if(svgnodelist[i] == gselectNodes[j])
					{
						var actdel = new ActionDel(gselectNodes[j]);
						actcompose.Add(actdel);
						contentObj.removeChild(gselectNodes[j])
						break;
					}
				}
			}
		}
	gselectNodes = [];
	gselectNode = gObj;
	drawAssist.clearPointFocus();
  }
  else if(cmdtype == "movetop")
  {
		var contentObj = document.getElementById("svgcontent");
		var svgnodelist = [];
		for(var i = 0; i < contentObj.childNodes.length; ++i)
		{
			if(contentObj.childNodes[i].nodeType == 1)
			{
				svgnodelist.push(contentObj.childNodes[i]);
			}
		}
		var sortSelectNodes = [];
		for(var i = 0; i < svgnodelist.length;++i)
		{
			for(var j = 0; j < gselectNodes.length;++j)
			{
				if(svgnodelist[i] == gselectNodes[j])
				{
					sortSelectNodes.push(gselectNodes[j]);
					break;
				}		   
			}
		}	
		if(sortSelectNodes.length > 0)
		{
			var actpose = new ActionCompose();
			gActionHistory.Add(actpose);
			for(var i = sortSelectNodes.length-1; i >= 0; --i)
			{
				var Acttop = new ActionLayTop(sortSelectNodes[i]);
				actpose.Add(Acttop);
				contentObj.appendChild(sortSelectNodes[i]);
			}
			this.ResetAllFocus();
		}
  }
  else if(cmdtype == "movebottom")
  {
	    var contentObj = document.getElementById("svgcontent");
		var svgnodelist = [];
		for(var i = 0; i < contentObj.childNodes.length; ++i)
		{
			if(contentObj.childNodes[i].nodeType == 1)
			{
				svgnodelist.push(contentObj.childNodes[i]);
			}
		}
		var sortSelectNodes = [];
		for(var i = 0; i < svgnodelist.length;++i)
		{
			for(var j = 0; j < gselectNodes.length;++j)
			{
				if(svgnodelist[i] == gselectNodes[j])
				{
					sortSelectNodes.push(gselectNodes[j]);
					break;
				}		   
			}
		}	
		if(sortSelectNodes.length > 0)
		{
			var actpose = new ActionCompose();
			gActionHistory.Add(actpose);
			for(var i = 0; i < sortSelectNodes.length; ++i)
			{
				var Actbottom = new ActionLayBottom(sortSelectNodes[i]);
				actpose.Add(Actbottom);
				contentObj.insertBefore(sortSelectNodes[i],contentObj.childNodes[0]);
			}
			this.ResetAllFocus();
		}
  }
  else if(cmdtype == "animate")
  {
	  this.doBlock(cmdtype,undefined);
  }
  else if(cmdtype == "clickopen")
  {
	  this.doBlock(cmdtype,undefined);
  }
  else if(cmdtype == "undo")
  {
	  gActionHistory.Undo();
  }
  else if(cmdtype == "redo")
  {
	  gActionHistory.Redo();
  }
};

TMainframe.prototype.GetStrokeColorTableStr = function()
{
	var str = "<table  cellpadding='0' cellspacing='0' class='Colortb' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
			<td bgcolor='#000000' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#A52A00' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#004040' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#005500' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#00005E' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#00008B' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#4B0082' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#282828' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#8B0000' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FF6820' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#8B8B00' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#009300' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#388E8E' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#0000FF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#7B7BC0' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#666666' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#FF0000' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FFAD5B' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#32CD32' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#3C8371' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#33CCCC' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#7D9EC0' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#800080' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#7F7F7F' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFC0CB' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FFD700' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FFFF00' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#00FF00' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#00FFFF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#00CCFF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#EA8066' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#C0C0C0' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
		</tr>	\
		<tr>\
			<td bgcolor='#FFE4E1' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FFFE99' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FFFFE0' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#99FF99' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#CCFFFF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#99CCFF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#CC99FF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
			<td bgcolor='#FFFFFF' bgopacity='1' onclick='clsmainframe.OnStrokeSelect(this)'></td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' bgopacity='0' align='center' onclick='clsmainframe.OnStrokeSelect(this)'>透明色</td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;	
};

TMainframe.prototype.GetFillColorTableStr = function()
{
	var str = "<table  cellpadding='0' cellspacing='0' class='Colortb' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
			<td bgcolor='#000000' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#A52A00' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#004040' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#005500' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#00005E' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#00008B' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#4B0082' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#282828' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#8B0000' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FF6820' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#8B8B00' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#009300' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#388E8E' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#0000FF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#7B7BC0' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#666666' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#FF0000' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FFAD5B' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#32CD32' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#3C8371' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#33CCCC' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#7D9EC0' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#800080' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#7F7F7F' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFC0CB' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FFD700' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FFFF00' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#00FF00' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#00FFFF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#00CCFF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#EA8066' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#C0C0C0' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
		</tr>	\
		<tr>\
			<td bgcolor='#FFE4E1' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FFFE99' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FFFFE0' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#99FF99' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#CCFFFF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#99CCFF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#CC99FF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
			<td bgcolor='#FFFFFF' bgopacity='1' onclick='clsmainframe.OnFillSelect(this)'></td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' bgopacity='0' align='center' onclick='clsmainframe.OnFillSelect(this)'>透明色</td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;	
};

TMainframe.prototype.GetStrokeWidthStr = function()
{
	var str = "<table class='Menutb' cellpadding='0' cellspacing='0' style='margin-left:8px;margin-top:5px;'>\
	     <tr>\
		<td bgcolor='#000000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(0)'><img src='image/linewidth0.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#000000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(1)'><img src='image/linewidth1.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(2)'><img src='image/linewidth2.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(3)'><img src='image/linewidth3.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(4)'><img src='image/linewidth4.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(5)'><img src='image/linewidth5.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(6)'><img src='image/linewidth6.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='Oclsmainframe.nStrokeWidthSelect(8)'><img src='image/linewidth8.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeWidthSelect(10)'><img src='image/linewidth10.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' width='60px' height='20px' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;	
	
};

TMainframe.prototype.GetStrokeTypeStr = function()
{
	var str = "<table class='Menutb' cellpadding='0' cellspacing='0' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
		<td bgcolor='#000000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(1)'><img src='image/linetype1.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(2)'><img src='image/linetype2.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(3)'><img src='image/linetype3.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(4)'><img src='image/linetype4.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(5)'><img src='image/linetype5.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(6)'><img src='image/linetype6.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(7)'><img src='image/linetype7.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(8)'><img src='image/linetype8.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(9)'><img src='image/linetype9.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
		<td bgcolor='#8B0000' width='60px' height='20px' bgopacity='1' onclick='clsmainframe.OnStrokeTypeSelect(10)'><img src='image/linetype10.png' width='100%' height='100%'/></td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' width='60px' height='20px' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;	
};

TMainframe.prototype.GetFontNameStr = function()
{
	var str = "<table class='Menutb' cellpadding='0' cellspacing='0' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
		<td bgcolor='#FFFFFF' width='120px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontNameSelect(\"宋体\")'>宋体</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='120px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontNameSelect(\"黑体\")'>黑体</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='120px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontNameSelect(\"楷体\")'>楷体</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='120px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontNameSelect(\"仿宋\")'>仿宋</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='120px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontNameSelect(\"Times New Roman\")'>Times New Roman</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='120px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontNameSelect(\"Arial\")'>Arial</td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' width='120px' height='20px' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;		
};

TMainframe.prototype.GetFontSizeStr = function()
{
	var str = "<table class='Menutb' cellpadding='0' cellspacing='0' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"8pt\")'>8pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"10pt\")'>10pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"12pt\")'>12pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"14pt\")'>14pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"16pt\")'>16pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"18pt\")'>18pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"20pt\")'>20pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"24pt\")'>24pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"28pt\")'>28pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"32pt\")'>32pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"40pt\")'>40pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"50pt\")'>50pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"60pt\")'>60pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"65pt\")'>65pt</td>\
		</tr>\
		<tr>\
		<td bgcolor='#FFFFFF' width='60px' height='20px' align='center' bgopacity='1' onclick='clsmainframe.OnFontSizeSelect(\"72pt\")'>72pt</td>\
		</tr>\
		<tr>\
			<td colspan='8' bgcolor='#C0C0C0' width='60px' height='20px' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;		
};

TMainframe.prototype.GetRotateStr = function()
{
	var str = "<table  cellpadding='0' cellspacing='0' class='Rotatetb' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>1</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>2</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>3</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>4</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>5</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>6</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>7</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>8</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>9</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>10</td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>15</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>20</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>25</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>30</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>35</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>40</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>45</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>50</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>55</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>60</td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>70</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>80</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>90</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>100</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>110</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>120</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>130</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>140</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>150</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>170</td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-1</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-2</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-3</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-4</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-5</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-6</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-7</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-8</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-9</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-10</td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-15</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-20</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-25</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-30</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-35</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-40</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-45</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-50</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-55</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-60</td>\
		</tr>	\
		<tr>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-70</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-80</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-90</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-100</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-110</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-120</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-130</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-140</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-150</td>\
			<td bgcolor='#FFFFFF' bgopacity='1' align='center' onclick='clsmainframe.OnRotateSelect(this)'>-170</td>\
		</tr>\
		<tr>\
			<td colspan='10' bgcolor='#C0C0C0' bgopacity='0' align='center' onclick='clsdlgglobal.OnFinishBlock()'>关闭</td>\
		</tr>\
		</table>";
	return str;	
};

TMainframe.prototype.GetPropertyStr = function()
{
	var str = "<table id='blocktable'  cellspacing='1' cellpadding='0' style='font-size:15px; font-weight:bold;margin:20px;border-collapse:collapse' width='200' border='1'>\
		  <tr>\
			<td width='80' align='center' colspan='2'>画布大小设置</td>\
		  </tr>\
		  <tr>\
			<td width='30'>宽</td>\
			<td width='60'><input id='canvaswidth' type='text' onchange='clsmainframe.OnCanvasSizeChange()' style='width:90%;height:100%;' value='0'/></td>\
		  </tr>\
		  <tr>\
			<td>高</td>\
			<td width='60'><input id='canvasheight'type='text' onchange='clsmainframe.OnCanvasSizeChange()' style='width:90%;height:100%' value='4'/></td>\
			</tr>\
		</table>\
		<button style='margin-left:130px;width:80px;height:30px' onclick='clsdlgglobal.OnFinishBlock()'>关闭</button>";
		return str;
	
};

TMainframe.prototype.doBlock = function(cmdtype,obj)
{
	var oRect = undefined;
	if(obj != undefined)
	{
		oRect = obj.getBoundingClientRect();
	}
	if(cmdtype == "stroke")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "140px";
		blocksettingobj.style.height = "140px";
		blocksettingobj.innerHTML = this.GetStrokeColorTableStr();
	} 
	else if(cmdtype == "fill")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "140px";
		blocksettingobj.style.height = "140px";
		blocksettingobj.innerHTML = this.GetFillColorTableStr();
	} 
	else if(cmdtype == "strokewidth")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "80px";
		blocksettingobj.style.height = "200px";
		blocksettingobj.innerHTML = this.GetStrokeWidthStr();
	}
	else if(cmdtype == "stroketype")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "80px";
		blocksettingobj.style.height = "240px";
		blocksettingobj.innerHTML = this.GetStrokeTypeStr();
	}
	else if(cmdtype == "fontname")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "120px";
		blocksettingobj.style.height = "160px";
		blocksettingobj.innerHTML = this.GetFontNameStr();
	}
	else if(cmdtype == "fontsize")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "80px";
		blocksettingobj.style.height = "340px";
		blocksettingobj.innerHTML = this.GetFontSizeStr();
	}
	else if(cmdtype == "rotate")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = oRect.left + "px";
		blocksettingobj.style.top = oRect.top +oRect.height + 5 + "px";
		blocksettingobj.style.width = "300px";
		blocksettingobj.style.height = "240px";
		blocksettingobj.innerHTML = this.GetRotateStr();
	}
	else if(cmdtype == "property")
	{
		var backcoverobj = document.getElementById("idbackcover");
	    backcoverobj.style.display = "block";
	    var blocksettingobj = document.getElementById("idblocksetting");
	    blocksettingobj.style.display = "block";
		blocksettingobj.style.left = "300px";
		blocksettingobj.style.top = "100px";
		blocksettingobj.style.width = "260px";
		blocksettingobj.style.height = "160px";
		blocksettingobj.innerHTML = this.GetPropertyStr();
		
		var blockobj = document.getElementById("svgblock1");
		var nwidth = blockobj.getAttribute("width");
	    var nheight = blockobj.getAttribute("height");
		var inputwidth = document.getElementById("canvaswidth");
		inputwidth.setAttribute("value",nwidth);
		var inputheight = document.getElementById("canvasheight");
		inputheight.setAttribute("value",nheight);
	}
	else if(cmdtype == "clickopen")
	{
		if(gselectOneNode != undefined)
		{
		   var popDlg = clsdlgclickopen.AnimateClickDlg();
		}
	}
};


TMainframe.prototype.OnStrokeSelect = function(tdobj)
{
   var tdclr = tdobj.getAttribute("bgcolor");
   fstrokepacity = tdobj.getAttribute("bgopacity");
   strokeclr = tdclr;
   var tdtool = document.getElementById("strokeclr");
   tdtool.setAttribute("bgcolor",tdclr);
   if(gselectNodes.length > 0)
   {
	   var actcom = new ActionCompose();
	   gActionHistory.Add(actcom);
	   for(var i = 0; i < gselectNodes.length; ++i)
	   {
		   if(gselectNodes[i].tagName == "text")
		   {
			   var actattr = new ActionAttr(gselectNodes[i]);
			   actattr.AddAttr("fill");
			   actcom.Add(actattr);
			   gselectNodes[i].setAttribute("fill",tdclr);
			   actattr.EndValue();
		   }
		   else if(gselectNodes[i].tagName == "g")
		   {
			   for(var j = 0; j < gselectNodes[i].childNodes.length;++j)
			   {
				   if(gselectNodes[i].childNodes[j].nodeType == 1)
				   {
					  var gChildNode = gselectNodes[i].childNodes[j];
					  var actattr = new ActionAttr(gChildNode);
					  actattr.AddAttr("stroke");
					  actattr.AddAttr("stroke-opacity");
					  actcom.Add(actattr);
					  gChildNode.setAttribute("stroke",tdclr);
					  gChildNode.setAttribute("stroke-opacity",fstrokepacity);
					  actattr.EndValue();
				   }
			   }
		   }
		   else
		   {
			 var actattr = new ActionAttr(gselectNodes[i]);
			 actattr.AddAttr("stroke");
			 actattr.AddAttr("stroke-opacity");
			 actcom.Add(actattr);
			 gselectNodes[i].setAttribute("stroke",tdclr);
			 gselectNodes[i].setAttribute("stroke-opacity",fstrokepacity);
			 actattr.EndValue();
		  }
	   }
   }
   clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.OnFillSelect = function(tdobj)
{
   var tdclr = tdobj.getAttribute("bgcolor");
   ffillopacity = tdobj.getAttribute("bgopacity");
   fillclr = tdclr;
   var tdtool = document.getElementById("fillclr");
   tdtool.setAttribute("bgcolor",tdclr);
   if(gselectNodes.length > 0)
   {
	   var actcom = new ActionCompose();
	   gActionHistory.Add(actcom);
	   for(var i = 0; i < gselectNodes.length; ++i)
	   {
		   if(gselectNodes[i].tagName == "text")
		   {
			   var actattr = new ActionAttr(gselectNodes[i]);
			   actattr.AddAttr("fill");
			   actcom.Add(actattr);
			   gselectNodes[i].setAttribute("fill",tdclr);
			   actattr.EndValue();
		   }
		   else if(gselectNodes[i].tagName == "g")
		   {
			   for(var j = 0; j < gselectNodes[i].childNodes.length;++j)
			   {
				   if(gselectNodes[i].childNodes[j].nodeType == 1)
				   {
					  var gChildNode = gselectNodes[i].childNodes[j];
					  var actattr = new ActionAttr(gChildNode);
					  actattr.AddAttr("fill");
					  actattr.AddAttr("fill-opacity");
					  actcom.Add(actattr);
					  gChildNode.setAttribute("fill",tdclr);
					  gChildNode.setAttribute("fill-opacity",ffillopacity);
					  actattr.EndValue();
				   }
			   }
		   }
		   else
		   {
			  var actattr = new ActionAttr(gselectNodes[i]);
			  actattr.AddAttr("fill");
			  actattr.AddAttr("fill-opacity");
			  actcom.Add(actattr);
			  gselectNodes[i].setAttribute("fill",tdclr);
			  gselectNodes[i].setAttribute("fill-opacity",ffillopacity);
			  actattr.EndValue();
		   }
	   }
   }
   clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.OnRotateSelect = function(tdobj)
{
	var nrotate = tdobj.firstChild.data;
	if(gselectNodes.length > 0)
	{
		var actcomp = new ActionCompose();
		gActionHistory.Add(actcomp);
		for(var i = 0; i < gselectNodes.length;++i)
		{
			  if(gselectNodes[i].nodeType == 1)
			  {
				 var actattr = new ActionAttr(gselectNodes[i]);
				 actattr.AddAttr("transform");
				 actcomp.Add(actattr);
				 var strmat  =  gselectNodes[i].getAttribute("transform");
				 if(strmat == undefined)
				 {
					 strmat = "";					
				 }
				 var bbox = gselectNodes[i].getBBox();
				 var xcenter = bbox.x + bbox.width/2;
				 var ycenter = bbox.y + bbox.height/2;
				 var strnewmat = strmat + "translate("+xcenter+","+ycenter + ")rotate("+nrotate+")translate(-"+xcenter+",-"+ycenter+")";
				 var mat = new Matrix();
				 strnewmat = mat.getTransform(strnewmat);
				 strnewmat = mat.getAsString(strnewmat);				 
				 gselectNodes[i].setAttribute("transform",strnewmat);
				 actattr.EndValue();
			  }
		}
		this.ResetAllFocus();
	}
	clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.OnStrokeWidthSelect = function(nIndex)
{
    gstrokewidth = nIndex;
	if(gselectNodes.length > 0)
    {
	   var actcom = new ActionCompose();
	   gActionHistory.Add(actcom);
	   for(var i = 0; i < gselectNodes.length; ++i)
	   {
		   if(gselectNodes[i].tagName == "text")
		   {
			  var actattr = new ActionAttr(gselectNodes[i]);
			  actattr.AddAttr("font-weight");
			  actcom.Add(actattr);
			  if(gstrokewidth >= 1)
			  {
				  gselectNodes[i].setAttribute("font-weight","bold");
			  }
			  else
			  {
				  gselectNodes[i].setAttribute("font-weight","normal");
			  }
			  actattr.EndValue();
		   }
		    else if(gselectNodes[i].tagName == "g")
		   {
			   for(var j = 0; j < gselectNodes[i].childNodes.length;++j)
			   {
				   if(gselectNodes[i].childNodes[j].nodeType == 1)
				   {
					  var gChildNode = gselectNodes[i].childNodes[j];
					  var actattr = new ActionAttr(gChildNode);
					  actattr.AddAttr("stroke-width");
					  actcom.Add(actattr);
					  gChildNode.setAttribute("stroke-width",gstrokewidth);
					  actattr.EndValue();
				   }
			   }
		   }
		   else
		   {
			   var actattr = new ActionAttr(gselectNodes[i]);
			   actattr.AddAttr("stroke-width");
			   actcom.Add(actattr);
			  gselectNodes[i].setAttribute("stroke-width",gstrokewidth);
			  actattr.EndValue();
		   }
	   }
   }
   clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.OnFontNameSelect = function(fontname)
{
   gfontname = fontname;
   var tdobj = document.getElementById("idfontname");
   tdobj.innerHTML = gfontname;
   if(gselectNodes.length > 0)
    {
	   var actcom = new ActionCompose();
	   gActionHistory.Add(actcom);
	   for(var i = 0; i < gselectNodes.length; ++i)
	   {
		   if(gselectNodes[i].tagName == "text")
		   {
			    var actattr = new ActionAttr(gselectNodes[i]);
				actattr.AddAttr("font-family");
			   actcom.Add(actattr);
			   gselectNodes[i].setAttribute("font-family",gfontname);
			   actattr.EndValue();
		   }
	   }
	}
   clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.OnFontSizeSelect = function(fontsize)
{
   gfontsize = fontsize;
   var tdobj = document.getElementById("idfontsize");
   tdobj.innerHTML = gfontsize;
    if(gselectNodes.length > 0)
    {
	   var actcom = new ActionCompose();
	   gActionHistory.Add(actcom);
	   for(var i = 0; i < gselectNodes.length; ++i)
	   {
		   if(gselectNodes[i].tagName == "text")
		   {
			  var actattr = new ActionAttr(gselectNodes[i]);
			  actattr.AddAttr("font-size");
			  actcom.Add(actattr);
			  gselectNodes[i].setAttribute("font-size",gfontsize);
			  actattr.EndValue();
		   }
	   }
	}
   clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.OnCanvasSizeChange = function()
{
	var inputwidth = document.getElementById("canvaswidth");
	var nwidth = inputwidth.value;
	var inputheight = document.getElementById("canvasheight");
	var nheight = inputheight.value;
	var blockobj = document.getElementById("svgblock1");
	blockobj.setAttribute("width",nwidth);
	blockobj.setAttribute("height",nheight);
};

TMainframe.prototype.OnStrokeTypeSelect = function(nIndex)
{
   switch (nIndex)
	{
	case 1:
	{
		gstroketype = "";
	}
	break;
	case 2:
		gstroketype = "18 8 10 10";
		break;
	case 3:
		gstroketype = "4 4";
		break;
	case 4:
		gstroketype = "12 5 5 5 8 8";
		break;
	case 5:
		gstroketype = "12 5 5 5 5 5 8 8";
		break;
	case 6:
		gstroketype = "18 28";
		break;
	case 7:
		gstroketype = "18 10 10 10";
		break;
	case 8:
		gstroketype = "18 6 14 14";
		break;
	case 8:
		gstroketype = "12 12 8 8";
		break;
	case 10:
		gstroketype = "14 8 14 8";
		break;
	}
	if(gselectNodes.length > 0)
    {
	   var actcom = new ActionCompose();
	   gActionHistory.Add(actcom);
	   for(var i = 0; i < gselectNodes.length; ++i)
	   {
		   if(gselectNodes[i].tagName == "text")
		   {
		   }
		   else if(gselectNodes[i].tagName == "g")
		   {
			   for(var j = 0; j < gselectNodes[i].childNodes.length;++j)
			   {
				   if(gselectNodes[i].childNodes[j].nodeType == 1)
				   {
					  var gChildNode = gselectNodes[i].childNodes[j];
					  var actattr = new ActionAttr(gChildNode);
					  actattr.AddAttr("stroke-dasharray");
					  actcom.Add(actattr);
					  gChildNode.setAttribute("stroke-dasharray",gstroketype);
					  actattr.EndValue();
				   }
			   }
		   }
		   else
		   {
			 var actattr = new ActionAttr(gselectNodes[i]);
			 actattr.AddAttr("stroke-dasharray");
			 actcom.Add(actattr);
			 gselectNodes[i].setAttribute("stroke-dasharray",gstroketype);
			 actattr.EndValue();
		   }
	   }
	}
   clsdlgglobal.OnFinishBlock();
};

TMainframe.prototype.IsInSVGArea = function(event,strid)
{
	var obj = event.target;
	while (obj != null)
	{
		if(obj.getAttribute && (obj.getAttribute("id") == strid))
		{
			return true;
		}
		obj = obj.parentNode;
	}
	return false;
};


TMainframe.prototype.InputChange = function(txt)
{
    if(nowcommand == "text")
	{
		EditToolObj.SetContent(txt);
		 var txtinput = document.getElementById("textinput");
	}
};


TMainframe.prototype.removeChild = function(childobj)
{
	if(childobj)
	{
	   	var svgcontentobj = document.getElementById("svgcontent");
		svgcontentobj.removeChild(childobj);
	}	
};

TMainframe.prototype.SelectAll = function()
{
	gselectNode = undefined;
	gselectNodes = [];
	var svgcontentobj = document.getElementById("svgcontent");
	for(var i = 0; i <svgcontentobj.childNodes.length; ++i)
	{
		if(svgcontentobj.childNodes[i].nodeType == 1)
		{
			gselectNodes.push(svgcontentobj.childNodes[i]);
		}
	}	
	this.ResetAllFocus();
};

TMainframe.prototype.ResetAllFocus = function()
{
	drawAssist.clearPointFocus();
	for(var k = 0; k < gselectNodes.length; ++k)
	{
		var objNode = gselectNodes[k];
		if(objNode.tagName=="circle" || objNode.tagName== "ellipse" || objNode.tagName=="image" ||objNode.tagName=="rect")
		{
			drawAssist.createEightFocus(objNode);
		}
		else if(objNode.tagName == "polyline" || objNode.tagName == "polygon")
		{	
			drawAssist.createPolylineFocus(objNode);
		}
		else if(objNode.tagName == "line")
		{
			drawAssist.createLineFocus(objNode);
		}
		else if(objNode.tagName == "text")
		{
			var bindpoints = objNode.getAttribute("bindpoint");
			if(bindpoints == undefined)
			{						
				drawAssist.createTextFocus(objNode);
			}
		}
		else if(objNode.tagName == "g")
		{		
			drawAssist.createEightFocus(objNode);
		}	
	}	
};
