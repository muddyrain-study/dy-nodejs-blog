const { DataTypes } = require('sequelize');

const sequelize = require('../db_connect');

module.exports = sequelize.define(
  'message',
  {
    // 表字段
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // 冻结表面 - 使用自定义表明 系统默认会带:s
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
