const sequelize = require('./db_connect');
const md5 = require('md5');
// 数据模型
const adminModel = require('./model/adminModel');

(async function () {
  sequelize.sync({
    // 同步表字段
    alter: true,
  });

  const adminCount = await adminModel.count();
  if (!adminCount) {
    // 进入此 if，说明该表没有数据，我们进行一个初始化
    await adminModel.create({
      loginId: 'admin',
      name: '超级管理员',
      loginPwd: md5('123456'),
    });
    console.log('初始化管理员数据完毕...');
  }
  console.log('数据库数据已经准备完毕....');
})();
