var save = function(successCB,errorCB,fileName,imgID,overwrite,format,quality,clip){
		successCB     =  successCB   || function(){};
		errorCB		=  errorCB	 || function(){};
		fileName 	=  fileName  || Date.parse( new Date());
		imgID			=	 imgID		 || String(Date.parse( new Date()));
		overwrite =  overwrite || true;
		format		=  format    || 'png';
		quality 	=  quality   || 50;
		clip 			=  clip      || {top:'0px',left:'0px',width:'100%',height:'100%'};
		
		var self = plus.webview.currentWebview();
		var bitmap = new plus.nativeObj.Bitmap(imgID);
		
		//绘制截图
		self.draw(bitmap,function(){
				// 保存Bitmap图片
         bitmap.save('_doc/'+fileName+'.'+format, {overwrite: overwrite,format:format,quality:quality,clip:clip}
	        , function(i) {
	    				//保存到系统相册
	    				plus.gallery.save(i.target,function(d){
	    						//销毁Bitmap图片
	    						bitmap.clear();
	    						successCB({success:'success',details:d});
	    						var btnArray = ['否', '是'];
								mui.confirm('当前页面已保存至相册，是否打印？', '打印', btnArray, function(e) {
									if (e.index == 1) {
										shareSystem(i.target);
									} else {
										mui.toast('取消');
									}
								})
	    				}, function(e){
	    						//销毁Bitmap图片
	    						bitmap.clear();
	    						errorCB({error:'图片保存至相册失败',details:e});
	    						mui.toast('图片保存至相册失败');
	    				});
	    		}, function(e) {
	    				bitmap.clear();
	    				errorCB({error:'图片保存失败',details:e});
	    		}
	    	);
		},function(e){
				errorCB({error:'截屏绘制失败',details:e});
		});
}
/**
 * 调用系统分享，成功打印图片
  */
function shareSystem(fileurl){
	var msg={type:'image'};
	var src = fileurl;
  	msg.pictures=[src];
  	
	if('iOS'==plus.os.name){//iOS平台添加链接地址
		msg.href='http://www.dcloud.io/';
	}
//	outLine(JSON.stringify(msg));

	plus.share.sendWithSystem?plus.share.sendWithSystem(msg, function(){
//		outLine('Success');
		console.log('Success');
	}, function(e){
//		outLine('Failed: '+JSON.stringify(e));
		console.log('Failed: '+JSON.stringify(e));
	}):shareSystemNativeJS(msg);
}

function shareSystemNativeJS(msg) {
	if(plus.os.name!=='Android'){
		plus.nativeUI.alert('此平台暂不支持系统分享功能!');
		return;
	}
	var intent=new Intent(Intent.ACTION_SEND);
//  intent.setType('text/plain');
//text
    intent.setType('image/*');
//图片
//	intent.setType('application/msword');
	intent.putExtra(Intent.EXTRA_SUBJECT,'HelloH5');
	
	console.log(msg);
	
//	intent.putExtra(Intent.EXTRA_TEXT,sharecontent.value);
	intent.putExtra(Intent.EXTRA_STREAM,msg);
	intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
	main.startActivity(Intent.createChooser(intent,'系统分享HelloH5'));
}

//根据代码，生成
$('html').on('click','#goprint',function(){
	console.log('asdsad');
	html2canvas(document.getElementById("capture"), {
	    useCORS: true,
	    scale: window.devicePixelRatio*1, // 默认值是window.devicePixelRatio
	    logging: false
	});
    
    html2canvas(document.querySelector("#capture")).then(canvas => {
//			    document.body.appendChild(canvas);
		console.log('adasd');
	    var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//	    var saveLink = document.createElement( 'a');
	    console.log(imgUri);
	    app.baseImgFile('1',imgUri,70,function(i){
	       alert(JSON.stringify(i.target));
//	       $('#apptest').attr('src',i.target);
	       shareSystem(i.target);
	    });
//	    shareSystem(canvas.toDataURL());
	    $('#sharecontent').attr('src',canvas.toDataURL());
	})
})
