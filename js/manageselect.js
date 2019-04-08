$(document).ready(function (){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
//	    var jlist = JSON.parse(self.receive_admin_group);
	    console.log(JSON.stringify(self.receive_admin_group));
	    var receive_admin_group = self.receive_admin_group;
	    getoriginlist(receive_admin_group);
	})
	
	
	
//	config();
//	getoriginlist();
	
	function getoriginlist(obj){
		var limitobj = obj;
//		if(){}
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Admin/allData';
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken
			},
			type: 'post',
			dataType: 'json',
			crossDomain: true,
			cache: true,
			beforeSend: function(xhr) { //beforeSend定义全局变量
				xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
			},
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == 1000){
					var info = res.data;
					mui.toast(res.message);
					for(var n in info){
						info[n].checked= false;
					}
					for(var n in info){
						for(var m in limitobj){
							if(info[n].id == limitobj[m].id){
								info[n].checked= true;
							}
						}
						
					}
					console.log(JSON.stringify(info));
					//在关闭窗口代码上加入延迟
					 //调用模板引擎
				   	var originlistTemplateScript = $("#originlist-template").html();
					var originlistTemplate = Handlebars.compile(originlistTemplateScript);
					var contentlist = res.data;
					var originlistHtml = originlistTemplate(contentlist);
					$("#managelist").html(originlistHtml);
					
					var count = list.querySelectorAll('input[type="checkbox"]:checked').length;
					console.log(count);
					var value = count ? "完成(" + count + ")" : "完成";
					done.innerHTML = value;
					if (count) {
						if (done.classList.contains("mui-disabled")) {
							done.classList.remove("mui-disabled");
						}
					} else {
						if (!done.classList.contains("mui-disabled")) {
							done.classList.add("mui-disabled");
						}
					}
				}else{
					$("#my-mask").hide();
					mui.alert(res.message);
					return false;
				}
			},
			error:function(res){
				alert('请求失败');
				prompt("打印錯誤res",JSON.stringify(res));
				console.log(JSON.stringify(res));
				console.log('请求失败');
				$("#my-mask").hide();
				console.log('1211112');
			}
		})
	}
})
