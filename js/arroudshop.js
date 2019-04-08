$(function() {
	var pulldown = 'true';
	mui.init({
		swipeBack: false,
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh,
				auto: false
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			pulldown = 'true';
			getshop();
//			var table = document.body.querySelector('.mui-table-view');
//			var cells = document.body.querySelectorAll('.mui-table-view-cell');
//			for(var i = cells.length, len = i + 3; i < len; i++) {
//				var li = document.createElement('li');
//				li.className = 'mui-table-view-cell';
//				li.innerHTML = '<a class="mui-navigate-right">Item ' + (i + 1) + '</a>';
//				//下拉刷新，新纪录插到最前面；
//				table.insertBefore(li, table.firstChild);
//			}
//			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1000);
	}
	var count = 2;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		setTimeout(function() {
			pulldown = 'false';
			console.log('这里是下拉');
			var type = $("#type").val();
			var searchkey = $("#search").val();
			var orderBy = '';
			getshop(type,searchkey,orderBy,count);
//			shopCategoryId,searchkey,orderBy,page
//			mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
//			var table = document.body.querySelector('.mui-table-view');
//			var cells = document.body.querySelectorAll('.mui-table-view-cell');
//			for(var i = cells.length, len = i + 20; i < len; i++) {
//				var li = document.createElement('li');
//				li.className = 'mui-table-view-cell';
//				li.innerHTML = '<a class="mui-navigate-right">Item ' + (i + 1) + '</a>';
//				table.appendChild(li);
//			}
		}, 1000);
	}
	
//	搜索附近店铺
	$("html").on('click','#search-btn',function(event){
		var searchkey = $('#search').val();
		var type = $("#type").val();
		var orderBy = '';
		var count = '';
		getshop(type,searchkey,orderBy,count);
		event.stopPropagation();
	})
	
	
	
	//列表
//获取店铺类型
	function menulist() {
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_category/allData';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var typelist = res.data;
					var levellist = [];
					for(var l= 0;l<typelist.length;l++){
						if(typelist[l].root_level == 1 ||typelist[l].root_level == 2){
							levellist.push(typelist[l]);
						}
					}
					
					res.data = levellist;
					var node = '';
					var menuTemplateScript = $("#menu-template").html();
					var menuTemplate = Handlebars.compile(menuTemplateScript);
					var context = res;
					var menuCompiledHtml = menuTemplate(context);

					$("#menu-list").append(menuCompiledHtml);
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log('333');
			}
		});
	}
	//获取周边店铺
	function getshop(shopCategoryId,searchkey,orderBy,page) {

		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = ''
		}
		if(searchkey){
			searchkey = searchkey;
		}else{
			searchkey = ''
		}
		if(orderBy){
			orderBy = orderBy;
		}else{
			orderBy = ''
		}
		if(page){
			page = page;
		}else{
			page = 1;
		}
		console.log(page);
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Map/surroundingLicenseShop';
		$.ajax({
			type: "post",
			url: url,
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				lat: mylatitude,
				lng: mylongitude,
				shopCategoryId: shopCategoryId,
				searchkey:searchkey,
				orderBy:orderBy,
				latRange:0.1,
				lngRange:0.1,
				page:page,
				num:10,
				areaId:'',
				selectAllLicenseType:'',
				licenseType:'',
				check_level:''
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					console.log(Math.ceil(res.data.count/10));
					window.count = Math.ceil(res.data.count/10);
					
					var node = '';
					var theTemplateScript = $("#example-template").html();
					var theTemplate = Handlebars.compile(theTemplateScript);
					var context = res.data;
					var theCompiledHtml = theTemplate(context);
					if(pulldown == 'true'){
						$("#shoplist").html(theCompiledHtml);
						mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					}else{
						console.log(pulldown);
						$("#shoplist").append(theCompiledHtml);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > window.count));
					}
					mui.toast(res.message,{ duration:'long', type:'div' });
				} else {
					var noneTemplateScript = $("#noneinfo-template").html();
					var noneTemplate = Handlebars.compile(noneTemplateScript);
					var context = res.message;
					var noneCompiledHtml = noneTemplate(context);
					$("#shoplist").html(noneCompiledHtml);
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		});
	}
	menulist();
	getshop();
	//通过店铺类型获取周边商家
	mui('.mui-scroll').on('tap','.mui-control-item:not(.mui-active)',function(){
		console.log(this.getAttribute('data-type'));
		var type = this.getAttribute('data-type');
		if(type == '1'){
			type = 0;
		}
		$("#type").val(type);
		var searchkey = $("#search").val();
		var orderBy = '';
		getshop(type,searchkey,orderBy,1);
//      mui('.mui-slider').slider().gotoItem(this.getAttribute('data-id'));
    });
    //底部跳转至中心
	
})
function skipbottom(){
	console.log(userType);
	if(userType == 'user'){
		console.log('个人中心');
		var skipurl = 'Individualcenter.html';
	}
	if(userType == 'admin'){
		console.log('管理中心');
		var skipurl = 'managecenter.html';
	}
	if(userType == 'shop'){
		console.log('商家中心');
		var skipurl = 'shopcenter.html';
	}
	console.log(skipurl);
	window.location.href=skipurl;
}
//查看详情
function lookdetail(license_id,id){
//	证书id
	mui.openWindow({
	    url: '../shop/ShopPage.html',
	    extras:{
			license_id: license_id,
			shopid: id,
			type: 0
		}
	});
//	mui.openWindow({
//	    url: '../shop/ShopPage.html',
//	    extras:{
//			shopid: id,
//			type: 2
//		}
//	});
}
//监管记录1
function writerecords(license_id,id){
//	证书id
	mui.openWindow({
	    url: '../shop/ShopPage.html',
	    extras:{
	    	license_id: license_id,
			shopid: id,
			type: 1
		}
	});
//	mui.openWindow({
//	    url: '../shop/ShopPage.html',
//	    extras:{
//			shopid: id,
//			type: 1
//		}
//	});
	console.log(id);
}

//添加点击事件
$('html').on('click', '.nav-path', function(e) {
	var lat = $(this).children(".way-lat").val();
	var lng = $(this).children(".way-lng").val();

	var self = plus.webview.currentWebview();
	var opener = self.opener();
	//此句调用父页面js
	opener.evalJS('gohome('+lat+','+lng+')');
});