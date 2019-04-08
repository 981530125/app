$(function(){
	//	权限判断
	var rootpower = [{
			obj:'.lookdetail',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId'
		},{
			obj:'.lookallshop',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId'
		},{
			obj:'.lookrecord',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record/adminSelfInvestigateRecord'
		}];
	
	//下拉
	mui.init({
		pullRefresh: {
			container: '#refreshlist',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			}
		}
	});
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		setTimeout(function() {
			checkcenter();
		}, 1500);
	}
	
	$('html').on('click','.food-btn',function(){
		var type = $(this).attr('data-type');
		var type_id = $(this).attr('data-id');
		console.log(type);
		var tourl = 'checkcenter.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	type:type,
		    	type_id:type_id
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
	$('html').on('click','.activity-btn',function(){
		var type = $(this).attr('data-type');
		var type_id = $(this).attr('data-id');
		console.log(type);
		var tourl = 'activitycheck.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	type:type,
		    	type_id:type_id
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
	
	function checkcenter(){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Api_apps_logged/reviewCenter';
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
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					var data = {
                    	activity: {
                            "a": res.data.activity[0],
                            "b": res.data.activity[1],
                            "c": res.data.activity[2]
                       	},
                       	goods: {
                            "a": res.data.goods[0],
                            "b": res.data.goods[1],
                            "c": res.data.goods[2]
                       	},
                   	}
					
//					模板1
					var actionTemplateScript = $("#activityandgoods-template").html();
					var actionTemplate = Handlebars.compile(actionTemplateScript);
					var context = data;
					var actionCompiledHtml = actionTemplate(context);
					$("#activityandgoods").html(actionCompiledHtml);
					mui('#refreshlist').pullRefresh().endPulldown();
					
					//权限配置
					console.log('权限配置');
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
					}
					
				}else{
					mui.alert(res.message);
					mui('#refreshlist').pullRefresh().endPulldown();
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
	
	
	
	
})
