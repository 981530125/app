$(function(){
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    console.log(JSON.stringify(self.loginway));
	    var loginway = self.loginway;
	    var openid = self.openid;
//	    var usertype = self.usertype;
	    
//	    var loginway = 'weixin';
//	    var openid = 'okXaC0e778PnCv_Ookfdq3driB3w';
//	    var usertype = 'admin';
	    
	    $('html').on('click','.btn-style',function(){
			var usertype = $(this).attr('data-type');
			var url = 'http://192.168.0.79/index.php/api_resource/selectusertype'; //选择帐号登录
			$.ajax({
				url: url,
				data: {
					openid:openid,
					loginway:loginway,
					userType:usertype,
					clientType:clientType,
					clientId:clientId
				},
				type: 'post',
				dataType: 'json',
				async: true,
				beforeSend: function(xhr) { //beforeSend定义全局变量
					xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
				},
				success: function(res) {
					console.log(res);
					if(res.code && res.code == '1000'){
						console.log(JSON.stringify(res.data));
						var mobile = res.data.mobile;
						var openid = res.data.openid;
						var loginway = res.data.loginway;
						localStorage.setItem("openid",openid);
						localStorage.setItem("userType",usertype);
						localStorage.setItem("loginway",loginway);
						
						if(usertype == 'user'){
							localStorage.setItem("mobile",mobile);
							localStorage.setItem("accessToken",openid);
						}
						if(usertype == 'shop'){
							localStorage.setItem("shopmobile",mobile);
							localStorage.setItem("shopaccessToken",openid);
						}
						if(usertype == 'admin'){
							localStorage.setItem("adminmobile",mobile);
							localStorage.setItem("adminaccessToken",openid);
						}
						
//						开始登录
						setTimeout(function() {
							var skipurl = '../frame/tab-webview-main.html';
//							usertype
//							个人页面
							location.href=skipurl;
						}, 500);
					}else{
						mui.toast(res.message);
						setTimeout(function() {
							$('.myselect').show();
						}, 500);
//						提示用户还未注册或绑定,请先进行绑定,未注册的用户请先注册再绑定
					}
				},
				error: function(res) {
					mui.alert(res.message);
				}
			})
		})
	    
	    
	    $('html').on('click','.btn-close',function(){
	    	$('.myselect').hide();
	    })
	    
	    $('html').on('click','.registe',function(){
	    	$('.myselect').hide();
	    	var skipurl = '../../Register.html';
			mui.openWindow({
			    url:skipurl,
			    extras:{
			      //自定义扩展参数，可以用来处理页面间传值
			    },
			    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
			})
	    })
	    
	    $('html').on('click','.binding',function(){
	    	$('.myselect').hide();
	    	var skipurl = 'binding.html';
			mui.openWindow({
			    url:skipurl,
			    extras:{
			    	openid:openid,
			    	loginway:loginway
			      //自定义扩展参数，可以用来处理页面间传值
			    },
			    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
			})
	    })
	});
})
