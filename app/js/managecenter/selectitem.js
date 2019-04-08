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
	window.pulldown = 'true';
	window.pullup = 'true';
	window.allselectarr = [];
	
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    getselect();
	    getCertificateType();
	    
	    
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
	var h=myDate.getHours();      //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();
	
	var now = year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
	
	
	
	window.now = now;
	var time = $('.time');
	for(var a = 0;a<time.length;a++){
		if(time.eq(a).attr('data-time')=='start'){
			time.eq(a).html('2002-01-01 00:00:00');
			time.eq(a).parent().find('input').val('2002-01-01 00:00:00');
		}
		if(time.eq(a).attr('data-time')=='license_start'){
			time.eq(a).html('2018-01-01 00:00:00');
			time.eq(a).parent().find('input').val('2018-01-01 00:00:00');
		}
		if(time.eq(a).attr('data-time')=='end'){
			time.eq(a).html(window.now);
			time.eq(a).parent().find('input').val(window.now);
		}
		if(time.eq(a).attr('data-time')=='start_ranage'){
			time.eq(a).html('2001-06-01 00:00:00');
			time.eq(a).parent().find('input').val('2001-06-01 00:00:00');
		}
		if(time.eq(a).attr('data-time')=='licens_to_end'){
			var newss = year+6+'-01-01 23:59:59';
			time.eq(a).html(newss);
			time.eq(a).parent().find('input').val(newss);
		}
	}
	
	//日期时间选择器，公用
	$('html').on("click", '.time', function() {
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "datetime", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			that.html(e.value+':00');
			that.parent().find('input').val(e.value+':00');
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
		if(e.detail.data = 'true'){
	        $(".jurisarea").html(e.detail.currentname);
	        $(".area_group_ids").val(e.detail.areaid);
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
		}else{
			$('.mui-table-view-item').find('.left-checkbox').hide();
			$(this).attr('data-type','0');
			$("#choice-type").hide();
			$(this).html('选择');
		}
		event.stopPropagation();
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
							
							if($(this).attr('data-name') == '全部'){
								for(var a = 0;a<length;a++){
									$('.checkval').eq(a).removeClass('isselect');
									$('.checkval').eq(a).attr('data-is','0');
								}
								if(is == '0'){
									$(this).addClass('isselect');
									$(this).attr('data-is','1');
								}else{
									$(this).removeClass('isselect');
									$(this).attr('data-is','0');
								}
								$("input[name='isselectAllLicenseType']").val('true');
								
							}else{
								if(is == '0'){
									$(this).addClass('isselect');
									$(this).attr('data-is','1');
								}else{
									$(this).removeClass('isselect');
									$(this).attr('data-is','0');
								}
								
								
								for(var a = 0;a<length;a++){
									if($('.checkval').eq(a).attr('data-name') == '全部'){
										$('.checkval').eq(a).removeClass('isselect');
										$('.checkval').eq(a).attr('data-is','0');
									}
								}
								$(this).attr('data-name') == '全部'
								
								$("input[name='isselectAllLicenseType']").val('false');
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
	function getshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level,license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status,task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished) {
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = '';
		}
		if(selectAllLicenseType == 'true'){
			var selectAllLicenseType = true;
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
				three_small_status:three_small_status,
				task_and_record_time_start:task_and_record_time_start,
				task_and_record_time_end:task_and_record_time_end,
				task_num_delivered:task_num_delivered,
				task_num_finished:task_num_finished,
				record_num_finished:record_num_finished,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					window.count = res.data.count;
					res.data.rooturl = rooturl;
					
					console.log(JSON.stringify(res));
					
					console.log(window.pullup);
					
					if(window.pullup == 'true'){
						console.log('12121');
						
						var theTemplateScript = $("#shoplist-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list-content").html(theCompiledHtml);
						window.pullup = 'false';
					}
					if(window.pullup == 'false'){
						var theTemplateScript = $("#shoplist-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list-content").append(theCompiledHtml);
						window.pullup = 'true';
					}
					
					
//					mui('#refreshlist').pullRefresh().endPulldown();
//					mui('#refreshlist').pullRefresh().endPullupToRefresh((count > allnum));
				} else {
					
					console.log(JSON.stringify(res.data));
					
					if(res.data == null){
						mui('#refreshlist').pullRefresh().endPullupToRefresh(true);
					}
				}
				if(window.pulldown == 'true'){
					mui('#refreshlist').pullRefresh().endPulldown();
					window.pulldown = 'false';
				}
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				if(window.pulldown == 'true'){
					mui('#refreshlist').pullRefresh().endPulldown();
					window.pulldown = 'false';
				}
				mui.toast(res.message,{ duration:'long', type:'div' });
//				prompt('error',JSON.stringify(res));
			}
		});
	}
	
	
//	获取select选项
	function getselect(){
//		var rooturl = 'http://192.168.0.79/';
		var url = rooturl+'index.php/Api_apps/getLicenseSelectTypeInfoByData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var theTemplateScript = $("#myproduce-template").html();
					var theTemplate = Handlebars.compile(theTemplateScript);
					var context = res.data.selectType;
					var theCompiledHtml = theTemplate(context);
					$("#myproductlist").html(theCompiledHtml);
					window.selectType = res.data.selectType;
					
					var foodTemplateScript = $("#myfoods-template").html();
					var foodTemplate = Handlebars.compile(foodTemplateScript);
					var data = res.data.selectType;
					var foodCompiledHtml = foodTemplate(data);
					$("#foodselect").html(foodCompiledHtml);
					
					var themainTemplateScript = $("#mymain-template").html();
					var themainTemplate = Handlebars.compile(themainTemplateScript);
					var context = res.data.selectType;
					var themainCompiledHtml = themainTemplate(context);
					$("#mymain").html(themainCompiledHtml);
					
					
				} else {
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			},
			error: function(res) {
				console.log(JSON.stringify(res));
				console.log('1212');
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		});
	}
	
//	展开多选
	$('html').on('click','.openselect',function(){
		var en_name = $(this).attr('data-name');
		var exist = 'false';
		$(".confirm").attr('data-enname',en_name);
		
		if(window.allselectarr.length>0){
			var allselectarr = window.allselectarr;
			for(var i in allselectarr){
				if(allselectarr[i].enname == en_name){
					var currentselect = allselectarr[i].value;
					var exist = 'true';
				}
			}
			if(exist != 'true'){
				var bussinessType = window.selectType.bussinessType;
				for(var items in bussinessType){
					if(bussinessType[items].en_name == en_name){
						var currentselect = bussinessType[items].select_list;
					}
				}
			}
		}else{
			var bussinessType = window.selectType.bussinessType;
			for(var items in bussinessType){
				if(bussinessType[items].en_name == en_name){
					var currentselect = bussinessType[items].select_list;
				}
			}
		}
		
		
		console.log(JSON.stringify(currentselect));
		var myproduceTemplateScript = $("#myshowselect-template").html();
		var myproduceTemplate = Handlebars.compile(myproduceTemplateScript);
		var context = currentselect;
		var myproduceCompiledHtml = myproduceTemplate(context);
		$("#showselect").html(myproduceCompiledHtml);
		$('#allselect').show();
		$('#my-mask').show();
		$('body').css('overflow','hidden');
	})
	
//	食品经营
	$('html').on('tap','.openfoodselect',function(){
		var en_name = $(this).attr('data-name');
		var exist = 'false';
		$(".confirm").attr('data-enname',en_name);
		
		if(window.allselectarr.length>0){
			var allselectarr = window.allselectarr;
			for(var i in allselectarr){
				if(allselectarr[i].enname == en_name){
					var currentselect = allselectarr[i].value;
					var exist = 'true';
				}
			}
			if(exist != 'true'){
				var subject_type_remark = window.selectType.subject_type_remark;
				for(var items in subject_type_remark){
					if(subject_type_remark[items].en_name == en_name){
						var currentselect = subject_type_remark[items].select_list;
					}
				}
			}
		}else{
			var subject_type_remark = window.selectType.subject_type_remark;
			for(var items in subject_type_remark){
				if(subject_type_remark[items].en_name == en_name){
					var currentselect = subject_type_remark[items].select_list;
				}
			}
		}
		
		var myproduceTemplateScript = $("#myshowselect-template").html();
		var myproduceTemplate = Handlebars.compile(myproduceTemplateScript);
		var context = currentselect;
		var myproduceCompiledHtml = myproduceTemplate(context);
		$("#showselect").html(myproduceCompiledHtml);
		$('#allselect').show();
		$('#my-mask').show();
		$('body').css('overflow','hidden');
	})
	
	
//	主体业务
	$('html').on('tap','.openmainselect',function(){
		var en_name = $(this).attr('data-name');
		var exist = 'false';
		$(".confirm").attr('data-enname',en_name);
		
		if(window.allselectarr.length>0){
			var allselectarr = window.allselectarr;
			for(var i in allselectarr){
				if(allselectarr[i].enname == en_name){
					var currentselect = allselectarr[i].value;
					var exist = 'true';
				}
			}
			if(exist != 'true'){
				var main_type_or_type = window.selectType.main_type_or_type;
				for(var items in main_type_or_type){
					if(main_type_or_type[items].en_name == en_name){
						var currentselect = main_type_or_type[items].select_list;
					}
				}
			}
		}else{
			var main_type_or_type = window.selectType.main_type_or_type;
		
			for(var maintype = 0;maintype<main_type_or_type.length;maintype++){
				if(main_type_or_type[maintype].en_name == en_name){
					var currentselect = main_type_or_type[maintype].select_list;
				}
			}
		}
		
		var myproduceTemplateScript = $("#myshowselect-template").html();
		var myproduceTemplate = Handlebars.compile(myproduceTemplateScript);
		var context = currentselect;
		var myproduceCompiledHtml = myproduceTemplate(context);
		$("#showselect").html(myproduceCompiledHtml);
		$('#allselect').show();
		$('#my-mask').show();
		$('body').css('overflow','hidden');
	})
	
	
	
	
//	确认展开的多选
	$('html').on('click','.confirm',function(){
		var selectarr = [];
		var allselectarr = [];
		var enname = $(this).attr('data-enname');
		
		console.log(enname);
		
		
		$('input[name="'+enname+'"]').each(function(){
			var value = $(this).val();
			var cnname = $(this).attr('data-cnname');
			var enname = $(this).attr('data-enname');
			var group = $(this).attr('data-group');
			var spearator = $(this).attr('data-spearator');
			var havedata = $(this).attr('data-havedata');
			if($(this).is(':checked')){
				var selectjson = {
					'cn_name':cnname,
					'group':group,
					'en_name':enname,
					'spearator_name':spearator,
					'value':value,
					'have_data':havedata,
					'selected':true
				};
				selectarr.push(selectjson);
			}else{
				var selectjson = {
					'cn_name':cnname,
					'group':group,
					'en_name':enname,
					'spearator_name':spearator,
					'value':value,
					'have_data':havedata,
					'selected':false
				};
			}
			allselectarr.push(selectjson);
		});
		console.log(JSON.stringify(selectarr));
		console.log('1222');
		console.log(JSON.stringify(allselectarr));
		
		
		var objallselectarr = window.allselectarr;
		if(objallselectarr.enname == enname){
			objallselectarr.value = allselectarr;
		}else{
			var objjson = {
				'enname':enname,
				'value':allselectarr
			}
			window.allselectarr.push(objjson);
		}

//		return false;
		var myproduceTemplateScript = $("#myitem-template").html();
		var myproduceTemplate = Handlebars.compile(myproduceTemplateScript);
		var context = selectarr;
		var myproduceCompiledHtml = myproduceTemplate(context);
		$("#"+enname).html(myproduceCompiledHtml);
		
		
		$('#allselect').hide();
		$('#my-mask').hide();
		$('body').css('overflow','initial');
	})
	
//	取消展开的多选
	$('html').on('click','.cancel',function(){
		$('#allselect').hide();
		$('#my-mask').hide();
		$('body').css('overflow','initial');
	})
	
//	生产经营项目内项目删除
	$('html').on('tap','.myitemclose',function(){
		console.log('移除');
		var cnname = $(this).attr("data-cnname");
		var enname = $(this).attr("data-enname");
		var group = $(this).attr("data-group");
		var spearator = $(this).attr("data-spearator");
		var value = $(this).attr("data-value");
		var havedata = $(this).attr("data-havedata");
		var selected = $(this).attr("data-selected");
		
		console.log(enname);
		var allselectarr = window.allselectarr;
		
		for(var val in allselectarr){
			if(allselectarr[val].enname == enname){
				console.log(JSON.stringify(allselectarr[val].value));
				var valarr = allselectarr[val].value
				for(var item in valarr){
					if(valarr[item].cn_name == cnname){
						valarr[item].selected = false;
					}
				}
			}
		}
		$(this).parent().remove();
	})
	
	
})
