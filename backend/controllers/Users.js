// const Users = require("../models/userModel");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

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
        await db.query(`INSERT INTO users (name, email, password) VALUES ('?', '?', '?')`, {
            replacements: [name, email, password],
            type: QueryTypes.INSERT,
        })
        res.status(200).json({
            message: "Register berhasil"
        });
    } catch (error) {
        console.log(error);
        
    }
}

const Login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const [response] = await db.query(`SELECT * FROM users WHERE email = ?`, {
            replacements: [email],
            type: QueryTypes.SELECT
        });
        console.log(response);
        
        if (response.length === 0) {
            return res.status(404).json({
                message: "Email tidak ditemukan"
            });
        }

        const user = response;
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({
                message: "Password salah"
            });
        }

        const userId = user.id;
        const name = user.name;
        const userEmail = user.email;

        const accessToken = jwt.sign({
            userId,
            name,
            userEmail,
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '20s'
        });

        const refreshToken = jwt.sign({
            userId,
            name,
            userEmail,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '1d'
        });

        await db.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, {
            replacements: [refreshToken, userId],
            type: QueryTypes.UPDATE
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: true,
        });

        res.json({
            accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    getUsers,
    Register,
    Login,
}