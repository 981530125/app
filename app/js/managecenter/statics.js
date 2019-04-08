$(function(){
	//	下拉刷新
    window.pulldown = 'false';
    window.pullup = 'false';
    
	mui.init({
		pullRefresh: {
			container: '#refreshlist',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	window.page = 2;
	function pullupRefresh() {
		window.pullup = 'true';
		mui('#refreshlist').pullRefresh().endPullupToRefresh(true);
		return false;
		setTimeout(function() {
			//			获取时间
			var start = $('.start').val();
			if(start){
				var start = start;
			}else{
				var start = '';
			}
			var end = $('.end').val();
			if(start){
				var end = end;
			}else{
				var end = '';
			}
			//		获取搜索内容
			var searchkey = $('.search-key').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
	//		证书筛选
			if($("option:selected",'#selectype').val() == ''){
				var selectype = '';
				var selectAllLicenseType = true;
			}else{
				var selectype = $('#userResult').attr('data-type');
				var selectAllLicenseType = false;
				var selectarr = window.license;
				var allselecttype = [];
				var alljson = {};
				for(var m = 0;m<selectarr.length;m++){
					var typejson = {};
					if(selectarr[m].value == selectype){
						var typejson = {
							[selectarr[m].value]:'true'
						}
					}else{
						var typejson = {
							[selectarr[m].value]:'false'
						}
					}
					alljson = $.extend(alljson, typejson);
				}
				var allselecttypestring = JSON.stringify(alljson);
			}
			geteasydata(start,end,searchkey,window.page,allselecttypestring);
		}, 1500);
	}
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		setTimeout(function() {
//			getCertificateType();
			geteasydata();
//			getmessage('','','',1,'');
		}, 1500);
	}
	
	//	获取参数
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		window.licensetype = self.licensetype;
	})
	
	//日期时间选择器，公用
	$('html').on("click", '.time', function() {
		mui('#refreshlist').pullRefresh().setStopped(true);//暂时禁止滚动
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "date", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			mui('#refreshlist').pullRefresh().setStopped(true);//暂时禁止滚动
			that.find('span').html(e.value);
			that.find('input').val(e.value);
			
//			获取时间
			var start = $('.start').val();
			if(start){
				var start = start;
			}else{
				var start = '';
			}
			var end = $('.end').val();
			if(start){
				var end = end;
			}else{
				var end = '';
			}
			//		获取搜索内容
			var searchkey = $('.search-key').val();
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
	//		证书筛选
			if($("option:selected",'#selectype').val() == ''){
				var selectype = '';
				var selectAllLicenseType = true;
			}else{
				var selectype = $('#userResult').attr('data-type');
				var selectAllLicenseType = false;
				var selectarr = window.licensetype;
				var allselecttype = [];
				var alljson = {};
				for(var m = 0;m<selectarr.length;m++){
					var typejson = {};
					if(selectarr[m].value == selectype){
						var typejson = {
							[selectarr[m].value]:'true'
						}
					}else{
						var typejson = {
							[selectarr[m].value]:'false'
						}
					}
					alljson = $.extend(alljson, typejson);
				}
				var allselecttypestring = JSON.stringify(alljson);
			}
			geteasydata(start,end,searchkey,'',allselecttypestring);
		});
		mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
	  		mui('#refreshlist').pullRefresh().setStopped(false);//开启禁止滚动
		})
	  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
	  		mui('#refreshlist').pullRefresh().setStopped(false);//开启禁止滚动
		})
	  	mui("body").on('tap','.mui-backdrop',function(){
	  		mui('#refreshlist').pullRefresh().setStopped(false);//开启禁止滚动
		})
	});
	
	//	点击企业
	$('html').on('click','#shopselect',function(){
		
		console.log('1212');
		
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
	
	
	$('html').on('tap','.search-btn',function(){
//		获取搜索内容
		var searchkey = $('.search-key').val()
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		
		//			获取时间
		var start = $('.start').val();
		if(start){
			var start = start;
		}else{
			var start = '';
		}
		var end = $('.end').val();
		if(start){
			var end = end;
		}else{
			var end = '';
		}
		
//		证书筛选
		if($("option:selected",'#selectype').val() == ''){
			var selectype = '';
			var selectAllLicenseType = true;
		}else{
			var selectype = $('#userResult').attr('data-type');
			var selectAllLicenseType = false;
			var selectarr = window.licensetype;
			var allselecttype = [];
			var alljson = {};
			for(var m = 0;m<selectarr.length;m++){
				var typejson = {};
				if(selectarr[m].value == selectype){
					var typejson = {
						[selectarr[m].value]:'true'
					}
				}else{
					var typejson = {
						[selectarr[m].value]:'false'
					}
				}
				alljson = $.extend(alljson, typejson);
			}
			var allselecttypestring = JSON.stringify(alljson);
		}
		geteasydata(start,end,searchkey,'',allselecttypestring);
	})
	
	
	
  	
//	获取数据
  	function geteasydata(start,end,searchkey,page,licenseType){
  		$('#my-mask').show();
  		if(page){
  			var page = page;
  		}else{
  			var page = 1;
  		}
  		if(licenseType){
  			var licenseType = licenseType;
  		}else{
  			var licenseType = '';
  		}
  		if(start){
  			var start = start;
  		}else{
  			var start = '';
  		}
  		if(end){
  			var end = end;
  		}else{
  			var end = '';
  		}
  		if(searchkey){
  			var searchkey = searchkey;
  		}else{
  			var searchkey = '';
  		}
  		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Simple_statistics/pageData'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				start:start,
				end:end,
				searchkey:searchkey,
				selectAllLicenseType:'false',
				licenseType:licenseType,
				loginway:loginway
			},
			type: 'post',
			dataType: 'json',
			cache: true,
			beforeSend: function(xhr) { //beforeSend定义全局变量
				xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
			},
			success: function(res) {
				if(res.data&&res.code == '1000'){
					console.log(JSON.stringify(res.data));
					// 抓取模板数据
					var contenttpl = $("#mydata-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = res.data;
					// 把数据传送到模板
					var text = rcontenttp(data);
					// 更新到模板
					$('#list-content').html(text);
					mui('#refreshlist').pullRefresh().endPulldownToRefresh();
					mui.toast(res.message,{ duration:'long', type:'div' });
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
					mui('#refreshlist').pullRefresh().endPulldownToRefresh();
				}
				$('#my-mask').hide();
			},
			error: function(res){
				$('#my-mask').hide();
				console.log(res.message);
			}
		})
  	}
  	
  	//弹出选择器普通示例
  	$('html').on('tap','#showUserPicker',function(){
  		mui('#refreshlist').pullRefresh().setStopped(true);//暂时禁止滚动
  		var userPicker = new mui.PopPicker();
		userPicker.setData(window.licensetype);
		var showUserPickerButton = document.getElementById('showUserPicker');
		var userResult = document.getElementById('userResult');
		userPicker.show(function(items) {
			userResult.innerText = items[0].text;
			$('#userResult').attr('data-type',items[0].value);
			var selectype = items[0].value;
			if(selectype == ''){
				var selectype = '';
				var selectAllLicenseType = true;
			}else{
				var selectype = selectype;
				var selectAllLicenseType = false;
				var selectarr = window.licensetype;
				var allselecttype = [];
				var alljson = {};
				for(var m = 0;m<selectarr.length;m++){
					var typejson = {};
					if(selectarr[m].value == selectype){
						var typejson = {
							[selectarr[m].value]:'true'
						}
					}else{
						var typejson = {
							[selectarr[m].value]:'false'
						}
					}
					alljson = $.extend(alljson, typejson);
				}
				var allselecttypestring = JSON.stringify(alljson);
			}
			
			//		获取搜索内容
			var searchkey = $('.search-key').val()
			if(searchkey){
				var searchkey = searchkey;
			}else{
				var searchkey = '';
			}
			//			获取时间
			var start = $('.start').val();
			if(start){
				var start = start;
			}else{
				var start = '';
			}
			var end = $('.end').val();
			if(start){
				var end = end;
			}else{
				var end = '';
			}
			
			geteasydata('','','','',allselecttypestring);
		});
		mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
	  		mui('#refreshlist').pullRefresh().setStopped(false);//开启禁止滚动
		})
	  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
	  		mui('#refreshlist').pullRefresh().setStopped(false);//开启禁止滚动
		})
	  	mui("body").on('tap','.mui-backdrop',function(){
	  		mui('#refreshlist').pullRefresh().setStopped(false);//开启禁止滚动
		})
  	})
})