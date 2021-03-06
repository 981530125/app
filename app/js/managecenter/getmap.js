$('#my-mask').show();
coordinate();
function coordinate() {
	var latitude;
	var longitude;
	var map, markersArray = [];
	//判断是否支持 获取本地位置
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		x.innerHTML = "浏览器不支持定位.";
	}

	function showPosition(position) {
		latitude = position.coords.latitude - 0.003002;
		longitude = position.coords.longitude + 0.004671;
		window.latitude =latitude;
		window.longitude = longitude;
		getroundshop(latitude, longitude);
	}
	//判断坐标是否可用
	function showError(error) {
		errMsg = document.querySelector('#errMsg');
		switch(error.code) {
			case error.PERMISSION_DENIED:
				// User denied the request for Geolocation.
				errMsg.innerText = "定位失败,用户拒绝请求地理定位";
				break;
			case error.POSITION_UNAVAILABLE:
				// Location information is unavailable.
				errMsg.innerText = "定位失败,位置信息是不可用";
				break;
			case error.TIMEOUT:
				// The request to get user location timed out.
				errMsg.innerText = "定位失败,请求获取用户位置超时";
				break;
			case error.UNKNOWN_ERROR:
				// An unknown error occurred.
				errMsg.innerText = "定位失败,定位系统失效";
				break;
		}
	}

	function getroundshop(latitude, longitude,shopCategoryId,searchkey,limit,lat,lng) {
		//店铺id
		if(shopCategoryId){
			var shopCategoryId = shopCategoryId;
		}else{
			var shopCategoryId = '';
		}
		//搜索店铺名
		if(searchkey){
			var searchkey = searchkey;
		}else{
			var searchkey = '';
		}
		//排序
		if(orderBy){
			var orderBy = orderBy;
		}else{
			var orderBy = '';
		}
		//排序
		if(orderBy){
			var orderBy = orderBy;
		}else{
			var orderBy = '';
		}
		//限制个数
		if(limit){
			var orderBy = limit;
		}else{
			var limit = '10';
		}
		
		if(lat){
			var lat = lat;
		}else{
			var lat = window.latitude;
		}
		if(lng){
			var lng = lng;
		}else{
			var lng = window.longitude;
		}
		
		
		
		var latRange = 0.1;
		var lngRange = 0.1;
		
		var url = rooturl + 'index.php/Api/Apps/Jingkaiqu/Map/surroundingLicenseShop'; //获取周边店铺
		$.ajax({
			url: url,
			data: {
				mobile: mobile,
				userType: userType,
				clientId: clientId,
				clientType: clientType,
				accessToken: accessToken,
				lat: lat,
				lng: lng,
				shopCategoryId:shopCategoryId,
				searchkey: searchkey,
				orderBy:orderBy,
				latRange:latRange,
				lngRange: lngRange,
				page:1,
				num:100,
				areaId:'',
				selectAllLicenseType:'',
				licenseType:'',
				check_level:'',
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
				if(res.code && res.code == 1000) {
					var userinfo = JSON.stringify(res.data);
					var shopinfo = res.data.data;
					res.data.rooturl = rooturl;
					window.shopinfo = res.data.data;
					drawmap(latitude, longitude,shopinfo);
				} else {
					drawmap(latitude, longitude,'');
					mui.toast(res.message, {
						duration: 'short',
						type: 'div'
					});
				}
				$('#my-mask').hide();
			},
			error: function(res,msg) {
				console.log(res.message);
				$('#my-mask').hide();
				mui.toast(res.message, {
					duration: 'short',
					type: 'div'
				});
			}
		})
	}
	
	function popinfo(id){
		var popshopinfo = window.shopinfo;
		// 抓取模板数据
		var tpl = $("#shopinfo").html();
		tpla = tpl
		for (var n = 0;n<popshopinfo.length;n++) {
			if(popshopinfo[n].licenses[0].id == id){
				data = popshopinfo[n];
			}
		}
		if(data){
			// 编译模板
			console.log(JSON.stringify(data.shop_activity));
			
			var allarr = data;
			var activityarr = [];
			var activitystring = '';
			
			if(data.shop_activity == null){
				var activitystring = '暂无活动';
			}else{
				var shop_activity = data.shop_activity;
				for(var action in shop_activity){
					console.log(JSON.stringify(shop_activity[action]));
					var stringaction = '满'+shop_activity[action].over_price+'减'+shop_activity[action].discount;
					activityarr.push(stringaction);
				}
				var activitystring = activityarr.join(',');
			}
			data.stringactitvity = activitystring;
			var opentime = data.shop_open_range;
			var arropen = [];
			var allopen = [];
			var wday = [];
			var infoopen = [];
			var num = 0;
			if(opentime){
				for(var n = 0;n<opentime.length;n++){
					var start = opentime[n].open_time;
					var end = opentime[n].close_time;
					var open = start.substring(0,5) +'-'+ end.substring(0,5);
					var arritem = {
						open: open,
						day: opentime[n].day_of_week
					}
					arropen.push(arritem);
					allopen.push(open);
				}

				 var arr = allopen;
				 var result = [];
				for(var i = 0; i < arr.length; i++)
			    {
			        //如果在结果数组result中没有找到arr[i],则把arr[i]压入结果数组result中
			        if (result.indexOf(arr[i]) == -1){
			        	result.push(arr[i]);
			        }
			    }
				for(var c = 0;c<result.length;c++){
					for(var q = 0;q<arropen.length;q++){
						if(arropen[q].open == result[c]){
							if(wday[c]){
								wday[c] = wday[c]+','+arropen[q].day;
							}else{
								wday[c] = arropen[q].day;
							}
						}
					}
					if(wday[c] == "1,2,3,4,5"){
						wday[c] = '工作日';
					}
					if(wday[c] == "6,7"){
						wday[c] = '双休日';
					}
					if(wday[c] != '双休日' && wday[c] != '工作日'){
						wday[c] = '周'+wday[c];
					}
					var weekday = {
						open: result[c],
						day: wday[c]
					}
					infoopen.push(weekday);
				}
			}else{
				infoopen = '';
			}
			
			data.rooturl = rooturl;
			data.wekday = infoopen;
			
			var rtp = Handlebars.compile(tpla);
			  // 把数据传送到模板
			var text = rtp(data);
			  // 更新到模板
			$('#mask-pop').html(text);
			$("#my-mui-mask").show();
			$("#mask-pop").show();
		}else{
			console.log('12313');
		}
	}
	
	//绘制地图，设置marker
	function drawmap(latitude, longitude,shopinfo){
		var markers = [];
		var center = new qq.maps.LatLng(latitude, longitude);
		var map = new qq.maps.Map(document.getElementById("content"), {
			disableDefaultUI: true,
			center: center,
			zoomControl: true,
			zoom: 15
		});
		
		function CustomZoomControl(controlDiv, map) {
	        controlDiv.style.padding = "1px";
	        controlDiv.style.width = '42px';
	        controlDiv.style.height = '42px';
	        controlDiv.style.backgroundColor = "#FFFFFF";
	        controlDiv.style.border = "1px solid #ccc";
	        controlDiv.style.marginLeft = "10px";
	        controlDiv.style.verticalAlign = 'middle';
	        controlDiv.style.textAlign = "center";
	        controlDiv.style.borderRadius = "100%";
	        customimg.src = '../../img/resh.png';
	        customimg.style.width = '24px';
	        customimg.style.height = '24px';
			customimg.style.marginTop = '7px';
	        controlDiv.index = 1;//设置在当前布局中的位置
//			controlDiv.innerHTML = "地图缩放级别"
//	        function update() {
//	            var currentZoom = map.getZoom();
//	            controlDiv.innerHTML = "地图缩放级别：" + currentZoom;
//	            qq.maps.event.trigger(controlDiv, "resize");
//	        }
//	
//	        update();
//	        //添加dom监听事件  一旦zoom的缩放级别放生变化则出发update函数
//	        qq.maps.event.addDomListener(map, "zoom_changed", update);
	    }
		//创建div元素
	    var customZoomDiv = document.createElement("div");
	    customZoomDiv.setAttribute('id','refresh');
	    var customimg = document.createElement("img");
	    customZoomDiv.appendChild(customimg);
	    //获取控件接口设置控件
	    var customZoomControl = new CustomZoomControl(customZoomDiv, map);
	    //将控件添加到controls栈变量并将其设置在顶部位置
//	    map.controls[qq.maps.ControlPosition.BOTTOM_CENTER].push(customZoomDiv);
		map.controls[qq.maps.ControlPosition.LEFT_BOTTOM].push(customZoomDiv);
		
		window.map = map;
		
		var infoWin = new qq.maps.InfoWindow({
			map: map,
			visible: true
		});
		
		infoWin.open();
		
		var marker = new qq.maps.Marker({
        	map: map,
        	position: new qq.maps.LatLng(latitude,longitude),
        	icon: '../../img/coordinate.png',
        	zIndex: -1
       });
       var marker = new qq.maps.Label({
		    position: center,
		    map: map,
		    content:'我的位置',
		    visible:true
		});
		
		
//		逆地址
		geocoder = new qq.maps.Geocoder({
		    complete:function(result){
//		    	坐标转地址
		        alert('您点击的位置地址：'+result.detail.address);
//		                    地址转坐标
//		        alert('成功坐标'+result.detail.location);
		        
//		        console.log(JSON.stringify(result.detail));
		        
		        map.setCenter(result.detail.location);
	            var marker = new qq.maps.Marker({
	                map:map,
	                position: result.detail.location
	            });
		    }
		});
		
		//点击地图选点事件
		qq.maps.event.addListener(map, 'click', function(event) {
//	        alert('您点击的位置为: [' + event.latLng.getLat() + ', ' +
//	        event.latLng.getLng() + ']');
	        
	        
	        
	        var coord = new qq.maps.LatLng(event.latLng.getLat(),event.latLng.getLng());
//			坐标
			geocoder.getAddress(coord);
			//地址
//	        geocoder.getLocation(',,龙湾区,天鹅湖小区');
	        getroundshop(event.latLng.getLat(),event.latLng.getLng(),'','','',event.latLng.getLat(),event.latLng.getLng());
	        
	    });
		
		
		
		for(var m = 0;m<shopinfo.length;m++){
			var lat = shopinfo[m].lat;
			var lng = shopinfo[m].lng;
			
			if(shopinfo[m].corporation_name){
            	var corporation_name = shopinfo[m].corporation_name;
            }else{
            	var namearr = [];
            	var licenses = shopinfo[m].licenses;
            	for(var sl = 0;sl<licenses.length;sl++){
            		namearr.push(licenses[sl].corp_name);
            	}
            	var corporation_name = namearr.join(",");
            }
            
            var check_level = shopinfo[m].licenses[0].check_level;
            if(check_level){
            	var check_level = check_level+'-';
            }else{
            	var check_level = '待评定-';
            }
            
			//若坐标相同只显示一个
			var marker = new qq.maps.Marker({
	            map: map,
	            position: new qq.maps.LatLng(lat,lng),
	            content:'我的位置',
	            zIndex: 1
	       	});
	       	
//	       	为所有marker添加文本标注
	       	var cssC = {
			       fontSize:"16px",
			       borderRadius: "10px",
			       border: 0,
			       padding: "4px 5px 4px 5px",
			       boxShadow:"1px 1px 3px #ccc"
			};
	       	
	       	var label = new qq.maps.Label({
			      position: new qq.maps.LatLng(lat,lng),
			      offset: new qq.maps.Size(-100, 0),
			      map: map,
			      content:check_level+corporation_name
			});
	       	label.setStyle(cssC)
	        markers.push(marker);
		}
		infoWin.open();
		console.log(accessToken);
		for (var i = 0 ;i< markers.length; i++) {
			(function(n){
	            qq.maps.event.addListener(markers[n], 'click', function() {
	                infoWin.open();
	                
	                console.log(n);
	                
	                popinfo(shopinfo[n].licenses[0].id);
	                if(shopinfo[n].corporation_name){
	                	var corporation_name = shopinfo[n].corporation_name;
	                }else{
	                	var namearr = [];
	                	var licenses = shopinfo[n].licenses;
	                	for(var sl = 0;sl<licenses.length;sl++){
	                		namearr.push(licenses[sl].corp_name);
	                	}
	                	var corporation_name = namearr.join(",");
	                	
	                }
	                
					infoWin.setContent('<div style="text-align:center;white-space:' +
								'nowrap;margin:10px;font-size: 14px;display:block;"> ' + corporation_name+ ' </div>');
					//提示窗位置
					
					infoWin.setPosition(new qq.maps.LatLng(shopinfo[n].lat, shopinfo[n].lng));
	            });
	        })(i);
	    };
	         
	    var info = new qq.maps.InfoWindow({
	         map: map,
	         visible:true
	    });
	}
	
	
	
}
$(function(){
	
//	刷新
	$('html').on('click','#refresh',function(){
		
		$('#my-mask').show();
		location.reload();
	})
	
	var btn = document.getElementById("my-mui-mask");
//监听点击事件
	btn.addEventListener("tap",function () {
	  btn.style.display="none";
	  $("#mask-pop").hide();
	});	
	
})
//底部跳转首页
function toindex(){
	window.location.href='Mappage.html';
}



//底部跳转至中心
function skipbottom(){
	if(userType == 'user'){
		console.log('个人中心');
		var skipurl = 'Individualcenter.html';
	}
	if(userType == 'shop'){
		console.log('商家中心');
		var skipurl = 'shopcenter.html';
	}
	if(userType == 'admin'){
		console.log('管理中心');
		var skipurl = 'managecenter.html';
	}
	console.log(skipurl);
	window.location.href=skipurl;
}
//查看详情
function lookdetail(license_id,id){
//	证书id
	mui.openWindow({
	    url: '../shop/ShopPage.html',
	    extras:{
			license_id: license_id,
			shopid:id,
			type: 2
		}
	});
//	shopid
//	mui.openWindow({
//	    url: '../shop/ShopPage.html',
//	    extras:{
//			shopid: id,
//			type: 0
//		}
//	});
}
//监管记录
function writerecords(license_id,id){
//	证书id
	mui.openWindow({
	    url: '../shop/ShopPage.html',
	    extras:{
			license_id: license_id,
			shopid: id,
			type: 1
		}
	});
	
//	
//	mui.openWindow({
//	    url: '../../shop/ShopPage.html',
//	    extras:{
//			shopid: id,
//			type: 1
//		}
//	});
	console.log(id);
}

//点击搜索
	$('html').on('click','.shopsearch',function(){
		var tourl = '../shop/mapselect.html'
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'51px',//新页面底部位置
		    },
		    extras:{
		      //自定义扩展参数，可以用来处理页面间传值1
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	})
	
// 点击导航
	$('html').on('click','#way-route',function(){
		var lat = $(this).children("#way-lat").val();
		var lng = $(this).children("#way-lng").val();
		
		var licenseId = $(this).children("#way-id").val();
		var cropname = $(this).children("#way-name").val();
		
		var tourl = '../mappilot/mappilot.html';
		mui.openWindow({
		    url:tourl,
		    id:tourl,
		    styles:{
		      top: '0',//新页面顶部位置
		      bottom:'51px',//新页面底部位置
		    },
		    extras:{
		    	lat:lat,
		    	lng:lng,
		    	licenseId:licenseId,
		    	cropname:cropname
		      //自定义扩展参数，可以用来处理页面间传值1
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:'slide-in-right',//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    }
		})
	})
	
	
	
	
	
	

//map
var map, transfer_plans, start_marker, end_marker, station_markers = [],
transfer_lines = [],
walk_lines = [];

var transferService = new qq.maps.TransferService({
    complete: function(result) {
        result = result.detail;
        var start = result.start,
        end = result.end;
        var anchor = new qq.maps.Point(6, 6),
        size = new qq.maps.Size(24, 36),
        start_icon = new qq.maps.MarkerImage('../../img/busmarker.png', size),
        end_icon = new qq.maps.MarkerImage('../../img/busmarker.png', size, new qq.maps.Point(24, 0), anchor);
		
        start_marker && start_marker.setMap(null);
        end_marker && end_marker.setMap(null);
             
        start_marker = new qq.maps.Marker({
            icon: start_icon,
            position: start.latLng,
            map: window.map,
            zIndex: 1
        });
        end_marker = new qq.maps.Marker({
            icon: end_icon,
            position: end.latLng,
            map: window.map,
            zIndex: 1
        });
        transfer_plans = result.plans;
        //渲染到地图上
        renderPlan(0);
        if(transfer_plans){
        	$("#my-mui-mask").hide();
			$("#mask-pop").hide();
        }
        
    }
});

//调用calcPlan用来判断出行方式
function calcPlan(lat,lng) {
//  var start_name = document.getElementById("start").value.split(",");
//  var end_name = document.getElementById("end").value.split(",");
    var policy = 'LEAST_TIME';

    transferService.search(new qq.maps.LatLng(window.latitude, window.longitude), new qq.maps.LatLng(lat, lng));
    switch (policy) {
    case "较快捷":
    	console.log('2321');
        transferService.setPolicy(qq.maps.TransferActionType.LEAST_TIME);
        break;
    case "少换乘":
        transferService.setPolicy(qq.maps.TransferActionType.LEAST_TRANSFER);
        break;
    case "少步行":
        transferService.setPolicy(qq.maps.TransferActionType.LEAST_WALKING);
        console.log(1);
        break;
    case "不坐地铁":
        transferService.setPolicy(qq.maps.TransferActionType.NO_SUBWAY);
        break;
    }
}

//清除地图上的marker
function clearOverlay(overlays) {
    var overlay;
    while (overlay = overlays.pop()) {
        overlay.setMap(null);
    }
}

function renderPlan(index) {
    var plan = transfer_plans[index],
    lines = plan.lines,
    walks = plan.walks,
    stations = plan.stations;
    map.fitBounds(plan.bounds);

    //clear overlays;
    clearOverlay(station_markers);
    clearOverlay(transfer_lines);
    clearOverlay(walk_lines);
    var anchor = new qq.maps.Point(6, 6),
    size = new qq.maps.Size(24, 36),
    bus_icon = new qq.maps.MarkerImage('img/busmarker.png', size, new qq.maps.Point(48, 0), anchor),
    subway_icon = new qq.maps.MarkerImage('img/busmarker.png', size, new qq.maps.Point(72, 0), anchor);
    //draw station marker
    for (var j = 0; j < stations.length; j++) {
        var station = stations[j];
        if (station.type == qq.maps.PoiType.SUBWAY_STATION) {
            var station_icon = subway_icon;
        } else {
            var station_icon = bus_icon;
        }
        var station_marker = new qq.maps.Marker({
            icon: station_icon,
            position: station.latLng,
            map: map,
            zIndex: 0
        });
        station_markers.push(station_marker);
    }

    //draw bus line
    for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        var polyline = new qq.maps.Polyline({
            path: line.path,
            strokeColor: '#3893F9',
            strokeWeight: 6,
            map: map
        });
        transfer_lines.push(polyline);
    }

    //draw walk line
    for (var j = 0; j < walks.length; j++) {
        var walk = walks[j];
        var polyline = new qq.maps.Polyline({
            path: walk.path,
            strokeColor: '#3FD2A3',
            strokeWeight: 6,
            map: map
        });
        walk_lines.push(polyline);
    }
}

function reload(){
	location.reload();
}
