const { DataTypes } = require("sequelize");
const sq = require("../config/connection");

const produksi = require("../model/produksiModel");
const stock = require("../model/stockModel");
const masterBarang = require("../model/masterBarangModel");
const user = require("../model/userModel");

const subProduksi = sq.define(
  "subProduksi",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jumlahBahanProduksi: {
        type: DataTypes.DOUBLE
    },
    PICSubProduksi:{
      type: DataTypes.STRING
    },
    tanggalKeluarSubProduksi:{
      type: DataTypes.DATE
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

subProduksi.belongsTo(produksi);
produksi.hasMany(subProduksi);

subProduksi.belongsTo(stock);
stock.hasMany(subProduksi);

subProduksi.belongsTo(masterBarang);
masterBarang.hasMany(subProduksi);

subProduksi.belongsTo(user);
user.hasMany(subProduksi);

module.exports = subProduksi;
