//document.write("<script language=javascript src='jquery-1.11.0.min.js'></script>");
//document.write("<script language=javascript src='mui.min.js'></script>");
document.addEventListener('plusready', function() {
	$(function() {
		mui.ready(function() {
			$('.btn-submit').click(function() { //登录
				var TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
				window.name = $('#mobile').val();
				var pwd = $('#password').val();
				if(name == '' || $.trim(name).length <= 0) {
					mui.alert("请输入手机号");
				} else if($('#password').val() == '' || $.trim($('#password').val()).length <= 0) {
					mui.alert("请输入密码");
				} else {
					var url = 'http://lanxiuying.imwork.net:41330/Api_apps/signIn';
					$.ajax({
						url: url,
						data: {
							mobile: name,
							password: pwd,
							userType: "user",
							clientId: "sadaoikkjlsaflkhl",
							clientType: "android"
						},
						type: 'post',
						dataType: 'json',
						crossDomain: true,
						cache: true,
						beforeSend: function(xhr) { //beforeSend定义全局变量
							xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
						},
						success: function(xmlDoc, textStatus, xhr, data) {
							if(xhr.readyState == 4) {
								if(xhr.status == 200) {
									window.str = xhr.responseText; //获取返回值
									window.t = str.split(/[:,]/);
									window.s = str.split(/[""]/);
									window.s[11];
									if(t[1] == 1000) { //查询返回0表示已注册
										//										alert(JSON.stringify(data));
										//										alert("成功")
										$.ajax({ //accessToken验证
											type: "post",
											url: "http://lanxiuying.imwork.net:41330/index.php/Api_apps/testAccessToken",
											async: true,
											data: {
												mobile: name,
												userType: "user",
												clientType: "android",
												clientId: "sadaoikkjlsaflkhl",
												accessToken: s[11]
											},
											success: function(data) {
												//												alert("成功");
											},
											error: function(data) {
												alert(JSON.stringify(data));
											}
										});
										window.location.href = "Shoplist.html";
										$.ajax({
											type: "post",
											url: "http://lanxiuying.imwork.net:41330/index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByShopId",
											async: false,
											data: {
												shopId: "1",
												mobile: name,
												userType: "user",
												clientType: "android",
												clientId: "sadaoikkjlsaflkhl",
												accessToken: s[11]
											},
											success: function(ds) {
												window.jsonObj = eval('(' + ds + ')');
												mui.alert(jsonObj.data.id);
												mui.alert(jsonObj.data.shop_logo_thumb);
												mui.alert(jsonObj.data.corporation_name);
												var zzzz = jsonObj.data.id;
												mui.alert(zzzz);
											},
											error: function(data) {

											}
										});
										//										var lat = 27.903418;
										//										var lng = 120.853729;
										//										$.ajax({
										//											type: "post",
										//											url: "http://lanxiuying.imwork.net:41330/index.php/Api/Apps/Jingkaiqu/Map/surroundingShops",
										//											async: false,
										//											data: {
										//												lat: lat,
										//												lng: lng,
										//												mobile: name,
										//												userType: "user",
										//												clientType: "android",
										//												clientId: "sadaoikkjlsaflkhl",
										//												accessToken: s[11]
										//											},
										//											success: function(ds) {
										//												//												mui.alert(ds);
										//												var jsonObj = eval('(' + ds + ')'); //将ds转换为json格式并赋值给jsonObj
										//												for(var i = 0; i < jsonObj.length; i++) {
										//													mui.alert(jsonObj.data[i].id); //获取jsonObj对象中的data数组获取id的值													
										//												}
										//												var htm = "";
										//												htm += "<div style='background:red;'>";
										//												htm += jsonObj.data[0].id;
										//												htm += "</div>";
										//												$('#iddd').find('div').append(htm);
										//											},
										//											error: function(data) {
										//												alert(JSON.stringify(data));
										//												alert("失败");
										//											}
										//										});
									} else if(t[1] == 1001) {
										mui.alert(s[5]);
										//运行正确的代码
										return;
									} else if(t[1] == 1002) {
										mui.alert(s[5]);
										return;
										//运行正确的代码
									} else if(t[1] == 1003) {
										mui.alert(s[5]);
										return;
										//运行正确的代码
									} else if(t[1] == 1006) {
										mui.alert(s[5]);
										return;
									} else {
										mui.alert(s[5]);
										return;
									}
								}
							}
						},
						error: function(data) {
							mui.alert("异常");
						}
					});
				}
			})
			$('#user').addClass('btn-active');
			$('.btn-slect').click(function() {
				$(this).addClass('btn-active').parent().siblings().children('button').removeClass('btn-active');
			})
		})
	})
});