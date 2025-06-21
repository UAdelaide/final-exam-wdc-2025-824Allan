const express  = require('express');
const session  = require('express-session');
const path     = require('path');

const app = express();

// ① 解析表单
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ② session（一定要在路由之前）
app.use(
  session({
    secret: 'dogwalk-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// ③ 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// ④ 路由
app.use('/', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/walks', require('./routes/walkRoutes'));

module.exports = app;   // 你之前就是导出 app，保留即可
