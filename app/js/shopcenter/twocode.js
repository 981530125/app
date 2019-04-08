$(function(){
//	console.log('为完成');
//	var shopinfo = localStorage.getItem('shopinfo');
//	var shopinfo = JSON.parse(shopinfo);
//	var licenseId = shopinfo.licenses[0].id;
//	var qrcodeUrl = 'test://'+shopinfo.licenses[0].id;
	//获取参数
mui.plusReady(function(){
    var self = plus.webview.currentWebview();
	var license_id = self.license_id;
	var qrcodeUrl = 'supervisionOfBinHaiFoodApp://com_cnvp_navPush/BHScanResultViewController?&licenseID='+license_id;
	console.log(license_id);
	getcode(license_id,qrcodeUrl);
});
	
//	console.log(qrcodeUrl);
	
//	getcode(licenseId,qrcodeUrl);
	
	function getcode(licenseId,qrcodeUrl){
		console.log(qrcodeUrl);
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/createShopPoster';
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				licenseId:licenseId,
				qrcodeUrl:qrcodeUrl,
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
				console.log(JSON.stringify(res));
				if(res.code && res.code == 1000){
					res.data.rooturl = rooturl;
			//		// 抓取模板数据
					var contenttpl = $("#twocode-template").html();
					// 编译模板
					var rcontenttp = Handlebars.compile(contenttpl);
					var data = res.data;
					// 把数据传送到模板
					var text = rcontenttp(data);
					
					$('#twocode').html(text);
					mui.toast(res.message,{ duration:'short', type:'div' });
				}else{
					if(window.pulldown == 'true'){
						mui('#pullrefresh').pullRefresh().endPulldown();
						window.pulldown = 'false';
					}
					mui.toast(res.message,{ duration:'short', type:'div' });
					console.log(res.message);
				}
				
			},
			error: function(res){
				console.log(JSON.stringify(res));
				console.log(res.message);
				console.log(res.data);
				mui.toast(res.message,{ duration:'short', type:'div' });
			}
		})
	}
	
	
	
	
})
