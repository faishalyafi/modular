const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");

const masterBarang = require('../masterBarang/model');
const subTransaksiPO = require('../subTransaksiPO/model');
const gudang = require('../gudang/model');

const stock = sq.define(
  "stock",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jumlahStock: {
      type: DataTypes.DOUBLE,
    },
    tanggalMasuk: {
      type: DataTypes.DATE,
    },
    tanggalKadaluarsa: {
      type: DataTypes.DATE,
    },
    hargaBeliSatuanStock: {
      type: DataTypes.DOUBLE,
    },
    batchNumber: {
      type: DataTypes.STRING
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

stock.belongsTo(gudang);
gudang.hasMany(stock);

stock.belongsTo(masterBarang);
masterBarang.hasMany(stock);

stock.belongsTo(subTransaksiPO);
subTransaksiPO.hasMany(stock);

module.exports = stock;
