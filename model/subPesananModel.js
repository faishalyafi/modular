// const { DataTypes } = require("sequelize");
// const sq = require("../config/connection");
// const pesanan= require("./pesananModel");
// const barang = require("./masterBarangModel");

// const subPesanan = sq.define(
//   "subPesanan",
//   {
//     id: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//     },
//     jumlahBarangSubPesanan: {
//       type: DataTypes.DOUBLE,
//     },
//     hargaBeliSubPesanan: {
//       type: DataTypes.DOUBLE,
//     },
//     totalHargaPerBarangPesanan: {
//       type: DataTypes.DOUBLE,
//     },
//   },
//   {
//     paranoid: true,
//     freezeTableName: true,
//   }
// );
// subPesanan.belongsTo(OP,{onDelete:'CASCADE'});
// OP.hasMany(subPesanan);

// subPesanan.belongsTo(barang);
// barang.hasMany(subPesanan);

// module.exports = subPesanan;
