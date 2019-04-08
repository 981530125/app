$(function(){
	config();
    window.pulldown = 'false';
	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	pulldownRefresh();
	  }
	});
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
	var count = 0;
	function pullupRefresh() {
		setTimeout(function() {
//			暂无信息
			mui('#pullrefresh').pullRefresh().endPullup((++count > 1)); //参数为true代表没有更多数据了。
			
		}, 1500);
	}

	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		
		setTimeout(function() {
			getactivity('','');
		}, 1500);
	}
	
	
//	getactivity();
//	获取自身活动
	function getactivity(searchkey,review_status){
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		if(review_status){
			var review_status = review_status;
		}else{
			var review_status = '全部'
		}
		console.log(mobile);
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_activity/getSelfShopActivity'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				searchkey:searchkey,
				review_status:review_status,
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
					window.infodata = res.data;
					
					res.rooturl = rooturl;
					console.log(admininfo);
			//		// 抓取模板数据
					var contenttpl = $("#content-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = res;
					// 把数据传送到模板
					var text = rcontenttp(data);
					// 更新到模板
					$('#datalist').html(text);
					
					
					mui.toast(res.message,{ duration:'long', type:'div' });
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
				if(window.pulldown == 'true'){
					mui('#pullrefresh').pullRefresh().endPulldown();
					window.pulldown = 'false';
				}
				$("#my-mask").hide();
			},
			error: function(res){
				$("#my-mask").hide();
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'long', type:'div' });
				return false;
			}
		})
	}
	
//	根据id查询活动
	function getactivitybyid(id){
		var databyid = [];
		var info = window.infodata;
		for(var item in info){
			if(info[item].id == id){
				databyid = info[item];
			}
		}
		return databyid
	}
	
	//选择类型控制器
	var userPicker = new mui.PopPicker();
	userPicker.setData([{value:'全部',text:'全部'},{value:'0',text:'审核中'},{value:'1',text:'已通过'},{value:'2',text:'未通过'}]);
	var showUserPickerButton = document.getElementById('showUserPicker');
	var userResult = document.getElementById('userResult');
	showUserPickerButton.addEventListener('tap', function(event) {
		mui('#pullrefresh').pullRefresh().setStopped(true);//暂时禁止滚动
		userPicker.show(function(items) {
			getactivity('',items[0].value);
			userResult.innerText = items[0].text;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	}, false);
	mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	mui("body").on('tap','.mui-backdrop',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	})
  	
	
	//新增活动
	$('html').on('click','#add-activity',function(event){
		var tourl = 'addactivity.html'
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
	
	//修改活动
	$("html").on('click','.changeactivity',function(event){
		var id = $(this).attr("data-info");
		var databyid = getactivitybyid(id);
		var tourl = 'addactivity.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    extras:{
		    	databyid:databyid
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
	
//	点击搜索活动
	$('html').on('click','.search-style',function(){
		var searchkey = $('.search-key').val();
		var type = $('#userResult').html();
		$("#my-mask").show();
		getactivity(searchkey,type);
	})
	
	
})
