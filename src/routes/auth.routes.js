const exporess = require("express");

const router = exporess.Router();
const authController = require("../controller/auth.controller");
const { validate } = require("../middlewares/validate.middleware");
const { loginSchema, signUpSchema } = require("../validations/auth.validation");

router.post("/login", validate(loginSchema), authController.login);
router.post("/signUp", validate(signUpSchema), authController.signUp);

module.exports = router;
