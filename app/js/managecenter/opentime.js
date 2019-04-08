//FORm序列化转json
$.fn.serializeObject = function(){
	var o = {};
	var oarr = [];
	var a = this.serializeArray();
	$.each(a, function() {
		if(o[this.name] !== undefined) {
			if(!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	var $radio = $('input[type=radio],input[type=checkbox]', this);
	$.each($radio, function() {
		if(!o.hasOwnProperty(this.name)) {
			o[this.name] = '';
		}
	});
	return o;
};
$(function(){
	//获取跳转参数
	mui.plusReady(function(){
	    var self = plus.webview.currentWebview();
	    console.log(JSON.stringify(self.open_time));
	    //		// 抓取模板数据
		var timecontenttpl = $("#time-template").html();
		// 编译模板
		var timecontenttp = Handlebars.compile(timecontenttpl);
		var data = self.open_time;
		// 把数据传送到模板

		var text = timecontenttp(data);
		// 更新到模板
		$('#time-list').html(text);
	    
	    
	    
	});
	//日期时间选择器，公用
	$('html').on("click", '.time', function() {
		var that = $(this);
		var dtpicker = new mui.DtPicker({
			type: "time", //设置日历初始视图模式 
			beginDate: new Date(1015, 04, 25), //设置开始日期 
			endDate: new Date(3016, 04, 25), //设置结束日期 
		})
		dtpicker.show(function(e) {
			that.children('.time-content').html(e.value);
			that.children('.inputtime-content').val(e.value);
		});
	});
	
	$('html').on('click','.finished',function(){
		var content = $("#time-list").serializeObject();
		var length = content.day_of_week.length;
		console.log(length);
		var shop_open_range = [];
		for(var i = 0;i<length;i++){
			var shop_open = {
				day_of_week: content.day_of_week[i],
				open_time: content.open_time[i],
				close_time: content.close_time[i]
			}
			shop_open_range.push(shop_open);
		}
		

		var list = plus.webview.currentWebview().opener();
		//触发父页面的自定义事件(refresh),从而进行刷新
		mui.fire(list, 'opentime',{
			reload: 'true',
			shop_open_range: shop_open_range
		});
		mui.back();
		//返回true,继续页面关闭逻辑
		
	})
	
})
