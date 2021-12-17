const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const supplier = require("../../model/masterSupplierModel");
const divisi = require("../../model/masterDivisiModel");

const PR = sq.define(
  "PR",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorPR: {
      type: DataTypes.STRING,
    },
    tanggalPR: {
      type: DataTypes.DATE,
    },
    rencanaTglKedatanganPR: {
      type: DataTypes.DATE,
    },
    pembayaranPR: {
      type: DataTypes.STRING,
    },
    TOPPR: {
      type: DataTypes.STRING,
    },
    metodePengirimanPR: {
      type: DataTypes.STRING,
    },
    totalHargaPR: {
      type: DataTypes.DOUBLE,
    },
    keteranganPR: {
      type: DataTypes.STRING,
    },
    PPNPR: {
      type: DataTypes.INTEGER,
    },
    promoPR: {
      type: DataTypes.STRING,
    },
    revPR: {
      type: DataTypes.STRING,
    },
    statusPR:{
      type: DataTypes.INTEGER,
      defaultValue:0    //0:dibuat //1:acc
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
PR.belongsTo(supplier);
supplier.hasMany(PR);

PR.belongsTo(divisi);
divisi.hasMany(PR);
module.exports = PR;
