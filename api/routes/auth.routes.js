const express = require("express");
const { registerUser } = require("../controllers/auth/register");
const { loginUser } = require("../controllers/auth/login");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
