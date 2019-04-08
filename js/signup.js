$(function(){
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    if(self.myswitch == 'true'){
	    	window.returntype = self.userType;
	    }
		//	    获取设备uuid和imei
	    var deviceModel = plus.device.model;
	    var clientId = plus.device.uuid;
	    var info = plus.push.getClientInfo();
	    window.notifyCid = info.clientid;
	    //accesstoken验证
		function testaccessToken(mobile,userType,clientId,clientType,accessToken){
			config();
			if(accessToken && accessToken.length >0){
				if(userType == "user"){
					var skipurl = 'app/frame/tab-webview-main.html';
				}
				if(userType == "shop"){
					var skipurl = 'app/frame/tab-webview-main.html';
				}
				if(userType == 'admin'){
					var skipurl = 'app/frame/tab-webview-main.html';
				}
				console.log(skipurl);
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
				event.stopPropagation();
				//在关闭窗口代码上加入延迟
				setTimeout(function(){
				    plus.webview.currentWebview().close('none');
				}, 2000)
			}
		}

		var userType = localStorage.getItem("userType");
		if(userType == 'user'){
			var accessToken = localStorage.getItem("accessToken");
			var mobile = localStorage.getItem("mobile");
		}
		if(userType == 'shop'){
			var accessToken = localStorage.getItem("shopaccessToken");
			var mobile = localStorage.getItem("shopmobile");
		}
		if(userType == 'admin'){
			var accessToken = localStorage.getItem("adminaccessToken");
			var mobile = localStorage.getItem("adminmobile");
		}
		
		
		if(mobile){
			var mobile = mobile;
		}else{
			var mobile = '';
		}
		if(userType){
			var userType = userType;
		}else{
			var userType = '';
		}
		if(clientId){
			var clientId = clientId;
		}else{
			var clientId = '';
		}
		if(accessToken){
			var accessToken = accessToken;
		}else{
			var accessToken = '';
		}
		if(mobile&&userType&&clientId&&accessToken){
			var tokens = [{
			"mobile":mobile,
			"userType":userType,
			"clientId":clientId,
			"accessToken":accessToken
			}]
		}else{
			var tokens = [];
		}
		sendnotifycid(tokens,window.notifyCid,clientType);



		if(accessToken){
			testaccessToken(mobile,userType,clientId,clientType,accessToken);
		}else{
			var accessToken = '';
		}
		$('.btn-submit').click(function() { //登录
			localStorage.removeItem('loginway');
			
			
			var mobile = $('#mobile').val();
			var pwd = $('#password').val();
			if(mobile == '' || $.trim(mobile).length <= 0) {
				mui.alert("请输入手机号");
			} else if($('#password').val() == '' || $.trim($('#password').val()).length <= 0) {
				mui.alert("请输入密码");
			} else {
				$("#my-mask").show();
				var userType = $(".userType").val();
				var url = rooturl+'Api_apps/signIn';
				$.ajax({
					url: url,
					data: {
						mobile: mobile,
						password: pwd,
						userType: userType,
						clientId: clientId,
						clientType: clientType
					},
					type: 'post',
					dataType: 'json',
					crossDomain: true,
					cache: true,
					beforeSend: function(xhr) { //beforeSend定义全局变量
						xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
					},
					success: function(res) {
						$("#my-mask").hide();
						if(res.code && res.code == 1000){
							if(res.data){
								var accessToken = res.data.accessToken;
								localStorage.setItem('uuid',plus.device.uuid);
								console.log(accessToken);
								var id = res.data.id;
								localStorage.setItem("userType",userType);
								if(userType == 'user'){
									localStorage.setItem("accessToken",accessToken);
									localStorage.setItem("mobile",mobile);
									localStorage.setItem('userid',id);
									localStorage.setItem('userarea_id',area_id);
								}
								if(userType == 'admin'){
									var area_id = res.data.role.area_id;
									localStorage.setItem("adminaccessToken",accessToken);
									localStorage.setItem("adminmobile",mobile);
									localStorage.setItem('adminid',id);
									localStorage.setItem('adminarea_id',area_id);
								}
								if(userType == 'shop'){
									localStorage.setItem("shopaccessToken",accessToken);
									localStorage.setItem("shopmobile",mobile);
									localStorage.setItem("shopid",id);
									localStorage.setItem('shoparea_id',area_id);
								}
								
							}
							if(mobile&&userType&&clientId&&accessToken){
								var tokens = [{
								"mobile":mobile,
								"userType":userType,
								"clientId":clientId,
								"accessToken":accessToken
								}]
							}else{
								var tokens = [];
							}
							sendnotifycid(tokens,window.notifyCid,clientType);
							mui.toast(res.message,{ duration:'long', type:'div' }) 
							console.log(accessToken);
							setTimeout(function(){
							    if(accessToken && accessToken.length >0){
									if(userType){
										var skipurl = 'app/frame/tab-webview-main.html';
									}
									console.log(skipurl);
									location.href=skipurl;
								}
							}, 500)
							setTimeout(function(){
								plus.webview.currentWebview().close('none');
							}, 600)
						}else{
							mui.toast(res.message,{ duration:'long', type:'div' });
							return false;
						}
					},
					error: function(data) {
						$("#my-mask").hide();
						mui.toast(res.message,{ duration:'long', type:'div' });
						console.log(JSON.stringify(data));
					}
				});
			}
		});
		
		$('html').on('click','.btn-back',function(){
			localStorage.setItem('userType',window.returntype)
			mui.back();
		})
		
		
		$('html').on('click','.sginup',function(){
			window.location.href="Register.html";
		})
		
		$('html').on('click','.forget',function(){
			window.location.href="Retrieve.html";
		})
		
		//选择用户类型
		$('.btn-slect').click(function() {
			$(this).addClass('btn-active').parent().siblings().children('button').removeClass('btn-active');
			var userType = $(this).val()
			$(".userType").val(userType);
		});
	});
})