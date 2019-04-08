$(function(){
	//	下拉刷新
    window.pulldown = 'false';
    window.pullup = 'false';
    
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			},
			up: {
				auto:false,
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		setTimeout(function() {
			getmessage();
		}, 1500);
	}
	window.page = 2;
	function pullupRefresh() {
		window.pullup = 'true';
		console.log($("#userResult").html());
		var type = $("#userResult").html();
		setTimeout(function() {
//			暂无信息
			getmessage('','','',page,type);
		}, 1500);
	}
	
	//点击切换
	$('.all-li').click(function() {
		var id = $(this).attr('data-id');
		var tasktype = $(this).attr('data-tasktype');
		window.tasktype = tasktype;
		gettypeitem(id);
	});
	//根据id切换选项卡
	function gettypeitem(id){
		var len = $(".menulist").length;
		for(var n = 0;n<len;n++){
			$(".menulist").eq(n).hide();
		}
		$(".menulist").eq(id).show();
		$('.all-li').eq(id).siblings('.all-li').removeClass('all-active');
		$('.all-li').eq(id).addClass('all-active');	
//		if(id == '1'){
//			mui.alert('待完善中。。。');
//		}
	}
	

	function getmessage(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Notification_message/getMessageList'; //获取账号中心首页
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
				console.log('1212');
				if(res.code && res.code == 1000){
					if(res.data){
						res.data.rooturl = rooturl;
						var userinfodata = res.data;
						window.userinfodata = res.data;
						// 抓取模板数据
						var contenttpl = $("#notice-template").html();
						// 编译模板
						var rcontenttp = Handlebars.compile(contenttpl);
						var data = userinfodata;
						// 把数据传送到模板
				
						var noticeCompiledHtml = rcontenttp(data);
						
						
						// 更新到模板
						if(window.pulldown == 'true'){
							mui('#pullrefresh').pullRefresh().endPulldown();
							window.pulldown = 'false';
							// 更新到模板
							$('#notice-content').html(noticeCompiledHtml);
						}
						if(window.pullup == 'true'){
							window.page = window.page+1;
							if(res.data == null || res.data.length == 0){
								var ispull = true;
							}else{
								var ispull = false;
							}
							$('#notice-content').append(noticeCompiledHtml);
							mui('#pullrefresh').pullRefresh().endPullup(ispull); //参数为true代表没有更多数据了。
							window.pullup = 'false';
						}
						
					}else{
						// 更新到模板
						if(window.pulldown == 'true'){
							mui('#pullrefresh').pullRefresh().endPulldown();
							window.pulldown = 'false';
							// 更新到模板
						}
					}
					
					
					mui.toast(res.message);
				}else{
					// 更新到模板
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
						// 更新到模板
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
	
	$('html').on('click','.getmessage',function(){
		var id = $(this).attr('data-id');
		var userinfodata = window.userinfodata;
		var messagecontent = [];
		for(var mitem in userinfodata){
			if(userinfodata[mitem].id == id){
				var messagecontent = userinfodata[mitem];
			}
		}
		var tourl = 'noticecontent.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	messagecontent:messagecontent
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
	
	//	点击查看推送
	$('html').on('click','.getpushdata',function(){
		var id = $(this).attr('data-id');
		
		var tourl = 'pushcontent.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	notice_id:id
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
	
//	点击添加
	$("html").on('click','#add-message',function(){
		var tasktype = window.tasktype;
		if(tasktype == 'push'){
			var tourl = 'newpush.html'
			mui.openWindow({
			    url:tourl,
			    id:tourl,
			    styles:{
			      top: '0',//新页面顶部位置
			      bottom:'0',//新页面底部位置
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
		}else{
			var tourl = 'newmessage.html'
			mui.openWindow({
			    url:tourl,
			    id:tourl,
			    styles:{
			      top: '0',//新页面顶部位置
			      bottom:'0',//新页面底部位置
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
		}
	})
	
})

