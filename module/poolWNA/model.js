const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const dataKaryawan = require("../dataKaryawan/model");

const poolWNA = sq.define(
  "poolWNA",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorPassport: {
      type: DataTypes.STRING(50),
    },
    nomorKITAS: {
      type: DataTypes.STRING(50),
    },
    nomorIMTA: {
      type: DataTypes.STRING(50),
    },
    masaBerlaku: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

poolWNA.belongsTo(dataKaryawan);
dataKaryawan.hasMany(poolWNA);


module.exports = poolWNA;