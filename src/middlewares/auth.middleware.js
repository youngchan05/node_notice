const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");

module.exports = (req, _, next) => {
  const authHeader = req.headers.authorization;

  //   토큰 없는 경우
  if (!authHeader || !authHeader.startWith("Bearer ")) {
    return next(appError("Unauthorized", 401));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return next(appError("Invalid token", 401));
  }
};
