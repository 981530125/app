$(function() {
	//获取跳转参数	
	var pulldown = 'true';
	mui.init({
		swipeBack: false,
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
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
		}, 1000);
	}
	
//	搜索附近店铺
	$("html").on('click','#search-btn',function(event){
		var searchkey = $('#search').val();
		var type = $("#type").val();
		var orderBy = '';
		var count = '';
		$("#my-mask").show();
		getshop(type,searchkey,orderBy,count);
		event.stopPropagation();
	})
	
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
				check_level:'',
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					
					console.log(JSON.stringify(res.data.data[1]));
					
					console.log(Math.ceil(res.data.count/10));
					window.count = Math.ceil(res.data.count/10);
					res.data.rooturl = rooturl;
					
			        var allarr = res.data.data;
					var activityarr = [];
					var activitystring = '';
					for(var itema in allarr){
						if(allarr[itema].shop_activity == null){
							var activitystring = '暂无活动';
						}else{
							var shop_activity = allarr[itema].shop_activity;
							for(var action in shop_activity){
								console.log(JSON.stringify(shop_activity[action]));
								var stringaction = '满'+shop_activity[action].over_price+'减'+shop_activity[action].discount;
								activityarr.push(stringaction);
							}
							var activitystring = activityarr.join(',');
						}
						allarr[itema].stringactitvity = activitystring;
					}
					
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
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
				$("#my-mask").hide();
			},
			error: function(res) {
				$("#my-mask").hide();
				mui.alert(res.message);
			}
		});
	}
//	menulist();
//	getshop();
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
			type: 2
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
//$('html').on('click', '.nav-path', function(e) {
//	var lat = $(this).children(".way-lat").val();
//	var lng = $(this).children(".way-lng").val();
//	var self = plus.webview.currentWebview();
//	var opener = self.opener();
//	//此句调用父页面js
//	opener.evalJS('gohome('+lat+','+lng+')');
//});

//添加点击事件
$('html').on('click', '.nav-path', function(e) {
	var lat = $(this).children(".way-lat").val();
	var lng = $(this).children(".way-lng").val();
	var licenseId = $(this).children("#way-id").val();
	var cropname = $(this).children("#way-name").val();
	
	var tourl = '../mappilot/mappilot.html';
	mui.openWindow({
	    url:tourl,
	    id:tourl,
	    styles:{
	      top: '0',//新页面顶部位置
	      bottom:'0',//新页面底部位置
	    },
	    extras:{
	    	lat:lat,
	    	lng:lng,
	    	licenseId:licenseId,
	    	cropname:cropname
	      //自定义扩展参数，可以用来处理页面间传值1
	    },
	    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    show:{
	      autoShow:true,//页面loaded事件发生后自动显示，默认为true
	      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
	      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
	    }
	})
});