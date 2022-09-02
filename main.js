var hp = require('http');
var fs = require('fs');
var u = require('url');
var app = hp.createServer(function(request,response){
    var ad = request.url;
    var querydata = u.parse(ad, true).query;
    if(ad == '/?id=HTML'){
      response.end(querydata.id+' is the first of if sentence');
    }
    if(ad == '/?id=CSS'){
      response.end(querydata.id+' is the second of if sentence');
    }
    if(ad == '/?id=JavaScript'){
      response.end(querydata.id+' is the third of if sentence');
    }
    if(ad == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
 
});
app.listen(3000);