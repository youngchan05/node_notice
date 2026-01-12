const authService = require("../service/auth/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const successResponse = require("../utils/successResponse");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated;
  const user = await authService.login({
    email,
    password,
  });
  successResponse(res, user);
});

exports.signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated;
  const user = await authService.signUp({
    name,
    email,
    password,
  });
  successResponse(res, user, "Success Create User");
});

exports.retresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const accessToken = await authService.refresh({
    refreshToken,
  });

  successResponse(res, { accessToken }, "Success Token refresh");
});
