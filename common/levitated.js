$(function(){
	//可拖动悬浮球
	var div = document.getElementById('touch');
    var viewWidth = window.screen.width;
    var viewHeight = window.screen.height;
    var divWidth = parseInt(div.style.width);
    var divHeight = parseInt(div.style.height);
    
    div.addEventListener('touchmove', function(event) {
        event.preventDefault(); //阻止其他事件
        event.stopPropagation();
//      mui('#pullrefresh').pullRefresh().setStopped(true);
        // 如果这个元素的位置内只有一个手指的话  
        if(event.targetTouches.length == 1) {
            var touch = event.targetTouches[0]; // 把元素放在手指所在的位置 
            
            var tempWidth = touch.clientX;//存储x坐标  
            var tempHeigth = touch.clientY;//存储Y坐标 
            if((viewWidth - tempWidth) < divWidth) {//超越右边界  
                tempWidth = viewWidth - divWidth-10;
                console.log('右');
            }
            if((viewHeight - tempHeigth-200) < divHeight) {//超越下边界  
                tempHeigth = viewHeight - divHeight-200;
                console.log('下');
            }
            if((tempWidth - divWidth)<0){//超越左边界  
                tempWidth= divWidth/2;
                console.log('左');
            }
            if(50> tempHeigth){//超越上边界  
                tempHeigth= divHeight/2;
                console.log('上');
            }
            div.style.left = tempWidth + 'px';
            div.style.top = tempHeigth + 'px';
        }
    }, false);
	
//	点击打印悬浮球
	$('html').on('click','#touch',function(){
		$('.mypop').show();
	})
	
	//dome
	$('html').on('click','.dome',function(event){
		var skipurl = '../managecenter/checkcenter/selectdome.html';
		mui.openWindow({
			url: skipurl,
		});
		event.stopPropagation();
	})
	
	
	//点击图标隐藏
	$('html').on('click','.hideicon',function(){
		$('.mypop').hide();
		$('.transit').fadeOut(1000);
	//	$('.transit').addClass('totransit');
		$('#mySwitch').removeClass('mui-active');
		$('.mypop').hide();
		localStorage.setItem('print','false');
	})
	
	//点击取消
	$('html').on('click','.tocalcel',function(){
		$('.mypop').hide();
	})
	
	window.addEventListener("getmyprint", function(e) {
		var isprint = e.detail.isprint;
		if(isprint == 'true'){
			setmyswitch();
		}
	})
	
	//对默认打印开关设置
	function setmyswitch(){
		var currentprint = localStorage.getItem('print');
		switch(currentprint)
		{
		case 'true':
		  	$('#mySwitch').addClass('mui-active');
			$('.transit').fadeIn(1000);
		  	break;
		case 'false':
		  	$('#mySwitch').removeClass('mui-active');
			$('.transit').fadeOut(1000);
		  	break;
		default:
		  	$('#mySwitch').removeClass('mui-active');
			$('.transit').fadeOut(1000);
			break;
		}
	}
	
	$('html').on('click','#screen',function(){
		$(".mypop").hide();
		setTimeout(function() {
			save();
		}, 500);
	})
	
})