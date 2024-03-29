var createError = require('http-errors');
var express = require('express');
var path = require('path');
const md5 = require('md5');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJWt = require('express-jwt');
const {
  ForbiddenError,
  UnknownError,
  ServiceError,
} = require('./utils/errors');
const session = require('express-session');

// 默认读取项目根目录下的 .env 环境变量文件
require('dotenv').config();

require('express-async-errors');

// 引入数据库
require('./dao/db');

var app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置验证 token 接口
app.use(
  expressJWt
    .expressjwt({
      secret: md5(process.env.JWT_SECRET),
      algorithms: ['HS256'],
    })
    .unless({
      // 需要排除验证的路由
      path: [
        { url: '/api/admin/login', methods: ['POST'] },
        { url: '/res/captcha', methods: ['GET'] },
        { url: '/api/banner', methods: ['GET'] },
        { url: '/api/blogType', methods: ['GET'] },
        { url: '/api/blog', methods: ['GET'] },
        { url: '/api/project', methods: ['GET'] },
        { url: '/api/message', methods: ['GET', 'POST'] },
        { url: '/api/comment', methods: ['GET', 'POST'] },
        { url: /\/api\/blog\/\d/, methods: ['GET'] },
      ],
    })
);

// 引入路由
app.use('/api/admin', require('./routes/admin'));
app.use('/api/captcha', require('./routes/captcha'));
app.use('/api/banner', require('./routes/banner'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/blogType', require('./routes/blogType'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/project', require('./routes/demo'));
app.use('/api/message', require('./routes/message'));
app.use('/api/comment', require('./routes/message'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理，一旦发生了错误，就会到这里来
app.use(function (err, req, res, next) {
  console.log('err.name>>>', err.name);
  console.log('err.message>>>', err.message);
  if (err.name === 'UnauthorizedError') {
    // 说明是 token 验证错误，接下来我们来抛出我们自定义的错误
    res.send(new ForbiddenError('未登录，或者登录已经过期').toResponseJSON());
  } else if (err instanceof ServiceError) {
    res.send(err.toResponseJSON());
  } else {
    console.log(err);
    res.send(new UnknownError().toResponseJSON());
  }
});

module.exports = app;
