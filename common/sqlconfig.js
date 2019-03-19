
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

module.exports = pool;
