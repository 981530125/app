$(function(){
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
	})
	
	$('html').on('click','.btn-return',function(){
		mui.back();
	})
	
	$('html').on('click','.btn-delete',function(){
		var id = $(this).attr('data-id');
		deletetask(id);
	})
	
	//日期时间选择器，公用
	$('html').on("click", '.time', function() {
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "date", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			that.html(e.value);
			that.parent().find('input').val(e.value);
		});
	});
	
	
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
		var id = $('.id').val();
		var title = $('.title').val();
		var check_times = $('.check_times').val();
		var content = $('.content').val();
		var check_start_at = $('.check_start_at').val();
		var check_end_at = $('.check_end_at').val();
		var note = $('.note').val();
		
		edittask(id,title,content,check_start_at,check_end_at,check_times,note);
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
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function() {
						mui.back();
						var list = plus.webview.currentWebview().opener();
						//触发父页面的自定义事件(refresh),从而进行刷新
					  	mui.fire(list, 'refresh',{
								reload:'true'
						});
					  	//返回true,继续页面关闭逻辑
						return true;
					}, 500);
					
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
//	编辑
	function edittask(id,title,content,check_start_at,check_end_at,check_times,note){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Announcement/editData';
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
				title:title,
				content:content,
				check_start_at:check_start_at,
				check_end_at:check_end_at,
				check_times:check_times,
				note:note,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					mui.toast(res.message,{ duration:'long', type:'div' });
					plus.webview.close("recorddetail", "none");
					setTimeout(function() {
						mui.back();
						var list = plus.webview.currentWebview().opener();
						//触发父页面的自定义事件(refresh),从而进行刷新
					  	mui.fire(list, 'refresh',{
							reload:'true',
							prev:'true'
						});
					  	//返回true,继续页面关闭逻辑
						return true;
					}, 500);
					
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
