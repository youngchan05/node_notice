require("dotenv").config();

const express = require("express");

const app = express();

// 공지사항
const noticeRoutes = require("./routes/notice.routes");
//권한
const authRoutes = require("./routes/auth.routes");
// 미들웨어
const middleware = require("./middlewares/error.middleware");

app.use(express.json());

app.use("/notice", noticeRoutes);
app.use("/auth", authRoutes);

app.use(middleware);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
