Plan.responsiveUI() ;

Plan.loadImgOneByOne() ;


  //下面的DOM事件驱动模式，让软件的UI实现用户操作响应 
/*
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
  setTimeout(function(){
   $('main').replaceChild(UI.bookFace[0],$('bookFace')) ;
  },3000);

  Model.mouse = {
	isDown: false ,
	x : 0 ,
	deltaX : 0 ,
	totalX : 0 ,
	 } ;

  $('main').addEventListener("mousedown", function(ev){
    ev.preventDefault() ;
	console.log("mouse is down! ");
    Model.mouse.isDown = true ;
	Model.mouse.x = ev.pageX ;
   }) ;
  $('main').addEventListener("mousemove", function(ev){
   let mouse = Model.mouse ;
   if (mouse.isDown){
	   console.log("mouse is down and moving");
	   mouse.deltaX = ev.pageX - mouse.x ;
    if (mouse.deltaX > 5){
       mouse.deltaX = 0 ;
       //mouse.x = ev.pageX ;
	   $('bookFace').style.left = $('bookFace').offsetLeft + 10 + 'px' ;
       mouse.totalX += 1 ;
    }
    if (mouse.deltaX < -5){
      mouse.deltaX = 0 ;
      //mouse.x = ev.pageX ;
      $('bookFace').style.left = $('bookFace').offsetLeft - 10 + 'px' ;
      mouse.totalX -= 1 ;
    }
   } //end if mouse.isDown
  }) ; //'main'.addEventListener("mousemove")
  
  $('main').addEventListener("mouseup", function(ev){
	let mouse = Model.mouse ;
        mouse.isDown = false ;
        mouse.x = 0 ;
         
		if (mouse.totalX < -5)  {
			if (Model.bookIndex < UI.bookFace.length -1  ){
			Model.bookIndex ++ ;
		   } else{
			Model.bookIndex = 0 ;
		   }
     	 
		}
	   
		if (mouse.totalX > 5)  {
			if (Model.bookIndex > 0  ){
			   Model.bookIndex -- ;
			  } else{
			   Model.bookIndex = UI.bookFace.length - 1 ;
			  }
		}

		mouse.totalX = 0 ;
		this.removeChild($('bookFace')) ;
		this.appendChild(UI.bookFace[Model.bookIndex]) ;
		$('bookFace').style.opacity =  '0.1' ;

      setTimeout(function(){ 
       $('bookFace').style.left =  '0px' ;
       $('bookFace').style.opacity =  '0.9' ;
      },200); 
     }) ; //'main'.addEventListener("mouseup")


 
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