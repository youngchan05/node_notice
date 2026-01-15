const authService = require("../service/auth/auth.service");
const emailAuthService = require("../service/auth/eamilAuth.service");
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
// 인증번호 발송
exports.sendEmailCode = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;

  await emailAuthService.sendEmailCode({
    email,
    purpose,
  });

  successResponse(res, null, "Verification code sent");
});
