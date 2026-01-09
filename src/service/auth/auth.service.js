const jwt = require("jsonwebtoken");
const supabase = require("../../config/supabase");
const appError = require("../../utils/appError");
const bcrypt = require("bcryptjs");

exports.login = async ({ email, password }) => {
  const { data: user, error: loginError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  console.log(user, "---------------user");

  if (loginError || !user) throw appError("Invalid credentials1", 401);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw appError("Invalid credentials2", 401);

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    proccess.evn.JWT_SECRET,
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
