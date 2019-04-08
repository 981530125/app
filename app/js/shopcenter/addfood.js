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
	window.picimg = [];
	window.foodid = '';
//	修改信息,获取数据
	mui.plusReady(function() {
        var self = plus.webview.currentWebview();
        console.log(JSON.stringify(self.databyid));
        var data = self.databyid;
        if(!$.isEmptyObject(data)){
        	data.rooturl = rooturl;
        	window.foodid = data.id;
        	var addimgTemplateScript = $("#edit-template").html();
			var addimgTemplate = Handlebars.compile(addimgTemplateScript);
			var context = data;
			var addimgCompiledHtml = addimgTemplate(context);
			$("#add").html(addimgCompiledHtml);
			var formjson = $('#add').serializeObject();
			console.log(typeof formjson.imgid);
        	if(formjson.imgid){
        		if(typeof formjson.imgid == 'object'){
        			window.picimg = formjson.imgid;
        		}else{
        			window.picimg.push(formjson.imgid);
        		}
        	}
        }
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
	var str = getFormatDate();
	var ttime = $(".time");
	for(var t = 0;t<ttime.length;t++){
		if(!ttime.eq(t).html()){
			ttime.eq(t).html(str);
			ttime.eq(t).parent().find('.settime').val(str);
		}
	}
	
//公用时间控件
	$('html').on("click", '.time', function() {
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "datetime", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			that.html(e.value);
			that.parent().find('.settime').val(e.value);
		});
	});
	
//	移除数组某个元素
	function remove(arr, item) {
	 var result=[];
	    arr.forEach(function(element){
	        if(element!=item){
	            result.push(element);
	        }
	    });
	 return result;
	}
	
	
//	修改上架状态
	
	$("html").on("click",'#myeditSwitch',function(event){
		var isActive = $(this).hasClass("mui-active");
		console.log(isActive);
		if(isActive){
			$(this).removeClass('mui-active');
			$(this).find('.is_release').val('0');
		}else{
			$(this).addClass('mui-active');
			$(this).find('.is_release').val('1');
		}
		event.stopPropagation();
	})
	

	document.getElementById("mySwitch").addEventListener("toggle",function(event){
	  if(event.detail.isActive){
	    console.log("你启动了开关");
	    $(this).find('.is_release').val('1');
	  }else{
	    console.log("你关闭了开关");
	    $(this).find('.is_release').val('0');
	  }
	})

	
	
	
//	点击删除图片
	$("html").on('click','.delete-btn',function(event){
		var id = $(this).parent().find(".imgid").val();
		
		if(id && window.picimg.length >0){
			var arr = remove(window.picimg,id);
			window.picimg = arr;
			$(this).parent().remove();
		}
		event.stopPropagation();
	})
	
	
	
	
//	点击确认提交
	$("html").on('click','#returnbtn',function(event){
		var formjson = $('#add').serializeObject();
		console.log(JSON.stringify(formjson));
		console.log(JSON.stringify(formjson.imgid));
		if(formjson.imgid){
			console.log(typeof formjson.imgid);
			if(typeof formjson.imgid == 'object' && formjson.imgid.length >0){
				var idstring =  formjson.imgid.join(',');
			}else{
				var idstring =  formjson.imgid;
			}
		}else{
			var idstring = '';
		}
		editactivity(formjson,idstring);
		event.stopPropagation();
	})
	
//	点击删除
	$("html").on('click','#deletebtn',function(){
		var id = $(this).attr("data-id");
		deleteactivitybyid(id);
	})
	//	点击返回
	$('html').on('click','.exit-btn',function(){
		mui.back();
	})
//添加编辑上传菜品
	function editactivity(formjson,goods_file_ids){
		
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_goods/editShopGoods';
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
				name:formjson.name,
				price:formjson.price,
				introduction:formjson.introduction,
				is_release:formjson.is_release,
				id:formjson.id,
				goods_file_ids:goods_file_ids,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					mui.toast(res.message,{ duration:'long', type:'div' })
					console.log(JSON.stringify(res.data));
					window.selecttype = res.data;
					console.log(res.message);
					
					mui.back(); 
					var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
					 
					mui.fire(list, 'refresh',{
						reload:'true'
					});  //返回true,继续页面关闭逻辑
					return true;
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' })
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
				mui.toast(res.message,{ duration:'long', type:'div' })
			}
		})
	}
//	删除菜品
	function deleteactivitybyid(id){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_goods/deleteData';
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
				id:id,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					mui.toast(res.message,{ duration:'long', type:'div' })
					console.log(JSON.stringify(res.data));
					window.selecttype = res.data;
					console.log(res.message);
					mui.back(); 
					var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
					 
					mui.fire(list, 'refresh',{
						reload:'true'
					});  //返回true,继续页面关闭逻辑
					return true;
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' })
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
				mui.toast(res.message,{ duration:'long', type:'div' })
			}
		})
	}
	
	
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
	var server = rooturl + "index.php/Api/Apps/Jingkaiqu/Shop_goods_file/upload";
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
						
						console.log(JSON.stringify(result.id));
						window.picimg.push(result.id);
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
