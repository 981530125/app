$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    console.log(JSON.stringify(self.shoptype));
	    
	    //		// 抓取模板数据
		var timecontenttpl = $("#shoptype-template").html();
		// 编译模板
		var timecontenttp = Handlebars.compile(timecontenttpl);
		var data = self.shoptype;
		// 把数据传送到模板

		var text = timecontenttp(data);
		// 更新到模板
		$('#typelist').html(text);
	});
	
	$('html').on('click','.shoptype-btn',function(){
		console.log($(this).attr('data-id'));
		console.log($(this).attr('data-name'));
		var data_id = $(this).attr('data-id');
		var data_name = $(this).attr('data-name');
		var list = plus.webview.currentWebview().opener();
		//触发父页面的自定义事件(refresh),从而进行刷新
		mui.fire(list, 'shoptype',{
			reload: 'true',
			data_id: data_id,
			data_name: data_name
		});
		mui.back();
		//返回true,继续页面关闭逻辑
	})
	
})
