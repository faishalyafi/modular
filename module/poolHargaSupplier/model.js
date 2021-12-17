const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const suplier = require("../masterSupplier/model");
const barang = require("../masterBarang/model");

const poolHargaSupplier = sq.define(
  "poolHargaSupplier",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    hargaBeli: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

poolHargaSupplier.belongsTo(suplier);
suplier.hasMany(poolHargaSupplier);

poolHargaSupplier.belongsTo(barang);
barang.hasMany(poolHargaSupplier);

module.exports = poolHargaSupplier;
