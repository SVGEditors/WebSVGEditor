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
 
function TGlobal()
{
};

TGlobal.prototype.doNothing = function ()
{
   window.event.returnValue=false;  
   return false;  
};

TGlobal.prototype.subLstPoint = function (points)
{
   var newstr= "";
   var str = points.replace(/ /g, ',');
   var strs= new Array();
   strs=str.split(",");
   for (i=0;i<(strs.length-2);i++) 
   { 
	  if(i!=0)
	  {
		newstr +=",";
	  }
      newstr += strs[i];
   }
   if(strs.length <= 2)
   {
      newstr = points;
   }
   return newstr;
};

TGlobal.prototype.getLstPoint = function (points)
{
	var ptArr = [];
	
	var x = 0;
	var y = 0;
	
   var str = points.replace(/ /g, ',');
   var strs= new Array();
   strs=str.split(",");
   if(strs.length >= 2)
   {
	 x = strs[strs.length-2];
	 y = strs[strs.length-1];
   }
   ptArr.push(x);
   ptArr.push(y);
   return ptArr;   
};

TGlobal.prototype.getPointSize = function (points)
{
   var str = points.replace(/ /g, ',');
   var strs= new Array();
   strs=str.split(",");
   return strs.length;
};

TGlobal.prototype.getDistance = function (p1x,p1y,p2x,p2y)
{
	p1x = parseFloat(p1x);
	p1y = parseFloat(p1y);
	p2x = parseFloat(p2x);
	p2y = parseFloat(p2y);
	var dis = Math.sqrt((p1x - p2x)*(p1x - p2x) + (p1y - p2y)*(p1y - p2y));
	dis = Math.round(parseFloat(dis))/100;	
	return dis;
};

TGlobal.prototype.getPointQuadrant = function (p1x,p1y,p2x,p2y)
{
	if(p1x < p2x && p1y >= p2y)
	{
		return 1;
	}
	else if(p1x >= p2x && p1y > p2y)
	{
		return 2;
	}
	else if(p1x > p2x && p1y <= p2y)
	{
		return 3;
	}
	else if(p1x <= p2x && p1y < p2y)
	{
		return 4;
	}	
	return 0;
};

TGlobal.prototype.getAngle2 = function (x1,y1,x2,y2,cx,cy)
{  
    var M_PI = 3.1415926535897;  
  
    var ma_x = x1 - cx;  
    var ma_y = y1 - cy;  
    var mb_x = x2 - cx;  
    var mb_y = y2 - cy;  
    var v1 = (ma_x * mb_x) + (ma_y * mb_y);  
    var ma_val = Math.sqrt(ma_x * ma_x + ma_y * ma_y);  
    var mb_val = Math.sqrt(mb_x * mb_x + mb_y * mb_y);  
	var fdiv = ma_val * mb_val;
	if(Math.abs(fdiv) <= 0)
		fdiv = 0.001;
    var cosM = v1 / fdiv;  
    var angleAMB = Math.acos(cosM);  
    return angleAMB;  
} ;

TGlobal.prototype.getArcMid = function (x1,y1,x2,y2,cx,cy,r)
{
	var angle = this.getAngle2(x1,y1,x2,y2,cx,cy);
	
	var nQuadrant = this.getPointQuadrant(x1,y1,x2,y2);
	if(nQuadrant == 1 | nQuadrant == 2)
	{
		angle = -angle;
	}	
	var ptx = cx + r*Math.cos(angle/2);
	var pty = cy + r*Math.sin(angle/2);
	
	var ptArr = [];
	ptArr.push(ptx);
	ptArr.push(pty);
	return ptArr;
};

TGlobal.prototype.getAngle = function (p1x,p1y,p2x,p2y)
{
	var nQuadrant = this.getPointQuadrant(p1x,p1y,p2x,p2y);
	var fdiv = p2x-p1x;
	if(Math.abs(fdiv) <= 0)
		fdiv = 0.001;
	var k = (p2y-p1y)/fdiv;
	var angle = Math.atan(k)*180/3.14;
	if(nQuadrant == 1)
	{
		angle = -angle;
	}
	else if(nQuadrant ==2)
	{
		angle = 180-angle;
	}
	else if(nQuadrant == 3)
	{
		angle = -180-angle;
	}
	else if(nQuadrant == 4)
	{
		angle = -angle;
	}
	return parseInt(angle);
};

TGlobal.prototype.GetParaPostion = function (p1x,p1y,p2x,p2y,distance)
{
	p1x = parseFloat(p1x);
	p1y = parseFloat(p1y);
	p2x = parseFloat(p2x);
	p2y = parseFloat(p2y);
	var nQuadrant = this.getPointQuadrant(p1x,p1y,p2x,p2y);
	
	var digree = Math.atan(Math.abs(p2y - p1y)/Math.abs(p2x - p1x));
	
	var ptx = p1x;
	var pty = p1y;
	if(nQuadrant == 1)
	{
		ptx = (p1x - distance*Math.sin(digree));
		pty = (p1y - distance*Math.cos(digree));
	}
	else if(nQuadrant == 2)
	{
		ptx = (p1x - distance*Math.sin(digree));
		pty = (p1y + distance*Math.cos(digree));
	}
	else if(nQuadrant == 3)
	{
		ptx = (p1x - distance*Math.sin(digree));
		pty = (p1y - distance*Math.cos(digree));
	}
	else if(nQuadrant == 4)
	{
		ptx = (p1x - distance*Math.sin(digree));
		pty = (p1y + distance*Math.cos(digree));
	}
	var ptArr = [];
	ptArr.push(ptx);
	ptArr.push(pty);
	return ptArr;
};

TGlobal.prototype.GetPosInLine = function (p1x,p1y,p2x,p2y,distance)
{
	p1x = parseFloat(p1x);
	p1y = parseFloat(p1y);
	p2x = parseFloat(p2x);
	p2y = parseFloat(p2y);
	var nQuadrant = this.getPointQuadrant(p1x,p1y,p2x,p2y);
	var digree = Math.atan(Math.abs(p2y - p1y)/Math.abs(p2x - p1x));
	
	var ptx = 0;
	var pty = 0;
	if(nQuadrant == 1)
	{
		ptx = (p2x + distance*Math.cos(digree));
		pty = (p2y - distance*Math.sin(digree));
	}
	else if(nQuadrant == 2)
	{
		ptx = (p2x - distance*Math.cos(digree));
		pty = (p2y - distance*Math.sin(digree));
	}
	else if(nQuadrant == 3)
	{
		ptx = (p2x - distance*Math.cos(digree));
		pty = (p2y + distance*Math.sin(digree));
	}
	else if(nQuadrant == 4)
	{
		ptx = (p2x + distance*Math.cos(digree));
		pty = (p2y + distance*Math.sin(digree));
	}
	var ptArr = [];
	ptArr.push(ptx);
	ptArr.push(pty);
	return ptArr;
};

TGlobal.prototype.GetPosInLine2 = function (p1x,p1y,p2x,p2y,distance)
{
	p1x = parseFloat(p1x);
	p1y = parseFloat(p1y);
	p2x = parseFloat(p2x);
	p2y = parseFloat(p2y);
	var nQuadrant = this.getPointQuadrant(p1x,p1y,p2x,p2y);
	var digree = Math.atan(Math.abs(p2y - p1y)/Math.abs(p2x - p1x));
	
	var ptx = 0;
	var pty = 0;
	if(nQuadrant == 1)
	{
		ptx = (p1x + distance*Math.cos(digree));
		pty = (p1y - distance*Math.sin(digree));
	}
	else if(nQuadrant == 2)
	{
		ptx = (p1x - distance*Math.cos(digree));
		pty = (p1y - distance*Math.sin(digree));
	}
	else if(nQuadrant == 3)
	{
		ptx = (p1x - distance*Math.cos(digree));
		pty = (p1y + distance*Math.sin(digree));
	}
	else if(nQuadrant == 4)
	{
		ptx = (p1x + distance*Math.cos(digree));
		pty = (p1y + distance*Math.sin(digree));
	}
	var ptArr = [];
	ptArr.push(ptx);
	ptArr.push(pty);
	return ptArr;
};

TGlobal.prototype.quad = function (pox,poy,ptx,pty)
{
	var re;
	if(ptx < pox)
	{
		if(pty < poy)
			re = 2;
		else
			re = 1;
	}
	else
	{
		if(pty < poy)
			re = 3;
		else
			re = 0;
	}
	return re;
};

TGlobal.prototype.PtInPolygonEx = function (arrX,arrY, ptx,pty)
{
	var n = arrX.length;
	if(n == 0)
		return false;
	var oldquad,newquad;
	var a,b,wind = 0;;
	var lastpt = n-1;
	oldquad = this.quad(ptx,pty,arrX[lastpt],arrY[lastpt]);
	for(var i = 0; i < n; i++)
	{
		newquad = this.quad(ptx,pty,arrX[i],arrY[i]);
		if(newquad != oldquad)
		{
			if(((oldquad+1)&3)==newquad)
				wind++;
			else if(((newquad+1)&3)==oldquad)
				wind--;
			else
			{
				a = parseInt(arrY[lastpt]) - parseInt(arrY[i]);
				a *= parseInt(ptx - arrX[lastpt]);
				b = parseInt(arrX[lastpt]) - parseInt(arrX[i]);
				a += parseInt(arrY[lastpt]) * b;
				b *= parseInt(pty);
				if(a > b)
					wind += 2;
				else
					wind -= 2;
			}
		}
		lastpt = i;
		oldquad = newquad;
	}
	if(wind)
		return true;
	return false;
};

TGlobal.prototype.IsPtInLine = function (px,py,x1,y1,x2,y2)
{
	var ptArrX = [];
	var ptArrY = [];
	var pts = this.GetParaPostion(x1,y1,x2,y2,5);
	var pte = this.GetParaPostion(x2,y2,x1,y1,5);
	
	ptArrX.push(pts[0]);
	ptArrY.push(pts[1]);
	var x3 = parseFloat(x1)*2-parseFloat(pts[0]);
	var y3 = parseFloat(y1)*2-parseFloat(pts[1]);
	ptArrX.push(x3);
	ptArrY.push(y3);
		
	var x4 = parseFloat(x2)*2-parseFloat(pte[0]);
	var y4 = parseFloat(y2)*2-parseFloat(pte[1]);
	ptArrX.push(x4);
	ptArrY.push(y4);
	ptArrX.push(pte[0]);
	ptArrY.push(pte[1]);
	return this.PtInPolygonEx(ptArrX,ptArrY,px,py);
};

TGlobal.prototype.IsPointInPolyline = function (polylineobj,px,py)
{
   var points = polylineobj.getAttribute("points");
   var str = points.replace(/ /g, ',');
   var strs= new Array();
   strs=str.split(",");
   if(strs.length >= 4)
   {
	   var x1 = strs[0];
	   var y1 = strs[1];
	   for(var i = 0; i < strs.length; i+=2)
	   {
		 var x2 = strs[i];
		 var y2 = strs[i+1];
		 if(this.IsPtInLine(px,py,x1,y1,x2,y2))
			 return true;
		 x1 = x2;
		 y1 = y2;
	   }
   }
	return false;
};

TGlobal.prototype.IsPointInPolygon = function (polylineobj,px,py)
{
   var points = polylineobj.getAttribute("points");
   var str = points.replace(/ /g, ',');
   var strs= new Array();
   strs=str.split(",");
   if(strs.length >= 4)
   {
	   var ptArrX = [];
	   var ptArrY = [];
	   var x1 = parseFloat(strs[0]);
	   var y1 = parseFloat(strs[1]);
	   for(var i = 0; i < strs.length; i+=2)
	   {
		  ptArrX.push(parseFloat(strs[i]));
		  ptArrY.push(parseFloat(strs[i+1]));
	   }
	   return this.PtInPolygonEx(ptArrX,ptArrY,px,py);
   }
	return false;
};

TGlobal.prototype.GetPolylinePoints = function (polylineobj)
{
   var points = polylineobj.getAttribute("points");
   var str = points.replace(/ /g, ',');
   var strs= new Array();
   strs=str.split(",");
   return strs;
};

TGlobal.prototype.IsPointInLine = function (lineobj,px,py)
{
	var x1 = lineobj.getAttribute("x1");
	var y1 = lineobj.getAttribute("y1");
	var x2 = lineobj.getAttribute("x2");
	var y2 = lineobj.getAttribute("y2");
	return this.IsPtInLine(px,py,x1,y1,x2,y2);
};

TGlobal.prototype.IsPointInRect = function (rectobj,px,py)
{
	var x = rectobj.getAttribute("x");
	var y = rectobj.getAttribute("y");
	var width = rectobj.getAttribute("width");
	var height = rectobj.getAttribute("height");
	x = parseFloat(x);
	y = parseFloat(y);
	width = parseFloat(width);
	height = parseFloat(height);
	if(px >= x && px <= (x+width) && py>=y && py<=(y+height))
		return true;
	return false;
	
};

TGlobal.prototype.IsPointInCircle = function (circleobj,px,py)
{
	var cx = circleobj.getAttribute("cx");
	var cy = circleobj.getAttribute("cy");
	var r  = circleobj.getAttribute("r");
	
	cx = parseFloat(cx);
	cy = parseFloat(cy);
	r  = parseFloat(r);
	
	var dis = Math.sqrt(Math.pow(px-cx,2)+Math.pow(py-cy,2));
	
	if(dis <= r)
		return true;
	
	return false;
};

TGlobal.prototype.IsPointInEllipse = function (circleobj,px,py)
{
	var cx = circleobj.getAttribute("cx");
	var cy = circleobj.getAttribute("cy");
	var rx  = circleobj.getAttribute("rx");
	var ry  = circleobj.getAttribute("ry");
	
	var cx = parseFloat(cx);
	var cy = parseFloat(cy);
	var fa  = parseFloat(rx);
	var fb  = parseFloat(ry);
	
	var val = (cx - px)*(cx - px) / (fa*fa)
		+ (cy - py)*(cy - py) / (fb*fb);
	if (val <= 1)
	{
		return true;
	}		
	
	return false;
};

TGlobal.prototype.IsPointInBBox = function (shapeobj,px,py)
{
	var bbox = shapeobj.getBBox();
	if(px >= bbox.x && px <= (bbox.x+bbox.width) && py >= bbox.y && py <= (bbox.y+bbox.height))
		return true;
	return false;
};

TGlobal.prototype.GetTextBoundBox = function (txtobj)
{
	var bNullTxt = false;
	if(txtobj.textContent == undefined || txtobj.textContent.length == 0)
	{
		bNullTxt = true;
		txtobj.textContent = "A";
	}
	var  bbox = txtobj.getBBox();
	
	if(bNullTxt)
	{
		txtobj.textContent = "";
	}
	return bbox;
};

TGlobal.prototype.IsPointInInnerShape = function (event,svgG)
{
	if(svgG.nodeType != 1)
		return undefined;
	if(svgG.tagName != "g")
		return undefined;
	var svgnode  = document.getElementById("svgnode");
	var clientrc = svgnode.getBoundingClientRect();
	var gcanvas  = document.getElementById("svgcanvas");
	var strmatstr = "";
	var topNode = svgG;
	while(topNode.parentNode != undefined)
	{
		var topNodeId = topNode.getAttribute("id")
		var nodemat = topNode.getAttribute("transform");
		if(nodemat != undefined)
		{
			strmatstr = nodemat + strmatstr;
		}
		if(topNodeId == "svgcanvas")
		{
			break;
		}
		topNode = topNode.parentNode;
	}
	
	var mat  = new Matrix;
	var rmat = mat.Inverse(strmatstr);
	var xpos = event.clientX - clientrc.left;
	var ypos = event.clientY - clientrc.top;
	var ptArr = [];
	ptArr.push(xpos);
	ptArr.push(ypos);
	ptArr = mat.caclPoint(rmat,ptArr);
	
	var childNodes = svgG.childNodes;
	
	for(var i = childNodes.length-1;i >=0; --i)
	{
		var node = childNodes[i];
		if(node.nodeType != 1)
			continue;
		
		var ptNewArr = [];
		ptNewArr.push(ptArr[0]);
		ptNewArr.push(ptArr[1]);
	
		var strmat = node.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptNewArr = mat.caclPoint(strmat,ptArr);
		}
		var px = ptNewArr[0];
		var py = ptNewArr[1];
		
		if(node.tagName =="circle")
		{
			if(this.IsPointInCircle(node,px,py))
				return node;
		}
		else if(node.tagName =="ellipse")
		{
			if(this.IsPointInEllipse(node,px,py))
				return node;
		}
		else if(node.tagName=="line")
		{
			if(this.IsPointInLine(node,px,py))
				return node;
		}
		else if(node.tagName == "polyline")
		{
			if(this.IsPointInPolyline(node,px,py))
				return node;
		}
		else if(node.tagName == "polygon")
		{
			if(this.IsPointInPolygon(node,px,py))
				return node;
		}
		else if(node.tagName == "text")
		{
			if(this.IsPointInBBox(node,px,py))
				return node;	
		}
		else if(node.tagName == "rect" || node.tagName == "image" || node.tagName == "g")
		{
			if(this.IsPointInBBox(node,px,py))
				return node;		
		}
		else if(node.tagName == "g")
		{
			return this.IsPointInInnerShape(event,node);
		}
	}
	return undefined;
	
};

TGlobal.prototype.IsPointInShape = function (event)
{
	var svgnode  = document.getElementById("svgnode");
	var clientrc = svgnode.getBoundingClientRect();
	var gcanvas  = document.getElementById("svgcanvas");
	var matstr   = gcanvas.getAttribute("transform");
	var mat  = new Matrix;
	var rmat = mat.Inverse(matstr);
	var xpos = event.clientX - clientrc.left;
	var ypos = event.clientY - clientrc.top;
	var ptArr = [];
	ptArr.push(xpos);
	ptArr.push(ypos);
	ptArr = mat.caclPoint(rmat,ptArr);
	
	
	var svgContentG = document.getElementById("svgcontent");
	var childNodes = svgContentG.childNodes;
	
	for(var i = childNodes.length-1;i >=0; --i)
	{
		var node = childNodes[i];
		if(node.nodeType != 1)
			continue;
		
		var ptNewArr = [];
		ptNewArr.push(ptArr[0]);
		ptNewArr.push(ptArr[1]);
	
		var strmat = node.getAttribute("transform");
		if(strmat != undefined)
		{
			var mat = new Matrix();
			strmat = mat.Inverse(strmat);
			ptNewArr = mat.caclPoint(strmat,ptArr);
		}
		var px = ptNewArr[0];
		var py = ptNewArr[1];
		
		var canselect = node.getAttribute("canselect");
		if(canselect == "false")
			continue;
		if(node.tagName =="circle")
		{
			if(this.IsPointInCircle(node,px,py))
				return node;
		}
		else if(node.tagName =="ellipse")
		{
			if(this.IsPointInEllipse(node,px,py))
				return node;
		}
		else if(node.tagName=="line")
		{
			if(this.IsPointInLine(node,px,py))
				return node;
		}
		else if(node.tagName == "polyline")
		{
			if(this.IsPointInPolyline(node,px,py))
				return node;
		}
		else if(node.tagName == "polygon")
		{
			if(this.IsPointInPolygon(node,px,py))
				return node;
		}
		else if(node.tagName == "text")
		{
			if(this.IsPointInBBox(node,px,py))
				return node;	
		}
		else if(node.tagName == "rect" || node.tagName == "image" || node.tagName == "g")
		{
			if(this.IsPointInBBox(node,px,py))
				return node;		
		}
	}
	return undefined;
};

TGlobal.prototype.IsPointInFoucsHintShape = function (event,group)
{
	var svgnode  = document.getElementById("svgnode");
	var clientrc = svgnode.getBoundingClientRect();
	var gcanvas  = document.getElementById("svgcanvas");
	var matstr   = gcanvas.getAttribute("transform");
	var mat  = new Matrix;
	var rmat = mat.Inverse(matstr);
	var xpos = event.clientX - clientrc.left;
	var ypos = event.clientY - clientrc.top;
	var ptArr = [];
	ptArr.push(xpos);
	ptArr.push(ypos);
	ptArr = mat.caclPoint(rmat,ptArr);
	
	var px = ptArr[0];
	var py = ptArr[1];
	
	var focusobj = group;
	if(focusobj == undefined || focusobj== null)
		focusobj = document.getElementById("svgfocus");
	
	var retobj = undefined;
	for(var i = 0; i < focusobj.childNodes.length; ++i)
	{
		var childNode = focusobj.childNodes[i];
		if(childNode.tagName == undefined)
			break;
		var hintable = childNode.getAttribute("hintable");
		if(hintable == "yes")
		{
			if(childNode.tagName == "circle")
			{
				if(this.IsPointInCircle(childNode,px,py))
				{
					retobj = childNode;
					break;
				}
			}
			else if(childNode.tagName == "image" ||childNode.tagName == "rect")
			{
				if(this.IsPointInRect(childNode,px,py))
				{
					retobj = childNode;
					break;
				}
			}
			else if(childNode.tagName == "text")
			{
				if(this.IsPointInBBox(childNode,px,py))
				{
					retobj = childNode;
					break;
				}
			}
		}
		retobj = this.IsPointInFoucsHintShape(event,childNode);
		if(retobj!=undefined)
			break;
	}
    return retobj;	
};

TGlobal.prototype.MakeIdString = function ()
{
	var timestamp = Date.parse(new Date());
	timestamp    += counter;
	counter ++;
	return timestamp;
};

TGlobal.prototype.parseFloat3 = function (val)
{
	if(val == undefined || val == null || val=="")
	{
		val = "0";
	}
	var retval = parseInt(parseFloat(val)*100)*1.0/100;;
	return retval;
};

TGlobal.prototype.getNumDecimal = function(val)
{
	if(val != undefined)
	{
		var str = val.toString();
		var strArr = str.split(".");
		if(strArr.length == 2)
		{
			return strArr[1].length;
		}
	}
   return 0;
};

TGlobal.prototype.getCircleRBY3P = function(ptArr6)
{	
   var pt1x = parseFloat(ptArr6[0]);
   var pt1y = parseFloat(ptArr6[1]);
   var pt2x = parseFloat(ptArr6[2]);
   var pt2y = parseFloat(ptArr6[3]);
   var pt3x = parseFloat(ptArr6[4]);
   var pt3y = parseFloat(ptArr6[5]);
   
    var A1, A2, B1, B2, C1, C2, temp;  
    A1 = pt1x - pt2x;  
    B1 = pt1y - pt2y;  
    C1 = (Math.pow(pt1x, 2) - Math.pow(pt2x, 2) + Math.pow(pt1y, 2) - Math.pow(pt2y, 2)) / 2;  
    A2 = pt3x - pt2x;  
    B2 = pt3y - pt2y;  
    C2 = (Math.pow(pt3x, 2) - Math.pow(pt2x, 2) + Math.pow(pt3y, 2) - Math.pow(pt2y, 2)) / 2;  
    temp = A1*B2 - A2*B1;  
	var cx = 0;
	var cy = 0;
	if (temp == 0)
	{  
        cx = pt1x;  
        cy = pt1y;  
    }  
    else
	{  
        cx = (C1*B2 - C2*B1) / temp;  
        cy = (A1*C2 - A2*C1) / temp;  
    }
	var r = Math.sqrt((cx - pt1x)*(cx - pt1x) + (cy - pt1y)*(cy - pt1y));  
	return r;
};

TGlobal.prototype.SplitString = function(str,token)
{
   var ptArr= new Array();
   if(str!=undefined && token != undefined)
   {
	    ptArr = str.split(token);
   }
   return ptArr;
};

TGlobal.prototype.IsNumber = function(text)
{
	if(text == undefined)
		return false;
	var bNum = false;
	for(var i = 0; i < text.length;++i)
	{
		if((text[i] >= 0 && text[i] <= 9) || (text[i] == '-') || (text[i] == '.'))
		{
			bNum = true;
		}
		else
		{
			bNum = false;
			break;
		}
	}
	return bNum;
};

TGlobal.prototype.copyText = function(text) 
{
	var currentFocus = document.activeElement;
	var inputObj = document.getElementById('svgclipboard');
	inputObj.value = text;
	inputObj.focus();
	if (inputObj.setSelectionRange)
	{
		inputObj.setSelectionRange(0, inputObj.value.length);
	}
	else 
	{
		inputObj.select();
	}
	try 
	{
		var flag = document.execCommand("copy");
	} 
	catch (eo) 
	{
		var flag = false;
	}
	currentFocus.focus();
	return flag;
};

TGlobal.prototype.pasteText = function() 
{
	var currentFocus = document.activeElement;
	var inputObj = document.getElementById('svgclipboard');
	inputObj.value = "ABC";
	inputObj.focus();
	
	inputObj.addEventListener("paste", function (e){
    if ( !(e.clipboardData && e.clipboardData.items) ) 
	{
        return ;
    }

    for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
        var item = e.clipboardData.items[i];

        if (item.kind === "string") {
            item.getAsString(function (str) {
                alert(str);
            })
        } else if (item.kind === "file") {
         
        }
    }
	});

	currentFocus.focus();
	return inputObj.value;
	
};

TGlobal.prototype.GetYYYYmmDDHHMMString = function(dt) 
{
	var nmonth = dt.getMonth()+1;
	var nday = dt.getDate();
	var nhour = dt.getHours();
	var nmin = dt.getMinutes();
	if(nmonth <= 9)
	{
	   nmonth = "0" + nmonth;
	}
	if(nday <= 9)
	{
	   nday = "0" + nday;
	}
	if(nhour <= 9)
	{
	   nhour = "0" + nhour;
	}
	if(nmin <= 9)
	{
	   nmin = "0" + nmin;
	}
	
	var str = dt.getFullYear();	
	str += "-";
	str += nmonth;
	str += "-";
	str += nday;
	str += " ";
	str += nhour;
	str += ":";
	str += nmin;
	return str;	
};

TGlobal.prototype.getNodeAllMatrix = function(svgobj)
{
	var strmat = "";
	if(svgobj == undefined || svgobj.nodeType != 1)
		return strmat;
	var svgNode = svgobj;
	while(svgNode.parentNode != undefined)
	{
		if(svgNode.nodeType == 1)
		{			
			var nNodeId = svgNode.getAttribute("id");			
			if(nNodeId == "svgcanvas")
			{
				break;
			}
			var strtrans = svgNode.getAttribute("transform");
			if(strtrans != undefined)
			{
				strmat = strtrans + strmat;
			}		
			svgNode = svgNode.parentNode;
		}
		else
		{
			break;
		}		
	}
	var mat = new Matrix();
	var matArr = mat.getTransform(strmat);
	strmat = mat.getAsString(matArr);
	return strmat;	
};

TGlobal.prototype.checkFull = function()
{
	var isFull =  document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
	if(isFull === undefined) 
		isFull = false;
	return isFull;
};

TGlobal.prototype.OnFullScreenClick = function()
{  
    if (!document.fullscreenElement 
	     &&!document.mozFullScreenElement 
		 && !document.webkitFullscreenElement) 
	{
        if (document.documentElement.requestFullscreen) 
		{  
            document.documentElement.requestFullscreen();  
        } 
		else if (document.documentElement.mozRequestFullScreen) 
		{  
            document.documentElement.mozRequestFullScreen();  
        } 		
		else if (document.documentElement.webkitRequestFullscreen)
		{  
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);  
        }  
    }
	else 
	{  
        if (document.cancelFullScreen)
		{  
            document.cancelFullScreen();  
        }
		else if (document.mozCancelFullScreen)
		{  
            document.mozCancelFullScreen();  
        }
		else if (document.webkitCancelFullScreen) 
		{  
            document.webkitCancelFullScreen();  
        }  
    }  
};

TGlobal.prototype.resetToolClr = function()
{
	var tdstrokeobj = document.getElementById("curstroke");
	if(tdstrokeobj != undefined)
	{
	   tdstrokeobj.setAttribute("bgcolor",strokeclr);
	}
	
	var tdfillobj = document.getElementById("curfill");
	if(tdfillobj != undefined)
	{
	   tdfillobj.setAttribute("bgcolor",fillclr);
	}
};


TGlobal.prototype.onstrokeclr= function(tdobj)
{
    var bgclr = tdobj.getAttribute("bgcolor");
	if(bgclr != undefined)
	{
		strokeclr = bgclr;
	}
	resetToolClr();
};

TGlobal.prototype.onfillclr= function(tdobj)
{
    var bgclr = tdobj.getAttribute("bgcolor");
	if(bgclr != undefined)
	{
		fillclr = bgclr;
	}
	resetToolClr();
};

TGlobal.prototype.createLine= function(ptx1,pty1,ptx2,pty2,clr)
{
	var lineobj =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	lineobj.setAttribute("x1",ptx1);
	lineobj.setAttribute("y1",pty1);
	lineobj.setAttribute("x2",ptx2);
	lineobj.setAttribute("y2",pty2);	
	lineobj.setAttribute("stroke",clr);
	lineobj.setAttribute("stroke-width",2);
	lineobj.setAttribute("stroke-opacity","1");
	return lineobj;
};

TGlobal.prototype.createCursor= function(type)
{
	if(type == "arrow")
	{
		this.createArrowCursor();
	}
	else if(type =="open")
	{
		this.createOpenHandCursor();
	}
	else if(type == "cross")
	{
		this.createCrossCursor();
	}
	else if(type == "close")
	{
		this.createCloseHandCursor();
	}
	else if(type == "move")
	{
		this.createMoveCursor();
	}
	else if(type == "text")
	{
		this.createTextCursor();
	}
	else 
	{
		this.createCursorByType(type);
	}
};

TGlobal.prototype.createCrossCursor= function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	while(cursorObj.firstChild) 
	{
        cursorObj.removeChild(cursorObj.firstChild);
	}
	cursorObj.setAttribute("visibility","visible");
	var line1 = this.createLine("-10","0","10","0","#000000");
	cursorObj.appendChild(line1);
	var line2 = this.createLine("0","-10","0","10","#000000");
	cursorObj.appendChild(line2);

	var line3 = this.createLine("-10","2","-2","2","#FFFFFF");
	cursorObj.appendChild(line3);
	var line4 = this.createLine("2","2","10","2","#FFFFFF");
	cursorObj.appendChild(line4);
	var line5 = this.createLine("2","-10","2","-2","#FFFFFF");
	cursorObj.appendChild(line5);
	var line6 = this.createLine("2","2","2","10","#FFFFFF");
	cursorObj.appendChild(line6);
	
	var handcur = "url('"+currurlpath + "/cursor/draw.ico'),default";
	var svgnode = document.getElementById("svgnode");
	svgnode.setAttribute("cursor",handcur);
	
	lstcurtype = "cross";
};

TGlobal.prototype.createArrowCursor= function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	cursorObj.setAttribute("visibility","hidden");
	var svgnode = document.getElementById("svgnode");
    svgnode.setAttribute("cursor","");
	lstcurtype = "arrow";
};

TGlobal.prototype.createTextCursor= function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	cursorObj.setAttribute("visibility","hidden");
	var svgnode = document.getElementById("svgnode");
    svgnode.setAttribute("cursor","text");
	lstcurtype = "text";
};

TGlobal.prototype.createOpenHandCursor = function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	cursorObj.setAttribute("visibility","hidden");
	var svgnode = document.getElementById("svgnode");
    var handcur = "url('"+currurlpath + "/cursor/hand_open.ico'),default";
	svgnode.setAttribute("cursor",handcur);
	lstcurtype = "open";
};

TGlobal.prototype.createCloseHandCursor= function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	cursorObj.setAttribute("visibility","hidden");
	var svgnode = document.getElementById("svgnode");
    var handcur = "url('"+currurlpath + "/cursor/hand_close.ico'),default";
	svgnode.setAttribute("cursor",handcur);
	lstcurtype = "close";
};

TGlobal.prototype.createMoveCursor= function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	cursorObj.setAttribute("visibility","hidden");
	var svgnode = document.getElementById("svgnode");
	svgnode.setAttribute("cursor","move");
	lstcurtype = "move";
};

TGlobal.prototype.createSizeEWCursor= function()
{
	var cursorObj = document.getElementById("svgdrawcursor");
	cursorObj.setAttribute("visibility","hidden");
	var svgnode = document.getElementById("svgnode");
	svgnode.setAttribute("cursor","e-resize");
	lstcurtype = "sizeew";
};

TGlobal.prototype.createCursorByType= function(type)
{
	if(type != undefined)
	{
		var cursorObj = document.getElementById("svgdrawcursor");
		cursorObj.setAttribute("visibility","hidden");
		var svgnode = document.getElementById("svgnode");
		if(type == "e-resize" || type == "w-resize")
		{
			var curtype = "url('"+currurlpath + "/cursor/leftright.cur'),default";
			svgnode.setAttribute("cursor",curtype);
		}
		else if( type=="s-resize" || type=="n-resize")
		{
			var curtype = "url('"+currurlpath + "/cursor/topbottom.cur'),default";
			svgnode.setAttribute("cursor",curtype);
		}
		else if(type=="nw-resize" || type=="se-resize")
		{
			var curtype = "url('"+currurlpath + "/cursor/lefttop.cur'),default";
			svgnode.setAttribute("cursor",curtype);
		}
		else if(type=="ne-resize" || type=="sw-resize")
		{
			var curtype = "url('"+currurlpath + "/cursor/rightbottom.cur'),default";
			svgnode.setAttribute("cursor",curtype);
		}
		else if(type == "movepoint")
		{
			var curtype = "url('"+currurlpath + "/cursor/movepoint.cur'),default";
			svgnode.setAttribute("cursor",curtype);
		}
		else
		{
			svgnode.setAttribute("cursor",type);
		}
		lstcurtype = type;
	}
}

TGlobal.prototype.setCursorPos= function(event)
{
	var svgnode = document.getElementById("svgnode");
	var clientrc = svgnode.getBoundingClientRect();
	var gcanvas = document.getElementById("svgcanvas");	
	var xpos = event.clientX - clientrc.left;
	var ypos = event.clientY - clientrc.top;
	var cursorObj = document.getElementById("svgdrawcursor");
	var strmat = "translate("+xpos+","+ypos+")";
	cursorObj.setAttribute("transform",strmat);
};

TGlobal.prototype.MoveShape= function(shapeobj,offsetx,offsety)
{
	if(shapeobj != undefined)
	{
		if(shapeobj.tagName == undefined)
			return;
		var strmat = shapeobj.getAttribute("transform");
		var tywidgettype = shapeobj.getAttribute("tywidgettype");
		if(strmat != undefined && strmat != null && strmat.length > 0)
		{
			matobj.Translate(shapeobj,offsetx,offsety);
			return;
		}
		if(tywidgettype != undefined && tywidgettype.length > 0)
		{
			matobj.Translate(shapeobj,offsetx,offsety);
			return;
		}
		if(shapeobj.tagName == "line")
		{
			var x1 = shapeobj.getAttribute("x1");
			var y1 = shapeobj.getAttribute("y1");
			var x2 = shapeobj.getAttribute("x2");
			var y2 = shapeobj.getAttribute("y2");
			var newx1= parseFloat(x1) + offsetx;
			var newy1= parseFloat(y1) + offsety;
			var newx2= parseFloat(x2) + offsetx;
			var newy2= parseFloat(y2) + offsety;
			shapeobj.setAttribute("x1",newx1);
			shapeobj.setAttribute("y1",newy1);
			shapeobj.setAttribute("x2",newx2);
			shapeobj.setAttribute("y2",newy2);
		}
		else if(shapeobj.tagName == "circle" || shapeobj.tagName == "ellipse")
		{
			var cx = shapeobj.getAttribute("cx");
			var cy = shapeobj.getAttribute("cy");
			var newcx= parseFloat(cx) + offsetx;
			var newcy= parseFloat(cy) + offsety;
			shapeobj.setAttribute("cx",newcx);
			shapeobj.setAttribute("cy",newcy);
		}
		else if(shapeobj.tagName == "text" || shapeobj.tagName == "rect" || shapeobj.tagName == "image")
		{
			var x = shapeobj.getAttribute("x");
			var y = shapeobj.getAttribute("y");
			var newx= parseFloat(x) + offsetx;
			var newy= parseFloat(y) + offsety;
			shapeobj.setAttribute("x",newx);
			shapeobj.setAttribute("y",newy);
		}
		else if(shapeobj.tagName == "polyline" || shapeobj.tagName == "polygon")
		{
			var points = shapeobj.getAttribute("points");
			var str = points.replace(/ /g, ',');
			var strs= new Array();
			strs=str.split(",");
			var newstr = "";
			for(var i = 0; i < strs.length; i+=2)
			{
				var x = parseFloat(strs[i]);
				var y = parseFloat(strs[i+1]);
				var newx= parseFloat(x) + offsetx;
				var newy= parseFloat(y) + offsety;
				if(i != 0)
					newstr +=",";
				newstr += newx;
				newstr += ",";
				newstr += newy;														    
			}
			shapeobj.setAttribute("points",newstr);
		}
		else if(shapeobj.tagName == "path")
		{
			matobj.Translate(shapeobj,offsetx,offsety);
			return;
		}
		for(var i = 0; i < shapeobj.childNodes.length; ++i)
		{
			this.MoveShape(shapeobj.childNodes[i],offsetx,offsety);
		}
	}	
};



