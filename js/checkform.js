//FORm序列化转json
$.fn.serializeObject = function() {
	var o = {};
	var oarr = [];
	var  a  = this.serializeArray();
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
var searchService, markers = [];
var map, center, marker, isFirst = true,
	info, geocoder, listener, markersArray = [];

$(function() {
	//	权限判断
	var rootpower = [{
			obj:'.rereview',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record/insertRecheckRecord',
			describe:'添加复查记录'
		},{
			obj:'#badmanage',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/License/setLicenseStatus',
			describe:'经营异常'
		},{
			obj:'.editrecord',
			apiurl:'/index.php/Api/Apps/Jingkaiqu/Investigate_record/editData',
			describe:'编辑记录'
		}];
	
	function getNow(s) {
		return s < 10 ? '0' + s : s;
	}
	var myDate = new Date();
	//获取当前年
	var year = myDate.getFullYear();
	//获取当前月
	var month = myDate.getMonth() + 1;
	//获取当前日
	var date = myDate.getDate();
	var h = myDate.getHours(); //获取当前小时数(0-23)
	var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	var s = myDate.getSeconds();

	window.now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m);

	//	添加
	window.addEventListener("selectman", function(e) {
		//选择辖区后返回获取辖区id，筛选
		//调用模板引擎
		window.namelist = e.detail.cityName;

		var managenamelistTemplateScript = $("#namelist").html();
		var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
		var context = window.namelist;
		var managenamelistHtml = managenamelistTemplate(context);
		$("#managenamelist").html(managenamelistHtml);
	})
	//	删除检查人员
	$("html").on('click', '.deletecheckman', function() {
		console.log('121');
		console.log($(this).attr("data-id"));
		var iden = $(this).attr("data-id");
		var namearr = window.namelist;
		console.log(JSON.stringify(namearr));
		var arrs = [];
		for(var i = 0; i < namearr.length; i++) {
			if(namearr[i].id === iden) {
				continue;
			} else {
				arrs.push(namearr[i]);
			}
		}
		window.namelist = arrs;
		var managenamelistTemplateScript = $("#namelist").html();
		var managenamelistTemplate = Handlebars.compile(managenamelistTemplateScript);
		var context = window.namelist;
		var managenamelistHtml = managenamelistTemplate(context);
		$("#managenamelist").html(managenamelistHtml);
	});

	//	获取参数
	mui.plusReady(function() {
		var admininfo = localStorage.getItem('admininfo');
		window.admininfo = JSON.parse(localStorage.getItem('admininfo'));
		//获取检查表类型
		var self = plus.webview.currentWebview();
		console.log(self.alone);
		if(self.alone == 'alone') {
			window.alone = 'alone';
		} else {
			window.alone = 'noalone';
		}
		var item = [];
		if(self.objinfo.is_open == 1) {
			items = [{
					name: 0,
					value: '展示',
					checked: 'true'
				},
				{
					name: 1,
					value: '隐藏',
					checked: 'false'
				}
			]
		} else {
			items = [{
					name: 0,
					value: '展示',
					checked: 'false'
				},
				{
					name: 1,
					value: '隐藏',
					checked: 'true'
				}
			]
		}
		//一打开页面设置window.checklist

		window.checklist = [];
		window.currentchecklist = [];
		window.currentformlist = [];
		//				获取所有个数内容
		window.inchecknum = {
			alreadycheck: 0,
			commonlycheck: 0,
			commonlycheckstring: '',
			keycheck: 0,
			keycheckstring: '',
			issuecommonnum: 0,
			issuecommonstring: '',
			issueimportnum: 0,
			issueimporstring: '',
		}

		//已检查个数		window.checknum = '';
		window.namelist = self.objinfo.operate_admin;
		window.type_of = self.type_of;
		
		window.licenseinfo = self.licenseinfo;
		if(self.objinfo.filelist == undefined) {
			window.picimg = new Array();
		} else {
			window.picimg = self.objinfo.filelist;
		}
		console.log(JSON.stringify(window.picimg));
		//设置队友开放状态
		self.objinfo.is_openitem = items;
		//获取managetask传递来的数据,显示检查表内容，包含编辑和新建的数据
		var forminfo = self.objinfo;
		if(self.objinfo.checklist == null){
			
		}else{
			if(self.objinfo.checklist != 'null' && self.objinfo.checklist.length >0){
				var mygetchecklist = self.objinfo.checklist;
				for(var myitem in mygetchecklist){
					if(mygetchecklist[myitem].table_name == 'checklist__check_result'){
						if(mygetchecklist[myitem].data.result_processing == ''){
							$('.deal-result').show();
							$('.noresult').show();
						}
						if(mygetchecklist[myitem].data.result_processing == '2'){
							$('.deal-result').show();
							$('.tomake').show();
						}
					}
				}
			}
		}
		
		forminfo.type_of = window.type_of.checklist;
		var type_of = window.type_of.checklist;
		if(window.type_of.checklist && window.type_of.checklist.length>0){
			for(var a = 0; a < type_of.length; a++) {
				console.log(type_of[a].en_name);
				window.currentformlist.push(type_of[a].en_name);
			}
		}else{
			window.currentformlist = [];
		}
		forminfo.rooturl = rooturl;
		console.log(userType);
		forminfo.userType = userType;
		//	   	forminfo.receive_admin_group = window.namelist;
		window.forminfo = forminfo;
//		console.log(JSON.stringify(window.forminfo));
		//调用模板引擎
		
		var recordformTemplateScript = $("#recordform-template").html();
		var recordformTemplate = Handlebars.compile(recordformTemplateScript);
		
		forminfo._three_small_status = window.licenseinfo._three_small_status;
		var context = forminfo;
		var therecordformHtml = recordformTemplate(context);
		$("#recordform-content").html(therecordformHtml);

		init(forminfo);
		
		//权限配置
		console.log('权限配置');
		for(var itemn in rootpower){
			ispower(rootpower[itemn].obj,rootpower[itemn].apiurl);
		}
		//打开根据前端提交的表单en_name,打开对应的表单模板
		templateform = function(tablename, nums) {
			var forminfo = window.forminfo;
//			console.log(JSON.stringify(forminfo));
			var tablename = tablename;
			var allformlisttype = localStorage.getItem('allformlisttype');
			window.nullformtemplate = localStorage.getItem('allformlisttype');
			if(allformlisttype) {
				var allformlisttype = JSON.parse(allformlisttype);
			}
			
			window.useallformlisttype = allformlisttype;

			var allformlisttype = window.useallformlisttype;

			//	   		var tablename = 'checklist__check_point__food_sale__circulation__unit';
			//   		var tablename = 'checklist__check_result';  //未完成
			//	   		var tablename = 'checklist__daily_check__catering__catering_service__small_store';
			//	   		var tablename = 'checklist__daily_check__catering__food_vendors'; //缺经营类型
			//	   		var tablename = 'checklist__daily_check__food_production__small_workshop';
			//	   		var tablename = 'checklist__daily_check__food_sale__small_store';   //小杂食
			//	   		var tablename = 'checklist__check_point__catering__catering_service__unit'; //表 1-3餐饮服务日常监督检查要点表
			//	   		var tablename = 'checklist__check_point__food_production__unit'; //表1-1
			//	   		var tablename = 'checklist__notification_form';  //告知野，未完成
			//所有表单数据
			if(forminfo.checklist && forminfo.checklist.length > 0) {
				var checklist = forminfo.checklist;
//				console.log(JSON.stringify(checklist));
//				console.log('12121222');
				//存在则取数据
			} else {
				//不存在去默认模板数据
				var checklist = allformlisttype;
			}

			var comment_list = [];
			var formlist = [];
			var islive = 0;
			var inforotm = [];
			//获取对应表单数据
			for(var a = 0; a < checklist.length; a++) {
				if(checklist[a].checklist_type.en_name == tablename) {
					inforotm = checklist[a];
					for(var a = 0; a < allformlisttype.length; a++) {
						if(allformlisttype[a].checklist_type.en_name == tablename) {
							allformlisttype[a].id = "";
							inforotm.template_data = allformlisttype[a].template_data;
						}
					}
				}
			}
			if(inforotm.length == 0) {
				for(var a = 0; a < allformlisttype.length; a++) {
					if(allformlisttype[a].checklist_type.en_name == tablename) {
						allformlisttype[a].id = "";
						inforotm = allformlisttype[a];
					}
				}
			}
			//获取经营类型1type_of_business
			window.inforotm = inforotm;

//			console.log(JSON.stringify(window.inforotm));
//			console.log('2222');

			if(inforotm.field_comment) {
				var fcomment = inforotm.field_comment;
//				console.log('1212');
			} else {
//				console.log(JSON.stringify(allformlisttype));
//				console.log('dd');
				for(var ft = 0; ft < allformlisttype.length; ft++) {
					if(allformlisttype[ft].en_name == tablename) {
						console.log(JSON.stringify(allformlisttype[ft].field_comment));
						var fcomment = allformlisttype[ft].field_comment;
					}
				}
			}
			window.template_data = inforotm.template_data;

			if(!inforotm.data) {
				inforotm.data = inforotm.template_data;
			}
//			console.log(clientId);
//			console.log(JSON.stringify(fcomment));
			for(var t = 0; t < fcomment.length; t++) {
				if(fcomment[t].en_name == 'type_of_business') {
					var value = parseInt(inforotm.data.type_of_business);
					var checkitem = JSON.parse(fcomment[t].score_checkbox_value);
					var checkarr = [];
					for(var key in checkitem) {
						var arr = {
							name: checkitem[key],
							checkitem: key
						};
						checkarr.push(arr);
					}
					var bussinessarr = {
						name: fcomment[t].name,
						en_name: fcomment[t].en_name,
						value: value,
						checkitem: checkarr
					};
				}
			}

			//获取头部input
			var topinput = [];
			for(var t = 0; t < fcomment.length; t++) {
				if(fcomment[t].data_type == 'varchar') {
					var top_enname = fcomment[t].en_name;
					var data = inforotm.data;
					for(var key in data) {
						if(top_enname == key) {
							var dataitem = {
								id: fcomment[t].id,
								name: fcomment[t].name,
								data_type: fcomment[t].data_type,
								display: fcomment[t].display,
								en_name: top_enname,
								value: data[key]
							}
							topinput.push(dataitem);
						}
					}
				} else if(fcomment[t].en_name == 'type_of_business' || fcomment[t].data_type == 'timerange') {
					break;
				}
			}

			//获取底部部input
			var bottominput = [];
			var timerange = [];
			for(var t = 0; t < fcomment.length; t++) {
				if(fcomment[t].data_type == 'tinytext') {
					var buttom_enname = fcomment[t].en_name;
					var data = inforotm.data;
					for(var key in data) {
						if(buttom_enname == key) {
							var bottomitem = {
								id: fcomment[t].id,
								name: fcomment[t].name,
								data_type: fcomment[t].data_type,
								display: fcomment[t].display,
								en_name: buttom_enname,
								value: data[key]
							}
							bottominput.push(bottomitem);
						}

					}
				}
				if(fcomment[t].data_type == 'timerange') {
					console.log(fcomment[t].en_name);
					if(fcomment[t].en_name == 'check_time') {
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
							en_startname: 'check_time_start_at',
							en_endname: 'check_time_end_at',
							check_time_start_at: check_time_start_at,
							check_time_end_at: check_time_end_at,
						}
					}
					if(fcomment[t].en_name == 'business_hours') {
						var timerange_enname = fcomment[t].en_name;
						var data = inforotm.data;
						var business_hours_start_at = data.business_hours_start_at;
						var business_hours_end_at = data.business_hours_end_at;

						var timerangeitem = {
							id: fcomment[t].id,
							name: fcomment[t].name,
							data_type: fcomment[t].data_type,
							display: fcomment[t].display,
							en_name: timerange_enname,
							en_startname: 'business_hours_start_at',
							en_endname: 'business_hours_end_at',
							check_time_start_at: business_hours_start_at,
							check_time_end_at: business_hours_end_at,
						}
					}
					timerange.push(timerangeitem);
				}
			}
			//获取被签名和签名
			var bysignature = {};
			var signature = {};
			var datatimeinput = [];
			for(var t = 0; t < fcomment.length; t++) {
				//被签名
				if(fcomment[t].en_name == 'signed_by_the_inspection_operator') {
					var sign_enname = fcomment[t].en_name;
					var data = inforotm.data;
					var bysignature = {
						id: fcomment[t].id,
						name: fcomment[t].name,
						data_type: fcomment[t].data_type,
						display: fcomment[t].display,
						en_name: sign_enname,
						value: data.signed_by_the_inspection_operator
					};
				}
				//签名
				if(fcomment[t].en_name == 'signature_of_inspectors') {
					var sign_enname = fcomment[t].en_name;
					var data = inforotm.data;
					console.log(data.signature_of_inspectors);
					var signature = {
						id: fcomment[t].id,
						name: fcomment[t].name,
						data_type: fcomment[t].data_type,
						display: fcomment[t].display,
						en_name: sign_enname,
						value: data.signature_of_inspectors
					};
				}
				//请选择签字时间
				if(fcomment[t].data_type == 'datetime') {
					var datatime_enname = fcomment[t].en_name;
					var data = inforotm.data;
					for(var key in data) {
						if(datatime_enname == key) {
							var datatimeitem = {
								id: fcomment[t].id,
								name: fcomment[t].name,
								data_type: fcomment[t].data_type,
								display: fcomment[t].display,
								en_name: datatime_enname,
								value: data[key]
							}
							datatimeinput.push(datatimeitem);
						}

					}
				}
			}

			//过滤主类为空

			if(inforotm.comment_list) {
				var formlist = inforotm.comment_list;
			} else {
				for(var ft = 0; ft < allformlisttype.length; ft++) {
					if(allformlisttype[ft].en_name == tablename) {
						var formlist = allformlisttype[ft].comment_list;
					}
				}
			}

			var commentarr = [];
			for(var st = 0; st < formlist.length; st++) {
				if(formlist[st].comment) {
					var comment = {
						comment: formlist[st].comment
					}
					commentarr.push(comment);
				}
			}
			//过滤主类为空
			inforotm.comment_list = commentarr;
			var formlist = inforotm.comment_list;

			var data = inforotm.data;
			//单选数组

			for(var m = 0; m < formlist.length; m++) {
				var nodes = formlist[m];
				nodes.childlist = [];
				for(var n = 0; n < fcomment.length; n++) {
					if(fcomment[n].comment && fcomment[n].comment == nodes.comment && fcomment[n].data_type == 'tinyint') {
						var checkbokvalue = data[fcomment[n].en_name]
						fcomment[n].chexkboxval = checkbokvalue;
						var check = JSON.parse(fcomment[n].score_checkbox_value);
						var indent = JSON.parse(fcomment[n].index);
						var isimportant = JSON.parse(fcomment[n].is_important);

						fcomment[n].newcheck = [];
						for(var key in check) {
							var arr = {
								name: check[key],
								value: key,
								indent: indent,
								isimportant: isimportant
							};
							fcomment[n].newcheck.push(arr);
						}
						var note = inforotm.data.note;
						var notekey = fcomment[n].en_name;
						for(var key in note) {
							if(key == notekey) {
								fcomment[n].note = note[key];
							}
						}
						var opendisplay = inforotm.data.if_field_show;
						for(var key in opendisplay) {
							if(key == notekey) {
								fcomment[n].itemopen = opendisplay[key];
							}
						}
						nodes.childlist.push(fcomment[n]);
					}
				}
			}

			//是否开发
			if(inforotm.data.is_open == 0) {
				openitems = [{
						name: 1,
						value: '开放全部',
						checked: false
					},
					{
						name: 0,
						value: '不开放',
						checked: true
					}
				]
			}
			if(inforotm.data.is_open == 1) {
				openitems = [{
						name: 1,
						value: '开放全部',
						checked: true
					},
					{
						name: 0,
						value: '不开放',
						checked: false
					}
				]
			}
			if(inforotm.data.is_open == 2) {
				openitems = [{
						name: 1,
						value: '开放全部',
						checked: false
					},
					{
						name: 0,
						value: '不开放',
						checked: false
					},
				]
			}

			var res_data = inforotm.data;
			//获取用户类型
			//	   		userType = userType;

			if(nums == '1') {
				var formlistss = formlist;
			} else {
				var formlistss = formlist.reverse();
			}
			
			if(formlistss[0]){
				if(formlistss[0].childlist == ''){
					var formlistss = formlist.reverse();
					console.log('1');
				}else{
					if(formlistss[0].childlist[0].index == '1.1' || formlistss[0].childlist[0].index == '1'){
						var formlistss = formlist;
						console.log('2');
					}else{
						var formlistss = formlist.reverse();
						console.log('3');
					}
				}
			}
			
			console.log('检查表');
			console.log(tablename);
			
			if(window.forminfo.task){
				var type_info = window.forminfo.task.license.type_info.checklist;
			}else{
				var type_info = window.forminfo.type_of;
			}
			
			
			for(var items in type_info){
				if(type_info[items].en_name == tablename){
					var default_data = type_info[items].default_data
				}
			}
		
			var allformlist = {
				id: inforotm.id,
				rooturl: rooturl,
				topinput: topinput,
				bottominput: bottominput,
				timerange: timerange,
				bysignature: bysignature, //被签名
				signature: signature, //检查人员
				datatimeinput: datatimeinput, //检查时间
				default_data:default_data, //添加默认表
				res_data: res_data, //表checklist__check_result。专用
				//	   			date_of_signature_of_operator:date_of_signature_of_operator, //检查开始时间
				//	   			signed_by_the_inspection_operator:signed_by_the_inspection_operator, //检查结束时间
				en_name: inforotm.checklist_type.en_name,
				bussinessarr: bussinessarr,
				is_open: openitems,
				type_name: inforotm.checklist_type.type_name,
				name: inforotm.checklist_type.comment,
				userType: userType,
				radiolist: formlistss,
				licenseinfo: window.licenseinfo,
				inchecknum: window.inchecknum,
				admininfo: window.admininfo,
				nowtime: window.now
			}

			//调用模板引擎
			var formTemplateScript = $("#" + tablename).html();
			var formTemplate = Handlebars.compile(formTemplateScript);
			var ascontext = allformlist;
			var formHtml = formTemplate(ascontext);
			$("#form-content").html(formHtml);

			//显示遮罩层
			$("#my-mui-mask").show();
			//显示表单
			$(".mask-pop").show();
		}

		$("#formbtn-cancel").click(function() {
			//显示遮罩层
			$("#my-mui-mask").hide();
			//显示表单
			$(".mask-pop").hide();
		})

		$('html').on('click', '.templateitem', function() {
			var en_name = $(this).attr('data-enname');
			var type = $(this).attr('data-type');
			var cn_name = $(this).attr('data-cnname');
			window.current_enname = en_name;
			window.current_formname = cn_name;
			templateform(en_name, type);
		})

		//检查表确认
		$(".returnbtn").on("click", function() {
			var myresultcheck = window.checklist;
			var getmylist = [];
			var is_open = $('input[name="is_opens"]:checked').val();
//			当前存在的表单,(待处理)
			var currentchecklist = window.currentchecklist;
			var existjson = window.type_of.checklist;
			var investigate_record_id = $(".investigate_record_id").val();
			if(window.alone == 'alone') {
				console.log(investigate_record_id);
				if(investigate_record_id) {
					edit(investigate_record_id);
				} else {
					alonerecords();
				}
			} else {
				if(investigate_record_id) {
					console.log(investigate_record_id);
					edit(investigate_record_id);
				} else {
					newrecord(mobile, userType, clientType, accessToken, alluserid);
				}
			}
		});
		//检查表取消
		$(".calcel").on("click", function() {
			localStorage.setItem('allformlisttype', '');
			mui.back();
			var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
			 
			mui.fire(list, 'refresh', {
				reload: 'true'
			});  //返回true,继续页面关闭逻辑
			return true;
		});

		//获取管理员列表,接收人
		$("html").on('click', '.getorigin', function() {

			console.log(window.namelist);

			mui.openWindow({
				url: 'manageselect.html',
				id: 'manageselect',
				extras: {
					"receive_admin_group": window.namelist
				}
			});
			event.stopPropagation();
		})

		//获取管理员列表,接收人
		$("html").on('click', '.getmanage', function() {

			console.log(window.namelist);

			mui.openWindow({
				url: 'selectdome.html',
				id: 'selectdome',
				extras: {
					"receive_admin_group": window.namelist
				}
			});
			event.stopPropagation();
		})
		
		$('html').on('tap','#badmanage',function(){
//			添加
			console.log(JSON.stringify(window.licenseinfo));
			
			console.log(typeof(window.licenseinfo));
			var licenseinfo = window.licenseinfo;
			
			console.log(JSON.stringify(licenseinfo));
			var selectlist = [{value:'正常',text:'正常'},{value:'注销',text:'注销'},{value:'失效',text:'失效'},{value:'特殊',text:'特殊'},{value:'异常',text:'异常'}]
			
			//弹出选择器普通示例
			var userPicker = new mui.PopPicker();
			userPicker.setData(selectlist);
			userPicker.show(function(items) {
				if(JSON.stringify(licenseinfo) == '{}'||JSON.stringify(licenseinfo) == '[]'){
					mui.toast('证书不完善,请填写完整!');
				}else{
					var btnArray = ['否', '是'];
					mui.confirm('确认经营状态为'+items[0].value+'', '经营状态', btnArray, function(e) {
						if (e.index == 1) {
							var license_id = licenseinfo.id;
							badmanage(license_id,items[0].value);
						} else {
							mui.toast('取消!');
						}
					})
				}
			});
		})
//		经营异常
		function badmanage(license_id,license_valid_status_name){
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/License/setLicenseStatus';
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					license_id: license_id,
					license_valid_status_name:license_valid_status_name,
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
					$("#my-mask").hide();
					if(res.code && res.code == 1000) {
						mui.toast(res.message);
					} else {
						mui.alert(res.message);
					}
				},
				error: function(res) {
					$("#my-mask").hide();
					mui.alert(res.message);
				}
			})
		}
		
//		新建记录
		function newrecord(mobile, userType, clientType, accessToken, alluserid){
			var name = $(".name").val();
			var is_open = $('input[name="is_opens"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();
			var investigate_task_id = $(".investigate_task_id").val();
			console.log(is_open);

			console.log(window.picimg);
			var imglistarr = window.picimg;
			for(var imgnum in imglistarr) {
				imglistarr[imgnum].is_open = $(".img_is_open").eq(imgnum).val();
				imglistarr[imgnum].note = $(".textnote").eq(imgnum).val();
				imglistarr[imgnum].original_name = $(".text_name").eq(imgnum).val();
			}
			//			console.log(JSON.stringify(imglistarr));

			var checklist = window.checklist;

			var namearr = [];
			var parr = [];
			var pjson = [];
			if(window.forminfo.checklist) {
				pjson = window.forminfo.checklist;
			} else {
				pjson = [];
			}

			if(pjson.length > 0) {
				if(checklist.length > 0) {
					for(var m = 0; m < checklist.length; m++) {
						console.log(JSON.stringify(checklist[m]));
						namearr.push(checklist[m].table_name);
					}
					if(namearr.length > 1) {
						var namestring = namearr.join(",");
					} else {
						var namestring = namearr[0];
					}

					for(var p = 0; p < pjson.length; p++) {
						parr.push(pjson[p].table_name);
						if(namestring.indexOf(pjson[p].table_name) == '-1') {
							delete pjson[p].data['id'];
							delete pjson[p].data['investigate_task_id'];
							delete pjson[p].data['investigate_record_id'];
							delete pjson[p].data['id_group_of_admin'];
							delete pjson[p].data['sort'];
							delete pjson[p].data['first_fillin_at'];
							delete pjson[p].data['display'];
							delete pjson[p].data['created_at'];
							delete pjson[p].data['updated_at'];
							delete pjson[p].data['deleted_at'];
							delete pjson[p].data['author_admin_id'];
							delete pjson[p].data['author_name'];
							console.log(JSON.stringify(pjson[p]));
							checklist.push(pjson[p]);
						}
					}
				} else {
					for(var p = 0; p < pjson.length; p++) {
						delete pjson[p].data['id'];
						delete pjson[p].data['investigate_task_id'];
						delete pjson[p].data['investigate_record_id'];
						delete pjson[p].data['id_group_of_admin'];
						delete pjson[p].data['sort'];
						delete pjson[p].data['first_fillin_at'];
						delete pjson[p].data['display'];
						delete pjson[p].data['created_at'];
						delete pjson[p].data['updated_at'];
						delete pjson[p].data['deleted_at'];
						delete pjson[p].data['author_admin_id'];
						delete pjson[p].data['author_name'];
						checklist.push(pjson[p]);
					}
				}
			} else {
				if(checklist.length > 0) {
					checklist = checklist;
				} else {
					checklist = [];
				}
			}
			var numlist = [];
			var namelist = window.namelist;
			for(var ind in namelist) {
				numlist[ind] = namelist[ind].id;
			}

			if(numlist.length > 0) {
				var alluserarr = numlist.join(",")
			} else {
				var alluserarr = alluserid;
			}

			$("#my-mask").show();

			console.log(investigate_task_id);
//			console.log(JSON.stringify(id));
			console.log(name);
			console.log(is_open);
			console.log(corp_name);
			console.log(residence);
			console.log(check_start_at);
			console.log(check_end_at);
			console.log(note);
			console.log(lat);
			console.log(lng);
			console.log(investigate_task_id);
			console.log(JSON.stringify(alluserid));
			console.log(JSON.stringify(imglistarr));
			console.log(JSON.stringify(checklist));
//			未完成
//			return false;
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Investigate_record/insertData';
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					name: name,
					investigate_task_id: investigate_task_id,
					check_start_at: check_start_at,
					check_end_at: check_end_at,
					status:status,
					note:note,
					corp_name: corp_name,
					residence: residence,
					ids_of_operate_admin: alluserid,
					is_open: is_open,
					filelist:imglistarr,
					checklist:checklist,
					lat:lat,
					lng:lng,
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
					$("#my-mask").hide();
					if(res.code && res.code == 1000) {
						mui.toast(res.message);
//						console.log(JSON.stringify(res));

//						console.log(JSON.stringify(checklist));
						if(JSON.stringify(checklist) == '[]'){
							var btnArray = ['否', '是'];
							mui.confirm('没有填写检查表，确认？', '提交检查表', btnArray, function(e) {
								if (e.index == 1) {
									localStorage.setItem('allformlisttype', '');
									//在关闭窗口代码上加入延迟
									mui.back();
									var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
									mui.fire(list, 'refresh', {
										reload: 'true'
									});  //返回true,继续页面关闭逻辑
									return true;
								} else {
									mui.toast('取消');
									return false;
								}
							})
						}else{
							for(var myaitem in checklist){
								if(checklist[myaitem].table_name == 'checklist__check_result'){
									var myresultlist = checklist[myaitem];
								}
							}
							switch(myresultlist.data.result_processing)
							{
							case '':
							  	$('.noresult').show();
								$('.tomake').hide();
								mui.alert('没有填写检查结果');
								return false;
							  	break;
							case '2':
							  	$('.tomake').show();
								$('.noresult').hide();
								var btnArray = ['否', '是'];
								mui.confirm('将生成复查记录，确认？', '提交检查表', btnArray, function(e) {
									if (e.index == 1) {
										mui.toast('确认');
										$(".investigate_record_id").val(res.data.new_investigate_record_id);
										recheckrecord(alluserid,'wrong');
										localStorage.setItem('allformlisttype', '');
										//在关闭窗口代码上加入延迟
										mui.back();
										var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
										 
										mui.fire(list, 'refresh', {
											reload: 'true'
										});  //返回true,继续页面关闭逻辑
										return true;
									} else {
										mui.toast('取消');
										return false;
									}
								})
							  	break;
							default:
							  	localStorage.setItem('allformlisttype', '');
								//在关闭窗口代码上加入延迟
								mui.back();
								var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
								 
								mui.fire(list, 'refresh', {
									reload: 'true'
								});  //返回true,继续页面关闭逻辑
								return true;
							}
						}
					} else {
						$("#my-mask").hide();
						mui.alert(res.message);
					}
				},
				error: function(res) {
					$("#my-mask").hide();
					mui.alert(res.message);
				}
			})
		}
		
//		点击添加复查监管记录
		$('html').on('click','.recheckbtn',function(){
			recheckrecord(alluserid);
		})

	//生成复查监管记录方法
		function recheckrecord(alluserid,isreturn){
			if(isreturn == ''){
				var isreturn = 'right';
			}else{
				var isreturn = isreturn;
			}
			var name = $(".name").val();
			var is_open = $('input[name="is_opens"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			
			var parent_id= $(".investigate_record_id").val();
			console.log(parent_id);
			var note = $(".note").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();
			var investigate_task_id = $(".investigate_task_id").val();
			console.log(is_open);

			console.log(window.picimg);
			var imglistarr = window.picimg;
			for(var imgnum in imglistarr) {
				imglistarr[imgnum].is_open = $(".img_is_open").eq(imgnum).val();
				imglistarr[imgnum].note = $(".textnote").eq(imgnum).val();
				imglistarr[imgnum].original_name = $(".text_name").eq(imgnum).val();
			}
			//			console.log(JSON.stringify(imglistarr));

			var checklist = window.checklist;

			var namearr = [];
			var parr = [];
			var pjson = [];
			if(window.forminfo.checklist) {
				pjson = window.forminfo.checklist;
			} else {
				pjson = [];
			}

			if(pjson.length > 0) {
				if(checklist.length > 0) {
					for(var m = 0; m < checklist.length; m++) {
						console.log(JSON.stringify(checklist[m]));
						namearr.push(checklist[m].table_name);
					}
					if(namearr.length > 1) {
						var namestring = namearr.join(",");
					} else {
						var namestring = namearr[0];
					}

					for(var p = 0; p < pjson.length; p++) {
						parr.push(pjson[p].table_name);
						if(namestring.indexOf(pjson[p].table_name) == '-1') {
							delete pjson[p].data['id'];
							delete pjson[p].data['investigate_task_id'];
							delete pjson[p].data['investigate_record_id'];
							delete pjson[p].data['id_group_of_admin'];
							delete pjson[p].data['sort'];
							delete pjson[p].data['first_fillin_at'];
							delete pjson[p].data['display'];
							delete pjson[p].data['created_at'];
							delete pjson[p].data['updated_at'];
							delete pjson[p].data['deleted_at'];
							delete pjson[p].data['author_admin_id'];
							delete pjson[p].data['author_name'];
							console.log(JSON.stringify(pjson[p]));
							checklist.push(pjson[p]);
						}
					}
				} else {
					for(var p = 0; p < pjson.length; p++) {
						delete pjson[p].data['id'];
						delete pjson[p].data['investigate_task_id'];
						delete pjson[p].data['investigate_record_id'];
						delete pjson[p].data['id_group_of_admin'];
						delete pjson[p].data['sort'];
						delete pjson[p].data['first_fillin_at'];
						delete pjson[p].data['display'];
						delete pjson[p].data['created_at'];
						delete pjson[p].data['updated_at'];
						delete pjson[p].data['deleted_at'];
						delete pjson[p].data['author_admin_id'];
						delete pjson[p].data['author_name'];
						checklist.push(pjson[p]);
					}
				}
			} else {
				if(checklist.length > 0) {
					checklist = checklist;
				} else {
					checklist = [];
				}
			}
			var numlist = [];
			var namelist = window.namelist;
			for(var ind in namelist) {
				numlist[ind] = namelist[ind].id;
			}

			if(numlist.length > 0) {
				var alluserarr = numlist.join(",")
			} else {
				var alluserarr = alluserid;
			}

			$("#my-mask").show();

			console.log(investigate_task_id);
//			console.log(JSON.stringify(id));
			console.log(name);
			console.log(is_open);
			console.log(corp_name);
			console.log(residence);
			console.log(check_start_at);
			console.log(check_end_at);
			console.log(note);
			console.log(lat);
			console.log(lng);
			console.log(investigate_task_id);
			console.log(JSON.stringify(alluserid));
			console.log(JSON.stringify(imglistarr));
			console.log(JSON.stringify(checklist));
			
			for(list in checklist){
				checklist[list].id = '';
			}
//			未完成
//return false;
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Investigate_record/insertRecheckRecord';
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					name: name,
					lat:lat,
					lng:lng,
					investigate_task_id: investigate_task_id,
					check_start_at: check_start_at,
					check_end_at: check_end_at,
					status:status,
					note:note,
					corp_name: corp_name,
					residence: residence,
					ids_of_operate_admin: alluserid,
					is_open: is_open,
					parent_id:parent_id,
					filelist:imglistarr,
					checklist:JSON.stringify(checklist),
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
					$("#my-mask").hide();
					if(res.code && res.code == 1000) {
						console.log(JSON.stringify(res));
						mui.toast(res.message);
						localStorage.setItem('allformlisttype', '');
						if(isreturn == 'right'){
							setTimeout(function() {
								//在关闭窗口代码上加入延迟
								mui.back();
								var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
								 
								mui.fire(list, 'refresh', {
									reload: 'true'
								});  //返回true,继续页面关闭逻辑
								return true;
							}, 500);
						}
						
					} else {
						$("#my-mask").hide();
						mui.alert(res.message);
					}
				},
				error: function(res) {
					$("#my-mask").hide();
					mui.alert(res.message);
				}
			})
		}
		
		
		
		
		//新建时调用获取所有数据，上传获取new_investigate_record_id
		function sasas(mobile, userType, clientType, accessToken, alluserid) {
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Investigate_record/insertData';
			var mobile = mobile;
			var userType = userType;
			var clientType = clientType;
			var accessToken = accessToken;
			var alluserid = alluserid;
			var parent_id = 0;

			var investigate_task_id = $(".investigate_task_id").val();
			var name = $(".name").val();
			var is_open = $('input[name="is_opens"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();

			$("#my-mask").show();
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					name: name,
					investigate_task_id: investigate_task_id,
					check_start_at: check_start_at,
					check_end_at: check_end_at,
					corp_name: corp_name,
					residence: residence,
					ids_of_operate_admin: alluserid,
					parent_id: parent_id,
					is_open: is_open,
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
					$("#my-mask").hide();
					if(res.code && res.code == 1000) {
						window.new_investigate_record_id = res.data.new_investigate_record_id;
						console.log(res.data.new_investigate_record_id);
						//						不在表单的时候
						edit(res.data.new_investigate_record_id);
					} else {
						mui.alert(res.message);

					}
				},
				error: function(res) {
					$("#my-mask").hide();
				}
			})
		}

		//	   	编辑表单
		function edit(cid, lat, lng) {
			if(lat) {
				var lat = lat;
			} else {
				var lat = 27.903418;
			}
			if(lng) {
				var lng = lng;
			} else {
				var lng = 120.853729;
			}

			var id = cid;
			console.log(cid);
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Investigate_record/editData';
			var parent_id = 0;

			if(window.alone == 'alone') {
				var investigate_task_id = '';
			} else {
				var investigate_task_id = $(".investigate_task_id").val();
			}

			var name = $(".name").val();
			var is_open = $('input[name="is_opens"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();

			console.log(is_open);

			console.log(window.picimg);
			var imglistarr = window.picimg;
			for(var imgnum in imglistarr) {
				imglistarr[imgnum].is_open = $(".img_is_open").eq(imgnum).val();
				imglistarr[imgnum].note = $(".textnote").eq(imgnum).val();
				imglistarr[imgnum].original_name = $(".text_name").eq(imgnum).val();
				console.log($(".text_name").eq(imgnum).val());
			}
			//console.log(JSON.stringify(imglistarr));

			var checklist = window.checklist;

			var namearr = [];
			var parr = [];
			var pjson = [];
			if(window.forminfo.checklist) {
				pjson = window.forminfo.checklist;
			} else {
				pjson = [];
			}

			if(pjson.length > 0) {
				if(checklist.length > 0) {
					for(var m = 0; m < checklist.length; m++) {
						console.log(JSON.stringify(checklist[m]));
						namearr.push(checklist[m].table_name);
					}
					if(namearr.length > 1) {
						var namestring = namearr.join(",");
					} else {
						var namestring = namearr[0];
					}

					for(var p = 0; p < pjson.length; p++) {
						parr.push(pjson[p].table_name);
						if(namestring.indexOf(pjson[p].table_name) == '-1') {
							delete pjson[p].data['id'];
							delete pjson[p].data['investigate_task_id'];
							delete pjson[p].data['investigate_record_id'];
							delete pjson[p].data['id_group_of_admin'];
							delete pjson[p].data['sort'];
							delete pjson[p].data['first_fillin_at'];
							delete pjson[p].data['display'];
							delete pjson[p].data['created_at'];
							delete pjson[p].data['updated_at'];
							delete pjson[p].data['deleted_at'];
							delete pjson[p].data['author_admin_id'];
							delete pjson[p].data['author_name'];
							console.log(JSON.stringify(pjson[p]));
							checklist.push(pjson[p]);
						}
					}
				} else {
					for(var p = 0; p < pjson.length; p++) {
						delete pjson[p].data['id'];
						delete pjson[p].data['investigate_task_id'];
						delete pjson[p].data['investigate_record_id'];
						delete pjson[p].data['id_group_of_admin'];
						delete pjson[p].data['sort'];
						delete pjson[p].data['first_fillin_at'];
						delete pjson[p].data['display'];
						delete pjson[p].data['created_at'];
						delete pjson[p].data['updated_at'];
						delete pjson[p].data['deleted_at'];
						delete pjson[p].data['author_admin_id'];
						delete pjson[p].data['author_name'];
						checklist.push(pjson[p]);
					}
				}
			} else {
				if(checklist.length > 0) {
					checklist = checklist;
				} else {
					checklist = [];
				}
			}
			var numlist = [];
			var namelist = window.namelist;
			for(var ind in namelist) {
				numlist[ind] = namelist[ind].id;
			}

			if(numlist.length > 0) {
				var alluserarr = numlist.join(",")
			} else {
				var alluserarr = alluserid;
			}

			$("#my-mask").show();

			console.log(investigate_task_id);
			console.log(JSON.stringify(id));
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					name: name,
					investigate_task_id: investigate_task_id,
					check_start_at: check_start_at,
					check_end_at: check_end_at,
					corp_name: corp_name,
					residence: residence,
					status: status,
					is_open: is_open,
					note: note,
					ids_of_operate_admin: alluserarr,
					id: id,
					checklist: JSON.stringify(checklist),
					filelist: imglistarr,
					lat: lat,
					lng: lng,
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
					$("#my-mask").hide();
					if(res.code && res.code == 1000) {
						mui.toast(res.message);
						for(var myaitem in checklist){
							if(checklist[myaitem].table_name == 'checklist__check_result'){
								var myresultlist = checklist[myaitem];
							}
						}
						
						switch(myresultlist.data.result_processing)
						{
						case '':
						  	$('.noresult').show();
							$('.tomake').hide();
							mui.alert('没有填写检查结果');
							return false;
						  	break;
						case '2':
						  	$('.tomake').show();
							$('.noresult').hide();
							var btnArray = ['否', '是'];
							mui.confirm('将生成复查记录，确认？', '提交检查表', btnArray, function(e) {
								if (e.index == 1) {
									mui.toast('确认');
									recheckrecord(alluserid,'wrong');
									localStorage.setItem('allformlisttype', '');
									//在关闭窗口代码上加入延迟
									mui.back();
									var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
									 
									mui.fire(list, 'refresh', {
										reload: 'true'
									});  //返回true,继续页面关闭逻辑
									return true;
								} else {
									mui.toast('取消');
									return false;
								}
							})
						  	break;
						default:
							localStorage.setItem('allformlisttype', '');
							//在关闭窗口代码上加入延迟
							mui.back();
							var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
							 
							mui.fire(list, 'refresh', {
								reload: 'true'
							});  //返回true,继续页面关闭逻辑
							return true;
						}
					} else {
						$("#my-mask").hide();
						mui.alert(res.message);
						return false;
					}
				},
				error: function(res) {
					alert(res.messgae);
					//					prompt("打印錯誤res", JSON.stringify(res));
					console.log(JSON.stringify(res));
					console.log(res.messgae);
					$("#my-mask").hide();
					console.log('1211112');
				}
			})
		}

		//点击添加，打开选择器，选取需要添加的表单
		$('html').on('click','#userResult',function(){
			addformitem();
		})
		
//		点击删除检查表
		$('html').on('click','.deleteform',function(){
			var changecurrent = [];
			var currentformlist = window.currentformlist;
			var enname = $(this).attr('data-enname');
			var cnname = $(this).attr('data-cnname');
			for(var item in currentformlist){
				if(currentformlist[item] == enname){
					continue;
				}else{
					changecurrent.push(currentformlist[item]);
				}
			}
			window.currentformlist = changecurrent;
			$(this).parent('div').remove();
		})
		
		
		
		function addformitem() {
//			设置默认选择器内容
			var formnamelist = [];
//			获取type_info
			if(window.forminfo.task){
				var type_info = window.forminfo.task.license.type_info.checklist;
			}else{
				var type_info = window.forminfo.type_of;
			}
			//重组数据循环导入选择器
			for(var num in type_info) {
				var jsonform = {
					text: type_info[num].cn_name,
					value: type_info[num].en_name
				}
				formnamelist.push(jsonform);
			}
			//弹出选择器普通示例
			var userPicker = new mui.PopPicker();
			userPicker.setData(formnamelist);
			userPicker.show(function(items) {
				var en_name = items[0].value;
				templateform(en_name);
				userPicker.hide();
				//获取选中表单，存入全局
				window.current_enname = en_name;
				window.current_formname = items[0].text;
			});
		}

		//		单独建立监管记录
		function alonerecords() {
			var investigate_task_id = $(".investigate_task_id").val();
			var name = $(".name").val();
			var is_open = $('input[name="is_opens"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();

			console.log(is_open);

			console.log(window.picimg);
			var imglistarr = window.picimg;
			for(var imgnum in imglistarr) {
				imglistarr[imgnum].is_open = $(".img_is_open").eq(imgnum).val();
				imglistarr[imgnum].note = $(".textnote").eq(imgnum).val();
			}
			//			console.log(JSON.stringify(imglistarr));

			var checklist = window.checklist;

			var namearr = [];
			var parr = [];
			var pjson = [];
			if(window.forminfo.checklist) {
				pjson = window.forminfo.checklist;
			} else {
				pjson = [];
			}

			if(pjson.length > 0) {
				if(checklist.length > 0) {
					for(var m = 0; m < checklist.length; m++) {
						console.log(JSON.stringify(checklist[m]));
						namearr.push(checklist[m].table_name);
					}
					if(namearr.length > 1) {
						var namestring = namearr.join(",");
					} else {
						var namestring = namearr[0];
					}

					for(var p = 0; p < pjson.length; p++) {
						parr.push(pjson[p].table_name);
						if(namestring.indexOf(pjson[p].table_name) == '-1') {
							delete pjson[p].data['id'];
							delete pjson[p].data['investigate_task_id'];
							delete pjson[p].data['investigate_record_id'];
							delete pjson[p].data['id_group_of_admin'];
							delete pjson[p].data['sort'];
							delete pjson[p].data['first_fillin_at'];
							delete pjson[p].data['display'];
							delete pjson[p].data['created_at'];
							delete pjson[p].data['updated_at'];
							delete pjson[p].data['deleted_at'];
							delete pjson[p].data['author_admin_id'];
							delete pjson[p].data['author_name'];
							console.log(JSON.stringify(pjson[p]));
							checklist.push(pjson[p]);
						}
					}
				} else {
					for(var p = 0; p < pjson.length; p++) {
						delete pjson[p].data['id'];
						delete pjson[p].data['investigate_task_id'];
						delete pjson[p].data['investigate_record_id'];
						delete pjson[p].data['id_group_of_admin'];
						delete pjson[p].data['sort'];
						delete pjson[p].data['first_fillin_at'];
						delete pjson[p].data['display'];
						delete pjson[p].data['created_at'];
						delete pjson[p].data['updated_at'];
						delete pjson[p].data['deleted_at'];
						delete pjson[p].data['author_admin_id'];
						delete pjson[p].data['author_name'];
						checklist.push(pjson[p]);
					}
				}
			} else {
				if(checklist.length > 0) {
					checklist = checklist;
				} else {
					checklist = [];
				}
			}
			var numlist = [];
			var namelist = window.namelist;
			for(var ind in namelist) {
				numlist[ind] = namelist[ind].id;
			}

			if(numlist.length > 0) {
				var alluserarr = numlist.join(",")
			} else {
				var alluserarr = alluserid;
			}

			var investigate_task_id = $(".investigate_task_id").val();
			var name = $(".name").val();
			var is_open = $('input[name="is_opens"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();

//			console.log(investigate_task_id);
//			console.log(name);
//			console.log(is_open);
//			console.log(corp_name);
//			console.log(residence);
//			console.log(check_start_at);
//			console.log(check_end_at);
//			console.log(note);
//			console.log(lat);
//			console.log(status);
//			console.log(lng);
//			console.log(JSON.stringify(alluserarr));
//			console.log(JSON.stringify(checklist));
//			console.log(JSON.stringify(imglistarr));

			//			return false;
			var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Investigate_record/createRecordByLicenseId';
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: clientId,
					clientType: clientType,
					accessToken: accessToken,
					name: name,
					check_start_at: check_start_at,
					check_end_at: check_end_at,
					corp_name: corp_name,
					residence: residence,
					status: status,
					is_open: is_open,
					note: note,
					ids_of_operate_admin: alluserarr,
					id: '',
					checklist: JSON.stringify(checklist),
					filelist: imglistarr,
					lat: lat,
					lng: lng,
					license_id: investigate_task_id,
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
					$("#my-mask").hide();
					if(res.code && res.code == 1000) {
						mui.toast(res.message);
						localStorage.setItem('allformlisttype', '');
						//在关闭窗口代码上加入延迟
						mui.back();
						var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
						 
						mui.fire(list, 'refresh', {
							reload: 'true'
						});  //返回true,继续页面关闭逻辑
						return true;
					} else {
						$("#my-mask").hide();
						mui.alert(res.message);
					}
				},
				error: function(res) {
					console.log(JSON.stringify(res));
					$("#my-mask").hide();
				}
			})
		}

		$('html').on('click', '.openform', function() {
			templateform($(this).data("enname"), '1');
		});

		//	   	添加图片

		$('html').on('click', '#addbtn-img', function() {

			console.log(JSON.stringify(window.picimg));

			var imglistTemplateScript = $("#imglist").html();
			var imglistTemplate = Handlebars.compile(imglistTemplateScript);
			var ascontext = {
				is_open: 0
			};
			var imglistHtml = imglistTemplate(ascontext);
			$("#addimg").append(imglistHtml);
		});

		//	   	添加文件
		$('html').on('click', '#addbtn-file', function() {
			var filelistTemplateScript = $("#filelist").html();
			var filelistTemplate = Handlebars.compile(filelistTemplateScript);
			var ascontext = {
				asa: 'as'
			};
			var filelistHtml = filelistTemplate(ascontext);
			$("#addfile").append(filelistHtml);
		});

		//日期时间选择器，公用
		$('html').on("click", '.time', function() {
			var that = $(this);
			var dtpicker = new mui.DtPicker({
				type: "datetime", //设置日历初始视图模式 
				beginDate: new Date(1015, 04, 25), //设置开始日期 
				endDate: new Date(3016, 04, 25), //设置结束日期 
			})
			dtpicker.show(function(e) {
				that.val(e.value);
			});
		});

		//		修改radio单选 ,修改is_check
		$('html').on('click', '.test', function() {
			console.log('当前radio的值' + $(this).val());
			var currentval = $(this).val();
			$(this).parent().find('.is_check').val(currentval);
		})

//		$('html').on('click',"input[name='rd']:checked",function(){
//			$(this).val();
//		})


		//获取表单填写数据
		$("#getformdata").click(function() {
			
			var myresult = $("input[name='result_processing']:checked").val();
			var table = $("input[name='table_name']").val();
			if(table =='checklist__check_result'){
				if(myresult == ''){
					$('.deal-result').show();
					$('.noresult').show();
				}
				if(myresult == '2'){
					$('.deal-result').show();
					$('.tomake').show();
				}
			}
			
			//			获取表单重点项
			var alreadycheck = 0;
			var commonlycheck = 0;
			var commonlycheckarr = [];
			var keycheck = 0;
			var keycheckarr = [];
			//			有问题项
			var issueimportarr = [];
			var issuecommonarr = [];
			var issueimportnum = 0;
			var issuecommonnum = 0;

			var is_checknum = $('.is_check');
			console.log(is_checknum.length);
			if(is_checknum.length > 0) {
				for(var b = 0; b < is_checknum.length; b++) {
					if(is_checknum.eq(b).val() != '0') {
						alreadycheck = alreadycheck+1;
						//						已检查个数
					}
					if(is_checknum.eq(b).val() != '0' && is_checknum.eq(b).attr('data-isimportant') == '0') {
						//						一般项
						commonlycheck = commonlycheck+1;
						//						一般个数
						commonlycheckarr.push(is_checknum.eq(b).attr('data-id'));
						//						一般id数组

					}
					if(is_checknum.eq(b).val() != '0' && is_checknum.eq(b).attr('data-isimportant') == '1') {
						//						重点项
						keycheck = keycheck+1;
						//						重点个数
						keycheckarr.push(is_checknum.eq(b).attr('data-id'));
						//						重点id数组
					}

					if(is_checknum.eq(b).val() == '2' && is_checknum.eq(b).attr('data-isimportant') == '0') {
						issuecommonnum = issuecommonnum+1;
						//						有问题一般个数
						issuecommonarr.push(is_checknum.eq(b).attr('data-id'));
						//						有问题一般id数组
					}
					if(is_checknum.eq(b).val() == '2' && is_checknum.eq(b).attr('data-isimportant') == '1') {
						issueimportnum = issueimportnum+1;
						//						有问题重点个数
						issueimportarr.push(is_checknum.eq(b).attr('data-id'));
						//						有问题重点id数组
					}
				}

				//				获取所有个数内容
				var alreadycheck = alreadycheck;
				//				已检查个数
				var commonlycheck = commonlycheck;
				//				一般个数
				var commonlycheckstring = commonlycheckarr.join(',');
				//				一般个数编号字符串

				var keycheck = keycheck;
				//				重点个数
				var keycheckstring = keycheckarr.join(',');
				//				重点个数编号字符串

				var issuecommonnum = issuecommonnum;
				//				有问题一般个数
				var issuecommonstring = issuecommonarr.join(',');
				//				有问题一般编号字符串

				var issueimportnum = issueimportnum;
				//				有问题重点个数
				var issueimporstring = issueimportarr.join(',');
				//				有问题重点编号字符串

				window.inchecknum.alreadycheck = parseInt(window.inchecknum.alreadycheck) + parseInt(alreadycheck);
				window.inchecknum.commonlycheck = parseInt(window.inchecknum.commonlycheck) + parseInt(alreadycheck);
				if(window.inchecknum.commonlycheckstring) {
					window.inchecknum.commonlycheckstring = window.inchecknum.commonlycheckstring + ',' + commonlycheckstring;
				} else {
					window.inchecknum.commonlycheckstring = commonlycheckstring;
				}

				window.inchecknum.keycheck = parseInt(window.inchecknum.keycheck) + parseInt(keycheck);
				if(window.inchecknum.keycheckstring) {
					window.inchecknum.keycheckstring = window.inchecknum.keycheckstring + ',' + keycheckstring;
				} else {
					window.inchecknum.keycheckstring = keycheckstring;
				}

				window.inchecknum.issuecommonnum = parseInt(window.inchecknum.issuecommonnum) + parseInt(alreadycheck);

				if(window.inchecknum.keycheckstring) {
					window.inchecknum.issuecommonstring = window.inchecknum.issuecommonstring + ',' + issuecommonstring;
				} else {
					window.inchecknum.issuecommonstring = issuecommonstring;
				}

				window.inchecknum.issueimportnum = parseInt(window.inchecknum.issueimportnum) + parseInt(alreadycheck);
				if(window.inchecknum.keycheckstring) {
					window.inchecknum.issueimporstring = window.inchecknum.issueimporstring + ',' + issueimporstring;
				} else {
					window.inchecknum.issueimporstring = issueimporstring;
				}
			}
			//未完成

			var formjson = $('#formsubmit').serializeObject();
//			console.log('在这');
//			console.log(JSON.stringify(formjson.name));
			formjson.name = formjson.result_name;
			var orginData = formjson;
			var postData = {};
			var note = {};
			//获取note
			for(var d_index in orginData) {
				if(d_index.indexOf('note.') !== -1) {
					var noteArr = d_index.split('.');
					var noteIndex = noteArr[1];
					note[noteIndex] = orginData[d_index];
				} else {
					postData[d_index] = orginData[d_index];
				}
			}
			postData.note = note;
			var note = postData.note;
			var template_data = window.template_data;

			//待定
//			console.log('12');
//			console.log(JSON.stringify(template_data));

			if(template_data) {
				delete template_data['id'];
				delete template_data['investigate_task_id'];
				delete template_data['investigate_record_id'];
				delete template_data['id_group_of_admin'];
				delete template_data['first_fillin_at'];
				delete template_data['sort'];
				delete template_data['display'];
				delete template_data['created_at'];
				delete template_data['updated_at'];
				delete template_data['deleted_at'];
				delete template_data['author_admin_id'];
				delete template_data['author_name'];
			}

			for(var j in formjson) {
				for(var d in template_data) {
					if(d == j) {
						template_data[d] = formjson[j];
					}
				}
			}
			var allformlisttype = window.useallformlisttype;

			console.log(JSON.stringify(template_data));
			console.log('222');

			for(var al = 0; al < allformlisttype.length; al++) {
				if(allformlisttype[al].en_name == formjson.table_name) {
					allformlisttype[al].data = template_data;
					allformlisttype[al].data.note = note;
				}
			}

			var allformlisttype = JSON.stringify(allformlisttype);

			console.log(allformlisttype);

			//			window.useallformlisttype = allformlisttype;
			localStorage.setItem('allformlisttype', allformlisttype);

			console.log(allformlisttype);
			console.log('222');

			//			if(){}编辑时，需加判断note，注意
			window.template_data.note = note;
			var checklist = [];
			var formitem = {
				id: "",
				table_name: formjson.table_name,
				data: window.template_data,
			}

			//			JSON.stringify(formitem);
			checklist.push(formitem);
			//			alert(JSON.stringify(formjson.table_name));

			//下方修改
			var checkdad = window.checklist;
			var issave = 0;
			for(var checkitem in checkdad) {
				if(checkdad[checkitem].table_name == formitem.table_name) {
					checkdad[checkitem] = formitem;
					issave = 1;
				}
			}
			if(issave == 0) {
				window.checklist.push(formitem);
			}

			console.log(formitem);
			console.log('212221');
			//修改		window.checklist = checklist;

			console.log(JSON.stringify(formjson.id));
			if(formjson.id == '' || formjson.id == undefined) {
				console.log(JSON.stringify(window.currentformlist));
				var nowformarr = window.currentformlist;
				console.log(JSON.stringify(nowformarr));
				console.log(window.current_enname);
				var n = 0;
				for(var i = 0; i < nowformarr.length; i++) {
					if(nowformarr[i] == window.current_enname) {
						n = n + 1;
					}
				}
				if(n < 1) {
					//插入检查表记录
					var current_enname = window.current_enname;
					var current_formname = window.current_formname;

					var mode = '<div class="mui-collapse-content" style="border-top: 1px solid #cccccc;display: flex;align-items:center;">'+
					'<p class="openform" data-type="1" style="flex:4;line-height: 0.7rem;font-size: 16px;word-break: break-all;" data-enname="' + current_enname + '">' + current_formname + '</p>'+
					'<p class="deleteform" data-enname="'+current_enname+'" data-cnname="'+current_formname+'">删除</p>'+
					'</div>'
					$("#formlistadd").prepend(mode);
					//					window.currentchecklist.push(window.current_enname);
					window.currentformlist.push(window.current_enname);
				}
			}
			console.log(checkdad);

			window.currentchecklist.push(window.current_enname);
			//隐藏遮罩层
			$("#my-mui-mask").hide();
			//隐藏表单
			$(".mask-pop").hide();
		});

		//图片上传	
		//		// 扩展API加载完毕后调用onPlusReady回调函数
		//		document.addEventListener("plusready", onPlusReady, false);
		//		// 扩展API加载完毕，现在可以正常调用扩展API
		//		function onPlusReady() {
		//			console.log("plusready");
		//		}

		//图片上传
		//		function plusReady() {
		//			// 弹出系统选择按钮框
		//			mui("body").on("tap", ".imageup", function() {
		//				var that = $(this);
		//				page.imgUp(that);
		//			})
		//
		//		}

		$('html').on('click', '.imageup', function() {
			var that = $(this);

			console.log(JSON.stringify(window.picimg));
			//			return false;
			page.imgUp(that);
		})

		var page = null;
		page = {
			imgUp: function(that) {
				var m = this;
				plus.nativeUI.actionSheet({
					cancel: "取消",
					buttons: [{
							title: "拍照"
						},
						{
							title: "从相册中选择"
						}
					]
				}, function(e) { //1 是拍照  2 从相册中选择  
					console.log(e.index);
					switch(e.index) {
						case 1:
							appendByCamera(that);
							break;
						case 2:
							appendByGallery(that);
							break;
					}
				});
			}
			//摄像头  
		}

		// 拍照添加文件
		function appendByCamera(that) {
			var cmr = plus.camera.getCamera(1);
			var res = cmr.supportedImageResolutions[0];
			var fmt = cmr.supportedImageFormats[0];
			cmr.captureImage(function(p) {
				plus.io.resolveLocalFileSystemURL(p, function(entry) {
					setImg(entry.toLocalURL(), that);
				}, function(e) {});
			}, function(e, that) {}, {
				index: 1,
				filename: "_doc/camera/"
			});

		}
		// 从相册添加文件
		function appendByGallery(that) {
			plus.gallery.pick(function(path) {
				that.find(".imgsrc").attr("src", path);
				upload(that);
			});
		}

		function setImg(src, that) {
			that.find(".imgsrc").attr("src", src);
			upload(that);
		}

		//服务端接口路径
		var server = rooturl + "index.php/Api/Apps/Jingkaiqu/Investigate_record_file/multiUpload";
		//获取图片元素

		// 上传文件

		function upload(that) {
			console.log(that.find(".imgsrc").attr("src"));
			var wt = plus.nativeUI.showWaiting();
			var task = plus.uploader.createUpload(server, {
					method: "POST",
					dataType: 'JSON'
				},
				function(t, status) { //上传完成
					if(status == 200) {
						var res = JSON.parse(t.responseText);
						if(res.code && res.code == 1000) {
							var result = res.data;
							res.data[0].note = '';
							res.data[0].is_open = '0';
							window.picimg.push(res.data[0]);
							alert("上传成功：" + res.message);
						} else {
							wt.close(); //关闭等待提示按钮
							alert("上传失败：" + res.message);
							return false;
						}
						wt.close(); //关闭等待提示按钮

					} else {
						alert("上传失败：" + status);
						wt.close(); //关闭等待提示按钮
						return false;
					}
				}
			);
			//添加其他参数
			task.addData("mobile", mobile);
			task.addData("userType", userType);
			task.addData("clientType", clientType);
			task.addData("clientId", clientId);
			task.addData("accessToken", accessToken);
			var len = $(".imgsrc").length;
			task.addFile(that.find(".imgsrc").attr("src"), {
				key: "file"
			})
			task.start();
		}

		//		if(window.plus) {
		//			//      	未知影响
		//			//          plusReady();
		//		} else {
		//			document.addEventListener("plusready", plusReady, true);
		//		}
	})

	function init(options) {
		console.log(JSON.stringify(options));

		if(options === null) {
			alert('数据不能为空');
			return false;
		}

		console.log(options.lat);
		console.log(options.lng);
		if(options.lat != '' && options.lng != '' &&
			options.corporation_address_components != null &&
			options.corporation_address_components.city == '温州市' &&
			typeof(options.corporation_address_components.street) != 'undefined' &&
			options.corporation_address_components.street != '') {

			var center = new qq.maps.LatLng(options.lat, options.lng);
			boot(center, options);
			isFirst = false;
		} else {
			//			mui.toast('定位数据不准确,请重新定位!');

			var center = new qq.maps.LatLng(mylatitude, mylongitude);
			boot(center, options);

			//huoqu 
			//		getLocationByAddress(options.residence);
		}

	}
	/*根据地址文字搜索定位*/
	function getLocationByAddress(address) {
		geocoder = new qq.maps.Geocoder({
			complete: function(results) {
				console.log(results);
				console.log('1212');
				var center = new qq.maps.LatLng(results.lat, results.lng);
				boot(center, options);
			},
			error: function(err, msg) {
				//				alert('搜索定位失败,请手动定位或更改关键字');
				isFirst = false;
			}
		});
		geocoder.getLocation(address);

	}
	/*根据经纬度搜索定位*/
	function boot(center, options) {
		map = new qq.maps.Map(document.getElementById("container"), {
			center: center,
			zoom: 13
		});
		//创建标记
		marker = new qq.maps.Marker({
			position: center,
			map: map
		});
		markersArray.push(marker); //存储标记
		//添加到提示窗
		info = new qq.maps.InfoWindow({
			map: map
		});
		geocoder = new qq.maps.Geocoder({
			complete: function(result) {
				//地图图标移动操作
				map.setCenter(result.detail.location);
				deleteOverlays(); //清除之前的标记
				marker = new qq.maps.Marker({ //添加新的标记
					map: map,
					position: result.detail.location
				});
				markersArray.push(marker); //存储标记
				//设置定位信息为定位后数据
				var address = '';
				var parts = ['country', 'province', 'city', 'district', 'town', 'street', 'streetNumber'];
				for(var part_index in parts) {
					if(typeof(result.detail.addressComponents[parts[part_index]]) != 'undefined') {
						address += result.detail.addressComponents[parts[part_index]];
					}
				}
				options.corporation_address = address; //变更后使用解析的地址

				console.log(JSON.stringify(result.detail));

				$("#lat").val(result.detail.location.lat);
				$("#lng").val(result.detail.location.lng);
				options.lat = result.detail.location.lat;
				options.lng = result.detail.location.lng;
				options.addressComponents = result.detail.addressComponents;
				$('#corporation_address').val(options.corporation_address);
				$('#corporation_address_components').val(JSON.stringify(options.addressComponents));
				/*提示框内容设定*/
				options.loading = false;
				info.open();
				var corporation_address = options.corporation_address;
				corporation_address = corporation_address.replace(/中国/, "");
				corporation_address = corporation_address.replace(/浙江省/, "");
				corporation_address = corporation_address.replace(/温州市/, "");
				info.setContent('<div style="width:200px;height:50px;font-size:14px">' + corporation_address + '</div>');
				info.setPosition(result.detail.location);
				qq.maps.event.addListener(marker, 'click', function() {
					info.open();
					var corporation_address = options.corporation_address;
					corporation_address.replace(/中国/, "");
					corporation_address.replace(/浙江省/, "");
					corporation_address.replace(/温州市/, "");
					info.setContent('<div style="width:200px;height:50px;font-size:14px;">' + corporation_address + '</div>');
					info.setPosition(result.detail.location);
				});
			},
			error: function(err, msg) {
				alert('搜索定位失败,请手动定位或更改关键字');
			}
		});
		/*默认触发第一次定位*/
		options.loading = true;
		geocoder.getAddress(center);
		/*绑定触发的各种操作,搜索框*/
		//		$('#searchAddress').unbind('click').bind('click', function() {
		//			var addresskey = $("#addresskey").val();
		//			if(addresskey == '') {
		//				alert('请输入准确地址');
		//				return false;
		//			}
		//			var selecta = addresskey.replace(/中国/, "");
		//			var selectb = selecta.replace(/浙江省/, "");
		//			var selectc = selectb.replace(/温州市/, "");
		//			console.log('中国浙江省温州市' + selectc);
		//			var searchcontent = '中国浙江省温州市' + selectc
		//			//通过getLocation();方法获取位置信息值
		//			geocoder.getLocation(searchcontent);
		//		})
		//图标点击后触发定位
		qq.maps.event.addListener(marker, 'click', function(event) {
			geocoder.getAddress(center);
		});
		//地图点击后定位新地址

		//		qq.maps.event.addListener(map, 'click', function(event) {
		//			console.log('122');
		//
		//			var lat = event.latLng.getLat();
		//			var lng = event.latLng.getLng();
		//			var latLng = new qq.maps.LatLng(lat, lng);
		//			options.loading = true;
		//			geocoder.getAddress(latLng);
		//		});
		/*绑定搜索框事件*/
		//		$(options.searchElem).bind('keypress', function(event) {
		//			if(event.keyCode == "13") {
		//				var searchkey = $(options.searchElem).val();
		//			}
		//		});
		/*通用的方法*/
		/*添加标记*/
		function addMarker(location) {
			marker = new qq.maps.Marker({
				position: location,
				map: map
			});
			markersArray.push(marker);
		}
		/*清除覆盖层*/
		function clearOverlays() {
			if(markersArray) {
				for(i in markersArray) {
					markersArray[i].setMap(null);
				}
			}
		}
		/*显示覆盖层*/
		function showOverlays() {
			if(markersArray) {
				for(i in markersArray) {
					markersArray[i].setMap(map);
				}
			}
		}
		/*删除覆盖物*/
		function deleteOverlays() {
			if(markersArray) {
				for(i in markersArray) {
					markersArray[i].setMap(null);
				}
				markersArray.length = 0;
			}
		}
	}

})