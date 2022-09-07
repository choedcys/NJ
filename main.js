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
            if(queryData.id === undefined){ // 1 querystring이 없이 undefined이면 홈페이지
                // 2 함수 fs.readFile은 생략가능
                fs.readFile(`${queryData.id}`,'utf-8',function(err, description){ // 3 지역변수 title, description 선언
                var title = 'favicon.ico'
                var description ='A favicon(short for favorite icon), also known as a shortcut icon, website icon,tab icon, URL icon.'
            var template = `
            <!doctype html>
            <html>
                <head>
                    <title>WEB1 - ${title}</title> 
                    <link rel = "icon" href = "data:,">
                    <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">favicon이란</a></h1>
                <ol>
                <li><a href="/?id=HIS.html">History</a></li>
                <li><a href="/?id=STAN.html">Standardization</a></li>
                <li><a href="/?id=LEG.html">Legacy</a></li> 
                </ol>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html> ` ; 
                response.writeHead(200); 
                response.end(template);
            });
        }
        else
        {
            fs.readFile(`${queryData.id}`,'utf-8',function(err, description){
            var title = queryData.id 
            var template = ` 
            <!doctype html>
            <html>
                <head>
                <title>WEB1 - ${title}</title>
                <link rel = "icon" href = "data:,">
                <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">favicon이란</a></h1>
                    <ol>
                    <li><a href="/?id=HIS.html">History</a></li>
                    <li><a href="/?id=STAN.html">Standardization</a></li>
                    <li><a href="/?id=LEG.html">Legacy</a></li> 
                    </ol>
                    <h2>${title}</h2>
                    <p>${description}</p>
                </body>
            </html> `  ;
            response.writeHead(200); 
            response.end(template);
            });
        }
        });
    }
    else{
        response.writeHead(404);
        response.end('Not found');
    }
}); 
app.listen(3000);