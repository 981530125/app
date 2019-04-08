$(function() {
	
	console.log('3123');
	
	mui.plusReady(function() {
		config();
		//获取中心信息
		//	var accessToken = localStorage.getItem("adminaccessToken");
		getcenter();
		var info = plus.push.getClientInfo();
	    window.notifyCid = info.clientid;

		function getcenter() {
			console.log(accessToken);
			console.log(mobile);
			console.log(userType);
			console.log(clientType);
			//		// 抓取模板数据
			var contenttpl = $("#content-template").html();
			// 编译模板
			var rcontenttp = Handlebars.compile(contenttpl);
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'; //获取账号中心首页
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
//					prompt('asas',JSON.stringify(res));
					if(res.code && res.code == 1000) {
						var admininfo = JSON.stringify(res.data);
						localStorage.setItem("admininfo", admininfo);
						var userinfodata = res.data;

						var data = userinfodata;
						// 把数据传送到模板

						var text = rcontenttp(data);
						// 更新到模板
						$('#center-content').html(text);
					} else {
						mui.alert(res.message);
						localStorage.removeItem("adminaccessToken");
						mui.openWindow({
							url: 'signup.html',
							id: 'signup'
						});
						return false;
					}
				},
				error: function(res) {
					mui.alert(res.message);
						localStorage.removeItem("adminaccessToken");
						mui.openWindow({
							url: 'signup.html',
							id: 'signup'
						});
//					prompt('asas',JSON.stringify(res));
					console.log(res.message);
					console.log(res.data);
					mui.toast(res.message, {
						duration: 'long',
						type: 'div'
					});
					return false;
				}
			})
		}

		//点击查看我的任务
		$('html').on('click', '.my-task-unitem', function(event) {
			var typeid = this.getAttribute("data-id");
			var tasktype = this.getAttribute("data-tasktype");
			var activeTab = this.getAttribute("data-url");
			mui.openWindow({
				url: 'mytask.html',
				id: 'mytask',
				extras: {
					typeid: typeid, //扩展参数
					tasktype: tasktype,
					activeTab: activeTab
				}
			});
			event.stopPropagation();
		});
//我的检查记录
		$('html').on('click', '.my-record-unitem', function(event) {
			var typeid = $(this).attr("data-id");
			var tasktype = $(this).attr("data-tasktype");
			var activeTab = $(this).attr("data-url");
			
			mui.openWindow({
				url: 'myrecords.html',
				id: 'myrecords',
				extras: {
					typeid: typeid, //扩展参数
					tasktype: tasktype,
					activeTab: activeTab
				}
			});
			event.stopPropagation();
		});
//跳转asda
	$('html').on('click','.asda',function(){
		console.log('2323');
		
		var typeid = $(this).attr("data-id");
		var tasktype = $(this).attr("data-tasktype");
		var activeTab = $(this).attr("data-url");
		
		mui.openWindow({
			url: 'myrecords.html',
			id: 'myrecords',
			extras: {
				typeid: typeid, //扩展参数
				tasktype: tasktype,
				activeTab: activeTab
			}
		});
	});
		
		
		
//		切换类型
		$('html').on('click', '#managecenter', function(event) {
			var btnArray = ['取消', '确认'];
			mui.confirm('是否确定切换到个人中心？', '', btnArray, function(e) {
				if(e.index == 1) {
					//打开管理页面
					if(localStorage.getItem("accessToken")) {
						mui.openWindow({
							url: 'Individualcenter.html',
							id: 'Individualcenter'
						});
						localStorage.setItem('userType', 'user');
						//在关闭窗口代码上加入延迟
						setTimeout(function() {
							plus.webview.currentWebview().close('none');
						}, 1000)
					} else {
						mui.toast('账号未登录，请登录！');
						mui.openWindow({
							url: 'signup.html',
							id: 'signup'
						});
						localStorage.setItem('userType', 'user');
						return false;
					}

				} else {
					mui.toast('取消');
				}
			})
			event.stopPropagation();
		});
		$('html').on('click', '#shopcenter', function(event) {
			var btnArray = ['取消', '确认'];
			mui.confirm('是否确定切换到企业中心？', '', btnArray, function(e) {
				if(e.index == 1) {
					//打开管理页面
					if(localStorage.getItem("shopaccessToken")) {
						mui.openWindow({
							url: 'shopcenter.html',
							id: 'shopcenter'
						});
						localStorage.setItem('userType', 'shop');
						//在关闭窗口代码上加入延迟
						setTimeout(function() {
							plus.webview.currentWebview().close('none');
						}, 1000)
					} else {
						mui.toast('账号未登录，请登录！');
						mui.openWindow({
							url: 'signup.html',
							id: 'signup'
						});
						localStorage.setItem('userType', 'shop');
						return false;
					}

				} else {
					mui.toast('取消');
				}
			})
			event.stopPropagation();
		});
		//退出登录
		$('html').on('click', '#quit', function(event) {
			var btnArray = ['取消', '确认'];
			mui.confirm('是否确定退出登录？', '', btnArray, function(e) {
				if(e.index == 1) {
					localStorage.removeItem("admininfo");
					localStorage.removeItem("adminmobile");
					localStorage.removeItem("adminaccessToken");
					if(localStorage.getItem("mobile") && localStorage.getItem("accessToken")) {
						localStorage.setItem('userType', 'user');
					} else if(localStorage.getItem("shopmobile") && localStorage.getItem("shopaccessToken")) {
						localStorage.setItem('userType', 'shop');
					} else {
						localStorage.setItem('userType', '');
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
					
					var tokens = [];
					sendnotifycid(tokens,window.notifyCid,clientType);
					

					if(userType == 'admin') {
						mui.toast('退出失败');
					} else {
						mui.toast('退出成功');
						var userType = localStorage.getItem("userType");
						if(userType == 'user') {
							mui.openWindow({
								url: 'Individualcenter.html',
							});
						} else if(userType == 'shop') {
							mui.openWindow({
								url: 'shopcenter.html',
							});
						} else {
							mui.openWindow({
								url: 'signup.html',
							});
						}

						//在关闭窗口代码上加入延迟
						setTimeout(function() {
							plus.webview.currentWebview().close('none');
						}, 1000)
					}
				} else {
					mui.toast('取消退出');
				}
			})
			event.stopPropagation();
		})
	});
})
//跳转到首页
function toindex() {
	var skipurl = 'Mappage.html';
	mui.openWindow({
		url: skipurl,
	});
	//在关闭窗口代码上加入延迟
	setTimeout(function() {
		plus.webview.currentWebview().close('none');
	}, 1000)
}
//跳转到附近页
function toarround() {
	var skipurl = 'Shoplist.html';
	mui.openWindow({
		url: skipurl,
	});
	//在关闭窗口代码上加入延迟
	setTimeout(function() {
		plus.webview.currentWebview().close('none');
	}, 1000)
}
//跳转到当前页
function toaim() {
	var skipurl = 'managecenter.html';
	mui.openWindow({
		url: skipurl,
	});
	//	//在关闭窗口代码上加入延迟
	//	setTimeout(function(){
	//	    plus.webview.currentWebview().close('none');
	//	}, 1000)
}

//setbusiness跳转到管辖商家
$('html').on('click','.tosetbusiness',function(){
	var skipurl = 'setbusiness.html';
	mui.openWindow({
		url: skipurl,
	});
})
//管理中心辅助材料编辑
$('html').on('click','.shopauxiliary',function(){
	var skipurl = 'shopauxiliary.html';
	mui.openWindow({
		url: skipurl,
	});
})
//管理中心个人资料编辑
function toedit() {
	var skipurl = 'editmanageinfo.html';
	mui.openWindow({
		url: skipurl,
	});
}

function run(){
	var skipurl = '/app/frame/tab-webview-main.html';
	mui.openWindow({
		url: skipurl,
	});
}
