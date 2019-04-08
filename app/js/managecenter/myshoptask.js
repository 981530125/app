$(function(){
	//	权限判断
	var rootpower = [{
			obj:'.addrecord',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record/insertData'
		}];
	
	
	window.addEventListener('controller', function(e){//执行刷新
		console.log(JSON.stringify(e.detail));
		if(e.detail.reload == 'true'){
			//分配任务方法1
			if(e.detail.isshow == '0'){
				
				console.log($('.mui-table-view-item').length);
				var length = $('.mui-table-view-item').length;
				for(var a = 0;a<length;a++){
					console.log($('.left-checkbox'));
					$('.left-checkbox').eq(a).show();
				}
				var prev = plus.webview.currentWebview().opener();
				mui.fire(prev, 'returnbak',{
					reload:'true',
					changename: 'true'
				});  //返回true,继续页面关闭逻辑
			}else{
				$('.mui-table-view-item').each(function(){
					$(this).find('.left-checkbox').hide();
				})
			}
			
			if(e.detail.finish == 'true'){
				window.taskarr = [];
				$.each($('input[name="licenseId"]:checked'),function(){
					var taskjson = {
						name:$(this).val(),
						taskid:$(this).attr('data-id')
					}
					window.taskarr.push(taskjson);
		       	});
		       	
		       	var prev = plus.webview.currentWebview().opener();
				mui.fire(prev, 'returnbak',{
					reload:'true',
					back:'true',
					taskarr: taskarr
				});  //返回true,继续页面关闭逻辑
			}
		}
	});
	
	window.addEventListener('finishselect', function(e){//点击完成
		console.log(JSON.stringify(e.detail));
		if(e.detail.reload == 'true'){
			//分配任务方法
			if(e.detail.finish == 'true'){
				window.taskarr = [];
				$.each($('input[name="licenseId"]:checked'),function(){
					var taskjson = {
						name:$(this).val(),
						taskid:$(this).attr('data-id')
					}
					window.taskarr.push(taskjson);
		       	});
		       	
		       	var prev = plus.webview.currentWebview().opener();
				mui.fire(prev, 'returnbak',{
					reload:'true',
					back:'true',
					taskarr: taskarr
				});  //返回true,继续页面关闭逻辑
			}
		}
	});
			
	function refreshcancel(){
		$('.mui-table-view-item').each(function(){
			$(this).find('.left-checkbox').hide();
		})
		
		var prev = plus.webview.currentWebview().opener();
		mui.fire(prev, 'refreshcancel',{
			reload:'true',
			cancel:'true'
		});  //返回true,继续页面关闭逻辑
	}
	
//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	location.reload();
	  	refreshcancel();
	  }
	});
	var allnum = Math.ceil(window.count/10);
	//上拉刷新
	mui.init({
		pullRefresh: {
			container: '#waitrefresh',
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
	window.pulldown = 'false';
	window.pullup = 'false';
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		pulldown = 'false';
		window.pulldown = 'true';
		setTimeout(function() {
			firstgetmytask('',window.licenseId);
			refreshcancel();
		}, 1000);
	}
	
	
	var waitcount = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		window.pullup = 'true';
		setTimeout(function() {
			++waitcount;
//				mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > allnum));
			console.log(waitcount);
			var page = waitcount//参数为true代表没有更多数据了。
			
			getmytask(page,window.licenseId);
//			getshop('',searchkey,page,area_id,true,'','');
		}, 3000);
	}
	
	//	获取参数
	mui.plusReady(function() {
		//获取检查表类型
		var self = plus.webview.currentWebview();
		var licenseId = self.licenseId;
		var residence = self.residence;
		var corp_name = self.corp_name;
		var allinfo = self.allinfo;
		window.licenseId = self.licenseId;
		window.residence = self.residence;
		window.corp_name = self.corp_name;
		window.allinfo = self.allinfo;
		console.log(licenseId);

		
	})
	//	   		调用左滑删除
	leftslide(".leftitem");
	rightslide(".leftitem");
//	点击删除
	$('html').on('tap','.btn-delete',function(){
		var elem = this;
		var id = $(this).attr('data-id');
		var divnode = $(this).parent().parent();
		var btnArray = ['确认', '取消'];
		mui.confirm('确认删除该条记录？', '删除记录', btnArray, function(e) {
			if (e.index == 0) {
				divnode.remove();
				deleterecords(id)
			} else {
				mui.toast('取消',{ duration:'long', type:'div' }) 
			}
		});
	})
	
//	删除方法
	function deleterecords(id){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record/deleteData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				id:id,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var allformlisttype = JSON.stringify(res.data);
					localStorage.setItem('allformlisttype',allformlisttype);
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log('333');
			}
		});
	}
	
	
//	搜索
	$('html').on('click','.search-btn',function(){
		console.log($('.searchkey').val());
		$("#my-mask").show();
		var searchkey = $('.searchkey').val();
		firstgetmytask('wait','',searchkey);
	})
	
	$('html').on('click','.item-check',function(){
		var num = 0;
		//循环设置所有复选框为选中状态
    	$.each($('input[name="licenseId"]:checked'),function(){
            num = num+1;
       	});
		console.log(num);
	})
	
	//获取表类型
	function getformtype(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Checklist_tables/checklistTables';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var allformlisttype = JSON.stringify(res.data);
					localStorage.setItem('allformlisttype',allformlisttype);
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log('333');
			}
		});
	}
		
	if(!localStorage.getItem('allformlisttype')){
		getformtype();
	}
	//根据id切换选项卡
	function gettypeitem(id){
		var len = $(".menulist").length;
		for(var n = 0;n<len;n++){
			$(".menulist").eq(n).hide();
		}
		$(".menulist").eq(id).show();
		$('.all-li').eq(id).siblings('.all-li').removeClass('all-active');
		$('.all-li').eq(id).addClass('all-active');	
	}
	//下拉加载使用获取我的任务
	function getmytask(page,licenseId){
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		var num = '10';
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_task/getInvestigateTaskByLicenseId'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				licenseId:licenseId,
				page:page,
				num:num,
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
					console.log(JSON.stringify(res));
					var currentdata = res.data.data;
					if(window.allifo.length>0){
						for(var i in currentdata){
							window.allifo.push(currentdata[i]);
						}
					}else{
						window.allifo = res.data.data;
					}
					//总页数
					var count = res.data.count;
					var allnum = Math.ceil(count/10);
				
					
					var tasklist = res.data;
			//		// 抓取模板数据
					var contenttpl = $("#"+taskType+"-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = tasklist;
					// 把数据传送到模板
			
					var text = rcontenttp(data);
					// 更新到模板
					if(taskType == 'wait'){
						$('#wait').append(text);
					}
					if(taskType == 'process'){
						$('#records').append(text);
					}
					if(taskType == 'finished'){
						$('#sellerinfo').append(text);
					}
					
					//权限配置
					console.log('权限配置');
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
					}
					
					mui('#waitrefresh').pullRefresh().endPullupToRefresh(false);
				}else{
					window.pulldown = 'false';
					window.pullup = 'false';
					mui('#waitrefresh').pullRefresh().endPullupToRefresh(true);
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
	
	//初次获取我的任务
	function firstgetmytask(page,licenseId){
		var taskType = 'wait';
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		var num = '10';
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_task/getInvestigateTaskByLicenseId'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				licenseId:licenseId,
				page:page,
				num:num,
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
					if(res.data){
						window.allifo = res.data.data;
					}else{
						window.allifo = '';
					}
					
					//总页数
					var count = res.data.count;
					var allnum = Math.ceil(count/10);
					
					var tasklist = res.data;
			//		// 抓取模板数据
					var contenttpl = $("#wait-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = tasklist;
					// 把数据传送到模板
			
					var text = rcontenttp(data);
					
					if(window.pulldown == 'true'){
						window.pulldown = 'false';
						// 更新到模板
						if(taskType == 'wait'){
							$('#wait').html(text);
						}
						if(taskType == 'process'){
							$('#records').html(text);
						}
						if(taskType == 'finished'){
							$('#sellerinfo').html(text);
						}
						mui('#waitrefresh').pullRefresh().endPullupToRefresh(false);
						setTimeout(function() {
							var prev = plus.webview.currentWebview().opener();
							mui.fire(prev, 'refreshshow',{
								reload:'true',
								show:'true'
							});  //返回true,继续页面关闭逻辑
						}, 1000);
					}
					
					//					权限配置
					console.log('权限配置');
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
					}
					mui.toast(res.message,{ duration:'long', type:'div' })
				}else{
					window.pulldown = 'false';
					window.pullup = 'false';
					mui('#waitrefresh').pullRefresh().endPullupToRefresh(false);
					mui.toast(res.message);
				}
				mui('#waitrefresh').pullRefresh().endPulldown();
				$("#my-mask").hide();
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				$("#my-mask").hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
	addform = function(id,residence,corp_name){
		getformtype();
		
		var admininfo  = JSON.parse(localStorage.getItem('admininfo'));
		var admindata = admininfo.user_info;

		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Admin/allData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				searchkey:admindata.name,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {					
					objinfo = {
						"id": '',
			            "name": "",
			            "corp_name": corp_name,
			            "residence": residence,
			            "investigate_task_id": id,
			            "is_recheck": "",
			            "status": "",
			            "conclusion": null,
			            "check_start_at": "请输入时间",
			            "check_end_at": "请输入时间",
			            "score": null,
			            "ids_of_operate_admin": "",
			            "created_admin_id": "",
			            "sort": "0",
			            "note": "",
			            "display": "0",
			            "created_at": "",
			            "updated_at": "",
			            "deleted_at": null,
			            "finished_at": "",
			            "is_open": "0",
			            "parent_id": null,
			            "operate_admin": [
			                {
			                    "id": res.data[0].id,
			                    "name": res.data[0].name,
			                    "enforcement_number": res.data[0].enforcement_number
			                }
			            ]
					}
					var datainfo = window.allifo;
					console.log(id);
					for(var d = 0;d<datainfo.length;d++){
						if(datainfo[d].id == id){
							var licenseinfo = datainfo[d].license;
							if(licenseinfo == null){
								mui.alert('license为null');
								return false;
							}else{
								var type_info = datainfo[d].license.type_info;
							}
							console.log(JSON.stringify(licenseinfo));
						}
					}
					mui.openWindow({
					    url:'../../managecenter/checkform/checkform.html',   
					    id:'checkform',
					    extras: {
					    	objinfo:objinfo,
					    	type_of:type_info,
					    	licenseinfo:licenseinfo
					    }
					});
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
			}
		});
	}
	
	$('html').on('click','.lookmycheck',function(){
		var taskid = $(this).attr('data-taskid');
		var id = $(this).attr('data-id');
		console.log('21212');
		getformdetail(taskid,id);
	})
	//查看表单
	function getformdetail(id,record_id){
		var objinfo = {};
		console.log(id);
	 	console.log(JSON.stringify(window.allifo));
	 	var allinfo = window.allifo;
	 	for(var n = 0;n< allinfo.length;n++){
	 		if(allinfo[n].id == id){
	 			var investigate_record = allinfo[n].investigate_record;
	 			for(var i = 0;i<investigate_record.length;i++){
	 				if(investigate_record[i].id == record_id){
	 					objinfo = investigate_record[i]
	 				}
	 			}
	 		}
	 	}
		var datainfo = window.allifo;
		console.log(id);
		for(var d = 0;d<datainfo.length;d++){
			if(datainfo[d].id == id){
				if(datainfo[d].license){
					var type_info = datainfo[d].license.type_info;
					var licenseinfo = datainfo[d].license;
				}else{
					var licenseinfo = [];
					var type_info = '';
				}
			}
		}
		mui.openWindow({
		    url:'../../managecenter/checkform/checkform.html',   
		    id:'checkform',
		    extras: {
		    	objinfo:objinfo,
		    	type_of:type_info,
		    	licenseinfo:licenseinfo
		    }
		});
	}
	
	
//	查看详情
	$("html").on('click','#lookup',function(){
		var datainfo = window.allifo;
		var id = $(this).attr('data-id');
		for(var d = 0;d<datainfo.length;d++){
			if(datainfo[d].id == id){
				var datainfo = datainfo[d];
			}
		}
		var tourl = 'sfile.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	datainfo:datainfo,
		    	allifo:window.allifo
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
})