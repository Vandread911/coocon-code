var net = require('net');
var fs = require('fs');
var local_port = 9998;
var logs = getLogs();
var timeSpan = 51;
var userName = /gengpeng.*/g;
var reqDic = {};
//在本地创建一个server监听本地local_port端口
net.createServer(function (client)
{
    
    //首先监听浏览器的数据发送事件，直到收到的数据包含完整的http请求头
    var buffer = new Buffer(0);
    client.on('data',function(data)
    {
        buffer = buffer_add(buffer,data);
        if (buffer_find_body(buffer) == -1)  {
            return;
        }
        var req = parse_request(buffer);
        if (req === false) {
            return;
        }
        client.removeAllListeners('data');    
        var strReq = logs.reqShow(req); 
        if(strReq) {
            logs.show(strReq);
            setInterval(function() {
                relay_connection(req); 
            }, timeSpan); 
        }      
        relay_connection(req);
    });

    //从http请求头部取得请求信息后，继续监听浏览器发送数据，同时连接目标服务器，并把目标服务器的数据传给浏览器
    function relay_connection(req)
    {
        var arr = [];

        //如果请求不是CONNECT方法（GET, POST），那么替换掉头部的一些东西
        if (req.method != 'CONNECT')
        {
            //先从buffer中取出头部
            var _body_pos = buffer_find_body(buffer);
            if (_body_pos < 0) _body_pos = buffer.length;
            var header = buffer.slice(0,_body_pos).toString('utf8');
            //替换connection头
            header = header.replace(/(proxy\-)?connection\:.+\r\n/ig,'')
                    .replace(/Keep\-Alive\:.+\r\n/i,'')
                    .replace("\r\n",'\r\nConnection: close\r\n');
            //替换网址格式(去掉域名部分)
            if (req.httpVersion == '1.1')
            {
                var url = req.path.replace(/http\:\/\/[^\/]+/,'');
                if (url.path != url) header = header.replace(req.path,url);
            }
            buffer = buffer_add(new Buffer(header,'utf8'),buffer.slice(_body_pos));
        }
        //交换服务器与浏览器的数据
        client.on("data", function(data){
            try {
                server.write(data); 
            } catch(ex) {
                console.log('error: write server error'); 
            }
        });
      
        //建立到目标服务器的连接
        var server = net.createConnection(req.port,req.host);
        //
        console.log(req); 
        
        server.on("data", function(data){ 
            if(req.method == "POST") {
                var  regUrl  = regUrl ||  /graniteamf\/amf/g;
                var arr = [];
                var userName = userName || /gengpeng.*/g;

                if(req.path.match(regUrl) && req.param.match(userName)) { 

                    logs.save('serverData:-----------'+data.toString('utf8'));
                }
              
            }
            try {
                client.write(data); 
            } catch(ex) {
                console.log('error on write clien'); 
            } 
        });

        if (req.method == 'CONNECT') {
            try{
                client.write(new Buffer("HTTP/1.1 200 Connection established\r\nConnection: close\r\n\r\n"));
            }catch(ex) {
                console.log('error:  server write fail');
            }
        }
        else {
            try{ 
            //logs.save(buffer); 
                server.write(buffer);
            }catch(ex) {
                console.log('error:  server write fail'); 
            }
        }
    }
}).listen(local_port);

console.log('Proxy server running at localhost:'+local_port);


//处理各种错误
process.on('uncaughtException', function(err)
{
    console.log("\nError!!!!");
    console.log(err);
});



/**
* 从请求头部取得请求详细信息
* 如果是 CONNECT 方法，那么会返回 { method,host,port,httpVersion}
* 如果是 GET/POST 方法，那么返回 { metod,host,port,path,httpVersion}
*/
function parse_request(buffer)
{
    var s = buffer.toString('utf8');
    var method = s.split('\n')[0].match(/^([A-Z]+)\s/)[1];
    //console.log(s);
    if (method == 'CONNECT')
    {
        var arr = s.match(/^([A-Z]+)\s([^\:\s]+)\:(\d+)\sHTTP\/(\d\.\d)/);
        if (arr && arr[1] && arr[2] && arr[3] && arr[4])
            return { method: arr[1], host:arr[2], port:arr[3],httpVersion:arr[4] };
    }
    else
    {
        var arr = s.match(/^([A-Z]+)\s([^\s]+)\sHTTP\/(\d\.\d)/);
        if (arr && arr[1] && arr[2] && arr[3])
        {
            var host = s.match(/Host\:\s+([^\n\s\r]+)/)[1];
            var obj = {};
            obj.method = arr[1];
            if (host) {
                var _p = host.split(':',2);
                var param = s.match(/[\n\s\r\n\s\r]+(.*)$/)[1];
                obj.host = _p[0];
                obj.port = _p[1]?_p[1]:80;
                obj.path = arr[2];
                obj.httpVersion = arr[3];
                if(param) {
                    if( typeof(param) != "string" ) {
                        obj.param = typeof (param); 
                    } else {
                    
                        obj.param = param;
                    }
                }
           
                return obj;

            }
            
        }
    }
    return false;
}




/**
* 两个buffer对象加起来
*/
function buffer_add(buf1,buf2)
{
    var re = new Buffer(buf1.length + buf2.length);
    buf1.copy(re);
    buf2.copy(re,buf1.length);
    return re;
}

/**
* 从缓存中找到头部结束标记("\r\n\r\n")的位置
*/
function buffer_find_body(b)
{
    for(var i=0,len=b.length-3;i<len;i++)
    {
        if (b[i] == 0x0d && b[i+1] == 0x0a && b[i+2] == 0x0d && b[i+3] == 0x0a)
        {
            return i+4;
        }
    }
    return -1;
}

//log实例 
function getLogs() {
    var reqShow =  function(req, regUrl) {
        try {
            regUrl  = regUrl ||  /graniteamf\/amf/g;
            var arr = [];
            var userName = /gengpeng.*/g;
            if(!req.path.match(regUrl)) { 
               return null;  
            }
            if(!req.param.match(userName)) {
                return null; 
            }

            arr.push(' ----start  reqeust----');
            for(var i in req) {
                arr.push(i + ":" + req[i]); 
            }
            arr.push('----end  reqeust------' + new Date() + '\n\n\n');
            console.log(arr.join('\n'));
            return arr.join('\n');
        }catch(ex) {
            console.log(ex  + '---error----\n');   
            return  null;
        } 
    },
    logSave = function(str) {
        var end = '\n';
        str = str || end;
        fs.appendFile('logs.txt', str , function (err) {
          //  if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
    
    },
    logShow = function(str) {
        var end = '  ' + new Date() + '\n';
        str = (str + end) || end; 
        console.log(str); 
    }
    
    return {
        reqShow: reqShow,
        save: logSave,
        show: logShow
    
    }

}
