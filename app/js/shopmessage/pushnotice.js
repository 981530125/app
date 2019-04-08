(function($, doc) {
	$.init();
})(mui, document);
$(function(){
	window.tasktype = 'notice';
	window.pickertype = '全部';
//	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新
		console.log(e.detail.reload);
		console.log('1212');
	  	if(e.detail.reload == 'true'){
	  		location.reload();
	  	}
	});
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
	window.page = 2;
	function pullupRefresh() {
		window.pullup = 'true';
		console.log($("#userResult").html());
		var type = window.pickertype;
		var searchkey = $('.searchkey').val();
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		var start_time = $('.start_time').val();
		if(start_time){
			var start_time = start_time;
		}else{
			var start_time = '';
		}
		var end_time = $('.end_time').val();
		if(end_time){
			var end_time = end_time;
		}else{
			var end_time = '';
		}
		setTimeout(function() {
//			暂无信息
			getpushmessage(start_time,end_time,searchkey,window.page,type);
		}, 1500);
	}
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		var prev = plus.webview.currentWebview().opener();
		setTimeout(function() {
			mui.fire(prev, 'changetype',{
				reload:'true',
				type:'push',
				changename:'全部'
			});  //返回true,继续页面关闭逻辑
			getpushmessage('','','',1,'');
		}, 1500);
	}
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    window.recordType = self.recordType;
	});
	
//	点击搜索
	$('html').on('click','.search-btn',function(){
		var start_time = $('.start_time').val();
		if(start_time){
			var start_time = start_time;
		}else{
			var start_time = '';
		}
		var end_time = $('.end_time').val();
		if(end_time){
			var end_time = end_time;
		}else{
			var end_time = '';
		}
		
		window.pulldown = 'true';
		var type = window.pickertype;
		var searchkey = $('.searchkey').val();
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		
		
		console.log(searchkey);
		getpushmessage(start_time,end_time,searchkey,1,type);
	})



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
		if(id == '1'){
			mui.alert('待完善中。。。');
		}
	}

//日期时间选择器，公用
	$('html').on("click",'.time', function() {
		mui('#pullrefresh').pullRefresh().setStopped(true);//暂时禁止滚动
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "date", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			that.html(e.value);
			that.parent().find('input').val(e.value);
			mui('#pullrefresh').pullRefresh().setStopped(false);
			window.pulldown = 'true';
			var type = window.pickertype;
			var searchkey = $('.searchkey').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
			var start_time = $('.start_time').val();
			if(start_time){
				var start_time = start_time;
			}else{
				var start_time = '';
			}
			var end_time = $('.end_time').val();
			if(end_time){
				var end_time = end_time;
			}else{
				var end_time = '';
			}
			getpushmessage(start_time,end_time,searchkey,1,type);
		});
	});
	mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	mui("body").on('tap','.mui-backdrop',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
	

	function getpushmessage(start,end,searchkey,page,type){
		
		if(start){
			start = start;
		}else{
			start = '';
		}
		if(end){
			end = end;
		}else{
			end = '';
		}
		if(searchkey){
			searchkey = searchkey;
		}else{
			searchkey = '';
		}
		if(page){
			page = page;
		}else{
			page = 1
		}
		if(type){
			type = type;
		}else{
			type = '全部';
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Notify/getNotifyList'; //获取推送列表
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				type:type,
				start:start,
				end:end,
				searchkey:searchkey,
				page:page,
				num:10,
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
				console.log(JSON.stringify(res));
				if(res.code && res.code == 1000){
					if(res.data){
						if(userType == 'admin'){
							var admininfo = JSON.parse(localStorage.getItem("admininfo"));
						}
						if(userType == 'shop'){
							var admininfo = JSON.parse(localStorage.getItem("shopinfo"));
						}
						if(userType == 'user'){
							var admininfo = JSON.parse(localStorage.getItem("userinfo"));
						}
//						var admininfo = JSON.parse(localStorage.getItem("admininfo"));
						res.data.admininfo = admininfo.user_info.name;
						console.log(admininfo.user_info.name);
						res.data.rooturl = rooturl;
						var userinfodata = res.data.data;
						window.userinfodata = res.data;
						// 抓取模板数据
						var contenttpl = $("#push-template").html();
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
							$('#push-content').html(noticeCompiledHtml);
						}
						if(window.pullup == 'true'){
							window.page = window.page+1;
							if(res.data == null || res.data.length == 0){
								var ispull = true;
							}else{
								var ispull = false;
							}
							$('#push-content').append(noticeCompiledHtml);
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
					console.log(JSON.stringify(res));
					if(res.data == null){
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
					// 更新到模板
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
						// 更新到模板
					}
					console.log(JSON.stringify(res));
					mui.toast(res.message);
				}
				if(window.pullup == 'true'){
					if(res.data == null || res.data.length == 0){
						var ispull = true;
					}else{
						var ispull = false;
					}
					mui('#pullrefresh').pullRefresh().endPullup(ispull); //参数为true代表没有更多数据了。
					window.pullup = 'false';
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
	window.addEventListener('controller', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	//选择类型控制器
		var userPicker = new mui.PopPicker();
		
		if(userType == 'admin'){
			if(e.detail.push == 'push'){
				userPicker.setData([{value:'全部',text:'全部'},{value:'未读',text:'未读'},{value:'已读',text:'已读'}]);
			}else{
				userPicker.setData([{value:'全部',text:'全部'},{value:'未读',text:'未读'},{value:'需处理',text:'需处理'},{value:'已转交',text:'已转交'},{value:'已处置/其他',text:'已处置/其他'}]);
			}
		}else{
			userPicker.setData([{value:'全部',text:'全部'},{value:'未读',text:'未读'},{value:'已读',text:'已读'}]);
		}
		
		mui('#pullrefresh').pullRefresh().setStopped(true);//暂时禁止滚动
		userPicker.show(function(items) {
			window.pickertype = items[0].text;
			var prev = plus.webview.currentWebview().opener();
			mui.fire(prev, 'changetype',{
				reload:'true',
				type:'push',
				changename:items[0].text
			});  //返回true,继续页面关闭逻辑
			window.pulldown = 'true';
			var searchkey = $('.searchkey').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
			var start_time = $('.start_time').val();
			if(start_time){
				var start_time = start_time;
			}else{
				var start_time = '';
			}
			var end_time = $('.end_time').val();
			if(end_time){
				var end_time = end_time;
			}else{
				var end_time = '';
			}
			
			getpushmessage(start_time,end_time,searchkey,1,items[0].value);
			
			//返回 false 可以阻止选择框的关闭
			//return false;
		});

	  	}
	});
	
	mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	mui("body").on('tap','.mui-backdrop',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
	
	
	
	$('html').on('click','.getmessage',function(){
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
		var tasktype = 'push';
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
	
	
	
})

