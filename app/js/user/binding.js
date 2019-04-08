$(function(){
	$('html').on('click','.item-style',function(){
		var currentobj = $('.item-style');
		for(var n = 0;n<currentobj.length;n++){
			currentobj.eq(n).removeClass('item-active');
		}
		$(this).addClass('item-active');
		var type = $(this).attr('data-type');
		$('.usertype').val(type);
		
	})
	
	$('html').on('click','.tobinding',function(){
		var account = $('.account').val();
		var usertype =$('.usertype').val();
		var url = 'http://192.168.0.79/index.php/api_resource/bindinguser';
		
		
		var openid = localStorage.getItem('openid');
		var loginway = localStorage.getItem('loginway');
		
		$.ajax({
			url: url,
			data: {
				mobile:account,
				openid:openid,
				clientType:clientType,
				loginway:loginway,
				userType:usertype,
				clientId:clientId
			},
			type: 'post',
			dataType: 'json',
			async: true,
			beforeSend: function(xhr) { //beforeSend定义全局变量
				xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
			},
			success: function(res) {
				if(res.code && res.code == '1000'){
					mui.toast(res.message);
					var mobile = res.data.mobile;
					var id = res.data.id;
					var usertype = res.data.usertype;
					localStorage.setItem("userType",usertype);
					if(usertype == 'user'){
						localStorage.setItem("mobile",mobile);
						localStorage.setItem("accessToken",openid);
						localStorage.setItem('userid',id);
						localStorage.setItem('userarea_id',area_id);
					}
					if(usertype == 'shop'){
						localStorage.setItem("shopmobile",mobile);
						localStorage.setItem("shopaccessToken",openid);
						localStorage.setItem("shopid",id);
						localStorage.setItem('shoparea_id',area_id);
					}
					if(usertype == 'admin'){
						var area_id = res.data.role.area_id;
						localStorage.setItem("adminmobile",mobile);
						localStorage.setItem("adminaccessToken",openid);
						localStorage.setItem('adminid',id);
						localStorage.setItem('adminarea_id',area_id);
					}
//						开始登录
					setTimeout(function() {
						var skipurl = '../frame/tab-webview-main.html';
//							usertype
//							个人页面
						location.href=skipurl;
					}, 500);
				}else{
					mui.toast(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	})
	
	
})
