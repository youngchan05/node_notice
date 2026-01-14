const exporess = require("express");

const router = exporess.Router();
const authController = require("../controller/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { loginSchema, signUpSchema } = require("../validations/auth.validation");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/login", validate(loginSchema), authController.login);
router.post("/logOut", authMiddleware, authController.login);
router.post("/signUp", validate(signUpSchema), authController.signUp);

module.exports = router;
