const supabase = require("../../config/supabase");
const { deleteImagesByUrls } = require("../imageCleanup.service");
const appError = require("../../utils/appError");
const { ensureNoticeExists } = require("./notice.guard");
const {
  deleteByNoticeId,
  getImagesByNoticeId,
  createNoticeImages,
} = require("./noticeImage.service");

const NOTICE_BUCKET = "notice-images";
const baseNoticeQuery = () => supabase.from("notices");

// 공지사항 전체 조회
exports.getAll = async ({ page = 1, limit = 10 }) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error, count } = await baseNoticeQuery()
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }
  return {
    items: data,
    page,
    limit,
    total: count,
    totalpages: Math.ceil(count / limit),
  };
};

// 공지사항 ID로 조회
exports.getById = async (id) => {
  // 공지사항 기본 정보 조회
  const notice = await ensureNoticeExists(id);

  let images = [];
  //공지사항 이미지 조회
  try {
    const data = await getImagesByNoticeId(id);
    images = data || [];
  } catch (err) {
    console.error("[NOTICE_IMAGE_LOAD_FAIL]", {
      noticeId: id,
      error: err.message,
    });
  }

  return {
    ...notice,
    images: images || [],
  };
};

// 공지사항 생성
exports.create = async ({ title, content, files }) => {
  // 공지사항 데이터 삽입
  const { data: notice, error } = await baseNoticeQuery()
    .insert({ title, content })
    .select()
    .maybeSingle();

  // 공지사항 삽입 오류 처리
  if (error) throw appError("Failed to create notice");

  try {
    await createNoticeImages({
      noticeId: notice.id,
      files,
    });
  } catch (err) {
    console.error("[NOTICE_IMAGE_CRATE_FAIL]");
  }

  return notice;
};

exports.update = async ({ id, title, content, files }) => {
  // 공지사항 조회
  await ensureNoticeExists(id);

  //기존 이미지 조회
  const oldImages = await getImagesByNoticeId(id);

  // storage img 삭제
  if (oldImages && oldImages.length > 0) {
    try {
      await deleteImagesByUrls({
        imageUrls: oldImages.map((img) => img.image_url),
        bucket: NOTICE_BUCKET,
      });
    } catch (err) {
      console.error("[NOTICE_IMAGE_DELETE_FAIL]");
    }
  }
  // DB 이미지 삭제
  await deleteByNoticeId(id);

  // 신규 이미지 업로드
  try {
    await createNoticeImages({
      noticeId: id,
      files,
    });
  } catch (err) {
    console.error("[NOTICE_IMAGE_CRATE_FAIL]");
  }

  // 공지사항 내용 업데이트
  const { data: updatedNotice, error: updateError } = await supabase
    .from("notices")
    .update({ title, content })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (updateError) throw updateError;

  return updatedNotice;
};

exports.delete = async (id) => {
  // 공지사항 조회
  await ensureNoticeExists(id);

  //기존 이미지 조회
  const oldImages = await getImagesByNoticeId(id);

  // storage img 삭제
  if (oldImages && oldImages.length > 0) {
    try {
      await deleteImagesByUrls({
        imageUrls: oldImages.map((img) => img.image_url),
        bucket: NOTICE_BUCKET,
      });
    } catch (err) {
      console.error("[NOTICE_IMAGE_DELETE_FAIL]");
    }
  }
  // DB 이미지 삭제
  await deleteByNoticeId(id);

  const { data, error } = await supabase.from("notices").delete().eq("id", id);

  if (error) {
    throw appError("Failed to delete notice");
  }

  return data;
};
