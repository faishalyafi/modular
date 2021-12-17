const { DataTypes } = require("sequelize");
const sq = require("../config/connection");
const PO = require("./poModel");
const PR = require("./PRModel");

const poCC = sq.define(
  "poCC",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

poCC.belongsTo(PO);
PO.hasMany(poCC);

poCC.belongsTo(PR);
PR.hasMany(poCC);


module.exports = poCC;
