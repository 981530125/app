$(function(){
	window.addEventListener('refresh', function(e){//执行刷新  
	  location.reload();
	});
	var allnum = Math.ceil(window.count/10);
	//上拉刷新
	mui.init({
		pullRefresh: {
			container: '#waitrefresh',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	var waitcount = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		setTimeout(function() {
			++waitcount;
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
				var taskType = 'wait';
			}
			getmytask(taskType,page);
			console.log('313');
//			getshop('',searchkey,page,area_id,true,'','');
		}, 3000);
	}
	
	
	
	
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
					clientId: "sadaoikkjlsaflkhl",
					accessToken: accessToken,
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
		
	$('.all-li').click(function() {
		console.log($(this).attr('data-id'));
		var id = $(this).attr('data-id');
		var tasktype = $(this).attr('data-tasktype');
		console.log(tasktype);
		console.log($(".menulist").length);
		console.log(clientType);
		gettypeitem(id);
		firstgetmytask(tasktype);
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
	}
	//下拉加载使用获取我的任务
	function getmytask(taskType,page){
		if(page == ''){
			var page = 1;
		}else{
			var page = page;
		}
		var num = '10';
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_task/adminSelfInvestigateTask'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: "sadaoikkjlsaflkhl",
				clientType: clientType,
				accessToken: accessToken,
				taskType:taskType,
				page:page,
				num:num
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
					mui('#waitrefresh').pullRefresh().endPullupToRefresh((count > allnum));
				}else{
					
					mui.alert(res.message);
					return false;
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast('请求失败',{ duration:'long', type:'div' });
				return false;
			}
		})
	}
	
	
	//初次获取我的任务
	function firstgetmytask(taskType,page){
		if(page == ''){
			var page = 1;
		}else{
			var page = page;
		}
		var num = '10';
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_task/adminSelfInvestigateTask'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: "sadaoikkjlsaflkhl",
				clientType: clientType,
				accessToken: accessToken,
				taskType:taskType,
				page:page,
				num:num
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
					var contenttpl = $("#"+taskType+"-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = tasklist;
					// 把数据传送到模板
			
					var text = rcontenttp(data);
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
				}else{
					
					mui.alert(res.message);
					return false;
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast('请求失败',{ duration:'long', type:'div' });
				return false;
			}
		})
	}
	
	
	
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var typeid = self.typeid;
	    var tasktype = self.tasktype;
	    gettypeitem(typeid);
	    firstgetmytask(tasktype);
	});
	
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

		mui.openWindow({
		    url:'checkform.html',   
		    id:'checkform',
		    extras: {objinfo:objinfo}
		});
	}
	//查看表单
	getformdetail = function(id,record_id){
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
		var enname = 'small_workshop_name';
		mui.openWindow({
		    url:'checkform.html',   
		    id:'checkform',
		    extras: {objinfo:objinfo}
		});
		
	}
	
	
})