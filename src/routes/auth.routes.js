const exporess = require("express");

const router = exporess.Router();
const authController = require("../controller/auth.controller");

router.post("/login", authController.login);
router.post("/signUp", authController.signUp);

module.exports = router;
