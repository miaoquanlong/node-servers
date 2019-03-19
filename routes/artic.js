
var express = require('express');
var router = express.Router();
var pool = require("../common/sqlconfig");

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
