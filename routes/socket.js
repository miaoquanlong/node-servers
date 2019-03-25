var express = require('express');
var app = express();
var router = express.Router();

var pool = require("../common/sqlconfig");
var _ = require('lodash')


var server = require('http').createServer(app);
var io = require('socket.io')(server);


server.listen(9003);
var userList = []
var logoutList = []


//当前在线人数
var onlineCount = 0;
io.on('connection', function (socket) {
    //监听新用户加入
    socket.on('enter', function (name) {
        if (userList.indexOf(name) === -1 && name != null) {
            userList.push(name)
        }
        console.log(userList, "96");

        io.emit('userenter', name);
        io.emit('userList', userList, userList.length);
        //实时获取所有消息内容 触发客户端方法
        pool.query('SELECT * FROM chart ', (err, result) => {
            io.emit('login', result)
        })
    });
    //监听用户退出
    socket.on('userleave', function (name) {
        let index = userList.indexOf(name)
        if (index !== -1) {
            userList.splice(index, 1)
        }
        //向所有客户端广播用户退出
        io.emit('userlogout', name, userList);

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

