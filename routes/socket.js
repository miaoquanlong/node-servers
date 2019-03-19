var express = require('express');
var app = express();
let mysql = require('mysql')
var router = express.Router();

const $dbConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "block"
}

var pool = mysql.createPool($dbConfig);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// app.use('/', express.static(__dirname + '/public'));

server.listen(9003);

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function (socket) {
    console.log('有用户链接了');
    pool.query('SELECT * FROM chart ', (ERR, result) => {
        io.emit('login', result)
    })

    //监听新用户加入
    socket.on('login', function (obj) {
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.userid;
        //检查在线列表，如果不在里面就加入
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }

        //向所有客户端广播用户加入
        io.emit('login', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
        console.log(obj.username + '加入了聊天室');
    });

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出的用户从在线列表中删除
        if (onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = { userid: socket.name, username: onlineUsers[socket.name] };

            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('logout', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
            console.log(obj.username + '退出了聊天室');
        }
    });
    //插入聊天信息


    // //监听用户发布聊天内容
    socket.on('compile', (obj) => {
        pool.query('INSERT INTO chart SET ?', obj, (err, result) => {
            pool.query('SELECT * FROM chart ', (ERR, result) => {
                io.emit('login', result)
            })
        })

    })

});

