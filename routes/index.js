var express = require('express');
var router = express.Router();
// var fs = require('fs');
let mysql = require('mysql')

const $dbConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "block"
}

var pool = mysql.createPool($dbConfig);




// pool.getConnection(function (err, connect) { //通过getConnection()方法进行数据库连接
//     if (err) {
//         console.log(`mysql链接失败999${err}`);
//     } else {
//         connect.query('select * from user', function (err, result) {
//             if (err) {
//                 console.log(`SQL error:${err}`)
//             } else {
//                 console.log(result);
//                 connect.release(); //释放连接池中的数据库连接
//                 // pool.end(); //关闭连接池
//             }
//         });
//     }
// })

//首页
router.get('/Home', (req, res, next) => {
    pool.query('select * from Home', (err, result) => {
        if (err) {
            return res.json({
                code: -1,
                data: err
            })
        }
        return res.json({
            code: 0,
            data: result
        })
        pool.end()
    })
});
//关于我
router.get('/about', (req, res, next) => {
    pool.query('select * from about', (err, result) => {
        if (err) {
            return res.json({
                code: -1,
                data: err
            })
        }
        return res.json({
            code: 0,
            data: result
        })
        pool.end()
    })
});
//用户注册
router.post('/userRegister', (req, res, next) => {
    let reqs = req.body
    let params = { userName: reqs.username, passWord: reqs.password }
    pool.query("SELECT * FROM userRegister WHERE userName=" + mysql.escape(reqs.username), (err, results) => {
        if (results.length > 0) {
            return res.json({
                code: -1,
                data: '该用户名已注册'
            })
        }
        pool.query('INSERT INTO userRegister SET ?', params, (err, result, fields) => {
            if (err) {
                return res.json({
                    code: -1,
                    data: '数据库写入失败'
                })
            }
            return res.json({
                code: 0,
                data: result
            })
            pool.end()
        })
    })


})
//用户登陆
router.post('/login', (req, res, next) => {
    let reqs = req.body
    pool.query("SELECT * FROM userRegister WHERE userName = ? && passWord = ?", [reqs.username, reqs.password], (err, result) => {
        if (result.length > 0) {
            return res.json({
                code: 0,
                data: result[0]
            })
        }
        return res.json({
            code: -1,
            data: '用户名或密码不正确,请检查'
        })
        pool.end()
    })
})
//用户评论
router.post('/message', (req, res, next) => {
    let reqs = req.body
    console.log(reqs, "665");
    let post = { messageName: reqs.messageName, content: reqs.content, dataTime: new Date()}
    pool.query("INSERT INTO message SET ?", post, (err, result) => {
        if (err) {
            return res.json({
                code: -1,
                data: '评论失败'
            })
        }
        return res.json({
            code: 0,
            data: '留言成功'
        })
    })
})
//获取用户评论
router.get('/getmessage', (req, res, next) => {
    pool.query(" SELECT * FROM  message  ORDER BY DATAtIME DESC", (err, result) => {
        if (err) {
            return res.json({
                code: -1,
                data: '获取失败'
            })
        }
        return res.json({
            code: 0,
            data: result
        })
    })
})

module.exports = router;