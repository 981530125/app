$(function(){
	//	权限判断
	var rootpower = [{
			obj:'.btn-edit',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Announcement/editData',
			describe:'编辑任务'
		},{
			obj:'.btn-delete',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Announcement/deleteData',
			describe:'删除任务'
		}];
	window.addEventListener('refresh', function(e){//执行刷新  
	  if(e.detail.reload == 'true'){
	  	if(e.detail.prev == 'true'){
	  		mui.back();
			var list = plus.webview.currentWebview().opener();
			//触发父页面的自定义事件(refresh),从而进行刷新
		  	mui.fire(list, 'refresh',{
					reload:'true'
			});
		  	//返回true,继续页面关闭逻辑
			return true;
	  	}
	  	
	  }
	});
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    console.log(JSON.stringify(self.detail));
	    window.detail = self.detail;
	    console.log('121212');
	    if(typeof(self.detail) == 'undefined'){
	    	mui.toast('获取失败',{ duration:'long', type:'div' });
	    }else{
	    	mui.toast('获取成功',{ duration:'long', type:'div' });
	    }
	    var formTemplateScript = $("#mydetail-template").html();
		var formTemplate = Handlebars.compile(formTemplateScript);
		var context = self.detail;
		var formCompiledHtml = formTemplate(context);
		$("#mydetail").html(formCompiledHtml);
		
		//权限配置
		console.log('权限配置');
		for(var itemn in rootpower){
			ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
		}
	})
	
	$('html').on('click','.btn-return',function(){
		mui.back();
	})
	
	$('html').on('click','.btn-delete',function(){
		var id = $(this).attr('data-id');
		deletetask(id);
	})
	
	
	$('html').on('tap','.myshop',function(){
		var id = $(this).attr('data-id');
		var area_group = window.detail.area_group;
		for(var item in area_group){
			if(area_group[item].id == id){
				var areas = area_group[item].license_group
			}
		}
		
		var areaTemplateScript = $("#area-template").html();
		var areaTemplate = Handlebars.compile(areaTemplateScript);
		var context = areas;
		var areaCompiledHtml = areaTemplate(context);
		$("#araes").html(areaCompiledHtml);
		$('.areashop').show();
		$('#my-mui-mask').show();
		
	})
	
	$('html').on('tap','.bottom-btn',function(){
		$('.areashop').hide();
		$('#my-mui-mask').hide();
	})
	
	$('html').on('click','.btn-edit',function(){
		var tourl = 'editrecord.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	detail:window.detail
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
	
//	删除
	function deletetask(id){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Announcement/deleteData';
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
					setTimeout(function() {
						mui.toast(res.message,{ duration:'long', type:'div' });
					}, 1000);
					mui.back();
					var list = plus.webview.currentWebview().opener();
					//触发父页面的自定义事件(refresh),从而进行刷新
				  	mui.fire(list, 'refresh',{
							reload:'true'
					});
				  	//返回true,继续页面关闭逻辑
					return true;
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
})
