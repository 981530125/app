$(function(){
	var map;
//获取商家中心信息
	mui.plusReady(function() {
		
        var self = plus.webview.currentWebview();
        var shopinfo = self.shopinfo;
    	shopinfo.rooturl = rooturl;
    	var shopinfoTemplateScript = $("#content-template").html();
		var shopinfoTemplate = Handlebars.compile(shopinfoTemplateScript);
		var context = shopinfo;
		var shopinfoCompiledHtml = shopinfoTemplate(context);
		$("#shopinfo").html(shopinfoCompiledHtml);
		
		if(shopinfo.lat == '' && shopinfo.lng == ''){
			init(mylatitude,mylongitude);
		}else{
			init(shopinfo.lat,shopinfo.lng);
		}
   	});
})
