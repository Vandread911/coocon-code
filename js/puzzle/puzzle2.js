//把puzzle看作一个实例工具对象
var puzzle=function(){
	var kBoardWidth = 3,	    //横向块数
	kBoardHeight = 3,			//纵向块数
	totalWidth = 600,           //总宽度
	totalHeight = 600,          //总高度
    exchangeTimes = 500,         //随机对换次数
    originImage = new Image(),  //用来获取原始图片的对象
	kPieceWidth = 0,			//每块的宽度  在init函数初始化
	kPieceHeight = 0,			//每块的高度  在init函数初始化	
	kPicTotalWidth,				//图片原始宽度  在init函数初始化
	kPicTotalHeight,     		//图片原始高度  在init函数初始化
	kPicWidth,                  //图片每块高度  在init函数初始化
	kPicHeight,			        //图片每块高度  在init函数初始化
	
	gCanvasElement,			    //canvas元素节点
	gDrawingContext,			//canvas元素的context内容
	gMoveCountElem,				//移动步数元素节点
	gMoveCount,					//移动次数
	gPieces,					//小块图片数组
	gNumPieces = kBoardWidth * kBoardHeight,				//小块图片的张数
	gIsStart = false,           //是否游戏已经开始  
	gPic,                       //原始图片对象
	Cell = function(row,column,index){
		this.row = row;			//行信息
		this.column = column;	//列信息
		this.index = index;		//内容信息
		this.oldRow = row;      //原来的位置内容
		this.oldColumn = column; 
	},
	//绘制网格线
    drawBoard = function(){	
		gDrawingContext.beginPath();		
		//绘制竖直网格线
		for (var x = 0; x <= totalWidth; x += kPieceWidth) {
			gDrawingContext.moveTo(0.0 + x, 0);
			gDrawingContext.lineTo(0.0 + x, totalHeight);
		}
		
		//绘制水平网格线
		for (var y = 0; y <= totalHeight; y += kPieceHeight) {
			gDrawingContext.moveTo(0, 0.0 + y);
			gDrawingContext.lineTo(totalWidth, 0.0 +  y);
		}
		
		//设定样式并且绘制到屏幕上
		gDrawingContext.strokeStyle = "#f00";
		gDrawingContext.stroke();
	},
		//绘制图片
	drawPiece = function(p){
		var column = p.column,
		row = p.row,
		index = p.index,
		_row = parseInt(index/kBoardWidth),   //图片的行数
		_column = index-_row*kBoardWidth,	  //图片的列数
		sy = _row*kPicHeight,                 //图片起始纵坐标
		sx = _column*kPicWidth ,			  //图片起始横坐标
		dx = column * kPieceWidth,			  //canvas 起始横坐标	
		dy = row * kPieceHeight;			  //canvas起始纵坐标
		gDrawingContext.drawImage(gPic,sx,sy,kPicWidth,kPicHeight,dx,dy,kPieceWidth,kPieceHeight);	//截取对应的小块图片，并且绘制到canvas中
		
	}
	//新游戏
	newGame = function() {
		gMoveCount = 0;
		gMoveCountElem.innerHTML = gMoveCount;		
		gPieces = new Array(gNumPieces - 1);
		for(var i = 0; i < gNumPieces - 1; i++)	{
			var row = parseInt(i / kBoardWidth);
			var column = i-row * kBoardWidth;
			gPieces[i] = new Cell(row,column,i);			//创建小块方格元素
		}
			
		//创建最后一个空白图片块，index为-1
		gPieces[gNumPieces-1]	= new Cell(kBoardHeight-1,kBoardWidth-1,-1);	//空白的图片
		randExchange();		//随机打乱图片
		gDrawingContext.clearRect(0, 0, totalWidth, totalHeight);	//清除canvas原有内容
		for(var i = 0; i < gNumPieces - 1; i++){	//绘制图片
			drawPiece(gPieces[i]);
		}
		drawBoard();		//绘制网格线
		gIsStart = true;
	},
	
// 根据键盘事件来移动图片
	movePiece = function(direction){
		var emptyPieceNum = kBoardWidth*kBoardHeight-1,	//得到空白图片的内容
		validMove = false,		//是否为一次有效的移动
		totalNum = gNumPieces;
		//向上移动
		if(direction=='up'){
			if(gPieces[emptyPieceNum].row+1<kBoardHeight){
				for(var i = 0; i < totalNum; i++){
					if(gPieces[i].column==gPieces[emptyPieceNum].column && gPieces[i].row==gPieces[emptyPieceNum].row+1){
						gPieces[i].row-=1;
						gPieces[emptyPieceNum].row+=1;
						validMove = true;
						break;
					}
				}	
			}		
		}			
		//向下移动			
		if(direction=='down'){
			if(gPieces[emptyPieceNum].row-1>=0){
				for(var i = 0; i < totalNum; i++){
					if(gPieces[i].column==gPieces[emptyPieceNum].column && gPieces[i].row==gPieces[emptyPieceNum].row-1){
						gPieces[i].row += 1;
						gPieces[emptyPieceNum].row -= 1;
						validMove = true;
						break;
					}
				}
			}
		}
		//向左移动
		if(direction=='left'){
			if(gPieces[emptyPieceNum].column+1<kBoardWidth){
				for(var i = 0; i < totalNum; i++){
					if(gPieces[i].column==gPieces[emptyPieceNum].column+1 && gPieces[i].row==gPieces[emptyPieceNum].row){
						gPieces[i].column -=1;
						gPieces[emptyPieceNum].column += 1;
						validMove = true;
						break;
					}
				}
			}
		}
		//向右移动
		if(direction=='right'){
			if(gPieces[emptyPieceNum].column-1>=0){
				for(var i = 0; i < totalNum; i++){
					if(gPieces[i].column==gPieces[emptyPieceNum].column-1 && gPieces[i].row==gPieces[emptyPieceNum].row){
						gPieces[i].column += 1;
						gPieces[emptyPieceNum].column -= 1;
						validMove = true;
						break;
					}			
				}
			}
		}
		
		//如果是一次有效的移动，开始真正地移动
		if(validMove && gIsStart){	
			//清楚canvas所有内容，开始重新绘制
			gDrawingContext.clearRect(0, 0, totalWidth, totalHeight);
			for(var i = 0; i<totalNum-1; i++){
				drawPiece(gPieces[i])
			}
			drawBoard();
			gMoveCount++;		//移动步数加1
			gMoveCountElem.innerHTML = gMoveCount;	//修改显示移动步数
			checkSuccess();     //检测是否成功
		}
	},
	
	initGame = function(canvasElement,moveCountElement,width,height,pic){
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
		}
		if(!pic){
			gPic=document.getElementById("pic");
		}else{
			gPic = pic;
		}
		
			
		//初始化参数
		totalWidth = width || totalWidth;                      //宽度
		totalHeight = height || totalHeight;                   //高度
		kPieceWidth = parseInt(totalWidth / kBoardWidth) ;     //每块格子宽度
		kPieceHeight= parseInt(totalHeight / kBoardHeight);    //每块格子的高度
		kPicTotalWidth = GetImageWidth(gPic);              	   //源图片总宽度
		kPicTotalHeight = GetImageHeight(gPic);			       //源图片总高度
		kPicWidth = parseInt( kPicTotalWidth /kBoardWidth );   //源图片每块格子宽度
		kPicHeight = parseInt( kPicTotalHeight / kBoardHeight);//源图片每块格子高度
		gCanvasElement = canvasElement;
		gDrawingContext = gCanvasElement.getContext("2d");
		gCanvasElement.width = totalWidth;
		gCanvasElement.height = totalHeight;
		gMoveCountElem = moveCountElement;
		gMoveCount = 0;
		//载入新的游戏
		newGame();			
		
			//监听按键事件
		document.onkeydown=function(e){   
			//key接受到的键盘码，以下写法有更好的跨浏览器兼容性
			var key=e.keyCode||e.which||e.charCode;
			if(key == 38 || key == 87) movePiece("up");	//上 或者 W 被按下
			if(key == 40 || key == 83) movePiece("down"); //下 或者 S 被按下
			if(key == 37 || key == 65 ) movePiece("left");  //左 或者 A 被按下
			if(key == 39 || key == 68 ) movePiece("right"); //右 或者 D 被按下
		} 
		gCanvasElement.addEventListener("click", function(evt){
			var e=evt || event,
			row = parseInt(e.offsetY / kPieceHeight), //点击的行数
			col = parseInt(e.offsetX / kPieceWidth),  //点击的列数
			emptyPieceNum = kBoardWidth*kBoardHeight-1,	//得到空白图片的内容
			tmp = gPieces[emptyPieceNum],
		    blankRow = tmp.row,
			blankCol = tmp.column,
			direction = null;			
			if(row -blankRow == 1 && col == blankCol){  //up
				direction = "up";
			} else if(row - blankRow == -1 && col == blankCol){   //down
				direction = "down";
			} else if( row == blankRow && col - blankCol ==1){ //left
				direction = "left";
			} else if( row == blankRow && col - blankCol == -1){ //right
				direction = "right";
			}
			if(direction){
				movePiece(direction);		
			}else{
				return false;
			}
		},false);
		
	};
	
	
	//随机对换,用于打小块图片的次序
	function randExchange(){
		var temp,direction;
		for(var i = 0; i < exchangeTimes; i++){
			temp = parseInt(Math.random() * 1000) % 4;
			switch (temp) {
				case 0 :
					direction =  "up";
				    break;
				case 1 :
					direction = "down";
				    break;
				case 2 :
					direction = "left";
				    break;					
				case 3 :
					direction = "right";
				    break;			
				default:
					direction = "left";
					break;
			}
			movePiece(direction);
		}
	};
	//检测是否成功了
	function checkSuccess(){
		var suc = true ;
		for( var i = 0; i < gNumPieces; i ++){
			if(gPieces[i].row != gPieces[i].oldRow || gPieces[i].column != gPieces[i].oldColumn){
				suc = false;
				break;
			}	 
		}
		if(suc && gIsStart){
			alert('ok');
		}
	}
	//获取图片原始宽度
	function GetImageWidth(oImage)	{
		if(originImage.src!=oImage.src) {
			originImage.src=oImage.src;
		}
		return originImage.width;
	}
	//获取图片的原始高
	function GetImageHeight(oImage)	{
		if(originImage.src!=oImage.src) {
			originImage.src=oImage.src;
		}
		return originImage.height;
	}
	
	return 	{
		init:initGame         //初始化游戏
	}


}()








