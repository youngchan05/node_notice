const supabase = require("../../config/supabase");
const appError = require("../../utils/appError");

exports.ensureNoticeExists = async (id) => {
  const { data, error } = await supabase
    .from("notices")
    .select("id, title, content")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    throw appError("Notice not found", 404, "NOTICE_NOT_FOUND");
  }
  return data;
};
