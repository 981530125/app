$(function(){
	var rootpower = [{
		obj:'.updatelastbtn',
		apiurl:'/index.php/Api/Apps/Jingkaiqu/License_year_level_half_year_update_record/updateFirstHalfYearLevelByYear',
		describe:'更新当年等级至上年度'
	},{
		obj:'.rescroll',
		apiurl:'/index.php/Api/Apps/Jingkaiqu/License_year_level_half_year_update_record/rollbackFirstHalfYearLevelByRecord',
		describe:'设置回滚'
	}];
	
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
		
	var now = year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
	window.newyear = year;
	window.now = now;
	var time = $('.time');
	for(var a = 0;a<time.length;a++){
		time.eq(a).html(window.now);
		time.eq(a).parent().find('input').val(window.now);
	}
	
	window.pulldown = 'false';
	window.pullup = 'false';
	//上拉刷新
	mui.init({
		pullRefresh: {
			container: '#myrefresh',
			down: {
				auto:true,
				style:"circle",
				callback: pulldownRefresh
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
		window.pulldown = 'true';
		setTimeout(function() {
			console.log('下拉');
			updatelastpageData('','','全部');
			selectyear();
		}, 1000);
	}
	
	
	window.count = 2;
	/**
	 * 上拉加载具体业务实现
	 */
	function pullupRefresh(taskType) {
		window.pullup = 'true';
		setTimeout(function() {
			console.log('上拉');
			var searchkey = $('.searchkey').val();
			var selectname =  $('.myselect').val();
			updatelastpageData(window.count,searchkey,selectname);
		}, 3000);
	}
	
//	搜索
	$('html').on('tap','.search-btn',function(){
		window.pulldown = 'true';
		var searchkey = $('.searchkey').val();
		var selectname =  $('.myselect').val();
		updatelastpageData('',searchkey,selectname);
	})
	
//	选择年度
	$('html').on('change','.myselect',function(){
		window.pulldown = 'true';
		var searchkey = $('.searchkey').val();
		var selectname =  $(this).val();
		updatelastpageData('',searchkey,selectname);
	})
	
	
	function updatelastpageData(page,searchkey,year){
		$('#my-mask').show();
		if(page){
			var page = page;
		}else{
			var page = 1;
		}
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/License_year_level_half_year_update_record/pageData';
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
				page:page,
				num:10,
				searchkey:searchkey,
				year:year,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					if(window.pulldown == 'true'){
						window.pulldown = 'false';
						res.data.page = page;
						console.log(JSON.stringify(res.data));
						var typeTemplateScript = $("#updatelastyear-template").html();
						var typeTemplate = Handlebars.compile(typeTemplateScript);
						var context = res.data;
						var typeCompiledHtml = typeTemplate(context);
						$("#update-content").html(typeCompiledHtml);
						mui('#myrefresh').pullRefresh().endPulldown();
					}
					if(window.pullup == 'true'){
						window.pullup = 'false';
						window.count = window.count+1;
						res.data.page = page;
						console.log(JSON.stringify(res.data));
						var typeTemplateScript = $("#updatelastyear-template").html();
						var typeTemplate = Handlebars.compile(typeTemplateScript);
						var context = res.data;
						var typeCompiledHtml = typeTemplate(context);
						$("#update-content").append(typeCompiledHtml);
						mui('#myrefresh').pullRefresh().endPulldown();
						mui('#myrefresh').pullRefresh().endPullupToRefresh(false);
					}
					
					for(var itemn in rootpower){
						ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
					}
					
				}else{
					window.pulldown = 'false';
					window.pullup = 'false';
					mui('#myrefresh').pullRefresh().endPulldown();
					mui('#myrefresh').pullRefresh().endPullupToRefresh(true);
					mui.toast(res.message,{ duration:'long', type:'div' }) 
				}
				$('#my-mask').hide();
			},
			error: function(res) {
				mui.alert(res.message);
				$('#my-mask').hide();
			}
		})
	}
	
	$('html').on('tap','.rescroll',function(){
		var year = $(this).attr('data-year');
		var id = $(this).attr('data-id');
		var author_admin_id = $(this).attr('data-author_admin_id');
		console.log(year);
		console.log(id);
		console.log(author_admin_id);
		
		var btnArray = ['否', '是'];
		mui.confirm('将数据回滚至该条记录前的状态？', '回滚', btnArray, function(e) {
			if (e.index == 1) {
				rollback(id);
			} else {
				mui.toast('取消',{ duration:'long', type:'div' }) 
			}
		})
	})
	
//	点击滚回按钮
	function rollback(rollback_record_id){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/License_year_level_half_year_update_record/rollbackFirstHalfYearLevelByRecord';
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
				rollback_record_id:rollback_record_id,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function() {
						location.reload();
					}, 300);
					
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
	
//	更新到上半年风险等级
	function updatelevel(year){
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/License_year_level_half_year_update_record/updateFirstHalfYearLevelByYear';
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
				year:year,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					mui.toast(res.message,{ duration:'long', type:'div' });
					setTimeout(function() {
						location.reload();
					}, 300);
				}else{
					mui.toast(res.message,{ duration:'long', type:'div' });
				}
			},
			error: function(res) {
				mui.alert(res.message);
			}
		})
	}
	
//	点击返回
	$('html').on('tap','.btn-back',function(){
		var mask = plus.webview.currentWebview().opener();
		mui.fire(mask, 'removemask',{
			isdata:'true'
		});
		mui.back();
	})
	
	//选择年度
	function selectyear(){
		var currentyear = window.newyear;
		var myyear = [{value:'全部',text:'全部'}];
		for(var tyear = currentyear;tyear>=2018;tyear-- ){
			var addyear = {
				'value':tyear,
				'text':tyear
			}
			myyear.push(addyear);
		}
		
		var typeTemplateScript = $("#allselect-template").html();
		var typeTemplate = Handlebars.compile(typeTemplateScript);
		var context = myyear;
		var typeCompiledHtml = typeTemplate(context);
		$("#all-list").html(typeCompiledHtml);
	}
	
	
	
	
	//选择类型控制器
	var userPicker = new mui.PopPicker();
	
	var currentyear = window.newyear;
	var myyear = [{value:'全部',text:'全部'}];
	for(var tyear = currentyear;tyear>=2018;tyear-- ){
		var addyear = {
			'value':tyear,
			'text':tyear
		}
		myyear.push(addyear);
	}
	
	userPicker.setData(myyear);
	
//	点击更新上年度
	$('html').on('tap','.updatelast',function(){
		mui('#myrefresh').pullRefresh().setStopped(true);//暂时禁止滚动
		userPicker.show(function(items) {
			var btnArray = ['否', '是'];
			mui.confirm('风险分级年度更新到'+items[0].text, '风险分级年度更新', btnArray, function(e) {
				if (e.index == 1) {
					updatelevel(items[0].text);
				} else {
					mui.alert('取消');
				}
			})
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	})
	
	mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
  		mui('#myrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	});
  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
  		mui('#myrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	});
  	mui("body").on('tap','.mui-backdrop',function(){
  		mui('#myrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	});
	
	
	
})
