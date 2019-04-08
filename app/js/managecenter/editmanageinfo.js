$(function(){
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			}
		}
	});
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		setTimeout(function() {
			getcenter();
			getshoptype();
		}, 1500);
	}
	
	//	头部点击返回调用刷新
	window.addEventListener('refresh', function(e){//执行刷新 
		console.log(JSON.stringify(e.detail));
	  if(e.detail.reload == 'true'){
	  	var corporation_address = e.detail.corporation_address;
	  	var lat = e.detail.lat;
	  	var lng = e.detail.lng;
	  	var corporation_address_components = e.detail.corporation_address_components;
	  	
	  	$("#corporation_address").val(corporation_address);
	  	$("#lat").val(lat);
	  	$("#lng").val(lng);
	  	$("#shopaddress").html(corporation_address);
	  	window.corporation_address = corporation_address;
	  	window.corporation_address_components = corporation_address_components;
	  }
	});
	//	头部点击返回调用刷新
	window.addEventListener('opentime', function(e){
		console.log(JSON.stringify(e.detail));
	  if(e.detail.reload == 'true'){
	  	console.log(e.detail.shop_open_range);
	  	window.shop_open_range = e.detail.shop_open_range;
	  }
	});
	
	//	头部点击返回调用刷新
	window.addEventListener('shoptype', function(e){
		console.log(JSON.stringify(e.detail));
	  if(e.detail.reload == 'true'){
	  	console.log(e.detail.data_id);
	  	$('.shop_category_id').val(e.detail.data_id);
	  	$('.selecttype').html(e.detail.data_name);
	  }
	});
	
	//点击锁定
	$("html").on("click",'#mySwitch',function(event){
		var isActive = $(this).hasClass("mui-active");
		console.log(isActive);
		if(isActive){
			$(this).removeClass('mui-active');
			$('.lock_client_id').val('2');
			
		}else{
			$(this).addClass('mui-active');
			$('.lock_client_id').val('1');
		}
		event.stopPropagation();
	})
	
	
	//获取信息
	function getcenter(){
		console.log(accessToken);
		console.log(clientId);
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
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
				console.log('1212');
				console.log(JSON.stringify(res));
				if(res.code && res.code == 1000){
					if(userType == 'admin'){
						var admininfo = JSON.stringify(res.data);
						
						localStorage.setItem("admininfo",admininfo);
						window.enforcement_number = res.data.user_info.enforcement_number
						res.data.mobile = res.data.user_info.mobile;
						res.data.rooturl = rooturl;
						var userinfodata = res.data;
						
				//		// 抓取模板数据
						var contenttpl = $("#info-template").html();
						// 编译模板
						var rcontenttp = Handlebars.compile(contenttpl);
						var data = userinfodata;
						// 把数据传送到模板
				
						var text = rcontenttp(data);
						// 更新到模板
						$('#chageinfo').html(text);
					}
					if(userType == 'shop'){
						console.log('123123');
						res.data.mobile = res.data.user_info.mobile;
						res.data.rooturl = rooturl;
						var userinfodata = res.data;
						console.log(JSON.stringify(userinfodata.user_info.shop_category_crumbs));
						
						var shop_category_crumbs = userinfodata.user_info.shop_category_crumbs;
						var shoptypearr = [];
						for(var item in shop_category_crumbs){
							shoptypearr.push(shop_category_crumbs[item].name);
						}
						
						var shoptypestring = shoptypearr.join('-');
						res.data.shoptypestring = shoptypestring;
						
						window.shopinfodata = res.data;
				//		// 抓取模板数据
						var shopcontenttpl = $("#shopinfo-template").html();
						// 编译模板
						var shopcontenttp = Handlebars.compile(shopcontenttpl);
						var data = userinfodata;
						// 把数据传送到模板
				
						var text = shopcontenttp(data);
						// 更新到模板
						$('#chageinfo').html(text);
					}
					if(userType == 'user'){
						var admininfo = JSON.stringify(res.data);
						window.enforcement_number = res.data.user_info.enforcement_number
						res.data.mobile = res.data.user_info.mobile;
						res.data.rooturl = rooturl;
						var userinfodata = res.data;
					
				//		// 抓取模板数据
						var contenttpl = $("#userinfo-template").html();
						// 编译模板
						var rcontenttp = Handlebars.compile(contenttpl);
						var data = userinfodata;
						// 把数据传送到模板
				
						var text = rcontenttp(data);
						// 更新到模板
						$('#chageinfo').html(text);
					}
					mui.toast(res.message,{ duration:'long', type:'div' });
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
				if(window.pulldown == 'true'){
					mui('#pullrefresh').pullRefresh().endPulldown();
					window.pulldown = 'false';
				}
			},
			error: function(res){
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	};
	console.log('1212');
//	getshoptype();
	function getshoptype(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_category/allData'; //获取商家类型
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				rootLevel:'',
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
				console.log(JSON.stringify(res));
				if(res.code && res.code == 1000){
					var typearr = res.data;
					window.typearr = res.data;
					mui.toast(res.message,{ duration:'long', type:'div' });
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			},
			error: function(res){
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
		
		
	}
	
	function changeinfo(){
		$("#my-mask").show();
		var admininfo = localStorage.getItem('admininfo');
		
		var admin_avatar_file_id = $(".file_id").val();
		var name = $("#managename").val();
		var newMobile = $("#newmobile").val();
		var enforcement_number = $("#enforcement_number").val();
		
		var lock_client_id = $('.lock_client_id').val();
		
		console.log(admin_avatar_file_id);
		console.log(name);
		console.log(accessToken);
		console.log(newMobile);
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/changeSelfInfo'; //获取账号中心首页
		
		if(newMobile.length > 0){
			var btnArray = ['否', '是'];
			mui.confirm('是否修改新的手机号,修改后将退出登录，是否确认？', '修改', btnArray, function(e) {
				if (e.index == 1) {
					$.ajax({
						url: url,
						data: {
							mobile: mobile,
							userType: userType,
							clientId: clientId,
							clientType: clientType,
							accessToken: accessToken,
							corporation_name:'',
							shop_category_id:'',
							corporation_address:'',
							corporation_address_components:'',
							lat:mylatitude,
							lng:mylongitude,
							shop_contact:'',
							shop_open_range:'',
							name:name,
							id_card_no:'',
							user_avatar_file_id:'',
							admin_avatar_file_id:admin_avatar_file_id,
							shop_avatar_file_id:'',
							enforcement_number:enforcement_number,
							newMobile:newMobile,
							loginway:loginway,
							lock_client_id:lock_client_id
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
							console.log(JSON.stringify(res));
							mui.toast(res.message,{ duration:'long', type:'div' });
							if(res.code && res.code == 1000){
								//在关闭窗口代码上加入延迟
								setTimeout(function() {
									if(newMobile.length > 0){
										plus.runtime.restart();
									}
								}, 2000)
							}else{
								mui.alert(res.message);
							}
						},
						error: function(res){
							$("#my-mask").hide();
							console.log(JSON.stringify(res));
							console.log(res.message);
							console.log(res.data);
							mui.toast(res.message,{ duration:'long', type:'div' });
							return false;
						}
					})
				} else {
					$("#my-mask").hide();
					mui.toast('取消',{ duration:'long', type:'div' });
					return false;
				}
			})
		}else{
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					corporation_name:'',
					shop_category_id:'',
					corporation_address:'',
					corporation_address_components:'',
					lat:mylatitude,
					lng:mylongitude,
					shop_contact:'',
					shop_open_range:'',
					name:name,
					id_card_no:'',
					user_avatar_file_id:'',
					admin_avatar_file_id:admin_avatar_file_id,
					shop_avatar_file_id:'',
					enforcement_number:enforcement_number,
					newMobile:newMobile,
					loginway:loginway,
					lock_client_id:lock_client_id
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
					console.log(JSON.stringify(res));
					mui.toast(res.message,{ duration:'long', type:'div' });
					if(res.code && res.code == 1000){
						//在关闭窗口代码上加入延迟
						setTimeout(function() {
							if(newMobile.length > 0){
								plus.runtime.restart();
							}
						}, 1000)
					}else{
						mui.alert(res.message);
					}
				},
				error: function(res){
					$("#my-mask").hide();
					console.log(JSON.stringify(res));
					console.log(res.message);
					console.log(res.data);
					mui.toast(res.message,{ duration:'long', type:'div' });
					return false;
				}
			})
		}
	}
	
//	商家提交api
	function changeshopinfo(shop_avatar_file_id,corporation_name,mobile,shop_category_id,shop_contact,lat,lng,corporation_address,shop_open_range,corporation_address_components,newMobile,lock_client_id){
		console.log(JSON.stringify(shop_open_range));
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/changeSelfInfo'; //获取账号中心首页
		if(newMobile.length>0){
			var btnArray = ['否', '是'];
			mui.confirm('是否修改新的手机号,修改后将退出登录，是否确认？', '修改', btnArray, function(e) {
				if (e.index == 1) {
					$.ajax({
						url: url,
						data: {
							mobile: mobile,
							userType: userType,
							clientId: clientId,
							clientType: clientType,
							accessToken: accessToken,
							corporation_name:corporation_name,
							shop_category_id:shop_category_id,
							corporation_address:corporation_address,
							corporation_address_components:corporation_address_components,
							lat:lat,
							lng:lng,
							shop_contact:shop_contact,
							shop_open_range:shop_open_range,
							name:'',
							id_card_no:'',
							user_avatar_file_id:'',
							admin_avatar_file_id:'',
							shop_avatar_file_id:shop_avatar_file_id,
							enforcement_number:'',
							newMobile:newMobile,
							loginway:loginway,
							lock_client_id:lock_client_id
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
							console.log(JSON.stringify(res));
							if(res.code && res.code == 1000){
								mui.toast(res.message,{ duration:'long', type:'div' });
								//在关闭窗口代码上加入延迟
								setTimeout(function() {
									if(newMobile.length > 0){
										plus.runtime.restart();
									}
								}, 1000)
							}else{
								mui.toast(res.message,{ duration:'long', type:'div' });
							}
						},
						error: function(res){
							$("#my-mask").hide();
							console.log(JSON.stringify(res));
							console.log(res.message);
							console.log(res.data);
							mui.toast(res.message,{ duration:'long', type:'div' });
						}
					})
				}else {
					$("#my-mask").hide();
					mui.toast('取消',{ duration:'long', type:'div' });
					return false;
				}
			})
		}else{
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					corporation_name:corporation_name,
					shop_category_id:shop_category_id,
					corporation_address:corporation_address,
					corporation_address_components:corporation_address_components,
					lat:lat,
					lng:lng,
					shop_contact:shop_contact,
					shop_open_range:shop_open_range,
					name:'',
					id_card_no:'',
					user_avatar_file_id:'',
					admin_avatar_file_id:'',
					shop_avatar_file_id:shop_avatar_file_id,
					enforcement_number:'',
					newMobile:newMobile,
					loginway:loginway,
					lock_client_id:lock_client_id
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
					console.log(JSON.stringify(res));
					if(res.code && res.code == 1000){
						mui.alert(res.message);
					}else{
						mui.alert(res.message);
					}
				},
				error: function(res){
					$("#my-mask").hide();
					console.log(JSON.stringify(res));
					console.log(res.message);
					console.log(res.data);
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			})
		}
		
	}
	
	//	用户提交api
	function changeuserinfo(name,id_card_no,user_avatar_file_id,newMobile,lock_client_id){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/changeSelfInfo'; //获取账号中心首页
		if(newMobile.length>0){
			var btnArray = ['否', '是'];
			mui.confirm('是否修改新的手机号,修改后将退出登录，是否确认？', '修改', btnArray, function(e) {
				if (e.index == 1) {
					$.ajax({
						url: url,
						data: {
							mobile: mobile,
							userType: userType,
							clientId: clientId,
							clientType: clientType,
							accessToken: accessToken,
							corporation_name:'',
							shop_category_id:'',
							corporation_address:'',
							corporation_address_components:'',
							lat:'',
							lng:'',
							shop_contact:'',
							shop_open_range:'',
							name:name,
							id_card_no:id_card_no,
							user_avatar_file_id:user_avatar_file_id,
							admin_avatar_file_id:'',
							shop_avatar_file_id:'',
							enforcement_number:'',
							newMobile:newMobile,
							loginway:loginway,
							lock_client_id:lock_client_id
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
							console.log(JSON.stringify(res));
							if(res.code && res.code == 1000){
								mui.toast(res.message,{ duration:'long', type:'div' });
								//在关闭窗口代码上加入延迟
								setTimeout(function() {
									if(newMobile.length > 0){
										plus.runtime.restart();
									}
								}, 1000)
							}else{
								mui.toast(res.message,{ duration:'long', type:'div' });
							}
						},
						error: function(res){
							$("#my-mask").hide();
							console.log(JSON.stringify(res));
							console.log(res.message);
							console.log(res.data);
							mui.toast(res.message,{ duration:'long', type:'div' });
						}
					})
				}else{
					$("#my-mask").hide();
					mui.toast('取消',{ duration:'long', type:'div' });
				}
			})
		}else{
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					corporation_name:'',
					shop_category_id:'',
					corporation_address:'',
					corporation_address_components:'',
					lat:'',
					lng:'',
					shop_contact:'',
					shop_open_range:'',
					name:name,
					id_card_no:id_card_no,
					user_avatar_file_id:user_avatar_file_id,
					admin_avatar_file_id:'',
					shop_avatar_file_id:'',
					enforcement_number:'',
					newMobile:newMobile,
					loginway:loginway,
					lock_client_id:lock_client_id
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
					console.log(JSON.stringify(res));
					if(res.code && res.code == 1000){
						mui.toast(res.message,{ duration:'long', type:'div' });
					}else{
						mui.toast(res.message,{ duration:'long', type:'div' });
					}
				},
				error: function(res){
					$("#my-mask").hide();
					console.log(JSON.stringify(res));
					console.log(res.message);
					console.log(res.data);
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			})
		}
	}
	
	//相册图片上传	
		// 扩展API加载完毕后调用onPlusReady回调函数
		document.addEventListener( "plusready", onPlusReady, false );
		// 扩展API加载完毕，现在可以正常调用扩展API
		function onPlusReady() {
		    console.log("plusready");
		}
		//图片上传
		function plusReady(){
            // 弹出系统选择按钮框
            mui("body").on("tap",".imageup",function(){
            	var that = $(this);
                page.imgUp(that);  
            })
        }
        var page=null;
        page={
            imgUp:function(that){
                var m=this;  
                plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
                    {title:"拍照"},  
                    {title:"从相册中选择"}
                ]}, function(e){//1 是拍照  2 从相册中选择  
                	console.log(e.index);
                    switch(e.index){  
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
        function appendByCamera(that){
        	console.log(that);
        	var cmr = plus.camera.getCamera(1);
        	var res = cmr.supportedImageResolutions[0];
		    var fmt = cmr.supportedImageFormats[0];
		    console.log("Resolution: "+res+", Format: "+fmt);
		    cmr.captureImage( function(p){
		    	console.log(that);
		    	plus.io.resolveLocalFileSystemURL(p, function(entry){
		    		console.log(that);
		            setImg(entry.toLocalURL(),that);
		        }, function(e){});
		    }, function(e,that){},{index:1,filename:"_doc/camera/"});

        }
        // 从相册添加文件
        function appendByGallery(that){
            plus.gallery.pick(function(path){
            	that.find(".imgsrc").attr("src",path);
            	upload();
            	console.log(path);
            });
        }
        function setImg(src,that){
        	that.find(".imgsrc").attr("src",src);
        	upload();
        	console.log(src);
		}
          
        //服务端接口路径
        var server = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/uploads';
        //获取图片元素
        // 上传文件
        
        var picimg = [];
        var files = [];
        function upload(){
            var wt=plus.nativeUI.showWaiting();
            var task=plus.uploader.createUpload(server,
                {method:"POST",dataType: 'JSON'},
                function(t,status){ //上传完成
                    if(status==200){
                    	var res = JSON.parse(t.responseText);
                    	if(res.code && res.code == 1000){
                    		
                    		console.log(JSON.stringify(res.data));
                    		var result = res.data;
                    		$(".file_id").val(result.id);
                    		
                    		
                    	}else{
                    		wt.close(); //关闭等待提示按钮
                    		alert("上传失败："+res.message);
                    		return false;
                    	}
                        wt.close(); //关闭等待提示按钮
                        
                    }else{
                    	console.log(JSON.stringify(t));
                    	console.log(status);
                        alert("上传失败："+status);
                        wt.close();//关闭等待提示按钮
                        return false;
                    }
                }
            );
            //添加其他参数
            task.addData("mobile",mobile);
            task.addData("userType",userType);
            task.addData("clientType",clientType);
            task.addData("clientId",clientId);
            task.addData("accessToken",accessToken);
            if(userType == 'shop'){
            	var dirName = 'shop_avatar_file';
            }
            if(userType == 'admin'){
            	var dirName = 'admin_avatar_file';
            }
            if(userType == 'user'){
            	var dirName = 'user_avatar_file';
            }
            task.addData("dirName",dirName);
            console.log('212');
            var len = $(".imgsrc").length;
            console.log('21212122');
        	for(var n = 0;n<len;n++ ){
				var imgarr = $(".imgsrc")[n];
        		files.push($(".imgsrc")[n].src);
        		task.addFile(imgarr.src,{key:"file"});
        	}
            task.start();
        }
        if(window.plus){  
            plusReady();  
        }else{
            document.addEventListener("plusready",plusReady,false);  
        }
    
	$("html").on("click",".sumbit-btn",function(event){
		changeinfo();
		event.stopPropagation();
	})
	
//	商家提交
	$('html').on('click','.shop-sumbit-btn',function(){
		$("#my-mask").show();
		console.log('1212');
		var shop_avatar_file_id = $(".file_id").val();
		
		console.log(shop_avatar_file_id);
		
		var corporation_name = $("#corporation_name").val();
		var mobile = $(".mobile").val();
		var shop_category_id = $(".shop_category_id").val();
		var shop_contact = $(".shop_contact").val();
		var lat = $(".lat").val();
		var lng = $(".lng").val();
		var newmobile = $("#newmobile").val();
		var lock_client_id = $('.lock_client_id').val();
		
		
		var corporation_address = $(".corporation_address").val();
		if(window.shop_open_range){
			var shop_open_range = JSON.stringify(window.shop_open_range);
		}else{
			var shop_open_range = {};
		}
		
		if(window.corporation_address_components){
			var corporation_address_components = JSON.stringify(window.corporation_address_components);
		}else{
			var corporation_address_components = {};
		}
		changeshopinfo(shop_avatar_file_id,corporation_name,mobile,shop_category_id,shop_contact,lat,lng,corporation_address,shop_open_range,corporation_address_components,newmobile,lock_client_id);
		event.stopPropagation();
	})
	
//	个人提交修改
	$('html').on('click','.usersumbit-btn',function(event){
		$("#my-mask").show();
		var name = $('#username').val();
		var id_card_no = $('.id_card_no').val();
		var user_avatar_file_id = $(".file_id").val();
		var newMobile = $("#newmobile").val();
		var lock_client_id = $(".lock_client_id").val();
		changeuserinfo(name,id_card_no,user_avatar_file_id,newMobile,lock_client_id);
		event.stopPropagation();
	})
	
	
	
	
//	修改营业时间
	$('html').on('click','.openhours',function(event){
		
//		console.log(JSON.stringify(window.shopinfodata.user_info.shop_open_range));
		
		if(window.shopinfodata.user_info.shop_open_range){
			var open_time = window.shopinfodata.user_info.shop_open_range;
		}else{
			var open_time = [{"day_of_week":"1","open_time":"09:00:00","close_time":"21:00:00"},{"day_of_week":"2","open_time":"09:00:00","close_time":"21:00:00"},{"day_of_week":"3","open_time":"09:00:00","close_time":"21:00:00"},{"day_of_week":"4","open_time":"09:00:00","close_time":"21:00:00"},{"day_of_week":"5","open_time":"09:00:00","close_time":"21:00:00"},{"day_of_week":"6","open_time":"10:00:00","close_time":"22:30:00"},{"day_of_week":"7","open_time":"10:00:00","close_time":"22:30:00"}];
		}
		
		mui.openWindow({
		    url:'../opentime/opentime.html',
		    extras:{
		    	open_time:open_time
		      //自定义扩展参数，可以用来处理页面间传值
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
		
		event.stopPropagation();
	})
	
//	企业分类
	$('html').on('click','.selecttype',function(event){
		var shoptype = window.typearr;
		mui.openWindow({
		    url:'shoptype.html',
		    extras:{
		    	shoptype: shoptype
		      //自定义扩展参数，可以用来处理页面间传值
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
		
		event.stopPropagation();
	});
	
	//修改密码
	
	$("html").on("click",".changepwd",function(event){
		
		mui.openWindow({
		    url:'../../changepwd/changemanpwd.html',
		    extras:{
		    	type: userType
		      //自定义扩展参数，可以用来处理页面间传值
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
		
		event.stopPropagation();
	})
	
	$('html').on('click','.getlatlng',function(){
		var forminfo = window.shopinfodata.user_info;
		
		mui.openWindow({
		    url:'../../shop/shopmap.html',
		    extras:{
		    	forminfo:forminfo
		      //自定义扩展参数，可以用来处理页面间传值
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	})
	
})
