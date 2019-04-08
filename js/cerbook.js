$(function(){
	getshopinfo('ff80808153a906270153ab6ea4e01a8c');
	//根据证书获取商家信息
	function getshopinfo(licenseId){
		var licenseId = licenseId;
		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Shop/getShopInfoByLicenseId';
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
				licenseId:licenseId
			},
			dataType: 'json',
			success: function(res) {
				if(res.code && res.code == 1000){
					Console.log('131’')
					res.data.licenseId = licenseId;
					var formTemplateScript = $("#change-template").html();
					var formTemplate = Handlebars.compile(formTemplateScript);
					var context = res.data;
					var formCompiledHtml = formTemplate(context);
					$("#change-form").append(formCompiledHtml);
					
					
					console.log(res.message);
				}else{
					console.log(res.message);
				}
				console.log(res.data);
			},
			error: function(res) {
				
				console.log(res.message);
			}
		})
	}
})
