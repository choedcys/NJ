var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring');


function templateHTML(title,list,body,control) {
    return `
    <!doctype html>
    <html>
    <head>
        <title>Namecard - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/namecard">Namecard-홈페이지</a></h1>
    <hr>
    ${list}
    ${control}
    ${body}
    </body>
    </html>
    `;
}
function templateList(filelist) {
    var list='<ol type= "1">';
    var i=0;
    while(i<filelist.length){
        list=list+`<li><a href="/namecard?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i=i+1;
        }
    list=list+'</ol>';
    
    return list;
}

function Init(filelist,response){
    var title = '이름을 클릭하세요';
    var description = '목록에서 이름을 클릭하면 상세내용이 나옵니다.';
    var list = templateList(filelist);
    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,`<form action="/namecard/create" method="post">
    <input type="hidden" name="id" value="${title}"> 
    <input type="submit" value="생성">
    </form>`);
    response.writeHead(200);
    response.end(template);
return ;
}
function Pressing_List(filelist,queryData,response){
    fs.readFile(`namecard/${queryData.id}`, 'utf8', function(err, description) {
    var title = queryData.id;
    var list = templateList(filelist);
    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,
    ` <table>
    <tr>
    <td><form action="/namecard/create" method="post">
            <input type="hidden" name="id" value="${title}"> 
            <input type="submit" value="생성">
        </form>
    </td>
    <td> <form action="/namecard/update?id=${title}" method="post">
            <input type="hidden" name="id" value="${title}"> 
            <input type="submit" value="수정">
        </form>
    </td>
    <td><form action="/namecard/delete_process" method="post" onsubmit="return confirm('정말로 삭제하시겠습니까?');">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="삭제">
                </form></td>
    </tr></table>`
    ); 
    response.writeHead(200);
    response.end(template);
    }); 
return ;
}
function Pressing_CreateLink(filelist,response){
    var title = 'Namecard';
    var list = templateList(filelist);
    var template = templateHTML(title, list, `
        <form action="http://localhost:3000/namecard/create_process" method="post"> 
        <p><input type="text" name="title" placeholder="이름"></p>
        <p>
            <textarea name="description" placeholder="내용" cols="30" rows="10"></textarea>
        </p>
        <p>
            <input type="submit" value="생성">
        </p>
        </form>
    `,`<form action="http://localhost:3000/namecard" method="post">
    <input type="hidden" name="id" value="${title}"> 
    <input type="submit" value="홈페이지로 가기">
    </form>`); 
    response.writeHead(200); 
    response.end(template);
    return ;
}
function Pressing_UpdateLink(filelist,queryData,response){
    fs.readFile(`namecard/${queryData.id}`, 'utf8', function(err, description) { 
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list,
            `
            <form action="/namecard/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p> 
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea> 
                </p>
                <p>
                    <input type="submit" value="수정">
                </p> 
            </form>
            `,
            `
            <form action="http://localhost:3000/namecard/create" method="post">
            <input type="hidden" name="id" value="${title}"> 
            <input type="submit" value="생성">
            </form>
            ` 
            );
                    response.writeHead(200);
                    response.end(template);
                });
                return ;
}
function Create_submit(response,body){
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`namecard/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location: encodeURI(`/namecard?id=${title}`)});
        response.end();
    });
    return ;
}
function Update_submit(response,body){
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`namecard/${id}`, `namecard/${title}`, function(error) { 
        fs.writeFile(`namecard/${title}`, description, 'utf8', function(err) {
            response.writeHead(302, {Location: encodeURI(`/namecard?id=${title}`)});
            response.end();
        });
    });
    return ;
}

function Clicking_Delete(response,body){
    var post = qs.parse(body);
    var id = post.id;
    fs.unlink(`namecard/${id}`, function(error){
        response.writeHead(302, {Location: `/namecard`});
        response.end();
    });
    
    return ;
}


var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url,true).query
    var pathname=url.parse(_url,true).pathname
    if(pathname === '/namecard' || pathname === '/namecard/create' || pathname === '/namecard/update'|| pathname === '/namecard/gotoHomepage') { 
        fs.readdir('./namecard', function(error, filelist) {
            if(pathname === '/namecard'){
                if(queryData.id === undefined) {
                    Init(filelist,response);
                }else{
                    Pressing_List(filelist,queryData,response);
                }
            }
            else if(pathname === '/namecard/create'){
                Pressing_CreateLink(filelist,response);
            }
            else if(pathname === '/namecard/gotoHomepage'){
                Init(filelist,response);
            }
            else{
                Pressing_UpdateLink(filelist,queryData,response);
            }
        });
        
    }
    else if(pathname === '/namecard/create_process' || pathname === '/namecard/update_process' || pathname === '/namecard/delete_process' ) { 
        var body = '';
        request.on('data', function(data) { 
            body = body + data;
        });
        request.on('end', function() {
            if(pathname === '/namecard/create_process'){
                Create_submit(response,body);
            }
            else if(pathname === '/namecard/update_process'){
                Update_submit(response,body);
            }
            else{
                Clicking_Delete(response,body);
            }
        });
        
    } 
    else {  
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);
