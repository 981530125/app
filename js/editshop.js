coordinate();
//FORm序列化转json
$.fn.serializeObject = function()    
{    
   var o = {};
	var oarr = []; 
   var a = this.serializeArray();  
	$.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    var $radio = $('input[type=radio],input[type=checkbox]',this);
    $.each($radio,function(){
        if(!o.hasOwnProperty(this.name)){
            o[this.name] = '';
        }
    });
    return o;  
};
window.addEventListener('message', function(event) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    var loc = event.data;
    if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
      console.log('location', loc);
      console.log(JSON.stringify(loc) );
      $("#corporation_address").val(loc.poiaddress);
      $("#addresskey").val(loc.poiaddress);
      $("#lat").val(loc.latlng.lat);
      $("#lng").val(loc.latlng.lng);
      var corporation_address_components = {
      	poiaddress:loc.poiaddress,
      	poiaddress:loc.poiname,
      	poiaddress:loc.cityname,
      };
      $("#corporation_address_components").val(JSON.stringify(corporation_address_components));
    }
}, false);
$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    console.log(JSON.stringify(self.licenses_id));
	    window.licenses_id = self.licenses_id;
	    getshopinfo(self.licenses_id);
	});
	//点击切换
	$('.all-li').click(function() {
		var id = $(this).attr('data-id');
		var tasktype = $(this).attr('data-tasktype');
		gettypeitem(id);
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
	
//	年度量化综合等级
	changeicon('.riskchangeicon','#risk_level','#riskno');
//	年度量化综合等级
	changeicon('.firstchangeicon','#first_half_year_risk_level','#firstnon');
	//	年度量化综合等级
	changeicon('.gradechangeicon','#grade','#gradeno');
	
	//	本次
	changelevelicon('.check_change','#check_level','#checkno');

	
	function changeicon(node,val,non){
		$('html').on('click',node,function(){
			$(node).each(function(){
			    $(this).attr("src",($(this).attr("data-src")));
			});
			var level = $(this).attr("data-id")
			switch(level)
			{
			case 'A':
				$(this).attr("src",'img/A.png');
			  	console.log(level);
			  	break;
			case 'B':
				$(this).attr("src",'img/B.png');
				console.log(level);
			 	break;
			case 'C':
				$(this).attr("src",'img/C.png');
				console.log(level);
			  	break;
			default:
				$(this).attr("src",'img/D.png');
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
				$(this).attr("src",'img/selectgood.png');
			  	console.log(level);
			  	break;
			case '良好':
				$(this).attr("src",'img/selectwell.png');
				console.log(level);
			 	break;
			case '一般':
				$(this).attr("src",'img/selectsoso.png');
				console.log(level);
			  	break;
			case '整改中':
				$(this).attr("src",'img/selectwait.png');
				console.log(level);
			  	break;
			default:
				$(this).attr("src",'img/selectmessage.png');
			  	console.log(level);
			}
			$(val).val(level);
			$(non).hide()
		})
	}
	
	
	
	
	//根据证书获取商家信息
	function getshopinfo(licenseId){
		console.log('121');
		var licenseId = licenseId;
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId';
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
				licenseId:licenseId
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					res.data.licenseId = licenseId;
//					商家信息
					
					window.shopallinfo = res.data;
//					prompt('121',JSON.stringify(window.shopallinfo));
					var formTemplateScript = $("#change-template").html();
					var formTemplate = Handlebars.compile(formTemplateScript);
					var context = res.data;
					var formCompiledHtml = formTemplate(context);
					$("#change-form").append(formCompiledHtml);
//					证书信息
					var cerbookTemplateScript = $("#book-template").html();
					var cerbookTemplate = Handlebars.compile(cerbookTemplateScript);
					var bookinfo = res.data;
					var cerbookCompiledHtml = cerbookTemplate(bookinfo);
					$("#cerbook-form").append(cerbookCompiledHtml);

					var originOption = window.shopallinfo;//源数据用于比较
					var options = window.shopallinfo;//拷贝一份用于修改
					$("#residence").html(originOption.residence);
					$("#corporation_address").val(originOption.corporation_address);
//					$("#addresskey").val(originOption.residence);
					$("#addresskey").val(originOption.corporation_address);
					
					init(options);

					console.log(res.message);
				}else{
					console.log(res.message);
				}
				console.log(res.data);
			},
			error: function(res) {
				
//				console.log(JSON.stringify(res.message));
			}
		})
	}
	//上传和修改商家信息
	function editshopinfo(){
		var formjson = $('#change-form').serializeObject();
		var year_level = {
			"id": null,
            "grade": formjson.grade,
            "risk_level": formjson.risk_level,
            "first_half_year_risk_level": formjson.first_half_year_risk_level,
            "is_show":{
            	"grade":formjson.is_grade
            }
		}
		if(formjson.password){
			var password =formjson.password
		}
		$("#my-mask").show();
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/editLicenseShopInfo';
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
				msgType: msgType,
				password: password,
				licenseId:formjson.licenseId,
				shopId: formjson.shopId,
				note:formjson.note,
				corporation_name:formjson.corporation_name,
				bindMobile:formjson.bindMobile,
				legal_person_name:formjson.legal_person_name,
				legel_person_contact:formjson.legel_person_contact,
				introduction:formjson.introduction,
				lat:formjson.lat,
				lng:formjson.lng,
				corporation_address:formjson.corporation_address,
				corporation_address_components:formjson.corporation_address_components,
				year_level:year_level,
				check_level:formjson.check_level,
				check_level_is_show:formjson.check_level_is_show
			},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == 1000){
					console.log(JSON.stringify(res));
					var formTemplateScript = $("#change-template").html();
					var formTemplate = Handlebars.compile(formTemplateScript);
					var context = res.data;
					var formCompiledHtml = formTemplate(context);
					$("#change-form").append(formCompiledHtml);
					mui.toast(res.message,{ duration:'long', type:'div' });
					mui.back();
					var list = plus.webview.currentWebview().opener();
					 //触发父页面的自定义事件(refresh),从而进行刷新
					  mui.fire(list, 'refresh');
					  //返回true,继续页面关闭逻辑
						return true;
				}else{
					alert(res.message);
					console.log(JSON.stringify(res));
				}
				console.log(res.data);
			},
			error: function(res) {
				$("#my-mask").hide();
				prompt("error1",JSON.stringify(res));
				console.log(res.message);
			}
		})
	}
	
//	编辑证书
	function editcerbook(){
		var license_column_data = $('#cerbook-form').serializeObject();
		var licenseId = license_column_data.licenseId
		delete license_column_data['licenseId'];
		
//		console.log(JSON.stringify(license_column_data));

		console.log(licenseId);

		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/license/editLicenseInfo';
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
				licenseId:licenseId,
				license_column_data:license_column_data
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					console.log(JSON.stringify(res));
					alert(res.message);
				}else{
					console.log(JSON.stringify(res));
				}
				console.log(res.data);
			},
			error: function(res) {
				prompt("error1",JSON.stringify(res));
				console.log(res.message);
			}
		})
	}
//	是否开放
	$(document).ready(function(){
 		$('html').on('click','.mui-switch',function(event){
 			var num = $('.mui-switch').length;
 			if($(this).hasClass('mui-active')){
 				for(var n = 0;n<num;n++){
 					$('.mui-switch').eq(n).removeClass('mui-active');
 					$('.mui-switch').eq(n).find(".is_open").val('0')
 					$('.mui-switch').eq(n).find(".hide-switch").html('隐藏');
 				}
 			}else{
 				for(var n = 0;n<num;n++){
 					$('.mui-switch').eq(n).addClass('mui-active');
 					$('.mui-switch').eq(n).find(".is_open").val('1');
 					$('.mui-switch').eq(n).find(".hide-switch").html('显示');
 				}
 			}
 		})
 	})
	
//	商家信息确认
	$('html').on('click','.editshop',function(){
		console.log($("#licenseId").val());
		var formjson = $('#change-form').serializeObject();
		console.log(JSON.stringify(formjson));
		editshopinfo();
		
		
	});
	//	商家信息取消
	$('html').on('click','.cancelshop',function(){
		mui.back();
		 var list = plus.webview.currentWebview().opener();
		 //触发父页面的自定义事件(refresh),从而进行刷新
		  mui.fire(list, 'refresh');
		  //返回true,继续页面关闭逻辑
			return true;
	});
	$('html').on('click','#material',function(){
		mui.openWindow({
		    url:'material.html',   
		    id:'material',
		    extras: {licenseId:window.licenses_id}
		});
	})
	//	证书信息确认
	$('html').on('click','.editcerbook',function(){
		console.log($("#licenseId").val());
		var formjson = $('#change-form').serializeObject();
		console.log(JSON.stringify(formjson));
		editcerbook();
	});
//	证书地址填充
$("html").on("click",'#searchadress-btn',function(){
	var content = $("#target").val();
	$("#addresskey").val(content);
})
	
	
	
})

function coordinate() {
	var latitude;
	var longitude;
	var map, markersArray = [];
	//判断是否支持 获取本地位置
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		x.innerHTML = "浏览器不支持定位.";
	}

	function showPosition(position) {
		latitude = position.coords.latitude - 0.003002;
		longitude = position.coords.longitude + 0.004671;
		window.latitude =latitude;
		window.longitude = longitude;

	}
	//判断坐标是否可用
	function showError(error) {
		errMsg = document.querySelector('#errMsg');
		switch(error.code) {
			case error.PERMISSION_DENIED:
				// User denied the request for Geolocation.
				errMsg.innerText = "定位失败,用户拒绝请求地理定位";
				break;
			case error.POSITION_UNAVAILABLE:
				// Location information is unavailable.
				errMsg.innerText = "定位失败,位置信息是不可用";
				break;
			case error.TIMEOUT:
				// The request to get user location timed out.
				errMsg.innerText = "定位失败,请求获取用户位置超时";
				break;
			case error.UNKNOWN_ERROR:
				// An unknown error occurred.
				errMsg.innerText = "定位失败,定位系统失效";
				break;
		}
	}
	
}

/*测试用参数*/

var searchService, markers = [];
var map, center, marker, isFirst = true, info, geocoder, listener, markersArray = [];

/*初始化加载和判断*/
function init(options) {
	if(options === null){
		alert('数据不能为空');
		return false;
	}
	if(options.lat !='' && options.lng !=''
			&&options.corporation_address_components != null 
			&&options.corporation_address_components.city == '温州市' 
			&& typeof(options.corporation_address_components.street) !='undefined' 
			&& options.corporation_address_components.street!=''){
			var center = new qq.maps.LatLng(options.lat, options.lng);
			boot(center,options);
			isFirst = false;
	}else{
		alert('定位数据不准确,请重新定位');
		var center = new qq.maps.LatLng(window.latitude, window.longitude);
		boot(center,options);
		
		//huoqu 
//		getLocationByAddress(options.residence);
	}

}
/*根据地址文字搜索定位*/
function getLocationByAddress(address){
		geocoder = new qq.maps.Geocoder({
				complete:function(results){
					console.log(results);
					var center = new qq.maps.LatLng(results.lat, results.lng);
					boot(center,options);
				},
				error:function(err,msg){
						alert('搜索定位失败,请手动定位或更改关键字');
					isFirst = false;
				}
			});
		geocoder.getLocation(address);
	
}
/*根据经纬度搜索定位*/
function boot(center,options){
	 map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 12
	});
	//创建标记
	marker = new qq.maps.Marker({
		position: center,
		map: map
	});
	markersArray.push(marker);//存储标记
	//添加到提示窗
	info = new qq.maps.InfoWindow({
		map: map
	});
	geocoder = new qq.maps.Geocoder({
		complete: function (result) {
			//地图图标移动操作
			map.setCenter(result.detail.location);
			deleteOverlays();//清除之前的标记
			marker = new qq.maps.Marker({//添加新的标记
				map: map,
				position: result.detail.location
			});
			markersArray.push(marker);//存储标记
			//设置定位信息为定位后数据
				var address = '';
				var parts = ['country','province','city','district','town','street','streetNumber'];
				for(var part_index in parts){
					 if(typeof(result.detail.addressComponents[parts[part_index]]) !='undefined'){
						address+=result.detail.addressComponents[parts[part_index]];
					 }
				}
				options.corporation_address = address;//变更后使用解析的地址
				$("#lat").val(result.detail.location.lat);
				$("#lng").val(result.detail.location.lng);
				options.lat = result.detail.location.lat;
				options.lng = result.detail.location.lng;
				options.addressComponents = result.detail.addressComponents;
				$('#corporation_address').val(options.corporation_address);
				$('#corporation_address_components').val(JSON.stringify(options.addressComponents));
			/*提示框内容设定*/
			options.loading = false;
			info.open();
			var corporation_address = options.corporation_address;
			corporation_address = corporation_address.replace(/中国/, "");
			corporation_address = corporation_address.replace(/浙江省/, "");
			corporation_address = corporation_address.replace(/温州市/, "");
			info.setContent('<div style="width:280px;height:100px;">' + corporation_address + '</div>');
			info.setPosition(result.detail.location);
			qq.maps.event.addListener(marker, 'click', function () {
				info.open();
				var corporation_address = options.corporation_address;
				corporation_address.replace(/中国/, "");
				corporation_address.replace(/浙江省/, "");
				corporation_address.replace(/温州市/, "");
				info.setContent('<div style="width:280px;height:100px;">' + corporation_address + '</div>');
				info.setPosition(result.detail.location);
			});
		},error:function(err,msg){
					alert('搜索定位失败,请手动定位或更改关键字');
				}
	});
	/*默认触发第一次定位*/
	options.loading = true;
	geocoder.getAddress(center);
	/*绑定触发的各种操作*/
	$('#searchAddress').unbind('click').bind('click',function(){
		var addresskey = $("#addresskey").val();
		if(addresskey == ''){
			alert('请输入准确地址');
			return false;
		}
		var selecta =  addresskey.replace(/中国/, "");
		var selectb = selecta.replace(/浙江省/, "");
		var selectc = selectb.replace(/温州市/, "");
		console.log('中国浙江省温州市'+selectc);
		var searchcontent = '中国浙江省温州市'+selectc
	    //通过getLocation();方法获取位置信息值
	    geocoder.getLocation(searchcontent);
	})
	//图标点击后触发定位
	qq.maps.event.addListener(marker, 'click', function (event) {
		geocoder.getAddress(center);
	});
	//地图点击后定位新地址
	listener = qq.maps.event.addListener(map, 'click', function (event) {
		var lat = event.latLng.getLat();
		var lng = event.latLng.getLng();
		var latLng = new qq.maps.LatLng(lat, lng);
		options.loading = true;
		geocoder.getAddress(latLng);
	});
	/*绑定搜索框事件*/
	$(options.searchElem).bind('keypress', function (event) {
		if (event.keyCode == "13")
		{
			var searchkey = $(options.searchElem).val();
		}
	});
	/*通用的方法*/
	/*添加标记*/
	function addMarker(location) {
		marker = new qq.maps.Marker({
			position: location,
			map: map
		});
		markersArray.push(marker);
	}
	/*清除覆盖层*/
	function clearOverlays() {
		if (markersArray) {
			for (i in markersArray) {
				markersArray[i].setMap(null);
			}
		}
	}
	/*显示覆盖层*/
	function showOverlays() {
		if (markersArray) {
			for (i in markersArray) {
				markersArray[i].setMap(map);
			}
		}
	}
	/*删除覆盖物*/
	function deleteOverlays() {
		if (markersArray) {
			for (i in markersArray) {
				markersArray[i].setMap(null);
			}
			markersArray.length = 0;
		}
	}
}

