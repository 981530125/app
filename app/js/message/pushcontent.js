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
	var rootpower = [{
			obj:'.editbtn',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Notify/editNotifyData'
		},{
			obj:'.sendbtn',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Notify/editNotifyData'
		},{
			obj:'#add-message',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Notify/getNotifyDetailByNotifyId'
		},{
			obj:'#add-message',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Notify/getNotifyDetailByNotifyId'
		}];
	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	location.reload();
	  }
	});
	
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var notice_id = self.notice_id;
	    window.notifyid = self.notice_id;
	    if(userType == 'admin'){
			var admininfo = JSON.parse(localStorage.getItem("admininfo"));
		}
		if(userType == 'shop'){
			var admininfo = JSON.parse(localStorage.getItem("shopinfo"));
		}
		if(userType == 'user'){
			var admininfo = JSON.parse(localStorage.getItem("userinfo"));
		}
//	    var admininfo = JSON.parse(localStorage.getItem("admininfo"));
	    window.currentname = admininfo.user_info.name;
	    getmessagecontent(notice_id);
	    console.log(JSON.stringify(notice_id));
	});
	
	    //	获取信息详情
	function getmessagecontent(id){

		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Notify/getNotifyDetailByNotifyId'; //获取信息详情
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				notifyId:id,
				loginway:loginway
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
					if(res.data){
						// 抓取模板数据
						res.data.id = id;
						res.data.rooturl = rooturl;
						res.data.types = userType;
						res.data.currentname = window.currentname;
						var messagecontent = res.data;
						window.infodetail = res.data;
						var contenttpl = $("#content-template").html();
						// 编译模板
						var rcontenttp = Handlebars.compile(contenttpl);
						var data = messagecontent;
						// 把数据传送到模板
						var noticeCompiledHtml = rcontenttp(data);
					    $('#messagecontent').html(noticeCompiledHtml);
						console.log(JSON.stringify(res.data));
						var info = res.data
						
						if(messagecontent.status == 1){
							$(".dealsubmit").hide();
							$(".delivesubmit").hide();
						}else{
							$(".dealsubmit").show();
							$(".delivesubmit").show();
						}
						console.log(JSON.stringify(res));
						return info;
					}else{
						mui.alert(res.message);
                        console.log(JSON.stringify(res));
					}
					mui.toast(res.message);
				}else{
					// 更新到模板
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
						// 更新到模板
					}
					console.log(JSON.stringify(res));
					mui.alert(res.message);
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
	
//	点击跳转到编辑
	$('html').on('click','.editbtn',function(){
		$('.titlestype').removeAttr('disabled');
		$('.titlestype').css('border','1px solid #2d78f4');
		$('.contenttype').removeAttr('disabled');
		$('.contenttype').css('border','1px solid #2d78f4');
		$(this).hide();
		$('.sendbtn').show();
	})
	
	$('html').on('click','.sendbtn',function(){
		
		var title = $(".title").val();
		var content = $(".contenttype").val();
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Notify/editNotifyData'; //编辑推送
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				notify_id:window.notifyid,
				title:title,
				content:content,
				received_admin_id:'',
				received_user_id:'',
				received_shop_id:'',
				loginway:loginway
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
						// 抓取模板数据
					setTimeout(function() {
						mui.back(); 
						var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						return true;
					}, 500);
					mui.toast(res.message);
				}else{
					mui.toast(res.message);
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	})
	
	
	//点击图片下载
	downloadimg = function (url){
 		console.log(url);
 		var currentPreviewSrc = url;
		var btnArray = ['取消', '保存'];
		mui.confirm('是否保存图片？', '保存图片到相册', btnArray, function(e) {
	        if (e.index == 1) {
	        	 plus.gallery.save(currentPreviewSrc, function() {
		                mui.toast('保存成功');
		          	}, function() {
		                mui.toast('保存失败，请重试！');
		         });
	        } else {
	        	console.log('取消');
	        }
        })
	}
	
	//获取组织对象
	function getnamelist(){
		var namelistarr = [];
		var  maxroot = [];
		var alllevel = [];
		var sumarr = [];
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Admin/getAdminTree';
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
				if(res.code && res.code == 1000){
					var namelistarr = res.data;
					var namelistarr = JSON.stringify(namelistarr);
					localStorage.setItem('namelistarr',namelistarr);
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
	//判断获取组织对象
	var namelistarr = localStorage.getItem('namelistarr');
	if(!namelistarr){
		getnamelist();
	}
	
	
	
	
//	点击处置
	$("html").on('click','.dealsubmit',function(){
		var answer = $('#answer').serializeObject();
		console.log(JSON.stringify(answer));
		console.log('1212');
		var status = 1;
		var title = '';
		var content = answer.dealcontent;
		var root_message_id = answer.id;
		var file_id_list = '';
		submitdeal(title,content,'',root_message_id,status,file_id_list);
	})
	
	//	点击转发
	$("html").on('click','.delivesubmit',function(){
		var answer = $('#answer').serializeObject();
		console.log(JSON.stringify(answer));
		console.log('1212');
		var title = answer.title;
		var content = answer.dealcontent;
		var root_message_id = answer.id;
		var file_id_list = '';
		
		var tourl = 'namelist.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	answer:answer,
		    	namelistarr:namelistarr,
		    	relay:'1'
//		      自定义扩展参数，可以用来处理页面间传值
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100 //		      页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	})
	
//	点击回复
	$('html').on('click','.replysubmit',function(){
		var answer = $('#answer').serializeObject();
		console.log(JSON.stringify(answer));
		console.log('1212');
		var status = 1;
		var title = '';
		var content = answer.dealcontent;
		var root_message_id = answer.id;
		var file_id_list = '';
		submitdeal(title,content,'',root_message_id,'','');
	})
	
	
//	点击返回
	$('html').on('click','.returnsubmit',function(){
		mui.back();
		var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
		 
		mui.fire(list, 'refresh',{
			reload:'true'
		});  //返回true,继续页面关闭逻辑
		return true;
	})
	
	
	
	function submitdeal(title,content,received_admin_id,root_message_id,status,file_id_list){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Message/editMessage'; //获取信息详情
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
				status:status,
				file_id_list:file_id_list,
				loginway:loginway
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
					var messagecontent = res.data;
						console.log(JSON.stringify(messagecontent));
						mui.alert(res.message);
						mui.back();
						var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
						 
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						return true;
						mui.toast(res.message);
				}else{
					console.log(JSON.stringify(res));
					mui.alert(res.message);
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
	
})
