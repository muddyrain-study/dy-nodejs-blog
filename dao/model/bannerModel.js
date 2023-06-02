const { DataTypes } = require('sequelize');

const sequelize = require('../db_connect');

module.exports = sequelize.define(
  'banner',
  {
    // 表字段
    midImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bigImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
