// const { DataTypes } = require("sequelize");
// const sq = require("../config/connection");
// const custommer = require("./customerModel");
// const user = require("./userModel");

// const pesanan = sq.define(
//   "pesanan",
//   {
//     id: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//     },
//     nomorPesanan: {
//       type: DataTypes.STRING,
//     },
//     tanggalPesanan: {
//       type: DataTypes.DATE,
//     },
//     metodePembayaranPesanan: {
//       type: DataTypes.STRING,
//     },
//     TOPPesanan: {
//       type: DataTypes.STRING,
//     },
//     keteranganPesanan: {
//       type: DataTypes.STRING,
//     },
//     PPNPesanan: {
//       type: DataTypes.INTEGER,
//     },
//     totalPesanan: {
//       type: DataTypes.DOUBLE,
//     },
//     statusPesanan: {
//         type: DataTypes.INTEGER,
//       }
//   },
//   {
//     paranoid: true,
//     freezeTableName: true,
//   }
// );
// pesanan.belongsTo(custommer);
// custommer.hasMany(pesanan);

// pesanan.belongsTo(user);
// user.hasMany(pesanan);

// module.exports = pesanan;
