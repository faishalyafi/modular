const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const transaksiOP = require("../transaksiOP/model");
const stock = require("../stock/model");

const subTransaksiOP = sq.define(
  "subTransaksiOP",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jumlahBarangOP: {
      type: DataTypes.DOUBLE,
    },
    hargaJualOP: {
      type: DataTypes.DOUBLE,
    },
    hargaTotalOP: {
      type: DataTypes.DOUBLE,
    },
    isBonus: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

transaksiOP.hasMany(subTransaksiOP);
subTransaksiOP.belongsTo(transaksiOP,{onDelete:'CASCADE'});

subTransaksiOP.belongsTo(stock);
stock.hasMany(subTransaksiOP);

module.exports = subTransaksiOP;
