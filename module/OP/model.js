const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const custommer = require("../masterCustomer/model");
const user = require("../masterUser/model");

const OP = sq.define(
  "OP",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorOP: {
      type: DataTypes.STRING,
    },
    tanggalOrderOP: {
      type: DataTypes.DATE,
    },
    metodePembayaranOP: {
      type: DataTypes.STRING,
    },
    TOPPenjualanOP: {
      type: DataTypes.STRING,
    },
    keteranganPenjualanOP: {
      type: DataTypes.STRING,
    },
    PPNPenjualanOP: {
      type: DataTypes.INTEGER,
    },
    totalHargaOP: {
      type: DataTypes.DOUBLE,
    },
    statusOP:{
      type:DataTypes.INTEGER,   //0: Baru dibuat || 1: di accept || 2: dikirim || 3: lengkap tanpa Bonus || 4: lengkap dengan Bonus
      defaultValue:0
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
OP.belongsTo(custommer);
custommer.hasMany(OP);

OP.belongsTo(user);
user.hasMany(OP);
module.exports = OP;
