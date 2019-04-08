$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var jlist = JSON.parse(self.jlist);
	    var ext = self.ext;
	    
	    console.log(ext);
	    console.log(JSON.stringify(jlist));
	    
	    // //调用模板引擎
	   	var jlistTemplateScript = $("#jlist-template").html();
		var jlistTemplate = Handlebars.compile(jlistTemplateScript);
		var context = jlist;
		var jlistHtml = jlistTemplate(context);
		$("#list").html(jlistHtml);
		
		mui('html').on('tap', '.select-finish', function() {
			console.log($('.mtree-open').length);
			for(var n = 0; n < $('.mtree-open').length; n++) {
				var level = $('.mtree-open').eq(n).children('a').attr('data-level');
				if(level == '1') {
					console.log('一级：' + $('.mtree-open').eq(n).children('a').attr('data-info'));
				}
				if(level == '2') {
					console.log('二级：' + $('.mtree-open').eq(n).children('a').attr('data-info'));
				}
				if(level == '3') {
					console.log('三级：' + $('.mtree-open').eq(n).children('a').attr('data-info'));
				}

			}
			console.log('当前：' + $(".mtree-active").children('a').attr('data-info'));
			console.log('当前：' + $(".mtree-active").children('a').attr('data-level'));

			
//          console.log('1212');
            var cityName = $(".areacontent").html();
//          console.log($(".mtree-active").children('a').attr('data-info'));
//          console.log($(".mtree-active").children('a').attr('data-id'));
            var currentname = $(".mtree-active").children('a').attr('data-info');
            $("#areaid").val($(".mtree-active").children('a').attr('data-id'));
            var id = $("#areaid").val();
            console.log(id);
            //获取父页面A.html
            var main = plus.webview.currentWebview().opener();
            //自定义事件,事件名为changeCity
            if(ext == 'change'){
            	mui.fire(main,'changeCity',{cityName:cityName,areaid:id,currentname:currentname,data:'change'});
            }else{
            	mui.fire(main,'changeCity',{cityName:cityName,areaid:id,currentname:currentname,data:'true'});
            }
            //关闭子页面
            mui.back();
      	})
		
		
	});

});