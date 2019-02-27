//mysql连接池配置文件
let mysql = require('mysql')
// let $dbConfig = require('./mysqlConfig');//注意改成自己项目中mysql配置文件的路径
const $dbConfig = {
    host: "localhost",
    user: "root",
    password: "123456",
    port: "3306",
    database: "block"
}

// 使用连接池，避免开太多的线程，提升性能
let pool = mysql.createPool($dbConfig);

/**
 * 对query执行的结果自定义返回JSON结果
 */

// pool.getConnection(function (err, connect) { //通过getConnection()方法进行数据库连接
//     if (err) {
//         console.log(`mysql链接失败啦啦啦${err}`);
//     } else {
//         connect.query('select * from user', function (err, result) {
//             if (err) {
//                 console.log(`SQL error:${err}`)
//             } else {
//                 console.log(result);
//                 connect.release(); //释放连接池中的数据库连接
//                 pool.end(); //关闭连接池
//             }
//         });
//     }
// })


pool.getConnection(function (err, connect) { //通过getConnection()方法进行数据库连接
    if (err) {
        console.log(`mysql链接失败啦啦啦${err}`);
    } else {
        connect.query('select * from artic', function (err, result) {
            if (err) {
                console.log(`SQL error:${err}`)
            } else {
                console.log(result);
                connect.release(); //释放连接池中的数据库连接
                pool.end(); //关闭连接池
            }
        });
    }
})

/**
 * 封装query之sql带不占位符func
 */
function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            callback(err, rows);
            //释放链接
            connection.release();
        });
    });
}


// //exports
// module.exports = {
//     query: getartics,
//     queryArgs: queryArgs,
//     doReturn: responseDoReturn,
//     // getartics:getartics,
//     //   datasearch:getConnection
// }