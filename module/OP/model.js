const { DataTypes } = require("sequelize");
<<<<<<< HEAD:module/OP/model.js
const sq = require("../../config/connection");
const custommer = require("../masterCustomer/model");
const user = require("../masterUser/model");
=======
const sq = require("../config/connection");
const custommer = require("./customerModel");
const user = require("../module/user/model");
>>>>>>> c18e09ce7879a1c5ed657d0ceb77d799163e8261:model/opModel.js

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
      type:DataTypes.INTEGER,
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
