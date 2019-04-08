$(function() {

	var filecount = 1;

	var count = 1;
	
	
//	头部点击返回调用刷新
	window.addEventListener('refresh', function(e){//执行刷新  
		location.reload();
	})
	//上拉刷新
	mui.init({
		pullRefresh: {
			container: '#refreshlist',
			up: {
				height:50,
				contentrefresh: '正在加载...',
				contentnomore:'没有更多数据了',
				callback: pullupRefresh
			}
		}
	});
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh() {
		var groupBy = $(".head-switch-btn").attr('data-current');
		var searchkey = $(".searchkey").val();
		if(searchkey == ''){
			searchkey = '';
		}else{
			searchkey = searchkey;
		}
//		mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > allnum));
		
		setTimeout(function() {
			if(groupBy == 'file'){
				console.log(filecount);
				getshop(filecount,searchkey,'',1);
			}else{
				console.log(count);
				getshop(count,searchkey,'',1);
			}
			//page页数，searchkey搜索关键字，groupBy分类，ispull是否下拉加载
			
			
		}, 3000);
	}
	
	auxiliarysubmit = function(node){
		
		var objinfo = searchbyid(node);
		mui.openWindow({
		    url:'accessorysubmit.html',   
		    id:'accessorysubmit',
		    extras: {objinfo:objinfo}
		});
	}
	
	function searchbyid(listenid){
		var info = window.data;
		for(var n = 0;n<info.length;n++){
			if(info[n].license != null && info[n].license.id == listenid){
				return info[n];
			}
		}
	}
	
//	切换类型
$("html").on('click','.head-switch-btn',function(){
	var groupBy = $(this).attr('data-type');
	var searchkey = $(".searchkey").val();
	if(searchkey == ''){
		searchkey = '';
	}else{
		searchkey = searchkey;
	}
	if(groupBy == 'file'){
		$(this).attr('data-type','license');
		$(this).attr('data-current','file');
		$(this).html('企业分组');
	}else{
		$(this).attr('data-type','file');
		$(this).attr('data-current','license');
		$(this).html('所有');
	}
	console.log(groupBy);
	getshop(1,searchkey,groupBy,0);
})
//搜索
$("html").on('click','.search-item',function(){
	var groupBy = $(this).attr('data-current');
	var searchkey = $(".searchkey").val();
	if(searchkey == ''){
		searchkey = '';
	}else{
		searchkey = searchkey;
	}
	getshop(1,searchkey,groupBy,0);
})



	//获取我的辅助材料，有用
	function getshop(page,searchkey,groupBy,ispull) {
		if(page){
			page = page;
		}else{
			page = 1;
		}
		if(groupBy){
			groupBy = groupBy;
		}else{
			groupBy = '';
		}
		if(searchkey){
			searchkey = searchkey;
		}else{
			searchkey = '';
		}
		//设置是否为下拉加载
		
		var num = 10;
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/getAdminSelfInvestigateRecordFile';
		$("#my-mask").show();
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
				page: page,
				num: num,
				searchkey:searchkey,
				groupBy:groupBy
			},
			dataType: 'json',
			success: function(res) {
				console.log(JSON.stringify(res));
				$("#my-mask").hide();
				if(res.code && res.code == '1000') {
					console.log(JSON.stringify(res));
					res.data.rooturl = rooturl;
					//所有条数
					window.count = res.data.count;
//					总页数
					window.allnum = Math.ceil(window.count/10);
					window.data = res.data.data;
					if(ispull){
//						下拉
						if(groupBy == 'file'){
							var fileTemplateScript = $("#file-template").html();
							var fileTemplate = Handlebars.compile(fileTemplateScript);
							var context = res.data;
							var fileCompiledHtml = fileTemplate(context);
							$("#list-content").append(fileCompiledHtml);
							mui('#refreshlist').pullRefresh().endPullupToRefresh((++filecount > window.allnum));
						}else{
							var theTemplateScript = $("#example-template").html();
							var theTemplate = Handlebars.compile(theTemplateScript);
							var context = res.data;
							var theCompiledHtml = theTemplate(context);
							$("#list-content").append(theCompiledHtml);
							mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > window.allnum));
						}
					}else{
						
//						初加载
						if(groupBy == 'file'){
							console.log('2323');
							var fileTemplateScript = $("#file-template").html();
							var fileTemplate = Handlebars.compile(fileTemplateScript);
							var context = res.data;
							var fileCompiledHtml = fileTemplate(context);
							$("#list-content").html(fileCompiledHtml);
							mui('#refreshlist').pullRefresh().endPullupToRefresh((++filecount > window.allnum));
						}else{
							console.log('2323');
							var theTemplateScript = $("#example-template").html();
							var theTemplate = Handlebars.compile(theTemplateScript);
							var context = res.data;
							var theCompiledHtml = theTemplate(context);
							$("#list-content").html(theCompiledHtml);
							mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > window.allnum));
							console.log(count);
						}
					}
					
					console.log(page);
					mui.toast(res.message,{ duration:'long', type:'div' });
				} else {
					mui.toast(res.message,{ duration:'long', type:'div' });
//					暂无数据
//					var noneTemplateScript = $("#nonedata-template").html();
//					var noneTemplate = Handlebars.compile(noneTemplateScript);
//					var context = res;
//					var noneCompiledHtml = noneTemplate(context);
//					$("#list-content").html(noneCompiledHtml);
					console.log(res.message);
					if(groupBy == 'file'){
						mui('#refreshlist').pullRefresh().endPullupToRefresh((++filecount > window.allnum));
					}else{
						console.log(count);
						console.log(allnum);
						mui('#refreshlist').pullRefresh().endPullupToRefresh((++count > window.allnum));
					}
				}
			},
			error: function(res) {
				$("#my-mask").hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
//				prompt('error',JSON.stringify(res));
			}
		});
	}
	
	function getshopfile(page,groupBy) {
		if(page){
			page = page;
		}else{
			page = 1;
		}
		if(groupBy){
			groupBy = groupBy;
		}else{
			groupBy = '';
		}
		var num = 10;
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record_file/getAdminSelfInvestigateRecordFile';
		$("#my-mask").show();
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
				page: page,
				num: num
			},
			dataType: 'json',
			success: function(res) {
				$("#my-mask").hide();
				if(res.code && res.code == '1000') {
					console.log(JSON.stringify(res));
					res.data.rooturl = rooturl;
					window.count = res.data.count;
					window.data = res.data.data;
					var theTemplateScript = $("#example-template").html();
					var theTemplate = Handlebars.compile(theTemplateScript);
					var context = res.data;
					var theCompiledHtml = theTemplate(context);
					$("#list-content").html(theCompiledHtml);
					mui('#refreshlist').pullRefresh().endPullupToRefresh((count > allnum));
					mui.toast(res.message,{ duration:'long', type:'div' });
				} else {
					mui.toast(res.message,{ duration:'long', type:'div' });
					console.log(res.message);
				}
			},
			error: function(res) {
				$("#my-mask").hide();
				mui.toast(res.message,{ duration:'long', type:'div' });
//				prompt('error',JSON.stringify(res));
			}
		});
	}
	
	getshop(filecount,'','',0);

	//点击选择辖区
//	$('html').on('change','#selectlevel',function(){
//		var selectype = $("#selectlevel option:selected").val();
//		console.log(selectype);
//		getshop('',selectype)
//	});
	
	//点击图片下载
	downloadimg = function (url){
 		console.log(url);
 		var currentPreviewSrc = url;
		var btnArray = ['取消', '保存'];
		mui.confirm('是否保存图片？', '保存图片到相册', btnArray, function(e) {
	        if (e.index == 1) {
	        	 plus.gallery.save(currentPreviewSrc, function() {
		                mui.toast('保存成功');
		          	}, function() {
		                mui.toast('保存失败，请重试！');
		         });
	        } else {
	        	console.log('取消');
	        }
        })
	}

	function extend(target, source) {
       for (var obj in source) {
           target[obj] = source[obj];
       }
       return target;
   	}
	
})
//底部跳转至中心
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

////资料编辑
function lookdetail(id){
	mui.openWindow({
	    url: 'editshop.html',
	    extras:{
			licenses_id: id,
			type: 1
		}
	});
}
////监管记录1
//function writerecords(id){
//	mui.openWindow({
//	    url: 'ShopPage.html',
//	    extras:{
//			shopid: id,
//			type: 1
//		}
//	});
//	console.log(id);
//}

