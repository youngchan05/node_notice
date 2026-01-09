const appError = require("../utils/appError");

exports.requireRole = (roles = []) => {
  return (req, _, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(appError("Forbidden", 403));
    }
    next();
  };
};
