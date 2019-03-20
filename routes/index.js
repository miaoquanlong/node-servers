var express = require('express');
var router = express.Router();
// var fs = require('fs');
let mysql = require('mysql')

// const $dbConfig = {
//     host: "localhost",
//     user: "root",
//     password: "123456",
//     port: "3306",
//     database: "block"
// }

// var pool = mysql.createPool($dbConfig);

var pool = require("../common/sqlconfig");

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
    let post = { messageName: reqs.messageName, content: reqs.content, dataTime: new Date(), userID: reqs.userID }
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
        pool.end()

    })
})
//获取用户评论
router.get('/getmessage', (req, res, next) => {
    pool.query(" SELECT * FROM  message  ORDER BY DATAtIME DESC", (err, result) => {
        // pool.query("SELECT * FROM message LEFT JOIN reply on message.ID = messageID  ORDER BY DATAtIME DESC", (err, result) => {
        if (err) {
            return res.json({
                code: -1,
                data: '获取失败'
            })
        }
        let results = result.map(item => {
            return {
                ID: item.ID,
                canEdit: item.canEdit == 1 ? true : false,
                content: item.content,
                dataTime: item.dataTime,
                messageName: item.messageName,
                userID: item.userID,
            }
        })
        return res.json({
            code: 0,
            data: result
        })
        pool.end()
    })
})
//获取用户回复
router.get('/getreply', (req, res, next) => {
    pool.query("SELECT * FROM reply", (err, result) => {
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
        pool.end()
    })

})

//删除用户评论
router.post('/deletemessage', (req, res, next) => {
    let reqs = req.body
    pool.query(" DELETE FROM message WHERE userID = ? &&ID = ?", [reqs.userID, reqs.messageID], (err, result) => {
        if (err) {
            return res.json({
                code: -1,
                data: '评论删除失败'
            })
        }
        return res.json({
            code: 0,
            data: '删除成功'
        })
        pool.end()
    })
})
//修改评论
router.post('/editmessage', (req, res, next) => {
    let reqs = req.body
    let query = pool.query(" UPDATE message SET content = ?  WHERE userID = ? && ID = ? ", [reqs.content, reqs.userID, reqs.messageID], (err, result) => {
        console.log(query.sql);
        if (err) {
            return res.json({
                code: -1,
                data: '评论修改失败'
            })
        }
        return res.json({
            code: 0,
            data: '修改成功'
        })
        pool.end()
    })
})
//回复评论
router.post('/reply', (req, res, next) => {
    let reqs = req.body
    let post = { replyname: reqs.replyname, replycontent: reqs.replycontent, messageID: reqs.messageID, replyTime: new Date() }
    pool.query('INSERT INTO reply SET ?', post, (err, resule) => {
        if (err) {
            return res.json({
                code: -1,
                data: '回复失败'
            })
        }
        return res.json({
            code: 0,
            data: '回复成功'
        })
        pool.end()
    })
})

// //获取Python爬虫回来的 掘金文章
// router.get('/juejin', (req, res, next) => {
//     pool.query(" SELECT * FROM juejin", (err, result) => {
//         if (err) {
//             return res.json({
//                 code: -1,
//                 data: '获取成功'
//             })
//         }
//         return res.json({
//             code: 0,
//             data: result
//         })
//         pool.end()
//     })
// })

module.exports = router;