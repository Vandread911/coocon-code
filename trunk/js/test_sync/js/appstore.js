/*********
*
*appStore 提供一个对象，里边有各种需要的函数
*
*
*
*
*
*
*/
hello,world

//用闭包提供一个封闭的环境

Jstool=function(win){
    //init 
    var doc=win.document,
        isIE=!!doc.attachEvent,                                         //judge if it is IE
        body=doc.getElementsByTagName('body')[0],  
        url_="http://172.16.2.36:8088/SSO/UserOpter.ashx?jp=",
        user={},   //to store user infomation
        host='http://172.16.2.36:8088/',
		urldown=host+'appstore/upload/UploadDocument/Plugins/',
		urlVerify=host+'appstore/appopter.ashx',
		urlSearch=host+'appstore/search.ashx',
		urlPlugin=host+'appstore/getinfo.ashx',
		urlImg=host+'appstore/getimg.ashx',                        
        request=function (url,success){
        var u=url||url_,        
                             //set default variable
        script = doc.createElement('img');
        function callback(){
			success();
            if(Jstool.user){
				//    success(Jstool.user);
		    }else{
		        //jsonp 没有返回值
			    //alert('warning: jsonp did not return.');
		    }		
		    // Handle memory leak in IE
		    script.onload = this.onreadystatechange = null;
		    //clear scipt tag for safe and clean
		    if( body && script.parentNode ){
			    body.removeChild(script);
		    }   
        }
        if(isIE){     //do stuff in ie
			script.onreadystatechange = function(){
				var readyState = this.readyState;
				if(readyState == 'loaded' || readyState == 'complete'){
					callback();
				}
			}
		}else{       //other browser :firefox chrome opera safari
			script.onload = function(){
				callback();
			}
		}
		script.src = u;
		body.insertBefore(script, body.firstChild);     
    
    },
	testimg=function(id,num){
		var url=urlImg+'?id='+id,
		
		n=num||5;
		url='http://172.16.2.250/ProductCenter/ResourceCenter/DemoImage.aspx?demoid=340';
		for(var i=0;i<num;i++){
			request(url,function(){
				//('<span>hello</sapn>');	
			})
		}
		
	};
    

    
    return {
        check:request,
		requestimg:testimg
    };
}(this)



var mytool=function(win){
    var doc=win.document,
	host='http://172.16.2.36:8088/',
    urldown=host+'appstore/upload/UploadDocument/Plugins/',
    urlVerify=host+'appstore/appopter.ashx',
    urlSearch=host+'appstore/search.ashx',
    urlPlugin=host+'appstore/getinfo.ashx',
	urlImg=host+'appstore/getimg.ashx',
    //提交ajax请求
    
    /**
    *verify/verifyplugin.aspx
    *审查页面的各种需要函数
    *
	*
	*
	*/
    testimg=function(id,num){
	
        var params = new Object(),
		t=setInterval('',5),
		len=num||5;
        params.id=id;        		
       // params.random = Math.random();
	    for(var i=0;i<len;i++){
		   $.get(urlImg, params, function(data, textstatus) {                       
				if (data) {      
						doc.write(i);		
				}else{
					doc.write('a');
				}
			}) 
	    }       
    };


    
    
    
   /*
    *
    *
    *  //公共方法和属性 type:logo,pre;  id:105
    */
    
  //获取图片
    function getimg(type,id,index){
        var url='../getimg.ashx',
        id=id||100;
        if(type=='logo'){
            url+='?id='+id;        
        }else if(type=='pre'){
            url+='?id='+id+'&index='+index;
        }
        return url;
    
    }


    //返回对象的属性和方法。
 return{ 
    requestimg:testimg 

 };   
    
}(this)//传入window  
