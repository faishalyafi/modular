const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");

const barang = require("../../model/masterBarangModel");
const transaksiPO = require("../transaksiPO/model");
const gudang = require("../gudang/model");

const subTransaksiPO = sq.define( 
  "subTransaksiPO",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    hargaTransaksi: {
      type: DataTypes.DOUBLE
    },
    jumlahHargaPerItem: {
      type: DataTypes.DOUBLE
    },
    jumlahBarangSubTransaksiPO: {
      type: DataTypes.DOUBLE
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

subTransaksiPO.belongsTo(barang);
barang.hasMany(subTransaksiPO);

subTransaksiPO.belongsTo(gudang);
gudang.hasMany(subTransaksiPO);

subTransaksiPO.belongsTo(transaksiPO,{onDelete:'CASCADE'});
transaksiPO.hasMany(subTransaksiPO);

module.exports = subTransaksiPO;
