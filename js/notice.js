(function($, doc) {
	$.init();
	$.ready(function() {
		/**
		 * 获取对象属性的值
		 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
		 * @param {Object} obj 对象
		 * @param {String} param 属性名
		 */
		var _getParam = function(obj, param) {
			return obj[param] || '';
		};
		//普通示例
		var userPicker = new $.PopPicker();
		userPicker.setData(['全部','已读','未读']);
		var showUserPickerButton = doc.getElementById('showUserPicker');
		var userResult = doc.getElementById('userResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				
				getnotice(items[0]);
				userResult.innerText = items[0];
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);
	});
})(mui, document);

function getnotice(type){
	console.log(type);
	console.log('121');
}
function getmess(){
	console.log();
	mui.openWindow({
	    url: 'noticecontent.html',
	    id:'noticecontent'
	});
}
