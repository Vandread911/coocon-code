/*
 	首页mini radio 通知模块
 	注意事项：由于公告系统后台的返回的是包含\t\n的json片段，而js的正则匹配去除这些换行的东西老是失效
 	所以需要在书写完本js后去除js中的注释和换行
 	换行可以搜索在Regex模式下搜索\n 换成 空格即可。
*/

/*
	使用mini播放器发通知
	notice:html内容
	style:notice 加入后父标签加样式
	callback:notice加入页面后的回调，可以在callback给notice绑定事件 
*/	
function showNotice(notice,style,callback){
	callback = callback || XN.func.empty();
	style = style || '';
	//如果电台先加载完,调用电台的函数
	if(XN&&XN.radio&&XN.radio.home){
		XN.radio.home.showNotice(notice,style,callback);
	}else{
		//电台还没有加载完，存储相关的参数
		XN.namespace('XN.radio.home');
		XN.radio.home.noticeContent = notice;
		XN.radio.home.noticeStyle = style;
		XN.radio.home.noticeCallback = callback;
	}
}
	
var notice = '<div style="position:absolute;" id="home-notice">'+
			'<div style="width: 258px;height: 100px;background:url(http://a.xnimg.cn/xnapp/music/images/notice/france.png) no-repeat;_background-image:none;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'http://a.xnimg.cn/xnapp/music/images/notice/france.png\',sizingMethod=\'crop\');"></div>'+
			'<a onclick="this.parentNode.style.display=\'none\'" href="javascript:;" style="	display:block;height:20px;width:20px;right: 0;top: 0;position:absolute;" id="radio-home-intro-close2" title="关闭" ></a>'+
		'</div>';

showNotice(notice,'bottom:132px;',function(){
	$("radio-home-intro-close2").addEvent("click",function(e){
		$('home-notice').hide();	
	});
});		
