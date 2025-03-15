const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/login", AuthController.login);
router.get("/check", AuthController.checkLogin);
router.post("/logout", AuthController.logout);

module.exports = router;
