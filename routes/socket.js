var express = require('express');
var app = express();
var router = express.Router();

var pool = require("../common/sqlconfig");


var server = require('http').createServer(app);
var io = require('socket.io')(server);

// app.use('/', express.static(__dirname + '/public'));

server.listen(9003);
var userList = []

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
io.on('connection', function (socket) {

    //监听新用户加入
    socket.on('enter', function (obj) {
        if (userList.length > 0) {
            userList.find(item => {
                console.log(item.username, 99);
                console.log(obj, 55);
                if (item.username != obj) {
                    userList.push({ username: obj })
                }
            });
        } else {
            userList.push({ username: obj })
        }

        io.emit('userenter', obj);
        //把当前登录人添加到数组，推送给前端
        io.emit('userList', userList);
        //实时获取所有消息内容 触发客户端方法
        pool.query('SELECT * FROM chart ', (ERR, result) => {
            io.emit('login', result)
        })
    });

    //监听用户退出
    socket.on('userleave', function (obj) {
        io.emit('userlogout', obj);

        //将退出的用户从在线列表中删除
        // if (onlineUsers.hasOwnProperty(socket.name)) {
        //退出用户的信息
        // var obj = { userid: socket.name, username: onlineUsers[socket.name] };

        //删除
        // delete onlineUsers[socket.name];
        //在线人数-1
        // onlineCount--;

        //向所有客户端广播用户退出
    });
    //插入聊天信息

    // //监听用户发布聊天内容 scrollHeight 客户端吧聊天内容框的高度 给搞服务端 服务端返回
    socket.on('compile', (obj, scrollHeight) => {
        pool.query('INSERT INTO chart SET ?', obj, (err, result) => {
            pool.query('SELECT * FROM chart ', (ERR, result) => {
                io.emit('login', result)
                io.emit('scrollHeight', scrollHeight)
            })
        })

    })

});

