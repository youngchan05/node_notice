const appError = require("../utils/appError");

exports.validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issue = result.error.issues[0];

    return next(appError(issue.message || "Invalid request", 400));
  }

  req.validated = result.data;
  next();
};
