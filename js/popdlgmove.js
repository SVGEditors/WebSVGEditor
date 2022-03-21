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
 
function TPopDlgMove()
{
	this.downpos = {};
	this.downpos.x = 0;
	this.downpos.y = 0;
    this.mouseDown = false;
};

TPopDlgMove.prototype.Init = function()
{
	var blocksettingobj = document.getElementById("idblocksetting");
	blocksettingobj.addEventListener("mousedown",this,false);
	blocksettingobj.addEventListener("mousemove",this,false);
	blocksettingobj.addEventListener("mouseup",this,false);
	
	var blocksettingobj2 = document.getElementById("idblocksetting2");
	blocksettingobj2.addEventListener("mousedown",this,false);
	blocksettingobj2.addEventListener("mousemove",this,false);
	blocksettingobj2.addEventListener("mouseup",this,false);
	
	var blocksettingobj2 = document.getElementById("idblocksetting3");
	idblocksetting3.addEventListener("mousedown",this,false);
	idblocksetting3.addEventListener("mousemove",this,false);
	idblocksetting3.addEventListener("mouseup",this,false);
};

TPopDlgMove.prototype.handleEvent = function(evt) 
{
	   if (evt.type == "mousedown") 
		{
		    document.documentElement.addEventListener("mousemove",this,false);
            document.documentElement.addEventListener("mouseup",this,false);
	        this.downpos.x = evt.clientX;
			this.downpos.y = evt.clientY;
			this.blocksetingid = "";
				
			var name = evt.target.getAttribute("tyname");
			if(name == "titlebar")
			{
			   this.mouseDown = true;
			   this.blocksetingid = evt.target.getAttribute("blockid");
			}
		}
		else if(evt.type == "mouseup")
		{
		   this.downpos.x = 0;
		   this.downpos.y = 0;
		   this.mouseDown = false;
		}
		else if(evt.type == "mousemove")
		{
		    if(this.mouseDown)
			{
			    var offsetx = evt.clientX - this.downpos.x;
				var offsety = evt.clientY - this.downpos.y;
				var blocksettingobj = document.getElementById(this.blocksetingid);				
				var strLeft = blocksettingobj.style.left;
				strLeft = strLeft.replace("px","");
				var nLeft = parseInt(strLeft) + offsetx;
				var newstrLeft = nLeft.toString() + "px";
				
				var strTop = blocksettingobj.style.top;
				strTop = strTop.replace("px","");
				var nTop = parseInt(strTop) + offsety;
				var newstrTop = nTop.toString() + "px";
				
				blocksettingobj.style.left = newstrLeft;
				blocksettingobj.style.top = newstrTop;				
				this.downpos.x = evt.clientX;
		        this.downpos.y = evt.clientY;
			}		    
		}
};

