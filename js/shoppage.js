$(function(){

	$('.all-li').click(function() {
		console.log($(this).attr('data-id'));
		var id = $(this).attr('data-id');
		console.log($(".menulist").length);
		console.log(clientType);
		gettypeitem(id);
	});
	
	//查看表单
	getformdetail = function(id,record_id){
		var objinfo = {};
		console.log(id);
//	 	console.log(JSON.stringify(window.allifo));
	 	var allinfo = window.allifo;
	 	for(var n = 0;n< allinfo.length;n++){
	 		if(allinfo[n].id == id){
	 			var investigate_record = allinfo[n].investigate_record;
	 			for(var i = 0;i<investigate_record.length;i++){
	 				if(investigate_record[i].id == record_id){
	 					objinfo = investigate_record[i]
	 				}
	 			}
	 		}
	 	}
//	 	var obj = 
		var enname = 'small_workshop_name';
		mui.openWindow({
		    url:'checkform.html',   
		    id:'checkform',
		    extras: {objinfo:objinfo}
		});
		
	}
	
	//获取检查记录
	function getmenu(shopCategoryId){
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = ''
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_task/getInvestigateTaskByShopId';
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
				shopId: shopCategoryId,
				page: 'all',
				num: 'all'
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var datainfo = res.data;
					if(datainfo){
						var forminfo = res.data.data;
						var infoarr = []
						if(userType == 'user'){
							for(var i = 0;i< forminfo.length;i++){
								if(forminfo[i].is_open == 1){
									infoarr.push(forminfo[i]);
								}
							}
							res.data.data = infoarr;
						}
						var datainfo = res.data;
						window.allifo = res.data.data;
						var node = '';
						var recordTemplateScript = $("#record-template").html();
						var recordtheTemplate = Handlebars.compile(recordTemplateScript);
						var context = datainfo;
						var recordtheCompiledHtml = recordtheTemplate(context);
						$("#records").html(recordtheCompiledHtml);
					}else{
						res.data = '';
						var datainfo = res.data;
						var recordTemplateScript = $("#record-template").html();
						var recordtheTemplate = Handlebars.compile(recordTemplateScript);
						var context = datainfo;
						var recordtheCompiledHtml = recordtheTemplate(context);
						$("#records").html(recordtheCompiledHtml);
					}
					console.log(JSON.stringify(datainfo));
					
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log('请求失败');
			}
		});
	}
	
	//商家信息
	function getsellerinfo(shopCategoryId){
		console.log(mobile);
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = '';
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByShopId';
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
				shopId: shopCategoryId
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var datainfo = res.data;
					var opentime = datainfo.shop_open_range;
					console.log(opentime);
					var arropen = [];
					var allopen = [];
					var wday = [];
					var infoopen = [];
					var num = 0;
					if(opentime){
						for(var n = 0;n<opentime.length;n++){
							var start = opentime[n].open_time;
							var end = opentime[n].close_time;
							var open = start.substring(0,5) +'-'+ end.substring(0,5);
							var arritem = {
								open: open,
								day: opentime[n].day_of_week
							}
							arropen.push(arritem);
							allopen.push(open);
						}
	
						 var arr = allopen;
						 var result = [];
						for(var i = 0; i < arr.length; i++)
					    {
					        //如果在结果数组result中没有找到arr[i],则把arr[i]压入结果数组result中
					        if (result.indexOf(arr[i]) == -1){
					        	result.push(arr[i]);
					        }
					    }
						for(var c = 0;c<result.length;c++){
							for(var q = 0;q<arropen.length;q++){
								if(arropen[q].open == result[c]){
									if(wday[c]){
										wday[c] = wday[c]+','+arropen[q].day;
									}else{
										wday[c] = arropen[q].day;
									}
								}
							}
							if(wday[c] == "1,2,3,4,5"){
								wday[c] = '工作日';
							}
							if(wday[c] == "6,7"){
								wday[c] = '双休日';
							}
							var weekday = {
								open: result[c],
								day: wday[c]
							}
							infoopen.push(weekday);
						}
					}else{
						infoopen = '';
					}
					datainfo.rooturl = rooturl;
					datainfo.wekday = infoopen;
					var node = '';
					var sellerTemplateScript = $("#seller-template").html();
					var sellerTemplate = Handlebars.compile(sellerTemplateScript);
					var context = datainfo;
					var theselllerHtml = sellerTemplate(context);
					$("#sellerinfo").html(theselllerHtml);
					//店铺名
					console.log(JSON.stringify(datainfo.corporation_name));
					var nameTemplateScript = $("#shopname-template").html();
					var nameTemplate = Handlebars.compile(nameTemplateScript);
					var name = datainfo;
					var thenameHtml = nameTemplate(context);
					$(".shopname").html(thenameHtml);
					//店铺活动
					var activityTemplateScript = $("#activity-template").html();
					var activityTemplate = Handlebars.compile(activityTemplateScript);
					var activity = datainfo.shop_activity;
					var arractivity = [];
					for(var a = 0;a< activity.length;a++){
						arractivity[a] = '满'+activity[a].over_price+'减'+activity[a].discount;
						
					}
					acitivitystring = arractivity.join(',');
					var action = {
						acitivitystring: acitivitystring
					}
					var theactivityHtml = activityTemplate(action);
					$(".favourable").html(theactivityHtml);
					
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log('请求失败');
			}
		});
	}
	//根据id切换选项卡
	function gettypeitem(id){
		var len = $(".menulist").length;
		for(var n = 0;n<len;n++){
			$(".menulist").eq(n).hide();
		}
		$(".menulist").eq(id).show();
		$('.all-li').eq(id).siblings('.all-li').removeClass('all-active');
		$('.all-li').eq(id).addClass('all-active');	
	}
	
	$(".choose-form").click(function(){
		console.log('1212');
	})
	//商家商品列表
	function getshopgoodlist(shopCategoryId){
		console.log(mobile);
		console.log(userType);
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = ''
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_goods/getShopGoodsByShopId';
		$.ajax({
			url: url,
			type: "post",
			async: true,
			data: {
				mobile: mobile,
				userType: userType,
				clientType: clientType,
				clientId: clientId,
				accessToken: accessToken,
				shopId: shopCategoryId
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var datainfo = res;
					var goodsTemplateScript = $("#goods-template").html();
					var goodsTemplate = Handlebars.compile(goodsTemplateScript);
					var context = datainfo;
					var thegoodsHtml = goodsTemplate(context);
					$("#goodslist").html(thegoodsHtml);
				} else {
					console.log(res.message);
					res.data = '';
					var datainfo = res;
					var goodsTemplateScript = $("#goods-template").html();
					var goodsTemplate = Handlebars.compile(goodsTemplateScript);
					var context = datainfo;
					var thegoodsHtml = goodsTemplate(context);
					$("#goodslist").html(thegoodsHtml);
				}
			},
			error: function(res) {
				console.log('请求失败');
			}
		});
	}
	

//获取参数
mui.plusReady(function(){
    var self = plus.webview.currentWebview();
	var shopid = self.shopid;
	var type = self.type;
	getshopgoodlist(shopid);
	//获取监管任务
	getmenu(shopid);
	//获取商家类型
	getsellerinfo(shopid);
	//对应类型
	gettypeitem(type);

});

//临时调用
//	getmenu();
//gettypeitem(1);




})