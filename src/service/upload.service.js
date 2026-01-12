const { supabase } = require("../config/supabase");
const { v4: uuid } = require("uuid");

exports.uploadFiles = async ({
  files = [],
  bucket,
  folder = "",
  isPublic = true,
}) => {
  if (!files.length) return [];

  const uploadedPaths = []; // 🔥 rollback 기준
  const results = [];

  try {
    for (const file of files) {
      const ext = file.originalname.split(".").pop();
      const filename = `${uuid()}.${ext}`;
      const filePath = folder ? `${folder}/${filename}` : filename;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) throw error;

      uploadedPaths.push(filePath);

      if (isPublic) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

        results.push(data.publicUrl);
      } else {
        results.push(filePath);
      }
    }

    return results;
  } catch (err) {
    console.error("File upload error:", err.message);

    // 🔥 롤백 (경로 기준)
    if (uploadedPaths.length) {
      await supabase.storage.from(bucket).remove(uploadedPaths);
    }

    throw err;
  }
};
