const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const karyawan =  require("../dataKaryawan/model");

const absensiKaryawan = sq.define(
  "absensiKaryawan",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tglAbsenKaryawan:{
        type:DataTypes.DATE
    },
    ShiftKaryawan:{
      type:DataTypes.STRING
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

absensiKaryawan.belongsTo(karyawan)
karyawan.hasMany(absensiKaryawan)

module.exports = absensiKaryawan;
