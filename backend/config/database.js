const { Sequelize } = require("sequelize")
const mysql = require('mysql2/promise');

const db = new Sequelize('db_auth','root','',{
    host: 'localhost',
    dialect: 'mysql'
})

// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'db_auth'
// });

module.exports = db;