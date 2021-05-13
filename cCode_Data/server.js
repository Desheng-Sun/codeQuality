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
const { join } = require('path');
const { json } = require('express');
app.use(bodyParser.json());

//模块引用
// const Domestic = require('./modules/domestic');
// const myDate = require('./modules/date');
// const Abroad = require('./modules/abroad');
// const Social = require('./modules/social');


//设置允许跨域请求
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=120');      // 设置强缓存 时间间隔2min
    next();
});



app.get('/commitBaseInfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/commitBaseInfo.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            jsonData.sort((a, b) => {
                return new Date(a["date"]) - new Date(b["date"]);
            })
            let commitId = []
            let commitHash = []
            let commiter = []
            let date = []
            jsonData.forEach(item => {
                commitId.push(item.commitId)
                commitHash.push(item.commitHash)
                commiter.push(item.commiter)
                date.push(item.date)
            });
            let lastData = new Array();
            lastData[0] = commitId
            lastData[1] = commitHash
            lastData[2] = commiter
            lastData[3] = date
            res.send(lastData);
            res.end();
        }
    });
});

app.get('/userissueCount', function (req, res) {
    let filedata = path.join(__dirname, 'data/' + req.query.commitId + '/userissueCount.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
            res.end();
        }
    });
});

app.get('/codeQualityInfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/codeQualityInfo.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
            res.end();
        }
    });
});

app.get('/commitFilePath', function (req, res) {
    let filedata = path.join(__dirname, 'data/' + req.query.commitId + '/filePath.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
            res.end();
        }
    });
});

app.get('/fileLineInfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/' + req.query.commitId + '/fileLine/' + req.query.filename + '.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let text_data = data.toString()
            res.send(text_data);
            res.end();
        }
    });
});

app.get('/userinfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/userBaseInfo.json/')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            let lastData = new Array();
            lastData[0] = jsonData.commitId
            lastData[1] = jsonData.commitHash
            lastData[2] = jsonData.commiter
            lastData[3] = jsonData.date
            lastData[4] = jsonData.userdata
            res.send(lastData);
            res.end();
        }
    });
});

app.get('/commitInfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/commitBaseInfo.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            jsonData.sort((a, b) => {
                return new Date(a["date"]) - new Date(b["date"]);
            })
            let commitId = []
            let commitHash = []
            let commiter = []
            let date = []
            let filesChange = []
            let lineAdd = []
            let lineDel = []
            let issuesAdd = []
            let issuesDel = []
            jsonData.forEach(item => {
                commitId.push(item.commitId)
                commitHash.push(item.commitHash)
                commiter.push(item.commiter)
                date.push(item.date)
                filesChange.push(item.filesChange)
                lineAdd.push(item.lineAdd)
                lineDel.push(item.lineDel)
                issuesAdd.push(item.issuesAdd)
                issuesDel.push(item.issuesDel)
            });
            let lastData = new Array();
            lastData[0] = commitId
            lastData[1] = commitHash
            lastData[2] = commiter
            lastData[3] = date
            lastData[4] = filesChange
            lastData[5] = lineAdd
            lastData[6] = lineDel
            lastData[7] = issuesAdd
            lastData[8] = issuesDel
            res.send(lastData);
            res.end()
        }
        
    })
})

app.get('/UserInfoCompare', function (req, res) {
    let filedata = path.join(__dirname, 'data/userBaseInfoCompare.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
            res.end()
        }
        
    })
})


app.get('/IssuesInfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/' + req.query.commitId + '/issues.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
            res.end()
        }
    })
})

app.get('/RulesInfo', function (req, res) {
    let filedata = path.join(__dirname, 'data/allRules.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
            res.end()
        }
    })
})

app.get('/FileQuality', function (req, res) {    
    let filedata = path.join(__dirname, 'data/' + req.query.commitId + '/CodeQualityInfo.json')
    fs.readFile(filedata, 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let jsonData = JSON.parse(data);
            res.send(jsonData)
            res.end()
        }
    })
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})