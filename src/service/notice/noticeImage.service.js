const supabase = require("../../config/supabase");
const appError = require("../../utils/appError");
const { uploadFiles } = require("../upload.service");

const FOLDER = "notices";
const TABLE_ID = "notice_images";

const NOTICE_BUCKET = "notice-images";

exports.getImagesByNoticeId = async (noticeId) => {
  console.log(noticeId, "noticeId-------");
  const { data, error } = await supabase
    .from(TABLE_ID)
    .select("image_url, sort_order")
    .eq("notice_id", noticeId)
    .order("sort_order", { ascending: true });

  if (error)
    throw appError(
      "Failed to load notice images",
      500,
      "NOTICE_IMAGE_LOAD_FAILED"
    );
  console.log(data, "-----------------");
  return data || [];
};

exports.deleteByNoticeId = async (noticeId) => {
  const { error } = await supabase
    .from(TABLE_ID)
    .delete()
    .eq("notice_id", noticeId);

  if (error) throw error;
};

exports.createNoticeImages = async ({ noticeId, files }) => {
  // 파일 업로드
  const imageUrls = await uploadFiles({
    files,
    bucket: NOTICE_BUCKET,
    folder: FOLDER,
  });

  //  이미지 메타데이터 삽입
  const rows = imageUrls.map((url, index) => {
    return {
      notice_id: noticeId,
      image_url: url,
      sort_order: index,
    };
  });

  const { error: imgError } = await supabase.from(TABLE_ID).insert(rows);

  if (imgError) throw imgError;
};
