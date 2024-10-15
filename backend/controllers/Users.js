const Users = require("../models/userModel");
const db = require("../config/database");
const bcrypt = require("bcrypt");

const getUsers = async(req, res) => {
    try {
        const [response] = await db.query(`SELECT * FROM users`)
        res.status(200).json(
            response
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const Register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({
            message: "Password dan Confirm Password tidak coock"
        });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await db.query(`INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hashPassword}')`)
        res.status(200).json({
            message: "Register berhasil"
        });
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    getUsers,
    Register
}