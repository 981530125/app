$(function() {
//	头部点击返回调用刷新
//	window.addEventListener('refresh', function(e){//执行刷新  
//		location.reload();
//	})
	window.addEventListener("changeCity", function(e) {
		//选择辖区后返回获取辖区id，筛选
        console.log(e.detail.cityName);
        console.log(e.detail.areaid);
        $("#selectareaid").val(e.detail.areaid);
        $(".areacontent").html(e.detail.cityName)
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
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	var count = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			++count;
//				mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > allnum));
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

//		shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level
//店铺id，搜索关键字，页数，辖区id，是否筛选证书类型，按证书类型筛选证书，本次检查动态评级
		getshop('',searchkey,count,newarea_id,selectAllLicenseType,allselecttypestring,check_level);

		}, 3000);
	}
	getCertificateType();
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
	function getshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level) {
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
				check_level: check_level
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					window.count = res.data.count;
					var theTemplateScript = $("#example-template").html();
					var theTemplate = Handlebars.compile(theTemplateScript);
					var context = res.data;
					var theCompiledHtml = theTemplate(context);
					$("#list-content").append(theCompiledHtml);
					mui('#refreshlist').pullRefresh().endPullupToRefresh((count > allnum));
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
//				prompt('error',JSON.stringify(res));
			}
		});
	}
	
	//搜索
	function searchgetshop(shopCategoryId,searchkey,page,areaId,selectAllLicenseType,licenseType,check_level) {
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
				check_level: check_level
			},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == '1000') {
//					prompt('搜索',JSON.stringify(res));
					window.count = res.data.count;
					var theTemplateScript = $("#example-template").html();
					var theTemplate = Handlebars.compile(theTemplateScript);
					var context = res.data;
					var theCompiledHtml = theTemplate(context);
					$("#list-content").html(theCompiledHtml);
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

//	menulist();
	getshop();
    
	
				
	
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
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level);
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
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level);
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
		searchgetshop('',searchkey,1,newarea_id,selectAllLicenseType,allselecttypestring,check_level);
		event.stopPropagation();
	})
	
	
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

