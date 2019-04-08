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
(function($, doc) {
	$.init();
})(mui, document);
$(function(){
	window.allshoplist = [];
	//	返回刷新
	window.addEventListener('refresh', function(e){//执行刷新 
		if(e.detail.reload == 'true'){
			var prev = plus.webview.currentWebview().opener();
			mui.back();
			mui.fire(prev, 'refresh',{
				reload:'true'
			});  //返回true,继续页面关闭逻辑
			return true;
		}
	});
	
	//	添加
	window.addEventListener("selectman", function(e) {
		//选择辖区后返回获取辖区id，筛选
		//调用模板引擎
		window.namelist = e.detail.cityName;
		var type = e.detail.type;
		if(type == 'user'){
			var managenamelistTemplateScript = $("#usernamelist-template").html();
		}
		if(type == 'shop'){
			if(e.detail.allshoplist){
				window.allshoplist = e.detail.allshoplist;
			}
			if(window.allshoplist.length>0){
				var managenamelistTemplateScript = $("#shoplist").html();
			}else{
				var managenamelistTemplateScript = $("#allshoplist").html();
			}
		}
		if(type == 'admin'){
			var managenamelistTemplateScript = $("#namelist").html();
		}
		
		var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
		if(e.detail.type == 'user'){
			var context = window.namelist;
			console.log(JSON.stringify(context));
			var managenamelistHtml = managenamelistTemplate(context);
			$("#usernamelist").html(managenamelistHtml);
		}
		if(e.detail.type == 'admin'){
			var context = window.namelist;
			var managenamelistHtml = managenamelistTemplate(context);
			$("#managenamelist").html(managenamelistHtml);
		}
		if(e.detail.type == 'shop'){
			if(window.allshoplist.length>0){
				var context = window.allshoplist;
			}else{
				var context = window.namelist;
				console.log(JSON.stringify(context));
			}
			var managenamelistHtml = managenamelistTemplate(context);
			$("#shopnamelist").html(managenamelistHtml);
		}
	})
	
	//	删除检查人员
	$("html").on('click', '.deletecheckman', function() {
		console.log('121');
		console.log($(this).attr("data-id"));
		var iden = $(this).attr("data-id");
		var type = $(this).attr('data-type');
//		var namearr = window.namelist;
//		console.log(JSON.stringify(namearr));
//		var type = $(this).attr('data-type');
//		console.log(type);
//		
//		var arrs = [];
//		for(var i = 0; i < namearr.length; i++) {
//			if(namearr[i].id === iden) {
//				continue;
//			} else {
//				arrs.push(namearr[i]);
//			}
//		}
//		window.namelist = arrs;
		
		
		
		if(type == 'shop'){
			if(window.allshoplist.length>0){
				window.allshoplist = dete(window.allshoplist,iden,type);
				var context = window.allshoplist;
				var managenamelistTemplateScript = $("#shoplist").html();
			}else{
				window.namelist = dete(window.namelist,iden,type);
				var context = window.namelist;
				var managenamelistTemplateScript = $("#allshoplist").html();
			}
			
			var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
			var managenamelistHtml = managenamelistTemplate(context);
			$("#shopnamelist").html(managenamelistHtml);
		}
		
		if(type == 'user'){
			window.namelist = dete(window.namelist,iden,type);
			var managenamelistTemplateScript = $("#usernamelist-template").html();
			var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
			var context = window.namelist;
			var managenamelistHtml = managenamelistTemplate(context);
			$("#usernamelist").html(managenamelistHtml);
		}
		
		if(type == 'admin'){
			window.namelist = dete(window.namelist,iden,type);
			var managenamelistTemplateScript = $("#namelist").html();
			var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
			var context = window.namelist;
			var managenamelistHtml = managenamelistTemplate(context);
			$("#managenamelist").html(managenamelistHtml);
		}
	});
	
	function dete(obj,iden,type){
		var namearr = obj;
		console.log(JSON.stringify(namearr));
		console.log(iden);
		var arrs = [];
		for(var i = 0; i < namearr.length; i++) {
			if(namearr[i].id == iden) {
				continue;
			} else {
				arrs.push(namearr[i]);
			}
		}
		return arrs;
	}
	
	
	window.picimg = [];
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var info = plus.push.getClientInfo();
	    window.notifyCid = info.clientid;
	    
	    console.log(JSON.stringify(self.infodetail));
	    console.log('21212');
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
	    $("#sendname").val(admininfo.user_info.name);
	    var time = getFormatDate();
	    $("#sendtime").val(time);
	});
	
	//设置默认时间
	function getFormatDate(){
	    var nowDate = new Date();
	    var year = nowDate.getFullYear();
	    var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
	    var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
	    var hour = nowDate.getHours()< 10 ? "0" + nowDate.getHours() : nowDate.getHours();
	    var minute = nowDate.getMinutes()< 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
	    var second = nowDate.getSeconds()< 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
	    return year + "-" + month + "-" + date+" "+hour+":"+minute;
	}
	
	function sendmessage(){
		
		if(start){
			start = start;
		}else{
			start = '';
		}
		if(end){
			end = end;
		}else{
			end = '';
		}
		if(searchkey){
			searchkey = searchkey;
		}else{
			searchkey = '';
		}
		if(page){
			page = page;
		}else{
			page = 1
		}
		if(type){
			type = type;
		}else{
			type = '全部';
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Message/getMessageList'; //获取信息列表
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				type:type,
				start:start,
				end:end,
				searchkey:searchkey,
				page:page,
				num:10,
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
						res.data.rooturl = rooturl;
						var userinfodata = res.data.data;
						window.userinfodata = res.data;
						// 抓取模板数据
						var contenttpl = $("#notice-template").html();
						// 编译模板
						var rcontenttp = Handlebars.compile(contenttpl);
						var data = userinfodata;
						// 把数据传送到模板
				
						var noticeCompiledHtml = rcontenttp(data);
						
						
						// 更新到模板
						if(window.pulldown == 'true'){
							mui('#pullrefresh').pullRefresh().endPulldown();
							window.pulldown = 'false';
							// 更新到模板
							$('#notice-content').html(noticeCompiledHtml);
						}
						
					}else{
						// 更新到模板
						if(window.pulldown == 'true'){
							mui('#pullrefresh').pullRefresh().endPulldown();
							window.pulldown = 'false';
							// 更新到模板
						}
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
					mui.toast(res.message);
				}
				if(window.pullup == 'true'){
					if(res.data == null || res.data.length == 0){
						var ispull = true;
					}else{
						var ispull = false;
					}
					mui('#pullrefresh').pullRefresh().endPullup(ispull); //参数为true代表没有更多数据了。
					window.pullup = 'false';
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
	
	
	//获取管理员列表,接收人
	$("html").on('click', '.getorigin', function() {
		mui.openWindow({
			url: 'selectman.html',
			id: 'selectman',
			extras: {
				"receive_admin_group": window.namelist
			}
		});
		event.stopPropagation();
	})
	
//	点击接收组
	$('html').on('click','.mui-table-view.mui-table-view-radio li',function(){
		console.log($(this).find('a').html());
		var currenttype = $(this).find('a').html();
		if(currenttype == '局端'){
			$(".adminlist").show();
			$(".shoplist").hide();
			$(".userlist").hide();
		}
		if(currenttype == '商家'){
			$(".adminlist").hide();
			$(".shoplist").show();
			$(".userlist").hide();
		}
		if(currenttype == '用户'){
			$(".adminlist").hide();
			$(".shoplist").hide();
			$(".userlist").show();
		}
		if(currenttype == '所有人'){
			$(".adminlist").hide();
			$(".shoplist").hide();
			$(".userlist").hide();
		}
	})
	
	//获取管理员列表,接收人
	$("html").on('click', '.getman', function(event) {
		var radio_li = $('.mui-table-view.mui-table-view-radio li');
		
		for(var radios = 0;radios<radio_li.length;radios++){
			console.log(radio_li.eq(radios));
			if(radio_li.eq(radios).hasClass('mui-selected')){
				console.log(radio_li.eq(radios).find('a').html());
				var type = radio_li.eq(radios).find('a').html();
			}
		}
		console.log(JSON.stringify(window.namelist));
		if(type == '局端'){
			mui.openWindow({
				url: 'selectdome.html',
				id: 'selectdome',
				extras: {
					"receive_admin_group": window.namelist
				}
			});
		}
		if(type == '商家'){
			var tourl = '../managecenter/newrecord/offcanvas-drag-left-plus-main.html';
			mui.openWindow({
			    url:tourl,
			    id:tourl,
			    extras:{
			      //自定义扩展参数，可以用来处理页面间传值
			    },
			    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
			})
		}
		
		if(type == '用户'){
			var tourl = 'userlist.html';
			mui.openWindow({
			    url:tourl,
			    id:tourl,
			    extras:{
			      //自定义扩展参数，可以用来处理页面间传值
			    },
			    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
			      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    }
			})
		}
		event.stopPropagation();
	})
	
	
	
	//获取组织对象
	function getnamelist(sendinfo){
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
					console.log(JSON.stringify(res));
					var namelistarr = res.data;
					var namelistarr = JSON.stringify(namelistarr);
					localStorage.setItem('namelistarr',namelistarr);
					var tourl = 'namelist.html'
					mui.openWindow({
					    url:tourl,
					    id:tourl,
					    styles:{
					      top: '0',//新页面顶部位置
					      bottom:'0',//新页面底部位置
					    },
					    extras:{
					    	sendinfo:sendinfo,
					    	namelistarr:namelistarr
					      //自定义扩展参数，可以用来处理页面间传值
					    },
					    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
					    show:{
					      autoShow:true,//页面loaded事件发生后自动显示，默认为true
					      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
					      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					    }
					})
					
					
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
	//	点击通知消息下一步
	$("html").on('click','.mynextbtn',function(){
		var sendinfo = $('#sendinfo').serializeObject();
		
		var imgarr = sendinfo.imgid;
		var imgstring = '';
		if(typeof imgarr == 'object'){
			imgstring = imgarr.join(',');
		}else{
			imgstring = imgarr;
		}
		sendinfo.imgstring = imgstring;
		console.log(JSON.stringify(sendinfo));
		getnamelist(sendinfo);
	})
	
	
	
//	点击推送
	$("html").on('click','.nextbtn',function(){
		var sendinfo = $('#sendinfo').serializeObject();
		var radio_li = $('.mui-table-view.mui-table-view-radio li');
		
		for(var radios = 0;radios<radio_li.length;radios++){
			console.log(radio_li.eq(radios));
			if(radio_li.eq(radios).hasClass('mui-selected')){
				console.log(radio_li.eq(radios).find('a').html());
				var type = radio_li.eq(radios).find('a').html();
			}
		}
		
		var type = type;
		console.log(type);
		console.log(JSON.stringify(sendinfo));
		sendeditNotify('',sendinfo,type);
		
	})
	
//	点击返回
	$('html').on('click','.exitbtn',function(){
		mui.back();
	})
	
//	消息推送function
	function sendeditNotify(notify_id,sendinfo,type){
		if(notify_id){
			var notify_id = notify_id;
		}else{
			var notify_id = '';
		}
		
		if(sendinfo.title){
			var title = sendinfo.title;
		}else{
			var title = '';
		}
		if(sendinfo.content){
			var content = sendinfo.content;
		}else{
			var content = '';
		}
		
		if(type == '所有人'){
			var received_admin_id ='-1';
			var received_user_id = '-1';
			var received_shop_id = '-1';
		}else{
			if(sendinfo.received_admin_id){
				if(typeof(sendinfo.received_admin_id)=="object"){
					var adminidstring = sendinfo.received_admin_id.join(',');
					var received_admin_id = adminidstring;
				}else{
					var received_admin_id = sendinfo.received_admin_id;
				}
			}else{
				var received_admin_id = '';
			}
			if(sendinfo.received_user_id){
				if(typeof(sendinfo.received_user_id)=="object"){
					var useridstring = sendinfo.received_user_id.join(',');
					var received_user_id = useridstring;
				}else{
					var received_user_id = sendinfo.received_user_id;
				}
			}else{
				var received_user_id = '';
			}
			if(sendinfo.received_shop_id){
				if(typeof(sendinfo.received_shop_id)=="object"){
					var shopidstring = sendinfo.received_shop_id.join(',');
					var received_shop_id = shopidstring;
				}else{
					var received_shop_id = sendinfo.received_shop_id;
				}
			}else{
				var received_shop_id = '';
			}
		}
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Notify/insertNotifyData';
		//创建推送
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
				notify_id:notify_id,
				title:title,
				content:content,
				type:type,
				received_admin_id:received_admin_id,
				received_user_id:received_user_id,
				received_shop_id:received_shop_id,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function() {
						mui.back(); 
						var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						return true;
					}, 1500);
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
	
	
	
	//	点击删除图片
	$("html").on('click','.delete-btn',function(event){
		$(this).parent().remove();
		event.stopPropagation();
	})
	
	//点击添加图片
	$('html').on('click','.imageup',function(event){
		var that = $(this);
		page.imgUp(that);
		event.stopPropagation();
	})


	var page = null;
	page = {
		imgUp: function(that) {
			var m = this;
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: [{
						title: "拍照"
					},
					{
						title: "从相册中选择"
					}
				]
			}, function(e) { //1 是拍照  2 从相册中选择  
				console.log(e.index);
				switch(e.index) {
					case 1:
						appendByCamera(that);
						break;
					case 2:
						appendByGallery(that);
						break;
				}
			});
		}
		//摄像头  
	}

	// 拍照添加文件
	function appendByCamera(that) {
		var cmr = plus.camera.getCamera(1);
		var res = cmr.supportedImageResolutions[0];
		var fmt = cmr.supportedImageFormats[0];
		cmr.captureImage(function(p) {
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				setImg(entry.toLocalURL(), that);
			}, function(e) {});
		}, function(e, that) {}, {
			index: 1,
			filename: "_doc/camera/"
		});

	}
	// 从相册添加文件
	function appendByGallery(that) {
		plus.gallery.pick(function(path) {
			upload(path);
		});
	}

	function setImg(src, that) {
		upload(src);
	}

	//服务端接口路径
	var server = rooturl + "index.php/Api/Apps/Jingkaiqu/Message/multiUpload";
	//获取图片元素

	// 上传文件

	function upload(src) {
		console.log(src);
		var wt = plus.nativeUI.showWaiting();
		var task = plus.uploader.createUpload(server, {
				method: "POST",
				dataType: 'JSON'
			},
			function(t, status) { //上传完成
				if(status == 200) {
					var res = JSON.parse(t.responseText);
					if(res.code && res.code == 1000) {
						res.data.src = src;
						var result = res.data;
						
						console.log('12121');
						console.log(JSON.stringify(result[0].id));
						res.data.imgid = result[0].id;
						alert("上传成功：" + res.message);
						var addimgTemplateScript = $("#addimg-template").html();
						var addimgTemplate = Handlebars.compile(addimgTemplateScript);
						var context = result;
						var addimgCompiledHtml = addimgTemplate(context);
						$(".upload-img").prepend(addimgCompiledHtml);
					} else {
						wt.close(); //关闭等待提示按钮
						alert("上传失败：" + res.message);
						return false;
					}
					wt.close(); //关闭等待提示按钮

				} else {
					alert("上传失败：" + status);
					wt.close(); //关闭等待提示按钮
					return false;
				}
			}
		);
		//添加其他参数
		task.addData("mobile", mobile);
		task.addData("userType", userType);
		task.addData("clientType", clientType);
		task.addData("clientId", clientId);
		task.addData("accessToken", accessToken);
		task.addFile(src, {
			key: "file"
		})
		task.start();
	}
	
	
})

