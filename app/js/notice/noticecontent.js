$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var messagecontent = self.messagecontent;
	    console.log(JSON.stringify(messagecontent));
	    console.log('2222');
	    // 抓取模板数据
		var contenttpl = $("#content-template").html();
		// 编译模板
		var rcontenttp = Handlebars.compile(contenttpl);
		var data = messagecontent;
		// 把数据传送到模板
		var noticeCompiledHtml = rcontenttp(data);
	    $('#messagecontent').html(noticeCompiledHtml);
	    
	    console.log(messagecontent);
	});
})
