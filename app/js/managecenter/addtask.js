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
	//	添加
	window.addEventListener("selectman", function(e) {
		//选择辖区后返回获取辖区id，筛选
		//调用模板引擎
		window.namelist = e.detail.cityName;
		window.allshoplist = [];
		var type = e.detail.type;
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
		
		if(e.detail.type == 'shop'){
			if(window.allshoplist.length>0){
				var context = window.allshoplist;
			}else{
				var context = window.namelist;
				console.log(JSON.stringify(context));
			}
			var allcontent = {
				rooturl:rooturl,
				context:context
			}
			window.shoplist = allcontent;
			var managenamelistHtml = managenamelistTemplate(allcontent);
			$("#shopnamelist").html(managenamelistHtml);
		}
		if(e.detail.type == 'admin'){
			var context = window.namelist;
			window.sendee = window.namelist;
			var managenamelistHtml = managenamelistTemplate(context);
			$("#managenamelist").html(managenamelistHtml);
		}
	})
	
//	删除企业
	function dete(obj,iden,type){
		if(type == 'shop'){
			var namearr = obj;
			var namearr = obj.context;
			var rooturl = obj.rooturl;
		}
		if(type == 'admin'){
			var namearr = obj;
		}
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
		
		if(type == 'shop'){
			var list = {
				context:arrs,
				rooturl:rooturl
			}
			return list;
		}
		if(type == 'admin'){
			return arrs;
		}
	}
	
	$('html').on('click','.deletecheckman',function(){
		console.log('12121');
		console.log(JSON.stringify($(this).attr('data-id')));
		var iden = $(this).attr('data-id');
		var type = $(this).attr('data-type');
		console.log(JSON.stringify($(this).attr('data-type')));
		var currenttype = $(this).attr('data-type');
		if(currenttype == 'shop'){
			console.log(JSON.stringify(window.shoplist));
			window.shoplist = dete(window.shoplist,iden,type);
			console.log('修改后');
			console.log(JSON.stringify(window.shoplist));
			
			var allcontent = window.shoplist;
			var managenamelistTemplateScript = $("#shoplist").html();
			var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
			var managenamelistHtml = managenamelistTemplate(allcontent);
			$("#shopnamelist").html(managenamelistHtml);
			
		}
		if(currenttype == 'admin'){
			console.log(JSON.stringify(window.sendee));
			window.sendee = dete(window.sendee,iden,type);
			console.log('修改后');
			console.log(JSON.stringify(window.sendee));
			var context = window.sendee;
			var managenamelistTemplateScript = $("#namelist").html();
			var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
			var managenamelistHtml = managenamelistTemplate(context);
			$("#managenamelist").html(managenamelistHtml);
			
		}
	})
	
	
//	当前时间
	function getNow(s) {
	    return s < 10 ? '0' + s: s;
	}
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();
		
	var now = year+'-'+getNow(month)+"-"+getNow(date);
	
	window.now = now;
	var time = $('.time');
	for(var a = 0;a<time.length;a++){
		time.eq(a).html(window.now);
		time.eq(a).parent().find('input').val(window.now);
	}
	
	
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
	
//	点击企业
	$('html').on('click','.shopselect',function(){
		var tourl = '../newrecord/offcanvas-drag-left-plus-main.html';
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
	})
	
	//获取管理员列表,接收人
	$("html").on('click', '.getman', function(event) {
		window.namelist = [];
		mui.openWindow({
			url: '../../message/selectdome.html',
			id: 'selectdome',
			extras: {
				"receive_admin_group": window.namelist
			}
		});
		event.stopPropagation();
	})
	
	
	
	//点击选择辖区
	$('html').on('click','.jurisarea',function(){
		getjurisdiction(area_id);
		
	});
	
	//按管理员辖区id,获取辖区
	function getjurisdiction(areaId){
		var url = rooturl+'index.php/Api_apps/getAreaTree';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				areaId:areaId,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					var jlist = JSON.stringify(res.data);
					mui.openWindow({
					    url: '../setbusiness/areaselect.html',
					    id: 'areaselect.html',
					    extras:{
					    	jlist: jlist
						}
					});
				}else{
					mui.alert(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
//	辖区选择返回的值
	window.addEventListener("changeCity", function(e) {
		//选择辖区后返回获取辖区id，筛选
		if(e.detail.data = 'true'){
	        $(".jurisarea").html(e.detail.currentname);
	        $(".area_group_ids").val(e.detail.areaid);
		}
    })
	
	function gettime(){
		var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
		mui.fire(list, 'refresh',{
			reload:'true'
		});  //返回true,继续页面关闭逻辑
		mui.back();
		mui.toast(res.message,{ duration:'long', type:'div' });				
	}
	
	
//	提交新建任务
	$('html').on('click','.submit-btn',function(){
		var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新		
		var taskinfo = $('#newtask').serializeObject();
		if(typeof(taskinfo.license_group_ids)=="object"){
			var licenseid = taskinfo.license_group_ids.join(',');
		}else{
			var licenseid = taskinfo.license_group_ids;
		}
		
		if(typeof(taskinfo.receive_admin_group_ids)=="object"){
			var adminid = taskinfo.receive_admin_group_ids.join(',');
		}else{
			if(taskinfo.receive_admin_group_ids == '-1'){
				var adminid  = '';
			}else{
				var adminid = taskinfo.receive_admin_group_ids;
			}
		}
		
		if(typeof(taskinfo.received_shop_id)=="string" && taskinfo.received_shop_id == '-1'){
			var licenseid  = '';
		}
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Announcement/insertData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				title: taskinfo.title,
				content: taskinfo.content,
				check_start_at: taskinfo.check_start_at,
				check_end_at: taskinfo.check_end_at,
				check_times: taskinfo.check_times,
				area_group_ids: taskinfo.area_group_ids,
				license_group_ids:licenseid,
				receive_admin_group_ids:adminid,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					//获取证书
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function(){
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						mui.back();
					},1000);
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
				
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	})
	
})
