$(function(){
	getcenter();
	function getcenter(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/userCenter'; //获取账号中心首页
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
				console.log(JSON.stringify(res));
				if(res.code && res.code == 1000){
					var admininfo = JSON.stringify(res.data);
					localStorage.setItem("admininfo",admininfo);
					res.data.mobile = mobile;
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
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast('请求失败',{ duration:'long', type:'div' });
				return false;
			}
		})
	};
	
	function changeinfo(){
		$("#my-mask").show();
		var admin_avatar_file_id = $(".file_id").val();
		var name = $("#managename").val();
		console.log(admin_avatar_file_id);
		console.log(name);
		console.log(accessToken);
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/changeSelfInfo'; //获取账号中心首页
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
//					var admininfo = JSON.stringify(res.data);
//					localStorage.setItem("admininfo",admininfo);
//					res.data.mobile = mobile;
//					var userinfodata = res.data;
//			//		// 抓取模板数据
//					var contenttpl = $("#info-template").html();
//					// 编译模板
//					var rcontenttp = Handlebars.compile(contenttpl);
//					var data = userinfodata;
//					// 把数据传送到模板
//			
//					var text = rcontenttp(data);
//					// 更新到模板
//					$('#chageinfo').html(text);
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
				mui.toast('请求失败',{ duration:'long', type:'div' });
				return false;
			}
		})
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

//      $("html").on('click','.uploadbutton',function(){
//      	upload();
//      })
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
            task.addData("dirName",'admin_avatar_file');
            var len = $(".imgsrc").length;
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
	//修改密码
	
	$("html").on("click",".changepwd",function(event){
		mui.openWindow({
		    url: 'changemanpwd.html',
		    id: 'changemanpwd.html'
		});
		event.stopPropagation();
	})
})
