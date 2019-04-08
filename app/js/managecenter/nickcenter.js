$(function() {
	var rootpower = [
//		{
//			obj:'#center-content',
//			apiurl:'/index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'
//		},
		{
			obj:'#notice',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Message/getMessageList'
		},{
			obj:'#admin-task',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_task/adminSelfInvestigateTask'
		},{
			obj:'#admin-record',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record/adminSelfInvestigateRecord'
		},{
			obj:'.tosetbusiness',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Map/surroundingLicenseShop'
		},{
			obj:'.shopauxiliary',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record_file/getAdminSelfInvestigateRecordFile'
		},{
			obj:'.newrecords',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Announcement/pageData'
		},{
			obj:'.checkcenter',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Api_apps_logged/reviewCenter'
		},{
			obj:'.myedit',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Api_apps_logged/changeSelfInfo'
		},{
			obj:'.myupdate',
			apiurl:'/index.php/Api_resource/appUpdate'
		},{
			obj:'.simple-statistics',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Simple_statistics/pageData'
		}];
	//	获取参数
	mui.plusReady(function() {
		getCertificateType();
		//首页返回键处理
		//处理逻辑：2秒内，连续两次按返回键，则退出应用
		mui.back = function() {
	  		var first = null;
	  		plus.key.addEventListener('backbutton', function(){
	  			//首次按键，提示‘再按一次退出应用’
	  			if(!first){
	  				first = new Date().getTime();
	  				mui.toast('再按一次退出应用');
	  				setTimeout(function(){
	  					first = null;
	  				},2000);
	  			} else {
	  				if(new Date().getTime() - first < 2000){
	  					plus.runtime.quit();
	  				}
	  			}
	  		}, false);
	  	}
		
		
		// 获取本地应用资源版本号
	    plus.runtime.getProperty(plus.runtime.appid,function(inf){
	        window.wgtVer=inf.version;
	        
	        window.appid = inf.appid
	        
	        console.log("当前应用版本："+wgtVer);
	    });
	    var info = plus.push.getClientInfo();
	    window.notifyCid = info.clientid;
	})
	
	var pulldown = 'true';
	mui.init({
		swipeBack: false,
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
		
		console.log(accessToken);
		
		setTimeout(function() {
			console.log(accessToken);
			pulldown = 'false';
			getcenter();
		}, 1000);
	}

	//获取中心信息
	//	var accessToken = localStorage.getItem("adminaccessToken");
//	getcenter();

	function getcenter() {
		console.log(accessToken);
		
		console.log(loginway);
		console.log(mobile);
		console.log(userType);
		console.log(clientType);
		console.log(clientId);
		//		// 抓取模板数据
		var contenttpl = $("#content-template").html();
		// 编译模板
		var rcontenttp = Handlebars.compile(contenttpl);
		
		var data = {
		    user_info: {
		    	name:'匿名用户',
		    }
		};
		// 把数据传送到模板
		var text = rcontenttp(data);
		// 更新到模板
		$('#center-content').html(text);
		if(pulldown == 'false') {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		}
		return false;
		
		var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'; //获取账号中心首页
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
				//					prompt('asas',JSON.stringify(res));
				if(res.code && res.code == 1000) {
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
//					获取管理员权限
					getbadpower(mobile,userType,clientType,clientId,accessToken);
					
					var admininfo = JSON.stringify(res.data);
					console.log(admininfo);
					localStorage.setItem("admininfo", admininfo);
					res.data.rooturl = rooturl;
					var userinfodata = res.data;
					window.stasticmessage = res.data.stastic;
					var data = userinfodata;
					// 把数据传送到模板
					var text = rcontenttp(data);
					// 更新到模板
					$('#center-content').html(text);
					
					checkversion();
					
//					权限配置
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
					}
				} else {
					mui.alert(res.message);
					localStorage.removeItem("adminaccessToken");
					plus.runtime.restart();
				}
				mui.toast(res.message,{ duration:'short', type:'div' });
				if(pulldown == 'false') {
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				}
			},
			error: function(res) {
				mui.alert(res.message);
				return false;
				localStorage.removeItem("adminaccessToken");
				mui.openWindow({
					url: '../../signup.html',
					id: 'signup'
				});
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message, {
					duration: 'long',
					type: 'div'
				});
			}
		})
	}

	//点击查看我的任务
	$('html').on('click', '.my-task-unitem', function(event) {
		var typeid = this.getAttribute("data-id");
		var tasktype = this.getAttribute("data-tasktype");
		var activeTab = this.getAttribute("data-url");
		mui.openWindow({
			url: '../managecenter/mytask/mytask.html',
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
			url: '../managecenter/myrecords/myrecords.html',
			id: 'myrecords',
			extras: {
				typeid: typeid, //扩展参数
				tasktype: tasktype,
				activeTab: activeTab
			}
		});
		event.stopPropagation();
	});
	
	//我的过期情况
	$('html').on('click', '.my-expire-unitem', function(event) {
		var typeid = $(this).attr("data-id");
		var tasktype = $(this).attr("data-type");
		var activeTab = $(this).attr("data-url");
		
		mui.openWindow({
			url: '../managecenter/setbusiness/offcanvas-drag-left-plus-main.html',
			id: 'offcanvas-drag-left-plus-main',
			extras: {
				typeid: typeid, //扩展参数
				tasktype: tasktype,
				activeTab: activeTab
			}
		});
		event.stopPropagation();
	});
	
	
	//	点击查看通知
	$("html").on('click','#notice',function(){
//		var tourl = '../message/notice.html';
		var tourl = '../message/message.html';
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
	
	
	//	点击查看通知
	$("html").on('click','.simple-statistics',function(){
		var tourl = '../managecenter/statistics/statistics.html';
//		var tourl = '../managecenter/statistics/offcanvas-drag-left-plus-main.html';
		
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	licensetype:window.license
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
	
	//获取证书筛选类型
	function getCertificateType(areaId){
		if(areaId){
			var areaId = '';
		}
		var url = rooturl+'index.php/Api_apps/getLicenseTypeInfoByData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				areaId:areaId
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					window.selecttype = res.data;
					var infotype = res.data;
					var license = [];
					var item = {
						value:res.data.type,
						text:res.data.name
					}
					for(var items in infotype){
						var item = {
							value: infotype[items].type,
							text:infotype[items].name
						}
						license.push(item);
					}
					window.license = license;
					
				}else{
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
			}
		})
	}
	
	
	//跳转asda
	$('html').on('click', '.asda', function() {
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
	
	//	检测更新方法,appid需要相同，两种更新方式，一种apk更新，一种wgt
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
	
//点击打印
	$('html').on('click','.myprint',function(){
		var tourl = '../managecenter/myprint/myprint.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
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
	

	
	

	//		切换类型
	$('html').on('click', '#managecenter', function(event) {
		var btnArray = ['取消', '确认'];
		mui.confirm('是否确定切换到个人中心？', '', btnArray, function(e) {
			if(e.index == 1) {
				//打开管理页面
				if(localStorage.getItem("accessToken")) {
					localStorage.setItem('userType', 'user');
					plus.runtime.restart();
				} else {
					mui.toast('账号未登录，请登录！');
					var current = plus.webview.getWebviewById('../../signup.html');
					if(current){
						plus.webview.close('../../signup.html');
					}else{
						console.log(JSON.stringify(current));
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
							    	userType: 'admin',
							    	myswitch:'true'
							      //自定义扩展参数，可以用来处理页面间传值1
							    },
							    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
							    show:{
							      autoShow:true,//页面loaded事件发生后自动显示，默认为true
							      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
							      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
							    }
							})
						}, 500);
					}
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
					localStorage.setItem('userType', 'shop');
					plus.runtime.restart();
				} else {
					mui.toast('账号未登录，请登录！');
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
						    	userType: 'admin',
						    	myswitch:'true'
						      //自定义扩展参数，可以用来处理页面间传值1
						    },
						    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
						    show:{
						      autoShow:true,//页面loaded事件发生后自动显示，默认为true
						      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
						      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
						    }
						})
					}, 500);
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
				localStorage.removeItem('loginway');
				if(localStorage.getItem("mobile") && localStorage.getItem("accessToken")) {
					localStorage.setItem('userType', 'user');
				} else if(localStorage.getItem("shopmobile") && localStorage.getItem("shopaccessToken")) {
					localStorage.setItem('userType', 'shop');
				} else {
					localStorage.setItem('userType', '');
				}

				if(userType == 'admin') {
					mui.toast('退出失败');
				} else {
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
					var userType = localStorage.getItem("userType");
					
					if(userType) {
						plus.runtime.restart();
					} else {
						plus.runtime.restart();
					}
					mui.toast('退出成功');
					//在关闭窗口代码上加入延迟
					setTimeout(function() {
						plus.webview.currentWebview().close('none');
					}, 2000)
				}
			} else {
				mui.toast('取消退出');
			}
		})
		event.stopPropagation();
	})
});

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
}
//setbusiness跳转到管辖商家
$('html').on('click', '.tosetbusiness', function(event) {
//	var skipurl = '../managecenter/setbusiness/setbusiness.html';
	var skipurl = '../managecenter/setbusiness/offcanvas-drag-left-plus-main.html';
	mui.openWindow({
		url: skipurl,
	});
	event.stopPropagation();
})
//管理中心个人资料编辑
//function toedit() {
//	var skipurl = '../../managecenter/editmanageinfo.html';
//	mui.openWindow({
//		url: skipurl,
//	});
//}
$('html').on('click','.myedit',function(){
	var skipurl = '../managecenter/editinfo/editmanageinfo.html';
	mui.openWindow({
		url: skipurl,
	});
})

$('html').on('click','.newrecords',function(){
	var skipurl = '../managecenter/newrecord/allrecords.html';
	mui.openWindow({
		url: skipurl,
	});
})

//审核中心
$('html').on('click','.checkcenter',function(){
	var skipurl = '../managecenter/checkcenter/check.html';
	mui.openWindow({
		url: skipurl,
	});
//	var skipurl = '../managecenter/checkcenter/checkcenter.html';
//	mui.openWindow({
//		url: skipurl,
//	});
})


//管理中心辅助材料编辑
$('html').on('click', '.shopauxiliary', function(event) {
	var skipurl = '../managecenter/shopauxiliary/shopauxiliary.html';
	mui.openWindow({
		url: skipurl,
	});
	event.stopPropagation();
})

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
            
//          div.style.left = touch.screenX + 'px';
//          div.style.top = touch.screenY + 'px';
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
})

//点击取消
$('html').on('click','.tocalcel',function(){
	$('.mypop').hide();
})


function run() {
	var skipurl = '/app/frame/tab-webview-main.html';
	mui.openWindow({
		url: skipurl,
	});
}

function up(){
	var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/multiUpload'; //获取账号中心首页
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
			//					prompt('asas',JSON.stringify(res));
			if(res.code && res.code == 1000) {
				var admininfo = JSON.stringify(res.data);
				console.log(admininfo);
				localStorage.setItem("admininfo", admininfo);
				res.data.rooturl = rooturl;
				var userinfodata = res.data;
				var data = userinfodata;
				// 把数据传送到模板
				var text = rcontenttp(data);
				// 更新到模板
				$('#center-content').html(text);
				
				checkversion();
				
			} else {
				mui.alert(res.message);
				localStorage.removeItem("adminaccessToken");
				plus.runtime.restart();
			}
			mui.toast(res.message,{ duration:'long', type:'div' });
			if(pulldown == 'false') {
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}

		},
		error: function(res) {
			mui.alert(res.message);
			
			return false;
			localStorage.removeItem("adminaccessToken");
			mui.openWindow({
				url: '../../signup.html',
				id: 'signup'
			});
			//					prompt('asas',JSON.stringify(res));
			console.log(res.message);
			console.log(res.data);
			mui.toast(res.message, {
				duration: 'long',
				type: 'div'
			});
		}
	})
}
