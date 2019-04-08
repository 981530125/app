$(function(){
	$('.all-li').click(function() {
		console.log($(this).attr('data-id'));
		var id = $(this).attr('data-id');
		console.log($(".menulist").length);
		console.log(clientType);
		gettypeitem(id);
	});
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
	
	
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var typeid = self.typeid;
	    gettypeitem(typeid);
	   });
	
	
})
