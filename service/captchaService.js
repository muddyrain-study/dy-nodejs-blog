const svgCaptcha = require('svg-captcha');

module.exports.getCaptchaService = async () => {
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: 'iIl10Oo',
    noise: 6,
    color: true,
  });
  return captcha;
};
