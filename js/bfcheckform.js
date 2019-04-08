$(function() {
	//获取参数
	mui.plusReady(function(){
		//获取检查表类型
	    var self = plus.webview.currentWebview();
		var item = [];
		if(self.objinfo.is_open == 1){
			items = [
		      { name: 0, value: '展示', checked: true  },
		      { name: 1, value: '隐藏', checked: false }]
		}else{
			items = [
		      { name: 0, value: '展示' ,checked: false },
		      { name: 1, value: '隐藏', checked: true }
		      ]
		}

		self.objinfo.is_openitem = items;

//		console.log(JSON.stringify(self.objinfo.is_openitem));

	   	var forminfo = self.objinfo;
	   	window.forminfo = forminfo;
	   	 //调用模板引擎
	   	var recordformTemplateScript = $("#recordform-template").html();
		var recordformTemplate = Handlebars.compile(recordformTemplateScript);
		var context = forminfo;
		var therecordformHtml = recordformTemplate(context);
		$("#recordform-content").html(therecordformHtml);
	   	
	   	//打开表单模板、
	   	 templateform = function(tablename){
	   	 	var forminfo = window.forminfo;
	   	 	var tablename = tablename;

			var allformlisttype = localStorage.getItem('allformlisttype');
			var allformlisttype = JSON.parse(allformlisttype);
//	   		var tablename = 'checklist__check_point__food_sale__circulation__unit';
//	   		var tablename = 'checklist__check_result';  //未完成
//	   		var tablename = 'checklist__daily_check__catering__catering_service__small_store';
//	   		var tablename = 'checklist__daily_check__catering__food_vendors'; //缺经营类型
//	   		var tablename = 'checklist__daily_check__food_production__small_workshop';
//	   		var tablename = 'checklist__daily_check__food_sale__small_store';   //小杂食
//	   		var tablename = 'checklist__check_point__catering__catering_service__unit'; //表 1-3餐饮服务日常监督检查要点表
//	   		var tablename = 'checklist__check_point__food_production__unit'; //表1-1
//	   		var tablename = 'checklist__notification_form';  //告知野，未完成
	   		//所有表单数据
	   		
	   		if(forminfo.checklist){
	   			var checklist = forminfo.checklist;
	   		}else{
	   			var checklist = allformlisttype;
	   		}
	   		

	   		
	   		var comment_list = [];
	   		var formlist = [];
	   		
	   		//获取对应表单数据
	   		for(var a = 0;a<checklist.length;a++){
	   			if(checklist[a].checklist_type.en_name == tablename){
	   				inforotm  = checklist[a];
	   			}
	   		}
	   		
	   		//获取经营类型type_of_business
	   		
	   		
	   		
	   		if(inforotm.field_comment){
	   			var fcomment = inforotm.field_comment;
	   		}else{
		   		for(var ft = 0;ft<allformlisttype.length;ft++){
		   			if(allformlisttype[ft].en_name == tablename){
		   				var fcomment  = allformlisttype[ft].field_comment;
		   			}
		   		}
	   		}

	   		
	   		for(var t = 0;t<fcomment.length;t++){
	   			if(fcomment[t].en_name == 'type_of_business'){
	   				if(parseInt(inforotm.data.type_of_business)){
	   					var value = parseInt(inforotm.data.type_of_business);
	   				}else{
	   					var value = '';
	   				}
	   				
	   				var checkitem = JSON.parse(fcomment[t].score_checkbox_value);
	   				var checkarr = [];
	   				for (var key in checkitem) {
	            		var arr = { name: checkitem[key], checkitem: key };
	            		checkarr.push(arr);
	          		}
	   				var bussinessarr = { name: fcomment[t].name,en_name: fcomment[t].en_name, value: value ,checkitem: checkarr};
	   			}
	   		}
	   		//获取头部input
	   		var topinput = [];
	   		for(var t = 0;t<fcomment.length;t++){
	   			if(fcomment[t].data_type == 'varchar'){
	   				var top_enname = fcomment[t].en_name;
	   				var data = inforotm.data;
	   				for (var key in data) {
						if(top_enname == key){
							var dataitem = {
							id: fcomment[t].id,
							name: fcomment[t].name,
							data_type: fcomment[t].data_type,
							display: fcomment[t].display,
							en_name: top_enname,
							value: 	data[key]
							}
							topinput.push(dataitem);
						}
	          		}
	   			}else if(fcomment[t].en_name == 'type_of_business' ||fcomment[t].data_type == 'timerange'){
	   				break;
	   			}
//	   			console.log(JSON.stringify(dataitem));
	   		}
	   		
	   		//获取底部部input
	   		var bottominput = [];
	   		var timerange = [];
	   		for(var t = 0;t<fcomment.length;t++){
	   			if(fcomment[t].data_type == 'tinytext'){
	   				var buttom_enname = fcomment[t].en_name;
	   				var data = inforotm.data;
	   				for (var key in data) {
						if(buttom_enname == key){
							var bottomitem = {
							id: fcomment[t].id,
							name: fcomment[t].name,
							data_type: fcomment[t].data_type,
							display: fcomment[t].display,
							en_name: buttom_enname,
							value: 	data[key]
							}
							bottominput.push(bottomitem);
						}
						
	          		}
	   			}
	   			if(fcomment[t].data_type == 'timerange'){
	   				var timerange_enname = fcomment[t].en_name;
	   				var data = inforotm.data;
	   				var check_time_start_at = data.check_time_start_at;
	   				var check_time_end_at = data.check_time_end_at;
					var timerangeitem = {
						id: fcomment[t].id,
						name: fcomment[t].name,
						data_type: fcomment[t].data_type,
						display: fcomment[t].display,
						en_name: timerange_enname,
						check_time_start_at: check_time_start_at,
						check_time_end_at: check_time_end_at,
					}
					timerange.push(timerangeitem);
	   			}
	   		}
	   		console.log(JSON.stringify(bottominput));
	   		
	   		//获取被签名和签名
	   		var bysignature = {};
	   		var signature = {};
	   		var datatimeinput = [];
	   		for(var t = 0;t<fcomment.length;t++){
	   			//被签名
	   			if(fcomment[t].en_name == 'signed_by_the_inspection_operator'){
	   				var sign_enname = fcomment[t].en_name;
	   				var data = inforotm.data;
	   				console.log(data.signed_by_the_inspection_operator);
	   				var bysignature = {
	   					id: fcomment[t].id,
						name: fcomment[t].name,
						data_type: fcomment[t].data_type,
						display: fcomment[t].display,
						en_name: sign_enname,
						value: 	data.signed_by_the_inspection_operator
	   				};
	   			}
	   			//签名
	   			if(fcomment[t].en_name == 'signature_of_inspectors'){
	   				var sign_enname = fcomment[t].en_name;
	   				var data = inforotm.data;
	   				console.log(data.signature_of_inspectors);
	   				var signature = {
	   					id: fcomment[t].id,
						name: fcomment[t].name,
						data_type: fcomment[t].data_type,
						display: fcomment[t].display,
						en_name: sign_enname,
						value: 	data.signature_of_inspectors
	   				};
	   			}
	   			//请选择签字时间
	   			if(fcomment[t].data_type == 'datetime'){
	   				var datatime_enname = fcomment[t].en_name;
	   				var data = inforotm.data;
	   				for (var key in data) {
						if(datatime_enname == key){
							var datatimeitem = {
							id: fcomment[t].id,
							name: fcomment[t].name,
							data_type: fcomment[t].data_type,
							display: fcomment[t].display,
							en_name: datatime_enname,
							value: 	data[key]
							}
							datatimeinput.push(datatimeitem);
						}
						
	          		}
	   			}
	   		}
	   		
	   			
	   		//过滤主类为空
	   		
	   		if(inforotm.comment_list){
	   			var formlist = inforotm.comment_list;
	   		}else{
		   		for(var ft = 0;ft<allformlisttype.length;ft++){
		   			if(allformlisttype[ft].en_name == tablename){
		   				var formlist  = allformlisttype[ft].comment_list;
		   			}
		   		}
	   		}
	   		
	   		
	   		var commentarr = [];
	   		for(var st = 0;st<formlist.length;st++){
	   			if(formlist[st].comment){
	   				var comment = {
	   					comment:formlist[st].comment
	   				}
	   				commentarr.push(comment);
	   			}
	   		}
	   		//过滤主类为空
	   		inforotm.comment_list = commentarr;
	   		var formlist = inforotm.comment_list;
	   		
	   		var data = inforotm.data;
	   		//单选数组
	   		
	   		for (var m = 0; m < formlist.length; m++) {
		      	var nodes = formlist[m];
		      	nodes.childlist = [];
		      	for (var n = 0; n < fcomment.length; n++) {
		        	if (fcomment[n].comment && fcomment[n].comment == nodes.comment && fcomment[n].data_type == 'tinyint') {
		          		var checkbokvalue = data[fcomment[n].en_name]
		          		fcomment[n].chexkboxval = checkbokvalue;
		          		var check = JSON.parse(fcomment[n].score_checkbox_value);
		          		fcomment[n].newcheck = [];
		          		for (var key in check) {
		            		var arr = { name: check[key], value: key };
		            		fcomment[n].newcheck.push(arr);
		          		}
		          		var note = JSON.parse(inforotm.note);
		          		var notekey = fcomment[n].en_name;
		          		for (var key in note) {
		            		if (key == notekey) {
		              			fcomment[n].note = note[key];
		            		}
		          		}
		          		var opendisplay = inforotm.data.if_field_show;
		          		for (var key in opendisplay) {
		            		if (key == notekey) {
		              			fcomment[n].itemopen = opendisplay[key];
		            		}
		          		}
		          		nodes.childlist.push(fcomment[n]);
		        	}
		      	}
		    }
	   		//是否开发
	   		if(inforotm.data.is_open == 0){
				openitems = [
			      { name: 1, value: '开放全部', checked: false },
				  { name: 2, value: '部分开放', checked: false },
				{ name: 0, value: '不开放', checked: true  }]
			}
	   		if(inforotm.data.is_open == 1){
				openitems = [
			     
			      { name: 1, value: '开放全部', checked: true },
				  { name: 2, value: '部分开放', checked: false },
				 { name: 0, value: '不开放', checked: false  }]
			}
	   		if(inforotm.data.is_open == 2){
				openitems = [
			      { name: 1, value: '开放全部', checked: false },
				  { name: 2, value: '部分开放', checked: true },
				 { name: 0, value: '不开放', checked: false  },]
			}

	   		
//	   		表checklist__notification_form数据
	   		var res_data = inforotm.data;
	   		//获取用户类型
//	   		userType = userType;
	   		
	   		
	   		var allformlist = {
	   			id: inforotm.checklist_type.id,
	   			topinput:topinput,
	   			bottominput:bottominput,
	   			timerange:timerange,
	   			bysignature:bysignature,   //被签名
	   			signature:signature, //检查人员
	   			datatimeinput: datatimeinput, //检查时间
	   			res_data:res_data,   //表checklist__check_result。专用
//	   			date_of_signature_of_operator:date_of_signature_of_operator, //检查开始时间
//	   			signed_by_the_inspection_operator:signed_by_the_inspection_operator, //检查结束时间
	   			en_name: inforotm.checklist_type.en_name,
	   			bussinessarr: bussinessarr,
	   			is_open: openitems,
	   			type_name: inforotm.checklist_type.type_name,
	   			name: inforotm.checklist_type.comment,
	   			userType: userType,
	   			radiolist: formlist.reverse()
	   		}
	   		
	   		
	   		 //调用模板引擎
		   	var formTemplateScript = $("#"+tablename).html();
			var formTemplate = Handlebars.compile(formTemplateScript);
			var ascontext = allformlist;
			var formHtml = formTemplate(ascontext);
			$("#form-content").html(formHtml);
			
			//显示遮罩层
			$("#my-mui-mask").show();
			//显示表单
			$(".mask-pop").show();
	   	}
	   	 
	   	$("#formbtn-cancel").click(function(){
	   		//显示遮罩层
			$("#my-mui-mask").hide();
			//显示表单
			$(".mask-pop").hide();
	   	})
	   	$(".returnbtn").on("click",function(){
						sasas();
					})
	   	function sasas(){
	   		var url = rooturl+'index.php/Api/Apps/Jingkaiqu/Investigate_record/insertData';
			console.log(mobile);
			console.log(userType);
			console.log(clientType);
			console.log(accessToken);
			console.log(alluserid);
			var parent_id = 0;
			
			var investigate_task_id = $(".investigate_task_id").val();
			var name = $(".name").val();
			var is_open = $('input[type="radio"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();
			
			
			console.log(is_open);
			console.log(note);
			
			
			console.log(url);
				$("#my-mask").show();
				console.log('123113');
				$.ajax({
					url: url,
					data: {
						mobile: mobile,
						userType: userType,
						clientId: "sadaoikkjlsaflkhl",
						clientType: clientType,
						accessToken: accessToken,
						name: name,
						investigate_task_id:investigate_task_id,
						check_start_at:check_start_at,
						check_end_at:check_end_at,
						corp_name:corp_name,
						residence: residence,
						ids_of_operate_admin: alluserid,
						parent_id:parent_id
					},
					type: 'post',
					dataType: 'json',
					crossDomain: true,
					cache: true,
					beforeSend: function(xhr) { //beforeSend定义全局变量
						xhr.setRequestHeader("If-Modified-Since", "0"); //If-Modified-Since HTTP请求头标签,即比较浏览器缓存页面时间
					},
					success: function(res) {
						$("#my-mask").hide();
						if(res.code && res.code == 1000){
							window.new_investigate_record_id = res.data.new_investigate_record_id;
							mui.toast(res.message);
						}else{
							mui.alert(res.message);
							return false;
						}
					},
					error:function(res){
						$("#my-mask").show();
						console.log('1211112');
					}
				})
	   	}
	   	
	   	
	   	addformitem = function(){
	   		console.log('1313');
			var allformlisttype = localStorage.getItem("allformlisttype");
			console.log(allformlisttype);
//			for()
			//弹出选择器普通示例
				var userPicker = new mui.PopPicker();
				userPicker.setData(['浙江省食品生产经营登记管理日常监督检查表（小餐饮店）','浙江省食品生产经营登记管理日常监督检查表（食品摊贩）','未读']);
				userPicker.show(function(items) {
						console.log(items[0]);
						userResult.innerText = items[0];
						//返回 false 可以阻止选择框的关闭
						//return false;
				});
				
				templateform('checklist__daily_check__catering__catering_service__small_store');
				console.log('1313');
	   	}
	})
})