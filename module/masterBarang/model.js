const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const unit = require("../masterUnit/model");
const masterKategoriBarang = require("../masterKategoriBarang/model");

const masterBarang = sq.define(
  "masterBarang",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    kodeBarang: {
      type: DataTypes.STRING,
    },
    namaBarang: {
      type: DataTypes.STRING,
    },
    barcode: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.STRING,
    },
    jumlahTotalBarang:{
      type: DataTypes.INTEGER,
      defaultValue:0
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

masterBarang.belongsTo(masterKategoriBarang);
masterKategoriBarang.hasMany(masterBarang);

masterBarang.belongsTo(unit);
unit.hasMany(masterBarang);

module.exports = masterBarang;
