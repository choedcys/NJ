var http = require('http');
var fs = require('fs');
var urlm = require('url');

var app = http.createServer(function(request, response) { 
    var url = request.url;
    var queryData = urlm.parse(url, true).query

    var title = queryData.id
    console.log(urlm.parse(url, true)); // 1 URL 정보
    
    var pathname = urlm.parse(url, true).pathname //2 URL 정보 중 pathname 저장
    
    if(pathname == '/'){ // 3 root로 접속했을 경우 
        fs.readFile(`${queryData.id}`,'utf-8',function(err, description){
            var template = `
            <!doctype html>
            <html>
                <head>
                    <title>WEB1 - ${title}</title> 
                    <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                <ol>
                <li><a href="/?id=13-HTML">HTML</a></li>
                <li><a href="/?id=13-CSS">CSS</a></li>
                <li><a href="/?id=13-JavaScript">JavaScript</a></li> 
                </ol>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html> ` ; 
                response.writeHead(200); 
                response.end(template);
            });
        } // 4 root 이외의 경로로 접속했을 경우 
        else {
            response.writeHead(404); // 5 404 응답코드 : 파일 없음
            response.end('Not found');
        }
}); 
app.listen(3000);