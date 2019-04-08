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
	var rootpower = [{
		obj:'.chage-btn',
		apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record_file/editInvestigateRecordFileBatch',
		describe:'编辑辅助材料'
	},{
		obj:'.add',
		apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record_file/insertInvestigateRecordFileBatch',
		describe:'添加辅助材料按钮'
	},{
		obj:'.addmaterial-btn',
		apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record_file/insertInvestigateRecordFileBatch',
		describe:'添加辅助材料按钮'
	}];
	
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    window.licenseId = self.licenseId;
	    gethelperfile(self.licenseId);
	    for(var itemn in rootpower){
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
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
				console.log(res.message);
			}
		})
	}
	
	//辅助材料
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
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
				console.log(res.message);
			}
		})
	}
	$("html").on("click",'.chage-btn',function(){
//		console.log($(".imageup").length);
//		var num  = $(".imageup").length
//		if(num >0){
//			upload();
//		}else{
//			uphelperfile(window.licenseId);
//		}
		
		uphelperfile(window.licenseId);
		
		
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
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/editInvestigateRecordFileBatch';
		
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
	
	$('html').on('click','.addmaterial-btn',function(){
		var insertlist = [];
		if($('.myaddimg').length>0){
			for(var a = 0;a<$('.myaddimg').length;a++){
				var id = $('.myaddimg').eq(a).find('.id').val();
				var investigate_record_id = $('.myaddimg').eq(a).find('.investigate_record_id').val();
				var license_id= $('.myaddimg').eq(a).find('.license_id').val();
				var deleted_at = $('.myaddimg').eq(a).find('.deleted_at').val();
				var lat = $('.myaddimg').eq(a).find('.lat').val();
				var lng = $('.myaddimg').eq(a).find('.lng').val();
				var author_name = $('.myaddimg').eq(a).find('.author_name').val();
				var original_name = $('.myaddimg').eq(a).find('.original_name').val();
				var note = $('.myaddimg').eq(a).find('.note').val();
				var is_open = $('.myaddimg').eq(a).find('.is_open').val();
				
				var listjson = {
					'author_name':author_name,
					'id':id,
					'investigate_record_id':investigate_record_id,
					'license_id':license_id,
					'deleted_at':deleted_at,
					'lat':lat,
					'lng':lng,
					'original_name':original_name,
					'note':note,
					'is_open':is_open
				};
				insertlist.push(listjson);
			}
			addchange(insertlist);
		}else{
			mui.toast('无文件');
			return false;
		}
	})
	
	
	//添加辅助材料
	function addchange(list){
		var wt=plus.nativeUI.showWaiting();
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/insertInvestigateRecordFileBatch';
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
					mui.toast(res.message);
				}else{
					alert(res.message);
					console.log(JSON.stringify(res));
				}
				wt.close(); //关闭等待提示按钮
			},
			error: function(res) {
				$("#my-mask").show();
				wt.close(); //关闭等待提示按钮
//				prompt("error1",JSON.stringify(res));
				console.log(res.message);
			}
		})
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
            mui("body").on("tap",".add",function(){
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
                    		
                    		console.log(JSON.stringify(result[0]));
                    		
                    		
                    		var addTemplateScript = $("#add-template").html();
							var addTemplate = Handlebars.compile(addTemplateScript);
							var context = result[0];
							var addCompiledHtml = addTemplate(context);
							$("#filelist").append(addCompiledHtml);
                    		
//                  		return false;
                    		
//                  		for(var d = 0;d<result.length;d++){
//                  			$(".imageup").eq(d).find(".investigate_record_id").val(result[d].investigate_record_id);
//                  			$(".imageup").eq(d).find(".license_id").val(window.licenseId);
//                  			if($(".findfilename").eq(d).find(".original_name").val() == ''){
//                  				$(".findfilename").eq(d).find(".original_name").val(result[d].original_name);
//                  			}
//                  			$(".imageup").eq(d).find(".author_name").val(result[d].author_name);
//                  			$(".imageup").eq(d).find(".id").val(result[d].id);
//                  		}
//                  		uphelperfile(window.licenseId);
//                  		picimg.push(res.data);
//                  		window.picimg = picimg;
                    		
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
//          var len = $(".imgsrc").length;
//      	for(var n = 0;n<len;n++ ){
//				var imgarr = $(".imgsrc")[n];
//      		files.push($(".imgsrc")[n].src);
//      		task.addFile(imgarr.src,{key:"file"+n});
//      	}
            task.start();
        }
        if(window.plus){  
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);  
        }
})
