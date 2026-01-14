const appError = require("../../utils/appError");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const { supabase } = require("../../config/supabase");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_EXP_DATE,
} = require("../../utils/jwtToken");

exports.login = async ({ email, password }) => {
  const { data: user, error: loginError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (loginError || !user) throw appError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw appError("Invalid credentials", 401);

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const { error } = await supabase
    .from("users")
    .update({
      refresh_token: refreshToken,
      refresh_token_exp: REFRESH_TOKEN_EXP_DATE,
    })
    .eq("id", user.id);

  if (error) console.error("user token Update Fail!");

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

exports.logOut = async (id) => {
  const { error } = await supabase
    .from("users")
    .update({
      refresh_token: null,
      refresh_token_exp: null,
    })
    .eq("id", id)
    .maybeSingle();

  if (error) throw appError("Logout failed", 400);
};

exports.signUp = async ({ name, email, password }) => {
  //  이메일 중복 체크
  const { data: exiStingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  // 중복 유저
  if (exiStingUser) throw appError("Email already exists", 409);

  // 비밀번호 생성
  // bcrypt로 비밀번호 암호화 하기
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  // 사용자 생성
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      id: uuid(),
      email,
      password: hashPassword,
      name,
      role: "user",
    })
    .select()
    .maybeSingle();

  if (error) throw appError("Failed Create user", 400);

  return user;
};

exports.refresh = async ({ refreshToken }) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw appError("Invalid refresh token", 401);
  }

  // 사용자 조회
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", payload.userId)
    .single();

  console.log(user, "-------------user");

  if (error || !user) throw appError("Invlid refresh token", 401);

  // DB 저장된  refresh token 비교

  if (user.refresh_token !== refreshToken)
    throw appError("Invalid refresh token", 401);

  // refresh toekn 만료 시간 확인
  if (new Date(user.refresh_token_exp) < new Date())
    throw appError("Refresh token expired", 401);

  // 새로운 access token 발급
  const newAccessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  const { error: refreshError } = await supabase
    .from("users")
    .update({
      refresh_token: newRefreshToken,
      refresh_token_exp: REFRESH_TOKEN_EXP_DATE,
    })
    .eq("id", user.id);
  if (refreshError) console.error("Faild reFresh");

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
