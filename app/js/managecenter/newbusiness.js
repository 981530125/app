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
	//	权限判断
	var rootpower = [{
			obj:'.typeitem',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Shop/multiEditLicenseStatus',
			describe:'批量修改'
		},{
			obj:'.btntodelete',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/License/deleteData',
			describe:'删除证书'
		},{
			obj:'#updatelastyear',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/License_year_level_half_year_update_record/pageData',
			describe:'风险分级年度更新'
		}];
	
	window.allselectdata = [];
	
	window.addEventListener("removemask", function(e) {
		window.pulldown = 'true';
		if(e.detail.isdata == 'true'){
			$('#my-mask').hide();
		}
	})
	
	
	//监听自定义事件，用于和menu.html页面进行通信
	window.addEventListener("changedata", function(e) {
		window.pulldown = 'true';
		if(e.detail.isdata == '1'){
			//获取搜索
			var searchkey = '';
			if($('#search-key').val() == ''){
				var searchkey = '';
			}else{
				var searchkey = $('#search-key').val();
			}
			var selectareaid = '';
			if($('#selectareaid').val() == ''){
				var selectareaid = '';
			}else{
				var selectareaid = $('#selectareaid').val();
			}
			$("#my-mask").show();
			console.log(JSON.stringify(e.detail.allselectdata.length));
			window.allselectdata = e.detail.allselectdata[0];
			//      license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status
//      task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished
//			getSelfData,search_text,if_network_or_is_business_network,if_physical,
//		task_and_record_time_start,task_and_record_time_end,grant_date_start,grant_date_end,
//		license_valid_from_start,license_valid_from_end,license_valid_to_start,license_valid_to_end,
//		ope_measure_start,ope_measure_end,multiTypeSelected,include_data_of_lack_field,if_null_data,_license_rating

		
//		window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data

//			console.log(window.allselectdata.license_valid_arr);
//			return false;
			getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data,window.allselectdata._license_rating);
			getlicenseselect();
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
		resh();
		mui('#pullrefresh').pullRefresh().refresh(true);
		
		var currentweb = plus.webview.currentWebview();
		switch(currentweb.tasktype)
		{
		case 'expire':
			mui('#pullrefresh').pullRefresh().endPulldown();
			return false;
		  break;
		case 'monthOne':
			mui('#pullrefresh').pullRefresh().endPulldown();
			return false;
		  break;
		case 'monthThree':
			mui('#pullrefresh').pullRefresh().endPulldown();
			return false;
		  break;
		default:
			window.pulldown = 'true';
			setTimeout(function() {
				//      license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status
	//      task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished
	//			getshop('','','','','','','','','','','','','','','','','','','','','','','');
				
				var license_valid_arr = {"正常":"true","注销":"false","失效":"false","特殊":"false"};
				
				
				getshop('','','','','','','','','','',license_valid_arr,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','');
				
			}, 1000);
		 break;
		}
		getlicenseselect();
	}
	window.count = 2;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		console.log('x1');
		window.pullup = 'true';
		$('.mui-table-view-item').find('.left-checkbox').hide();
		$("#choice-all").attr('data-type','0');
		$("#choice-type").hide();
		$("#choice-finish").hide();
		$("#choice-all").html('选择');
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		console.log('x2');
		var selectareaid = '';
		if($('#selectareaid').val() == ''){
			var selectareaid = '';
		}else{
			var selectareaid = $('#selectareaid').val();
		}

		console.log('pulldown'+window.pulldown);
		console.log('pullup'+window.pullup);
		console.log('121212上拉');

		setTimeout(function() {
			
//shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level,
//
//license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status,
//task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished
			
			
			if(JSON.stringify(window.allselectdata) == '[]'){
				var license_valid_arr = {"正常":"true","注销":"false","失效":"false","特殊":"false"};
				getshop('',searchkey,window.count,selectareaid,'','','','','','',license_valid_arr,'','','','','','','','','','','','');
			}else{
//				getshop('',searchkey,window.count,selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished);
				getshop('',searchkey,window.count,selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data,window.allselectdata._license_rating);
		
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
		if(JSON.stringify(window.allselectdata) == '[]'){
			var license_valid_arr = {"正常":"true","注销":"false","失效":"false","特殊":"false"};
			getshop('',searchkey,'',selectareaid,'','','','','','',license_valid_arr,'','','','','','','','','','','','');
		}else{
			getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data,window.allselectdata._license_rating);
		
//			getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished);
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
	window.newyear = year;
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
	
	
	$('html').on('tap','#updatelastyear',function(){
		$("#my-mask").show();
		console.log('asasas');
		mui.openWindow({
		    url:'updateyear.html',
		    id:'updateyear',
		    styles:{
		      top:54,//新页面顶部位置
		      bottom:50,//新页面底部位置
		      left:20,
		      right:20
		    },
		    extras:{
		    },
		    createNew:false
		})
	})
	
	//点击选择辖区
	$('html').on('click','.jurisarea',function(){
		getjurisdiction(area_id);
		
	});
	
	//按管理员辖区id,获取辖区
	function getjurisdiction(areaId,ext){
		if(ext){
			var ext = ext;
		}else{
			var ext = 'null'
		}
		
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
					    	jlist: jlist,
					    	ext:ext
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
		if(e.detail.data == 'true'){
			window.pulldown = 'true';
	        $(".jurisarea").find(".areacontent").html(e.detail.currentname);
	        $("#selectareaid").val(e.detail.areaid);
	        var selectareaid = e.detail.areaid;
	        var searchkey = $('.searchkey').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
			
			console.log(selectareaid);
			console.log(searchkey);
			
	        $("#my-mask").show();
	        if(JSON.stringify(window.allselectdata) == '[]'){
	        	var license_valid_arr = {"正常":"true","注销":"false","失效":"false","特殊":"false"};
				getshop('',searchkey,'',selectareaid,'','','','','','',license_valid_arr,'','','','','','','','','','','','');
			}else{
//				getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished);
				getshop('',searchkey,'',selectareaid,window.allselectdata.selectAllLicenseType,window.allselectdata.alljson,'','','','',window.allselectdata.license_valid_arr,window.allselectdata.check_level_arr,window.allselectdata.grade_arr,window.allselectdata.risk_level_arr,window.allselectdata.first_half_year_risk_level_arr,window.allselectdata.is_open,window.allselectdata.three_small_status,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.task_num_delivered,window.allselectdata.task_num_finished,window.allselectdata.record_num_finished,window.allselectdata.getSelfData,window.allselectdata.search_text,window.allselectdata.if_network_or_is_business_network,window.allselectdata.if_physical,window.allselectdata.task_and_record_time_start,window.allselectdata.task_and_record_time_end,window.allselectdata.grant_date_start,window.allselectdata.grant_date_end,window.allselectdata.license_valid_from_start,window.allselectdata.license_valid_from_end,window.allselectdata.license_valid_to_start,window.allselectdata.license_valid_to_end,window.allselectdata.ope_measure_start,window.allselectdata.ope_measure_end,window.allselectdata.multiTypeSelected,window.allselectdata.include_data_of_lack_field,window.allselectdata.if_null_data,window.allselectdata._license_rating);
		
			}
		}
		console.log(JSON.stringify(e.detail.areaid));
		if(e.detail.data == 'change'){
			var id_list = [];
			var allCheckBox = $(".item-check");
	        //循环设置所有复选框为选中状态
	    	$.each($('input[name="licenseId"]:checked'),function(){
	            id_list.push($(this).val());
	       });
			
			var btnArray = ['否', '是'];
			var areaid
			
			var formjson = {
				'en_name':'_area_id',
				'value': e.detail.areaid
			}
			
			mui.confirm('您选择辖区为'+e.detail.currentname, '修改辖区', btnArray, function(e) {
				if (e.index == 1) {
					mui.toast('确认',{ duration:'long', type:'div' });
					changeLicenseStatus(formjson,id_list);
					
				} else {
					mui.toast('取消',{ duration:'long', type:'div' }) 
				}
			})
		}
		
    })
	
	function resh(){
		var slidepage = plus.webview.getWebviewById('offcanvas-drag-left-plus-menu');
		mui.fire(slidepage, 'refresh',{
			reload:'true'
		});
	}
	
	
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
		if($(this).attr('data-type') == 0){
			$('.mui-table-view-item').find('.left-checkbox').show();
			$("#choice-type").show();
			$(this).attr('data-type','1');
			$(this).html('取消');
//			$("#choice-finish").show();
		}else{
			$('.mui-table-view-item').find('.left-checkbox').hide();
			$(this).attr('data-type','0');
			$("#choice-type").hide();
			$(this).html('选择');
//			$("#choice-finish").hide();
		}
		event.stopPropagation();
	})
	
//	点击完成
	$('html').on('click','#choice-finish',function(){
		var id_list = [];
		var allCheckBox = $(".item-check");
        //循环设置所有复选框为选中状态
    	$.each($('input[name="licenseId"]:checked'),function(){
            id_list.push($(this).val());
       	});
       	console.log(JSON.stringify(id_list));
       	
	})
	
//	$('html').on('change','.item-check',function(){
//		var num = $('input[name="licenseId"]:checked').length;
//		$("#choice-finish").html('完成('+num+')');
//	})
	
	
	
//	全选
	$('html').on('click','#all-select',function(){
		var listBox = $(".item-check");
		if ($(this).attr("data-checked") == 0) {
//			选中了
			$(this).attr("data-checked",'1');
            listBox.each(function() {
                var ele = this;
                ele.checked=true;
            })
        } else {
        	$(this).attr("data-checked",'0');
            listBox.each(function() {
                var ele = this;
                ele.checked=false;
            })
        }
	})
	
	//	获取证书选项
	function getlicenseselect(){
		var url = rooturl+'Api_apps/getLicenseMultiSetOption';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == '1000') {
//					prompt('搜索',JSON.stringify(res));
					var typeTemplateScript = $("#typeitem-template").html();
					var typeTemplate = Handlebars.compile(typeTemplateScript);
					var context = res;
					var typeCompiledHtml = typeTemplate(context);
					$("#item-select-all").html(typeCompiledHtml);
					window.typeinfo = res;
				} else {
					alert(res.message);
					console.log(res.message);
				}
			},
			error: function(res) {
				$("#my-mask").hide();
//				prompt('error',JSON.stringify(res));
			}
		});
	}
	
//	点击弹出类型等级
	$("html").on('click','.typeitem',function(){
		console.log($(this).attr('data-enname'));
		var en_name = $(this).attr('data-enname');
		
		if(en_name == '_area_id'){
			var formjson = $('#formdata').serializeObject();
			var id_list = [];
			var allCheckBox = $(".item-check");
	        //循环设置所有复选框为选中状态
	    	$.each($('input[name="licenseId"]:checked'),function(){
	            id_list.push($(this).val());
	       });
	       
	       console.log(JSON.stringify(id_list));
			if(id_list.length>0){
				getjurisdiction(area_id,'change');
			}else{
				mui.alert('未选择企业');
			}
//			选择辖区
			return false;
		}
		if(en_name == 'updatelastyear'){
			console.log(asasas);
			return false;
		}
		
		var alljson = window.typeinfo.data;
		var typedata = [];
		for(var item in alljson){
			if(alljson[item].en_name == en_name){
				typedata = alljson[item];
			}
		}
		
		
//		console.log(JSON.stringify(typedata));
		var typeTemplateScript = $("#"+en_name+"-template").html();
		var typeTemplate = Handlebars.compile(typeTemplateScript);
		var context = typedata;
		var typeCompiledHtml = typeTemplate(context);
		$("#type-mask-content").html(typeCompiledHtml);
		$("#showmask").show();
		$("#type-mask").show();
		
	})
	
//	点击取消弹窗
	$('html').on('click','#type-mask',function(){
		$("#showmask").hide();
		$("#type-mask").hide();
	})
	
//	点击修改提交
	$("html").on('click','.submit-btn-style',function(){
		var formjson = $('#formdata').serializeObject();
		var id_list = [];
		var allCheckBox = $(".item-check");
        //循环设置所有复选框为选中状态
    	$.each($('input[name="licenseId"]:checked'),function(){
            id_list.push($(this).val());
       });
       	
       	console.log(JSON.stringify(id_list));
		console.log(JSON.stringify(id_list.length));
		
		if(id_list.length == 0){
			mui-alert('未选择企业,请选择!');
			return false;
		}
		
       	$("#my-mask").show();
       	console.log(JSON.stringify(formjson));
       	
       	console.log(JSON.stringify(formjson));
       	
//     	if(formjson.en_name == '_license_status'){
//			setLicenseStatus(formjson,id_list)
//		}else{
			changeLicenseStatus(formjson,id_list);
//		}
       	return false;
	})
	
//	提交修改批量编辑证书状态
	function changeLicenseStatus(formjson,id_list){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/multiEditLicenseStatus';
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
				en_name:formjson.en_name,
				value:formjson.value,
				id_list:id_list,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == '1000') {
					console.log(JSON.stringify(res));
					setTimeout(function() {
						location.reload();
					}, 500);
					mui.toast(res.message,{ duration:'long', type:'div' });
				} else {
					alert(res.message);
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(JSON.stringify(res));
				}
			},
			error: function(res) {
				$("#my-mask").hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
//				prompt('error',JSON.stringify(res));
			}
		});
	}
	
	////资料编辑
	$("html").on('tap','.lookdetail',function(){
		var id = $(this).attr('data-id');
		mui.openWindow({
		    url: 'editshop.html',
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
	
	
	//	当年风险分级
	changeicon('.riskchangeicon','#risk_level','#riskno');
//	上年度风险分级
	changeicon('.firstchangeicon','#first_half_year_risk_level','#firstnon');
	//	年度量化综合等级
	changeicon('.grade_change','#grade','#gradeno');
	
	//	本次动态等级
	changelevelicon('.check_change','#check_level','#checkno');
	
	//证书有效性
	changebookicon('.license_status','#_license_status','#licenseno');
	//名单管理
	changebookicon('._license_rating','#_license_rating','#license_rating');
	//三小
	changebookicon('.three_small_status','#_three_small_status','#small_status');
	
	
//	开放与不开放
	is_open('.is_open','#is_open');
	
	function is_open(node,val){
		$('html').on('click',node,function(){
			$(node).each(function(){
			    $(this).attr("src",($(this).attr("data-src")));
			});
			var level = $(this).attr("data-id");
			$(this).parent().parent().find('.icon-style').css('color','#d1d1d1');
			
			switch(level)
			{
			case '1':
				$(this).attr("src",'../../../img/toshow.png');
				$(this).parent().find('.icon-style').css('color','#27c24c');
			  	console.log(level);
			  	break;
			default:
				$(this).attr("src",'../../../img/toclose.png');
				$(this).parent().find('.icon-style').css('color','#ed3838');
			  	console.log(level);
			}
			$(val).val(level);
		})
	}
	
	
	
	function changeicon(node,val,non){
		$('html').on('click',node,function(){
			$(node).each(function(){
			    $(this).attr("src",($(this).attr("data-src")));
			});
			var level = $(this).attr("data-id");
			$(this).parent().parent().find('.icon-style').css('color','#d1d1d1');
			switch(level)
			{
			case 'A':
				$(this).attr("src",'../../../img/A.png');
				$(this).parent().find('.icon-style').css('color','#20c33b');
			  	console.log(level);
			  	break;
			case 'B':
				$(this).attr("src",'../../../img/B.png');
				$(this).parent().find('.icon-style').css('color','#ffb638');
				console.log(level);
			 	break;
			case 'C':
				$(this).attr("src",'../../../img/C.png');
				$(this).parent().find('.icon-style').css('color','#eb192a');
				console.log(level);
			  	break;
			case 'D':
				$(this).attr("src",'../../../img/D.png');
				$(this).parent().find('.icon-style').css('color','#af813c');
			  	console.log(level);
			  	break;
			default:
				$(this).attr("src",'../../../img/selectmessage.png');
				$(this).parent().find('.icon-style').css('color','#39abdf');
				console.log(level);
			}
			$(val).val(level);
			$(non).hide()
		})
	}
	
	//动态等级
	function changelevelicon(node,val,non){
		$('html').on('click',node,function(){
			$(node).each(function(){
			    $(this).attr("src",($(this).attr("data-src")));
			});
			var level = $(this).attr("data-id")
			switch(level)
			{
			case '优秀':
				$(this).attr("src",'../../../img/selectgood.png');
			  	console.log(level);
			  	break;
			case '良好':
				$(this).attr("src",'../../../img/selectwell.png');
				console.log(level);
			 	break;
			case '一般':
				$(this).attr("src",'../../../img/selectsoso.png');
				console.log(level);
			  	break;
			case '整改中':
				$(this).attr("src",'../../../img/selectwait.png');
				console.log(level);
			  	break;
			default:
				$(this).attr("src",'../../../img/selectmessage.png');
			  	console.log(level);
			}
			$(val).val(level);
			$(non).hide()
		})
	}
	//证书有效性
	function changebookicon(node,val,non){
		$('html').on('click',node,function(){
			$(node).each(function(){
			    $(this).attr("src",($(this).attr("data-src")));
			});
			var level = $(this).attr("data-id");
			switch(level)
			{
			case '1':
				$(this).attr("src",'../../../img/selectgood.png');
			  	console.log(level);
			  	break;
			case '2':
				$(this).attr("src",'../../../img/selectwell.png');
				console.log(level);
			 	break;
			case '3':
				$(this).attr("src",'../../../img/selectsoso.png');
				console.log(level);
			  	break;
			case '4':
				$(this).attr("src",'../../../img/selectwait.png');
				console.log(level);
			  	break;
			default:
				$(this).attr("src",'../../../img/selectmessage.png');
			  	console.log(level);
			}
			$(val).val(level);
			$(non).hide()
		})
	}
	
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
					console.log(JSON.stringify(res.data));
					window.selecttype = res.data;
					var typeTemplateScript = $("#cerbooktype-template").html();
					var typeTemplate = Handlebars.compile(typeTemplateScript);
					var context = res.data;
					var typeCompiledHtml = typeTemplate(context);
					$("#selectype").html(typeCompiledHtml);
					console.log(res.message);
				}else{
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
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
	function getshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level,license_valid_arr,check_level_arr,grade_arr,risk_level_arr,first_half_year_risk_level_arr,is_open,three_small_status,task_and_record_time_start,task_and_record_time_end,task_num_delivered,task_num_finished,record_num_finished,getSelfData,search_text,if_network_or_is_business_network,if_physical,task_and_record_time_start,task_and_record_time_end,grant_date_start,grant_date_end,license_valid_from_start,license_valid_from_end,license_valid_to_start,license_valid_to_end,ope_measure_start,ope_measure_end,multiTypeSelected,include_data_of_lack_field,if_null_data,_license_rating) {
		console.log('pulldown'+window.pulldown);
		console.log('pullup'+window.pullup);
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
		
		if(_license_rating){
			_license_rating = _license_rating;
		}else{
			_license_rating = '-1';
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
				_license_rating:_license_rating,
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
					
//					console.log(JSON.stringify(res.data.data));
//					console.log(window.pullup);
					
					if(window.pulldown == 'true'){
						$("#list-content").html('');
						window.allshopinfo = res.data.data;
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
						window.pullup = 'false';
						window.count = window.count+1;
						var adddata = res.data.data;
						for(var i in adddata){
							window.allshopinfo.push(adddata[i]);
						}
						var theTemplateScript = $("#shoplist-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list-content").append(theCompiledHtml);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						
					}
					
					//权限配置
					console.log('权限配置');
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
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
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		});
	}
	
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
})
