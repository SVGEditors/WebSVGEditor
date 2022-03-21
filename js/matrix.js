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
 
function Matrix()
{
    this.array = new Array();
    this.array.push(1);
    this.array.push(0);
    this.array.push(0);
    this.array.push(1);
    this.array.push(0);
    this.array.push(0);
};

Matrix.prototype.NewcaclPoint = function(mat, pt){
    var matData;
	if (mat instanceof Array)
	{
	    matData = mat;
	}
    else
	{
        matData = this.getTransform(mat);
    }
    var retpt = {};
    retpt.x = eval(matData[0] * pt.x + matData[2] * pt.y + matData[4]);
    retpt.y = eval(matData[1] * pt.x + matData[3] * pt.y + matData[5]);
	return retpt;
};

Matrix.prototype.caclPoint = function(mat, pt){
    var matData;
	if (mat instanceof Array)
	{
	    matData = mat;
	}
    else
	{
        matData = this.getTransform(mat);
    }
    var retpt = new Array();
    retpt.push(eval(matData[0] * pt[0] + matData[2] * pt[1] + matData[4]));
    retpt.push(eval(matData[1] * pt[0] + matData[3] * pt[1] + matData[5]));
		
	return retpt;
};

Matrix.prototype.mapPoint = function(node, x, y)
{
	var strmat = node.getAttribute("transform");
	var ptArr = [];
	ptArr.push(x);
	ptArr.push(y);
	return this.caclPoint(strmat,ptArr);
};

Matrix.prototype.rmapPoint = function(node, x, y)
{
	var strmat = node.getAttribute("transform");
	strmat = this.Inverse(strmat);
	var ptArr = [];
	ptArr.push(x);
	ptArr.push(y);
	return this.caclPoint(strmat,ptArr);
};

Matrix.prototype.caclBBox = function(node)
{
	var strmat = node.getAttribute("transform");
	var bbox = node.getBBox();	
	var mat = this.getTransform(strmat);
	
	var pt1 = [];
	pt1.push(bbox.x);
	pt1.push(bbox.y);
	var retArr1 = this.caclPoint(mat,pt1);
	
	var pt2 = [];
	pt2.push(bbox.x+bbox.width);
	pt2.push(bbox.y);
	var retArr2 = this.caclPoint(mat,pt2);
	
	var pt3 = [];
	pt3.push(bbox.x+bbox.width);
	pt3.push(bbox.y+bbox.height);
	var retArr3 = this.caclPoint(mat,pt3);
	
	var pt4 = [];
	pt4.push(bbox.x);
	pt4.push(bbox.y+bbox.height);
	var retArr4 = this.caclPoint(mat,pt4);
	
	var x1 = Math.min(Math.min(Math.min(parseFloat(retArr1[0]),parseFloat(retArr2[0])),parseFloat(retArr3[0])),parseFloat(retArr4[0]));
	var x2 = Math.max(Math.max(Math.max(parseFloat(retArr1[0]),parseFloat(retArr2[0])),parseFloat(retArr3[0])),parseFloat(retArr4[0]));
	var y1 = Math.min(Math.min(Math.min(parseFloat(retArr1[1]),parseFloat(retArr2[1])),parseFloat(retArr3[1])),parseFloat(retArr4[1]));
	var y2 = Math.max(Math.max(Math.max(parseFloat(retArr1[1]),parseFloat(retArr2[1])),parseFloat(retArr3[1])),parseFloat(retArr4[1]));
	
	var rectbox = new Array();
	rectbox.push(x1);
	rectbox.push(y1);
	rectbox.push(x2-x1);
	rectbox.push(y2-y1);
	return rectbox;
};

Matrix.prototype.Translate = function(node,x,y)
{
	var strmat = node.getAttribute("transform");
	var strnewmat = "translate("+x+","+y+")"+strmat;
	var matArr = this.getTransform(strnewmat);
	strnewmat = this.getAsString(matArr);
	node.setAttribute("transform",strnewmat);
};

Matrix.prototype.getAsString = function(matArr)
{
  var str = "matrix(" + matArr[0].toFixed(6)+ "," + matArr[1].toFixed(6)+ "," + matArr[2].toFixed(6)+ "," + matArr[3].toFixed(6)+ "," + matArr[4].toFixed(6)+ "," + matArr[5].toFixed(6)+ ")";
  return str;   
};

Matrix.prototype.caclMatrix = function(matData1,matData2)
{
    var returnArr = new Array();
	returnArr.push(matData1[0]*matData2[0] + matData1[2]*matData2[1]);
	returnArr.push(matData1[1]*matData2[0] + matData1[3]*matData2[1]);
	returnArr.push(matData1[0]*matData2[2] + matData1[2]*matData2[3]);
	returnArr.push(matData1[1]*matData2[2] + matData1[3]*matData2[3]);
	returnArr.push(matData1[0]*matData2[4] + matData1[2]*matData2[5] + matData1[4]);
	returnArr.push(matData1[1]*matData2[4] + matData1[3]*matData2[5] + matData1[5]);
	
    return returnArr;
};

Matrix.prototype.getTransform = function(matstring)
{
    if(matstring == null || matstring == undefined || matstring == "")
	   return this.array;
	matstring = matstring.toString();
	matstring =  matstring.replace(/ /g, ",");
	  
	var startIndex = 0;
    var endIndex = 0;
    var tempStr = "";
	
    var transformReturn = new Array();
    var tempArray = new Array();
   
    transformReturn[0] = 1;
    transformReturn[1] = 0;
    transformReturn[2] = 0;
    transformReturn[3] = 1;
    transformReturn[4] = 0;
    transformReturn[5] = 0;
	
    tempArray[0] = 1;
    tempArray[1] = 0;
    tempArray[2] = 0;
    tempArray[3] = 1;
    tempArray[4] = 0;
    tempArray[5] = 0;	
	
    while (startIndex>= 0 && (matstring.indexOf("(", startIndex) != -1))
    {
	    tempArray[0] = 1;
		tempArray[1] = 0;
		tempArray[2] = 0;
		tempArray[3] = 1;
		tempArray[4] = 0;
		tempArray[5] = 0;
	
        endIndex = matstring.indexOf("(", startIndex);
        tempStr = matstring.substring(startIndex, endIndex);
		tempStr = tempStr.replace(",","");
        if ("translate" == tempStr)
        {
		    if (matstring.indexOf(",", endIndex) == -1 || matstring.indexOf(")", endIndex) < matstring.indexOf(",", endIndex))
            {
                tempArray[4] = matstring.substring(endIndex + 1, matstring.indexOf(")", endIndex));
                tempArray[5] = 0;
            }
            else
            {
                tempArray[4] = matstring.substring(endIndex + 1, matstring.indexOf(",", endIndex));
                tempArray[5] = matstring.substring(matstring.indexOf(",", endIndex) + 1, matstring.indexOf(")", endIndex));
            }
		}
        else if ("scale" == tempStr)
        {
            if (matstring.indexOf(",", endIndex) == -1 || matstring.indexOf(")", endIndex) < matstring.indexOf(",", endIndex))
            {
                tempArray[0] = matstring.substring(endIndex + 1, matstring.indexOf(")", endIndex));
                tempArray[3] = tempArray[0];
            }
            else
            {
                tempArray[0] = matstring.substring(endIndex + 1, matstring.indexOf(",", endIndex));
                tempArray[3] = matstring.substring(matstring.indexOf(",", endIndex) + 1, matstring.indexOf(")", endIndex));
            }
        }
        else if ("rotate" == tempStr)
        {
            var tempValue = matstring.substring(endIndex + 1, matstring.indexOf(")", endIndex)) * Math.PI / 180;
            tempArray[0] = Math.cos(tempValue);
            tempArray[1] = Math.sin(tempValue);
            tempArray[2] = -Math.sin(tempValue);
            tempArray[3] = Math.cos(tempValue);
        }
        else if ("skewX" == tempStr)
        {
            tempArray[2] = Math.tan(matstring.substring(endIndex + 1, matstring.indexOf(")", endIndex)) * Math.PI / 180);
        }
        else if ("skewY" == tempStr)
        {
            tempArray[1] = Math.tan(matstring.substring(endIndex + 1, matstring.indexOf(")", endIndex)) * Math.PI / 180);
        }
        else if ("matrix" == tempStr)
        {			
            var tempStr = matstring.substring(endIndex + 1, matstring.indexOf(")", endIndex)).split(",");                   
            tempArray[0] = tempStr[0];      
            tempArray[1] = tempStr[1];          
            tempArray[2] = tempStr[2];           
            tempArray[3] = tempStr[3];           
            tempArray[4] = tempStr[4];         
            tempArray[5] = tempStr[5];           
        }
        startIndex = matstring.indexOf(")", endIndex)+1;
	     
        transformReturn = this.caclMatrix(transformReturn, tempArray);
    }
    return transformReturn;
};


Matrix.prototype.getAllParentMatrix = function(svgnode){
    var tempTransform = "";
    var tempNode = svgnode.parentNode;
    var tempTagName = tempNode.tagName;
    while ("undefined" != typeof(tempNode.tagName))
	{
	    var attrmatrix = tempNode.getAttribute("transform");
		if(attrmatrix != undefined)
		{
             tempTransform = tempNode.getAttribute("transform") + tempTransform;
		}
        tempNode = tempNode.parentNode;
        tempTagName = tempNode.tagName;
    }
	var matarr = this.getTransform(tempTransform);
    return this.getAsString(matarr);
};

Matrix.prototype.getMatrix = function(svgnode)
{
    var returnStr = this.getAllParentMatrix(svgnode);
    var nodemat = svgnode.getAttribute("transform");
	if(nodemat != undefined)
	{
	   returnStr += nodemat;
	}  
	var matarr = this.getTransform(returnStr);
    return this.getAsString(matarr);
};

Matrix.prototype.Inverse = function(matstring)
{
    if(matstring == undefined || matstring == null)
	{
	   return "matrix(1,0,0,1,0,0)";
	}
    var matArr = this.getTransform(matstring);
	var d =  1.0 / (matArr[0]*matArr[3] - matArr[1]*matArr[2]);
	var tempArray = new Array();
	tempArray[0] = matArr[3]*d;
	tempArray[1] = -matArr[1]*d;
	tempArray[2] = -matArr[2]*d;
	tempArray[3] = matArr[0]*d;
	tempArray[4] = -matArr[4]*tempArray[0] - matArr[5]*tempArray[2];
	tempArray[5] = -matArr[4]*tempArray[1] - matArr[5]*tempArray[3];
	
    return this.getAsString(tempArray);
};
