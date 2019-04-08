//var rooturl = 'http://lanxiuying.imwork.net:41330/';
var rooturl = 'http://192.168.0.79/';
//var rooturl = 'https://food.mcnvp.com/';
//var rooturl = 'http://jk.cnvp.com/';

var clientType = 'android';
var clientId = localStorage.getItem("uuid");

//个人
var userid = localStorage.getItem("userid");
var userarea_id = localStorage.getItem('userarea_id');
var accessToken = localStorage.getItem("accessToken");
var mobile = localStorage.getItem("mobile");

//商家

var shoparea_id = localStorage.getItem('shoparea_id');
var shopid = localStorage.getItem("shopid");
var shopmobile = localStorage.getItem("shopmobile");
var shopaccessToken = localStorage.getItem("shopaccessToken");

//管理
var adminarea_id = localStorage.getItem('adminarea_id');
var adminid = localStorage.getItem("adminid");
var adminmobile = localStorage.getItem("adminmobile");
var adminaccessToken = localStorage.getItem("adminaccessToken");


var userType = localStorage.getItem("userType");
var msgType = 'message';


var mylatitude = localStorage.getItem('mylatitude');
var mylongitude = localStorage.getItem('mylongitude');


var loginway = localStorage.getItem('loginway');
var openid = localStorage.getItem('openid');
if(loginway){
	var loginway = loginway;
}else{
	var loginway = 'other';
}


//获取跳转参数
//	mui.plusReady(function(){    
////	    获取设备uuid和imei   
//	    var deviceModel = plus.device.model;
//	    console.log("aaaa="+plus.device.uuid);
//	    console.log("BBBB="+plus.device.imei);
//
//	});


//账号切换
if(userType == 'user'){
	alluserid = userid;
	accessToken = accessToken;
	mobile = mobile;
	area_id = userarea_id;
}
if(userType == 'shop'){
	alluserid = shopid;
	accessToken = shopaccessToken;
	mobile = shopmobile;
	area_id = shoparea_id;
}
if(userType == 'admin'){
	alluserid = adminid;
	accessToken = adminaccessToken;
	mobile = adminmobile;
	area_id = adminarea_id;
}

function config(){
	//个人
	var userid = localStorage.getItem("userid");
	var userarea_id = localStorage.getItem('userarea_id');
	var accessToken = localStorage.getItem("accessToken");
	var mobile = localStorage.getItem("mobile");
	
	//商家
	
	var shoparea_id = localStorage.getItem('shoparea_id');
	var shopid = localStorage.getItem("shopid");
	var shopmobile = localStorage.getItem("shopmobile");
	var shopaccessToken = localStorage.getItem("shopaccessToken");
	
	//管理
	var adminarea_id = localStorage.getItem('adminarea_id');
	var adminid = localStorage.getItem("adminid");
	var adminmobile = localStorage.getItem("adminmobile");
	var adminaccessToken = localStorage.getItem("adminaccessToken");
	
	
	var userType = localStorage.getItem("userType");
	var msgType = 'message';
	
	
	var mylatitude = localStorage.getItem('mylatitude');
	var mylongitude = localStorage.getItem('mylongitude');
	
	//账号切换
	if(userType == 'user'){
		alluserid = userid;
		accessToken = accessToken;
		mobile = mobile;
		area_id = userarea_id;
	}
	if(userType == 'shop'){
		alluserid = shopid;
		accessToken = shopaccessToken;
		mobile = shopmobile;
		area_id = shoparea_id;
	}
	if(userType == 'admin'){
		alluserid = adminid;
		accessToken = adminaccessToken;
		mobile = adminmobile;
		area_id = adminarea_id;
	}
}


coordinate();
//定位
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
		localStorage.setItem('mylatitude',latitude);
		localStorage.setItem('mylongitude',longitude);
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
//绑定推送cid
function sendnotifycid(tokens,notifyCid,clientType){
	var url = rooturl+'index.php/Api_apps/resetNotifyCid';
	$.ajax({
		type: "post",
		url: url,
		async: true,
		data: {
			tokens:tokens,
			notifyCid:notifyCid,
			clientType:clientType
		},
		dataType: 'json',
		success: function(res) {
			if(res.code && res.code == '1000') {
				var datainfo = res.data;
				console.log(JSON.stringify(res));
			} else {
				console.log(res.message);
			}
		},
		error: function(res) {
			console.log(JSON.stringify(res));
		}
	});
}
//左滑删除
function leftslide(obj){
	$('html').on("swipeleft",obj,function(){
		var alength = $(this).find('.mui-slider-right a').length;
		console.log(alength);
		var num = -88*alength;
	    $(this).addClass('mui-transitioning');
	    $(this).addClass('mui-selected');
	    $(this).find('.mui-slider-right').addClass('mui-selected');
	    $(this).find('.mui-slider-right a').css("transform","translateX("+num+"px)");
	    $(this).find('.mui-slider-handle').css("transform","translateX("+num+"px)");
	})
}
//右滑隐藏
function rightslide(obj){
	$('html').on("swiperight",obj,function(){
		$(this).removeClass('mui-transitioning');
	    $(this).removeClass('mui-selected');
	    $(this).find('.mui-slider-right').removeClass('mui-selected');
	    $(this).find('.mui-slider-right a').css("transform","translateX(0px)");
	    $(this).find('.mui-slider-handle').css("transform","translateX(0px)");
	})
}


//获取管理员权限
function getbadpower(mobile,userType,clientType,clientId,accessToken){

	var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Admin/getPrivilegeList';
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
			loginway:loginway
		},
		dataType: 'json',
		success: function(res) {
			if(res.code && res.code == '1000') {
				var power = JSON.stringify(res.data);
				localStorage.setItem('adminpower',power);
			} else {
				console.log(res.message);
			}
		},
		error: function(res) {
			console.log(JSON.stringify(res));
		}
	});
}

function ispower(obj,apiurl){
	if(localStorage.getItem("userType") == 'admin'){
		var url = apiurl;
		var obj = $(obj);
		var urlarr = [];
		var power =JSON.parse(localStorage.getItem('adminpower'));
		if(power){
			for(var item in power){
				var strurl = power[item].url;
				strurl ='/index.php'+strurl.replace(/\\/g, "\/");
				urlarr.push(strurl);
			}
//			console.log(JSON.stringify(urlarr));
			
			if(urlarr.indexOf(apiurl) == '-1'){
				console.log('不存在'+apiurl);
			}else{
				for(var item in power){
					var strurl = power[item].url;
					strurl ='/index.php'+strurl.replace(/\\/g, "\/");
					if(strurl == url){
						if(power[item].have_auth){
//							console.log(obj);
							console.log('显示');
						}else{
							obj.hide();
							console.log('隐藏');
						}
					}
				}
			}
		}	
	}else{
		return;
	}
	
}

$(function(){
//	Handlebars 是否相等
	Handlebars.registerHelper('if_eq', function(v1, v2, opts) {
	    if(v1 == v2)
	        return opts.fn(this);
	    else
	        return opts.inverse(this);
	});
	Handlebars.registerHelper({	
		'prettifyDate' : function(timestamp,num) {
			//格式化时间
			if(timestamp || timestamp != null || timestamp != undefined){
				var newtime = timestamp.slice(0,num);
				return newtime;
			}else{
				return '';
			}
		},
		'decimal' : function(num,holdnum) {
			//取几位小数	
			var allnum = parseFloat(num).toFixed(holdnum);
			if(allnum){
				return allnum;
			}else{
				return '';
			}
		},
		'isnull' : function(obj) {
			//判断是否为空
			if(obj){
				return obj;
			}else{
				return '0';
			}
		},
		'recordname' : function(obj) {
			//判断是否为空
			var now = new Date();
			var time = now.getFullYear() + "-" +((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
			var formname = time+'检查表'
			if(obj){
				return obj;
			}else{
				return formname;
			}
		},
		'isnone' : function(obja,objb) {
			//判断是否为空
			if(obja){
				return obja;
			}else{
				if(objb){
					return objb;
				}else{
					return '无';
				}
			}
		},
		'ifnull' : function(obja,objb, rooturl) {
			//判断是否为空
			if(typeof obja == "undefined" || obja == null || obja == ""){
				return objb;
			}else{
				return rooturl+obja;
				
			}
		},
		'isodd' : function(obja,objb,opts) {
			//判断是否为奇数
			if(obja%2 == objb){
				return opts.fn(this);
			}else{
				return opts.inverse(this);
			}
		},
		'ifarrnull' : function(obj,opts) {
			//判断是否为空
			if(obj.length >0)
			    return opts.fn(this);
		    else
		        return opts.inverse(this);
		},
		'changesecond' : function(obj) {
			//秒转化天
			if(obj == 0){
				return '0天';
			}else{
				var second = parseInt(obj);
				var data = second/(60*60*24);
				return data.toFixed(2)+'天';
			}
		},
		'reduce' : function(obja,objb) {
			//秒转化天
			var num = parseInt(obja) - parseInt(objb);
			return '还剩'+num+'次';
		},
		'judgenum' : function(v1, operator, v2, options) {
			//判断大小
			switch (operator) {
		        case '==':
		            return (v1 == v2) ? options.fn(this) : options.inverse(this);
		        case '===':
		            return (v1 === v2) ? options.fn(this) : options.inverse(this);
		        case '!=':
		            return (v1 != v2) ? options.fn(this) : options.inverse(this);
		        case '!==':
		            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
		        case '<':
		            return (v1 < v2) ? options.fn(this) : options.inverse(this);
		        case '<=':
		            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		        case '>':
		            return (v1 > v2) ? options.fn(this) : options.inverse(this);
		        case '>=':
		            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		        case '&&':
		            return (v1 && v2) ? options.fn(this) : options.inverse(this);
		        case '||':
		            return (v1 || v2) ? options.fn(this) : options.inverse(this);
		        default:
		            return options.inverse(this);
		    }
		},
		'arithmetic' : function(v1, operator, v2) {
			
			if(parseInt(v1) == ''|| parseInt(v1) == 'NaN'){
				v1 = 0;
			}
			if(parseInt(v2) == ''|| parseInt(v2) == 'NaN'){
				v1 = 0;
			}
			if(JSON.stringify(v2) == 'null'||JSON.stringify(v2) == ''){
				v2 = 0;
			}
			//判断大小
			switch (operator) {
		        case '+':
		            return (parseInt(v1)+parseInt(v2));
		        case '-':
		            return (parseInt(v1)-parseInt(v2));
		        case '*':
		            return (v1*v2);
		        default:
		            return parseInt(v1)/parseInt(v2);
		    }
		},
		'addOne':function(page,index) {
			return page * 10 - (9 - index);
		}
	});
})
$.fn.serializeJson=function(){ 
        var serializeObj={};
        var array=this.serializeArray();
        // var str=this.serialize(); 
        $(array).each(function(){ // 遍历数组的每个元素 
                if(serializeObj[this.name]){ // 判断对象中是否已经存在 name，如果存在name 
                      if($.isArray(serializeObj[this.name])){ 
                             serializeObj[this.name].push(this.value); // 追加一个值 hobby : ['音乐','体育'] 
                      }else{ 
                              // 将元素变为 数组 ，hobby : ['音乐','体育'] 
                              serializeObj[this.name]=[serializeObj[this.name],this.value]; 
                      } 
                }else{ 
                        serializeObj[this.name]=this.value; // 如果元素name不存在，添加一个属性 name:value 
                } 
        }); 
        return serializeObj; 
};