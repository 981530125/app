$(function(){

		$('html').on('click','#managecenter',function(){
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
	});
		$('html').on('click','#shopcenter',function(){
		var btnArray = ['取消', '确认'];
		mui.confirm('是否确定切换到企业中心？', '', btnArray, function(e) {
			if (e.index == 1) {
				//打开管理页面
				if(localStorage.getItem("shopaccessToken")){
					mui.openWindow({
					    url: 'shopcenter.html',
					    id:'shopcenter'
					});
					localStorage.setItem('userType','shop');
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
					localStorage.setItem('userType','shop');
					return false;
				}
				
			} else {
				mui.toast('取消');
			}
		})
	});
		$('html').on('click','#notice',function(){
	  //打开管理页面
	  mui.openWindow({
	    url: 'notice.html', 
	    id:'notice'
	  });
	});
})
