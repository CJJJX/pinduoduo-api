const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config(); // 环境变量读取
// 中间件
const adminAuth = require("./middlewares/admin-auth");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
// 后台路由文件
const adminArticlesRouter = require("./routes/admin/articles");
const appliesRouter = require("./routes/apply");
const jobsRouter = require("./routes/job");
const userInfoRouter = require("./routes/userInfo");
const resumesRouter = require("./routes/resume");
const sendRouter = require("./routes/send");
const app = express();
// 413 payload 请求体超过大小限制处理
app.use(express.json({ limit: "50mb" })); // 设置为 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// 跨域处理
app.use((req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");

    res.header(
      "Access-Control-Allow-Headers",
      "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PATCH, PUT, DELETE"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    //res.sendStatus(200)
    //res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
// 后台路由配置，第二个参数为中间件

app.use("/admin/articles", adminAuth, adminArticlesRouter);
app.use("/apply", appliesRouter);
app.use("/publish", jobsRouter);
app.use("/userInfo", userInfoRouter);
app.use("/resume", resumesRouter);
app.use("/send", sendRouter);
module.exports = app;
