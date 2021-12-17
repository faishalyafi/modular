const { DataTypes } = require("sequelize");
const sq = require("../config/connection");

const stock = require("../module/stock/model");

const stockKeluar = sq.define(
  "stockKeluar",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tanggalKeluar: {
        type: DataTypes.DATE,
    },keteranganKeluar:{
        type:DataTypes.STRING,
    },jumlahBarangKeluar:{
        type:DataTypes.INTEGER,
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

stockKeluar.belongsTo(stock);
stock.hasMany(stockKeluar);


module.exports = stockKeluar;
