const { DataTypes } = require("sequelize");
const sq = require("../config/connection");
const PO = require("./poModel");
const barang = require("./masterBarangModel");

const subPO = sq.define(
  "subPO",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jumlah: {
      type: DataTypes.DOUBLE,
    },
    hargaBeli: {
      type: DataTypes.DOUBLE,
    },
    totalHargaPerBarang: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
subPO.belongsTo(PO,{onDelete:'CASCADE'});
PO.hasMany(subPO);

subPO.belongsTo(barang);
barang.hasMany(subPO);

module.exports = subPO;
