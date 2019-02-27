var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';
var $sql = require('./sqlMap');
let mysql = require('mysql')

const $dbConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "block"
}

var pool = mysql.createPool($dbConfig);


router.get('/', function (req, res, next) {
    if (!req.session.user) {
        return res.render('login', {});
    }
    res.render('index', {});
});

router.get('/login', function (req, res, next) {
    res.render('login', {});
});

router.get('/tuijian', function (req, res, next) {
    if (!req.session.user) {
        return res.render('login', {});
    }
    res.render('tuijian', {});
});

router.get('/edit', function (req, res, next) {
    console.log(666);

    if (!req.session.user) {
        return res.render('login', {});
    }
    var type = req.query.type;
    if (type) {
        var obj = {};
        switch (type) {
            case 'sanwen':
                obj = {};
                break;
            case 'it':
                obj = {};
                break;
            case 'manager':
                obj = {};
                break;
            case 'cookies':
                obj = {};
                break;
            default:
                return res.send({
                    status: 0,
                    info: '参数错误'
                });
                break;
        }
        fs.readFile(PATH + type + '.json', (err, data) => {
            if (err) {
                return res.send({
                    status: 0,
                    info: 'fail.....'
                });
            }
            var obj = JSON.parse(data.toString());
            return res.json(obj)
        });

    } else {
        return res.send({
            status: 0,
            info: '参数错误'
        });
    }
});




// pool.getConnection(function (err, connect) { //通过getConnection()方法进行数据库连接
//     if (err) {
//         console.log(`mysql链接失败啦啦啦${err}`);
//     } else {
//         connect.query('select * from artic', function (err, result) {
//             if (err) {
//                 console.log(`SQL error:${err}`)
//             } else {
//                 // console.log(result);
//                 connect.release(); //释放连接池中的数据库连接
//                 pool.end(); //关闭连接池
//             }
//         });
//     }
// })

router.get('/addUser', (req, res, next) => {
    pool.query('select * from artic', (err, result) => {
        if (err) {
            return res.json(err)
            console.log("33");
        }
        return res.json(result)
    })
    // res.json({ result })
    // this.pool.getConnection()
    // var sql = 'select * from user '
    // var params = req.body;
    // console.log(params, "99000");
    // pool.query(sql, ...params, function (error, results, fields) {
    //     if (error) throw error;
    //     if (results) {
    //         console.log(results)
    //         jsonWrite(res, results);
    //     }
    // })
});

//首页大表单

module.exports = router;