const sequelize = require('./db_connect');
const md5 = require('md5');
// 数据模型
const adminModel = require('./model/adminModel');
const bannerModel = require('./model/bannerModel');
const blogTypeModel = require('./model/blogTypeModel');
const blogModel = require('./model/blogModel');
const demoModel = require('./model/demoModel');
const messageModel = require('./model/messageModel');

(async function () {
  // 定义模型之间的关联关系

  // 博客和博客分类之间的关系
  blogTypeModel.hasMany(blogModel, {
    foreignKey: 'categoryId',
    sourceKey: 'id',
  });
  blogModel.belongsTo(blogTypeModel, {
    foreignKey: 'categoryId',
    sourceKey: 'id',
    as: 'category',
  });

  // 博客和博客评论之间存在关联关系
  messageModel.belongsTo(blogModel, {
    foreignKey: 'blogId',
    sourceKey: 'id',
    as: 'blog',
  });
  blogModel.hasMany(messageModel, {
    foreignKey: 'blogId',
    sourceKey: 'id',
  });

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

  // banner 进行初始化操作
  const bannerCount = await bannerModel.count();
  if (!bannerCount) {
    await bannerModel.bulkCreate([
      {
        midImg: '/static/images/bg1_mid.jpg',
        bigImg: '/static/images/bg1_big.jpg',
        title: '塞尔达旷野之息',
        description: '2017年年度游戏，期待续作',
      },
      {
        midImg: '/static/images/bg2_mid.jpg',
        bigImg: '/static/images/bg2_big.jpg',
        title: '塞尔达四英杰',
        description: '四英杰里面你最喜欢的又是谁呢',
      },
      {
        midImg: '/static/images/bg3_mid.jpg',
        bigImg: '/static/images/bg3_big.jpeg',
        title: '日本街道',
        description: '动漫中经常出现的日本农村街道，一份独特的恬静',
      },
    ]);
    console.log('初始化首页标语数据...');
  }
  console.log('数据库数据已经准备完毕....');
})();
