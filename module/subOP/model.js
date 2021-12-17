const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const OP = require("../OP/model");
const barang = require("../masterBarang/model");

const subOP = sq.define(
  "subOP",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    jumlahBarangSubOP: {
      type: DataTypes.DOUBLE,
    },
    hargaBeliOP: {
      type: DataTypes.DOUBLE,
    },
    totalHargaPerBarangOP: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
subOP.belongsTo(OP,{onDelete:'CASCADE'});
OP.hasMany(subOP);

subOP.belongsTo(barang);
barang.hasMany(subOP);

module.exports = subOP;
