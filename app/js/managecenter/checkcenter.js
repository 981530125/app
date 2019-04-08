//FORm序列化转json
$.fn.serializeObject = function()    
{    
   var o = {};
	var oarr = []; 
   var a = this.serializeArray();  
	$.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    var $radio = $('input[type=radio],input[type=checkbox]',this);
    $.each($radio,function(){
        if(!o.hasOwnProperty(this.name)){
            o[this.name] = '';
        }
    });
    return o;  
};
$(function(){
	window.addEventListener('refresh', function(e){//执行刷新
		console.log(e.detail.reload);
		console.log('1212');
	  	if(e.detail.reload == 'true'){
	  		location.reload();
	  	}
	});
	//	获取参数
	mui.plusReady(function() {
		//获取检查表类型
		var self = plus.webview.currentWebview();
		var type = self.type;
		var type_id = self.type_id;
		
		if(type == 'all'){
			$("#userResult").html('全部');
		}
		if(type == 'wait'){
			$("#userResult").html('待审核');
		}
		if(type == 'pass'){
			$("#userResult").html('已通过');
		}
		if(type == 'nopass'){
			$("#userResult").html('不通过');
		}
		window.type_id = type_id;
	})
	//	下拉刷新
    window.pulldown = 'false';
    window.pullup = 'false';
    window.type_id = '';
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
	 * 上拉加载具体业务实现
	 */
	window.page = 2;
	function pullupRefresh() {
		window.pullup = 'true';
		var type = $("#pullrefresh").html();
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		type_id = window.type_id;
		setTimeout(function() {
//			暂无信息
			goods(type_id,'','',0);
		}, 1500);
	}
	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		window.pulldown = 'true';
		type_id = window.type_id;
		
		setTimeout(function() {
			goods(type_id,'','',0);
		}, 1500);
	}
//	点击搜索
	$('html').on('click','.search-btn',function(){
		var searchkey = $('.search-key').val();
		var type_id = window.type_id;
		var is_release = $('#myselect').val();
		goods(type_id,searchkey,is_release,0);
	})
	
//	点击上下架
	$('html').on('change','#myselect',function(){
		var searchkey = $('.search-key').val();
		var type_id = window.type_id;
		var is_release = $('#myselect').val();
		goods(type_id,searchkey,is_release,0);
	})
	
	
	//选择类型控制器
	var userPicker = new mui.PopPicker();
	
	userPicker.setData([{value:'',text:'全部'},{value:'0',text:'待审核'},{value:'1',text:'已通过'},{value:'2',text:'不通过'}]);
	var showUserPickerButton = document.getElementById('showUserPicker');
	var userResult = document.getElementById('userResult');
	showUserPickerButton.addEventListener('tap', function(event) {
		mui('#pullrefresh').pullRefresh().setStopped(true);//暂时禁止滚动
		userPicker.show(function(items) {
			
			userResult.innerText = items[0].text;
			window.type_id = items[0].value;
			var type_id = items[0].value;
			var searchkey = $('.search-key').val();
			var is_release = $('#myselect').val();
			goods(type_id,searchkey,is_release,0);
			//返回 false 可以阻止选择框的关闭
			//return false;
			
		});
	}, false);
	mui("body").on('tap','.mui-btn.mui-btn-blue.mui-poppicker-btn-ok',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	});
  	mui("body").on('tap','.mui-btn.mui-poppicker-btn-cancel',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	});
  	mui("body").on('tap','.mui-backdrop',function(){
  		mui('#pullrefresh').pullRefresh().setStopped(false);//开启禁止滚动
	});
	
//	点击查看详情
	$('html').on('click','.changeactivity',function(){
		var tourl = 'activitydetail.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
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
//	点击查看详情
	$('html').on('click','.changefood',function(){
		var id = $(this).attr('data-info');
		var info = window.info.data;
		
		for(var item in info){
			if(info[item].id == id){
				var item_info = info[item];
			}
		}
		
		
		var tourl = 'fooddetail.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'0',//新页面底部位置
		    },
		    extras:{
		    	item_info:item_info
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
	
	function goods(review_status,searchkey,is_release,pullup){
		console.log(clientId);
		console.log(accessToken);
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop_goods/getShopGoods';
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
				searchkey:searchkey,
				review_status:review_status,
				is_release:is_release,
				loginway:loginway
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					console.log(JSON.stringify(res));
					
					res.data.rooturl = rooturl;
					var goodsTemplateScript = $("#goods-template").html();
					var goodsTemplate = Handlebars.compile(goodsTemplateScript);
					var context = res.data;
					var goodsCompiledHtml = goodsTemplate(context);
					
					if(pullup == 0){
						$("#goods").html(goodsCompiledHtml);
						mui('#pullrefresh').pullRefresh().endPulldown();
					}else{
						$("#goods").append(goodsCompiledHtml);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					window.info = res;
				}else{
					mui.alert(res.message);
					mui('#pullrefresh').pullRefresh().endPulldown();
				}
				mui.toast(res.message,{ duration:'long', type:'div' });
			},
			error: function(res) {
				mui.toast(res.message,{ duration:'long', type:'div' });
				mui('#pullrefresh').pullRefresh().endPulldown();
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			}
		})
	}
})
