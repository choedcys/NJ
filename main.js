var http = require('http');
var fs = require('fs');
var urlm = require('url');
var app = http.createServer(function(request, response) {
var url = request.url;
var queryData = urlm.parse(url, true).query; // 9 parse 메소드의 두번째 인자 : true - object형으로 반환, false – string 반환 
var pathname = urlm.parse(url, true).pathname;
    if(pathname === '/') {
            if(queryData.id === undefined) {
                fs.readdir('./data', function(error, filelist) {
                    var title = 'Welcome';
                    var description ='Hello Nodejs'
                    var list = '<ul>';
                    var i = 0;
                    while(i < filelist.length){
                        list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                        i = i+1;
                    }
                    list = list+'</ul>';
                    var template = `
                    <!doctype html>
                    <html>
                    <head>
                        <title>WEB1 - ${title}</title> 
                        <link rel = "icon" href = "data:,">
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </body>
                    </html>
                        `; response.writeHead(200); 
                        response.end(template);
                        });
                    } else {
                        fs.readdir('./data', function(error, filelist) {
                                var list = '<ul>';
                                var i = 0;
                                while(i < filelist.length) {
                                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                                    i = i + 1; 
                                }
                        list = list+'</ul>';
                        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                                    var title = queryData.id;
                                    var template = `
                                    <!doctype html>
                                    <html>
                                        <head>
                                            <title>WEB1 - ${title}</title>
                                            <meta charset="utf-8">
                                        </head> 
                                        <body>
                                            <h1><a href="/">WEB</a></h1>
                                            ${list}
                                            <h2>${title}</h2>
                                            <p>${description}</p>
                                        </body>
                                    </html>
                        `; response.writeHead(200); response.end(template);
                        }); 
                    });
                        }
                        } else { response.writeHead(404); response.end('Not found');
                        } });
                        app.listen(3000);