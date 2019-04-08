//FORm序列化转json
$.fn.serializeObject = function()    
{    
   var o = {};
	var oarr = []; 
   var a = this.serializeArray();  
	$.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    var $radio = $('input[type=radio],input[type=checkbox]',this);
    $.each($radio,function(){
        if(!o.hasOwnProperty(this.name)){
            o[this.name] = '';
        }
    });
    return o;  
};
$(function(){
	//	权限判断
	var rootpower = [{
		obj:'.chage-btn',
		apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record_file/editInvestigateRecordFile',
		describe:'编辑辅助材料'
	}];
	
	
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    window.licenseId = self.licenses_id;
	    console.log(window.licenseId);
	    
	    console.log(accessToken);
	    
	    gethelperfile(self.licenses_id);
	    for(var itemn in rootpower){
	    	console.log('121212');
			ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
		}
	});


	//上传图片
	function upfile(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/multiUpload';
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
				licenseId:licenseId,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					console.log(JSON.stringify(res));
					var formTemplateScript = $("#change-template").html();
					var formTemplate = Handlebars.compile(formTemplateScript);
					var context = res.data;
					var formCompiledHtml = formTemplate(context);
					$("#change-form").append(formCompiledHtml);
					console.log(res.message);
				}else{
					console.log(JSON.stringify(res));
				}
				console.log(res.data);
			},
			error: function(res) {
				prompt("error1",JSON.stringify(res));
				console.log(res.message);
			}
		})
	}
	
	//获取自身辅助材料
	function gethelperfile(licenseId){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/getInvestigateRecordFile';
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
				licenseId:licenseId,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					console.log(JSON.stringify(res));
					res.data.url = rooturl;
					var formTemplateScript = $("#filelist-template").html();
					var formTemplate = Handlebars.compile(formTemplateScript);
					var context = res.data;
					var formCompiledHtml = formTemplate(context);
					$("#filelist").append(formCompiledHtml);
					console.log(res.message);
				}else{
					console.log(JSON.stringify(res));
				}
				console.log(res.data);
			},
			error: function(res) {
				prompt("error1",JSON.stringify(res));
				console.log(res.message);
			}
		})
	}
	
	
	$("html").on("click",'.chage-btn',function(){
		var num  = $(".image-item").length
		if(num = 0){
			mui.alert('无文件');
		}else{
			uphelperfile(window.licenseId);
		}
		
	})
	//上传辅助材料
	function uphelperfile(licenseId){
		var cerhelper = $('#cerhelper').serializeObject();
		console.log(JSON.stringify(cerhelper));
		var list = [];
		var length = 0;
		console.log(typeof cerhelper.id);
		
		if (typeof (cerhelper) == 'object') {
			if(typeof cerhelper.id == 'object'){
				for (var index in cerhelper) {
					var lengthObj = cerhelper[index];
					length = lengthObj.length;
				}
				console.log(length);
				for (var i = 0; i < length; i++) {
					var temp = {};
					for (var index in cerhelper) {
						temp[index] = cerhelper[index][i];
					}
					
					list.push(temp);
				}
			}else{
				list.push(cerhelper);
			}
		} else {
			alert('数据有误');
		}
		
		
		$("#my-mask").show();
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/editInvestigateRecordFile';
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
				filelist:list,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == 1000){
					console.log(JSON.stringify(res));
					var filelistTemplateScript = $("#filelist-template").html();
					var filelistTemplate = Handlebars.compile(filelistTemplateScript);
					var context = res.data;
					var filelistCompiledHtml = filelistTemplate(context);
					$("#change-form").append(filelistCompiledHtml);
					alert(res.message);
					mui.back();
				}else{
					alert(res.message);
					console.log(JSON.stringify(res));
				}
			},
			error: function(res) {
				$("#my-mask").show();
//				prompt("error1",JSON.stringify(res));
				console.log(res.message);
			}
		})
	}
	
////	点击删除delete-item
	$("html").on("click",'.delete-item',function(){
		var time = getnowtime();
		$(this).siblings(".deleted_at").val(time);
		$(this).parent().parent().hide();
	})
	
	
	function getnowtime() {
	    var nowtime = new Date();
	    var year = nowtime.getFullYear();
	    var month = padleft0(nowtime.getMonth() + 1);
	    var day = padleft0(nowtime.getDate());
	    var hour = padleft0(nowtime.getHours());
	    var minute = padleft0(nowtime.getMinutes());
	    var second = padleft0(nowtime.getSeconds());
	    var millisecond = nowtime.getMilliseconds(); millisecond = millisecond.toString().length == 1 ? "00" + millisecond : millisecond.toString().length == 2 ? "0" + millisecond : millisecond;
	    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}
	function padleft0(obj) {
        return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
    }
	
	
	
	
	//点击新增
//	$("html").on("click",'.add',function(){
//		console.log('3131');
//		var context = { name: "zhaoshuai", content: "learn Handlebars"};
//		var addTemplateScript = $("#add-template").html();
//		var addTemplate = Handlebars.compile(addTemplateScript);
//		var context = context;
//		var addCompiledHtml = addTemplate(context);
//		$("#filelist").append(addCompiledHtml);
//	})
	
	
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
        	var cmr = plus.camera.getCamera(1);
        	var res = cmr.supportedImageResolutions[0];
		    var fmt = cmr.supportedImageFormats[0];
		    cmr.captureImage( function(p){
		    	plus.io.resolveLocalFileSystemURL(p, function(entry){
		            setImg(entry.toLocalURL(),that);
		        }, function(e){});
		    }, function(e,that){},{index:1,filename:"_doc/camera/"});

        }
        // 从相册添加文件
        function appendByGallery(that){
            plus.gallery.pick(function(path){
            	that.find(".imgsrc").attr("src",path);
            	upload(path);
            });
        }
        function setImg(src,that){
        	that.find(".imgsrc").attr("src",src);
        	upload(src);
		}
          
        //服务端接口路径
        var server = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/multiUpload';
        //获取图片元素

//      $("html").on('click','.uploadbutton',function(){
//      	upload();
//      })
        // 上传文件
        
        var picimg = [];
        var files = [];
        function upload(path){
        	
        	console.log(path);
        	
            var wt=plus.nativeUI.showWaiting();
            var task=plus.uploader.createUpload(server,
                {method:"POST",dataType: 'JSON'},
                function(t,status){ //上传完成
                    if(status==200){
                    	var res = JSON.parse(t.responseText);
                    	if(res.code && res.code == 1000){
                    		var result = res.data;
                    		result[0].rooturl = rooturl;
                    		result[0].license_id = window.licenseId;
                    		console.log(JSON.stringify(result));
                    		
                    		var addTemplateScript = $("#add-template").html();
							var addTemplate = Handlebars.compile(addTemplateScript);
							var context = result[0];
							var addCompiledHtml = addTemplate(context);
							$("#filelist").append(addCompiledHtml);
                    	}else{
                    		wt.close(); //关闭等待提示按钮
                    		alert("上传失败："+res.message);
                    		return false;
                    	}
                        wt.close(); //关闭等待提示按钮
                        
                    }else{
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
        	task.addFile(path,{key:"file"});
            task.start();
        }
        if(window.plus){  
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);  
        }
})
