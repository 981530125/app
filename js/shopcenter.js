$(function(){
		
	//获取中心信息
//	getcenter();
//	var shopinfo = localStorage.getItem('shopinfo');
//	if(shopinfo){
////		console.log(userinfo);
//		var userinfodata = JSON.parse(shopinfo);
//		console.log(JSON.stringify(userinfodata.user_info));
////		// 抓取模板数据
//		var contenttpl = $("#content-template").html();
//		// 编译模板
//		var rcontenttp = Handlebars.compile(contenttpl);
//		var data = userinfodata;
//		// 把数据传送到模板
//
//		var text = rcontenttp(data);
//		// 更新到模板
//		$('#center-content').html(text);
//		
//	}else{
	
		if(accessToken){
			getcenter();
		}else{
			mui.toast('账号未登录，请登录！');
			mui.openWindow({
			    url: 'signup.html',
			    id:'signup'
			});
		}
	
		
//	}
	function getcenter(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken
			},
			type: 'post',
			dataType: 'json',
			crossDomain: true,
			cache: true,
			beforeSend: function(xhr) { //beforeSend定义全局变量
				xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
			},
			success: function(res) {
				if(res.code && res.code == 1000){
					var admininfo = JSON.stringify(res.data);
					localStorage.setItem("shopinfo",admininfo);
					var userinfodata = JSON.parse(admininfo);
			//		// 抓取模板数据
					var contenttpl = $("#content-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = userinfodata;
					// 把数据传送到模板
			
					var text = rcontenttp(data);
					// 更新到模板
					$('#center-content').html(text);
				}else{
					if(res.message == '您未登录或已失效'){
						localStorage.setItem('shopaccessToken','');
						mui.openWindow({
						    url: 'signup.html',
						    id:'signup'
						});
					}
					mui.alert(res.message);
					return false;
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'long', type:'div' });
				return false;
			}
		})
	}
	managecenter = function(){
		var btnArray = ['取消', '确认'];
		mui.confirm('是否确定切换到管理中心？', '', btnArray, function(e) {
			if (e.index == 1) {
				//打开管理页面
				if(localStorage.getItem("adminaccessToken")){
					mui.openWindow({
					    url: 'managecenter.html',
					    id:'managecenter'
					});
					localStorage.setItem('userType','admin');
					  //在关闭窗口代码上加入延迟
					setTimeout(function(){
						plus.webview.currentWebview().close('none');
					}, 1000)
				}else{
					mui.toast('账号未登录，请登录！');
					mui.openWindow({
					    url: 'signup.html',
					    id:'signup'
					});
					localStorage.setItem('userType','admin');
					return false;
				}
				
			} else {
				mui.toast('取消');
			}
		})
	}
	
	
	minecenter = function(){
		var btnArray = ['取消', '确认'];
		mui.confirm('是否确定切换到个人中心？', '', btnArray, function(e) {
			if (e.index == 1) {
				//打开管理页面
				if(localStorage.getItem("accessToken")){
					mui.openWindow({
					    url: 'Individualcenter.html',
					    id:'Individualcenter'
					});
					localStorage.setItem('userType','user');
					  //在关闭窗口代码上加入延迟
					setTimeout(function(){
						plus.webview.currentWebview().close('none');
					}, 1000)
				}else{
					mui.toast('账号未登录，请登录！');
					mui.openWindow({
					    url: 'signup.html',
					    id:'signup'
					});
					localStorage.setItem('userType','user');
					return false;
				}
				
			} else {
				mui.toast('取消');
			}
		})
	}
	
	quit = function(){
		var btnArray = ['取消', '确认'];
		mui.confirm('是否确定退出登录？', '', btnArray, function(e) {
			if (e.index == 1) {
				localStorage.removeItem("shopmobile");
				 localStorage.removeItem("shopaccessToken");
				 if(localStorage.getItem("adminmobile") && localStorage.getItem("adminaccessToken")){
				 	localStorage.setItem('userType','admin');
				 }else if(localStorage.getItem("mobile") && localStorage.getItem("accessToken")){
				 	localStorage.setItem('userType','user');
				 }else{
				 	localStorage.setItem('userType','');
				 }
	
				if(userType == 'shop'){
				 	mui.toast('退出失败');
				}else{
				 	mui.toast('退出成功');
				 	var userType = localStorage.getItem("userType");
				 	if(userType == 'admin'){
				 		mui.openWindow({
						    url: 'managecenter.html',
						});
				 	}else if(userType == 'user'){
				 		mui.openWindow({
						    url: 'Individualcenter.html',
						});
				 	}else{
				 		mui.openWindow({
						    url: 'signup.html',
						});
				 	}
					//在关闭窗口代码上加入延迟
					setTimeout(function(){
					    plus.webview.currentWebview().close('none');
					}, 1000)
				}
			} else {
				mui.toast('取消退出');
			}
		})
	}
})
