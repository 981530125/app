$(function(){
	mui.init({
		swipeBack: false,
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			},up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	window.isopenshort = 'false';
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		console.log(accessToken);
		setTimeout(function() {
			getmyshort();
		}, 1000);
		mui('#pullrefresh').pullRefresh().refresh(true);
	}
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		window.pullup = 'true';
		setTimeout(function() {
//			var page = waitcount//参数为true代表没有更多数据了。
			var searchkey = $('.searchkey').val();
			if(taskType){
				var taskType = taskType;
			}else{
				var taskType = 'wait';
			}
//			getmytask(taskType,page,searchkey,'');
		}, 3000);
	}
	
	
	mui.plusReady(function() {
		getmyshort();
		getmytype();
	})
	
	$('html').on('click','.post',function(){
		getmyshort();
	})
	
	function getmyshort(page,start,end,searchkey,ownerTypeSelect,templateTypeSelect){
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		if(ownerTypeSelect){
			var ownerTypeSelect = ownerTypeSelect;
		}else{
			var ownerTypeSelect = 'all';
		}
		if(templateTypeSelect){
			var templateTypeSelect = templateTypeSelect;
		}else{
			var templateTypeSelect = '';
		}
		
		var url = rooturl + 'index.php/api/apps/jingkaiqu/Fillin_template/pageData'; //获取账号中心首页
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				loginway:loginway,
				start: start,
				end: end,
				searchkey: searchkey,
				page: page,
				num: 10,
				ownerTypeSelect: ownerTypeSelect,
				templateTypeSelect: templateTypeSelect
			},
			type: 'post',
			dataType: 'json',
			crossDomain: true,
			cache: true,
			beforeSend: function(xhr) { //beforeSend定义全局变量
				xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
			},
			success: function(res) {
				if(res.code && res.code == 1000) {
//					var contenttpl = $("#tolist-template").html();
//					// 编译模板
//					var rcontenttp = Handlebars.compile(contenttpl);
//					var data = res.data;
//					// 把数据传送到模板
//					var noticeCompiledHtml = rcontenttp(data);
//				    $('#all').html(noticeCompiledHtml);
				    
				    //快捷输入列表
				    var contenttpl = $("#poplist-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = res.data;
					// 把数据传送到模板
					var noticeCompiledHtml = rcontenttp(data);
				    $('#inputpop').html(noticeCompiledHtml);
				    mui('#pullrefresh').pullRefresh().endPulldown();
				}else{
					mui.toast(res.message);
					mui('#pullrefresh').pullRefresh().endPulldown();
				}
			},
			error: function(res) {
				console.log(res.data);
				mui.toast(res.message);
			}
		})
	}
	
	//获取列表类型
	function getmytype(page,start,end,searchkey){
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		var url = rooturl + 'index.php/api/apps/jingkaiqu/Fillin_template_type/allData'; //获取账号中心首页
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
				if(res.code && res.code == 1000) {
//					var contenttpl = $("#tolist-template").html();
//					// 编译模板
//					var rcontenttp = Handlebars.compile(contenttpl);
//					var data = res.data;
//					// 把数据传送到模板
//					var noticeCompiledHtml = rcontenttp(data);
//				    $('#all').html(noticeCompiledHtml);
				    
				    //快捷输入列表
				    var contenttpl = $("#poptype-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = res.data;
					// 把数据传送到模板
					var noticeCompiledHtml = rcontenttp(data);
				    $('#classify').html(noticeCompiledHtml);
				    mui('#pullrefresh').pullRefresh().endPulldown();
				}else{
					mui.toast(res.message);
					mui('#pullrefresh').pullRefresh().endPulldown();
				}
			},
			error: function(res) {
				console.log(res.data);
				mui.toast(res.message);
			}
		})
	}
	
//	模板归属
	$('html').on('change','#myselecttype',function(){
		var selecttype = $(this).val();
		var templateTypeSelect = $('#classify option:selected').val();
		getmyshort('','','','',selecttype,templateTypeSelect);
	})
	
//	筛选分类
	$('html').on('change','#classify',function(){
		var templateTypeSelect = $(this).val();
		var selecttype = $('#myselecttype option:selected').val();
		getmyshort('','','','',selecttype,templateTypeSelect);
	})
	
	
	
	$('html').on('click','.editshortcut',function(){
		console.log('打开编辑');
		mui.openWindow({
		    url:'shortlist.html'
		});
	})
	
//			默认添加快捷按钮
	var $li_1 = $("<div class='myshortcut'>快捷输入</div>");
	$('body').append($li_1);
	$('html').on('click','input',function(){
		var type = $(this).attr('type');
		//判断是否存在noshortcut，如果存在不进行快捷输入
		if(!$(this).hasClass('noshortcut')){
			switch(type)
			{
			case 'text':
				var winHeight = $(window).height();
				$(window).resize(function(){
					var thisheight = $(this).height();
					if(winHeight - thisheight >50){
						//键盘弹出
						$('#pullrefresh').addClass('bodytoheight');
						$('.myshortcut').show();
						console.log('弹出');
					}else{
						//键盘收起
						$('#pullrefresh').removeClass('bodytoheight');
						$('.myshortcut').hide();
						console.log('收起');
					}
					mui('#pullrefresh').pullRefresh().setStopped(true);
				});
				$('.mypop').hide();
				var that = $(this);
				window.shortarr = that;
			 	break;
			default:
			  break;
			}
		}else{
			$('.myshortcut').hide();
		}
	})
	
	$('html').on('click','.myshortcut',function(){
		//弹出快捷输入
		window.isopenshort = 'right';
		document.activeElement.blur();
		$('.mypop').show();
	})
	
	$('html').on('click','.toimport',function(){
		var value = $(this).html();
		document.activeElement.focus();
		var currentval = window.shortarr.val();
		window.shortarr.val(currentval+value);
		window.shortarr.focus();
		$('.mypop').hide();
	})
	
	$('html').on('click','.tokeyset',function(){
		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
		window.shortarr.focus();
		$('.mypop').hide();
	})
})
