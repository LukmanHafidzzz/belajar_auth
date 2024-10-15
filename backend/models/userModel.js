const { Sequelize } = require("sequelize");
const db = require("../config/database")

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT
}, {
    freezeTableName: true
})

module.exports = Users;