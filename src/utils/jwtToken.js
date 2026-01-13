const TOKEN_EXP = "15m"; //토큰 유효시간
const REFRESH_TOKEN_EXP = "14d"; //리플래시 토큰 유효시간

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXP }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXP }
  );
};

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
};
