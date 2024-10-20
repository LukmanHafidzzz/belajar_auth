const Users = require("../models/userModel");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

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

const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accesToken = jwt.sign({
            userId,
            name,
            email,
        },
        process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({
            userId,
            name,
            email,
        },
        process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({
            refresh_token: refreshToken
        }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: true,
        });
        res.json({
            accesToken
        })
    } catch (error) {
        res.status(404).json({
            message: "Email tidak ditemukan"
        });
    };
}

module.exports = {
    getUsers,
    Register,
    Login,
}