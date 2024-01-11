const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs','utf8');
const style_page = fs.readFileSync('./style.css','utf8');
const other_page = fs.readFileSync('./other.ejs','utf8');
const postevent_page = fs.readFileSync('./event.ejs','utf8');

var server = http.createServer(getFormClient);

server.listen('3000');
console.log('Server start!');

//ここまでがメイン

//createServerの処理
function getFormClient(request,response){
    var url_parts = url.parse(request.url, true);

    switch(url_parts.pathname){
        case '/':
            var content = "これはIndexページです。"
            var query = url_parts.query;
            if (query.greet != undefined){
                content += "あなたは、「" + query.greet + "」と送りました。";
            }

            var content = ejs.render(index_page, {
                title:'Index',
                content:content,
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

        case '/postevent':
            response_postevent(request, response);
            break;
        
        default:
            response.writeHead(200,{'Cotent-Type': 'text/html'});
            response.write('Nopage...');
            response.end();
            
    }

    function response_postevent(request, response){
        var msg = "これはフォーム受信ページです。";

        //POSTアクセス時の処理
        if(request.method == 'POST'){
            var body ='';

            //データ受信のイベント処理
            request.on('data',(recivedData) => {//第二引数の無名関数の引数（ここではrecivedData）にリクエストフォームの値が代入されている
                body += recivedData;
            });

            //データ受信終了のイベント処理
            request.on('end',()=>{
                var post_data = qs.parse(body);//データのパース
                msg += 'あなたは「' + post_data.msg + '」と入力しました。 ';
                var content = ejs.render(postevent_page, {
                    title:"posteventページ",
                    content:msg,
                });
                response.writeHead(200,{'Content-Type':'text/html'});
                response.write(content);
                response.end();
            });
        }else{
            var msg = "ページがありません。";
            var content = ejs.render(postevent_page,{
                title:"posteventのページ",
                content:msg,
            });
            response.writeHead(200,{'Content-Type':'text/html'});
            response.write(content);
            response.end();
        }
    }
   
}