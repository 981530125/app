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
	window.picimg = [];
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var time = getFormatDate();
	    $("#sendtime").val(time);
	    var shopinfo = JSON.parse(localStorage.getItem("shopinfo"));
	    
	    console.log(JSON.stringify(shopinfo));
	    $("#sendname").val(shopinfo.user_info.corporation_name);
	    
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
				return false;
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
		if(userType == 'admin'){
			getnamelist();
		}
	}
	
	
//	点击提交
	$("html").on('click','.nextbtn',function(){
		var sendinfo = $('#sendinfo').serializeObject();
		
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
		var received_admin_id = '';
		var root_message_id = '';
		var status = 0;
		var file_id_list = imgstring;
		
		postmessage(title,content,received_admin_id,root_message_id,status,file_id_list)
	})
	
	//		创建主题
		
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
					mui.alert(res.message);
					console.log(JSON.stringify(res));
					mui.back();
					var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
					 
					mui.fire(list, 'refresh',{
						reload:'true'
					});  //返回true,继续页面关闭逻辑
					return true;
					mui.toast(res.message);
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

