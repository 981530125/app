$(function(){
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
		var license_id = self.license_id;
		getshopinfo(license_id);
	});
	
	function getshopinfo(licenseId){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId';
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
				licenseId: licenseId,
				check_level:'',
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				console.log(JSON.stringify(res));
				
				var theTemplateScript = $("#example-template").html();
				var theTemplate = Handlebars.compile(theTemplateScript);
				var context = res.data;
				var theCompiledHtml = theTemplate(context);
				$("#shoplist").html(theCompiledHtml);
			},
			error: function(res) {
				console.log(res.message);
			}
		});
	}
	
	//查看详情
	$('html').on('click','.lookdetail',function(){
		var licenseid = $(this).attr('data-licenseid');
		var id = $(this).attr('data-id');
		//	证书id
		mui.openWindow({
		    url: '../shop/ShopPage.html',
		    extras:{
				license_id: licenseid,
				shopid: id,
				type: 2
			}
		});
	})
	
	//监管记录
	$('html').on('click','.record-style',function(){
		var licenseid = $(this).attr('data-licenseid');
		var id = $(this).attr('data-id');
		//	证书id
		mui.openWindow({
		    url: '../shop/ShopPage.html',
		    extras:{
		    	license_id: licenseid,
				shopid: id,
				type: 1
			}
		});
	})

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
		      bottom:'51px',//新页面底部位置
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
})
