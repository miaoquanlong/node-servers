var models = require('./db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlMap');
var pool = mysql.createPool(models.mysql);

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

router.get('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    console.log(params, "99000");
    pool.query(sql, [params.username, params.pwd], function (error, results, fields) {
        if (error) throw error;
        if (results) {
            console.log(results)
            jsonWrite(res, results);
        }
    })
});

module.exports 