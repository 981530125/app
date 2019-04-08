$(function(){
	//上拉刷新
	mui.init({
		pullRefresh: {
			container: '#refreshlist',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	window.count = 1;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		setTimeout(function() {
			getmenu(window.count,window.license_id);
//			getshop('',searchkey,page,area_id,true,'','');
		}, 3000);
	}
	
	$('.all-li').click(function() {
		console.log($(this).attr('data-id'));
		var id = $(this).attr('data-id');
		console.log($(".menulist").length);
		console.log(clientType);
		gettypeitem(id);
	});
	
	//获取表类型
	function getformtype(){
		console.log('1212');
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Checklist_tables/checklistTables';
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
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					var allformlisttype = JSON.stringify(res.data);
					localStorage.setItem('allformlisttype',allformlisttype);
				} else {
					console.log(res.message);
				}
			},
			error: function(res) {
				console.log(res.message);
			}
		});
	}
	
	
	//查看表单
	getformdetail = function(id,record_id){
		var objinfo = {};
		var retype_info = [];
		var type_infos = [];
		console.log(id);
	 	var allinfo = window.allifo;
	 	for(var n = 0;n< allinfo.length;n++){
	 		if(allinfo[n].id == id){
	 			var investigate_record = allinfo[n].investigate_record;
	 			for(var i = 0;i<investigate_record.length;i++){
	 				if(investigate_record[i].id == record_id){
	 					objinfo = investigate_record[i]
	 					retype_info = allinfo[n].license.type_info;
	 				}
	 			}
	 		}
	 	}
	 	
	 	if(objinfo.checklist){
			var checklists =  objinfo.checklist;
			for(var items in checklists){
		 		var jsonarr = {
		 			cn_name:checklists[items].checklist_type.comment,
		 			en_name:checklists[items].checklist_type.en_name,
		 		}
		 		type_infos.push(jsonarr);
		 	}
		}else{
			type_infos = [];
		}
		
		console.log(JSON.stringify(objinfo));
		console.log('12121');
		if(objinfo.task){
			var type_info = objinfo.task.license.type_info;
		}else{
			if(retype_info){
				var	type_info = retype_info;
			}else{
				var type_info = {
					checklist:type_infos
				}
			}
			
		}
		
		if(objinfo.task){
			var licenseinfo = objinfo.task.license;
		}else{
			var licenseinfo = [];
		}
	 	
		var enname = 'small_workshop_name';
		mui.openWindow({
		    url:'../managecenter/checkform/shopcheckform.html',   
		    id:'checkform',
		    extras: {
		    	objinfo:objinfo,
		    	type_of:type_info,
		    	licenseinfo:licenseinfo
		    }
		});
	}
	//点击生成导航
	$('html').on('click','.myroute',function(){
		var shopinfo = window.shopinfo;
		var lat = shopinfo.lat;
		var lng = shopinfo.lng;
		var licenseId = shopinfo.license_id;
		var cropname = shopinfo.corporation_name;
		
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
		    	cropname:cropname,
		    	licenseId:licenseId
		      //自定义扩展参数，可以用来处理页面间传值1
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
		
		
	})
	
	$('html').on('tap','.openmyintrode',function(){
		var tourl = 'shopsalf.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	content:window.introduction
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
	
	//	点击生成商家二维码
	$('html').on('click','.twocode',function(){
		var tourl = '../shopcenter/twocode.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	license_id:window.license_id
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
	
	
	
	//获取检查记录
	function getmenu(page,licenseId){
		if(licenseId){
			var licenseId = licenseId;
		}else{
			var licenseId = ''
		}
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_task/getInvestigateTaskByLicenseId';
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
				page: page,
				num: 100,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					console.log(JSON.stringify(res));
					console.log('1212');
					
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
						$("#myrecordlist").html(recordtheCompiledHtml);
					}else{
						res.data = '';
						var datainfo = res.data;
						var recordTemplateScript = $("#record-template").html();
						var recordtheTemplate = Handlebars.compile(recordTemplateScript);
						var context = datainfo;
						var recordtheCompiledHtml = recordtheTemplate(context);
						$("#myrecordlist").html(recordtheCompiledHtml);
					}
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(JSON.stringify(datainfo));
					
				} else {
					if(res.data == null){
						res.data = '';
						var datainfo = res.data;
						var recordTemplateScript = $("#record-template").html();
						var recordtheTemplate = Handlebars.compile(recordTemplateScript);
						var context = datainfo;
						var recordtheCompiledHtml = recordtheTemplate(context);
						$("#myrecordlist").html(recordtheCompiledHtml);
					}
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
				console.log(res);
			}
		});
	}
	
	//根据证书id获取商家信息
	function getsellerinfo(licenseId){
		console.log(licenseId);
		if(licenseId){
			var licenseId = licenseId;
		}else{
			var licenseId = '';
		}
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
				
				if(res.code && res.code == '1000') {
					var datainfo = res.data;
					window.shopinfo = res.data;
					
					var opentime = datainfo.shop_open_range;
					console.log(JSON.stringify(opentime));
					
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
							if(wday[c] != '双休日' && wday[c] != '工作日'){
								wday[c] = '周'+wday[c];
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
					
					//商家类型
					
					if(datainfo.shop_category_crumbs == null){
						var shoptype = '无';
					}else{
						var typearr = datainfo.shop_category_crumbs;
						var shoptypearr = [];
						for(var t in typearr){
							shoptypearr.push(typearr[t].name);
						}
						var shoptype = shoptypearr.join('/');
					}
					datainfo.shoptype = shoptype;
					
				
					
					window.shopid = res.data.id;
					window.shopmobile = res.data.shop_contact;
					//店铺logo
					var shopinfoTemplateScript = $("#shopinfo-template").html();
					var shopinfoTemplate = Handlebars.compile(shopinfoTemplateScript);
					var nameinfo = datainfo;
					var shopinfoHtml = shopinfoTemplate(nameinfo);
					$("#shopinfo").html(shopinfoHtml);
					window.introduction = datainfo.introduction;
					
					var node = '';
					var sellerTemplateScript = $("#seller-template").html();
					var sellerTemplate = Handlebars.compile(sellerTemplateScript);
					var context = datainfo;
					var theselllerHtml = sellerTemplate(context);
					$("#sellerinfo").html(theselllerHtml);
					//店铺名
					var nameTemplateScript = $("#shopname-template").html();
					var nameTemplate = Handlebars.compile(nameTemplateScript);
					var name = datainfo;
					var thenameHtml = nameTemplate(name);
					$(".shopname").html(thenameHtml);
					//店铺活动
					var activityTemplateScript = $("#activity-template").html();
					var activityTemplate = Handlebars.compile(activityTemplateScript);
					var activity = datainfo.shop_activity;
					var arractivity = [];
					
					
					if(activity == null ){
						var action = {
							acitivitystring: '无'
						}
					}else{
						for(var a = 0;a< activity.length;a++){
							arractivity[a] = '满'+activity[a].over_price+'减'+activity[a].discount;
						}
						acitivitystring = arractivity.join(',');
						var action = {
							acitivitystring: acitivitystring
						}
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
	});
	
	$('html').on('click','.callphone',function(){
		var btnArray=['拨打','取消'];
		if(window.shopmobile){
			var phone = window.shopmobile;
			mui.confirm('是否拨打单位内联系方式'+phone+'?','提示',btnArray,function(e){
				if(e.index == 0){
					plus.device.dial(phone,false);
				}
			});
		}else{
			mui.alert('暂无联系方式!');
		}
	})
	
	mui('.icons').on('click','i',function(){
      	var index = parseInt(this.getAttribute("data-index"));//获取当前元素的索引值
      	var parent = this.parentNode;//获取当前元素的父节点
      	var children = parent.children;//获取父节点下所有子元素
      	if(this.classList.contains("mui-icon-star")){//判断当前节点列表中是否含有.mui-icon-star元素
      		for(var i=0;i<index;i++){//亮星
      				children[i].classList.remove('mui-icon-star');
      				children[i].classList.add('mui-icon-star-filled');
      		}
      	}else{//重置已经亮星的元素
      		for (var i = index; i < 5; i++) {
      			children[i].classList.add('mui-icon-star')
      			children[i].classList.remove('mui-icon-star-filled')
      		}
      	}
      	console.log(index);
      	window.starnum = index;
      	
      	$('#info').html(index+'星好评');
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
				shopId: shopCategoryId,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					res.rooturl = rooturl;
					var datainfo = res;
					var goodsTemplateScript = $("#goods-template").html();
					var goodsTemplate = Handlebars.compile(goodsTemplateScript);
					var context = datainfo;
					var thegoodsHtml = goodsTemplate(context);
					$("#goodslist").html(thegoodsHtml);
					console.log(JSON.stringify(res.data));
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
				console.log(res.message);
			}
		});
	}
	
//	提交评价
	function evaluate(shopId,content){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_feekback/addFeedback';
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
				shopId: shopId,
				content:content,
				licenseId:window.license_id,
				score:window.starnum,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
					mui.toast(res.message);
					mui("#popover").popover('toggle', document.getElementById("div"));
					
				} else {
					mui.toast(res.message);
				}
				window.wt.close();
			},
			error: function(res) {
				window.wt.close();
				mui.toast(res.message);
			}
		});
	}
//	点击评价商家
	$('html').on('click','.report-btn',function(){
		mui("#popover").popover('toggle', document.getElementById("div"));
	});
	
//  点击确认评价
	$('html').on('click','.affirm',function(){
		var shopid =  window.shopid;
		var content = $("#evaluatecontent").val();
		window.wt=plus.nativeUI.showWaiting();
		evaluate(shopid,content);
	})
	
//	点击返回评价
	$('html').on('click','.cancelbtn',function(){
		mui("#popover").popover('toggle', document.getElementById("div"));
	})
	
	
	
//	点击收藏
	$('html').on('click','#collectshop',function(){
		var status = $(this).attr('data-status');
		if(status == ''|| status == '2'){
			var status = 1;
		}else{
			var status = 2;
		}
		
		var shopId = window.shopid;
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/changeCollection';
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
				status:status,
				shopId: shopId,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == '1000') {
//					修改收藏
					mui.toast(res.message,{ duration:'long', type:'div' });
					if(status == '1'){
						$('#collectshop').attr('src','../../img/collected.png');
						$('#collectshop').attr('data-status','1');
					}else{
						$('#collectshop').attr('src','../../img/shoucang.png');
						$('#collectshop').attr('data-status','2');
					}
					
					console.log(JSON.stringify(res));
				} else {
					//修改收藏
				}
			},
			error: function(res) {
				console.log('请求失败');
			}
		});
//		collected.png
	})

//获取参数
mui.plusReady(function(){
    var self = plus.webview.currentWebview();
	var license_id = self.license_id;
	var shopid = self.shopid;
	var type = self.type;
	window.license_id = license_id;
	console.log(license_id);
	console.log(type);
	console.log(shopid);
//	获取店铺id,收藏使用
	window.shopid = shopid;
	window.count = 1;
	
	getshopgoodlist(shopid);
	//获取监管任务
	getmenu(window.count,license_id);
	//获取商家类型
	getsellerinfo(license_id);
	getformtype();
	//对应类型
	gettypeitem(type);
});

//临时调用
//	getmenu();
//gettypeitem(1);




})