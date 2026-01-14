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

exports.logOut = asyncHandler(async (req, res) => {
  await authService.logOut(req.user.id);
  successResponse(res, null, "Success LogOut");
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

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const accessToken = await authService.refresh({
    refreshToken,
  });

  successResponse(res, { accessToken, refreshToken }, "Success Token refresh");
});
