const { DataTypes } = require("sequelize");
const sq = require("../config/connection");

const masterKategoriBarang = sq.define(
  "masterKategoriBarang",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    namaKategori: {
      type: DataTypes.STRING(50),
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = masterKategoriBarang;
