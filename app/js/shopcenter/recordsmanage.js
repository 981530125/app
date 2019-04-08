(function($, doc) {
	$.init();
})(mui, document);
$(function(){
//	下拉刷新
    window.pulldown = 'false';
    window.pullup = 'false';
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
	window.page = 2;
	function pullupRefresh() {
		window.pullup = 'true';
		setTimeout(function() {
//			暂无信息
			getactivity(window.page);
			
			
		}, 1500);
	}

	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		if(window.recordType){
			var recordType = window.recordType
		}else{
			var recordType = '';
		}
		setTimeout(function() {
			getactivity('',recordType);
		}, 1500);
	}
	
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    window.recordType = self.recordType;
	});
	
	
	//选择类型控制器
	var userPicker = new mui.PopPicker();
	
	userPicker.setData([{value:'all',text:'全部'},{value:'wait_recheck',text:'待整改'}]);
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

//	获取自身监管记录
	function getactivity(page,recordType){
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		if(recordType){
			var recordType = recordType;
		}else{
			var recordType = 'all';
		}
		console.log(recordType);
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record/shopSelfInvestigateRecord';
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				recordType:recordType,
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
					if(res.data == null){
						mui('#pullrefresh').pullRefresh().endPullup(true);
						return false;
					}
					var count = res.data.count;
					var allnum = Math.ceil(count/10);
					
					var admininfo = JSON.stringify(res.data);
					window.infodata = res.data;
					res.rooturl = rooturl;
					console.log(admininfo);
			//		// 抓取模板数据
					var contenttpl = $("#content-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = res.data;
					// 把数据传送到模板
					var text = rcontenttp(data);

					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
						// 更新到模板
						$('#datalist').html(text);
					}
					if(window.pullup == 'true'){
						console.log(window.page);
						mui('#pullrefresh').pullRefresh().endPullup((++window.page > allnum)); //参数为true代表没有更多数据了。
						window.pullup = 'false';
						// 更新到模板
						$('#datalist').append(text);
					}
					mui.toast(res.message,{ duration:'short', type:'div' });
				}else{
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
					}
					mui('#pullrefresh').pullRefresh().endPullup(true);
					mui.toast(res.message,{ duration:'short', type:'div' });
					console.log(res.message);
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'short', type:'div' });
			}
		})
	}
	
//	根据id查询菜品
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
	
	
	
	//新增菜品
	$('html').on('click','#add-activity',function(event){
		mui.toast('未完成',{ duration:'short', type:'div' });
		return false;
		
		var tourl = 'addfood.html'
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
	
	//查看记录
	$("html").on('click','.changeactivity',function(event){
		var id = $(this).attr("data-id");
		var task_id = $(this).attr("data-task_id");
		var recordsarr_data = window.infodata.data;
		var records_data = [];
		var type_infos = [];
		var operate_admin = [];
		for(var ritem in recordsarr_data){
			if(recordsarr_data[ritem].id == id){
				var records_data = recordsarr_data[ritem];
			}
		}
		
		var arr = records_data.operate_admin_names.split('、');
		for(var names in arr){
			console.log(arr[names]);
			var jsona = {
				id:'',
				name:arr[names],
				enforcement_number:''
			}
			operate_admin.push(jsona);
		}
		records_data.operate_admin = operate_admin;
		if(records_data.checklist){
			var checklists =  records_data.checklist;
			for(var items in checklists){
		 		var jsonarr = {
		 			cn_name:checklists[items].checklist_type.comment,
		 			en_name:checklists[items].checklist_type.en_name,
		 		}
		 		type_infos.push(jsonarr);
		 	}
		}else{
			type_infos = [];
		}
		if(records_data.task){
			var type_info = records_data.task.license.type_info;
		}else{
			var type_info = {
				checklist:type_infos
			}
		}
		
		if(records_data.task){
			var licenseinfo = records_data.task.license;
		}else{
			var licenseinfo = [];
		}
		
		var databyid = getactivitybyid(id);
		var tourl = '../managecenter/checkform/shopcheckform.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    extras:{
		    	objinfo:records_data,
		    	type_of:type_info,
		    	licenseinfo:licenseinfo
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
})
