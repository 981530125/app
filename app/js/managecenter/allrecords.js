$(function(){
	//	权限判断
	var rootpower = [{
			obj:'#add-task',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Announcement/insertData'
		}];
		
	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	location.reload();
	  }
	});
	
	window.pulldown = 'false';
	window.pullup = 'false';
	//下拉
	mui.init({
		pullRefresh: {
			container: '#refreshlist',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			},
			up: {
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
		for(var itemn in rootpower){
			ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
		}
		setTimeout(function() {
			getrecordlist('','');
		}, 1500);
	}
	window.count = 2;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		window.pullup = 'true';
		setTimeout(function() {
			var searchkey = $('.searchkey').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
			getrecordlist(window.count,searchkey);
		}, 3000);
		//权限配置
	}
	
	//点击查看详情
	$('html').on('click','.detail-btn',function(){
		var id = $(this).attr('data-id');
		var listinfo = window.listinfo.data;
		for(var item in listinfo){
			if(listinfo[item].id == id){
				var detail = listinfo[item];
			}
		}
		
		console.log(JSON.stringify(detail));

		var tourl = 'recorddetail.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	detail:detail
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
	
	$('html').on('click','#add-task',function(event){
		var tourl = '../mytask/addtask.html';
//		var tourl = 'offcanvas-drag-left-plus-main.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
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
	})
	
//	点击搜索
	$('html').on('tap','.search-btn',function(){
		var searchkey = $('.searchkey').val();
		window.pulldown = 'true';
		getrecordlist('',searchkey);
	})
	
	
	
	function getrecordlist(page,searchkey){
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Announcement/pageData';  //任务公告列表
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile:mobile,
				userType:userType,
				clientType:clientType,
				clientId:clientId,
				accessToken:accessToken,
				page:page,
				num:10,
				searchkey:searchkey,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					
					var formTemplateScript = $("#recordlist-template").html();
					var formTemplate = Handlebars.compile(formTemplateScript);
					var context = res.data;
					var formCompiledHtml = formTemplate(context);
					
					if(window.pulldown == 'true'){
						window.listinfo = res.data;
						window.pulldown = 'false';
						$("#recordlist").html(formCompiledHtml);
						mui('#refreshlist').pullRefresh().endPulldown();
					}
					if(window.pullup == 'true'){
						var getdata = res.data.data;
						for(var i in getdata){
							window.listinfo.data.push(getdata[i]);
						}
						console.log(window.listinfo);
						window.pullup = 'false';
						window.count = window.count+1;
						$("#recordlist").append(formCompiledHtml);
						mui('#refreshlist').pullRefresh().endPullupToRefresh(false);
					}
					
					
				}else{
					if(window.pullup == 'true'){
						window.pullup = 'false';
						mui('#refreshlist').pullRefresh().endPullupToRefresh(true);
					}
					window.pulldown = 'false';
					window.pullup = 'false';
					mui('#refreshlist').pullRefresh().endPulldown();
				}
				mui.toast(res.message,{ duration:'long', type:'div' })
			},
			error: function(res) {
				console.log(JSON.stringify(res.message));
				mui('#refreshlist').pullRefresh().endPulldown();
			}
		})
	}
})
