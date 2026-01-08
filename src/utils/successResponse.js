module.exports = (res, data = null, mesaage) => {
  const response = {
    success: true,
    data,
  };
  if (mesaage) {
    response.mesaage = mesaage;
  }
  return res.status(200).json(response);
};
