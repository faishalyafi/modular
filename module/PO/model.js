const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const supplier = require("../../model/masterSupplierModel");
const PR = require("../PR/model");

const PO = sq.define(
  "PO",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorPO: {
      type: DataTypes.STRING,
    },
    tanggalPO: {
      type: DataTypes.DATE,
    },
    rencanaTglKedatangan: {
      type: DataTypes.DATE,
    },
    pembayaran: {
      type: DataTypes.STRING,
    },
    TOP: {
      type: DataTypes.STRING,
    },
    metodePengiriman: {
      type: DataTypes.STRING,
    },
    totalHarga: {
      type: DataTypes.DOUBLE,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
    PPN: {
      type: DataTypes.INTEGER,
    },
    promo: {
      type: DataTypes.STRING,
    },
    rev: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
PO.belongsTo(supplier);
supplier.hasMany(PO);

PO.belongsTo(PR);
PR.hasMany(PO)

module.exports = PO;
