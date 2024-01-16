const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const url = require('url');
const qs = require('querystring');
const { exec, execSync } = require('child_process');

const index_page = fs.readFileSync('./index.ejs','utf8');
const style_page = fs.readFileSync('./style.css','utf8');
const other_page = fs.readFileSync('./other.ejs','utf8');
const postevent_page = fs.readFileSync('./event.ejs','utf8');
const print_page = fs.readFileSync('./execprint.ejs','utf8');

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
        
        case '/printevent':
            var query = url_parts.query;
            var result = '';
            if(query.ls != undefined){
                try{
                    const stdout = execSync('ls -l /Users/atsushimachida/image1.png;');
                    result = stdout.toString();
                }catch(err){
                    console.log({
                        "error": err.stderr.toString() 
                    });

                }
                
                /*exec('ls -l /Users/atsushimachida/image1.png',(err, stdout, stderr) => {
                    if(err){
                        console.log(`stdeer: ${stderr}`);
                        return
                    }
                    result = stdout;
                    console.log(`stdout: ${stdout}`);
                });*/
            }
            var content = ejs.render(print_page, {
                title:'テストプリント実行ページ',
                content:'{ result : '+ result +' }',
            });
            response.writeHead(200,{'Content-Type': 'text/html'});
            response.write(content);
            response.end();
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