const { DataTypes } = require('sequelize');

const sequelize = require('../db_connect');

module.exports = sequelize.define(
  'demo',
  {
    // 表字段
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
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
