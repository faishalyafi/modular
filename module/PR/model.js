const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");
const divisi = require("../masterDivisi/model");

const PR = sq.define(
  "PR",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorPR: {
      type: DataTypes.STRING,
    },
    tanggalPR: {
      type: DataTypes.DATE,
    },
    keteranganPR: {
      type: DataTypes.STRING,
    },
    statusPR:{
      type: DataTypes.INTEGER,
      defaultValue:0    //0:dibuat //1:acc
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

PR.belongsTo(divisi);
divisi.hasMany(PR);
module.exports = PR;
