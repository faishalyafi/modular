const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const OP = require("../OP/model");
const user =  require("../masterUser/model");

const transaksiOP = sq.define(
  "transaksiOP",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    namaPengirimOP: {
      type: DataTypes.STRING,
    },
    tanggalPengirimanOP: {
      type: DataTypes.DATE,
    },
    nomorDO: {
      type: DataTypes.STRING,
    },
    statusTransaksiOP: {
      type: DataTypes.INTEGER,
    },
    pembatalanTransaksiOP:{
      type: DataTypes.DATE,
    },
    rescheduleId: {
      type: DataTypes.STRING,
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

transaksiOP.belongsTo(OP,{onDelete:'CASCADE'});
OP.hasMany(transaksiOP);

transaksiOP.belongsTo(user);
user.hasMany(transaksiOP);


module.exports = transaksiOP;
