var express = require('express');
const { getCaptchaService } = require('../service/captchaService');
var router = express.Router();

// 验证码
router.get('/', async function (req, res, next) {
  // 生成验证码
  const captcha = await getCaptchaService();
  req.session.captcha = captcha.text;
  // 设置响应头
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(captcha.data);
});

module.exports = router;
