const exporess = require("express");

const router = exporess.Router();
const noticeController = require("../controller/notice.controller");
const { upload } = require("../middlewares/upload.middleware");

router.get("/", noticeController.getAllNotices);
router.get("/:id", noticeController.getById);
router.post("/", upload.array("images", 5), noticeController.create);
router.put("/:id", upload.array("images", 5), noticeController.update);
router.delete("/:id", noticeController.delete);

module.exports = router;
