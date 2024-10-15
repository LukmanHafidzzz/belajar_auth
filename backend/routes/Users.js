const express = require("express");
const { getUsers, Register } = require("../controllers/Users")
const router = express.Router();

router.get('/users', getUsers)
router.post('/users', Register)

module.exports = router;