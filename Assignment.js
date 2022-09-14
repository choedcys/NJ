var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring');

function templateHTML(title,list,body,control) {
    return `
    <!doctype html>
    <html>
    <head>
        <title>1년 스케줄인디... - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">1년 스케줄인디...</a></h1>
    ${list}
    ${control}
    ${body}
    </body>
    </html>
    `;
}

function templateList(filelist) {
    var list='<ul>';
    var i=0;
    while(i<filelist.length){
        list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i=i+1;
        }
    list=list+'</ul>';
    return list;
}


function Init(filelist,response){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,`<a href ="/create">크리8</a>`);
        response.writeHead(200);
        response.end(template);
    return ;
}
function Pressing_List(filelist,queryData,response){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`,
        ` <a href = "/update?id=${title}">없데eat</a> <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${title}"> 
            <input type="submit" value="deal리트">
        </form>`
        ); 
        response.writeHead(200);
        response.end(template);
        }); 
    return ;
}
function Pressing_CreateLink(filelist,response){
        var title = '1년스케줄인디... - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post"> 
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
        `,`입력해 빨리!!!! 빨리!!!!`); 
        response.writeHead(200); 
        response.end(template);
        return ;
}
function Pressing_UpdateLink(filelist,queryData,response){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) { 
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list,
                `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p> 
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea> 
                    </p>
                    <p>
                        <input type="submit">
                    </p> 
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${title}">update</a>` 
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
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
    });
    return ;
}
function Update_submit(response,body){
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error) { 
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
        });
    });
    return ;
}
function Clicking_Delete(response,body){
    var post = qs.parse(body);
    var id = post.id;
    fs.unlink(`data/${id}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
    });
    return ;
}

///////////////////////실행 코드/////////////////////////////////
///////////////////////실행 코드/////////////////////////////////
///////////////////////실행 코드/////////////////////////////////
var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url,true).query
    var pathname=url.parse(_url,true).pathname
    

    if(pathname === '/' || pathname === '/create' || pathname === '/update') { 
        fs.readdir('./data', function(error, filelist) {
            if(pathname === '/'){
                if(queryData.id === undefined) {
                    Init(filelist,response);
                }else{
                    Pressing_List(filelist,queryData,response);
                }
            }
            else if(pathname === '/create'){
                Pressing_CreateLink(filelist,response);
            }
            else{
                Pressing_UpdateLink(filelist,queryData,response);
            }
        });
        
    }
    
    else if(pathname === '/create_process' || pathname === '/update_process' || pathname === '/delete_process') { 
        var body = '';
        request.on('data', function(data) { 
            body = body + data;
        });
        request.on('end', function() {
            if(pathname === '/create_process'){
                Create_submit(response,body);
            }
            else if(pathname === '/update_process'){
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