function templateHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title> 
    <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">1년 어쩌구저쩌구하는 거</a></h1>
            ${list}
            ${body} 
    </body>
    </html>
`;
}
function Tlist(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i+1;
    }
    list = list+'</ul>';
    return list;
}
function click(){
    var list = Tlist(filelist);
    var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
    response.writeHead(200); 
    response.end(template);
}

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
                    var title = '월별 계획';
                    var description ='월을 클릭해 주세요'
                    click();
                    
                });
            } 
            else {
                fs.readdir('./data', function(error, filelist) {
                    var title = queryData.id;
                    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                        click();
                    }); 
                });
            }
    } 
    else { 
        response.writeHead(404); 
        response.end('Not found');
    } 
});
app.listen(3000);