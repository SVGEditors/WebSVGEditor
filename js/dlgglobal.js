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
 
function TDlgGlobal()
{
};

TDlgGlobal.prototype.OnFinishColorSelect2 = function(oBjId,clr)
{
	var tdObj = document.getElementById(oBjId);
	if(tdObj != undefined)
	{
		tdObj.setAttribute("bgcolor",clr);
	}
	this.OnFinishBlock2();
};

TDlgGlobal.prototype.OnFinishColorSelect3 = function(oBjId,clr)
{
	var tdObj = document.getElementById(oBjId);
	if(tdObj != undefined)
	{
		tdObj.setAttribute("bgcolor",clr);
	}
	this.OnFinishBlock3();
};

TDlgGlobal.prototype.OnFinishBlock = function()
{
	var backcoverobj = document.getElementById("idbackcover");
	backcoverobj.style.display = "none";
	var blocksettingobj = document.getElementById("idblocksetting");
	blocksettingobj.style.display = "none";
	blocksettingobj.innerHTML = "";
};

TDlgGlobal.prototype.OnFinishBlock2 = function()
{
	var backcoverobj = document.getElementById("idbackcover2");
	backcoverobj.style.display = "none";
	var blocksettingobj = document.getElementById("idblocksetting2");
	blocksettingobj.style.display = "none";
	blocksettingobj.innerHTML = "";
};

TDlgGlobal.prototype.OnFinishBlock3 = function()
{
	var backcoverobj = document.getElementById("idbackcover3");
	backcoverobj.style.display = "none";
	var blocksettingobj = document.getElementById("idblocksetting3");
	blocksettingobj.style.display = "none";
	blocksettingobj.innerHTML = "";
};

TDlgGlobal.prototype.SetCheck = function(checkid)
{
	var checkObj = document.getElementById(checkid);
	if(checkObj != undefined)
	{
		checkObj.checked = true;
	}
};

TDlgGlobal.prototype.SetUnCheck = function(checkid)
{
	var checkObj = document.getElementById(checkid);
	if(checkObj != undefined)
	{
		checkObj.checked = false;
	}
};

TDlgGlobal.prototype.AddPopDragTitle3 = function(blocksettingobj,title)
{
	var strText = blocksettingobj.innerHTML;
	var strdiv = "<div tyname='titlebar' blockid='idblocksetting3' style='width:100%;background-color:#4D6082;color:#FFF;height:24px;float:top;'><span style='display:inline-block;margin-top:2px;margin-left:15px'>";
	strdiv += title;
	strdiv += "</span><button align='left' onclick='clsdlgglobal.OnFinishBlock3()' style='float:right;margin-top:2px;margin-right:2px;width:20px;height:20px;background:url(\"image/tdclose.png\")'></button></div>";
	strdiv += strText;
	blocksettingobj.innerHTML = strdiv;
};

TDlgGlobal.prototype.GetColorPickerDlgStr2 = function(oBjId)
{
	var str = "<table  cellpadding='0' cellspacing='0' class='Colortb' style='margin-left:8px;margin-top:5px;'>\
		<tr>\
			<td bgcolor='#000000' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#000000\")'></td>\
			<td bgcolor='#A52A00' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#A52A00\")'></td>\
			<td bgcolor='#004040' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#004040\")'></td>\
			<td bgcolor='#005500' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#005500\")'></td>\
			<td bgcolor='#00005E' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#00005E\")'></td>\
			<td bgcolor='#00008B' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#00008B\")'></td>\
			<td bgcolor='#4B0082' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#4B0082\")'></td>\
			<td bgcolor='#282828' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#282828\")'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#8B0000' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#8B0000\")'></td>\
			<td bgcolor='#FF6820' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FF6820\")'></td>\
			<td bgcolor='#8B8B00' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#8B8B00\")'></td>\
			<td bgcolor='#009300' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#009300\")'></td>\
			<td bgcolor='#388E8E' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#388E8E\")'></td>\
			<td bgcolor='#0000FF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#0000FF\")'></td>\
			<td bgcolor='#7B7BC0' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#7B7BC0\")'></td>\
			<td bgcolor='#666666' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#666666\")'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#FF0000' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FF0000\")'></td>\
			<td bgcolor='#FFAD5B' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFAD5B\")'></td>\
			<td bgcolor='#32CD32' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#32CD32\")'></td>\
			<td bgcolor='#3C8371' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#3C8371\")'></td>\
			<td bgcolor='#33CCCC' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#33CCCC\")'></td>\
			<td bgcolor='#7D9EC0' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#7D9EC0\")'></td>\
			<td bgcolor='#800080' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#800080\")'></td>\
			<td bgcolor='#7F7F7F' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#7F7F7F\")'></td>\
		</tr>\
		<tr>\
			<td bgcolor='#FFC0CB' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFC0CB\")'></td>\
			<td bgcolor='#FFD700' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFD700\")'></td>\
			<td bgcolor='#FFFF00' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFFF00\")'></td>\
			<td bgcolor='#00FF00' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#00FF00\")'></td>\
			<td bgcolor='#00FFFF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#00FFFF\")'></td>\
			<td bgcolor='#00CCFF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#00CCFF\")'></td>\
			<td bgcolor='#EA8066' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#EA8066\")'></td>\
			<td bgcolor='#C0C0C0' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#C0C0C0\")'></td>\
		</tr>	\
		<tr>\
			<td bgcolor='#FFE4E1' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFE4E1\")'></td>\
			<td bgcolor='#FFFE99' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFFE99\")'></td>\
			<td bgcolor='#FFFFE0' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFFFE0\")'></td>\
			<td bgcolor='#99FF99' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#99FF99\")'></td>\
			<td bgcolor='#CCFFFF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#CCFFFF\")'></td>\
			<td bgcolor='#99CCFF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#99CCFF\")'></td>\
			<td bgcolor='#CC99FF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#CC99FF\")'></td>\
			<td bgcolor='#FFFFFF' bgopacity='1' onclick='OnFinishColorSelect2(this,\"#FFFFFF\")'></td>\
		</tr>\
		<tr><td colspan='8' align='center' onclick='clsdlgglobal.OnFinishBlock2()'>关闭</td></tr>\
		</table>";
		var newstr = "OnFinishColorSelect2(\"" + oBjId+ "\"";
		str = str.replace(/OnFinishColorSelect2\(this/g,newstr);
	return str;	
};

TDlgGlobal.prototype.PopColorSelect = function(clickObj)
{
	var nleft = 0;
	var ntop = 0;
	var ObjId = "";
	if(clickObj != undefined)
	{
		 var oRect = clickObj.getBoundingClientRect();
		 nleft = oRect.left;
		 ntop = oRect.top +oRect.height;
		 ObjId = clickObj.getAttribute("id");
	}
    var backcoverobj = document.getElementById("idbackcover2");
	backcoverobj.style.display = "block";
	var blocksettingobj = document.getElementById("idblocksetting2");
	blocksettingobj.style.display = "block";
	blocksettingobj.style.left = nleft + "px";
	blocksettingobj.style.top = ntop + "px";
	blocksettingobj.style.width = "140px";
	blocksettingobj.style.height = "110px";
	blocksettingobj.innerHTML = this.GetColorPickerDlgStr2(ObjId);
};

TDlgGlobal.prototype.PopColorSelect3 = function(clickObj)
{
	var nleft = 0;
	var ntop = 0;
	var ObjId = "";
	if(clickObj != undefined)
	{
		 var oRect = clickObj.getBoundingClientRect();
		 nleft = oRect.left;
		 ntop = oRect.top +oRect.height;
		 ObjId = clickObj.getAttribute("id");
	}
    var backcoverobj = document.getElementById("idbackcover3");
	backcoverobj.style.display = "block";
	var blocksettingobj = document.getElementById("idblocksetting3");
	blocksettingobj.style.display = "block";
	blocksettingobj.style.left = nleft + "px";
	blocksettingobj.style.top = ntop + "px";
	blocksettingobj.style.width = "140px";
	blocksettingobj.style.height = "110px";
	var strText = GetColorPickerDlgStr2(ObjId);
	strText = strText.replace(/OnFinishBlock2/g,"OnFinishBlock3");
	strText = strText.replace(/OnFinishColorSelect2/g,"OnFinishColorSelect3");
	blocksettingobj.innerHTML = strText;
};

