const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const PR = require("../PR/model");
const barang = require("../masterBarang/model");

const subPR = sq.define(
  "subPR",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jumlahSubPR: {
      type: DataTypes.DOUBLE,
    },
    hargaBelisubPR: {
      type: DataTypes.DOUBLE,
    },
    totalHargaPerBarangsubPR: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
subPR.belongsTo(PR,{onDelete:'CASCADE'});
PR.hasMany(subPR);

subPR.belongsTo(barang);
barang.hasMany(subPR);

module.exports = subPR;
