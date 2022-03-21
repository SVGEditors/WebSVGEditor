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
 
 
function TCanvas()
{
}

TCanvas.prototype.setHorizonRuler = function()
{
  var svgnode = document.getElementById("svgnode");
  var clientrc = svgnode.getBoundingClientRect();
  var nwidth = clientrc.right - clientrc.left;
  var nheight = clientrc.bottom - clientrc.top;  
  
  
  var gcanvas = document.getElementById("svgcanvas");
  
  var gmatstr = gcanvas.getAttribute("transform");

  var mat = new Matrix;
  var ptArr = [];
  ptArr.push(0);
  ptArr.push(0);
  ptArr = mat.caclPoint(gmatstr,ptArr);

  var ptArr100 = [];
  ptArr100.push(100);
  ptArr100.push(100);
  ptArr100 = mat.caclPoint(gmatstr,ptArr100);
  
  var fscale = (ptArr100[0]-ptArr[0])*1.0/100;
 
  var ruleglines = document.getElementById("svgrulehlines");
  var rulegtexts = document.getElementById("svgrulehtexts");
  var bkrect = document.getElementById("svgrulehback");
  bkrect.setAttribute("x","20");
  bkrect.setAttribute("y","0");
  bkrect.setAttribute("width",nwidth);
  bkrect.setAttribute("height","20");
  
  var nDistance = 100;
  
  var nDistance = ((1.0 / fscale * 100) / 10) * 10;
  if (nDistance > 50 && nDistance < 150)
  {
	nDistance = 100;
  }
  if (nDistance >= 150 && nDistance < 200)
  {
	 nDistance = 200;
  }
  var fDistance = nDistance*1.0*fscale;
  
  var nAllLineCnt = ruleglines.childNodes.length;
  var nCurrLineIndex = 0;
  for(var i = 0; i  < ruleglines.childNodes.length;++i)
  {
    if(ruleglines.childNodes[i].tagName == "line")
	{
	   ruleglines.childNodes[i].setAttribute("visibility","hidden");
	}
  }
  
  var nAllTextCnt = rulegtexts.childNodes.length;
  var nCurrTextIndex = 0;
  for(var i = 0; i  < rulegtexts.childNodes.length;++i)
  {
    if(rulegtexts.childNodes[i].tagName == "text")
	{
	   rulegtexts.childNodes[i].setAttribute("visibility","hidden");
	}
  }
  
  var nIndex = 0;
  for (var i= ptArr[0]; i < nwidth; i += fDistance)
  {
		for (var j = 0; j < 10; ++j)
		{
			var nxPt = i + j*(fDistance / 10);
			if(nxPt < 20)
			  continue;
			var nyPt = 0;
			if (j == 0)
			{
				nyPt = 0;
			}
			else if (j % 5 == 0)
			{
				nyPt = 10;
			}
			else 
			{
				nyPt = 15;
			}
			var ruleline = undefined;
			if(nCurrLineIndex < nAllLineCnt)
			{
				ruleline = ruleglines.childNodes[nCurrLineIndex];
				if(ruleline && ruleline.tagName=="line")
				{
				    ruleline.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					ruleline = undefined;
				}
				nCurrLineIndex ++;
			}
			if(ruleline == undefined)
			{
			    ruleline = document.createElementNS("http://www.w3.org/2000/svg", "line");
			    ruleglines.appendChild(ruleline);
			 }
		   ruleline.setAttribute("x1",nxPt);
		   ruleline.setAttribute("y1",nyPt);
		   ruleline.setAttribute("x2",nxPt);
		   ruleline.setAttribute("y2",20);
		   ruleline.setAttribute("stroke","#000000");
		   ruleline.setAttribute("stroke-opacity","1");
		}
		if(i>=20)
		{
		    var txt = undefined;
			if(nCurrTextIndex < nAllTextCnt)
			{
				txt = rulegtexts.childNodes[nCurrLineIndex];
				if(txt && txt.tagName=="text")
				{
				    txt.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					txt = undefined;
				}
				nCurrTextIndex ++;
			}
			if(txt == undefined)
			{
			    txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
			    rulegtexts.appendChild(txt);
			 }
		    txt.setAttribute("x", i+2);
			txt.setAttribute("y", 12);
			txt.setAttribute("fill","#000000");
			txt.setAttribute("stroke","#000000");
			txt.setAttribute("stroke-opacity","0");
			txt.setAttribute("fill-opacity","1");	
			txt.setAttribute("font-family","Microsoft YaHei");
			txt.textContent = parseInt(nIndex * nDistance);
		}
		nIndex++;
	}
	nIndex = 1;
	for (var i = (ptArr[0] - fDistance); i >= -fDistance; i -= fDistance)
	{
		for (var j = 0; j < 10; ++j)
		{
			var nxPt = i + j*(fDistance / 10);
			if(nxPt < 20)
			  continue;
			var nyPt = 0;
			if (j == 0)
			{
				nyPt = 0;
			}
			else if (j % 5 == 0)
			{
				nyPt = 10;
			}
			else
			{
				nyPt = 15;
			}
			var ruleline = undefined;
			if(nCurrLineIndex < nAllLineCnt)
			{
				ruleline = ruleglines.childNodes[nCurrLineIndex];
				if(ruleline && ruleline.tagName=="line")
				{
				    ruleline.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					ruleline = undefined;
				}
				nCurrLineIndex ++;
			}
			if(ruleline == undefined)
			{
			    ruleline = document.createElementNS("http://www.w3.org/2000/svg", "line");
			    ruleglines.appendChild(ruleline);
			 }
		   ruleline.setAttribute("x1",nxPt);
		   ruleline.setAttribute("y1",nyPt);
		   ruleline.setAttribute("x2",nxPt);
		   ruleline.setAttribute("y2",20);
		   ruleline.setAttribute("stroke","#000000");
		   ruleline.setAttribute("stroke-opacity","1");
		}
		if(i>=20)
		{
		    var txt = undefined;
			if(nCurrTextIndex < nAllTextCnt)
			{
				txt = rulegtexts.childNodes[nCurrLineIndex];
				if(txt && txt.tagName=="text")
				{
				    txt.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					txt = undefined;
				}
				nCurrTextIndex ++;
			}
			if(txt == undefined)
			{
			    txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
			    rulegtexts.appendChild(txt);
			 }
		    txt.setAttribute("x", i+2);
			txt.setAttribute("y", 12);
			txt.setAttribute("fill","#000000");
			txt.setAttribute("stroke","#000000");
			txt.setAttribute("stroke-opacity","0");
			txt.setAttribute("fill-opacity","1");	
			txt.setAttribute("font-family","Microsoft YaHei");
			txt.textContent = "-"+parseInt(nIndex * nDistance);
		}
		nIndex++;
	}
};
TCanvas.prototype.setVerticalRuler = function()
{
  var svgnode = document.getElementById("svgnode");
  var clientrc = svgnode.getBoundingClientRect();
  var nwidth = clientrc.right - clientrc.left;
  var nheight = clientrc.bottom - clientrc.top;  
  
  var gcanvas = document.getElementById("svgcanvas");
  
  var gmatstr = gcanvas.getAttribute("transform");
  var mat = new Matrix;
  var ptArr = [];
  ptArr.push(0);
  ptArr.push(0);
  ptArr = mat.caclPoint(gmatstr,ptArr);
  

  
  var ptArr100 = [];
  ptArr100.push(100);
  ptArr100.push(100);
  ptArr100 = mat.caclPoint(gmatstr,ptArr100);
  
  var fscale = (ptArr100[0]-ptArr[0])*1.0/100;
			
  var ruleglines = document.getElementById("svgrulevlines");
  var rulegtexts = document.getElementById("svgrulevtexts");
  var bkrect = document.getElementById("svgrulevback");
  bkrect.setAttribute("x","0");
  bkrect.setAttribute("y","0");
  bkrect.setAttribute("width",20);
  bkrect.setAttribute("height",nheight);
  
    var nDistance = ((1.0 / fscale * 100) / 10) * 10;
	if (nDistance > 50 && nDistance < 150)
	{
		nDistance = 100;
	}
	if (nDistance >= 150 && nDistance < 200)
	{
		nDistance = 200;
	}
 
 var nAllLineCnt = ruleglines.childNodes.length;
  var nCurrLineIndex = 0;
  for(var i = 0; i  < ruleglines.childNodes.length;++i)
  {
    if(ruleglines.childNodes[i].tagName == "line")
	{
	   ruleglines.childNodes[i].setAttribute("visibility","hidden");
	}
  }
  
  var nAllTextCnt = rulegtexts.childNodes.length;
  var nCurrTextIndex = 0;
  for(var i = 0; i  < rulegtexts.childNodes.length;++i)
  {
    if(rulegtexts.childNodes[i].tagName == "text")
	{
	   rulegtexts.childNodes[i].setAttribute("visibility","hidden");
	}
  } 
  
  var fDistance = nDistance*1.0*fscale;
  var nIndex = 0;
  
  for (var i=ptArr[1]; i < nheight; i += fDistance)
  {
		for (var j = 0; j < 10; ++j)
		{
			var nyPt = i + j*(fDistance / 10);
			if(nyPt < 20)
			  continue;
			var nxPt = 0;
			if (j == 0)
			{
				nxPt = 0;
			}
			else if (j % 5 == 0)
			{
				nxPt = 10;
			}
			else
			{
				nxPt = 15;
			}
			
			var ruleline = undefined;
			if(nCurrLineIndex < nAllLineCnt)
			{
				ruleline = ruleglines.childNodes[nCurrLineIndex];
				if(ruleline && ruleline.tagName=="line")
				{
				    ruleline.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					ruleline = undefined;
				}
				nCurrLineIndex ++;
			}
			if(ruleline == undefined)
			{
			    ruleline = document.createElementNS("http://www.w3.org/2000/svg", "line");
			    ruleglines.appendChild(ruleline);
			 }
		   ruleline.setAttribute("x1",20);
		   ruleline.setAttribute("y1",nyPt);
		   ruleline.setAttribute("x2",nxPt);
		   ruleline.setAttribute("y2",nyPt);
		   ruleline.setAttribute("stroke","#000000");
		   ruleline.setAttribute("stroke-opacity","1");		
		}
		if(i >= 20)
		{
		    var txt = undefined;
			if(nCurrTextIndex < nAllTextCnt)
			{
				txt = rulegtexts.childNodes[nCurrLineIndex];
				if(txt && txt.tagName=="text")
				{
				    txt.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					txt = undefined;
				}
				nCurrTextIndex ++;
			}
			if(txt == undefined)
			{
			    txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
			    rulegtexts.appendChild(txt);
			 }
		    txt.setAttribute("name",i);
			txt.setAttribute("x", 0);
			txt.setAttribute("y", i);
			txt.setAttribute("fill","#000000");
			txt.setAttribute("stroke","#000000");
			txt.setAttribute("stroke-opacity","0");
			txt.setAttribute("fill-opacity","1");	
			txt.setAttribute("font-family","Microsoft YaHei");
			var minusi = -i;
			var addi = i+2;
			var matstr = "translate(5,"+addi+")rotate(90)translate(0,"+minusi+")";
			txt.setAttribute("transform",matstr);
			txt.textContent = parseInt(nIndex * nDistance);			
		}
		nIndex++;
	}
	nIndex = 1;
	for (var i = (ptArr[1] - fDistance); i >= -fDistance; i -= fDistance)
	{
		for (var j = 0; j < 10; ++j)
		{
			var nyPt = i + j*(fDistance / 10);
			if(nyPt < 20)
			  continue;
			var nxPt = 0;
			if (j == 0)
			{
				nxPt = 0;
			}
			else if (j % 5 == 0)
			{
				nxPt = 10;
			}
			else
			{
				nxPt = 15;
			}
			var ruleline = undefined;
			if(nCurrLineIndex < nAllLineCnt)
			{
				ruleline = ruleglines.childNodes[nCurrLineIndex];
				if(ruleline && ruleline.tagName=="line")
				{
				    ruleline.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					ruleline = undefined;
				}
				nCurrLineIndex ++;
			}
			if(ruleline == undefined)
			{
			    ruleline = document.createElementNS("http://www.w3.org/2000/svg", "line");
			    ruleglines.appendChild(ruleline);
			 }
		   ruleline.setAttribute("x1",20);
		   ruleline.setAttribute("y1",nyPt);
		   ruleline.setAttribute("x2",nxPt);
		   ruleline.setAttribute("y2",nyPt);
		   ruleline.setAttribute("stroke","#000000");
		   ruleline.setAttribute("stroke-opacity","1");		
		}
		if(i >= 20)
		{
		 var txt = undefined;
			if(nCurrTextIndex < nAllTextCnt)
			{
				txt = rulegtexts.childNodes[nCurrLineIndex];
				if(txt && txt.tagName=="text")
				{
				    txt.setAttribute("visibility","");
					bExist = true;
				}
				else
				{
					txt = undefined;
				}
				nCurrTextIndex ++;
			}
			if(txt == undefined)
			{
			    txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
			    rulegtexts.appendChild(txt);
			 }
		    txt.setAttribute("name",i);
			txt.setAttribute("x", 0);
			txt.setAttribute("y", i);
			txt.setAttribute("fill","#000000");
			txt.setAttribute("stroke","#000000");
			txt.setAttribute("stroke-opacity","0");
			txt.setAttribute("fill-opacity","1");
			txt.setAttribute("font-family","Microsoft YaHei");
			var minusi = -i;
			var addi = i+2;
			var matstr = "translate(5,"+addi+")rotate(90)translate(0,"+minusi+")";
			txt.setAttribute("transform",matstr);
			txt.textContent = "-"+parseInt(nIndex * nDistance);
		}
		nIndex++;
	}
};
		
TCanvas.prototype.resetRule = function()
{
  if(bshowrule)
  {
     this.setHorizonRuler();
     this.setVerticalRuler();
  }
};

TCanvas.prototype.resetGrid = function()
{
   if(bshowgrid)
   {
	    var strokeopacity = "0.1";
		var strongstrokeopacity = "0.2";
		var svgnode = document.getElementById("svgnode");
		var clientrc = svgnode.getBoundingClientRect();
		var nwidth = clientrc.right - clientrc.left;
		var nheight = clientrc.bottom - clientrc.top;  
	  
		var gcanvas = document.getElementById("svgcanvas");
	  	var gmatstr = gcanvas.getAttribute("transform");
		var mat = new Matrix;
		
		var ptArr = [];
		ptArr.push(0);
		ptArr.push(0);
		ptArr = mat.caclPoint(gmatstr,ptArr);
		 
		var ptArr100 = [];
		ptArr100.push(100);
		ptArr100.push(100);
		ptArr100 = mat.caclPoint(gmatstr,ptArr100);
		  
		var fscale = (ptArr100[0]-ptArr[0])*1.0/100;
					
		  
		var nDistance = ((1.0 / fscale * 100) / 10) * 10;
		if (nDistance > 50 && nDistance < 150)
		{
			nDistance = 100;
		}
		if (nDistance >= 150 && nDistance < 200)
		{
			nDistance = 200;
		}
		var gridlines = document.getElementById("svggrid");
		
		var newstr = mat.Inverse(gmatstr);
		gridlines.setAttribute("transform",newstr);
  
  
		var nAllLineCnt = gridlines.childNodes.length;
		var nCurrLineIndex = 0;
		for(var i = 0; i  < gridlines.childNodes.length;++i)
		{
			if(gridlines.childNodes[i].tagName == "line")
			{
			   gridlines.childNodes[i].setAttribute("visibility","hidden");
			}
		}
		var fDistance = nDistance*1.0*fscale;
		
	  for (var i= ptArr[0]; i < nwidth; i += fDistance)
	  {
			for (var j = 0; j < 10; ++j)
			{
				var nxPt = i + j*(fDistance / 10);
				var nyPt = nheight;
			
				var gridline = undefined;
				if(nCurrLineIndex < nAllLineCnt)
				{
					gridline = gridlines.childNodes[nCurrLineIndex];
					if(gridline && gridline.tagName=="line")
					{
						gridline.setAttribute("visibility","");
						bExist = true;
					}
					else
					{
						gridline = undefined;
					}
					nCurrLineIndex ++;
				}
				if(gridline == undefined)
				{
					gridline = document.createElementNS("http://www.w3.org/2000/svg", "line");
					gridlines.appendChild(gridline);
				 }
			   gridline.setAttribute("x1",nxPt);
			   gridline.setAttribute("y1",nyPt);
			   gridline.setAttribute("x2",nxPt);
			   gridline.setAttribute("y2",0);
			   gridline.setAttribute("stroke","#000000");
			   gridline.setAttribute("stroke-opacity",strokeopacity);
			   if(j==0)
			   {
				 gridline.setAttribute("stroke-opacity",strongstrokeopacity);
			   }
			}
		}
		for (var i = (ptArr[0] - fDistance); i >= -fDistance; i -= fDistance)
		{
			for (var j = 0; j < 10; ++j)
			{
				var nxPt = i + j*(fDistance / 10);
				var nyPt = nheight;
				var gridline = undefined;
				if(nCurrLineIndex < nAllLineCnt)
				{
					gridline = gridlines.childNodes[nCurrLineIndex];
					if(gridline && gridline.tagName=="line")
					{
						gridline.setAttribute("visibility","");
						bExist = true;
					}
					else
					{
						gridline = undefined;
					}
					nCurrLineIndex ++;
				}
				if(gridline == undefined)
				{
					gridline = document.createElementNS("http://www.w3.org/2000/svg", "line");
					gridlines.appendChild(gridline);
				 }
			   gridline.setAttribute("x1",nxPt);
			   gridline.setAttribute("y1",nyPt);
			   gridline.setAttribute("x2",nxPt);
			   gridline.setAttribute("y2",0);
			   gridline.setAttribute("stroke","#000000");
			   gridline.setAttribute("stroke-opacity",strokeopacity);
			   if(j==0)
			   {
				 gridline.setAttribute("stroke-opacity",strongstrokeopacity);
			   }
			}
		}
		
		for (var i=ptArr[1]; i < nheight; i += fDistance)
		  {
				for (var j = 0; j < 10; ++j)
				{
					var nyPt = i + j*(fDistance / 10);
					var nxPt = nwidth;
										
				var gridline = undefined;
				if(nCurrLineIndex < nAllLineCnt)
				{
					gridline = gridlines.childNodes[nCurrLineIndex];
					if(gridline && gridline.tagName=="line")
					{
						gridline.setAttribute("visibility","");
						bExist = true;
					}
					else
					{
						gridline = undefined;
					}
					nCurrLineIndex ++;
				}
				if(gridline == undefined)
				{
					gridline = document.createElementNS("http://www.w3.org/2000/svg", "line");
					gridlines.appendChild(gridline);
				 }
				   gridline.setAttribute("x1",0);
				   gridline.setAttribute("y1",nyPt);
				   gridline.setAttribute("x2",nxPt);
				   gridline.setAttribute("y2",nyPt);
				   gridline.setAttribute("stroke","#000000");
				   gridline.setAttribute("stroke-opacity",strokeopacity);
				   if(j==0)
				   {
					 gridline.setAttribute("stroke-opacity",strongstrokeopacity);
				   }
			   }
		}
		for (var i = (ptArr[1] - fDistance); i >= -fDistance; i -= fDistance)
		{
			for (var j = 0; j < 10; ++j)
			{
				var nyPt = i + j*(fDistance / 10);
				var nxPt = nwidth;
				
				var gridline = undefined;
				if(nCurrLineIndex < nAllLineCnt)
				{
					gridline = gridlines.childNodes[nCurrLineIndex];
					if(gridline && gridline.tagName=="line")
					{
						gridline.setAttribute("visibility","");
						bExist = true;
					}
					else
					{
						gridline = undefined;
					}
					nCurrLineIndex ++;
				}
				if(gridline == undefined)
				{
					gridline = document.createElementNS("http://www.w3.org/2000/svg", "line");
					gridlines.appendChild(gridline);
				 }
				   gridline.setAttribute("x1",0);
				   gridline.setAttribute("y1",nyPt);
				   gridline.setAttribute("x2",nxPt);
				   gridline.setAttribute("y2",nyPt);
				   gridline.setAttribute("stroke","#000000");
				   gridline.setAttribute("stroke-opacity",strokeopacity);
				   if(j==0)
				   {
					 gridline.setAttribute("stroke-opacity",strongstrokeopacity);
				   }
			 }
		}
	}
};

TCanvas.prototype.resetcanvas = function()
{
	var svgwidth  = document.body.offsetWidth;
	var svgheight = document.body.offsetHeight;
	
	var objDivLeft = document.getElementById("divLeft");
	if(objDivLeft != undefined)
	{
		svgwidth -= objDivLeft.offsetWidth;
	}
	var objDivRight = document.getElementById("divRight");
	if(objDivRight != undefined)
	{
		svgwidth -= objDivRight.offsetWidth;
	}
	svgheight -= 40;
	
	var svrroot = document.getElementById("svgnode");
	var backrect = svrroot.getElementById("backrect");
	svrroot.setAttribute("height",svgheight);
	svrroot.setAttribute("width",svgwidth);
	var viewbox = "0 0 "+svgwidth + " " + svgheight;
	svrroot.setAttribute("viewBox",viewbox);
	backrect.setAttribute("height",svgheight);
	backrect.setAttribute("width",svgwidth);
	this.resetClip();	
	this.resetRule();
	this.resetGrid();
};

TCanvas.prototype.resetClip = function()
{
  var svgwidth  = document.body.offsetWidth;
  var svgheight = document.body.offsetHeight;
	
  var canvascliprect = document.getElementById("canvascliprect");
  if(bshowrule)
  {
	canvascliprect.setAttribute("x","20");
    canvascliprect.setAttribute("y","20");
  }
  else
  {
    canvascliprect.setAttribute("x","0");
    canvascliprect.setAttribute("y","0");
  }
  canvascliprect.setAttribute("height",svgheight);
  canvascliprect.setAttribute("width",svgwidth);
  var gcanvas = document.getElementById("svgcanvas");
  var matstr = gcanvas.getAttribute("transform");
  var mat = new Matrix;
  var newstr = mat.Inverse(matstr);
  canvascliprect.setAttribute("transform",newstr);
};





















