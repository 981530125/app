$(function(){
	mui.plusReady(function() {
		$('html').on('click','#managecenter',function(){
			var btnArray = ['取消', '确认'];
			mui.confirm('是否确定切换到管理中心？', '', btnArray, function(e) {
				if (e.index == 1) {
					//打开管理页面
					if(localStorage.getItem("adminaccessToken")){
						localStorage.setItem('userType','admin');
						plus.runtime.restart();
					}else{
						mui.toast('账号未登录，请登录！');
						var current = plus.webview.getWebviewById('signup');
						if(current){
							plus.webview.close('../../signup.html');
						}else{
							setTimeout(function() {
								var tourl = '../../signup.html';
								mui.openWindow({
								    url:tourl,
								    id:tourl,
								    styles:{
								      top: '0',//新页面顶部位置
								      bottom:'0',//新页面底部位置
								    },
								    extras:{
								    	userType: 'user',
								    	myswitch:'true'
								      //自定义扩展参数，可以用来处理页面间传值1
								    },
								    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
								    show:{
								      autoShow:true,//页面loaded事件发生后自动显示，默认为true
								      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
								      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
								    }
								})
							}, 500);
						}
						localStorage.setItem('userType','admin');
						return false;
					}
				} else {
					mui.toast('取消');
				}
			})
		});
		$('html').on('click','#shopcenter',function(){
			var btnArray = ['取消', '确认'];
			mui.confirm('是否确定切换到企业中心？', '', btnArray, function(e) {
				if (e.index == 1) {
					//打开管理页面
					if(localStorage.getItem("shopaccessToken")){
						localStorage.setItem('userType','shop');
						plus.runtime.restart();
					}else{
						mui.toast('账号未登录，请登录！');
						setTimeout(function() {
							var tourl = '../../signup.html';
							var current = plus.webview.getWebviewById('signup');
							if(current){
								plus.webview.close('../../signup.html');
							}else{
								mui.openWindow({
								    url:tourl,
								    id:tourl,
								    styles:{
								      top: '0',//新页面顶部位置
								      bottom:'0',//新页面底部位置
								    },
								    extras:{
								    	userType: 'user',
								    	myswitch:'true'
								      //自定义扩展参数，可以用来处理页面间传值1
								    },
								    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
								    show:{
								      autoShow:true,//页面loaded事件发生后自动显示，默认为true
								      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
								      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
								    }
								})
							}
						}, 500);
						localStorage.setItem('userType','shop');
						return false;
					}
				} else {
					mui.toast('取消');
				}
			})
		});
		
		//	点击查看通知
		$("html").on('click','#notice',function(){
	//		var tourl = '../notice/notice.html';
			var tourl = '../notice/usermessage.html';
			mui.openWindow({
			    url:tourl,
			    id:tourl,
			    styles:{
			      top: '0',//新页面顶部位置
			      bottom:'0',//新页面底部位置
			    },
			    extras:{
			    	stasticmessage:window.stasticmessage,
			    	licenses_id:window.licenses_id
			      //自定义扩展参数，可以用来处理页面间传值1
			    },
			    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
			})
		})
		
		$('html').on('click','.userinfo',function(){
			var skipurl = '../managecenter/editinfo/editmanageinfo.html';
			mui.openWindow({
				url: skipurl,
			});
		})
	})
})
