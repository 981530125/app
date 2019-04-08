$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    console.log(JSON.stringify(self.sendinfo));
	    var sendinfo = self.sendinfo;
	    
	    var namelistarr = JSON.parse(self.namelistarr);
	    console.log(self.namelistarr);
	    
	    var relay = self.relay;
	    console.log(relay);
	    var answer = self.answer;
	    console.log(JSON.stringify(answer));
	    
	    
	    // //调用模板引擎
	   	var namelistTemplateScript = $("#jlist-template").html();
		var namelistTemplate = Handlebars.compile(namelistTemplateScript);
		var context = namelistarr;
		var namelistHtml = namelistTemplate(context);
		$("#list").html(namelistHtml);
		
		if(relay == '1'){
	    	$('.submit-btn').hide();
	    	$('.relay-btn').show();
	    }else{
	    	$('.submit-btn').show();
	    	$('.relay-btn').hide();
	    }
		
		mui('html').on('tap', '.select-finish', function() {
			console.log($('.mtree-open').length);
			for(var n = 0; n < $('.mtree-open').length; n++) {
				var level = $('.mtree-open').eq(n).children('a').attr('data-level');
				if(level == '1') {
					console.log('一级：' + $('.mtree-open').eq(n).children('a').attr('data-info'));
				}
				if(level == '2') {
					console.log('二级：' + $('.mtree-open').eq(n).children('a').attr('data-info'));
				}
				if(level == '3') {
					console.log('三级：' + $('.mtree-open').eq(n).children('a').attr('data-info'));
				}
			}
			console.log('当前1：' + $(".mtree-active").children('a').attr('data-info'));
			console.log('当前：' + $(".mtree-active").children('a').attr('data-level'));

			
            console.log('1212');
            var cityName = $(".areacontent").html();
            var id = $("#areaid").val();
            //获取父页面A.html
            var main = plus.webview.currentWebview().opener();
            //自定义事件,事件名为changeCity
            mui.fire(main,'changeCity',{cityName:cityName,areaid:id});
            //关闭子页面
            mui.back();
      	})
		//创建主题提交
		$('html').on('click','.submit-btn',function(){
			var received_admin_id =$('#areaid').val();
			console.log(JSON.stringify(sendinfo));
			console.log(typeof sendinfo.imgid);
			var imgarr = sendinfo.imgid;
			var imgstring = '';
			if(typeof imgarr == 'object'){
				imgstring = imgarr.join(',');
			}else{
				imgstring = imgarr;
			}
			sendinfo.imgstring = imgstring;
			console.log(received_admin_id);
			console.log(JSON.stringify(sendinfo));
			
			var title = sendinfo.title;
			var content = sendinfo.content;
			var received_admin_id = received_admin_id;
			var root_message_id = '';
			var status = 0;
			var file_id_list = imgstring;
			
			newpostmessage(title,content,received_admin_id,root_message_id,status,file_id_list);
		})
		
		//转发主题提交
		
		$('html').on('click','.relay-btn',function(){
			console.log(JSON.stringify(answer));
			
			var title = '';
			var content = answer.dealcontent;
			var received_admin_id =$('#areaid').val();
			var root_message_id = answer.id;
			var status = 0;
			var file_id_list = '';
			
			postmessage(title,content,received_admin_id,root_message_id,status,file_id_list);
		})
		
		
//		创建主题
		
		function newpostmessage(title,content,received_admin_id,root_message_id,status,file_id_list){
			
			console.log(received_admin_id);
			
			if(root_message_id){
				var root_message_id = root_message_id;
			}else{
				var root_message_id = '';
			}
			var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Message/insertMessageData'; //创建通知消息
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					title:title,
					content:content,
					received_admin_id:received_admin_id,
					root_message_id:root_message_id,
					status:0,
					file_id_list:file_id_list
				},
				type: 'post',
				dataType: 'json',
				crossDomain: true,
				cache: true,
				beforeSend: function(xhr) { //beforeSend定义全局变量
					xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
				},
				success: function(res) {
					if(res.code && res.code == 1000){
						var prev = plus.webview.currentWebview().opener();
						mui.toast(res.message);
						setTimeout(function(){
							mui.back();
							mui.fire(prev, 'refresh',{
								reload:'true'
							});  //返回true,继续页面关闭逻辑
							return true;
						}, 500);
						
						
//						var prev = plus.webview.currentWebview().opener();
//						mui.back();
//						mui.fire(prev, 'refresh',{
//							reload:'true'
//						});  //返回true,继续页面关闭逻辑
//						return true;
//						mui.toast(res.message);
					}else{
						mui.toast(res.message);
						console.log(res.messgae);
					}
				},
				error: function(res){
					console.log(JSON.stringify(res));
					console.log(res.message);
					console.log(res.data);
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			})
		}
		
		//转交主题
		
		function postmessage(title,content,received_admin_id,root_message_id,status,file_id_list){
			
			console.log(received_admin_id);
			
			if(root_message_id){
				var root_message_id = root_message_id;
			}else{
				var root_message_id = '';
			}
			var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Message/editMessage'; //获取信息列表
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					title:title,
					content:content,
					received_admin_id:received_admin_id,
					root_message_id:root_message_id,
					status:0,
					file_id_list:file_id_list
				},
				type: 'post',
				dataType: 'json',
				crossDomain: true,
				cache: true,
				beforeSend: function(xhr) { //beforeSend定义全局变量
					xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
				},
				success: function(res) {
					if(res.code && res.code == 1000){
						var prev = plus.webview.currentWebview().opener();
						mui.toast(res.message);
						setTimeout(function(){
							mui.back();
							mui.fire(prev, 'refresh',{
								reload:'true'
							});  //返回true,继续页面关闭逻辑
							return true;
						}, 500);
						
						
//						var prev = plus.webview.currentWebview().opener();
//						mui.back();
//						mui.fire(prev, 'refresh',{
//							reload:'true'
//						});  //返回true,继续页面关闭逻辑
//						return true;
//						mui.toast(res.message);
					}else{
						mui.toast(res.message);
						console.log(res.messgae);
					}
				},
				error: function(res){
					console.log(JSON.stringify(res));
					console.log(res.message);
					console.log(res.data);
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			})
		}
		
		
	});
	
	
});