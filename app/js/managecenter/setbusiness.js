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

$(function() {
	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	location.reload();
	  }
	});
	window.pulldown = 'true';
	window.pullup = 'true';
	window.addEventListener("changeCity", function(e) {
		//选择辖区后返回获取辖区id，筛选
        console.log(e.detail.cityName);
        console.log(e.detail.areaid);
        $("#selectareaid").val(e.detail.areaid);
        $(".areacontent").html(e.detail.cityName);
        $(".areacontent").val(e.detail.cityName);
		if($("option:selected",this).val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",this).val();
		}
		
		var searchkey = '';
		if(searchkey){
			var searchkey = '';
		}else{
			var searchkey = '';
		}
		
//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		getshop('',searchkey,1,e.detail.areaid,true,'',check_level);
    });
	var allnum = Math.ceil(window.count/10);
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
		setTimeout(function() {
			getshop('','','','','','','','','','');
			getlicenseselect();
			getCertificateType();
		}, 1500);
	}
	var count = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		window.pullup = 'false';
		$('.mui-table-view-item').find('.left-checkbox').hide();
		$("#choice-all").attr('data-type','0');
		$("#choice-type").hide();
		$("#choice-all").html('选择');
		setTimeout(function() {
			++count;
//				mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > allnum));
			//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取本次检查动态评级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			var selectAllLicenseType = false;
			var selectarr = window.selecttype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					var typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].type]:'false'
					}
				}
				alljson = extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}

//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level
//     店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级,年度量化综合等级,当年风险分级,上年度风险分级
		getshop('',searchkey,count,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);

		}, 3000);
	}
	
	//	当年风险分级
	changeicon('.riskchangeicon','#risk_level','#riskno');
//	上年度风险分级
	changeicon('.firstchangeicon','#first_half_year_risk_level','#firstnon');
	//	年度量化综合等级
	changeicon('.grade_change','#grade','#gradeno');
	
	//	本次动态等级
	changelevelicon('.check_change','#check_level','#checkno');
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
	//获取周边店铺,仅下拉加载获取
	function getshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level) {
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
			var selectAllLicenseType = true;
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
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					window.count = res.data.count;
					res.data.rooturl = rooturl;
					
					if(window.pullup == 'true'){
						var theTemplateScript = $("#example-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list-content").html(theCompiledHtml);
						window.pullup = 'true';
					}
					if(window.pullup == 'false'){
						var theTemplateScript = $("#add-template").html();
						var theTemplate = Handlebars.compile(theTemplateScript);
						var context = res.data;
						var theCompiledHtml = theTemplate(context);
						$("#list").append(theCompiledHtml);
						window.pullup = 'true';
					}
					
					mui('#refreshlist').pullRefresh().endPullupToRefresh((count > allnum));
				} else {
					console.log('asass');
					
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
	
	//搜索
	function searchgetshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level,grade,risk_level,first_half_year_risk_level) {
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = '';
		}
		if(selectAllLicenseType){
			var selectAllLicenseType = selectAllLicenseType;
		}else{
			var selectAllLicenseType = true;
		}
		if(grade){
			var grade = grade;
		}else{
			var grade = true;
		}
		if(risk_level){
			var risk_level = risk_level;
		}else{
			var risk_level = true;
		}
		if(first_half_year_risk_level){
			var first_half_year_risk_level = first_half_year_risk_level;
		}else{
			var first_half_year_risk_level = true;
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

		var num = 10;
		$("#my-mask").show();
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
				orderBy: '',
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
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == '1000') {
					res.data.rooturl = rooturl;
//					prompt('搜索',JSON.stringify(res));
					window.count = res.data.count;
					var theTemplateScript = $("#example-template").html();
					var theTemplate = Handlebars.compile(theTemplateScript);
					var context = res.data;
					var theCompiledHtml = theTemplate(context);
					$("#list-content").html(theCompiledHtml);
					mui.toast(res.message,{ duration:'long', type:'div' });
				} else {
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
			},
			error: function(res) {
				$("#my-mask").hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
//				prompt('error',JSON.stringify(res));
			}
		});
	}

//	menulist();
//	getshop();
    
	
				
	
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
					localStorage.setItem('jlist',jlist);
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	//判断获取获取辖区
	var jlist = localStorage.getItem('jlist');
	if(jlist > 0 && jlist){
		getjurisdiction(area_id);
	}else{
		getjurisdiction(area_id);
	}
	
	//点击选择辖区
	$('html').on('click','.jurisarea',function(){
		mui.openWindow({
		    url: 'areaselect.html',
		    id: 'areaselect.html',
		    extras:{
		    	jlist: jlist
			}
		});
	});
	
	//搜索
	$('html').on('click','#searchAddress',function(event){
		//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取等级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			if(selectype == 'type99'){
				var selectAllLicenseType = true;
			}else{
				var selectAllLicenseType = false;
			}
			var selectarr = window.selecttype;
			var allselecttype = [];
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					typejson = {
						[selectarr[m].type]:'false'
					}
				}
				allselecttype.push(typejson);
			}
			var allselecttypestring = JSON.stringify(allselecttype);
		}

//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);
		event.stopPropagation();
	})
	
	$("#selectlevel").on("change",function(event){
		//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取等级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			if(selectype == 'type99'){
				var selectAllLicenseType = true;
			}else{
				var selectAllLicenseType = false;
			}
			var selectarr = window.selecttype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					var typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].type]:'false'
					}
				}
				alljson = extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}
		
//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);
		event.stopPropagation();
	});
	
	//修改当年风险分级
	$("#risk_select").on("change",function(event){
		//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取等级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			if(selectype == 'type99'){
				var selectAllLicenseType = true;
			}else{
				var selectAllLicenseType = false;
			}
			var selectarr = window.selecttype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					var typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].type]:'false'
					}
				}
				alljson = extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}
		
//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);
		event.stopPropagation();
	});
	
	//修改年度量化综合等级
	$("#gradelevel").on("change",function(event){
		//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取等级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			if(selectype == 'type99'){
				var selectAllLicenseType = true;
			}else{
				var selectAllLicenseType = false;
			}
			var selectarr = window.selecttype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					var typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].type]:'false'
					}
				}
				alljson = extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}
		
//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);
		event.stopPropagation();
	});
	
	//修改上年度风险分级
	$("#first_half_year_level").on("change",function(event){
		//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取等级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			if(selectype == 'type99'){
				var selectAllLicenseType = true;
			}else{
				var selectAllLicenseType = false;
			}
			var selectarr = window.selecttype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					var typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].type]:'false'
					}
				}
				alljson = extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}
		
//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);
		event.stopPropagation();
	});
	
	
	
	
	//证书筛选
	$("#selectype").on("change",function(event){
		//获取辖区
		if($("#selectareaid").val() == ''){
			var newarea_id = area_id;
		}else{
			var newarea_id = $("#selectareaid").val();
		}
		//获取等级
		if($("option:selected",'#selectlevel').val() == ''){
			var check_level = '';
		}else{
			var check_level = $("option:selected",'#selectlevel').val();
		}
		//获取当年风险分级
		if($("option:selected",'#risk_select').val() == ''){
			var risk_level = '';
		}else{
			var risk_level = $("option:selected",'#risk_select').val();
		}
		//获取年度量化综合等级
		if($("option:selected",'#gradelevel').val() == ''){
			var grade = '';
		}else{
			var grade = $("option:selected",'#gradelevel').val();
		}
		//获取上年度风险分级
		if($("option:selected",'#first_half_year_level').val() == ''){
			var first_half_year_risk_level = '';
		}else{
			var first_half_year_risk_level = $("option:selected",'#first_half_year_level').val();
		}
		//获取搜索
		var searchkey = '';
		if($('#search-key').val() == ''){
			var searchkey = '';
		}else{
			var searchkey = $('#search-key').val();
		}
		//获取证书
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $("option:selected",'#selectype').val();
			if(selectype == 'type99'){
				var selectAllLicenseType = true;
			}else{
				var selectAllLicenseType = false;
			}
			var selectarr = window.selecttype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].type == selectype){
					var typejson = {
						[selectarr[m].type]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].type]:'false'
					}
				}
				alljson = extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}

//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level,grade,risk_level,first_half_year_risk_level);
		event.stopPropagation();
	})
	
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
					console.log(JSON.stringify(res.data));
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
		var alljson = window.typeinfo.data;
		var typedata = [];
		for(var item in alljson){
			if(alljson[item].en_name == en_name){
				typedata = alljson[item];
			}
		}
		
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
      	$("#my-mask").show();
		changeLicenseStatus(formjson,id_list);
	})
	
//	提交修改批量编辑证书状态
	function changeLicenseStatus(formjson,id_list){
		console.log(userType);
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
					location.reload();
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
	
	function extend(target, source) {
       for (var obj in source) {
           target[obj] = source[obj];
       }
       return target;
   	}
	
})
//底部跳转至中心
function skipbottom(){
	console.log(userType);
	if(userType == 'user'){
		console.log('个人中心');
		var skipurl = 'Individualcenter.html';
	}
	if(userType == 'admin'){
		console.log('管理中心');
		var skipurl = 'managecenter.html';
	}
	if(userType == 'shop'){
		console.log('商家中心');
		var skipurl = 'shopcenter.html';
	}
	console.log(skipurl);
	window.location.href=skipurl;
}

////资料编辑
function lookdetail(id){
	mui.openWindow({
	    url: 'editshop.html',
	    extras:{
			licenses_id: id,
			type: 1
		}
	});
}


////查看详情
function lookallshop(license_id,id){
	console.log(id);
	mui.openWindow({
	    url: '../../shop/ShopPage.html',
	    extras:{
			license_id: license_id,
			shopid: id,
			type: 2
		}
	});
}

////监管记录1
//function writerecords(id){
//	mui.openWindow({
//	    url: 'ShopPage.html',
//	    extras:{
//			shopid: id,
//			type: 1
//		}
//	});
//	console.log(id);
//}

