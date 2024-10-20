const express = require("express");
const { getUsers, Register, Login } = require("../controllers/Users")
const { verifyToken } = require("../middlewares/VerifyToken")

const router = express.Router();

router.get('/users', verifyToken, getUsers)
router.post('/users', Register)
router.post('/login', Login)

module.exports = router;