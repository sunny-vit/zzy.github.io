Plan.responsiveUI() ;

Plan.loadImgOneByOne() ;


  //下面的DOM事件驱动模式，让软件的UI实现用户操作响应 
/* 下面代码是用Model模型模拟翻书的最初阶段：
//1.主要用Model.bookIndex记录当前书的编号，用UI.bookFace[index]实现书页图像的切换
//2.用Web文档的DOM操作实现应用的界面变化
//3.用CSS样式设置的动画，配合JS的异步代码，实现元素的动画效果
 $('main').addEventListener("click",function(){
	console.log("main  click!");
	if(Model.bookIndex < UI.bookFace.length - 1){
		Model.bookIndex ++ ;
	}else{
		Model.bookIndex = 0 ;
	}
	let index =  Model.bookIndex ;
	this.removeChild($('bookFace')) ;
	this.appendChild(UI.bookFace[index]) ;
	$("bookFace").style.opacity = 0.1 ;
	//同步代码设定动画的起点
	setTimeout(function(){
		 $("bookFace").style.opacity = 0.9 ;
	},100); //异步代码设定动画的终止点 ，剩下的由CSS动画的transition函数自动完成
  });
  */
 //因为有且只有第一次点击，才需要载入第一本书，如何解决这个问题，下面这2句演示了一个高智商的小技巧，
  document.body.onclick = function(){
	$('main').replaceChild(UI.bookFace[0],$('bookFace')) ;
	
	$('bookFace').style.opacity = 0 ;
	setTimeout(function(){
		$('bookFace').style.opacity = 0.9 ;
	},200);
	
	Model.bookIndex = 0 ;
	document.body.onclick = null ; 
  };

//1、本次提交精简了mouse模型，通过研究鼠标的三个底层事件：mousedown、mousemove、mouseup，设计了一个可以拖动书的图案的UI，该UI实现了软件介绍的书的切换；2、用户用鼠标拖动书的动作细节很多，包括：按下，移动，抬起，移动距离，通过逻辑综合判断这些因素设计了一个可行算法，既判断了有效拖动（包括左右实现不同的切换方向），杜绝了无效拖动，也把拖动限定在半屏范围之内，展现了一个较为流畅可概念清晰的前后切换书的GUI模型，3、最后，本例利用CSS动画开关设置，结合JS的异步代码，联合上面的mouse模型，创作除了一个有动画效果的UI。
  Model.mouse = {
	isDown: false ,
	x : 0 ,
	deltaX : 0 ,
	 } ;

  $('main').addEventListener("mousedown", function(ev){
    ev.preventDefault() ;
	console.log("mouse is down! ");
    Model.mouse.isDown = true ;
	Model.mouse.x = ev.pageX ;
   }) ;
  $('main').addEventListener("mousemove", function(ev){
	ev.preventDefault() ;
   let mouse = Model.mouse ;
   if (mouse.isDown && Math.abs($('bookFace').offsetLeft) < UI.deviceWidth / 5){
	   console.log("认可的 mouse事件： down and moving");
	   mouse.deltaX = ev.pageX - mouse.x ;
	   $('bookFace').style.left = $('bookFace').offsetLeft + mouse.deltaX + 'px' ;
	   mouse.deltaX = 0 ;
   } //end if mouse.isDown
  }) ; //'main'.addEventListener("mousemove")
  
  $('main').addEventListener("mouseup",function(ev){
	ev.preventDefault() ;
   	let mouse = Model.mouse ;
	    mouse.isDown = false ;
	let mini = parseInt(UI.deviceWidth/5) ;
	let offsetLeft =  $('bookFace').offsetLeft ;
	 if( Math.abs(offsetLeft) > mini){
 		if( offsetLeft > mini){
			lastBook();
		}else{
			if( offsetLeft < - mini ){
             nextBook() ;
			}
		}
        mouse.x = 0 ;
		this.removeChild($('bookFace')) ;
		this.appendChild(UI.bookFace[Model.bookIndex]) ;
		bookFace.style.opacity =  '0.1' ;
      setTimeout(function(){ 
		$('bookFace').style.left =  '0px' ;
		$('bookFace').style.opacity =  '0.9' ;
      },200); 
	}else{ //end if Math.abs(mouse.deltaX) > mini,else 则需要书图回归原位
		setTimeout(function(){ 
			$('bookFace').style.left =  '0px' ;
	    },200); 
	 }
	    function lastBook(){
			if(Model.bookIndex > 0){
				Model.bookIndex -- ;
			}else{
				Model.bookIndex = UI.bookFace.length -1
			}
		  }
		function nextBook(){
			if(Model.bookIndex < UI.bookFace.length -1 ){
				Model.bookIndex ++ ;
			}else{
				Model.bookIndex = 0;
			}
		  }
	  }) ;       //'main'.addEventListener("mouseup")


 
//执行异步代码，动态显示18个书面图片加载进度，下面代码表现lesson文件夹下的所有文件加载进程
/***
Model.clock = setInterval(()=>{
      let i = 1;
      let width = parseInt( i / UI.bookFace.length * 100) ;
      //console.log("progress:" + width) ;
      $('progressBar').style.width = width + '%' ;
      if (width === 100)  {
		   $('progressBar').textContent = "OK, Resource loaded 100% !"
		  clearInterval(Model.clock);
		  setTimeout(()=>{
			$('progressBar').parentNode.removeChild($('progressBar'));
			 Model.clock  = null ;
		  },1000)
      }
    },500);
 */

 
/***关闭触屏
//------touch events register and handel----------

 const chapterDom = $('chapter') ;
 const bookDom = $('bookFace') ;
       chapterDom.addEventListener("touchstart",handleStart);
	   chapterDom.addEventListener("touchend",handleEnd);
       chapterDom.addEventListener("touchmove",handleMove);
	   bookDom.addEventListener("touchstart",handleStart);
	   bookDom.addEventListener("touchend",handleEnd);
       bookDom.addEventListener("touchmove",handleMove);
      //---APP开发期间，暂时将底部状态栏设为可无限增加高度的滚动渲染模式。
      //$("statusInfo").style.display = "inline" ;
      //$("statusInfo").style.overflow = "scroll" ;
	
	 function handleStart(e){
	  touchModel.target = e.touches[0].target ;
	  e.preventDefault();
	  const output = $("statusInfo");
	  const touches = e.touches ;
	  output.textContent = '开始摸时，共有'+touches.length + '个点的数据。';
	  output.textContent +=  " Touch" + touches[0].identifier +"begin: "  ;

	  //在touch事件发生时用touchMode.time记录开始时刻
      touchModel.time = new Date() - 1 ;
	  touchModel.ongoingXY = [] ;
	  
		 } //function  handleStart

     function handleEnd(e){
	  e.preventDefault();
	  const output = $("statusInfo");
	  const touches = e.changedTouches ;
	  output.textContent += '结束摸时，有'+touches.length + '个点的数据。';
	  output.textContent += "touch" + touches[0].identifier  + "End! " ;
	 //在touch事件结束时用用当前时刻减touchMode.time，记录触摸移动发生的时间
      touchModel.time = new Date() - touchModel.time;

	  touchModel.respondTouch() ;
	 } //function  handleEnd

     function handleMove(e){
	  e.preventDefault();
	  const output = $("statusInfo");
	  const touches = e.changedTouches ;
	   
	  for(let i =0 ;i<touches.length;i++){
		  let x = parseInt(touches[i].pageX);
		  let y = parseInt(touches[i].pageY);
	   output.textContent +=  ' (x:' + x +','+'y:'+ y + ') ' ;
	  }
	 //在移动时把触屏捕捉的坐标点记录下来 
	 let x = touches[0].pageX , y = touches[0].pageY ;
         x = parseInt(x) ;
		 y =  parseInt(y) ;
	 touchModel.pushXY(x,y);
	 } //function  handleMove

  //----建立模型响应和处理touch事件产生的数据
 const chapters = ['第1章 Introduction','第2章 Number Systems','第3章 Data Storage','第4章 Computer Organization','第5章 Computer Networks and Internet','第6章 Operating Systems','第7章  Software Engineering','第8章  OOP Programming'] ;
 const books = booksPage ;
 var touchModel = {
   target: null ,
   ongoingXY : [] ,
   deltaX : 0 ,
   deltaY : 0 ,
   time : 0 ,
   pushXY : function (x,y){
	 let xy = {x,y} ;
     this.ongoingXY.push(xy);
   },
   chapterNo : 0 ,
   bookNo : 0 ,
   respondTouch : function(){
    this.deltaX = this.ongoingXY[this.ongoingXY.length-1].x - this.ongoingXY[0].x ;
	this.deltaY = this.ongoingXY[this.ongoingXY.length-1].y - this.ongoingXY[0].y ;
    if (Math.abs(this.deltaX) > UI.deviceWidth / 10) {
		//console.log("有效滑动");
		//console.log(this.target) ;

        if (this.target == $('chapter') ){ //touch target is chapters
		
    		if (this.deltaX > 0){
              this.nextChapter();
		    }else{
		      this.preChapter() ;
		    }
		 }
		if (this.target == $('bookFace') ){ //touch target is books
		    if (this.deltaX > 0){
              this.nextBook();
		    }else{
		      this.preBook() ;
		    }
		}
    }
	
   },
   preChapter : function (){
     if (this.chapterNo ===0)  {
		 this.chapterNo = chapters.length -1 ;
     }else{
	     this.chapterNo -- ;
	 }
	 $("chapter").textContent = chapters[this.chapterNo];
   },
   nextChapter :function (){
      if (this.chapterNo === chapters.length -1)  {
		 this.chapterNo = 0 ;
     }else{
	     this.chapterNo ++ ;
	 }
	 $("chapter").textContent = chapters[this.chapterNo];
   },
   preBook : function(){
      books
     if (this.bookNo ===0)  {
		 this.bookNo = books.length -1 ;
     }else{
	     this.bookNo -- ;
	 }
	 $("bookFace").src = 'lesson/' + books[this.bookNo];
	
   },
   nextBook :function (){
      if (this.bookNo === books.length -1)  {
		 this.bookNo = 0 ;
     }else{
	     this.bookNo ++ ;
	 }
	  $("bookFace").src = 'lesson/' + books[this.bookNo];
	
   },
 } ; //touchModel定义完毕
 
 关闭触屏********/ 