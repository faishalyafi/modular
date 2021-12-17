const { DataTypes } = require("sequelize");
const sq = require("../config/connection");
const masterCustomer = require("../model/customerModel");
const masterSupplier = require("../model/masterSupplierModel");

const masterPic = sq.define(
  "masterPic",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorIdentitas: {
      type: DataTypes.STRING(50),
    },
    jenisIdentitas: {
      type: DataTypes.STRING(50),
    },
    nama: {
      type: DataTypes.STRING(50),
    },
    nomorTelepon: {
      type: DataTypes.STRING(50),
    },
    jabatan: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(50),
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

masterPic.belongsTo(masterCustomer);
masterCustomer.hasMany(masterPic);

masterPic.belongsTo(masterSupplier);
masterSupplier.hasMany(masterPic);

module.exports = masterPic;
