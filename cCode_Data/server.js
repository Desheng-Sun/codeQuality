// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/data', (req, res)=>{
//     console.log(req)
//     res.send('sdssb')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })


const express = require('express');
const app = express();
const port = 3000
const path = require('path'); 
const fs = require('fs'); 
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//模块引用
// const Domestic = require('./modules/domestic');
// const myDate = require('./modules/date');
// const Abroad = require('./modules/abroad');
// const Social = require('./modules/social');


//设置允许跨域请求
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=120');      // 设置强缓存 时间间隔2min
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/commit_baseinfo', function(req,res){
    let filedata = path.join(__dirname,'data/commit_baseinfo.json')
    fs.readFile(filedata,'utf-8',function(err,data){
        if(err){
            console.error(err);
        }else{
            let json_data = JSON.parse(data);
            json_data.sort((a, b) =>{
              return new Date(a["date"]) - new Date(b["date"]);
            })
            let commit_id = []
            let commit_Hash = []
            let author = []
            let date = []
            json_data.forEach(item => {            
                commit_id.push(item.commit_id)
                commit_Hash.push(item.commit_Hash)
                author.push(item.author)
                date.push(item.date)
            });
            let lastData = new Array();
            lastData[0] = commit_id
            lastData[1] = commit_Hash
            lastData[2] = author
            lastData[3] = date
            res.send(lastData);
            res.end();
        }
    });
});

app.get('/userissueCountNum', function(req,res){
    let filedata = path.join(__dirname,'data/' + req.query.commit_id +'/userissueCountNum.json')
    fs.readFile(filedata,'utf-8',function(err,data){
        if(err){
            console.error(err);
        }else{
            let json_data = JSON.parse(data);
            res.send(json_data);
            res.end();
        }
    });
});

app.get('/commitinfo_SonarQube', function(req,res){
    let filedata = path.join(__dirname,'data/commitinfo_use.json')
    fs.readFile(filedata,'utf-8',function(err,data){
        if(err){
            console.error(err);
        }else{
            let json_data = JSON.parse(data);
            res.send(json_data);
            res.end();
        }
    });
});

app.get('/commit_filepath', function(req,res){
    let filedata = path.join(__dirname,'data/' + req.query.commit_id +'/file_path.json')
    fs.readFile(filedata,'utf-8',function(err,data){
        if(err){
            console.error(err);
        }else{
            let json_data = JSON.parse(data);
            res.send(json_data);
            res.end();
        }
    });
});

app.get('/file_line_info', function(req,res){
    let filedata = path.join(__dirname,'data/' + req.query.commit_id +'/file_line/' + req.query.filename + '.json')
    fs.readFile(filedata,'utf-8',function(err,data){
        if(err){
            console.error(err);
        }else{
            let text_data = data.toString()
            res.send(text_data);
            res.end();
        }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})