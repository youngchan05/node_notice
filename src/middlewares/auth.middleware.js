const appError = require("../utils/appError");
const { verifyAccessToken } = require("../utils/jwtToken");

module.exports = (req, _, next) => {
  const authHeader = req.headers.authorization;

  //   토큰 없는 경우
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(appError("Unauthorized", 401));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded?.userId) {
      return next(appError("Unauthorized", 401));
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return next(appError("Invalid token", 401));
  }
};
