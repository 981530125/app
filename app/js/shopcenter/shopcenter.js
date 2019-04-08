$(function(){
//	获取参数
	mui.plusReady(function() {
		// 获取本地应用资源版本号
	    plus.runtime.getProperty(plus.runtime.appid,function(inf){
	        window.wgtVer=inf.version;
	        window.appid = inf.appid
	        console.log("当前应用版本："+wgtVer);
	    });
	    var info = plus.push.getClientInfo();
	    window.notifyCid = info.clientid;
	    
	})
//获取商家中心信息
//	下拉刷新
    window.pulldown = 'false';
    window.pullup = 'false';
	//	返回刷新
//	window.addEventListener('refresh', function(e){//执行刷新  
//	  if(e.detail.reload == 'true'){
//	  	pulldownRefresh();
//	  }
//	});
	
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			}
		}
	});


	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		setTimeout(function() {
			getcenter();
		}, 1500);
	}
	
//	getcenter();

	function getcenter(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				loginway:loginway
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
					res.data.rooturl = rooturl;
					var userinfodata = res.data;
			//		// 抓取模板数据
					var contenttpl = $("#content-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = userinfodata;
					// 把数据传送到模板
					var text = rcontenttp(data);
					// 更新到模板
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
						// 更新到模板
						$('#center-content').html(text);
					}
					
					if(userinfodata.licenses){
						var licenses_id = userinfodata.licenses[0].id;
					}
					window.stasticmessage = res.data.stastic;
					window.licenses_id = licenses_id;
					shopinfobylicenses_id('',licenses_id);
					console.log(JSON.stringify(res))
					
					checkversion();
					
					if(mobile&&userType&&userType&&accessToken){
						var tokens = [{
						"mobile":mobile,
						"userType":userType,
						"clientId":clientId,
						"accessToken":accessToken
						}]
					}else{
						var tokens = [];
					}
//					发送推送
					sendnotifycid(tokens,window.notifyCid,clientType);
					mui.toast(res.message);
				}else{
					mui.alert(res.message);
					localStorage.removeItem("shopaccessToken");
					mui.openWindow({
						url: '../../signup.html',
						id: 'signup'
					});
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
	
	
	//	检测更新方法
	function checkversion(clicknum){
		var url = rooturl + 'index.php/Api_resource/appUpdate'; //获取app最新版本
		$.ajax({
			url: url,
			data: {
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
					//		当前版本
					var newversion = res.data.version;
					var wgtVer = window.wgtVer;
					
					if(newversion&&wgtVer&&newversion!= wgtVer){
						plus.nativeUI.showWaiting("检测到更新...");
						
						var wgtUrl = rooturl+res.data.url;
						
						setTimeout(function() {
							plus.nativeUI.closeWaiting();
							var btnArray = ['否', '是'];
							mui.confirm('当前版本为'+wgtVer+',检测到最新版本'+newversion+',修复'+res.data.note+',是否进行更新?', '检测更新', btnArray, function(e) {
								if (e.index == 1) {
//									var wgtUrl = 'http://jk.cnvp.com/apps/apk/H5026F447.wgt';
//									plus.nativeUI.alert("暂未完成^-^！");
									downWgt(wgtUrl);  // 下载升级包
								} else {
									mui.toast('取消');
								}
							})
						}, 1000)
					}
					if(clicknum == '1'){
						if(newversion&&wgtVer&&newversion == wgtVer){
							mui.alert('当前为最新版本'+wgtVer+'!')
						}
					}
					
					
				} else {
					console.log(res.message);
				}
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				console.log(res.message);
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
//	点击检测更新
	$('html').on('click','.myupdate',function(){
//		当前版本
		var wgtVer = window.wgtVer;
		console.log(wgtVer);
		var clicknum = '1';
		checkversion(clicknum)
	})
	
	// 下载wgt文件
//	var wgtUrl="http://demo.dcloud.net.cn/test/update/H5EF3C469.wgt";
	function downWgt(wgtUrl){
	    plus.nativeUI.showWaiting("下载更新文件...");
	    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
	        if ( status == 200 ) {
	            console.log("下载wgt成功："+d.filename);
	            installWgt(d.filename); // 安装wgt包
	        } else {
	            console.log("下载wgt失败！");
	            plus.nativeUI.alert("下载更新文件失败！");
	        }
	        plus.nativeUI.closeWaiting();
	    }).start();
	}
	
	// 更新应用资源
	function installWgt(path){
	    plus.nativeUI.showWaiting("安装更新文件...");
	    plus.runtime.install(path,{},function(){
	        plus.nativeUI.closeWaiting();
	        console.log("安装wgt文件成功！");
	        plus.nativeUI.alert("应用资源更新完成！",function(){
	            plus.runtime.restart();
	        });
	    },function(e){
	        plus.nativeUI.closeWaiting();
	        console.log("安装wgt文件失败["+e.code+"]："+e.message);
	        plus.nativeUI.alert("安装更新文件失败["+e.code+"]："+e.message);
	    });
	}
	
	
	
	function shopinfobylicenses_id(check_level,licenseId){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId'; //获取账号中心首页
		if(check_level){
			var check_level = check_level;
		}else{
			var check_level = '';
		}
		if(licenseId){
			var licenseId = licenseId;
		}else{
			var licenseId = '';
		}
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				licenseId:licenseId,
				check_level:check_level,
				loginway:loginway
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
					console.log(JSON.stringify(res.data));
					console.log('cc');
					window.shopinfo = res.data;
					mui.toast(res.message);
				}else{
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
	
//	点击修改个人信息
	$('html').on('click','.setshopinfo',function(){
		var skipurl = '../managecenter/editinfo/editmanageinfo.html';
		mui.openWindow({
			url: skipurl,
		});
	})
	
	//点击查看我的任务
	$('html').on('click', '.my-task-unitem', function(event) {
		var typeid = this.getAttribute("data-id");
		var tasktype = this.getAttribute("data-tasktype");
		var activeTab = this.getAttribute("data-url");
		if(tasktype == 'activity'){
			var tourl = 'dishmanage.html';
		}
		if(tasktype == 'dishmenu'){
			var tourl = 'foodmanage.html';
		}
		if(tasktype == 'records'){
			var tourl = 'recordsmanage.html';
		}
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'51px',//新页面底部位置
		    },
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
	});
//	点击查看待整改
	$('html').on('click','.wait-change',function(event){
		
		var tourl = 'recordsmanage.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'51px',//新页面底部位置
		    },
		    extras:{
		    	recordType:'wait_recheck'
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
	})
	
	
	
	
	//点击查看商家信息
	$("html").on('click','.shopinfo',function(){
		console.log(window.shopinfo);		
		
		if(window.shopinfo){
			var shopinfo = window.shopinfo;
		}
		var tourl = 'shopinfo.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	shopinfo:shopinfo
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
	
	//点击查看证书信息
	$("html").on('click','.cerbook',function(){
		if(window.shopinfo){
			var shopinfo = window.shopinfo;
		}
		var tourl = 'shopcerbook.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	shopinfo:shopinfo
		      //自定义扩展参数，可以用来处理页面间传值1
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	});
	
	
	//点击辅助材料
	$("html").on('click','.indirect',function(){
		if(window.shopinfo){
			var shopinfo = window.shopinfo;
		}
		var tourl = 'shopmaterial.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
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
	
	//点击健康证
	$("html").on('click','.healthcertificate',function(){
		if(window.shopinfo){
			var shopinfo = window.shopinfo;
		}
		var tourl = 'healthcertificate.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
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
	
	
	
	
//	点击查看通知
	$("html").on('click','#notice',function(){
//		var tourl = '../shopmessage/notice.html';
		var tourl = '../shopmessage/shopmessage.html';
//		var tourl = '../notice/notice.html';  点击查看消息通知
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
	
//	点击跳转二维码
	$("html").on('click','.barcode',function(){
		var tourl = 'barcode.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
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
	
	
	managecenter = function(){
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
							    	userType: 'shop',
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
	}
	
	
	minecenter = function(){
		var btnArray = ['取消', '确认'];
		mui.confirm('是否确定切换到个人中心？', '', btnArray, function(e) {
			if (e.index == 1) {
				//打开管理页面
				if(localStorage.getItem("accessToken")){
					localStorage.setItem('userType','user');
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
							    	userType: 'shop',
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
				 localStorage.removeItem('loginway');
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
				 	if(userType){
				 		plus.runtime.restart();
				 	}else{
				 		plus.runtime.restart();
				 	}
					//在关闭窗口代码上加入延迟
//					setTimeout(function(){
//					    plus.webview.currentWebview().close('none');
//					}, 1000)
				}
			} else {
				mui.toast('取消退出');
			}
		})
	}
})
