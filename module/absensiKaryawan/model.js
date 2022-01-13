const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const karyawan =  require("../dataKaryawan/model");
const masterIjin =  require("../masterIjin/model");

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
    },
    statusAbsenKaryawan:{
      type:DataTypes.INTEGER,  //0 : berangkat || 1 : cuti/ijin || 2 : sakit || 3 : alfa || 4 : kosong
      defaultValue : 0
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

absensiKaryawan.belongsTo(karyawan);
karyawan.hasMany(absensiKaryawan);

absensiKaryawan.belongsTo(masterIjin);
karyawan.hasMany(masterIjin);

module.exports = absensiKaryawan;
