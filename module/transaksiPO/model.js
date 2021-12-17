const { DataTypes } = require("sequelize");
const sq = require("../../config/connection");

const po = require("../PO/model");

const transaksiPO = sq.define(
  "transaksiPO",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nomorInvoice: {
      type: DataTypes.STRING,
    },
    tglKedatangan: {
      type: DataTypes.DATE,
    },
    keterangan: {
      type: DataTypes.STRING,
    }
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

po.hasMany(transaksiPO,{onDelete:'CASCADE'});
transaksiPO.belongsTo(po);

module.exports = transaksiPO;
