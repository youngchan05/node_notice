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
