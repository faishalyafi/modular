const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");

const formula = require("../formula/model");
const user = require("../masterUser/model");
const gudang = require("../gudang/model");

const produksi = sq.define(
  "produksi",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    kodeBatch: {
      type: DataTypes.STRING,
    },
    tanggalProduksi: {
      type: DataTypes.DATE,
    },
    tanggalRencanaProduksi: {
      type: DataTypes.DATE,
    },
    tanggalSelesaiProduksi: {
      type: DataTypes.DATE,
    },
    tanggalKadaluarsa: {
      type: DataTypes.DATE,
    },
    kodeProduksi: {
      type: DataTypes.STRING,
    },
    jumlahProduksi: {
      type: DataTypes.DOUBLE,
    },
    realisasiJumlahProduksi: {
      type: DataTypes.DOUBLE,
    },
    statusProduksi: {
      type: DataTypes.INTEGER,  //0:planing //1:sedangBerjalan //2:Berhasil //3:gagal
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

produksi.belongsTo(formula);
formula.hasMany(produksi);

produksi.belongsTo(user);
user.hasMany(produksi);

produksi.belongsTo(gudang);
gudang.hasMany(produksi);

module.exports = produksi;
