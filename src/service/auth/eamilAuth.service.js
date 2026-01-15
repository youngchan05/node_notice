const { supabase } = require("../../config/supabase");
const appError = require("../../utils/appError");
const { generateCode } = require("../../utils/generateCode");

exports.sendEmailCode = async ({ email, purpose }) => {
  // 인증 코드 생성
  const code = generateCode();

  //중복 방지용으로 제거
  await supabase
    .from("email_verifications")
    .delete()
    .eq("email", email)
    .eq("purpose", purpose);

  const { data, error } = await supabase.from("email_verifications").insert({
    email,
    code,
    purpose,
    expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5분
  });

  if (error) appError("Failed  Inert verification Eamil");

  return data;
};
