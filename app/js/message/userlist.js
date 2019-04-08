$(function(){
	//	下拉刷新
    window.pulldown = 'false';
    window.pullup = 'false';
    
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				callback: pulldownRefresh
			},
			up: {
				auto:false,
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
			getuserlist();
		}, 1000);
	}
	
	window.page = 2;
	function pullupRefresh() {
		window.pullup = 'true';
		setTimeout(function() {
//			暂无信息
			getuserlist(window.page);
		}, 1500);
	}
	
	
	function getuserlist(page,start,end,searchkey){
		if(page){
			var page = page;
		}else{
			var page = 1;
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
		
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/User/pageData'; //获取信息详情
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
				page:page,
				num:10,
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
				if(res.code && res.code == 1000){
					if(res.data){
						// 抓取模板数据
						console.log(JSON.stringify(res.data.data));
						var userinfo = res.data.data;
						for(var item in userinfo){
							userinfo[item].checked = false;
						}
						
						console.log(JSON.stringify(userinfo));
						
						res.data.rooturl = rooturl;
						res.data.currentname = window.currentname;
						var contenttpl = $("#userlist-template").html();
						// 编译模板
						var rcontenttp = Handlebars.compile(contenttpl);
						var data = userinfo;
						// 把数据传送到模板
						var noticeCompiledHtml = rcontenttp(data);
						
					    window.page = window.page+1;
						if(window.pulldown == 'true'){
							window.pulldown = 'false';
							$('#userlist').html(noticeCompiledHtml);
							mui('#pullrefresh').pullRefresh().endPulldown();
							window.page = 2;
						}
						if(window.pullup == 'true'){
							window.pullup = 'false';
							window.page = window.page+1;
							$('#userlist').append(noticeCompiledHtml);
							mui('#pullrefresh').pullRefresh().refresh(true);
						}
					}else{
						mui.alert(res.message);
						mui('#pullrefresh').pullRefresh().refresh(true);
                        console.log(JSON.stringify(res));
					}
					mui.toast(res.message);
				}else{
					// 更新到模板
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
						// 更新到模板
					}
					if(window.pullup == 'true'){
						window.pullup = 'false';
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
					console.log(JSON.stringify(res));
					mui.alert(res.message);
				}
			},
			error: function(res){
				mui.toast(res.message,{ duration:'long', type:'div' });
			}
		})
	}
	
})
