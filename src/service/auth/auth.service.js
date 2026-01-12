const jwt = require("jsonwebtoken");
const appError = require("../../utils/appError");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const { supabase } = require("../../config/supabase");

exports.login = async ({ email, password }) => {
  const { data: user, error: loginError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (loginError || !user) throw appError("Invalid credentials1", 401);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw appError("Invalid credentials2", 401);

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "14d" }
  );

  const { error } = await supabase.from("users").update({
    refresh_token: refreshToken,
    refresh_token_exp: new Date(Date.now() + 14 * 86400000),
  });

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

exports.signUp = async ({ name, email, password }) => {
  // 1. 필수값 체크
  if (!name || !email || !password)
    throw appError("Missing required fields", 400);

  // 2. 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw appError("Invalid email format", 400);
  }

  // 3. 비밀번호 정책
  if (password.length < 8) {
    throw appError("Password must be at least 8 characters", 400);
  }
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
