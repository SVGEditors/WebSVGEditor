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


function ActionCompose()
{
   this.Actions = [];
};

ActionCompose.prototype.Undo = function()
{
   for(var i = 0; i < this.Actions.length;++i)
   {
	   this.Actions[i].Undo();
   }
};

ActionCompose.prototype.Redo = function()
{
  for(var i = 0; i < this.Actions.length;++i)
   {
	   this.Actions[i].Redo();
   }
};

ActionCompose.prototype.Add = function(action)
{
  this.Actions.push(action);
};


function ActionAdd(svgObj)
{
   this.svgObjParent = svgObj.parentNode;
   this.svgObj = svgObj;
};

ActionAdd.prototype.Undo = function()
{
	this.svgObjParent.removeChild(this.svgObj);
};

ActionAdd.prototype.Redo = function()
{
	this.svgObjParent.appendChild(this.svgObj);
};







function ActionDel(svgObj)
{
   this.svgObjParent = svgObj.parentNode;
   this.svgObj = svgObj;
   this.svgNextSibling = this.svgObj.nextSibling;
};

ActionDel.prototype.Undo = function()
{
	if(this.svgNextSibling != undefined)
	{
		this.svgObjParent.insertBefore(this.svgObj,this.svgNextSibling);
	}
	else
	{
		this.svgObjParent.appendChild(this.svgObj);
	}
};
ActionDel.prototype.Redo = function()
{
     this.svgObjParent.removeChild(this.svgObj);
};








function ActionAttr(svgObj)
{
   this.svgObj = svgObj;
   this.attrnames = [];
   this.oldvalues = [];  
   this.newvalues = [];
};

ActionAttr.prototype.AddAttr = function(attrname)
{
   this.attrnames.push(attrname);
   var attrval = this.svgObj.getAttribute(attrname);
   if(attrval == undefined)
   {
	   attrval = "";
   }
   this.oldvalues.push(attrval);
   this.newvalues.push(attrval);
};

ActionAttr.prototype.EndValue = function()
{
   for(var i = 0; i < this.attrnames.length;++i)
   {
	    var attrval = this.svgObj.getAttribute(this.attrnames[i]);
		if(attrval == undefined)
		{
			attrval = "";
		}
       this.newvalues[i] = attrval;
   }
};

ActionAttr.prototype.Undo = function()
{
   for(var i = 0; i < this.attrnames.length;++i)
   {
	   this.svgObj.setAttribute(this.attrnames[i],this.oldvalues[i]);
   }
};
ActionAttr.prototype.Redo = function()
{
   for(var i = 0; i < this.attrnames.length;++i)
   {
	   this.svgObj.setAttribute(this.attrnames[i],this.newvalues[i]);
   }
};







function ActionGroup(parentNode)
{
	this.svgObjParent      = parentNode;
	this.childnodes        = [];
	this.childNextSiblings = [];
	this.gnode = undefined;
};

ActionGroup.prototype.AddChild = function(childnode)
{
	this.childnodes.push(childnode);
	this.childNextSiblings.push(childnode.nextSibling);
};

ActionGroup.prototype.AddG = function(gnode)
{
	this.gnode = gnode;
};

ActionGroup.prototype.Undo = function()
{
	gselectNodes = [];	
	for(var i = 0; i < this.childNextSiblings.length;++i)
	{
		if(this.childNextSiblings[i] != undefined)
		{
			this.svgObjParent.insertBefore(this.childnodes[i],this.childNextSiblings[i]);
		}
		else
		{
			this.svgObjParent.appendChild(this.childnodes[i]);
		}
		gselectNodes.push(this.childnodes[i]);
	}
};
ActionGroup.prototype.Redo = function()
{
    for(var i = 0; i <this.childnodes.length;++i)
	{
	   this.gnode.appendChild(this.childnodes[i]);
	}
	gselectNodes = [];
	gselectNodes.push(this.gnode);
	gselectNode = this.gnode;
};






function ActionUnGroup(gNode)
{
   this.gNode = gNode;
   this.gNextSibling = this.gNode.nextSibling;
   this.svgObjParent = this.gNode.parentNode;
   this.childNodes = [];
   for(var i = 0; i < this.gNode.childNodes.length;++i)
   {
	   if(this.gNode.childNodes[i].nodeType == 1)
	   {
		   this.childNodes.push(this.gNode.childNodes[i]);
	   }
   }
};

ActionUnGroup.prototype.Undo = function()
{
	if(this.gNextSibling != undefined)
	{
		this.svgObjParent.insertBefore(this.gNode,this.gNextSibling);
	}
	else
	{
		this.svgObjParent.appendChild(this.gNode);
	}
	for(var i = 0; i < this.childNodes.length;++i)
	{
		this.gNode.appendChild(this.childNodes[i]);
	}
	gselectNodes = [];
	gselectNodes.push(this.gNode);
};
ActionUnGroup.prototype.Redo = function()
{
    if(this.gNextSibling != undefined)
	{
		for(var i = this.childNodes.length-1; i >= 0; --i)
		{
		   this.svgObjParent.insertBefore(this.childNodes[i],this.gNextSibling);
		}
	}
	else
	{
		for(var i = 0; i < this.childNodes.length; ++i)
		{
		   this.svgObjParent.appendChild(this.childNodes[i]);
		}		
	}
	gselectNodes = [];
	for(var i = 0; i < this.childNodes.length; ++i)
	{
		gselectNodes.push(this.childNodes[i]);
	}
};







function ActionLayTop(svgObj)
{
   this.svgObj = svgObj;
   this.gNextSibling = this.svgObj.nextSibling;
   this.svgObjParent = this.svgObj.parentNode;
};

ActionLayTop.prototype.Undo = function()
{
	if(this.gNextSibling != undefined)
	{
		this.svgObjParent.insertBefore(this.svgObj,this.gNextSibling);
	}
	else
	{
		this.svgObjParent.appendChild(this.svgObj);
	}
};

ActionLayTop.prototype.Redo = function()
{
	this.svgObjParent.appendChild(this.svgObj);
};






function ActionLayBottom(svgObj)
{
   this.svgObj = svgObj;
   this.gNextSibling = this.svgObj.nextSibling;
   this.svgObjParent = this.svgObj.parentNode;
};

ActionLayBottom.prototype.Undo = function()
{
	if(this.gNextSibling != undefined)
	{
		this.svgObjParent.insertBefore(this.svgObj,this.gNextSibling);
	}
	else
	{
		this.svgObjParent.appendChild(this.svgObj);
	}
};

ActionLayBottom.prototype.Redo = function()
{
	if(this.svgObjParent.childNodes.length > 0)
	{
		this.svgObjParent.insertBefore(this.svgObj,this.svgObjParent.childNodes[0]);
	}
	else
	{
		this.svgObjParent.appendChild(this.svgObj);
	}
};


function ActionTool()
{
  this.Actions = [];
  this.nPos = 0;
};

ActionTool.prototype.clearAll = function()
{
	this.Actions = [];
	this.nPos = 0;
};

ActionTool.prototype.Add = function(action)
{
    if(this.nPos > 0 && this.Actions.length > this.nPos)
	{
	   this.Actions.splice(this.nPos,this.Actions.length-this.nPos);
	}
	this.Actions.push(action);
	this.nPos = this.Actions.length;
};

ActionTool.prototype.Undo = function()
{
	if(this.nPos <= 0 || this.nPos - 1 > this.Actions.length)
		return;
	this.nPos--;
	this.Actions[this.nPos].Undo();
	clsmainframe.ResetAllFocus();
};

ActionTool.prototype.Redo = function()
{
    if (this.nPos < 0 || this.nPos >= this.Actions.length)
		return;
	this.Actions[this.nPos].Redo();
	this.nPos ++;
	clsmainframe.ResetAllFocus();
};
