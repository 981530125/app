$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    var jlist = JSON.parse(self.jlist);
	    // //调用模板引擎
	   	var jlistTemplateScript = $("#jlist-template").html();
		var jlistTemplate = Handlebars.compile(jlistTemplateScript);
		var context = jlist;
		var jlistHtml = jlistTemplate(context);
		$("#list").html(jlistHtml);
//	    var typeid = self.typeid;
//	    gettypeitem(typeid);
	});

});
//选择控制器
//(function($, doc) {
//	$.init();
//	$.ready(function() {
//		/**
//		 * 获取对象属性的值
//		 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
//		 * @param {Object} obj 对象
//		 * @param {String} param 属性名
//		 */
//		var _getParam = function(obj, param) {
//			return obj[param] || '';
//		};
//		//普通示例
//		var userPicker = new $.PopPicker();
//		userPicker.setData(['全部','已读','未读']);
//		var showUserPickerButton =doc.getElementsByClassName("showUserPicker");
//		console.log(showUserPickerButton);
////		var userResult = doc.getElementById('userResult');
//		showUserPickerButton.addEventListener('tap', function(event) {
//			userPicker.show(function(items) {
//				console.login(items[0]);
//				getnotice(items[0]);
//				userResult.innerText = items[0];
//				//返回 false 可以阻止选择框的关闭
//				//return false;
//			});
//		}, false);
//	});
//})(mui, document);