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


$(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		console.log(JSON.stringify(self.objinfo));
		self.objinfo.rooturl = rooturl;
		window.filelist = self.objinfo.filelist;
		
		
		console.log(JSON.stringify(window.filelist));
		
		//		图片套用模板
		var theTemplateScript = $("#img-template").html();
		var theTemplate = Handlebars.compile(theTemplateScript);
		var context = self.objinfo;
		var theCompiledHtml = theTemplate(context);
		$("#imglist").html(theCompiledHtml);
		//文件套用模板
		var fileTemplateScript = $("#file-template").html();
		var fileTemplate = Handlebars.compile(fileTemplateScript);
		var context = self.objinfo;
		var fileCompiledHtml = fileTemplate(context);
		$("#filelist").html(fileCompiledHtml);
	});

	$("html").on('click', '.addmap', function() {
		console.log($(".mapitem").length);
		var mapnum = $(".mapitem");
		for(var i = 0;i<mapnum.length;i++){
			mapnum.eq(i).html("");
		}
		var that = $(this);
		var getlat = that.attr("data-lat");
		var getlng = that.attr("data-lng");

		var insertnode = that.parents('.mui-action-control').children('.mapitem');
		var theTemplateScript = $("#map-template").html();
		var theTemplate = Handlebars.compile(theTemplateScript);
		var context = {
			lat: getlat,
			lng: getlng
		};
		var theCompiledHtml = theTemplate(context);
		insertnode.html(theCompiledHtml);
		init(context,that);
	})

	//地图
	var searchService, markers = [];
	var map, center, marker, isFirst = true,
		info, geocoder, listener, markersArray = [];

	function init(options,that) {
		console.log(JSON.stringify(options));

		if(options === null) {
			alert('数据不能为空');
			return false;
		}
		if(options.lat != '' && options.lng != '' &&
			options.corporation_address_components != null &&
			options.corporation_address_components.city == '温州市' &&
			typeof(options.corporation_address_components.street) != 'undefined' &&
			options.corporation_address_components.street != '') {
			var center = new qq.maps.LatLng(options.lat, options.lng);
			boot(center, options,that);
			isFirst = false;
		} else {
			alert('定位数据不准确,请重新定位');

			var center = new qq.maps.LatLng(mylatitude, mylongitude);
			boot(center, options,that);

			//huoqu 
			//		getLocationByAddress(options.residence);
		}

	}
	/*根据地址文字搜索定位*/
	function getLocationByAddress(address) {
		geocoder = new qq.maps.Geocoder({
			complete: function(results) {
				console.log(results);
				console.log('1212');
				var center = new qq.maps.LatLng(results.lat, results.lng);
				boot(center, options,that);
			},
			error: function(err, msg) {
				alert('搜索定位失败,请手动定位或更改关键字');
				isFirst = false;
			}
		});
		geocoder.getLocation(address);
	}
	/*根据经纬度搜索定位*/
	function boot(center, options,that) {
		var mapitem = that.parents('.mui-action-control').find(".container")[0];

		
		map = new qq.maps.Map(mapitem, {
			center: center,
			zoom: 13
		});
		//创建标记
		marker = new qq.maps.Marker({
			position: center,
			map: map
		});
		markersArray.push(marker); //存储标记
		//添加到提示窗
		info = new qq.maps.InfoWindow({
			map: map
		});
		
		geocoder = new qq.maps.Geocoder({
			complete: function(result) {
				//地图图标移动操作
				map.setCenter(result.detail.location);
				deleteOverlays(); //清除之前的标记
				marker = new qq.maps.Marker({ //添加新的标记
					map: map,
					position: result.detail.location
				});
				markersArray.push(marker); //存储标记
				//设置定位信息为定位后数据
				var address = '';
				var parts = ['country', 'province', 'city', 'district', 'town', 'street', 'streetNumber'];
				for(var part_index in parts) {
					if(typeof(result.detail.addressComponents[parts[part_index]]) != 'undefined') {
						address += result.detail.addressComponents[parts[part_index]];
					}
				}
				options.corporation_address = address; //变更后使用解析的地址
				
				console.log('123123');
				console.log(JSON.stringify(result.detail));

				$("#lat").val(result.detail.location.lat);
				$("#lng").val(result.detail.location.lng);
				options.lat = result.detail.location.lat;
				options.lng = result.detail.location.lng;
				options.addressComponents = result.detail.addressComponents;
				$('#corporation_address').val(options.corporation_address);
				$('#corporation_address_components').val(JSON.stringify(options.addressComponents));
				/*提示框内容设定*/
				options.loading = false;
				info.open();
				var corporation_address = options.corporation_address;
				corporation_address = corporation_address.replace(/中国/, "");
				corporation_address = corporation_address.replace(/浙江省/, "");
				corporation_address = corporation_address.replace(/温州市/, "");
				info.setContent('<div style="width:200px;height:50px;font-size:14px">' + corporation_address + '</div>');
				info.setPosition(result.detail.location);
				qq.maps.event.addListener(marker, 'click', function() {
					info.open();
					var corporation_address = options.corporation_address;
					corporation_address.replace(/中国/, "");
					corporation_address.replace(/浙江省/, "");
					corporation_address.replace(/温州市/, "");
					info.setContent('<div style="width:200px;height:50px;font-size:14px;">' + corporation_address + '</div>');
					info.setPosition(result.detail.location);
				});
			},
			error: function(err, msg) {
				alert('搜索定位失败,请手动定位或更改关键字');
			}
		});
		/*默认触发第一次定位*/
		options.loading = true;
		geocoder.getAddress(center);
		/*绑定触发的各种操作*/
		$('#searchAddress').unbind('click').bind('click', function() {
			var addresskey = $("#addresskey").val();
			if(addresskey == '') {
				alert('请输入准确地址');
				return false;
			}
			var selecta = addresskey.replace(/中国/, "");
			var selectb = selecta.replace(/浙江省/, "");
			var selectc = selectb.replace(/温州市/, "");
			console.log('中国浙江省温州市' + selectc);
			var searchcontent = '中国浙江省温州市' + selectc
			//通过getLocation();方法获取位置信息值
			geocoder.getLocation(searchcontent);
		})
		//图标点击后触发定位
		qq.maps.event.addListener(marker, 'click', function(event) {
			geocoder.getAddress(center);
		});
		//地图点击后定位新地址

		qq.maps.event.addListener(map, 'click', function(event) {
			console.log('122');

			var lat = event.latLng.getLat();
			var lng = event.latLng.getLng();
			var latLng = new qq.maps.LatLng(lat, lng);
			options.loading = true;
			geocoder.getAddress(latLng);
		});
		/*绑定搜索框事件*/
		$(options.searchElem).bind('keypress', function(event) {
			if(event.keyCode == "13") {
				var searchkey = $(options.searchElem).val();
			}
		});
		/*通用的方法*/
		/*添加标记*/
		function addMarker(location) {
			marker = new qq.maps.Marker({
				position: location,
				map: map
			});
			markersArray.push(marker);
		}
		/*清除覆盖层*/
		function clearOverlays() {
			if(markersArray) {
				for(i in markersArray) {
					markersArray[i].setMap(null);
				}
			}
		}
		/*显示覆盖层*/
		function showOverlays() {
			if(markersArray) {
				for(i in markersArray) {
					markersArray[i].setMap(map);
				}
			}
		}
		/*删除覆盖物*/
		function deleteOverlays() {
			if(markersArray) {
				for(i in markersArray) {
					markersArray[i].setMap(null);
				}
				markersArray.length = 0;
			}
		}
	}
	//	是否开放
	$(document).ready(function() {
		$('html').on('click', '.mui-switch', function(event) {
			console.log($('.mui-switch').length);
			console.log($(this).hasClass('mui-active'));
			if($(this).hasClass('mui-active')) {
				$(this).removeClass('mui-active');
				$(this).find(".is_open").val('0');
			} else {
				$(this).addClass('mui-active');
				$(this).find(".is_open").val('1');
			}
		});
	})
	$("html").on('click','.submit-btn',function(){
		var formjson = $('#submit-info').serializeObject();
		var list = [];
		var length = 0;
	
		if (typeof (formjson) == 'object') {
			if(typeof formjson.id == 'object'){
				for (var index in formjson) {
					var lengthObj = formjson[index];
					length = lengthObj.length;
				}
				console.log(length);
				var length = length;
				for (var i = 0; i < length; i++) {
					var temp = {};
					for (var index in formjson) {
						temp[index] = formjson[index][i];
					}
					list.push(temp);
				}
			}else{
				list.push(formjson);
			}
		} else {
			alert('数据有误');
		}
		
		filesubmit(list);
	});
})

//图片上传	
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
                page.imgUp();
            })
              
        }
        var page=null;
        page={
            imgUp:function(){
                var m=this;  
                plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
                    {title:"拍照"},  
                    {title:"从相册中选择"}
                ]}, function(e){//1 是拍照  2 从相册中选择  
                	console.log(e.index);
                    switch(e.index){  
                        case 1:
                        	appendByCamera();
                        	break;
                        case 2:
                        appendByGallery();
                        break;
                    }  
                });  
            }
            //摄像头  
        }

        // 拍照添加文件
        function appendByCamera(){
        	var cmr = plus.camera.getCamera(1);
        	var res = cmr.supportedImageResolutions[0];
		    var fmt = cmr.supportedImageFormats[0];
		    cmr.captureImage( function(p){
		    	plus.io.resolveLocalFileSystemURL(p, function(entry){
		            setImg(entry.toLocalURL());
		        }, function(e){});
		    }, function(e){},{index:1,filename:"_doc/camera/"});

        }
        // 从相册添加文件
        function appendByGallery(){
            plus.gallery.pick(function(path){
            	console.log(path);
//              that.find(".imgsrc").attr("src",path);
                upload(path);
            });
        }
        function setImg(src){
        	console.log(src);
//      	that.find(".imgsrc").attr("src",src);
        	upload(src);
		}
          
        //服务端接口路径
        var server = rooturl+"index.php/Api/Apps/Jingkaiqu/Investigate_record_file/multiUpload";
        //获取图片元素        
        function upload(path){
        	var wt=plus.nativeUI.showWaiting();
            var task=plus.uploader.createUpload(server,
                {method:"POST",dataType: 'JSON'},
                function(t,status){ //上传完成
                    if(status==200){
                    	var res = JSON.parse(t.responseText);
                    	if(res.code && res.code == 1000){
                    		var result = res.data;
                    		console.log(JSON.stringify(result));
                    		res.data[0].note = '';
							res.data[0].is_open = '0';
							addimgdata(result);
							
//                  		window.picimg.push(res.data[0]);
                    		alert("上传成功："+res.message);
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
            var len = $(".imgsrc").length;
            task.addFile(path,{key:"file"})
            task.start();
        }
        	
        if(window.plus){ 
            plusReady();  
        }else{
            document.addEventListener("plusready",plusReady,true);
        }
        


		function addimgdata(obj){
			obj[0].rooturl = rooturl;
			var data = obj[0];			
			console.log(JSON.stringify(data));
			var adddimgTemplateScript = $("#addimg-template").html();
			var adddimgTemplate = Handlebars.compile(adddimgTemplateScript);
			var context = data;
			var adddimgCompiledHtml = adddimgTemplate(context);
			$("#imglist .mui-table-view").append(adddimgCompiledHtml);
		}
		
		
//文件上传,未完成
$("html").on('change','.fileinput',function(){
	console.log('1211');
	var url = $(".fileinput").val();
	
	plus.io.requestFileSystem( plus.io.PUBLIC_DOCUMENTS, function( fs ) {
		// 可通过fs进行文件操作 
		alert( "File system name: " + fs.name );
		// 通过fs.root获取DirectoryEntry对象进行操作 
		// fs.root 
		console.log(fs.root.toLocalURL());
		
	}, function ( e ) {
		alert( "Request file system failed: " + e.message );
	} );

//	createUpload(path);
//	IsExstsFile(path);
	
	function IsExstsFile(filespec) {
    	var fso = new ActiveXObject("Scripting.FileSystemObject");
	    if (fso.FileExists(filespec)){
	    	console.log('存在');
	    }else{
	    	console.log('不存在');
	    }
	}
})


// 创建上传任务
function createUpload(path) {
	console.log(path);
	var server = rooturl+"index.php/Api/Apps/Jingkaiqu/Investigate_record_file/multiUpload";
	var wt=plus.nativeUI.showWaiting();
    var task=plus.uploader.createUpload(server,
        {method:"POST",dataType: 'JSON'},
        function(t,status){ //上传完成
            if(status==200){
            	var res = JSON.parse(t.responseText);
            	if(res.code && res.code == 1000){
            		var result = res.data;
            		console.log(JSON.stringify(result));
            		res.data[0].note = '';
					res.data[0].is_open = '0';
					addimgdata(result);
					
      //    		window.picimg.push(res.data[0]);
            		alert("上传成功："+res.message);
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
    task.addFile(path,{key:"file"})
    task.start();
}

//文件上传
function filesubmit(content){
	console.log(accessToken);
	console.log(JSON.stringify(content));
	
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
			filelist:content
		},
		dataType: 'json',
		success: function(res) {
			$("#my-mask").hide();
			if(res.code && res.code == 1000){
				console.log(JSON.stringify(res));
				alert(res.message);
				mui.back();
				var list = plus.webview.currentWebview().opener();
				//触发父页面的自定义事件(refresh),从而进行刷新
				mui.fire(list, 'refresh');
				//返回true,继续页面关闭逻辑
				return true;
			}else{
				alert(res.message);
				console.log(JSON.stringify(res));
			}
		},
		error: function(res) {
			$("#my-mask").hide();
			console.log(res.message);
		}
	})
}
