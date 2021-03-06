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
var searchService, markers = [];
var map, center, marker, isFirst = true,
	info, geocoder, listener, markersArray = [];

$(function() {
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

		console.log(accessToken);

		//获取检查表类型
		var self = plus.webview.currentWebview();
		var item = [];
		if(self.objinfo.is_open == 1) {
			items = [{
					name: 0,
					value: '展示',
					checked: true
				},
				{
					name: 1,
					value: '隐藏',
					checked: false
				}
			]
		} else {
			items = [{
					name: 0,
					value: '展示',
					checked: false
				},
				{
					name: 1,
					value: '隐藏',
					checked: true
				}
			]
		}
		//一打开页面设置window.checklist
		window.checklist = [];
		window.namelist = self.objinfo.operate_admin;

		if(self.objinfo.filelist == 'undefined ') {
			window.picimg = [];
		} else {
			window.picimg = self.objinfo.filelist;
		}

		//设置队友开放状态
		self.objinfo.is_openitem = items;

		//获取managetask传递来的数据,显示检查表内容，包含编辑和新建的数据
		var forminfo = self.objinfo;
		forminfo.rooturl = rooturl;
		//	   	forminfo.receive_admin_group = window.namelist;

		window.forminfo = forminfo;
		//调用模板引擎
		var recordformTemplateScript = $("#recordform-template").html();
		var recordformTemplate = Handlebars.compile(recordformTemplateScript);
		var context = forminfo;
		var therecordformHtml = recordformTemplate(context);
		$("#recordform-content").html(therecordformHtml);
		init(forminfo);
		//打开根据前端提交的表单en_name,打开对应的表单模板
		templateform = function(tablename) {
			var forminfo = window.forminfo;
			var tablename = tablename;
			var allformlisttype = localStorage.getItem('allformlisttype');
			window.nullformtemplate = localStorage.getItem('allformlisttype');
			var allformlisttype = JSON.parse(allformlisttype);
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
			//获取经营类型type_of_business
			window.inforotm = inforotm;

			if(inforotm.field_comment) {
				var fcomment = inforotm.field_comment;
			} else {
				for(var ft = 0; ft < allformlisttype.length; ft++) {
					if(allformlisttype[ft].en_name == tablename) {
						var fcomment = allformlisttype[ft].field_comment;
					}
				}
			}
			window.template_data = inforotm.template_data;

			//			prompt('template_data',JSON.stringify(window.template_data));

			if(!inforotm.data) {
				inforotm.data = inforotm.template_data;
			}

			console.log(accessToken);
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
				//	   			console.log(JSON.stringify(dataitem));
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
						fcomment[n].newcheck = [];
						for(var key in check) {
							var arr = {
								name: check[key],
								value: key
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
						name: 2,
						value: '部分开放',
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
				openitems = [

					{
						name: 1,
						value: '开放全部',
						checked: true
					},
					{
						name: 2,
						value: '部分开放',
						checked: false
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
						name: 2,
						value: '部分开放',
						checked: true
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
			console.log(JSON.stringify(inforotm));
			var allformlist = {
				id: inforotm.id,
				rooturl: rooturl,
				topinput: topinput,
				bottominput: bottominput,
				timerange: timerange,
				bysignature: bysignature, //被签名
				signature: signature, //检查人员
				datatimeinput: datatimeinput, //检查时间
				res_data: res_data, //表checklist__check_result。专用
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
			console.log(allformlist.id);
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

		//检查表确认
		$(".returnbtn").on("click", function() {
			var investigate_record_id = $(".investigate_record_id").val();
			if(investigate_record_id) {
				console.log(investigate_record_id);
				edit(investigate_record_id);
			} else {
				sasas(mobile, userType, clientType, accessToken, alluserid);
			}

		});
		//检查表取消
		$(".calcel").on("click", function() {
			mui.back(); 
			var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
			 
			mui.fire(list, 'refresh',{
				reload:'true'
			});  //返回true,继续页面关闭逻辑
			return true;
		});
		//获取管理员列表,接收人
		$("html").on('click', '.getorigin', function() {

			mui.openWindow({
				url: 'manageselect.html',
				id: 'manageselect',
				extras: {
					"receive_admin_group": window.namelist
				}
			});
			event.stopPropagation();
		})

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
			var is_open = $('input[type="radio"]:checked').val();
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
					clientId: "sadaoikkjlsaflkhl",
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
					is_open: is_open
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
						//						if(window.checklist.length){
						////							当存在表单的时候
						//							edit(res.data.new_investigate_record_id);
						//						}else{
						////							不在表单的时候
						//							window.checklist = [];
						//							edit(res.data.new_investigate_record_id);
						//						}
					} else {
						mui.alert(res.message);
						return false;
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

			var investigate_task_id = $(".investigate_task_id").val();
			var name = $(".name").val();
			var is_open = $('input[type="radio"]:checked').val();
			var corp_name = $(".corp_name").val();
			var residence = $(".residence").val();
			var check_start_at = $(".starttime").val();
			var check_end_at = $(".endtime").val();
			var note = $(".note").val();
			var lat = $("#lat").val();
			var lng = $("#lng").val();

			console.log(window.picimg);
			var imglistarr = window.picimg;
			for(var imgnum in imglistarr) {
				imglistarr[imgnum].is_open = $(".img_is_open").eq(imgnum).val();
				imglistarr[imgnum].note = $(".textnote").eq(imgnum).val();
			}
			console.log(JSON.stringify(imglistarr));
			//			for(){}

			//			return false;
			//			
			//			var filelist = window.picimg;
			//			if(filelist && filelist.length >0){
			//				for(var item in filelist){
			//					filelist[item].investigate_record_id = id;
			//				}
			//			}else{
			//				var filelist = [];
			//			}
			var checklist = window.checklist;

			//			if(checklist && checklist.length >0){
			//				for (var cnum in checklist) {
			//					checklist[cnum].data.investigate_record_id = id;
			//					checklist[cnum].data.id = id;
			//				}
			//			}else{
			//				checklist = [];
			//			}
			//			prompt("打印checklist",JSON.stringify(checklist));
			//			prompt("原数据",JSON.stringify(window.forminfo.checklist));
			var namearr = [];
			var parr = [];
			var pjson = [];
			if(window.forminfo.checklist) {
				pjson = window.forminfo.checklist;
			} else {
				pjson = [];
			}
			console.log(pjson.length);

			if(pjson.length > 0) {
				if(checklist.length > 0) {
					for(var m = 0; m < checklist.length; m++) {
						console.log(JSON.stringify(checklist[m]));
						namearr.push(checklist[m].table_name);
					}
					for(var p = 0; p < pjson.length; p++) {
						parr.push(pjson[p].table_name);
						if(namearr.indexOf(pjson[p].table_name == '-1')) {
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
			$.ajax({
				url: url,
				data: {
					mobile: mobile,
					userType: userType,
					clientId: "sadaoikkjlsaflkhl",
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
					lng: lng

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
						mui.toast(res.message);
						//在关闭窗口代码上加入延迟
						mui.back(); 
						var list = plus.webview.currentWebview().opener();  //触发父页面的自定义事件(refresh),从而进行刷新
						 
						mui.fire(list, 'refresh',{
							reload:'true'
						});  //返回true,继续页面关闭逻辑
						return true;
					} else {
						$("#my-mask").hide();
						mui.alert(res.message);
						return false;
					}
				},
				error: function(res) {
					alert('请求失败');
					prompt("打印錯誤res", JSON.stringify(res));
					console.log(JSON.stringify(res));
					console.log('请求失败');
					$("#my-mask").hide();
					console.log('1211112');
				}
			})
		}
		window.currentformlist = [];
		//点击添加，打开选择器，选取需要添加的表单
		addformitem = function() {
			//获取表单类型，包含所有表单的em_name和corp_name
			var allformlisttype = JSON.parse(localStorage.getItem("allformlisttype"));
			var formnamelist = [];
			//重组数据循环导入选择器
			for(var listnum = 0; listnum < allformlisttype.length; listnum++) {
				var jsonform = {
					text: allformlisttype[listnum].checklist_type.comment,
					value: allformlisttype[listnum].checklist_type.en_name
				}
				formnamelist.push(jsonform);
			}

			//弹出选择器普通示例
			var userPicker = new mui.PopPicker();
			userPicker.setData(formnamelist);
			userPicker.show(function(items) {

				var en_name = items[0].value;
				console.log(en_name);
				templateform(en_name);
				userPicker.hide();
				//获取选中表单，存入全局

				window.currentformlist.push(en_name);
				window.current_enname = en_name;
				window.current_formname = items[0].text;
			});

		}
		$('html').on('click', '.openform', function() {
			templateform($(this).data("enname"));
		});

		//	   	添加图片
		$('html').on('click', '#addbtn-img', function() {
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
				type: "hour", //设置日历初始视图模式 
				beginDate: new Date(1015, 04, 25), //设置开始日期 
				endDate: new Date(3016, 04, 25), //设置结束日期 
			})
			dtpicker.show(function(e) {
				that.val(e.value);
			});
		});

		//获取表单填写数据
		$("#getformdata").click(function() {
			var formjson = $('#formsubmit').serializeObject();

			console.log(JSON.stringify(formjson));

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
			console.log('12');
			console.log(JSON.stringify(template_data));
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


			for(var al = 0; al < allformlisttype.length; al++) {
				if(allformlisttype[al].en_name == formjson.table_name) {
					allformlisttype[al].data = template_data;
					allformlisttype[al].data.note = note;
				}
			}

			var allformlisttype = JSON.stringify(allformlisttype);
			window.useallformlisttype = allformlisttype;
			//			localStorage.setItem('allformlisttype',allformlisttype);

			console.log(allformlisttype);
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
			window.checklist.push(formitem);

			//修改		window.checklist = checklist;

			console.log(JSON.stringify(formjson.id));
			if(formjson.id == '' || formjson.id == undefined) {
				//插入检查表记录
				var current_enname = window.current_enname;
				var current_formname = window.current_formname;
				var mode = '<div class="mui-collapse-content" style="border-top: 1px solid #cccccc;"><p class="openform" data-enname="' + current_enname + '">' + current_formname + '</p></div>'
				$("#formlistadd").prepend(mode);
			}
			//隐藏遮罩层
			$("#my-mui-mask").hide();
			//隐藏表单
			$(".mask-pop").hide();
		});

		//图片上传	
		// 扩展API加载完毕后调用onPlusReady回调函数
		document.addEventListener("plusready", onPlusReady, false);
		// 扩展API加载完毕，现在可以正常调用扩展API
		function onPlusReady() {
			console.log("plusready");
		}

		//图片上传
		function plusReady() {
			// 弹出系统选择按钮框
			mui("body").on("tap", ".imageup", function() {
				var that = $(this);
				page.imgUp(that);
			})

		}
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

		if(window.plus) {
			//      	未知影响
			//          plusReady();
		} else {
			document.addEventListener("plusready", plusReady, true);
		}
	})

	function init(options) {
		console.log(JSON.stringify(options));

		if(options === null) {
			alert('数据不能为空');
			return false;
		}
		if(options.lat != '' && options.lng != '' &&
			options.corporation_address_components != null &&
			options.corporation_address_components.city == '温州市' &&
			typeof(options.corporation_address_components.street) != 'undefined' &&
			options.corporation_address_components.street != '') {
			var center = new qq.maps.LatLng(options.lat, options.lng);
			boot(center, options);
			isFirst = false;
		} else {
			alert('定位数据不准确,请重新定位');

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
				alert('搜索定位失败,请手动定位或更改关键字');
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
		/*绑定触发的各种操作*/
		$('#searchAddress').unbind('click').bind('click', function() {
			var addresskey = $("#addresskey").val();
			if(addresskey == '') {
				alert('请输入准确地址');
				return false;
			}
			var selecta = addresskey.replace(/中国/, "");
			var selectb = selecta.replace(/浙江省/, "");
			var selectc = selectb.replace(/温州市/, "");
			console.log('中国浙江省温州市' + selectc);
			var searchcontent = '中国浙江省温州市' + selectc
			//通过getLocation();方法获取位置信息值
			geocoder.getLocation(searchcontent);
		})
		//图标点击后触发定位
		qq.maps.event.addListener(marker, 'click', function(event) {
			geocoder.getAddress(center);
		});
		//地图点击后定位新地址

		qq.maps.event.addListener(map, 'click', function(event) {
			console.log('122');

			var lat = event.latLng.getLat();
			var lng = event.latLng.getLng();
			var latLng = new qq.maps.LatLng(lat, lng);
			options.loading = true;
			geocoder.getAddress(latLng);
		});
		/*绑定搜索框事件*/
		$(options.searchElem).bind('keypress', function(event) {
			if(event.keyCode == "13") {
				var searchkey = $(options.searchElem).val();
			}
		});
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