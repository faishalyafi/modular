const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const asuransi = require("../masterAsuransi/model");
const karyawan = require("../dataKaryawan/model");

const poolPotonganAsuransi = sq.define("poolPotonganAsuransi",
    {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorAsuransi: {
      type: DataTypes.STRING,
    },
    potonganAsuransi: {
      type: DataTypes.DOUBLE,
      defaultValue:0
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

poolPotonganAsuransi.belongsTo(asuransi);
asuransi.hasMany(poolPotonganAsuransi);

poolPotonganAsuransi.belongsTo(karyawan);
karyawan.hasMany(poolPotonganAsuransi);

module.exports = poolPotonganAsuransi;
