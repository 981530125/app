$(function(){
	//	权限判断
	var rootpower = [{
			obj:'#add-records',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record/createRecordByLicenseId'
		}];
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
			container: '#listpullrefresh',
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
	window.pulldown = 'false';
    window.pullup = 'false';
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		setTimeout(function() {
			getrecordslistbylicenseid('',window.licenseId,'','');
//			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1000);
	}
	window.waitcount = 2;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		window.pullup = 'true';
		setTimeout(function() {
			getrecordslistbylicenseid(window.waitcount,window.licenseId,'','');
			++waitcount;
//				mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > allnum));
			console.log(waitcount);
			var page = waitcount//参数为true代表没有更多数据了。
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
		
		console.log(licenseId);
		console.log(JSON.stringify(allinfo));
		
		window.licenseId = self.licenseId;
		window.residence = self.residence;
		window.corp_name = self.corp_name;
		window.allinfo = self.allinfo;
		console.log(licenseId);
		
		getrecordslistbylicenseid('',licenseId,'','');
		getformtype();
		
	})
	
	$('html').on('change','#myselect',function(){
		var recordType = $(this).val();
		var searchkey = $('.searchkey').val();
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		$('#my-mask').show();
		getrecordslistbylicenseid('',window.licenseId,searchkey,recordType);
	})
	
	
	function getrecordslistbylicenseid(page,licenseId,searchkey,recordType){
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
		if(selfOnly){
			var selfOnly = selfOnly;
		}else{
			var selfOnly = 'false';
		}
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record/adminSelfInvestigateRecord';
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
				recordType:recordType,
				selfOnly:selfOnly,
				searchkey:searchkey,
				licenseId:licenseId,
				page:page,
				num:10,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					console.log(JSON.stringify(res));
					var tasklist = res.data;
					
					window.tasklist = res.data;
					
			//		// 抓取模板数据
					var contenttpl = $("#recordlist-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = tasklist;
					// 把数据传送到模板
					var text = rcontenttp(data);
					
					if(window.pulldown == 'true'){
						window.pulldown = 'false';
						// 更新到模板
						$('#record-list').html(text);
					}
					if(window.pullup == 'true'){
						window.pullup = 'false';
						window.waitcount = window.waitcount+1;
						mui('#listpullrefresh').pullRefresh().endPullupToRefresh(false);
						// 更新到模板
						$('#record-list').append(text);
					}
					//权限配置
					console.log('权限配置');
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
					}
				}else{
					console.log(res.message);
					mui('#listpullrefresh').pullRefresh().endPullupToRefresh(true);
				}
				$('#my-mask').hide();
				mui('#listpullrefresh').pullRefresh().endPulldown();
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				$('#my-mask').hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
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
				clientId: clientId,
				accessToken: accessToken,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var allformlisttype = JSON.stringify(res.data);
					localStorage.setItem('allformlisttype',allformlisttype);
					console.log(JSON.stringify(allformlisttype));
					console.log('222');
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log('333');
			}
		});
	}
	
	
	
	function addform(id,residence,corp_name){
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
			
					var licenseinfo = window.allinfo;
					var type_info = licenseinfo.type_info;
					mui.openWindow({
					    url:'../../managecenter/checkform/checkform.html',   
					    id:'checkform',
					    extras: {
					    	objinfo:objinfo,
					    	type_of:type_info,
					    	licenseinfo:licenseinfo,
					    	alone:'alone'
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
	//查看表单
	
	$('html').on('click','.formdetail',function(){
		var id = $(this).attr('data-id');
		var task_id = $(this).attr('data-task_id');
		
		var alone = $(this).attr('data-alone');
		var tasklist = window.tasklist.data;
		for(var li = 0;li<tasklist.length;li++){
			if(tasklist[li].id == id){
				var objinfo = tasklist[li];
			}
			
		}
//		getformtype();
		getformdetail(id,task_id,objinfo,alone);
		
	})
	
	function getformdetail(id,record_id,objinfo,alone){
		var licenseinfo = window.allinfo;
		var type_info = licenseinfo.type_info;
		var objinfo = objinfo;
		
		mui.openWindow({
		    url:'../checkform/checkform.html',
		    id:'checkform',
		    extras: {
		    	objinfo:objinfo,
		    	type_of:type_info,
		    	licenseinfo:licenseinfo,
		    	alone:alone
		    }
		});
		
	}
	
	
	
	$('html').on('click','#add-records',function(){
		var licenseId = window.licenseId;
		var residence = window.residence;
		var corp_name = window.corp_name;
		console.log(clientId);
		console.log(accessToken);
		
		console.log('1212');
		addform(licenseId,residence,corp_name);
	})
	
	
})
