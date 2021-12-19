const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");

const masterPengiriman = sq.define(
  "masterPengiriman",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jenisKendaraan: {
      type: DataTypes.STRING(50),
    },
    nomorPengiriman: {
      type: DataTypes.STRING(50),
    },
    namaPengirim: {
      type: DataTypes.STRING(50),
    },
    noTelpPengirim: {
      type: DataTypes.STRING(50),
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = masterPengiriman;
