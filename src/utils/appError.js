module.exports = (message, status = 500, code = null) => {
  const error = new Error(message);
  error.status = status;
  error.success = false;
  if (code) error.code = code;
  return error;
};
