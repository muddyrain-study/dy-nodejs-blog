const { DataTypes } = require('sequelize');

const sequelize = require('../db_connect');

module.exports = sequelize.define(
  'admin',
  {
    // 表字段
    loginId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loginPwd: {
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
