const authService = require("../service/auth/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const successResponse = require("../utils/successResponse");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login({
    email,
    password,
  });
  successResponse(res, user);
});

exports.signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.signUp({
    name,
    email,
    password,
  });
  successResponse(res, user, "Success Create User");
});
