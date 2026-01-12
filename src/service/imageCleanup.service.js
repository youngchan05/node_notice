const { supabaseAdmin } = require("../config/supabase");

exports.deleteImagesByUrls = async ({ imageUrls = [], bucket }) => {
  if (!imageUrls || imageUrls.length === 0) return;

  const paths = imageUrls.map((url) => url.split(`${bucket}/`)[1]);

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .remove(paths);

  if (error) throw error;
  console.log("SUCCESS DELETE IMG");
};
