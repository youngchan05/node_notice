const exporess = require("express");

const router = exporess.Router();
const authController = require("../controller/auth.controller");

router.post("/login", authController.login);

module.exports = router;
