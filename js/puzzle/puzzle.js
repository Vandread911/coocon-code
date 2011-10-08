//全局配置变量
var kBoardWidth = 3;			//横向块数
var kBoardHeight = 3;			//纵向块数
var kPieceWidth = 200;			//每块的宽度
var kPieceHeight = 200;			//每块的高度
var kPixelWidth = 1 + kBoardWidth * kPieceWidth;		//游戏视野的宽度
var kPixelHeight = 1 + kBoardHeight * kPieceHeight;		//游戏视野的高度
var exchangeTimes = 0;		//随机对换次数

var gCanvasElement;				//canvas元素节点
var gDrawingContext;			//canvas元素的context内容
var gMoveCountElem;				//移动步数元素节点
var gMoveCount;					//移动次数
var gPieces;					//小块图片数组
var gNumPieces;					//小块图片的张数


//定义一个cell类，cell类包含了小块图片的信息
function Cell(row,column,index){
	this.row = row;			//行信息
	this.column = column;	//列信息
	this.index = index;		//内容信息
}

//初始化游戏
function initGame(canvasElement,moveCountElement){
	//若canvas元素节点不存在则创建canvas元素节点
	if(!canvasElement){	
		canvasElement = document.createElement("canvas");
		canvasElement.id = "puzzle";
		document.body.appendChild(canvasElement);
	}
	
	//若记录步数记录节点不存在则创建步数记录节点
	if(!moveCountElement){
		moveCountElement = document.createElement("p");
		document.body.appendChild(moveCountElement);
		document.body.appendChild(moveCountElement);
	}
	
	//初始化参数
	gCanvasElement = canvasElement;
	gDrawingContext = gCanvasElement.getContext("2d");
	gCanvasElement.width = kPixelWidth;
	gCanvasElement.height = kPixelHeight;
	gMoveCountElem = moveCountElement;
	gMoveCount = 0;

	newGame();			//载入新的游戏
	//监听按键事件
	document.onkeydown=function(e){   
		//key接受到的键盘码，以下写法有更好的跨浏览器兼容性
		var key=e.keyCode||e.which||e.charCode;
		if(key==38 || key==87) movePiece("up");	//上 或者 W 被按下
		if(key==40 || key==83) movePiece("down"); //下 或者 S 被按下
		if(key==37 || key==65 ) movePiece("left");  //左 或者 A 被按下
		if(key==39 || key==68 ) movePiece("right"); //右 或者 D 被按下
    } 
}

//开始新游戏
function newGame(){
	gMoveCount = 0;
	gMoveCountElem.innerHTML = gMoveCount;
	
	gPieces = new Array(kBoardWidth*kBoardHeight-1);
	for(var i=0; i<kBoardWidth*kBoardHeight-1; i++)	{
		var row = parseInt(i/kBoardWidth);
		var column = i-row*kBoardWidth;
		gPieces[i]=new Cell(row,column,i);			//创建小块方格元素
	}
		
	//创建最后一个空白图片块，index为-1
	gPieces[kBoardWidth*kBoardHeight-1]	= new Cell(kBoardHeight-1,kBoardWidth-1,-1);	//空白的图片
	gNumPieces = gPieces.length;
	randExchange();		//随机打乱图片
	gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);	//清除canvas原有内容
	for(var i=0; i<kBoardWidth*kBoardHeight-1; i++)	//绘制图片
		drawPiece(gPieces[i]);					
	drawBoard();		//绘制网格线
}

//随机对换,用于打小块图片的次序
function randExchange()
{
	var temp1,temp2,temp3;
	for(var i=0; i<exchangeTimes; i++)
	{
		temp1 = parseInt(kBoardWidth*kBoardHeight*Math.random());
		temp2 = parseInt(kBoardWidth*kBoardHeight*Math.random());

		//交换两个gPieces[temp1]，gPieces[temp2]的位置
		temp3 = gPieces[temp1].column;
		gPieces[temp1].column = gPieces[temp2].column;
		gPieces[temp2].column = temp3;
		
		temp3 = gPieces[temp1].row;
		gPieces[temp1].row = gPieces[temp2].row;
		gPieces[temp2].row = temp3;
	}
}

//绘制网格线
function drawBoard()
{
	
	gDrawingContext.beginPath();
	
	//绘制竖直网格线
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
	gDrawingContext.moveTo(0.5 + x, 0);
	gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    //绘制水平网格线
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
	gDrawingContext.moveTo(0, 0.5 + y);
	gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    //设定样式并且绘制到屏幕上
    gDrawingContext.strokeStyle = "#f00";
    gDrawingContext.stroke();
}

//绘制图片
function drawPiece(p){
	var column = p.column;
	var row = p.row;
	var index = p.index;
	var _row = parseInt(index/kBoardWidth);
	var _column = index-_row*kBoardWidth;
	var sy = _row*kPieceWidth;
	var sx = _column*kPieceHeight ;
	var dx = column * kPieceWidth;
	var dy = row * kPieceHeight;
	//alert(sx+','+sy+','+dx+','+dy);
	//gDrawingContext.font="bold 18px sans-serif";
	//gDrawingContext.fillText(index,dx-5,dy+5);
	
	var pic = document.getElementById("pic");
	//context.drawImage(micky,250,0);					//全部显示出来
	gDrawingContext.drawImage(pic,sx,sy,kPieceWidth,kPieceHeight,dx,dy,kPieceWidth,kPieceHeight);	//截取对应的小块图片，并且绘制到canvas中
	
}

// 根据键盘事件来移动图片
function movePiece(direction)
{
	var emptyPieceNum = kBoardWidth*kBoardHeight-1;	//得到空白图片的内容
	var validMove = false;		//是否为一次有效的移动
	
	//向上移动
	if(direction=='up')
		if(gPieces[emptyPieceNum].row+1<kBoardHeight)
			for(var i=0; i<kBoardWidth*kBoardHeight; i++)
				if(gPieces[i].column==gPieces[emptyPieceNum].column && gPieces[i].row==gPieces[emptyPieceNum].row+1)
				{
					gPieces[i].row-=1;
					gPieces[emptyPieceNum].row+=1;
					validMove = true;
					break;
				}
				
	//向下移动			
	if(direction=='down')
		if(gPieces[emptyPieceNum].row-1>=0)
			for(var i=0; i<kBoardWidth*kBoardHeight; i++)	
				if(gPieces[i].column==gPieces[emptyPieceNum].column && gPieces[i].row==gPieces[emptyPieceNum].row-1)
				{
					gPieces[i].row += 1;
					gPieces[emptyPieceNum].row -= 1;
					validMove = true;
					break;
				}
	//向左移动
	if(direction=='left')
		if(gPieces[emptyPieceNum].column+1<kBoardWidth)
			for(var i=0; i<kBoardWidth*kBoardHeight; i++)
				if(gPieces[i].column==gPieces[emptyPieceNum].column+1 && gPieces[i].row==gPieces[emptyPieceNum].row)
				{
					gPieces[i].column -=1;
					gPieces[emptyPieceNum].column += 1;
					validMove = true;
					break;
				}
	//向右移动
	if(direction=='right')
		if(gPieces[emptyPieceNum].column-1>=0)
			for(var i=0; i<kBoardWidth*kBoardHeight; i++)
				if(gPieces[i].column==gPieces[emptyPieceNum].column-1 && gPieces[i].row==gPieces[emptyPieceNum].row)
				{
					gPieces[i].column += 1;
					gPieces[emptyPieceNum].column -= 1;
					validMove = true;
					break;
				}			
	
	//如果是一次有效的移动，开始真正地移动
	if(validMove)
	{	
		//清楚canvas所有内容，开始重新绘制
		gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
		for(var i=0; i<kBoardWidth*kBoardHeight-1; i++)
		drawPiece(gPieces[i]);
		drawBoard();
		gMoveCount++;		//移动步数加1
		gMoveCountElem.innerHTML = gMoveCount;	//修改显示移动步数
	}
}


