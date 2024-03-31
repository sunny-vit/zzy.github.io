/****
 * Model 全局变量，设计为本软件运行模型，用于保存软件的状态，调试程序
 */
var Model = {} ;
    Model.clock = null ;
    Model.bookIndex = 0 ;
	Model.prevBook = function(){
			if(Model.bookIndex > 0){
				Model.bookIndex -- ;
			}else{
				Model.bookIndex = UI.bookFace.length -1
			}
		  };
		Model.nextBook = function (){
			if(Model.bookIndex < UI.bookFace.length -1 ){
				Model.bookIndex ++ ;
			}else{
				Model.bookIndex = 0;
			}
		  };

var UI = {} ;
    UI.bookFace = [] ;

var Plan = {} ;
    Plan.responsiveUI = function(){
  /**Updated By masterlijh on 20240329***
   本代码块用于初始化UI界面，用UI全局变量管理软件的可视化元素
   其中： 
    设置属性：deviceWidth，deviceHeight 属性用来记录用户端设备的像素分辨率
             fontBase 记录并设定每行文字的基础字体大小
    执行语句：
        默认让软件UI界面在用户端设备的满屏显示
      设定三条显示文字的区域的行高，让文字能在纵向也居中与区域中
      设定书的封面图片能以最佳方式显示在main区域内
   */ 
    //------按用户端设备的实际情况设置基础字体和可视界面大小
    UI.deviceWidth = window.innerWidth >= 800 ? 800 :  window.innerWidth ; 
    UI.deviceHeight = window.innerHeight ;
    UI.fontBase = parseInt(UI.deviceWidth / 21); //让屏幕每行显示不多于20个汉字
   
   document.body.style.width = UI.deviceWidth + "px" ;
   document.body.style.height = UI.deviceHeight + "px" ;
   document.body.style.fontSize = UI.fontBase + "px" ;
 
    //设置下面2行p元素行高与父容器的高度一致，使得文字在垂直方向居中 
         $("book").style.lineHeight = UI.deviceHeight * 0.15 + 'px' ;
         $("chapter").style.lineHeight = UI.deviceHeight * 0.1 + 'px' ;
     $("statusInfo").style.lineHeight = UI.deviceHeight * 0.1 + 'px' ;
   //为将书封面的完美按比例设置在客户设备的main区域，需要计算图片的纵横比
    
  } //Plan.responsiveUI

  Plan.loadImgOneByOne = function(){
    //------ lesson下的十几门课的封面和教师照片
    let booksPage = ['CS.jpg' , 'CSS.jpg' , 'CT.jpg' , 'GRE.jpg' , 'Git.jpg' , 'NinjaJS.jpg' , 'STEM.jpg' , 'UML.jpg' , 'bitCoin.jpg' , 'canvas.jpg' , 'cssAnimation.jpg' , 'gitForTeams.jpg' , 'internet.jpg' , 'javaScript.jpg' , 'learnCSS.jpg' , 'linuxCMD.jpg' , 'logic.jpg' , 'nutrition.jpg' , 'webProgramming.jpg' ] ;
    let teachersFace = ['0.jpg' , '1.jpg' , '10.jpg' , '11.jpg' , '12.jpg' , '13.jpg' , '2.jpg' , '3.jpg' , '4.jpg' , '5.jpg' , '6.jpg' , '7.jpg' , '8.jpg' , '9.jpg'  ] ;
    let img = new Image();
      img.id = 'bookFace' ;
      img.src = 'lesson/' + booksPage[Model.bookIndex] ;
      if ( Model.bookIndex < booksPage.length - 1){
          Model.bookIndex ++ ;
         img.addEventListener('load', function(){ 
          UI.bookFace.push(this) ;
          console.log(booksPage[Model.bookIndex] + ' has loaded!') ;
          Plan.loadImgOneByOne();
         });
      }
    } //Plan.loadImgOneByOne


  /**
    $ 函数，该函数用于快捷获取Web 页面的一个dom对象或一些列对象
	  建议初学者可以在Console面板，学习调用这个函数，了解后可以极大提高控制Web Dom的代码效率
     writlen by masterLijh at 20240329
   */
     function $(ele){
        if (typeof ele !== 'string'){
           throw("自定义的$函数参数的数据类型错误，实参必须是字符串！");
           return 
        } 
        let dom = document.getElementById(ele) ;
          if(dom){
            return dom ;
          }else{
            dom = document.querySelector(ele) ;
            if (dom) {
                return dom ;
            }else{
                throw("执行$函数未能在页面上获取任何元素，请自查问题！");
                return ;
            }
          }
       } //end of $