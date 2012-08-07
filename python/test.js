var http = require('http');
var url = require('url');
http.globalAgent.maxSockets = 10240;
//console.log(http.globalAgent.maxSockets);

var IpList = [];
var requestCount = 0;

http.createServer(function(req,res){
    var urlInfo = url.parse(req.url);
    requestCount++;
    if(IpList.indexOf(req.connection.remoteAddress)==-1){
        IpList.push(req.connection.remoteAddress);
    }
    if(requestCount % 10 == 0){
        console.log('Access Count: '+ requestCount);
        console.log('IP Table: ' + IpList + "\r\n");
    }
    var options = {};
    options.host = urlInfo.host;
    options.hostname = urlInfo.hostname;
    options.port = 80;
    options.method = req.method;
    options.path = urlInfo.path; 
    options.Connection = "keep-alive";
    var remoteReq = http.request(options,function(remoteRes){
        res.writeHead(200,remoteRes.headers);
        remoteRes.on('data',function(chunk){
            res.write(chunk);
        });
        remoteRes.on('end',function(){
            res.end();
        });
    });
    var responseHdr = function () { 
        if (remoteReq) { 
        } else { 
            remoteReq.abort(); 
        }
    };
    var timeoutHdr = setTimeout(function() {
        remoteReq.emit('req-timeout');
    },5000);
    remoteReq.on('req-timeout',responseHdr);
    remoteReq.on('error', function(e) { 
        clearTimeout(timeoutHdr); 
        //console.error('Ok.. clientrequest error'); 
        //next({err:JSON.stringify(e)}); 
    }); 
    remoteReq.end();
}).listen(8080);

//处理各种错误
process.on('uncaughtException', function(err)
{
    console.log("\nError!!!!");
    console.log(err);
});
console.log('Server was started!');

