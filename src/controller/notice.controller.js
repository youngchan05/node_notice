const noticeService = require("../service/notice/notice.service");
const asyncHandler = require("../utils/asyncHandler");
const successResponse = require("../utils/successResponse");

exports.getAllNotices = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const { q, to, from } = req.query;
  const notices = await noticeService.getAll({
    page,
    limit,
    q,
    to,
    from,
  });
  successResponse(res, notices);
});

exports.getById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const notice = await noticeService.getById(id);
  res.json(notice);
});

exports.create = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const files = req.files;

  const notice = await noticeService.create({
    title,
    content,
    files,
  });
  res.json(notice);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const files = req.files;

  const notice = await noticeService.update({
    id,
    title,
    content,
    files,
  });
  res.json(notice);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notice = await noticeService.delete(id);
  res.json(notice);
});
