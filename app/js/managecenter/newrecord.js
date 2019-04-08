//FORm序列化转json
$.fn.serializeObject = function(){
	var o = {};
	var oarr = [];
	var a = this.serializeArray();
	$.each(a, function() {
		if(o[this.name] !== undefined) {
			if(!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	var $radio = $('input[type=radio],input[type=checkbox]', this);
	$.each($radio, function() {
		if(!o.hasOwnProperty(this.name)) {
			o[this.name] = '';
		}
	});
	return o;
};

$(function(){
	window.allselectdata = [];
	//监听自定义事件，用于和menu.html页面进行通信
	window.addEventListener("changedata", function(e) {
		window.pulldown = 'true';
		if(e.detail.isdata == '1'){
			//获取搜索
			var searchkey = $('.searchkey').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
			var selectareaid = $('#selectareaid').val();
			if(selectareaid){
				var selectareaid = selectareaid;
			}else{
				var selectareaid = '';
			}
			
			$("#my-mask").show();
			
			
			console.log(JSON.stringify(e.detail.allselectdata));
			console.log('1212122');
			window.allselectdata = e.detail.allselectdata[0];
			//      license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status
//      task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished
			getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data);
		}
	});
	window.pulldown = 'false';
	window.pullup = 'false';
	mui.init({
		swipeBack: false,
		pullRefresh: {
			container: '#pullrefresh',
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
		setTimeout(function() {
			//      license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status
//      task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished
			
		var license_valid_arr = {"正常":"true","注销":"false","失效":"false","特殊":"false"};
		getshop('','','','','','','','','','',license_valid_arr,'','','','','','','','','','','','','','','','','','','','','','','','','','','','');
				
//			getshop('','','','','','','','','','','','','','','','','','','','','','');
		}, 1000);
	}
	window.count = 2;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		console.log('121212');
		window.pullup = 'true';
		$('.mui-table-view-item').find('.left-checkbox').hide();
		$("#choice-all").attr('data-type','0');
		$("#choice-type").hide();
		$("#choice-finish").hide();
		$("#choice-all").html('选择');
		//获取搜索
		var searchkey = $('.searchkey').val();
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		var selectareaid = $('#selectareaid').val();
		if(selectareaid){
			var selectareaid = selectareaid;
		}else{
			var selectareaid = '';
		}
		setTimeout(function() {
			
//shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level,
//
//license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status,
//task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished
			
			if(JSON.stringify(window.allselectdata) != '[]'){
				getshop('',searchkey,window.count,selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data);
//				getshop('',searchkey,window.count,selectareaid,'',window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished);
			}else{
				
				console.log('121212');
				var license_valid_arr = {"正常":"true","注销":"false","失效":"false","特殊":"false"};
				
				getshop('',searchkey,window.count,selectareaid,'','','','','','',license_valid_arr,'','','','','','','','','','','','','','','','','','','','','','','','','','','','');
		
//				getshop('',searchkey,window.count,selectareaid,'','','','','','','','','','','','','','','','','','');
			}
		},1000);
	}
	
	//搜索
	$('html').on('click','.search-btn',function(event){
		//获取搜索
		window.pulldown = 'true';
		var searchkey = $('.searchkey').val();
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		var selectareaid = $('#selectareaid').val();
		if(selectareaid){
			var selectareaid = selectareaid;
		}else{
			var selectareaid = '';
		}
		$("#my-mask").show();
		if(window.allselectdata){
			console.log('1222');
			getshop('',searchkey,'',selectareaid,'',window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished);
		}else{
			getshop('',searchkey,'',selectareaid,'','','','','','','','','','','','','','','','','','');
		}
	})
	
//	当前时间
	function getNow(s) {
	    return s < 10 ? '0' + s: s;
	}
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();
		
	var now = year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
	
	window.now = now;
	var time = $('.time');
	for(var a = 0;a<time.length;a++){
		time.eq(a).html(window.now);
		time.eq(a).parent().find('input').val(window.now);
	}
	
	
	
	
	//日期时间选择器，公用
	$('html').on("click", '.time', function() {
		
		
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "date", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			that.html(e.value);
			that.parent().find('input').val(e.value);
		});
	});
	
	//点击选择辖区
	$('html').on('click','.jurisarea',function(){
		getjurisdiction(area_id);
		
	});
	
	//按管理员辖区id,获取辖区
	function getjurisdiction(areaId){
		var url = rooturl+'index.php/Api_apps/getAreaTree';
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
					var jlist = JSON.stringify(res.data);
					mui.openWindow({
					    url: '../setbusiness/areaselect.html',
					    id: 'areaselect.html',
					    extras:{
					    	jlist: jlist
						}
					});
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
//	辖区选择返回的值
	window.addEventListener("changeCity", function(e) {
		//选择辖区后返回获取辖区id，筛选
		window.pulldown = 'true';
		if(e.detail.data = 'true'){
	        $(".jurisarea").find(".areacontent").html(e.detail.currentname);
	        $("#selectareaid").val(e.detail.areaid);
	        var selectareaid = e.detail.areaid;
	        var searchkey = $('.searchkey').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
	        $("#my-mask").show();
	        console.log(searchkey);
			console.log(selectareaid);
	        if(window.allselectdata.length >0){
	        	getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data);

//				getshop('',searchkey,'',selectareaid,'',window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished);
			}else{
				getshop('',searchkey,'',selectareaid,'','','','','','','','','','','','','','','','','','');
			}
		}
    })
	
	function gettime(){
		var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
		mui.fire(list, 'refresh',{
			reload:'true'
		});  //返回true,继续页面关闭逻辑
		mui.back();
		mui.toast(res.message,{ duration:'long', type:'div' });				
	}
	
	//点击选择
	$('html').on("click","#choice-all",function(event){
		console.log('1212');
		console.log($(this).attr('data-type'));
		if($(this).attr('data-type') == 0){
			$('.mui-table-view-item').find('.left-checkbox').show();
			$("#choice-type").show();
			$(this).attr('data-type','1');
			$(this).html('取消');
			$("#choice-finish").show();
			$("#allshop").hide();
		}else{
			$('.mui-table-view-item').find('.left-checkbox').hide();
			$(this).attr('data-type','0');
			$("#choice-type").hide();
			$(this).html('选择');
			$("#choice-finish").hide();
			$("#allshop").show();
		}
		event.stopPropagation();
	})
	
//	点击全选
	$('html').on('click','#allshop',function(){
		var btnArray = ['否', '是'];
		mui.confirm('你选择全选，确认？', '选择', btnArray, function(e) {
			if (e.index == 1) {
				//获取父页面A.html
				var arr = [{id:-1,name:'全选',type:'shop'}]
				var cityName = arr;
	            var main = plus.webview.currentWebview().opener();
	            var now = plus.webview.currentWebview();
	            
	            //自定义事件,selectman
	            mui.fire(main,'selectman',{cityName:cityName,type:'shop'});
	            //关闭子页面
	            now.close();
	            mui.back();
			} else {
				mui.toast('取消',{ duration:'long', type:'div' });
			}
		})
	})
	
	$('html').on('click','.lookrecord',function(){
		var licenseId = $(this).attr("data-licensesid");
		var residence = $(this).attr("data-residence");
		var corp_name = $(this).attr("data-corp_name");
		var allinfo = [];
		var allshopinfo = window.allshopinfo;
		for(var items in allshopinfo){
			if(allshopinfo[items].licenses[0].id == licenseId){
				allinfo = allshopinfo[items].licenses[0];
			}
		}
		
		
		var url = 'message.html'
		mui.openWindow({
		    url: url,
		    extras:{
				licenseId: licenseId,
				residence:residence,
				corp_name:corp_name,
				allinfo:allinfo
			}
		});
	})
	
//	点击完成
	$('html').on('click','#choice-finish',function(){
		var id_list = [];
		var name_list = [];
		var allshoplist = [];
		var allCheckBox = $(".item-check");
		
        //循环设置所有复选框为选中状态
    	$.each($('input[name="licenseId"]:checked'),function(){
            id_list.push($(this).val());
            name_list.push($(this).attr('data-shopname'));
            var imgurl = $(this).attr('data-imgurl');
            var shopjson = {
            	id:$(this).val(),
            	license:$(this).attr('data-licenseid'),
            	name:$(this).attr('data-shopname'),
            	imgurl: imgurl,
            	type:'shop'
            }
            allshoplist.push(shopjson);
       	});
       	
       	if(name_list.length>1){
       		var namestring = name_list.join(',');
       	}else{
       		var namestring = name_list[0];
       	}
       	var btnArray = ['否', '是'];

		mui.confirm('你选择了:'+namestring+'?是否确认？', '选择', btnArray, function(e) {
			if (e.index == 1) {
				//获取父页面A.html
	            var main = plus.webview.currentWebview().opener();
	            var now = plus.webview.currentWebview();
	            console.log(JSON.stringify(main));
	            
	            //自定义事件,selectman
	            mui.fire(main,'selectman',{allshoplist:allshoplist,type:'shop'});
	            //关闭子页面
	            now.close();
	            mui.back();
			} else {
				mui.toast('取消',{ duration:'long', type:'div' });
			}
		})
       	
       	
       	
       	//获取父页面A.html
//		var cityName = selectarr;
        var main = plus.webview.currentWebview().opener();
        //自定义事件,事件名为changeCity
        mui.fire(main,'selectman',{id_list:id_list,type:'shop'});
        //关闭子页面
        mui.back();
	})
	
	$('html').on('change','.item-check',function(){
		var num = $('input[name="licenseId"]:checked').length;
		$("#choice-finish").html('完成('+num+')');
	})
	
	////资料编辑
	$("html").on('tap','.lookdetail',function(){
		var id = $(this).attr('data-id');
		mui.openWindow({
		    url: '../setbusiness/editshop.html',
		    extras:{
				licenses_id: id,
				type: 1
			}
		});
		
	})
	
	$("html").on('tap','.lookallshop',function(){
		var id = $(this).attr('data-id');
		var license_id = $(this).attr('data-licensesid');
		mui.openWindow({
		    url: '../../shop/ShopPage.html',
		    extras:{
				license_id: license_id,
				shopid: id,
				type: 2
			}
		});
	})
	
//	全选
	$('html').on('click','#all-select',function(){
		var allCheckBox = $(".item-check");
		if($(this).attr("data-checked") == 0){
			$(this).attr("data-checked",'1');
			console.log('选中了');
	        //循环设置所有复选框为选中状态
        	for(var i = 0; i < allCheckBox.length; i++){
    			allCheckBox[i].setAttribute('checked','');
        	}
			
		}else{
			$(this).attr("data-checked",'0');
			console.log('取消了');
			for(var i = 0; i < allCheckBox.length; i++){
    			allCheckBox[i].removeAttribute('checked');
        	}
//			$(".item-check").removeAttr("checked");//取消全选
		}
	})
	
//	按证书id获取
	function getshopinfobyid(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				licenseId:licenseId,
				check_level:'',
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function(){
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						mui.back();
					},1000);
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
				
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
	
	
//	提交新建任务
	$('html').on('click','.submit-btn',function(){
		var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新		
		var taskinfo = $('#newtask').serializeObject();
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Announcement/insertData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				title: taskinfo.title,
				content: taskinfo.content,
				check_start_at: taskinfo.check_start_at,
				check_end_at: taskinfo.check_end_at,
				check_times: taskinfo.check_times,
				area_group_ids: taskinfo.area_group_ids,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function(){
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						mui.back();
					},1000);
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
				
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	})
	
	//获取证书筛选类型
	function getCertificateType(areaId){
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
					var typeTemplateScript = $("#type-template").html();
					var typeTemplate = Handlebars.compile(typeTemplateScript);
					var context = res;
					var typeCompiledHtml = typeTemplate(context);
					$("#selectype").html(typeCompiledHtml);
					
					var length = document.getElementsByClassName('checkval').length;
					for(var n = 0;n<length;n++){
						document.getElementsByClassName('checkval')[n].addEventListener('tap', function() {
							var is = $(this).attr('data-is');
							if(is == '0'){
								$(this).addClass('isselect');
								$(this).attr('data-is','1');
							}else{
								$(this).removeClass('isselect');
								$(this).attr('data-is','0');
							}
						})
					}
				}else{
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
			}
		})
	}
	
//获取周边店铺
	function getshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level,license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status,task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished,getSelfData,search_text,if_network_or_is_business_network,if_physical,task_and_record_time_start,task_and_record_time_end,grant_date_start,grant_date_end,license_valid_from_start,license_valid_from_end,license_valid_to_start,license_valid_to_end,ope_measure_start,ope_measure_end,multiTypeSelected,include_data_of_lack_field,if_null_data) {
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = '';
		}
		if(selectAllLicenseType){
			var selectAllLicenseType = selectAllLicenseType;
		}else{
			var selectAllLicenseType = false;
		}
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		if(orderBy){
			var orderBy = orderBy;
		}else{
			var orderBy = '';
		}
		if(page){
			page = page;
		}else{
			page = 1;
		}
		
		if(license_valid_arr){
			license_valid_arr = license_valid_arr;
		}else{
			license_valid_arr = '';
		}
		if(check_level_arr){
			check_level_arr = check_level_arr;
		}else{
			check_level_arr = '';
		}
		if(grade_arr){
			grade_arr = grade_arr;
		}else{
			grade_arr = '';
		}
		if(risk_level_arr){
			risk_level_arr = risk_level_arr;
		}else{
			risk_level_arr = '';
		}
		if(first_half_year_risk_level_arr){
			first_half_year_risk_level_arr = first_half_year_risk_level_arr;
		}else{
			first_half_year_risk_level_arr = '';
		}
		if(is_open){
			is_open = is_open;
		}else{
			is_open = '-1';
		}
		if(three_small_status){
			three_small_status = three_small_status;
		}else{
			three_small_status = '-1';
		}
		if(task_and_record_time_start){
			task_and_record_time_start = task_and_record_time_start;
		}else{
			task_and_record_time_start = '';
		}
		if(task_and_record_time_end){
			task_and_record_time_end = task_and_record_time_end;
		}else{
			task_and_record_time_end = '';
		}
		if(task_num_delivered){
			task_num_delivered = task_num_delivered;
		}else{
			task_num_delivered = '';
		}
		if(task_num_finished){
			task_num_finished = task_num_finished;
		}else{
			task_num_finished = '';
		}
		if(record_num_finished){
			record_num_finished = record_num_finished;
		}else{
			record_num_finished = '';
		}
		
		if(getSelfData){
			var getSelfData = getSelfData;
		}else{
			var getSelfData = 0;
		}
		if(search_text){
			var search_text = search_text;
		}else{
			var search_text = {
				'corp_name':'',
				'buss_license_or_social_credit':'',
				'legal_person_name':'',
				'license_no':'',
				'ope_area_name_or_prod_address_or_prod_addr':'',
				'res_area_name_or_residence':''
			}
		}
		if(if_network_or_is_business_network){
			var if_network_or_is_business_network = if_network_or_is_business_network;
		}else{
			var if_network_or_is_business_network = -1;
		}
		if(if_physical){
			var if_physical = if_physical;
		}else{
			var if_physical = -1;
		}
		if(grant_date_start){
			var grant_date_start = grant_date_start;
		}else{
			var grant_date_start = '2002-01-01 00:00:00';
		}
		
		if(grant_date_end){
			var grant_date_end = grant_date_end;
		}else{
			var grant_date_end = window.now;
		}
		if(license_valid_from_start){
			var license_valid_from_start = license_valid_from_start;
		}else{
			var license_valid_from_start = '2001-06-01 00:00:00';
		}
		if(license_valid_from_end){
			var license_valid_from_end = license_valid_from_end;
		}else{
			var license_valid_from_end = window.now;
		}
		
		if(license_valid_to_start){
			var license_valid_to_start = license_valid_to_start;
		}else{
			var license_valid_to_start = '2018-01-01 00:00:00';
		}
		if(license_valid_to_end){
			var license_valid_to_end = license_valid_to_end;
		}else{
//			当前加5
			var license_valid_to_end = '2025-01-01 23:59:59';
		}
		if(ope_measure_start){
			var ope_measure_start = ope_measure_start;
		}else{
			var ope_measure_start = '';
		}
		
		if(ope_measure_end){
			var ope_measure_end = ope_measure_end;
		}else{
			var ope_measure_end = '';
		}
		if(multiTypeSelected){
			var multiTypeSelected = multiTypeSelected;
		}else{
			var multiTypeSelected = {};
		}
		
		if(include_data_of_lack_field){
			var include_data_of_lack_field = include_data_of_lack_field;
		}else{
			var include_data_of_lack_field = {
				'grant_date_range': 0,
				'if_network_or_is_business_network': -1,
				'if_physical': -1,
				'license_valid_from_range': -1,
				'license_valid_to_range': 0,
				'ope_measure_range': -1,
				'_three_small_status': -1
			};
		}
		if(if_null_data){
			var if_null_data = if_null_data;
		}else{
			var if_null_data = {
				'grant_date_range': -1,
				'license_valid_from_range': -1,
				'license_valid_to_range': -1,
				'ope_measure_range': -1,
			};
		}
		
		
		var num = 10;
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Map/surroundingLicenseShop';
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
				lat: mylatitude,
				lng: mylongitude,
				shopCategoryId: shopCategoryId,
				searchkey: searchkey,
				orderBy: orderBy,
				latRange: 0.1,
				lngRange: 0.1,
				page: page,
				num: num,
				areaId: areaId,
				selectAllLicenseType: selectAllLicenseType,
				licenseType:licenseType,
				check_level: check_level,
				grade:grade,
				risk_level:risk_level,
				first_half_year_risk_level:first_half_year_risk_level,
				license_valid_arr:license_valid_arr,
				check_level_arr:check_level_arr,
				grade_arr:grade_arr,
				risk_level_arr:risk_level_arr,
				first_half_year_risk_level_arr:first_half_year_risk_level_arr,
				is_open:is_open,
				_three_small_status:three_small_status,
				task_and_record_time_start:task_and_record_time_start,
				task_and_record_time_end:task_and_record_time_end,
				task_num_delivered:task_num_delivered,
				task_num_finished:task_num_finished,
				record_num_finished:record_num_finished,
				getSelfData:getSelfData,
				search_text:search_text,
				if_network_or_is_business_network:if_network_or_is_business_network,
				if_physical:if_physical,
				grant_date_start:grant_date_start,
				grant_date_end:grant_date_end,
				license_valid_from_start:license_valid_from_start,
				license_valid_from_end:license_valid_from_end,
				license_valid_to_start:license_valid_to_start,
				license_valid_to_end:license_valid_to_end,
				ope_measure_start:ope_measure_start,
				ope_measure_end:ope_measure_end,
				multiTypeSelected:multiTypeSelected,
				include_data_of_lack_field:include_data_of_lack_field,
				if_null_data:if_null_data,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					res.data.rooturl = rooturl;
					
					console.log(JSON.stringify(res.data.data.length));
					
					console.log(window.pullup);
					
					if(window.pulldown == 'true'){
						console.log('12122')
						var theTemplateScript = $("#shoplist-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list-content").html(theCompiledHtml);
						window.pulldown = 'false';
						mui('#pullrefresh').pullRefresh().endPulldown();
						mui('#pullrefresh').pullRefresh().refresh(true);
					}
					if(window.pullup == 'true'){
						window.count = window.count+1;
						var theTemplateScript = $("#shoplist-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list-content").append(theCompiledHtml);
						window.pullup = 'false';
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
				} else {
					if(res.data == null){
						window.pullup = 'false';
						window.pulldown = 'false';
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
				}
				$("#my-mask").hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				if(window.pulldown == 'true'){
					mui('#pullrefresh').pullRefresh().endPulldown();
					window.pulldown = 'false';
				}
				$("#my-mask").hide();
				console.log(JSON.stringify(res));
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		});
	}
	
	
})
