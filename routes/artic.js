
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

//获取Python爬虫回来的 掘金文章
router.get('/juejin', (req, res, next) => {
    pool.query(" SELECT * FROM juejin ORDER BY articID ASC", (err, result) => {
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

module.exports = router;
