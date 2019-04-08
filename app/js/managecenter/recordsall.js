$(function(){
	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	location.reload();
	  }
	});
	var allnum = Math.ceil(window.count/10);
	//上拉刷新
	mui.init({
		pullRefresh: {
			container: '#allpullrefresh',
			down: {
				auto:true,
				style:"circle",
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
		setTimeout(function() {
			reload();
//			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1000);
	}
	var waitcount = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		++waitcount;
		setTimeout(function() {
			
//				mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > allnum));
			console.log(waitcount);
			var page = waitcount//参数为true代表没有更多数据了。
			if($("#search-key").val() == ''){
				var searchkey = '';
			}else{
				var searchkey = $("#search-key").val();
			}
			if(taskType){
				var taskType = taskType;
			}else{
				var taskType = 'all';
			}
			var searchkey = $('.searchkey').val();
			getmytask(taskType,page,searchkey,'');
//			getshop('',searchkey,page,area_id,true,'','');
		}, 3000);
	}
	
	//	搜索
	$('html').on('click','.search-btn',function(){
		console.log($('.searchkey').val());
		$("#my-mask").show();
		var searchkey = $('.searchkey').val();
		firstgetmyrecords('all','',searchkey);
	});
	
	
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
	function getmytask(recordType,page,searchkey,selfOnly){
		if(page == ''){
			var page = 1;
		}else{
			var page = page;
		}
		console.log(page);
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		if(selfOnly){
			var selfOnly = selfOnly;
		}else{
			var selfOnly = false;
		}
		var num = '10';
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record/adminSelfInvestigateRecord'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				recordType:recordType,
				selfOnly:selfOnly,
				page:page,
				num:num,
				searchkey:searchkey,
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
					var contenttpl = $("#"+recordType+"-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = tasklist;
					// 把数据传送到模板
			
					var text = rcontenttp(data);
					// 更新到模板
					if(recordType == 'month'){
						$('#month').append(text);
					}
					if(recordType == 'year'){
						$('#year').append(text);
					}
					if(recordType == 'all'){
						$('#all').append(text);
					}
					mui('#allpullrefresh').pullRefresh().endPullupToRefresh(false);
				}else{
					mui('#allpullrefresh').pullRefresh().endPullupToRefresh(true);
					mui.alert(res.message);
				}
			},
			error: function(res){
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
	
	//初次获取我的检查记录，本月
	function firstgetmyrecords(recordType,page,searchkey){
		if(page == ''){
			var page = 1;
		}else{
			var page = page;
		}
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		var selfOnly = false;
		var num = '10';
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record/adminSelfInvestigateRecord'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				recordType: recordType,
				accessToken:accessToken,
				selfOnly:selfOnly,
				page:page,
				num:num,
				searchkey:searchkey,
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
					
					console.log(JSON.stringify(tasklist));
					if(tasklist.length <= 0){
						var tasklist = res;
						var contenttpl = $("#none-template").html();
					}else{
						// 抓取模板数据
						var contenttpl = $("#"+recordType+"-template").html();
					}
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = tasklist;
					// 把数据传送到模板
			
					var text = rcontenttp(data);
					// 更新到模板
					if(recordType == 'month'){
						$('#month').html(text);
					}
					if(recordType == 'year'){
						$('#year').html(text);
					}
					if(recordType == 'all'){
						$('#all').html(text);
					}
					mui('#allpullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				}else{
					var tasklist = res.data;
					if(tasklist == 'null'){
						var contenttpl = $("#none-template").html();
					}else{
						// 抓取模板数据
						var contenttpl = $("#"+recordType+"-template").html();
					}
					mui.toast(res.message);
					mui('#allpullrefresh').pullRefresh().endPulldown();
				}
				$("#my-mask").hide();
			},
			error: function(res){
				$("#my-mask").hide();
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
//	mui.plusReady(function(){
//	    var self = plus.webview.currentWebview();
//	    var typeid = self.typeid;
//	    
//	    if(self.tasktype){
//	    	var tasktype = self.tasktype;
//	    }else{
//	    	var tasktype = 'all';
//	    }
//	    firstgetmyrecords(tasktype,1);
//	});
	function reload(){
		if(self.tasktype){
	    	var tasktype = self.tasktype;
	    }else{
	    	var tasktype = 'all';
	    }
	    firstgetmyrecords(tasktype,1);
	}
	
   reload();
	
	
	addform = function(id,residence,corp_name){
		objinfo = {
			"id": id,
            "name": "",
            "corp_name": corp_name,
            "residence": residence,
            "investigate_task_id": "",
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
            "parent_id": null
		}

		var type_info = objinfo.task.license.type_info;
		var licenseinfo = objinfo.task.license;
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
	//查看表单
	getformdetail = function(id,record_id){
		var objinfo = {};
	 	var allinfo = window.allifo;
	 	var type_infos = [];
	 	
	 	for(var n = 0;n< allinfo.length;n++){
	 		if(allinfo[n].id == record_id){
	 			objinfo = allinfo[n]
	 		}
	 	}
	 	
	 	if(objinfo.checklist){
			var checklists =  objinfo.checklist;
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
		if(objinfo.task){
			var type_info = objinfo.task.license.type_info;
		}else{
			var type_info = {
				checklist:type_infos
			}
		}
		
		if(objinfo.task){
			var licenseinfo = objinfo.task.license;
		}else{
			var licenseinfo = [];
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
				mui.toast(res.message,{ duration:'long', type:'div' }) 
			}
		});
	}
	
})