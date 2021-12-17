const { DataTypes } = require("sequelize");
const sq = require("../config/connection");
const barang = require("./masterBarangModel");
const kategoriHarga = require("./masterKategoriHargaModel");

const poolHargaJual = sq.define(
  "poolHargaJual",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    hargaJual: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

poolHargaJual.belongsTo(barang);
barang.hasMany(poolHargaJual);

poolHargaJual.belongsTo(kategoriHarga);
kategoriHarga.hasMany(poolHargaJual);

module.exports = poolHargaJual;
