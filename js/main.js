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
 
var bshowrule     = true;
var bshowgrid     = true;
var strokeclr     = "#000000";
var fstrokepacity = "1";
var fillclr       = "#FFFFFF";
var ffillopacity  = "0";
var gfontname     = "宋体";
var gfontsize     = "12pt";
var gstrokewidth  = "1";
var gstroketype   = "";
var lstcurtype    = "arrow";

var nowcommand    = "";
var currurlpath   = "";
var eventInst     = undefined;
var svgFileArr    = [];
var htmlFileArr   = [];

var EditToolObj      = undefined;
var movetool         = new MoveTool();
var zoomtool         = new ZoomTool();
var drawAssist       = new DrawAssist();
var clsglobal        = new TGlobal();
var clsdlgglobal     = new TDlgGlobal();
var clscanvas        = new TCanvas();
var matobj           = new Matrix();
var clspopdlgmove    = new TPopDlgMove();
var clsmainframe     = new TMainframe();
var clsmessagelisten = new TMessageListener();
var messmage         = undefined;
var currentFileIndex = -1;
var counter = 0;
var bModify          = false;

var focuslineopacity = 0.5;
var focuslinedash   = "4 4";
var markdis         = 40;
var gActionHistory  = new ActionTool();

var gselectNodeInner      = undefined;
var gselectNode           = undefined;
var gselectOneNode        = undefined;
var gselectNodes          = [];
var gselectFocusHintShape = undefined;
var nGraphicIndexID = 0;
var vcVarMap = [];

window.onresize = function()
{
	clscanvas.resetcanvas();
};

window.onload = function()
{
   var curPageUrl = window.document.location.href;
   var lstpos = curPageUrl.lastIndexOf("/");
   currurlpath = curPageUrl.substr(0,lstpos);
   clsglobal.resetToolClr();	
   clscanvas.resetcanvas();
  
   clspopdlgmove.Init();
   clsmessagelisten.Init();
   
   document.addEventListener("paste", function (e)
   {
	var cbd = e.clipboardData;
    var ua = window.navigator.userAgent;
    if ( !(e.clipboardData && e.clipboardData.items) ) 
	{
        return;
    }    
    if(cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
        cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
        ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49){
        return;
    }

    for(var i = 0; i < cbd.items.length; i++) {
        var item = cbd.items[i];
        if(item.kind == "file"){
            var blob = item.getAsFile();
            if (blob.size === 0) {
                return;
            }
        }
		else if(item.kind == "string")
		{
			item.getAsString(function (s)
			{
				PasteText(s);
			});
		}
    }
}, false);
};






























