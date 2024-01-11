const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const url = require('url');

const index_page = fs.readFileSync('./index.ejs','utf8');
const style_page = fs.readFileSync('./style.css','utf8');
const other_page = fs.readFileSync('./other.ejs','utf8');

var server = http.createServer(getFormClient);

server.listen('3000');
console.log('Server start!');

//ここまでがメイン

//createServerの処理
function getFormClient(request,response){
    var url_parts = url.parse(request.url);

    switch(url_parts.pathname){
        case '/':
            var content = ejs.render(index_page, {
                title:"indexページ",
                content:"これはejsテンプレートを使ったページです。",
            });
            response.writeHead(200,{'Content-Type':'text/html'});
            response.write(content);
            response.end();
            break;
        case '/other':
            var content = ejs.render(other_page, {
                title:'otherページ',
                content:"これはotherページです。",
            });
            response.writeHead(200,{'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        
        default:
            response.writeHead(200,{'Cotent-Type': 'text/html'});
            response.write('Nopage...');
            response.end();
            
    }
   
}